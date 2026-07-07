import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users, categories } from "@/db/schema";
import { eq } from "drizzle-orm";
import { hashPassword, createToken, setSessionCookie } from "@/lib/auth";
import { z } from "zod";

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

const signupSchema = z.object({
  email: z.string().email("E-mail invalido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
  name: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = signupSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { email, password, name } = parsed.data;

    // Check if user already exists
    const existing = await db
      .select()
      .from(users)
      .where(eq(users.email, email.toLowerCase()));

    if (existing.length > 0) {
      return NextResponse.json(
        { error: "E-mail ja cadastrado" },
        { status: 409 }
      );
    }

    // Create user
    const passwordHash = await hashPassword(password);
    const result = await db
      .insert(users)
      .values({
        email: email.toLowerCase(),
        passwordHash,
        name: name || null,
      })
      .returning({ id: users.id, email: users.email });

    const user = result[0];

    // Create default categories for the user
    await db.insert(categories).values(
      DEFAULT_CATEGORIES.map((cat) => ({
        userId: user.id,
        name: cat.name,
        color: cat.color,
        icon: cat.icon,
      }))
    );

    // Create session
    const token = await createToken({ userId: user.id, email: user.email });
    await setSessionCookie(token);

    return NextResponse.json(
      { user: { id: user.id, email: user.email } },
      { status: 201 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Signup error:", message, error);
    return NextResponse.json(
      { error: `Erro interno: ${message}` },
      { status: 500 }
    );
  }
}
