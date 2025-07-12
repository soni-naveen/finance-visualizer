"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { formatCurrency } from "@/lib/utils/analytics";

export function CategoryPieChart({ data }) {
  const COLORS = [
    "#4F46E5", // Indigo
    "#EF4444", // Red
    "#10B981", // Green
    "#00FF00", // bright green
    "#8B5CF6", // Violet
    "#FFD700", // Yellow
    "#22D3EE", // Cyan
    "#FF1493", // Magenta
    "#C0C0C0", // Gray,
    "#F97316", // Orange
    "#84CC16", // Lime
  ];

  const chartData = data.map((item, index) => ({
    ...item,
    fill: COLORS[index % COLORS.length],
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
                fontSize={12}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="total"
                nameKey="category"
                className="-translate-y-2"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <ChartLegend
                content={<ChartLegendContent nameKey="category" />}
                className="max-w-full sm:max-w-[90%] lg:max-w-full xl:max-w-[90%] mx-auto flex flex-wrap justify-center gap-x-4 leading-0 sm:leading-none"
              />
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
