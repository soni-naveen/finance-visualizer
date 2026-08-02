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
  Rectangle,
} from "recharts";
import { formatCurrency, getCurrentMonthString } from "@/lib/utils/analytics";

const CustomBar = (props) => {
  const { fill, payload } = props;

  return (
    <Rectangle
      {...props}
      fill={
        payload.actual > payload.budget ? "#ff9999" : fill // Default color
      }
    />
  );
};

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
                color: "#298c8c",
              },
              actual: {
                label: "Actual",
                color: "#9fc8c8",
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
                  shape={<CustomBar />}
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
