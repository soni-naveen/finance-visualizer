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
import { Button } from "../ui/button";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { formatCurrency } from "@/lib/utils/analytics";

export function CategoryPieChart({ overall, monthly }) {
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

  const [activeView, setActiveView] = useState("monthly");

  const selectedData = activeView === "overall" ? overall : monthly;

  const chartData = selectedData.map((item, index) => ({
    ...item,
    fill: COLORS[index % COLORS.length],
  }));

  if (selectedData.length === 0) {
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
      <div className="flex flex-col xs:flex-row xs:items-center justify-between">
        <CardHeader chart={true}>
          <CardTitle>Expenses by Category</CardTitle>
        </CardHeader>
        <div className="flex gap-2 -translate-y-3 xs:translate-0 pl-4 xs:pl-0 xs:pr-4">
          <Button
            variant={activeView === "overall" ? "default" : "outline"}
            size="sm"
            className="text-xs leading-none"
            onClick={() => setActiveView("overall")}
          >
            Overall
          </Button>
          <Button
            variant={activeView === "monthly" ? "default" : "outline"}
            size="sm"
            className="text-xs leading-none"
            onClick={() => setActiveView("monthly")}
          >
            This month
          </Button>
        </div>
      </div>
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
