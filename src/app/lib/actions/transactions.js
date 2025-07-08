"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUserIdFromCookies } from "@/lib/firebase/server-auth";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

async function getUserId() {
  const userId = await getCurrentUserIdFromCookies();
  if (!userId) {
    throw new Error("Unauthorized");
  }
  return userId;
}

export async function createTransaction(transaction) {
  try {
    const userId = await getUserId();
    const client = await clientPromise;
    const db = client.db("finance-app");

    const newTransaction = {
      ...transaction,
      userId,
      amount: Number(transaction.amount),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db
      .collection("transactions")
      .insertOne(newTransaction);

    revalidatePath("/dashboard");

    return { success: true, id: result.insertedId.toString() };
  } catch (error) {
    console.error("Error creating transaction:", error);
    return { success: false, error: "Failed to create transaction" };
  }
}

export async function updateTransaction(id, transaction) {
  try {
    const userId = await getUserId();
    const client = await clientPromise;
    const db = client.db("finance-app");

    const updateData = {
      ...transaction,
      ...(transaction.amount && { amount: Number(transaction.amount) }),
      updatedAt: new Date(),
    };

    const result = await db
      .collection("transactions")
      .updateOne({ _id: new ObjectId(id), userId }, { $set: updateData });

    if (result.matchedCount === 0) {
      return { success: false, error: "Transaction not found or unauthorized" };
    }

    revalidatePath("/dashboard");

    return { success: true };
  } catch (error) {
    console.error("Error updating transaction:", error);
    return { success: false, error: "Failed to update transaction" };
  }
}

export async function deleteTransaction(id) {
  try {
    const userId = await getUserId();
    const client = await clientPromise;
    const db = client.db("finance-app");

    const result = await db.collection("transactions").deleteOne({
      _id: new ObjectId(id),
      userId,
    });

    if (result.deletedCount === 0) {
      return { success: false, error: "Transaction not found or unauthorized" };
    }

    revalidatePath("/dashboard");

    return { success: true };
  } catch (error) {
    console.error("Error deleting transaction:", error);
    return { success: false, error: "Failed to delete transaction" };
  }
}

export async function getTransactions(limit) {
  try {
    const userId = await getUserId();
    const client = await clientPromise;
    const db = client.db("finance-app");

    const query = db
      .collection("transactions")
      .find({ userId })
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
