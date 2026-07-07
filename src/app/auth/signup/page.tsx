"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Wallet } from "lucide-react";
import Link from "next/link";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (password !== confirmPassword) {
      setError("As senhas não coincidem");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres");
      setLoading(false);
      return;
    }

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 dark:bg-zinc-950">
        <div className="w-full max-w-sm text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600">
            <Wallet className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
            Verifique seu e-mail
          </h2>
          <p className="mt-2 text-sm text-zinc-500">
            Enviamos um link de confirmação para <strong>{email}</strong>
          </p>
          <Button
            variant="secondary"
            className="mt-6"
            onClick={() => router.push("/auth/login")}
          >
            Voltar para Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 dark:bg-zinc-950">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600">
            <Wallet className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
            Criar Conta
          </h1>
          <p className="mt-2 text-sm text-zinc-500">
            Comece a controlar suas finanças
          </p>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <Input
            label="E-mail"
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            label="Senha"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Input
            label="Confirmar Senha"
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          {error && (
            <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950 dark:text-red-400">
              {error}
            </p>
          )}

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Criando..." : "Criar Conta"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-zinc-500">
          Já tem conta?{" "}
          <Link
            href="/auth/login"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Entrar
          </Link>
        </p>
      </div>
    </div>
  );
}
