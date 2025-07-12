"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { Trash2 } from "lucide-react";
import { deleteAllBudgets } from "@/lib/actions/budgets";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";

export function BudgetComparisonChart({ budgets, actualSpending }) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

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

  const handleDeleteAll = async () => {
    setLoading(true);
    try {
      const result = await deleteAllBudgets();
      if (result.success) {
        toast({
          title: "Budgets deleted successfully",
        });
      } else {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete budgets",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Card>
        <CardHeader chart={true}>
          <CardTitle>Budget vs Actual Spending</CardTitle>
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
      <div className="flex justify-end mt-3">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm">
              <Trash2 className="h-4 w-4" />
              Delete All
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete All Budgets</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete all budgets? This action cannot
                be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => handleDeleteAll()}
                className="bg-red-700 hover:bg-red-800"
              >
                {loading ? "Deleting..." : "Delete All"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </>
  );
}
