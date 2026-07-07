"use client";

import { useState } from "react";
import { Card, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { CurrencyInput } from "@/components/ui/CurrencyInput";
import { formatCurrency, formatDate } from "@/lib/utils";
import { getCategoryEmoji } from "@/lib/category-icons";
import { Trash2, FileDown, FileText, Pencil, X, Check } from "lucide-react";
import type { Transaction, Category } from "@/db/schema";

interface TransactionListProps {
  transactions: Transaction[];
  categories: Category[];
  onDelete: (id: string) => void;
  onEdit: (id: string, description: string, amount: number, categoryId: string | null) => void;
  onExportCSV: () => void;
  onExportPDF: () => void;
}

export function TransactionList({
  transactions,
  categories,
  onDelete,
  onEdit,
  onExportCSV,
  onExportPDF,
}: TransactionListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDesc, setEditDesc] = useState("");
  const [editAmountCents, setEditAmountCents] = useState(0);
  const [editCategoryId, setEditCategoryId] = useState("");

  const getCategoryById = (id: string | null) => {
    if (!id) return null;
    return categories.find((c) => c.id === id);
  };

  const startEdit = (t: Transaction) => {
    setEditingId(t.id);
    setEditDesc(t.description);
    setEditAmountCents(Math.round(Number(t.amount) * 100));
    setEditCategoryId(t.categoryId || "");
  };

  const saveEdit = () => {
    if (editingId && editDesc.trim() && editAmountCents > 0) {
      onEdit(editingId, editDesc.trim(), editAmountCents / 100, editCategoryId || null);
      setEditingId(null);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  return (
    <Card className="animate-fade-in stagger-3">
      <CardHeader
        title="Transacoes"
        subtitle={`${transactions.length} registros`}
        action={
          <div className="flex items-center gap-1.5">
            <Button variant="ghost" size="sm" onClick={onExportCSV}>
              <FileDown className="h-3.5 w-3.5" />
              <span className="hidden sm:inline text-xs">CSV</span>
            </Button>
            <Button variant="ghost" size="sm" onClick={onExportPDF}>
              <FileText className="h-3.5 w-3.5" />
              <span className="hidden sm:inline text-xs">PDF</span>
            </Button>
          </div>
        }
      />

      {transactions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-4 text-5xl">📭</div>
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
            Nenhuma transacao ainda
          </p>
          <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-600">
            Adicione seu primeiro gasto acima
          </p>
        </div>
      ) : (
        <div className="space-y-1.5 max-h-[480px] overflow-y-auto pr-1">
          {transactions.map((t, idx) => {
            const category = getCategoryById(t.categoryId);
            const isEditing = editingId === t.id;

            if (isEditing) {
              return (
                <div
                  key={t.id}
                  className="rounded-xl border border-indigo-200/50 bg-indigo-50/30 p-3 dark:border-indigo-800/30 dark:bg-indigo-950/20 animate-fade-in"
                >
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-12">
                    <div className="sm:col-span-4">
                      <Input
                        value={editDesc}
                        onChange={(e) => setEditDesc(e.target.value)}
                        placeholder="Descricao"
                        onKeyDown={(e) => e.key === "Enter" && saveEdit()}
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <CurrencyInput
                        value={editAmountCents}
                        onChange={setEditAmountCents}
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <Select
                        value={editCategoryId}
                        onChange={(e) => setEditCategoryId(e.target.value)}
                        placeholder="Categoria"
                        options={categories.map((c) => ({ value: c.id, label: c.name }))}
                      />
                    </div>
                    <div className="sm:col-span-2 flex gap-1.5">
                      <Button size="sm" onClick={saveEdit} className="flex-1 h-11">
                        <Check className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={cancelEdit} className="h-11">
                        <X className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={t.id}
                className="group flex items-center justify-between rounded-xl p-3 transition-all duration-150 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 animate-fade-in"
                style={{ animationDelay: `${idx * 0.03}s` }}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg transition-transform duration-200 group-hover:scale-110"
                    style={{
                      backgroundColor: category
                        ? `${category.color}15`
                        : "rgba(161,161,170,0.1)",
                    }}
                  >
                    {getCategoryEmoji(category?.icon, category?.name || t.description)}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-zinc-800 dark:text-zinc-200">
                      {t.description}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      {category && (
                        <span
                          className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
                          style={{
                            backgroundColor: `${category.color}12`,
                            color: category.color,
                          }}
                        >
                          {category.name}
                        </span>
                      )}
                      <span className="text-[11px] text-zinc-400 dark:text-zinc-600">
                        {formatDate(t.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100 tabular-nums">
                    -{formatCurrency(Number(t.amount))}
                  </span>
                  <button
                    onClick={() => startEdit(t)}
                    className="rounded-lg p-1.5 text-zinc-300 opacity-0 transition-all duration-150 group-hover:opacity-100 hover:bg-zinc-100 hover:text-zinc-600 dark:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => onDelete(t.id)}
                    className="rounded-lg p-1.5 text-zinc-300 opacity-0 transition-all duration-150 group-hover:opacity-100 hover:bg-red-50 hover:text-red-500 dark:text-zinc-600 dark:hover:bg-red-950 dark:hover:text-red-400"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
