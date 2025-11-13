"use client";

import { Bar, CartesianGrid, ComposedChart, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";

export default function IncomeVsExpenseChart({ transactions, month }) {
  const monthTransactions = transactions?.filter((tx) => tx.date.startsWith(month)) || [];

  const weeks = Array.from({ length: 4 }, (_, i) => {
    const startDay = i * 7 + 1;
    const endDay = (i + 1) * 7;
    return { week: i + 1, startDay, endDay };
  });

  const data = weeks.map(({ week, startDay, endDay }) => {
    const weekTransactions = monthTransactions.filter((tx) => {
      const day = parseInt(tx.date.split("-")[2]);
      return day >= startDay && day <= endDay;
    });

    const income = weekTransactions.filter((tx) => tx.type === "income").reduce((sum, tx) => sum + parseFloat(tx.amount || 0), 0);
    const expenses = weekTransactions.filter((tx) => tx.type === "expense").reduce((sum, tx) => sum + parseFloat(tx.amount || 0), 0);

    return {
      week: `W${week}`,
      income: parseFloat(income.toFixed(2)),
      expenses: parseFloat(expenses.toFixed(2)),
    };
  });

  const chartConfig = {
    income: {
      label: "Income",
      color: "#90D5FF",
    },
    expenses: {
      label: "Expenses",
      color: "#FF6B35",
    },
  };

  return (
    <Card className="bg-white border-[#e8e2db]">
      <CardHeader>
        <CardTitle>Weekly Income vs Expenses</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="w-full h-[280px]">
          <ChartContainer config={chartConfig} className="h-full w-full">
            <ComposedChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e8e2db" />
              <XAxis dataKey="week" tick={{ fill: "#6b6b6f" }} />
              <YAxis tick={{ fill: "#6b6b6f" }} />
              <ChartTooltip content={<ChartTooltipContent formatter={(value) => `$${value.toFixed(2)}`} />} />
              <ChartLegend content={<ChartLegendContent />} wrapperStyle={{ paddingTop: "20px" }} />
              <Bar dataKey="income" fill="#90D5FF" radius={[8, 8, 0, 0]} />
              <Bar dataKey="expenses" fill="#FF6B35" radius={[8, 8, 0, 0]} />
            </ComposedChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
