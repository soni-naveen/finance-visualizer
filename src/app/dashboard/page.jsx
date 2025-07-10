import { getTransactions } from "@/lib/actions/transactions";
import { getBudgets } from "@/lib/actions/budgets";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const transactions = await getTransactions();
  const budgets = await getBudgets();

  return <DashboardClient transactions={transactions} budgets={budgets} />;
}
