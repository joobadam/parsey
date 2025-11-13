"use client";

import { useDeleteTransaction } from "@/lib/hooks/use-transactions";
import { Button } from "@/components/ui/Button";
import { AlertCircle } from "lucide-react";

export default function TransactionDeleteDialog({ transaction, isOpen, onClose, onSuccess }) {
  const deleteTransaction = useDeleteTransaction();

  const handleDelete = async () => {
    try {
      await deleteTransaction.mutateAsync(transaction.id);
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-red-100 rounded-lg">
            <AlertCircle className="w-6 h-6 text-red-600" />
          </div>
          <h2 className="text-lg font-bold text-[#171717]">Delete Transaction?</h2>
        </div>

        <p className="text-[#6b6b6f] mb-6">Are you sure you want to delete this transaction? This action cannot be undone.</p>

        <div className="bg-[#f5f0eb] p-3 rounded-lg mb-6">
          <p className="text-sm font-medium text-[#171717]">{transaction?.merchant || transaction?.description}</p>
          <p className="text-sm text-[#6b6b6f] mt-1">${Math.abs(parseFloat(transaction?.amount) || 0).toFixed(2)}</p>
        </div>

        <div className="flex gap-2">
          <Button onClick={onClose} variant="outline" className="flex-1">
            Cancel
          </Button>
          <Button onClick={handleDelete} disabled={deleteTransaction.isPending} className="flex-1 bg-red-600 text-white hover:bg-red-700">
            {deleteTransaction.isPending ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </div>
    </div>
  );
}

