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

export async function createBudget(budget) {
  try {
    const userId = await getUserId();
    const client = await clientPromise;
    const db = client.db("finance-app");

    const existing = await db.collection("budgets").findOne({
      userId,
      category: budget.category,
      month: budget.month,
    });

    if (existing) {
      return {
        success: false,
        error: "Budget already exists for this category and month",
      };
    }

    const newBudget = {
      ...budget,
      userId,
      amount: Number(budget.amount),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("budgets").insertOne(newBudget);

    revalidatePath("/dashboard");

    return { success: true, id: result.insertedId.toString() };
  } catch (error) {
    console.error("Error creating budget:", error);
    return { success: false, error: "Failed to create budget" };
  }
}

export async function updateBudget(id, budget) {
  try {
    const userId = await getUserId();
    const client = await clientPromise;
    const db = client.db("finance-app");

    const updateData = {
      ...budget,
      ...(budget.amount && { amount: Number(budget.amount) }),
      updatedAt: new Date(),
    };

    const result = await db
      .collection("budgets")
      .updateOne({ _id: new ObjectId(id), userId }, { $set: updateData });

    if (result.matchedCount === 0) {
      return { success: false, error: "Budget not found or unauthorized" };
    }

    revalidatePath("/dashboard");

    return { success: true };
  } catch (error) {
    console.error("Error updating budget:", error);
    return { success: false, error: "Failed to update budget" };
  }
}

export async function deleteAllBudgets() {
  try {
    const userId = await getUserId();
    const client = await clientPromise;
    const db = client.db("finance-app");

    const result = await db.collection("budgets").deleteMany({ userId });

    if (result.deletedCount === 0) {
      return { success: false, error: "Budget not found or unauthorized" };
    }

    revalidatePath("/dashboard");

    return { success: true };
  } catch (error) {
    console.error("Error deleting budgets:", error);
    return { success: false, error: "Failed to delete budgets" };
  }
}

export async function getBudgets(month) {
  try {
    const userId = await getUserId();
    const client = await clientPromise;
    const db = client.db("finance-app");

    const query = { userId, ...(month && { month }) };
    const budgets = await db.collection("budgets").find(query).toArray();

    return budgets.map((b) => ({
      ...b,
      _id: b._id.toString(),
    }));
  } catch (error) {
    console.error("Error fetching budgets:", error);
    return [];
  }
}
