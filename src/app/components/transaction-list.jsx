"use client";

import { useState } from "react";
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
import { TransactionForm } from "./transaction-form";
import { deleteTransaction } from "@/lib/actions/transactions";
import { formatCurrency } from "@/lib/utils/analytics";
import { Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatFullDate } from "@/lib/utils/analytics";

export function TransactionList({ transactions }) {
  const [deletingId, setDeletingId] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const { toast } = useToast();

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      const result = await deleteTransaction(id);
      if (result.success) {
        toast({
          title: "Transaction deleted successfully",
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
        description: "Failed to delete transaction",
        variant: "destructive",
      });
    } finally {
      setDeletingId(null);
    }
  };

  const displayedTransactions = showAll
    ? transactions
    : transactions.slice(0, 10);

  if (transactions.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <p className="text-muted-foreground mb-4">No transactions found</p>
          <TransactionForm />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
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
                  <TableCell>
                    <Badge variant="outline">{transaction.category}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        transaction.type === "income" ? "default" : "secondary"
                      }
                    >
                      {transaction.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    <span
                      className={
                        transaction.type === "income"
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    >
                      {transaction.type === "income" ? "+" : "-"}
                      {formatCurrency(transaction.amount)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <TransactionForm
                        transaction={transaction}
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
                              Are you sure you want to delete this transaction?
                              This action cannot be undone.
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
        {/* View All Transactions */}
        {transactions.length > 10 && (
          <div className="mt-4 flex justify-center">
            <Button variant="ghost" onClick={() => setShowAll(!showAll)}>
              {showAll ? "Show Recent Only" : "View All Transactions"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
