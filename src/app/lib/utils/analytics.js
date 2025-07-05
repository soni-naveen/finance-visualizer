// Utility functions for transactions

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
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export function formatMonth(monthString) {
  const date = new Date(monthString + "-01");
  return date.toLocaleDateString("en-US", { year: "numeric", month: "long" });
}
