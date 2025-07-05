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
  const chartData = budgets.map((budget) => {
    const actual =
      actualSpending.find((a) => a.category === budget.category)?.total || 0;
    return {
      category: budget.category,
      budget: budget.amount,
      actual: actual,
      remaining: Math.max(0, budget.amount - actual),
    };
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Budget vs Actual Spending</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            budget: {
              label: "Budget",
              color: "hsl(var(--chart-1))",
            },
            actual: {
              label: "Actual",
              color: "hsl(var(--chart-2))",
            },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis
                dataKey="category"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${value}`}
              />
              <ChartTooltip
                content={<ChartTooltipContent />}
                formatter={(value, name) => [formatCurrency(value), name]}
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
