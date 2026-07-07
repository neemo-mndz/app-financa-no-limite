"use client";

import { useState } from "react";
import { Card, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { CurrencyInput } from "@/components/ui/CurrencyInput";
import { formatCurrency } from "@/lib/utils";
import { getCategoryEmoji } from "@/lib/category-icons";
import { X, Trash2, Pencil, Check } from "lucide-react";
import type { Transaction, Category } from "@/db/schema";

interface CalendarProps {
  transactions: Transaction[];
  categories: Category[];
  month: number;
  year: number;
  onDelete: (id: string) => void;
  onEdit: (id: string, description: string, amount: number, categoryId: string | null, date: string | null) => void;
}

export function Calendar({ transactions, categories, month, year, onDelete, onEdit }: CalendarProps) {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [editDesc, setEditDesc] = useState("");
  const [editAmountCents, setEditAmountCents] = useState(0);
  const [editCategoryId, setEditCategoryId] = useState("");
  const [editDate, setEditDate] = useState("");

  const daysInMonth = new Date(year, month, 0).getDate();
  const firstDayOfWeek = new Date(year, month - 1, 1).getDay();

  const spendingByDay: Record<number, number> = {};
  const transactionsByDay: Record<number, Transaction[]> = {};

  transactions.forEach((t) => {
    const day = new Date(t.createdAt).getDate();
    spendingByDay[day] = (spendingByDay[day] || 0) + Number(t.amount);
    if (!transactionsByDay[day]) transactionsByDay[day] = [];
    transactionsByDay[day].push(t);
  });

  const maxSpending = Math.max(...Object.values(spendingByDay), 1);

  const today = new Date();
  const isCurrentMonth = today.getMonth() + 1 === month && today.getFullYear() === year;
  const currentDay = isCurrentMonth ? today.getDate() : -1;

  const dayNames = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDayOfWeek; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  const getHeatColor = (amount: number): string => {
    if (amount === 0) return "";
    const intensity = Math.min(amount / maxSpending, 1);
    if (intensity > 0.7) return "bg-red-100 dark:bg-red-950/40";
    if (intensity > 0.4) return "bg-amber-100 dark:bg-amber-950/30";
    return "bg-indigo-50 dark:bg-indigo-950/20";
  };

  const selectedTransactions = selectedDay ? transactionsByDay[selectedDay] || [] : [];
  const selectedTotal = selectedTransactions.reduce((sum, t) => sum + Number(t.amount), 0);

  const openEditModal = (t: Transaction) => {
    setEditingTransaction(t);
    setEditDesc(t.description);
    setEditAmountCents(Math.round(Number(t.amount) * 100));
    setEditCategoryId(t.categoryId || "");
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
    <Card className="animate-fade-in">
      <CardHeader title="Calendario" subtitle="Gastos por dia" />

      <div className="grid grid-cols-7 gap-1 mb-1">
        {dayNames.map((name) => (
          <div key={name} className="text-center text-[10px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-600 py-1">
            {name}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, idx) => {
          if (day === null) return <div key={`empty-${idx}`} className="aspect-square" />;

          const spending = spendingByDay[day] || 0;
          const isToday = day === currentDay;
          const hasSpending = spending > 0;

          return (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`
                aspect-square rounded-lg flex flex-col items-center justify-center gap-0.5 text-xs transition-all duration-150 relative
                ${isToday ? "ring-2 ring-indigo-500 ring-offset-1 dark:ring-offset-zinc-900" : ""}
                ${hasSpending ? getHeatColor(spending) : "hover:bg-zinc-50 dark:hover:bg-zinc-800/50"}
                ${selectedDay === day ? "bg-indigo-100 dark:bg-indigo-900/40 scale-105" : ""}
              `}
            >
              <span className={`font-medium ${isToday ? "text-indigo-600 dark:text-indigo-400" : "text-zinc-700 dark:text-zinc-300"}`}>
                {day}
              </span>
              {hasSpending && (
                <span className="text-[9px] font-bold text-zinc-500 dark:text-zinc-400 leading-none truncate w-full text-center px-0.5">
                  {spending >= 1000 ? `${(spending / 1000).toFixed(1)}k` : spending.toFixed(0)}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-3 mt-3 pt-3 border-t border-zinc-100 dark:border-zinc-800">
        <div className="flex items-center gap-1">
          <div className="h-3 w-3 rounded bg-indigo-50 dark:bg-indigo-950/20 border border-zinc-200 dark:border-zinc-700" />
          <span className="text-[10px] text-zinc-400">Baixo</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="h-3 w-3 rounded bg-amber-100 dark:bg-amber-950/30 border border-zinc-200 dark:border-zinc-700" />
          <span className="text-[10px] text-zinc-400">Medio</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="h-3 w-3 rounded bg-red-100 dark:bg-red-950/40 border border-zinc-200 dark:border-zinc-700" />
          <span className="text-[10px] text-zinc-400">Alto</span>
        </div>
      </div>

      {/* Day detail popup */}
      {selectedDay !== null && !editingTransaction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSelectedDay(null)} />
          <div className="relative w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl dark:bg-zinc-900 animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-zinc-900 dark:text-white">
                  Dia {selectedDay}
                </h3>
                <p className="text-xs text-zinc-400">
                  {selectedTransactions.length} gasto(s) &mdash; Total: {formatCurrency(selectedTotal)}
                </p>
              </div>
              <button onClick={() => setSelectedDay(null)} className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800">
                <X className="h-4 w-4" />
              </button>
            </div>

            {selectedTransactions.length === 0 ? (
              <p className="text-sm text-zinc-400 text-center py-6">Nenhum gasto neste dia</p>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {selectedTransactions.map((t) => {
                  const category = categories.find((c) => c.id === t.categoryId);
                  return (
                    <div key={t.id} className="flex items-center justify-between rounded-xl bg-zinc-50 p-3 dark:bg-zinc-800/50">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm"
                          style={{ backgroundColor: category ? `${category.color}15` : "rgba(161,161,170,0.1)" }}
                        >
                          {getCategoryEmoji(category?.icon, category?.name || t.description)}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-zinc-700 dark:text-zinc-300">
                            {t.description}
                          </p>
                          {category && (
                            <span className="text-[10px] text-zinc-400">{category.name}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                          {formatCurrency(Number(t.amount))}
                        </span>
                        <button
                          onClick={() => openEditModal(t)}
                          className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-700"
                        >
                          <Pencil className="h-3 w-3" />
                        </button>
                        <button
                          onClick={() => onDelete(t.id)}
                          className="rounded-lg p-1.5 text-zinc-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingTransaction && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setEditingTransaction(null)} />
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-zinc-900 animate-slide-up">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Editar Gasto</h2>
                <p className="text-xs text-zinc-400 mt-0.5">Altere as informacoes abaixo</p>
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
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Data</label>
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
                  onClick={() => { onDelete(editingTransaction.id); setEditingTransaction(null); setSelectedDay(null); }}
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
