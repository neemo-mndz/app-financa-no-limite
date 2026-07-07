"use client";

import { useState, useRef } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { CurrencyInput } from "@/components/ui/CurrencyInput";
import { Zap } from "lucide-react";
import type { Category } from "@/db/schema";

interface TransactionFormProps {
  categories: Category[];
  month: number;
  year: number;
  onSubmit: (data: {
    description: string;
    amount: number;
    categoryId: string | null;
    month: number;
    year: number;
  }) => void;
}

export function TransactionForm({
  categories,
  month,
  year,
  onSubmit,
}: TransactionFormProps) {
  const [description, setDescription] = useState("");
  const [amountCents, setAmountCents] = useState(0);
  const [categoryId, setCategoryId] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const descRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!description.trim()) {
      newErrors.description = "Obrigatorio";
    }
    if (amountCents <= 0) {
      newErrors.amount = "Valor invalido";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const amountReais = amountCents / 100;

    onSubmit({
      description: description.trim(),
      amount: amountReais,
      categoryId: categoryId || null,
      month,
      year,
    });

    setDescription("");
    setAmountCents(0);
    setCategoryId("");
    setErrors({});
    // Focus back on description for quick consecutive entries
    descRef.current?.focus();
  };

  return (
    <Card className="animate-fade-in stagger-2">
      <form onSubmit={handleSubmit}>
        <div className="flex items-center gap-2 mb-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary shadow-sm shadow-indigo-500/20">
            <Zap className="h-4 w-4 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
              Adicionar gasto
            </h3>
            <p className="text-xs text-zinc-400">Input rapido</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-12">
          <div className="sm:col-span-4">
            <Input
              ref={descRef}
              placeholder="O que voce gastou?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              error={errors.description}
            />
          </div>
          <div className="sm:col-span-3">
            <CurrencyInput
              value={amountCents}
              onChange={setAmountCents}
              error={errors.amount}
              placeholder="R$ 0,00"
            />
          </div>
          <div className="sm:col-span-3">
            <Select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              placeholder="Categoria"
              options={categories.map((c) => ({
                value: c.id,
                label: c.name,
              }))}
            />
          </div>
          <div className="sm:col-span-2">
            <Button type="submit" variant="gradient" className="w-full h-11">
              <Zap className="h-4 w-4" />
              Adicionar
            </Button>
          </div>
        </div>
      </form>
    </Card>
  );
}
