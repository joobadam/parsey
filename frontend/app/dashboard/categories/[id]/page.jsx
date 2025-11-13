"use client";

import { useParams, useRouter } from "next/navigation";
import { useCategories } from "@/lib/hooks/use-categories";
import { useTransactions } from "@/lib/hooks/use-transactions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft } from "lucide-react";
import { CategoryIcon } from "@/lib/utils/icon-map";

export default function CategoryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const categoryId = params.id;

  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const { data: allTransactions, isLoading: transactionsLoading } = useTransactions({ month: null });

  const category = categories?.find((c) => c.id === categoryId);
  const categoryTransactions =
    allTransactions?.filter((tx) => tx.category_id === categoryId) || [];

  if (categoriesLoading) {
    return (
      <div className="flex flex-col gap-6 p-4 md:p-6">
        <Skeleton className="h-12 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!category) {
    return (
      <div className="flex flex-col gap-6 p-4 md:p-6">
        <div className="text-center py-12">
          <p className="text-[#6b6b6f] mb-4">Category not found</p>
          <Button onClick={() => router.back()} variant="outline">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const totalAmount = categoryTransactions.reduce(
    (sum, tx) => sum + Math.abs(tx.amount),
    0
  );
  const count = categoryTransactions.length;

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          onClick={() => router.back()}
          variant="outline"
          size="sm"
          className="p-2"
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-[#171717]">{category.name}</h1>
          <p className="text-[#6b6b6f]">
            {count} transactions • ${totalAmount.toFixed(2)}
          </p>
        </div>
        <div className="ml-auto">
          <CategoryIcon icon={category.icon} size={10} />
        </div>
      </div>

      {/* Stats Card */}
      <Card className="bg-white border-[#e8e2db]">
        <CardContent className="p-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-[#6b6b6f] mb-1">Total Amount</p>
              <p className="text-2xl font-bold text-[#171717]">
                ${totalAmount.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-sm text-[#6b6b6f] mb-1">Transactions</p>
              <p className="text-2xl font-bold text-[#171717]">{count}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transactions List */}
      <Card className="bg-white border-[#e8e2db]">
        <CardHeader>
          <CardTitle>Transactions in {category.name}</CardTitle>
        </CardHeader>
        <CardContent>
          {transactionsLoading ? (
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : categoryTransactions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-[#6b6b6f]">No transactions in this category</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {categoryTransactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between p-3 border border-[#e8e2db] rounded-lg hover:bg-[#f5f0eb] transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[#171717] truncate">
                      {tx.merchant || tx.description || "Transaction"}
                    </p>
                    <p className="text-sm text-[#6b6b6f] truncate">
                      {new Date(tx.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right ml-4">
                    <p
                      className={`font-semibold ${
                        tx.type === "income"
                          ? "text-sky-300"
                          : "text-red-600"
                      }`}
                    >
                      {tx.type === "income" ? "+" : "-"}
                      ${Math.abs(tx.amount).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Back Button */}
      <Button onClick={() => router.back()} variant="outline" className="w-full">
        Back to Categories
      </Button>
    </div>
  );
}

