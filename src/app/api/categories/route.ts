import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { categories } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { createClient } from "@/lib/supabase/server";
import { categorySchema } from "@/lib/validations";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await db
    .select()
    .from(categories)
    .where(eq(categories.userId, user.id));

  return NextResponse.json(result);
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
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
      userId: user.id,
      name: parsed.data.name,
      color: parsed.data.color,
      icon: parsed.data.icon,
    })
    .returning();

  return NextResponse.json(result[0], { status: 201 });
}

export async function PUT(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
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
    .where(and(eq(categories.id, id), eq(categories.userId, user.id)))
    .returning();

  return NextResponse.json(result[0]);
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
    .delete(categories)
    .where(and(eq(categories.id, id), eq(categories.userId, user.id)));

  return NextResponse.json({ success: true });
}
