"use server";

import { revalidatePath } from "next/cache";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// new budget
export async function createBudget(budget) {
  try {
    const client = await clientPromise;
    const db = client.db("finance-app");

    // Check if budget already exists for this category and month
    const existing = await db.collection("budgets").findOne({
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
      amount: Number(budget.amount),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("budgets").insertOne(newBudget);

    revalidatePath("/dashboard");

    return { success: true, id: result.insertedId.toString() };
  } catch (error) {
    console.error("Error creating budget:", error);
    return {
      success: false,
      error: "Failed to create budget",
    };
  }
}

// Update an existing budget entry
export async function updateBudget(id, budget) {
  try {
    const client = await clientPromise;
    const db = client.db("finance-app");

    const updateData = {
      ...budget,
      ...(budget.amount && { amount: Number(budget.amount) }),
      updatedAt: new Date(),
    };

    await db
      .collection("budgets")
      .updateOne({ _id: new ObjectId(id) }, { $set: updateData });

    revalidatePath("/dashboard");

    return { success: true };
  } catch (error) {
    console.error("Error updating budget:", error);
    return {
      success: false,
      error: "Failed to update budget",
    };
  }
}

// Fetch budgets (optionally filtered by month)
export async function getBudgets(month) {
  try {
    const client = await clientPromise;
    const db = client.db("finance-app");

    const query = month ? { month } : {};
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
