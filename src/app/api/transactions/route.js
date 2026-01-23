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

// GET /api/transactions?limit=10
export async function GET(req) {
  try {
    const userId = await getUserId();
    if (userId instanceof NextResponse) return userId;

    const { searchParams } = new URL(req.url);
    const limit = searchParams.get("limit");

    const client = await clientPromise;
    const db = client.db("finance-app");

    const query = db
      .collection("transactions")
      .find({ userId })
      .sort({ date: -1, createdAt: -1 });

    if (limit) query.limit(Number(limit));

    const transactions = await query.toArray();

    return NextResponse.json(
      transactions.map((t) => ({
        ...t,
        _id: t._id.toString(),
      })),
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch transactions" },
      { status: 500 },
    );
  }
}

// POST /api/transactions
export async function POST(req) {
  try {
    const userId = await getUserId();
    if (userId instanceof NextResponse) return userId;

    const transaction = await req.json();
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

    return NextResponse.json({
      ...newTransaction,
      _id: result.insertedId.toString(),
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to create transaction" },
      { status: 500 },
    );
  }
}

// DELETE /api/transactions  (deleteAllTransactions)
export async function DELETE() {
  try {
    const userId = await getUserId();
    if (userId instanceof NextResponse) return userId;

    const client = await clientPromise;
    const db = client.db("finance-app");

    await db.collection("transactions").deleteMany({ userId });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to delete transactions" },
      { status: 500 },
    );
  }
}
