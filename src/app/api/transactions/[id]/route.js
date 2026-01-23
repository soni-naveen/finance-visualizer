import { NextResponse } from "next/server";
import { getCurrentUserIdFromCookies } from "@/lib/firebase/server-auth";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

async function getUserId() {
  const userId = await getCurrentUserIdFromCookies();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return userId;
}

// PUT /api/transactions/:id
export async function PUT(req, { params }) {
  try {
    const userId = await getUserId();
    if (userId instanceof NextResponse) return userId;

    const { id } = await params;

    const data = await req.json();
    const client = await clientPromise;
    const db = client.db("finance-app");

    const _id = ObjectId.createFromHexString(id);

    const result = await db.collection("transactions").updateOne(
      { _id, userId },
      {
        $set: {
          amount: Number(data.amount),
          date: data.date,
          description: data.description,
          category: data.category,
          type: data.type,
          updatedAt: new Date(),
        },
      },
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const updated = await db
      .collection("transactions")
      .findOne({ _id, userId });

    return NextResponse.json({
      ...updated,
      _id: updated._id.toString(),
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to update transaction" },
      { status: 500 },
    );
  }
}

// DELETE /api/transactions/:id
export async function DELETE(_, { params }) {
  try {
    const userId = await getUserId();
    if (userId instanceof NextResponse) return userId;

    const { id } = await params;
    const client = await clientPromise;
    const db = client.db("finance-app");

    await db.collection("transactions").deleteOne({
      _id: ObjectId.createFromHexString(id),
      userId,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to delete transaction" },
      { status: 500 },
    );
  }
}
