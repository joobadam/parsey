"use client";

import { useState } from "react";
import { useTransactions } from "@/lib/hooks/use-transactions";
import { useCategories } from "@/lib/hooks/use-categories";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/Button";
import { Edit2, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import TransactionEditDialog from "../components/TransactionEditDialog";
import TransactionDeleteDialog from "../components/TransactionDeleteDialog";
import { CategoryIcon } from "@/lib/utils/icon-map";

export default function TransactionsPage() {
  const [filters, setFilters] = useState({
    month: (() => {
      const now = new Date();
      return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    })(),
    category: "all",
    type: "all",
  });
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const { data: transactions, isLoading } = useTransactions(filters);
  const { data: categories } = useCategories();

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const handleMonthChange = (offset) => {
    const date = new Date(filters.month);
    date.setMonth(date.getMonth() + offset);
    const newMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    handleFilterChange("month", newMonth);
  };

  const paginatedTransactions = transactions?.slice((page - 1) * pageSize, page * pageSize) || [];

  const totalPages = Math.ceil((transactions?.length || 0) / pageSize);

  const monthName = new Date(filters.month).toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  });

  const handleEditClick = (tx) => {
    setSelectedTransaction(tx);
    setEditDialogOpen(true);
  };

  const handleDeleteClick = (tx) => {
    setSelectedTransaction(tx);
    setDeleteDialogOpen(true);
  };

  const handleSuccess = () => {
    setSelectedTransaction(null);
  };

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-[#171717]">Transactions</h1>
      </div>

      <Card className="bg-white border-[#e8e2db]">
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div>
              <label className="text-sm font-medium text-[#6b6b6f] block mb-2">Month</label>
              <div className="flex items-center gap-2">
                <Button onClick={() => handleMonthChange(-1)} variant="outline" size="sm" className="p-2">
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="min-w-[120px] text-center text-sm font-medium">{monthName}</span>
                <Button onClick={() => handleMonthChange(1)} variant="outline" size="sm" className="p-2">
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-[#6b6b6f] block mb-2">Category</label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange("category", e.target.value)}
                className="w-full px-3 py-2 border border-[#e8e2db] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
              >
                <option value="all">All Categories</option>
                {categories?.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-[#6b6b6f] block mb-2">Type</label>
              <select
                value={filters.type}
                onChange={(e) => handleFilterChange("type", e.target.value)}
                className="w-full px-3 py-2 border border-[#e8e2db] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
              >
                <option value="all">All Types</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-[#6b6b6f] block mb-2">Results</label>
              <div className="text-sm font-medium text-[#171717] pt-2">{transactions?.length || 0} transactions</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white border-[#e8e2db]">
        <CardHeader>
          <CardTitle>All Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-16 rounded-lg" />
              ))}
            </div>
          ) : !transactions || transactions.length === 0 ? (
            <p className="text-center text-[#6b6b6f] py-8">No transactions found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#e8e2db]">
                    <th className="text-left py-3 px-4 font-semibold text-[#171717]">Date</th>
                    <th className="text-left py-3 px-4 font-semibold text-[#171717]">Description</th>
                    <th className="text-left py-3 px-4 font-semibold text-[#171717]">Category</th>
                    <th className="text-left py-3 px-4 font-semibold text-[#171717]">Type</th>
                    <th className="text-right py-3 px-4 font-semibold text-[#171717]">Amount</th>
                    <th className="text-center py-3 px-4 font-semibold text-[#171717]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedTransactions.map((tx) => (
                    <tr key={tx.id} className="border-b border-[#e8e2db] hover:bg-[#f5f0eb]">
                      <td className="py-3 px-4 text-sm text-[#171717]">{new Date(tx.date).toLocaleDateString()}</td>
                      <td className="py-3 px-4 text-sm text-[#171717]">{tx.merchant || tx.description || "—"}</td>
                      <td className="py-3 px-4 text-sm text-[#171717]">
                        <div className="flex items-center gap-2">
                          <CategoryIcon icon={tx.categories?.icon} size={5} />
                          {tx.categories?.name}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm">
                        <Badge
                          variant={tx.type === "income" ? "default" : "destructive"}
                          className={tx.type === "income" ? "bg-sky-100 text-sky-800" : "bg-red-100 text-red-800"}
                        >
                          {tx.type}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-sm font-semibold text-right">
                        <span className={tx.type === "income" ? "text-sky-300" : "text-red-600"}>
                          {tx.type === "income" ? "+" : "-"}${Math.abs(parseFloat(tx.amount) || 0).toFixed(2)}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button onClick={() => handleEditClick(tx)} className="p-2 hover:bg-[#e8e2db] rounded-lg transition-colors">
                            <Edit2 className="w-4 h-4 text-[#FF6B35]" />
                          </button>
                          <button onClick={() => handleDeleteClick(tx)} className="p-2 hover:bg-[#e8e2db] rounded-lg transition-colors">
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-[#e8e2db]">
                <div className="text-sm text-[#6b6b6f]">
                  Page {page} of {totalPages}
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} variant="outline" size="sm">
                    Previous
                  </Button>
                  <Button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} variant="outline" size="sm">
                    Next
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedTransaction && (
        <>
          <TransactionEditDialog
            transaction={selectedTransaction}
            isOpen={editDialogOpen}
            onClose={() => {
              setEditDialogOpen(false);
              setSelectedTransaction(null);
            }}
            onSuccess={handleSuccess}
          />
          <TransactionDeleteDialog
            transaction={selectedTransaction}
            isOpen={deleteDialogOpen}
            onClose={() => {
              setDeleteDialogOpen(false);
              setSelectedTransaction(null);
            }}
            onSuccess={handleSuccess}
          />
        </>
      )}
    </div>
  );
}

