"use client";

import { useState } from "react";
import { Button } from "./ui/button";
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
} from "./ui/alert-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { BudgetForm } from "./budget-form";
import { Edit, Trash2 } from "lucide-react";
import { formatCurrency, getCurrentMonthString } from "@/lib/utils/analytics";
import { useToast } from "@/hooks/use-toast";

export function BudgetList({
  budgets,
  currentMonthCategorySummary,
  onDeleted,
  onDeleteAll,
  onUpdated,
}) {
  const [deletingId, setDeletingId] = useState(null);
  const [loadingAll, setLoadingAll] = useState(false);
  const { toast } = useToast();

  async function handleDelete(id) {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/budgets/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete budget");
      }

      toast({
        title: "Budget deleted successfully",
        variant: "success",
      });

      onDeleted?.(id);
    } catch (err) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setDeletingId(null);
    }
  }

  async function handleDeleteAllBudgets() {
    setLoadingAll(true);
    try {
      const res = await fetch("/api/budgets", {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete budgets");
      }

      toast({
        title: "All budgets deleted successfully",
        variant: "success",
      });

      onDeleteAll?.();
    } catch (err) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoadingAll(false);
    }
  }

  return (
    <>
      <Card className="mt-8">
        <div className="flex p-4 xs:px-6 xs:pt-6 xs:pb-2 justify-between">
          <CardTitle className="pt-2">Spending Insights</CardTitle>
          {budgets.length > 0 && (
            <div className="flex justify-end">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="delete" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete All Budgets</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete all budgets? This action
                      cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleDeleteAllBudgets()}
                      className="bg-red-700 hover:bg-red-800"
                    >
                      {loadingAll ? "Deleting..." : "Delete All"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}
        </div>
        <CardContent>
          <div className="-mt-4">
            <hr className="text-muted-foreground/30"/>
            <div className="py-3">
              <h4 className="text-xs sm:text-sm font-medium mb-1">
                Top Spending Category:{" "}
              </h4>
              <p className="text-sm sm:text-base text-muted-foreground">
                {currentMonthCategorySummary[0]?.category} -{" "}
                {formatCurrency(currentMonthCategorySummary[0]?.total || 0)}
              </p>
            </div>
            <hr className="text-muted-foreground/30"/>
            {budgets.length > 0 && (
              <div className="mt-4">
                <h4 className="text-xs sm:text-sm font-medium mb-1">
                  Budget Status
                </h4>
                <div className="overflow-x-auto">
                  <div className="pb-3 space-y-2 min-w-[500px]">
                    {budgets
                      .filter(
                        (budget) => budget.month === getCurrentMonthString(),
                      )
                      .map((budget) => {
                        const actual =
                          currentMonthCategorySummary.find(
                            (c) => c.category === budget.category,
                          )?.total || 0;
                        const percentage = (actual / budget.amount) * 100;
                        const isOverBudget = percentage > 100;

                        return (
                          <div
                            key={budget._id}
                            className="flex justify-between items-center"
                          >
                            <span className="text-sm sm:text-base text-muted-foreground">
                              {budget.category}
                            </span>
                            <div className="flex items-center space-x-5">
                              <span
                                className={`text-sm ${
                                  isOverBudget ? "text-red-600 font-medium" : ""
                                }`}
                              >
                                {formatCurrency(actual)} /{" "}
                                {formatCurrency(budget.amount)}
                              </span>
                              <span
                                className={`text-sm font-medium ${
                                  isOverBudget
                                    ? "text-red-600"
                                    : "text-green-600"
                                }`}
                              >
                                {percentage.toFixed(0)}%
                              </span>
                              <div className="space-x-2">
                                <BudgetForm
                                  budget={budget}
                                  onUpdated={onUpdated}
                                  trigger={
                                    <Button variant="outline" size="sm">
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                  }
                                />
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="text-red-600 hover:text-red-700 bg-white"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>
                                        Delete Budget
                                      </AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Are you sure you want to delete this
                                        budget? This action cannot be undone.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>
                                        Cancel
                                      </AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => handleDelete(budget._id)}
                                        disabled={deletingId === budget._id}
                                        className="bg-red-700 hover:bg-red-800"
                                      >
                                        {deletingId === budget._id
                                          ? "Deleting..."
                                          : "Delete"}
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
