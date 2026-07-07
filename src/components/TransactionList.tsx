"use client";

import { Card, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { formatCurrency, formatDate } from "@/lib/utils";
import { getCategoryEmoji } from "@/lib/category-icons";
import { Trash2, FileDown, FileText } from "lucide-react";
import type { Transaction, Category } from "@/db/schema";

interface TransactionListProps {
  transactions: Transaction[];
  categories: Category[];
  onDelete: (id: string) => void;
  onExportCSV: () => void;
  onExportPDF: () => void;
}

export function TransactionList({
  transactions,
  categories,
  onDelete,
  onExportCSV,
  onExportPDF,
}: TransactionListProps) {
  const getCategoryById = (id: string | null) => {
    if (!id) return null;
    return categories.find((c) => c.id === id);
  };

  return (
    <Card>
      <CardHeader
        title="Transacoes"
        subtitle={`${transactions.length} registros`}
        action={
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={onExportCSV}>
              <FileDown className="h-4 w-4" />
              <span className="hidden sm:inline">CSV</span>
            </Button>
            <Button variant="secondary" size="sm" onClick={onExportPDF}>
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">PDF</span>
            </Button>
          </div>
        }
      />

      {transactions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="rounded-full bg-zinc-100 p-4 dark:bg-zinc-800">
            <ReceiptIcon className="h-8 w-8 text-zinc-400" />
          </div>
          <p className="mt-4 text-sm font-medium text-zinc-500">
            Nenhuma transacao encontrada
          </p>
          <p className="mt-1 text-xs text-zinc-400">
            Adicione seu primeiro gasto acima
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {transactions.map((t) => {
            const category = getCategoryById(t.categoryId);
            return (
              <div
                key={t.id}
                className="flex items-center justify-between rounded-xl border border-zinc-100 p-4 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-800/50"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg"
                    style={{
                      backgroundColor: category
                        ? `${category.color}20`
                        : undefined,
                    }}
                  >
                    {getCategoryEmoji(category?.icon, category?.name || t.description)}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">
                      {t.description}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      {category && (
                        <span
                          className="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium"
                          style={{
                            backgroundColor: `${category.color}15`,
                            color: category.color,
                          }}
                        >
                          {category.name}
                        </span>
                      )}
                      <span className="text-xs text-zinc-400">
                        {formatDate(t.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                    {formatCurrency(Number(t.amount))}
                  </span>
                  <button
                    onClick={() => onDelete(t.id)}
                    className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950"
                  >
                    <Trash2 className="h-4 w-4" />
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

function ReceiptIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z" />
      <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
      <path d="M12 17.5v-11" />
    </svg>
  );
}
