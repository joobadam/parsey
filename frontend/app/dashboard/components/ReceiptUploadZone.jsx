"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { CloudUpload, Loader2, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useCategories } from "@/lib/hooks/use-categories";
import { useReceiptOCR } from "@/lib/hooks/use-receipt-ocr";

export default function ReceiptUploadZone({ onFormDataChange }) {
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const { processReceipt, isProcessing, progress } = useReceiptOCR();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [formData, setFormData] = useState(null);
  const [confidence, setConfidence] = useState(null);
  const [processedData, setProcessedData] = useState(null);

  const onDrop = useCallback(
    async (acceptedFiles, rejectedFiles) => {
      setError(null);

      if (rejectedFiles.length > 0) {
        const rejection = rejectedFiles[0];
        if (rejection.errors[0]?.code === "file-too-large") {
          setError("File size exceeds 5MB limit");
        } else if (rejection.errors[0]?.code === "file-invalid-type") {
          setError("Invalid file type. Supported: JPG, PNG, WEBP");
        } else {
          setError("File upload failed");
        }
        return;
      }

      if (acceptedFiles.length > 0) {
        setIsLoading(true);
        const file = acceptedFiles[0];

        if (!file.type.startsWith("image/")) {
          setError("Please upload an image file");
          setIsLoading(false);
          return;
        }

        if (file.size > 5 * 1024 * 1024) {
          setError("File size must be less than 5MB");
          setIsLoading(false);
          return;
        }

        const url = URL.createObjectURL(file);
        setUploadedFile(file);
        setPreviewUrl(url);
        setFormData(null);
        setProcessedData(null);
        setConfidence(null);
        await new Promise((resolve) => setTimeout(resolve, 500));
        setIsLoading(false);
      }
    },
    []
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/webp": [".webp"],
    },
    maxSize: 5 * 1024 * 1024,
    multiple: false,
  });

  const handleRemoveFile = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setUploadedFile(null);
    setPreviewUrl(null);
    setFormData(null);
    setConfidence(null);
    setProcessedData(null);
    setError(null);
    onFormDataChange(null);
  };

  const handleProcessReceipt = async () => {
    if (!uploadedFile) {
      setError("No file selected");
      return;
    }

    setError("");

    try {
      const extractedData = await processReceipt(uploadedFile);

      console.log("Extracted data:", extractedData);

      // ezt még megnézni mert nem jól műkdöik???
      const selectedCategory = categories?.find(
        (c) =>
          c.name.toLowerCase() ===
          extractedData.suggestedCategory?.toLowerCase()
      ) || categories?.find((c) => c.type === "expense");

      console.log("Selected category:", selectedCategory);

      const newFormData = {
        merchant: extractedData.merchant,
        amount: extractedData.amount,
        date: new Date().toISOString().split("T")[0],
        category_id: selectedCategory?.id || "",
        type: "expense",
        description: extractedData.items.join(", ") || "",
        ai_categorized: true,
        ai_confidence: extractedData.categoryConfidence || extractedData.confidence,
        rawText: extractedData.rawText,
      };

      setFormData(newFormData);
      setConfidence(extractedData.categoryConfidence || extractedData.confidence);
      setProcessedData(extractedData);
      onFormDataChange(newFormData);
    } catch (err) {
      console.error("OCR error:", err);
      setError("Failed to process receipt. Please try again or enter manually.");
    }
  };

  const handleFormChange = (key, value) => {
    const updated = { ...formData, [key]: value };
    setFormData(updated);
    onFormDataChange(updated);
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  const isImage = uploadedFile?.type?.startsWith("image/");

  return (
    <div className="space-y-4">
      {!uploadedFile && (
        <div
          {...getRootProps()}
          className={cn(
            "bg-white rounded-xl border-2 border-dashed transition-all duration-200 cursor-pointer",
            isDragActive
              ? "border-[var(--color-primary)] bg-[var(--color-primary)]/5"
              : "border-[var(--color-primary)]/50 hover:border-[var(--color-primary)] hover:bg-[var(--color-background)]",
            error && "border-red-500"
          )}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center p-12 text-center">
            {isLoading ? (
              <>
                <Loader2 className="w-12 h-12 text-[var(--color-primary)] animate-spin mb-4" />
                <p className="text-base font-medium text-[var(--color-foreground)]">
                  Processing receipt...
                </p>
              </>
            ) : (
              <>
                <CloudUpload className="w-12 h-12 text-[var(--color-primary)] mb-4" />
                <p className="text-base font-medium text-[var(--color-foreground)] mb-2">
                  Drag and drop your receipt here or click to select
                </p>
                <p className="text-sm text-[var(--color-foreground-secondary)]">
                  Supported formats: JPG, PNG, WEBP (Max 5MB)
                </p>
                {error && (
                  <p className="text-sm text-red-600 mt-4 font-medium">{error}</p>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {uploadedFile && !processedData && (
        <div className="bg-white rounded-xl border border-[var(--color-card-border)] p-4">
          {uploadedFile && !processedData && (
            <div className="mb-4">
              <img
                src={previewUrl}
                alt="Receipt preview"
                className="w-full max-h-64 object-cover rounded-lg"
              />
            </div>
          )}
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <p className="font-medium text-[var(--color-foreground)]">{uploadedFile.name}</p>
              <p className="text-sm text-[var(--color-foreground-secondary)]">
                {formatFileSize(uploadedFile.size)}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleRemoveFile}
                className="p-2 hover:bg-[var(--color-background)] rounded-lg transition-colors"
                aria-label="Remove file"
              >
                <X className="w-5 h-5 text-[var(--color-foreground-secondary)]" />
              </button>
              {isProcessing ? (
                <Button variant="primary" disabled>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </Button>
              ) : (
                <Button variant="primary" onClick={handleProcessReceipt}>
                  Process Receipt
                </Button>
              )}
            </div>
          </div>
          {isProcessing && (
            <div className="flex flex-col items-center justify-center py-8 mt-4">
              <Loader2 className="w-8 h-8 text-[#FF6B35] animate-spin mb-3" />
              <p className="text-[#6b6b6f] text-sm">Processing receipt...</p>
              <div className="mt-3 w-full max-w-xs bg-[#e8e2db] rounded-full h-2">
                <div
                  className="bg-[#FF6B35] h-2 rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="text-xs text-[#6b6b6f] mt-2">{progress}%</p>
            </div>
          )}
        </div>
      )}

      {formData && (
        <div className="bg-white rounded-xl border border-[var(--color-card-border)] p-6 space-y-4">
          {confidence && (
            <div className="flex justify-center">
              <Badge
                variant="outline"
                className={
                  Math.round(confidence * 100) >= 80
                    ? "bg-green-100 text-green-800 border-green-200"
                    : "bg-yellow-100 text-yellow-800 border-yellow-200"
                }
              >
                AI Confidence: {Math.round(confidence * 100)}%
              </Badge>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-[var(--color-foreground-secondary)] mb-2">
              Merchant
            </label>
            <Input
              value={formData.merchant}
              onChange={(e) => handleFormChange("merchant", e.target.value)}
              className="w-full"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--color-foreground-secondary)] mb-2">
                Amount
              </label>
              <Input
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => handleFormChange("amount", e.target.value)}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--color-foreground-secondary)] mb-2">
                Date
              </label>
              <Input
                type="date"
                value={formData.date}
                onChange={(e) => handleFormChange("date", e.target.value)}
                className="w-full"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--color-foreground-secondary)] mb-2">
                Category
              </label>
              <Select
                value={formData.category_id || ""}
                onValueChange={(value) => handleFormChange("category_id", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={categoriesLoading ? "Loading categories..." : "Select a category"} />
                </SelectTrigger>
                <SelectContent>
                  {categoriesLoading ? (
                    <SelectItem value="" disabled>Loading categories...</SelectItem>
                  ) : (
                    categories
                      ?.filter((cat) => cat.type === formData.type || cat.type === "expense")
                      .map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))
                  )}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--color-foreground-secondary)] mb-2">
                Type
              </label>
              <Select
                value={formData.type}
                onValueChange={(value) => handleFormChange("type", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="expense">Expense</SelectItem>
                  <SelectItem value="income">Income</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-foreground-secondary)] mb-2">
              Description
            </label>
            <Textarea
              value={formData.description}
              onChange={(e) => handleFormChange("description", e.target.value)}
              className="w-full"
              rows={3}
            />
          </div>
        </div>
      )}
    </div>
  );
}

