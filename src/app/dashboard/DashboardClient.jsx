"use client";

import { useEffect } from "react";
import { useAuth } from "@/lib/firebase/auth-context";
import { useAuthToken } from "@/hooks/use-auth-token";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { TransactionForm } from "@/components/transaction-form";
import { BudgetForm } from "@/components/budget-form";
import { TransactionList } from "@/components/transaction-list";
import { MonthlyExpensesChart } from "@/components/charts/monthly-expenses-chart";
import { CategoryPieChart } from "@/components/charts/category-pie-chart";
import { BudgetComparisonChart } from "@/components/charts/budget-comparison-chart";
import { UserProfile } from "@/components/user-profile";
import { AuthGuard } from "@/components/auth-guard";
import {
  getCategorySummary,
  getMonthlySummary,
  getCurrentMonthString,
  formatCurrency,
} from "@/lib/utils/analytics";
import { DollarSign, TrendingUp, TrendingDown, PieChart } from "lucide-react";
import Footer from "@/components/footer";

export default function DashboardClient({ transactions, budgets }) {
  const { user } = useAuth();
  const token = useAuthToken();

  useEffect(() => {
    if (!token) return;
  }, [token]);

  const currentMonth = getCurrentMonthString();
  const currentMonthTransactions = transactions.filter((t) =>
    t.date.startsWith(currentMonth)
  );

  const totalIncome = currentMonthTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = currentMonthTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const netIncome = totalIncome - totalExpenses;
  const monthlySummary = getMonthlySummary(transactions);
  const categorySummary = getCategorySummary(transactions);
  const currentMonthCategorySummary = getCategorySummary(
    currentMonthTransactions
  );

  return (
    <AuthGuard>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-4 md:gap-0 md:flex-row justify-between md:items-center mb-8">
          <div className="flex justify-between items-center">
            <div className="md:space-y-1">
              <h1 className="text-2xl md:text-3xl font-bold">
                Financial Dashboard
              </h1>
              <p className="text-muted-foreground text-sm md:text-base flex items-center gap-2">
                Welcome back, {user?.displayName || "User"}!
              </p>
            </div>
            <div>
              <UserProfile className="text-lg md:hidden" />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <TransactionForm />
            <BudgetForm />
            <UserProfile className="ml-1 text-lg hidden md:flex" />
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="font-medium">Total Income</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(totalIncome)}
              </div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="font-medium">Total Expenses</CardTitle>
              <TrendingDown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {formatCurrency(totalExpenses)}
              </div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="font-medium">Net Income</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div
                className={`text-2xl font-bold ${
                  netIncome >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {formatCurrency(netIncome)}
              </div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="font-medium">Categories</CardTitle>
              <PieChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {currentMonthCategorySummary.length}
              </div>
              <p className="text-xs text-muted-foreground">Active this month</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <MonthlyExpensesChart data={monthlySummary} />
          <CategoryPieChart
            overall={categorySummary}
            monthly={currentMonthCategorySummary}
          />
        </div>

        {/* Budget Comparison */}
        {budgets.length > 0 && (
          <div className="mb-8">
            <BudgetComparisonChart
              budgets={budgets}
              actualSpending={currentMonthCategorySummary}
            />
          </div>
        )}

        {/* Recent Transactions */}
        <TransactionList transactions={transactions} />

        {/* Spending Insights */}
        {currentMonthCategorySummary.length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Spending Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-1">Top Spending Category</h4>
                  <p className="text-sm text-muted-foreground">
                    {currentMonthCategorySummary[0]?.category} -{" "}
                    {formatCurrency(currentMonthCategorySummary[0]?.total || 0)}
                  </p>
                </div>

                {budgets.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Budget Status</h4>
                    <div className="space-y-2">
                      {budgets
                        .filter(
                          (budget) =>
                            budget.month === getCurrentMonthString().slice(0, 7)
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
                              <span className="text-xs xs:text-sm">
                                {budget.category}
                              </span>
                              <div className="flex items-center space-x-2">
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
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      <Footer />
    </AuthGuard>
  );
}
