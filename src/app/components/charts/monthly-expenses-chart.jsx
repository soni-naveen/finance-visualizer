"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { formatCurrency, formatMonth } from "@/lib/utils/analytics";

export function MonthlyExpensesChart({ data }) {
  const chartData = data.map((item) => ({
    ...item,
    monthLabel: formatMonth(item.month),
  }));

  return (
    <Card>
      <CardHeader chart={true}>
        <CardTitle>Monthly Expenses</CardTitle>
      </CardHeader>
      <CardContent chart={true}>
        <ChartContainer
          config={{
            expenses: {
              label: "Expenses",
              color: "var(--color-chart-1)",
            },
          }}
          className="h-[300px] w-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis
                dataKey="monthLabel"
                fontSize={12}
                tickLine={false}
                axisLine={true}
              />
              <YAxis
                fontSize={12}
                tickLine={false}
                axisLine={true}
                tickFormatter={(value) => `$${value}`}
              />
              <ChartTooltip
                content={<ChartTooltipContent />}
                formatter={(value) => [formatCurrency(value), " Expenses"]}
              />
              <Bar
                dataKey="expenses"
                fill="var(--color-expenses)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
