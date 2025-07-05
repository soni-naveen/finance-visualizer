"use server";

import { revalidatePath } from "next/cache";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// Create a transaction
export async function createTransaction(transaction) {
  try {
    const client = await clientPromise;
    const db = client.db("finance-app");

    const newTransaction = {
      ...transaction,
      amount: Number(transaction.amount),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db
      .collection("transactions")
      .insertOne(newTransaction);

    revalidatePath("/");
    revalidatePath("/dashboard");

    return { success: true, id: result.insertedId.toString() };
  } catch (error) {
    console.error("Error creating transaction:", error);
    return { success: false, error: "Failed to create transaction" };
  }
}

// Update a transaction
export async function updateTransaction(id, transaction) {
  try {
    const client = await clientPromise;
    const db = client.db("finance-app");

    const updateData = {
      ...transaction,
      ...(transaction.amount && { amount: Number(transaction.amount) }),
      updatedAt: new Date(),
    };

    await db
      .collection("transactions")
      .updateOne({ _id: new ObjectId(id) }, { $set: updateData });

    revalidatePath("/");
    revalidatePath("/dashboard");

    return { success: true };
  } catch (error) {
    console.error("Error updating transaction:", error);
    return { success: false, error: "Failed to update transaction" };
  }
}

// Delete a transaction
export async function deleteTransaction(id) {
  try {
    const client = await clientPromise;
    const db = client.db("finance-app");

    await db.collection("transactions").deleteOne({ _id: new ObjectId(id) });

    revalidatePath("/");
    revalidatePath("/dashboard");

    return { success: true };
  } catch (error) {
    console.error("Error deleting transaction:", error);
    return { success: false, error: "Failed to delete transaction" };
  }
}

// Fetch transactions, optionally limited
export async function getTransactions(limit) {
  try {
    const client = await clientPromise;
    const db = client.db("finance-app");

    const query = db
      .collection("transactions")
      .find({})
      .sort({ date: -1, createdAt: -1 });

    if (limit) {
      query.limit(limit);
    }

    const transactions = await query.toArray();

    return transactions.map((t) => ({
      ...t,
      _id: t._id.toString(),
    }));
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return [];
  }
}
