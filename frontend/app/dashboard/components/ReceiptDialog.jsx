"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/Button";
import { useCreateTransaction } from "@/lib/hooks/use-transactions";
import ReceiptUploadZone from "./ReceiptUploadZone";
import ReceiptManualForm from "./ReceiptManualForm";

export default function ReceiptDialog({ isOpen, onClose }) {
  const createTransaction = useCreateTransaction();
  const [activeTab, setActiveTab] = useState("upload");
  const [formData, setFormData] = useState(null);
  const [hasData, setHasData] = useState(false);

  const handleFormDataChange = (data) => {
    setFormData(data);
    setHasData(!!data);
  };

  const handleSave = async () => {
    // Validáció
    if (!formData?.category_id) {
      alert("Please select a category");
      return;
    }

    if (!formData?.merchant || formData.merchant.trim() === "") {
      alert("Please enter a merchant name");
      return;
    }

    // ⚠️ Amount validáció: NEM kell > 0, lehet 0 is (manual entry)
    // De ha OCR-ből jön, valószínűleg hiba, ha 0
    if (formData.amount <= 0 && formData.ai_categorized) {
      alert("Amount should be greater than 0. Please edit manually.");
      return;
    }

    if (!formData?.date) {
      alert("Please select a date");
      return;
    }

    try {
      await createTransaction.mutateAsync({
        category_id: formData.category_id,
        type: formData.type || "expense",
        amount: parseFloat(formData.amount) || 0,
        description: formData.description || "",
        merchant: formData.merchant.trim(),
        date: formData.date,
        ai_categorized: formData.ai_categorized || false,
        ai_confidence: formData.ai_confidence || null,
      });

      handleClose();
    } catch (error) {
      console.error("Save error:", error);
      alert("Failed to save transaction");
    }
  };

  const handleClose = () => {
    setFormData({
      merchant: "",
      amount: "",
      date: new Date().toISOString().split("T")[0],
      category_id: "",
      type: "expense",
      description: "",
    });
    setHasData(false);
    setActiveTab("upload");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Transaction</DialogTitle>
          <DialogDescription>
            Upload a receipt or manually enter transaction details
          </DialogDescription>
        </DialogHeader>

        {formData?.ai_categorized && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-blue-700">
                ✨ AI Extracted & Categorized
              </span>
              {formData.ai_confidence && (
                <span className="text-xs text-blue-600 font-medium">
                  {Math.round(formData.ai_confidence * 100)}% confident
                </span>
              )}
            </div>
          </div>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload">Upload Receipt</TabsTrigger>
            <TabsTrigger value="manual">Manual Entry</TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-4">
            <ReceiptUploadZone onFormDataChange={handleFormDataChange} />
          </TabsContent>

          <TabsContent value="manual" className="space-y-4">
            <ReceiptManualForm onFormDataChange={handleFormDataChange} />
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSave}
            disabled={createTransaction.isPending || !hasData}
            className="bg-[#FF6B35] text-white hover:bg-[#FF5520]"
          >
            {createTransaction.isPending ? "Saving..." : "Save Transaction"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

