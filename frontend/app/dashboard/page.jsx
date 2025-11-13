"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useTransactions } from "@/lib/hooks/use-transactions";
import MonthlySelector from "./components/MonthlySelector";
import StatsCards from "./components/StatsCards";
import RecentTransactions from "./components/RecentTransactions";
import ReceiptDialog from "./components/ReceiptDialog";
import MonthlyTrendChart from "./components/MonthlyTrendChart";
import CategoryPieChart from "./components/CategoryPieChart";
import IncomeVsExpenseChart from "./components/IncomeVsExpenseChart";

export default function DashboardPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });

  const { data: allTransactions } = useTransactions({ month: null });

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <div className="flex items-center justify-between">
        <MonthlySelector currentMonth={currentMonth} onMonthChange={setCurrentMonth} />
        <Button variant="primary" onClick={() => setIsDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          New Receipt
        </Button>
      </div>
      <StatsCards month={currentMonth} />
      <div className="grid gap-6 lg:grid-cols-2">
        <MonthlyTrendChart transactions={allTransactions} />
        <IncomeVsExpenseChart transactions={allTransactions} month={currentMonth} />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <CategoryPieChart transactions={allTransactions} month={currentMonth} />
        <RecentTransactions month={currentMonth} />
      </div>
      <ReceiptDialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} />
    </div>
  );
}


