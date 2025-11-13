"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/Card";
import { CategoryIcon } from "@/lib/utils/icon-map";

export default function TransactionsTable({ transactions }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  if (transactions.length === 0) {
    return (
      <Card className="p-12 text-center">
        <p className="text-lg text-[var(--color-foreground-secondary)]">No transactions found</p>
      </Card>
    );
  }

  return (
    <>
      <div className="hidden md:block overflow-x-auto">
        <div className="bg-white rounded-xl border border-[var(--color-card-border)] overflow-hidden">
          <table className="w-full">
            <thead className="bg-[var(--color-background)] border-b border-[var(--color-card-border)]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[var(--color-foreground-secondary)] uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[var(--color-foreground-secondary)] uppercase tracking-wider">
                  Merchant
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[var(--color-foreground-secondary)] uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[var(--color-foreground-secondary)] uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-[var(--color-foreground-secondary)] uppercase tracking-wider">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-card-border)]">
              {transactions.map((transaction) => (
                <tr
                  key={transaction.id}
                  className="hover:bg-[var(--color-background)] transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <CategoryIcon icon={transaction.icon} size={6} />
                      <span className="text-sm font-medium text-[var(--color-foreground)]">
                        {transaction.category}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-[var(--color-foreground)]">
                      {transaction.merchant}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-[var(--color-foreground-secondary)]">
                      {formatDate(transaction.date)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge
                      variant="outline"
                      className={
                        transaction.type === "income"
                          ? "bg-sky-100 text-sky-800 border-sky-200 hover:bg-sky-100"
                          : "bg-red-100 text-red-800 border-red-200 hover:bg-red-100"
                      }
                    >
                      {transaction.type === "income" ? "Income" : "Expense"}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div
                      className={`text-sm font-semibold ${
                        transaction.amount > 0 ? "text-sky-300" : "text-red-600"
                      }`}
                    >
                      {formatAmount(transaction.amount)}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="md:hidden space-y-3">
        {transactions.map((transaction) => (
          <Card key={transaction.id} className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <CategoryIcon icon={transaction.icon} size={6} />
                <div>
                  <div className="font-medium text-[var(--color-foreground)]">
                    {transaction.merchant}
                  </div>
                  <div className="text-sm text-[var(--color-foreground-secondary)]">
                    {transaction.category}
                  </div>
                </div>
              </div>
              <div
                className={`text-right font-semibold ${
                  transaction.amount > 0 ? "text-sky-300" : "text-red-600"
                }`}
              >
                {formatAmount(transaction.amount)}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm text-[var(--color-foreground-secondary)]">
                {formatDate(transaction.date)}
              </div>
              <Badge
                variant="outline"
                className={
                  transaction.type === "income"
                    ? "bg-sky-100 text-sky-800 border-sky-200 hover:bg-sky-100"
                    : "bg-red-100 text-red-800 border-red-200 hover:bg-red-100"
                }
              >
                {transaction.type === "income" ? "Income" : "Expense"}
              </Badge>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}

