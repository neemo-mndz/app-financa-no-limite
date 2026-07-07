import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { cards } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { getSession } from "@/lib/auth";
import { z } from "zod";

export const runtime = "nodejs";

const cardSchema = z.object({
  name: z.string().min(1).max(50),
  invoiceAmount: z.number().min(0),
  month: z.number().min(1).max(12),
  year: z.number().min(2020).max(2100),
});

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
    .from(cards)
    .where(
      and(
        eq(cards.userId, session.userId),
        eq(cards.month, month),
        eq(cards.year, year)
      )
    );

  return NextResponse.json(result);
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = cardSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  const result = await db
    .insert(cards)
    .values({
      userId: session.userId,
      name: parsed.data.name,
      invoiceAmount: parsed.data.invoiceAmount.toString(),
      month: parsed.data.month,
      year: parsed.data.year,
    })
    .returning();

  return NextResponse.json(result[0], { status: 201 });
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

  const parsed = cardSchema.safeParse(data);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  const result = await db
    .update(cards)
    .set({
      name: parsed.data.name,
      invoiceAmount: parsed.data.invoiceAmount.toString(),
    })
    .where(and(eq(cards.id, id), eq(cards.userId, session.userId)))
    .returning();

  return NextResponse.json(result[0]);
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

  await db.delete(cards).where(and(eq(cards.id, id), eq(cards.userId, session.userId)));
  return NextResponse.json({ success: true });
}
