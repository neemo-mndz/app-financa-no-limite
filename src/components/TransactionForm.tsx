"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Plus } from "lucide-react";
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
  const [amount, setAmount] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!description.trim()) {
      newErrors.description = "Descrição é obrigatória";
    }
    if (!amount || Number(amount) <= 0) {
      newErrors.amount = "Valor deve ser positivo";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit({
      description: description.trim(),
      amount: Number(amount),
      categoryId: categoryId || null,
      month,
      year,
    });

    setDescription("");
    setAmount("");
    setCategoryId("");
    setErrors({});
  };

  return (
    <Card>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="rounded-lg bg-indigo-100 p-1.5 dark:bg-indigo-900/30">
            <Plus className="h-4 w-4 text-indigo-600" />
          </div>
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
            Novo Gasto
          </h3>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Input
            placeholder="Descrição do gasto"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            error={errors.description}
            className="sm:col-span-2 lg:col-span-1"
          />
          <Input
            type="number"
            placeholder="0,00"
            step="0.01"
            min="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            error={errors.amount}
          />
          <Select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            placeholder="Categoria (opcional)"
            options={categories.map((c) => ({
              value: c.id,
              label: c.name,
            }))}
          />
          <Button type="submit" className="w-full">
            <Plus className="h-4 w-4" />
            Adicionar
          </Button>
        </div>
      </form>
    </Card>
  );
}
