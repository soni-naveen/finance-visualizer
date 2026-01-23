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
import { Edit, Trash2 } from "lucide-react";
import { BsSliders } from "react-icons/bs";
import { RiCloseLargeFill } from "react-icons/ri";
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
  const [showAll, setShowAll] = useState(false);
  const [loadingAll, setLoadingAll] = useState(false);
  const [openFilters, setOpenFilters] = useState(false);

  useEffect(() => {
   setShowAll(false);
  }, [filters]);

  function toDateInputValue(date) {
    return date.toISOString().split("T")[0];
  }

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

  // FILTER
  const filteredTransactions = transactions.filter((t) => {
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

  const displayedTransactions = showAll
    ? filteredTransactions
    : filteredTransactions.slice(0, 10);

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
        <div
          className={`
            overflow-hidden transition-all duration-300 ease-in-out
            ${openFilters ? "max-h-[500px] opacity-100 pt-2 md:pt-4" : "max-h-0 opacity-0 py-0"}
          `}
        >
          <div className="grid grid-cols-1 md:grid-cols-4 xl:grid-cols-7 gap-3 text-sm sm:text-base px-4">
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
              onValueChange={(value) => setFilters({ ...filters, type: value })}
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

            <Button
              className="mt-2 md:mt-0"
              variant="secondary"
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
          </div>
          <p className={`text-xs sm:text-sm text-center text-muted-foreground pt-4`}>
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
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-neutral-100">
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayedTransactions.map((transaction) => (
                    <TableRow key={transaction._id}>
                      <TableCell className="max-w-[200px] truncate">
                        {formatFullDate(transaction.date)}
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {transaction.description}
                      </TableCell>
                      <TableCell className="max-w-[200px] whitespace-nowrap">
                        <Badge className="text-center" variant="outline">
                          {transaction.category}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            transaction.type === "income"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {transaction.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        <div
                          className={`${
                            transaction.type === "income"
                              ? "text-green-600"
                              : "text-red-600"
                          } flex gap-x-[2px] justify-end`}
                        >
                          <p>{transaction.type === "income" ? "+" : "-"}</p>
                          <p>{formatCurrency(transaction.amount)}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <TransactionForm
                            transaction={transaction}
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
                                  Delete Transaction
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete this
                                  transaction? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(transaction._id)}
                                  disabled={deletingId === transaction._id}
                                  className="bg-red-700 hover:bg-red-800"
                                >
                                  {deletingId === transaction._id
                                    ? "Deleting..."
                                    : "Delete"}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        )}
      </Card>
      {/* View All Transactions and Delete All Transactions */}
      <div className="flex items-center gap-2 mt-3 justify-end">
        {filteredTransactions.length > 10 && (
          <div className="flex justify-center">
            <Button variant="outline" onClick={() => setShowAll(!showAll)}>
              {showAll ? "Show Recent" : "View All"}
            </Button>
          </div>
        )}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="delete" size="sm">
              Delete All
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete All Transactions</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete all transactions? This action
                cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => handleDeleteAll()}
                className="bg-red-700 hover:bg-red-800"
              >
                {loadingAll ? "Deleting..." : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </>
  );
}
