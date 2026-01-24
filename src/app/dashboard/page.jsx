"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/firebase/auth-context";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import Loading from "@/loading";
import { TransactionForm } from "@/components/transaction-form";
import { BudgetForm } from "@/components/budget-form";
import { MonthlyExpensesChart } from "@/components/charts/monthly-expenses-chart";
import { CategoryPieChart } from "@/components/charts/category-pie-chart";
import { BudgetComparisonChart } from "@/components/charts/budget-comparison-chart";
import { TransactionList } from "@/components/transaction-list";
import { BudgetList } from "@/components/budget-list";
import { UserProfile } from "@/components/user-profile";
import {
  getCategorySummary,
  getMonthlySummary,
  getCurrentMonthString,
  formatCurrency,
} from "@/lib/utils/analytics";
import { DollarSign, TrendingUp, TrendingDown, PieChart } from "lucide-react";
import Footer from "@/components/footer";

export default function DashboardClient() {
  const { user } = useAuth();

  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      try {
        const [txRes, budgetRes] = await Promise.all([
          fetch("/api/transactions", { credentials: "include" }),
          fetch("/api/budgets", { credentials: "include" }),
        ]);

        if (!txRes.ok || !budgetRes.ok) {
          throw new Error("Failed to fetch dashboard data");
        }

        const [txData, budgetData] = await Promise.all([
          txRes.json(),
          budgetRes.json(),
        ]);

        if (!cancelled) {
          setTransactions(txData);
          setBudgets(budgetData);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchData();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return <Loading />;
  }

  const currentMonth = getCurrentMonthString();
  const currentMonthTransactions = transactions.filter((t) =>
    t.date.startsWith(currentMonth),
  );

  const totalIncome = currentMonthTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = currentMonthTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const netIncome = totalIncome - totalExpenses;
  const monthlySummary = getMonthlySummary(transactions);
  const currentMonthCategorySummary = getCategorySummary(
    currentMonthTransactions,
  );
  const currentMonthBudgets = budgets.filter(
    (b) => b.month === getCurrentMonthString(),
  );

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-7 md:gap-0 md:flex-row justify-between md:items-center mb-8">
          <div className="flex justify-between items-center">
            <div className="md:space-y-1">
              <h1 className="text-2xl md:text-3xl font-bold text-chart-3">
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
          <div className="hidden md:flex items-center space-x-2">
            <TransactionForm
              onCreated={(tx) => setTransactions((prev) => [tx, ...prev])}
            />
            <BudgetForm
              onCreated={(budget) => setBudgets((prev) => [...prev, budget])}
            />
            <UserProfile className="ml-1 text-lg" />
          </div>
          <div className="fixed bottom-0 left-1/2 -translate-x-1/2 px-4 pt-4 pb-5 sm:px-5 pt-5 pb-6 z-50 bg-black/10 backdrop-blur-xl w-full flex justify-center gap-5 sm:gap-7 md:hidden">
            <BudgetForm
              onCreated={(budget) => setBudgets((prev) => [...prev, budget])}
            />
            <TransactionForm
              onCreated={(tx) => setTransactions((prev) => [tx, ...prev])}
            />
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="font-medium text-muted-foreground text-base">
                Total Income
              </CardTitle>
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
              <CardTitle className="font-medium text-muted-foreground text-base">
                Total Expenses
              </CardTitle>
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
              <CardTitle className="font-medium text-muted-foreground text-base">
                Net Income
              </CardTitle>
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
              <CardTitle className="font-medium text-muted-foreground text-base">
                Categories
              </CardTitle>
              <PieChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-chart-3">
                {currentMonthCategorySummary.length}
              </div>
              <p className="text-xs text-muted-foreground">Active this month</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <MonthlyExpensesChart data={monthlySummary} />
          <CategoryPieChart transactions={transactions} />
        </div>

        {/* Budget Comparison */}
        {currentMonthBudgets.length > 0 && (
          <div className="mb-8">
            <BudgetComparisonChart
              budgets={budgets}
              actualSpending={currentMonthCategorySummary}
            />
          </div>
        )}

        {/* Recent Transactions */}
        <TransactionList
          transactions={transactions}
          onCreated={(tx) => setTransactions((prev) => [tx, ...prev])}
          onDeleted={(id) =>
            setTransactions((prev) => prev.filter((t) => t._id !== id))
          }
          onDeleteAll={() => setTransactions([])}
          onUpdated={(updated) =>
            setTransactions((prev) =>
              prev.map((t) => (t._id === updated._id ? updated : t)),
            )
          }
        />

        {/* Spending Insights */}
        {currentMonthCategorySummary.length > 0 && (
          <BudgetList
            budgets={currentMonthBudgets}
            currentMonthCategorySummary={currentMonthCategorySummary}
            onDeleted={(id) =>
              setBudgets((prev) => prev.filter((b) => b._id !== id))
            }
            onDeleteAll={() => setBudgets([])}
            onUpdated={(updated) =>
              setBudgets((prev) =>
                prev.map((b) => (b._id === updated._id ? updated : b)),
              )
            }
          />
        )}
      </div>
      <Footer />
    </>
  );
}
