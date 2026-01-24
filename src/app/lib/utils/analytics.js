import { format, subMonths, startOfMonth, endOfMonth } from "date-fns";

export function getMonthOptions() {
  const options = [];

  // Current month
  options.push({
    label: "This month",
    value: "current",
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date()),
  });

  // Previous 6 months
  for (let i = 1; i <= 6; i++) {
    const date = subMonths(new Date(), i);
    options.push({
      label: format(date, "MMM yyyy"),
      value: format(date, "yyyy-MM"),
      from: startOfMonth(date),
      to: endOfMonth(date),
    });
  }

  // All time
  options.push({
    label: "All time",
    value: "all",
    from: null,
    to: null,
  });

  return options;
}

export function getCategorySummary(transactions) {
  const summary = new Map();

  transactions
    .filter((t) => t.type === "expense")
    .forEach((transaction) => {
      const current = summary.get(transaction.category) || {
        total: 0,
        count: 0,
      };
      summary.set(transaction.category, {
        total: current.total + transaction.amount,
        count: current.count + 1,
      });
    });

  return Array.from(summary.entries())
    .map(([category, data]) => ({
      category,
      total: data.total,
      count: data.count,
    }))
    .sort((a, b) => b.total - a.total);
}

export function getMonthlySummary(transactions) {
  const summary = new Map();

  transactions.forEach((transaction) => {
    const month = transaction.date.substring(0, 7); // YYYY-MM
    const current = summary.get(month) || { income: 0, expenses: 0 };

    if (transaction.type === "income") {
      current.income += transaction.amount;
    } else {
      current.expenses += transaction.amount;
    }

    summary.set(month, current);
  });

  return Array.from(summary.entries())
    .map(([month, data]) => ({
      month,
      income: data.income,
      expenses: data.expenses,
      total: data.income - data.expenses,
    }))
    .sort((a, b) => a.month.localeCompare(b.month));
}

export function getCurrentMonthString() {
  const now = new Date();
  return `${now.getFullYear()}-${(now.getMonth() + 1)
    .toString()
    .padStart(2, "0")}`;
}

export function formatCurrency(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount);
}

export function formatMonth(monthString) {
  const date = new Date(monthString + "-01");
  const shortMonth = date.toLocaleString("en-US", { month: "short" });
  const shortYear = date.getFullYear();
  return `${shortMonth} ${shortYear}`;
}

export function formatFullDate(dateString) {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = date.toLocaleString("en-US", { month: "short" });
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
}
