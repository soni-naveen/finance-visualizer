import { NextResponse } from "next/server";
import { getCurrentUserIdFromCookies } from "@/lib/firebase/server-auth";
import clientPromise from "@/lib/mongodb";

async function getUserId() {
  const userId = await getCurrentUserIdFromCookies();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return userId;
}

// GET /api/budgets?month=YYYY-MM
export async function GET(req) {
  try {
    const userId = await getUserId();
    if (userId instanceof NextResponse) return userId;

    const { searchParams } = new URL(req.url);
    const month = searchParams.get("month");

    const client = await clientPromise;
    const db = client.db("finance-app");

    const query = { userId, ...(month && { month }) };
    const budgets = await db.collection("budgets").find(query).toArray();

    return NextResponse.json(
      budgets.map((b) => ({ ...b, _id: b._id.toString() })),
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch budgets" },
      { status: 500 },
    );
  }
}

// POST /api/budgets
export async function POST(req) {
  try {
    const userId = await getUserId();
    if (userId instanceof NextResponse) return userId;

    const budget = await req.json();
    const client = await clientPromise;
    const db = client.db("finance-app");

    const existing = await db.collection("budgets").findOne({
      userId,
      category: budget.category,
      month: budget.month,
    });

    if (existing) {
      return NextResponse.json(
        { error: "Budget already exists for this category and month" },
        { status: 400 },
      );
    }

    const newBudget = {
      ...budget,
      userId,
      amount: Number(budget.amount),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("budgets").insertOne(newBudget);

    return NextResponse.json({
      ...newBudget,
      _id: result.insertedId.toString(),
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to create budget" },
      { status: 500 },
    );
  }
}

export async function DELETE() {
  try {
    const userId = await getUserId();
    if (userId instanceof NextResponse) return userId;

    const client = await clientPromise;
    const db = client.db("finance-app");

    await db.collection("budgets").deleteMany({ userId });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to delete budgets" },
      { status: 500 },
    );
  }
}
