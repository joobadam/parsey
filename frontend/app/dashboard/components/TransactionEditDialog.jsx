"use client";

import { useState, useEffect } from "react";
import { useCategories } from "@/lib/hooks/use-categories";
import { useUpdateTransaction } from "@/lib/hooks/use-transactions";
import { Button } from "@/components/ui/Button";
import { X } from "lucide-react";

export default function TransactionEditDialog({ transaction, isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    merchant: "",
    amount: "",
    date: "",
    category_id: "",
    type: "expense",
    description: "",
  });
  const [error, setError] = useState("");
  const { data: categories } = useCategories();
  const updateTransaction = useUpdateTransaction();

  useEffect(() => {
    if (transaction && isOpen) {
      setFormData({
        merchant: transaction?.merchant || "",
        amount: transaction?.amount || "",
        date: transaction?.date ? transaction.date.split("T")[0] : new Date().toISOString().split("T")[0],
        category_id: transaction?.category_id || "",
        type: transaction?.type || "expense",
        description: transaction?.description || "",
      });
      setError("");
    }
  }, [transaction, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === "type" && updated.category_id) {
        const filteredCategories = categories?.filter((cat) => cat.type === value);
        if (filteredCategories && filteredCategories.length > 0) {
          if (!filteredCategories.find((cat) => cat.id === updated.category_id)) {
            updated.category_id = "";
          }
        } else {
          updated.category_id = "";
        }
      }
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.category_id || !formData.amount || !formData.date) {
      setError("Please fill in all required fields");
      return;
    }

    try {
      await updateTransaction.mutateAsync({
        id: transaction.id,
        data: {
          merchant: formData.merchant,
          amount: parseFloat(formData.amount),
          date: formData.date,
          category_id: formData.category_id,
          type: formData.type,
          description: formData.description,
        },
      });
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err.message || "Failed to update transaction");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-[#171717]">Edit Transaction</h2>
          <button onClick={onClose} className="p-1 hover:bg-[#f5f0eb] rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-600 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-[#6b6b6f] block mb-1">Merchant</label>
            <input
              type="text"
              name="merchant"
              value={formData.merchant}
              onChange={handleChange}
              placeholder="Enter merchant name"
              className="w-full px-3 py-2 border border-[#e8e2db] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-[#6b6b6f] block mb-1">Amount *</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="0.00"
              step="0.01"
              required
              className="w-full px-3 py-2 border border-[#e8e2db] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-[#6b6b6f] block mb-1">Date *</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-[#e8e2db] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-[#6b6b6f] block mb-1">Category *</label>
            <select
              name="category_id"
              value={formData.category_id}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-[#e8e2db] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
            >
              <option value="">Select a category</option>
              {categories
                ?.filter((cat) => cat.type === formData.type)
                .map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-[#6b6b6f] block mb-1">Type *</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-[#e8e2db] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-[#6b6b6f] block mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Add notes..."
              rows="3"
              className="w-full px-3 py-2 border border-[#e8e2db] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" onClick={onClose} variant="outline" className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={updateTransaction.isPending} className="flex-1 bg-[#FF6B35] text-white hover:bg-[#FF5520]">
              {updateTransaction.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

