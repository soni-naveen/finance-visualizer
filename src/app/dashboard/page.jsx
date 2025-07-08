import { getTransactions } from "@/lib/actions/transactions";
import { getBudgets } from "@/lib/actions/budgets";
import { getCurrentMonthString } from "@/lib/utils/analytics";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const transactions = await getTransactions();
  const budgets = await getBudgets(getCurrentMonthString());

  return <DashboardClient transactions={transactions} budgets={budgets} />;
}
