"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import {
  formatCurrency,
  getCategorySummary,
  getMonthOptions,
} from "@/lib/utils/analytics";

export function CategoryPieChart({ transactions }) {
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

  const monthOptions = getMonthOptions();
  const [selectedRange, setSelectedRange] = useState("current");

  const activeOption = monthOptions.find((opt) => opt.value === selectedRange);

  // FILTER
  const filterTransactions = transactions.filter((t) => {
    if (t.type !== "expense") return false;

    if (!activeOption?.from || !activeOption?.to) return true;

    const date = new Date(t.date);
    if (isNaN(date)) return false;

    return date >= activeOption.from && date <= activeOption.to;
  });

  const chartSource = getCategorySummary(filterTransactions);

  const chartData = chartSource.map((item, index) => ({
    ...item,
    fill: COLORS[index % COLORS.length],
  }));

  return (
    <Card>
      <div className="flex flex-col xs:flex-row xs:items-center justify-between">
        <CardHeader chart={true}>
          <CardTitle>Expenses by Category</CardTitle>
        </CardHeader>
        <div className="flex gap-2 -translate-y-3 xs:translate-0 pl-4 xs:pl-0 xs:pr-4">
          <Select value={selectedRange} onValueChange={setSelectedRange}>
            <SelectTrigger className="w-fit h-fit text-xs px-2 gap-2">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              {monthOptions.map((opt) => (
                <SelectItem className="text-xs" key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      {chartData.length === 0 ? (
        <CardContent className="flex flex-col items-center justify-center py-8">
          <p className="text-muted-foreground mb-4">No data to display.</p>
        </CardContent>
      ) : (
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
                  formatter={(value, name) => [
                    formatCurrency(value),
                    ` ${name}`,
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      )}
    </Card>
  );
}
