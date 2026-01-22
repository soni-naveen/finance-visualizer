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
import { deleteBudget, deleteAllBudgets } from "@/lib/actions/budgets";
import { Edit, Trash2 } from "lucide-react";
import { formatCurrency, getCurrentMonthString } from "@/lib/utils/analytics";
import { useToast } from "@/hooks/use-toast";

export function BudgetList({ budgets, currentMonthCategorySummary }) {
  const [deletingId, setDeletingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      const result = await deleteBudget(id);
      if (result.success) {
        toast({
          title: "Budget deleted successfully",
          variant: "success"
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
        description: "Failed to delete budget",
        variant: "destructive",
      });
    } finally {
      setDeletingId(null);
    }
  };

  const handleDeleteAll = async () => {
    setLoading(true);
    try {
      const result = await deleteAllBudgets();
      if (result.success) {
        toast({
          title: "All Budgets deleted successfully",
          variant: "success"
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
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Spending Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-5">
            <div>
              <h4 className="font-medium mb-1">Top Spending Category: </h4>
              <p className="text-sm text-muted-foreground">
                {currentMonthCategorySummary[0]?.category} -{" "}
                {formatCurrency(currentMonthCategorySummary[0]?.total || 0)}
              </p>
            </div>
            {budgets.length > 0 && (
              <div>
                <h4 className="font-medium mb-1">Budget Status</h4>
                <div className="overflow-x-auto">
                  <div className="pb-3 space-y-2 min-w-[500px]">
                    {budgets
                      .filter(
                        (budget) => budget.month === getCurrentMonthString()
                      )
                      .map((budget) => {
                        const actual =
                          currentMonthCategorySummary.find(
                            (c) => c.category === budget.category
                          )?.total || 0;
                        const percentage = (actual / budget.amount) * 100;
                        const isOverBudget = percentage > 100;

                        return (
                          <div
                            key={budget._id}
                            className="flex justify-between items-center"
                          >
                            <span className="text-xs xs:text-sm text-muted-foreground">
                              {budget.category}
                            </span>
                            <div className="flex items-center space-x-5">
                              <span className="text-xs xs:text-sm">
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

      {budgets.length > 0 && (
        <div className="flex justify-end mt-3">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="delete" size="sm">
                Delete All
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
                  onClick={() => handleDeleteAll()}
                  className="bg-red-700 hover:bg-red-800"
                >
                  {loading ? "Deleting..." : "Delete All"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}
    </>
  );
}
