"use client";

import { Card } from "@/components/ui/Card";
import { useTransactions } from "@/lib/hooks/use-transactions";
import { Skeleton } from "@/components/ui/skeleton";
import { CategoryIcon } from "@/lib/utils/icon-map";

export default function RecentTransactions({ month }) {
  const { data: transactions, isLoading } = useTransactions({ month });

  if (isLoading) {
    return (
      <Card className="bg-white border-[#e8e2db]">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-[#171717] mb-4">Recent Transactions</h2>
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-12 rounded-lg" />
            ))}
          </div>
        </div>
      </Card>
    );
  }

  if (!transactions || transactions.length === 0) {
    return (
      <Card className="bg-white border-[#e8e2db]">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-[#171717] mb-4">Recent Transactions</h2>
          <p className="text-center text-[#6b6b6f] py-8">No transactions yet</p>
        </div>
      </Card>
    );
  }

  const recentTransactions = transactions.slice(0, 10);

  return (
    <Card className="bg-white border-[#e8e2db]">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-[#171717] mb-4">Recent Transactions</h2>
        <div className="space-y-2 max-h-[300px] overflow-y-auto">
          {recentTransactions.map((tx) => (
            <div
              key={tx.id}
              className="flex items-center justify-between p-2 border border-[#e8e2db] rounded-lg hover:bg-[#f5f0eb] transition-colors text-sm"
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <CategoryIcon icon={tx.categories?.icon} size={5} />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[#171717] truncate">{tx.merchant || tx.description || "Transaction"}</p>
                  <p className="text-xs text-[#6b6b6f] truncate">{tx.categories?.name || "Uncategorized"}</p>
                </div>
              </div>
              <span className={`font-semibold ml-2 whitespace-nowrap ${tx.type === "income" ? "text-sky-300" : "text-red-600"}`}>
                {tx.type === "income" ? "+" : "-"}${Math.abs(parseFloat(tx.amount) || 0).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}


