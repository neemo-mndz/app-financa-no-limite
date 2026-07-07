import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { transactions } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { getSession } from "@/lib/auth";
import { transactionSchema } from "@/lib/validations";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const month = Number(searchParams.get("month")) || new Date().getMonth() + 1;
  const year = Number(searchParams.get("year")) || new Date().getFullYear();

  const result = await db
    .select()
    .from(transactions)
    .where(
      and(
        eq(transactions.userId, session.userId),
        eq(transactions.month, month),
        eq(transactions.year, year)
      )
    )
    .orderBy(desc(transactions.createdAt));

  return NextResponse.json(result);
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = transactionSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  // Sanitize categoryId
  let categoryId: string | null = null;
  if (parsed.data.categoryId && typeof parsed.data.categoryId === "string" && parsed.data.categoryId.length > 0) {
    categoryId = parsed.data.categoryId;
  }

  const result = await db
    .insert(transactions)
    .values({
      userId: session.userId,
      description: parsed.data.description,
      amount: parsed.data.amount.toString(),
      categoryId,
      month: parsed.data.month,
      year: parsed.data.year,
    })
    .returning();

  return NextResponse.json(result[0], { status: 201 });
}

export async function DELETE(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "ID required" }, { status: 400 });
  }

  await db
    .delete(transactions)
    .where(and(eq(transactions.id, id), eq(transactions.userId, session.userId)));

  return NextResponse.json({ success: true });
}

export async function PUT(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { id, ...data } = body;

  if (!id) {
    return NextResponse.json({ error: "ID required" }, { status: 400 });
  }

  const parsed = transactionSchema.safeParse(data);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  let categoryId: string | null = null;
  if (parsed.data.categoryId && typeof parsed.data.categoryId === "string" && parsed.data.categoryId.length > 0) {
    categoryId = parsed.data.categoryId;
  }

  const result = await db
    .update(transactions)
    .set({
      description: parsed.data.description,
      amount: parsed.data.amount.toString(),
      categoryId,
    })
    .where(and(eq(transactions.id, id), eq(transactions.userId, session.userId)))
    .returning();

  return NextResponse.json(result[0]);
}
