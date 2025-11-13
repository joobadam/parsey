"use client";

import { Cell, Pie, PieChart } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";

const COLORS = ["#FF6B35", "#90D5FF", "#FDE5D0", "#1E1E1E", "#F8F8F8", "#FFD7BA", "#000000", "#C3B5FF"];

export default function CategoryPieChart({ transactions, month }) {
  const monthTransactions = transactions?.filter((tx) => tx.date.startsWith(month) && tx.type === "expense") || [];

  const categoryData = monthTransactions.reduce((acc, tx) => {
    const existing = acc.find((item) => item.id === tx.category_id);
    if (existing) {
      existing.value += parseFloat(tx.amount || 0);
    } else {
      acc.push({
        id: tx.category_id,
        name: tx.categories?.name || "Unknown",
        value: parseFloat(tx.amount || 0),
      });
    }
    return acc;
  }, []);

  if (categoryData.length === 0) {
    return (
      <Card className="bg-white border-[#e8e2db]">
        <CardHeader>
          <CardTitle>Expenses by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-[#6b6b6f] py-8">No expense data for this month</p>
        </CardContent>
      </Card>
    );
  }

  const chartConfig = categoryData.reduce((acc, item, index) => {
    acc[item.name] = {
      label: item.name,
      color: COLORS[index % COLORS.length],
    };
    return acc;
  }, {});

  return (
    <Card className="bg-white border-[#e8e2db]">
      <CardHeader>
        <CardTitle>Expenses by Category</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-center p-4">
        <div className="w-full h-[300px] flex items-center justify-center">
          <ChartContainer config={chartConfig} className="h-full w-full">
            <PieChart>
              <ChartTooltip content={<ChartTooltipContent formatter={(value) => `$${value.toFixed(2)}`} />} />
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: $${value.toFixed(2)}`}
                outerRadius={80}
                innerRadius={40}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="#ffffff" strokeWidth={2} />
                ))}
              </Pie>
              <ChartLegend
                content={<ChartLegendContent />}
                wrapperStyle={{ paddingTop: "20px" }}
                verticalAlign="bottom"
              />
            </PieChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
