"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function MonthlySelector({ currentMonth, onMonthChange }) {
  const month = new Date(currentMonth);
  const monthName = month.toLocaleString("en-US", { month: "long", year: "numeric" });

  const handlePrevMonth = () => {
    const prev = new Date(month);
    prev.setMonth(prev.getMonth() - 1);
    onMonthChange(prev.toISOString().slice(0, 7));
  };

  const handleNextMonth = () => {
    const next = new Date(month);
    next.setMonth(next.getMonth() + 1);
    onMonthChange(next.toISOString().slice(0, 7));
  };

  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-3xl font-bold text-[#171717]">Dashboard</h1>
      <div className="flex items-center gap-2">
        <Button onClick={handlePrevMonth} variant="outline" size="sm" className="p-2 ml-4">
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <span className="w-40 text-center font-semibold text-[#171717]">{monthName}</span>
        <Button onClick={handleNextMonth} variant="outline" size="sm" className="p-2">
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

