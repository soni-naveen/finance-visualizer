"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { formatCurrency } from "@/lib/utils/analytics";

export function CategoryPieChart({ data }) {
  const chartData = data.map((item, index) => ({
    ...item,
    fill: `hsl(${(index * 137.5) % 360}, 100%, 45%)`,
  }));

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader chart={true}>
          <CardTitle>Expenses by Category</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <p className="text-muted-foreground mb-4">No data to display.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader chart={true}>
        <CardTitle>Expenses by Category</CardTitle>
      </CardHeader>
      <CardContent chart={true}>
        <ChartContainer config={{}} className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                fontSize={10}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ category, percent }) =>
                  `${(percent * 100).toFixed(0)}% ${category}`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="total"
                nameKey="category"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <ChartTooltip
                content={<ChartTooltipContent nameKey="category" />}
                formatter={(value, name) => [formatCurrency(value), ` ${name}`]}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
