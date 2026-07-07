import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { categories } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { getSession } from "@/lib/auth";
import { categorySchema } from "@/lib/validations";

export const runtime = "nodejs";

const DEFAULT_CATEGORIES = [
  { name: "Alimentacao", color: "#f97316", icon: "utensils" },
  { name: "Bebidas", color: "#8b5cf6", icon: "wine" },
  { name: "Cigarro", color: "#64748b", icon: "cigarette" },
  { name: "Lazer", color: "#06b6d4", icon: "gamepad" },
  { name: "Transporte", color: "#3b82f6", icon: "car" },
  { name: "Saude", color: "#22c55e", icon: "heart" },
  { name: "Moradia", color: "#eab308", icon: "home" },
  { name: "Educacao", color: "#ec4899", icon: "book" },
  { name: "Assinaturas", color: "#6366f1", icon: "credit-card" },
  { name: "Outros", color: "#a1a1aa", icon: "tag" },
];

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let result = await db
    .select()
    .from(categories)
    .where(eq(categories.userId, session.userId));

  // Se o usuario nao tem categorias, criar as padrao
  if (result.length === 0) {
    await db.insert(categories).values(
      DEFAULT_CATEGORIES.map((cat) => ({
        userId: session.userId,
        name: cat.name,
        color: cat.color,
        icon: cat.icon,
      }))
    );

    result = await db
      .select()
      .from(categories)
      .where(eq(categories.userId, session.userId));
  }

  return NextResponse.json(result);
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = categorySchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const result = await db
    .insert(categories)
    .values({
      userId: session.userId,
      name: parsed.data.name,
      color: parsed.data.color,
      icon: parsed.data.icon,
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

  const parsed = categorySchema.safeParse(data);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const result = await db
    .update(categories)
    .set({
      name: parsed.data.name,
      color: parsed.data.color,
      icon: parsed.data.icon,
    })
    .where(and(eq(categories.id, id), eq(categories.userId, session.userId)))
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

  await db
    .delete(categories)
    .where(and(eq(categories.id, id), eq(categories.userId, session.userId)));

  return NextResponse.json({ success: true });
}
