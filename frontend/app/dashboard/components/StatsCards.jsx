"use client";

import { TrendingUp, TrendingDown, Wallet } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { useTransactions } from "@/lib/hooks/use-transactions";
import { Skeleton } from "@/components/ui/skeleton";

export default function StatsCards({ month }) {
  const { data: transactions, isLoading } = useTransactions({ month });

  const stats = {
    income: 0,
    expenses: 0,
    balance: 0,
  };

  if (transactions && transactions.length > 0) {
    transactions.forEach((tx) => {
      if (tx.type === "income") {
        stats.income += parseFloat(tx.amount) || 0;
      } else {
        stats.expenses += parseFloat(tx.amount) || 0;
      }
    });
    stats.balance = stats.income - stats.expenses;
  }

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-3 mb-6">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-32 rounded-lg" />
        ))}
      </div>
    );
  }

  const incomeChange = "+12.5%";
  const expensesChange = "+5.2%";
  const balanceChange = stats.balance > 0 ? "+7.3%" : "-2.1%";

  return (
    <div className="grid gap-6 md:grid-cols-3 mb-6">
      <Card className="bg-white border-[#e8e2db]">
        <div className="pb-2">
          <p className="text-sm font-medium text-[#6b6b6f]">Total Income</p>
        </div>
        <div className="mt-4">
          <div className="flex items-end justify-between">
            <div>
              <div className="text-2xl font-bold text-[#171717]">${stats.income.toFixed(2)}</div>
              <p className="text-xs text-sky-300 mt-1">{incomeChange} from last month</p>
            </div>
            <TrendingUp className="w-6 h-6 text-[#FF6B35]" />
          </div>
        </div>
      </Card>

      <Card className="bg-white border-[#e8e2db]">
        <div className="pb-2">
          <p className="text-sm font-medium text-[#6b6b6f]">Total Expenses</p>
        </div>
        <div className="mt-4">
          <div className="flex items-end justify-between">
            <div>
              <div className="text-2xl font-bold text-[#171717]">${stats.expenses.toFixed(2)}</div>
              <p className="text-xs text-sky-300 mt-1">{expensesChange} from last month</p>
            </div>
            <TrendingDown className="w-6 h-6 text-[#FF6B35]" />
          </div>
        </div>
      </Card>

      <Card className="bg-white border-[#e8e2db]">
        <div className="pb-2">
          <p className="text-sm font-medium text-[#6b6b6f]">Balance</p>
        </div>
        <div className="mt-4">
          <div className="flex items-end justify-between">
            <div>
              <div className={`text-2xl font-bold ${stats.balance >= 0 ? "text-sky-300" : "text-red-600"}`}>
                ${stats.balance.toFixed(2)}
              </div>
              <p className={`text-xs ${stats.balance >= 0 ? "text-sky-300" : "text-red-600"} mt-1`}>
                {balanceChange} from last month
              </p>
            </div>
            <Wallet className="w-6 h-6 text-[#FF6B35]" />
          </div>
        </div>
      </Card>
    </div>
  );
}


