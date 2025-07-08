"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Legend,
} from "recharts";
import { formatCurrency } from "@/lib/utils/analytics";

export function BudgetComparisonChart({ budgets, actualSpending }) {
  const allCategories = Array.from(
    new Set([
      ...budgets.map((b) => b.category),
      ...actualSpending.map((a) => a.category),
    ])
  );

  const chartData = allCategories.map((category) => {
    const budget = budgets.find((b) => b.category === category)?.amount || 0;
    const actual =
      actualSpending.find((a) => a.category === category)?.total || 0;
    return {
      category,
      budget,
      actual,
      remaining: Math.max(0, budget - actual),
    };
  });

  return (
    <Card>
      <CardHeader chart={true}>
        <CardTitle>Budget vs Actual Spending</CardTitle>
      </CardHeader>
      <CardContent chart={true}>
        <ChartContainer
          config={{
            budget: {
              label: "Budget",
              color: "var(--color-chart-3)",
            },
            actual: {
              label: "Actual",
              color: "var(--color-chart-1)",
            },
          }}
          className="h-[300px] w-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis
                dataKey="category"
                fontSize={11}
                tickLine={false}
                axisLine={true}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis
                fontSize={11}
                tickLine={false}
                axisLine={true}
                tickFormatter={(value) => `$${value}`}
              />
              <ChartTooltip
                content={<ChartTooltipContent />}
                formatter={(value, name) => [formatCurrency(value), ` ${name}`]}
              />
              <Legend />
              <Bar
                dataKey="budget"
                fill="var(--color-budget)"
                name="Budget"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="actual"
                fill="var(--color-actual)"
                name="Actual"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
