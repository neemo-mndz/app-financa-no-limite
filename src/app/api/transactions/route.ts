import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { transactions } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { createClient } from "@/lib/supabase/server";
import { transactionSchema } from "@/lib/validations";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
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
        eq(transactions.userId, user.id),
        eq(transactions.month, month),
        eq(transactions.year, year)
      )
    )
    .orderBy(desc(transactions.createdAt));

  return NextResponse.json(result);
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
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

  const result = await db
    .insert(transactions)
    .values({
      userId: user.id,
      description: parsed.data.description,
      amount: parsed.data.amount.toString(),
      categoryId: parsed.data.categoryId || null,
      month: parsed.data.month,
      year: parsed.data.year,
    })
    .returning();

  return NextResponse.json(result[0], { status: 201 });
}

export async function DELETE(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "ID required" }, { status: 400 });
  }

  await db
    .delete(transactions)
    .where(and(eq(transactions.id, id), eq(transactions.userId, user.id)));

  return NextResponse.json({ success: true });
}
