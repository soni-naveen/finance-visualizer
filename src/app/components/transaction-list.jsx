"use client";

import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Badge } from "./ui/badge";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

import { Input } from "@/components/ui/input";
import { TransactionForm } from "./transaction-form";
import { formatCurrency } from "@/lib/utils/analytics";
import { Edit, Trash2, X } from "lucide-react";
import {
  BsSliders,
  BsArrowUpCircleFill,
  BsFillArrowDownCircleFill,
} from "react-icons/bs";
import { RiCloseLargeFill } from "react-icons/ri";
import { RxDoubleArrowDown } from "react-icons/rx";
import { useToast } from "@/hooks/use-toast";
import { formatFullDate } from "@/lib/utils/analytics";

export function TransactionList({
  transactions,
  onDeleted,
  onDeleteAll,
  onUpdated,
  onCreated,
}) {
  const { toast } = useToast();
  const [deletingId, setDeletingId] = useState(null);
  const [visibleCount, setVisibleCount] = useState(10);
  const [loadingAll, setLoadingAll] = useState(false);
  const [openFilters, setOpenFilters] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [closingTransaction, setClosingTransaction] = useState(false);

  function toDateInputValue(date) {
    return new Date(date).toLocaleDateString("en-CA", {
      timeZone: "Asia/Kolkata",
    });
  }

  const closeTransactionModal = () => {
    setClosingTransaction(true);

    setTimeout(() => {
      setSelectedTransaction(null);
      setClosingTransaction(false);
    }, 300);
  };

  const today = new Date();
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(today.getFullYear() - 1);

  const [filters, setFilters] = useState({
    startDate: toDateInputValue(oneYearAgo),
    endDate: toDateInputValue(today),
    minAmount: "",
    maxAmount: "",
    category: "all",
    type: "all",
  });

  useEffect(() => {
    setVisibleCount(10);
  }, [filters]);

  useEffect(() => {
    if (!selectedTransaction) return;

    const updatedTransaction = transactions.find(
      (transaction) => transaction._id === selectedTransaction._id,
    );

    if (updatedTransaction) {
      setSelectedTransaction((current) => {
        if (!current) return null;

        return {
          ...current,
          ...updatedTransaction,
        };
      });
    }
  }, [transactions]);

  const isFiltering =
    filters.startDate ||
    filters.endDate ||
    filters.minAmount ||
    filters.maxAmount ||
    filters.category !== "all" ||
    filters.type !== "all";

  // DELETE
  async function handleDelete(id) {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/transactions/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete transaction");
      }

      toast({
        title: "Transaction deleted successfully",
        variant: "success",
      });

      if (selectedTransaction?._id === id) {
        closeTransactionModal();
      }

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

  // DELETE ALL
  async function handleDeleteAll() {
    setLoadingAll(true);
    try {
      const res = await fetch("/api/transactions", {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete transactions");
      }

      toast({
        title: "All transactions deleted successfully",
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

  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(b.date) - new Date(a.date),
  );

  // FILTER
  const filteredTransactions = sortedTransactions.filter((t) => {
    // Date filter
    if (filters.startDate) {
      if (new Date(t.date) < new Date(filters.startDate)) return false;
    }

    if (filters.endDate) {
      if (new Date(t.date) > new Date(filters.endDate)) return false;
    }

    // Amount range
    if (filters.minAmount && t.amount < Number(filters.minAmount)) return false;
    if (filters.maxAmount && t.amount > Number(filters.maxAmount)) return false;

    // Category
    if (filters.category !== "all" && t.category !== filters.category)
      return false;

    // Type
    if (filters.type !== "all" && t.type !== filters.type) return false;

    return true;
  });

  const totalCount = transactions.length;
  const filteredCount = filteredTransactions.length;

  const displayedTransactions = filteredTransactions.slice(0, visibleCount);

  if (transactions.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <p className="text-muted-foreground mb-4 text-sm sm:text-base">
            No transaction found.
          </p>
          <TransactionForm onCreated={onCreated} />
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle className="pt-2">Recent Transactions</CardTitle>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setOpenFilters((prev) => !prev)}
          >
            {openFilters ? (
              <RiCloseLargeFill className="h-4 w-4 sm:mr-1" />
            ) : (
              <BsSliders className="h-4 w-4 sm:mr-1" />
            )}
            <span className="hidden sm:inline">
              {openFilters ? "Close" : "Filter"}
            </span>
          </Button>
        </CardHeader>
        {/* ========== FILTERS ========= */}
        <div
          className={`
            overflow-hidden transition-all duration-300 ease-in-out
            ${openFilters ? "max-h-[500px] opacity-100 pt-2 md:pt-4" : "max-h-0 opacity-0 py-0"}
          `}
        >
          <div className="px-4">
            {/* Filter inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-3">
              {/* Start Date */}
              <Input
                type="date"
                className="w-full"
                value={filters.startDate}
                onChange={(e) =>
                  setFilters({ ...filters, startDate: e.target.value })
                }
              />

              {/* End Date */}
              <Input
                type="date"
                className="w-full"
                value={filters.endDate}
                onChange={(e) =>
                  setFilters({ ...filters, endDate: e.target.value })
                }
              />

              {/* Min Amount */}
              <Input
                type="number"
                placeholder="Min"
                className="w-full"
                value={filters.minAmount}
                onChange={(e) =>
                  setFilters({ ...filters, minAmount: e.target.value })
                }
              />

              {/* Max Amount */}
              <Input
                type="number"
                placeholder="Max"
                className="w-full"
                value={filters.maxAmount}
                onChange={(e) =>
                  setFilters({ ...filters, maxAmount: e.target.value })
                }
              />

              {/* Category */}
              <Select
                value={filters.category}
                onValueChange={(value) =>
                  setFilters({ ...filters, category: value })
                }
              >
                <SelectTrigger className="text-left">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>

                  {[...new Set(transactions.map((t) => t.category))].map(
                    (cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ),
                  )}
                </SelectContent>
              </Select>

              {/* Type */}
              <Select
                value={filters.type}
                onValueChange={(value) =>
                  setFilters({ ...filters, type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Type" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Centered Buttons */}
            <div className="flex flex-col xs:flex-row justify-center items-center gap-3 mt-3">
              <Button
                variant="secondary"
                className="w-full xs:w-auto xs:min-w-45"
                onClick={() =>
                  setFilters({
                    startDate: toDateInputValue(oneYearAgo),
                    endDate: toDateInputValue(today),
                    minAmount: "",
                    maxAmount: "",
                    category: "all",
                    type: "all",
                  })
                }
              >
                Reset Filters
              </Button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="delete"
                    className="w-full xs:w-auto xs:min-w-45"
                  >
                    Delete All
                  </Button>
                </AlertDialogTrigger>

                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete All Transactions</AlertDialogTitle>

                    <AlertDialogDescription>
                      Are you sure you want to delete all transactions? This
                      action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>

                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>

                    <AlertDialogAction
                      onClick={handleDeleteAll}
                      className="bg-red-700 hover:bg-red-800"
                    >
                      {loadingAll ? "Deleting..." : "Delete"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
          <p
            className={`text-xs sm:text-sm text-center text-muted-foreground pt-4`}
          >
            {isFiltering && filteredCount < totalCount
              ? `Showing ${filteredCount} of ${totalCount} transactions`
              : null}
          </p>
        </div>
        {displayedTransactions.length === 0 ? (
          <p className="text-muted-foreground text-xs sm:text-sm p-4 text-center mb-4">
            No transaction match your filter.
          </p>
        ) : (
          <div className="overflow-x-auto py-4 px-2 sm:p-4">
            <Table>
              <TableHeader className="bg-neutral-100">
                <TableRow>
                  <TableHead>Transaction</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayedTransactions.map((transaction) => (
                  <TableRow
                    key={transaction._id}
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => setSelectedTransaction(transaction)}
                  >
                    <TableCell className="max-w-[200px] sm:max-w-[300px] flex flex-col gap-1">
                      <div className="text-[9px] sm:text-[10px]">
                        {formatFullDate(transaction.date)}
                      </div>
                      <div className="truncate">{transaction.description}</div>
                      <div>
                        <Badge
                          className="text-center font-normal"
                          variant="outline"
                        >
                          {transaction.category}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      <div
                        className={`${
                          transaction.type === "income"
                            ? "text-green-600"
                            : "text-red-500"
                        } flex gap-x-[2px] justify-end`}
                      >
                        <p>{transaction.type === "income" ? "+" : "-"}</p>
                        <p>{formatCurrency(transaction.amount)}</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {/* View All Transactions */}
            <div
              onClick={() =>
                setVisibleCount((prev) =>
                  Math.min(prev + 20, filteredTransactions.length),
                )
              }
              className="flex items-center justify-center hover:bg-secondary cursor-pointer"
            >
              {visibleCount < filteredTransactions.length && (
                <div className="flex justify-center py-2 text-muted-foreground">
                  <div className="flex items-center gap-1">
                    View More
                    <RxDoubleArrowDown className="text-lg" />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        {/* Transaction Details Bottom Sheet */}
        {selectedTransaction && (
          <div
            className="fixed inset-0 z-50 flex items-end justify-center"
            onClick={closeTransactionModal}
          >
            {/* Backdrop */}
            <div
              className={`absolute inset-0 bg-black/40 backdrop-blur-[2px] ${
                closingTransaction
                  ? "transaction-backdrop-exit"
                  : "transaction-backdrop-enter"
              }`}
              onClick={closeTransactionModal}
            />
            {/* Bottom Sheet */}
            <div
              onClick={(e) => e.stopPropagation()}
              className={`relative z-10 w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-t-3xl bg-background shadow-2xl 
                ${
                  closingTransaction
                    ? "transaction-sheet-exit"
                    : "transaction-sheet-enter"
                }`}
            >
              {/* Drag Handle */}
              <div className="flex justify-center pt-3">
                <div className="h-1.5 w-12 rounded-full bg-muted-foreground/30" />
              </div>

              {/* Header */}
              <div className="flex items-center justify-between px-5 pt-4 sm:px-7">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={closeTransactionModal}
                  className="rounded-full absolute top-2 right-2"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="flex flex-col items-center w-full">
                {selectedTransaction.type === "income" ? (
                  <div>
                    <BsFillArrowDownCircleFill className="text-7xl text-green-600 mt-3" />
                  </div>
                ) : (
                  <div>
                    <BsArrowUpCircleFill className="text-7xl text-red-500 mt-3" />
                  </div>
                )}

                {/* Amount */}
                <div className="px-5 sm:px-7 pb-5">
                  <div
                    className={`rounded-2xl py-4 flex flex-col items-center text-center`}
                  >
                    <p
                      className={`text-3xl sm:text-4xl font-bold ${
                        selectedTransaction.type === "income"
                          ? "text-green-600"
                          : "text-red-500"
                      }
                  `}
                    >
                      {/* {selectedTransaction.type === "income" ? "+" : "-"} */}
                      {formatCurrency(selectedTransaction.amount)}
                    </p>
                    <p className="text-sm sm:text-base pt-2 text-center">
                      {selectedTransaction.description || "—"}
                    </p>
                  </div>
                </div>

                {/* Details */}
                <div className="px-3 sm:px-5 pb-7 w-full">
                  <div className="rounded-xl bg-secondary overflow-hidden">
                    {/* Date */}
                    <div className="flex items-center justify-between px-4 py-4 border-b border-gray-300">
                      <span className="text-sm text-muted-foreground">
                        Date
                      </span>

                      <span className="text-sm">
                        {formatFullDate(selectedTransaction.date)}
                      </span>
                    </div>
                    {/* Category */}
                    <div className="flex items-center justify-between px-4 py-4 border-b border-gray-300">
                      <span className="text-sm text-muted-foreground">
                        Category
                      </span>

                      <span className="text-sm">
                        {selectedTransaction.category}
                      </span>
                    </div>
                    {/* Transaction Type */}
                    <div className="flex items-center justify-between px-4 py-4">
                      <span className="text-sm text-muted-foreground">
                        Transaction Type
                      </span>

                      <span className="text-sm">
                        {selectedTransaction.type.charAt(0).toUpperCase() +
                          selectedTransaction.type.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end space-x-2 mb-7">
                  <TransactionForm
                    transaction={selectedTransaction}
                    onUpdated={onUpdated}
                    trigger={
                      <Button variant="outline" size="lg">
                        <Edit className="h-4 w-4" />
                      </Button>
                    }
                  />
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="lg"
                        className="text-red-600 hover:text-red-700 bg-white"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Transaction</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this transaction? This
                          action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(selectedTransaction._id)}
                          disabled={deletingId === selectedTransaction._id}
                          className="bg-red-700 hover:bg-red-800"
                        >
                          {deletingId === selectedTransaction._id
                            ? "Deleting..."
                            : "Delete"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </div>
          </div>
        )}
      </Card>
    </>
  );
}
