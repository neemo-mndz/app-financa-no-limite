"use client";

import { useState } from "react";
import { Card, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { CurrencyInput } from "@/components/ui/CurrencyInput";
import { formatCurrency, formatDate } from "@/lib/utils";
import { getCategoryEmoji } from "@/lib/category-icons";
import { Trash2, FileDown, FileText, Pencil, X, Check, Calendar } from "lucide-react";
import type { Transaction, Category } from "@/db/schema";

interface TransactionListProps {
  transactions: Transaction[];
  categories: Category[];
  onDelete: (id: string) => void;
  onEdit: (id: string, description: string, amount: number, categoryId: string | null, date: string | null) => void;
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
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [editDesc, setEditDesc] = useState("");
  const [editAmountCents, setEditAmountCents] = useState(0);
  const [editCategoryId, setEditCategoryId] = useState("");
  const [editDate, setEditDate] = useState("");

  const getCategoryById = (id: string | null) => {
    if (!id) return null;
    return categories.find((c) => c.id === id);
  };

  const openEditModal = (t: Transaction) => {
    setEditingTransaction(t);
    setEditDesc(t.description);
    setEditAmountCents(Math.round(Number(t.amount) * 100));
    setEditCategoryId(t.categoryId || "");
    // Format date for input type="date"
    const d = new Date(t.createdAt);
    setEditDate(d.toISOString().split("T")[0]);
  };

  const saveEdit = () => {
    if (editingTransaction && editDesc.trim() && editAmountCents > 0) {
      onEdit(
        editingTransaction.id,
        editDesc.trim(),
        editAmountCents / 100,
        editCategoryId || null,
        editDate || null
      );
      setEditingTransaction(null);
    }
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
                <div className="flex items-center gap-1">
                  <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100 tabular-nums mr-1">
                    -{formatCurrency(Number(t.amount))}
                  </span>
                  <button
                    onClick={() => openEditModal(t)}
                    className="rounded-lg p-1.5 text-zinc-400 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-150 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => onDelete(t.id)}
                    className="rounded-lg p-1.5 text-zinc-400 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-150 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950 dark:hover:text-red-400"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit Modal */}
      {editingTransaction && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setEditingTransaction(null)} />
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-zinc-900 animate-slide-up">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
                  Editar Gasto
                </h2>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Altere as informacoes abaixo
                </p>
              </div>
              <button onClick={() => setEditingTransaction(null)} className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4">
              <Input
                label="Descricao"
                value={editDesc}
                onChange={(e) => setEditDesc(e.target.value)}
                placeholder="O que voce gastou?"
              />
              <CurrencyInput
                label="Valor"
                value={editAmountCents}
                onChange={setEditAmountCents}
              />
              <Select
                label="Categoria"
                value={editCategoryId}
                onChange={(e) => setEditCategoryId(e.target.value)}
                placeholder="Sem categoria"
                options={categories.map((c) => ({ value: c.id, label: c.name }))}
              />
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  Data
                </label>
                <input
                  type="date"
                  value={editDate}
                  onChange={(e) => setEditDate(e.target.value)}
                  className="flex h-11 w-full rounded-xl border border-zinc-200/80 bg-zinc-50 px-4 text-sm text-zinc-900 transition-all duration-200 focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 dark:border-zinc-700/80 dark:bg-zinc-800/50 dark:text-zinc-100 dark:focus:border-indigo-500 dark:focus:bg-zinc-800 dark:focus:ring-indigo-500/20"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <Button onClick={saveEdit} variant="gradient" className="flex-1">
                  <Check className="h-4 w-4" />
                  Salvar
                </Button>
                <Button variant="secondary" onClick={() => setEditingTransaction(null)} className="flex-1">
                  Cancelar
                </Button>
              </div>

              <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800">
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => { onDelete(editingTransaction.id); setEditingTransaction(null); }}
                  className="w-full"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Excluir este gasto
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
