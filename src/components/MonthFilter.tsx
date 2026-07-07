"use client";

import { Button } from "@/components/ui/Button";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Cores simples para diferenciar meses no filtro
const MONTH_COLORS = [
  "#6366f1", "#ec4899", "#10b981", "#f59e0b",
  "#8b5cf6", "#06b6d4", "#3b82f6", "#ef4444",
  "#14b8a6", "#f97316", "#a855f7", "#22c55e",
];

interface MonthFilterProps {
  month: number;
  year: number;
  onChange: (month: number, year: number) => void;
}

const MONTH_NAMES = [
  "Jan", "Fev", "Mar", "Abr",
  "Mai", "Jun", "Jul", "Ago",
  "Set", "Out", "Nov", "Dez",
];

export function MonthFilter({ month, year, onChange }: MonthFilterProps) {
  const handlePrev = () => {
    if (month === 1) {
      onChange(12, year - 1);
    } else {
      onChange(month - 1, year);
    }
  };

  const handleNext = () => {
    if (month === 12) {
      onChange(1, year + 1);
    } else {
      onChange(month + 1, year);
    }
  };

  const handleCurrent = () => {
    const now = new Date();
    onChange(now.getMonth() + 1, now.getFullYear());
  };

  const isCurrentMonth =
    month === new Date().getMonth() + 1 && year === new Date().getFullYear();

  const monthColor = MONTH_COLORS[month - 1];

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={handlePrev}
        className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <div className="flex items-center gap-2 rounded-xl bg-zinc-100 px-4 py-2 dark:bg-zinc-800">
        <div
          className="h-2.5 w-2.5 rounded-full transition-colors duration-300"
          style={{ backgroundColor: monthColor }}
        />
        <span className="text-sm font-bold text-zinc-900 dark:text-white">
          {MONTH_NAMES[month - 1]}
        </span>
        <span className="text-sm text-zinc-400 dark:text-zinc-500">
          {year}
        </span>
      </div>
      <button
        onClick={handleNext}
        className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
      {!isCurrentMonth && (
        <Button variant="ghost" size="sm" onClick={handleCurrent} className="ml-1 text-xs">
          Hoje
        </Button>
      )}
    </div>
  );
}
