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
import { formatCurrency, getCurrentMonthString } from "@/lib/utils/analytics";

export function BudgetComparisonChart({ budgets, actualSpending }) {
  const chartData = budgets
    .filter((budget) => budget.month === getCurrentMonthString())
    .map((budget) => {
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
    <>
      <Card>
        <CardHeader chart={true}>
          <CardTitle>Budget vs Actual Spending </CardTitle>
          <p className="text-xs text-muted-foreground leading-none">
            This month
          </p>
        </CardHeader>
        <CardContent chart={true}>
          <ChartContainer
            config={{
              budget: {
                label: "Budget",
                color: "var(--color-chart-2)",
              },
              actual: {
                label: "Actual",
                color: "var(--color-chart-4)",
              },
            }}
            className="h-[300px] w-full"
          >
            <ResponsiveContainer
              width="100%"
              height="100%"
              className="-translate-x-3"
            >
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
                  tickFormatter={(value) => `₹${value}`}
                />
                <ChartTooltip
                  content={<ChartTooltipContent />}
                  formatter={(value, name) => [
                    formatCurrency(value),
                    ` ${name}`,
                  ]}
                />
                <Legend />
                <Bar
                  dataKey="actual"
                  fill="var(--color-actual)"
                  name="Actual"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="budget"
                  fill="var(--color-budget)"
                  name="Budget"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </>
  );
}
