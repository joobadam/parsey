"use client";

import { Area, AreaChart, CartesianGrid, ReferenceLine, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";

export default function MonthlyTrendChart({ transactions }) {
  const last12Months = Array.from({ length: 12 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (11 - i));
    return date.toISOString().slice(0, 7);
  });

  const data = last12Months.map((month) => {
    const monthTransactions = transactions?.filter((tx) => tx.date.startsWith(month)) || [];

    const income = monthTransactions.filter((tx) => tx.type === "income").reduce((sum, tx) => sum + parseFloat(tx.amount || 0), 0);
    const expenses = monthTransactions.filter((tx) => tx.type === "expense").reduce((sum, tx) => sum + parseFloat(tx.amount || 0), 0);

    return {
      month: new Date(month).toLocaleString("en-US", { month: "short" }),
      income: parseFloat(income.toFixed(2)),
      expenses: parseFloat(expenses.toFixed(2)),
    };
  });

  const averageIncome = data.reduce((sum, item) => sum + item.income, 0) / data.length;
  const averageExpenses = data.reduce((sum, item) => sum + item.expenses, 0) / data.length;

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
        <CardTitle>12-Month Trend</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="w-full h-[280px]">
          <ChartContainer config={chartConfig} className="h-full w-full">
            <AreaChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e8e2db" />
              <XAxis dataKey="month" tick={{ fill: "#6b6b6f" }} />
              <YAxis tick={{ fill: "#6b6b6f" }} />
              <ChartTooltip content={<ChartTooltipContent formatter={(value) => `$${value.toFixed(2)}`} />} />
              <ChartLegend content={<ChartLegendContent />} wrapperStyle={{ paddingTop: "20px" }} />
              <ReferenceLine
                y={averageIncome}
                stroke="#90D5FF"
                strokeDasharray="5 5"
                strokeWidth={2}
                label={{
                  value: `Avg Income: $${averageIncome.toFixed(2)}`,
                  position: "top",
                  fill: "#90D5FF",
                  fontSize: 12,
                  dy: -5,
                }}
              />
              <ReferenceLine
                y={averageExpenses}
                stroke="#FF6B35"
                strokeDasharray="5 5"
                strokeWidth={2}
                label={{
                  value: `Avg Expenses: $${averageExpenses.toFixed(2)}`,
                  position: "bottom",
                  fill: "#FF6B35",
                  fontSize: 12,
                  dy: -50,
                }}
              />
              <Area type="monotone" dataKey="income" fill="#90D5FF" fillOpacity={0.2} stroke="#90D5FF" strokeWidth={2} />
              <Area type="monotone" dataKey="expenses" fill="#FF6B35" fillOpacity={0.2} stroke="#FF6B35" strokeWidth={2} />
            </AreaChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
