import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { userSettings } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getSession } from "@/lib/auth";
import { settingsSchema } from "@/lib/validations";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await db
    .select()
    .from(userSettings)
    .where(eq(userSettings.userId, session.userId));

  if (result.length === 0) {
    const newSettings = await db
      .insert(userSettings)
      .values({
        userId: session.userId,
        monthlyLimit: "5000",
      })
      .returning();
    return NextResponse.json(newSettings[0]);
  }

  return NextResponse.json(result[0]);
}

export async function PUT(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = settingsSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const existing = await db
    .select()
    .from(userSettings)
    .where(eq(userSettings.userId, session.userId));

  if (existing.length === 0) {
    const result = await db
      .insert(userSettings)
      .values({
        userId: session.userId,
        monthlyLimit: parsed.data.monthlyLimit.toString(),
      })
      .returning();
    return NextResponse.json(result[0]);
  }

  const result = await db
    .update(userSettings)
    .set({
      monthlyLimit: parsed.data.monthlyLimit.toString(),
      updatedAt: new Date(),
    })
    .where(eq(userSettings.userId, session.userId))
    .returning();

  return NextResponse.json(result[0]);
}
