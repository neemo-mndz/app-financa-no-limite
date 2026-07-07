"use client";

import { Button } from "@/components/ui/Button";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";

interface MonthFilterProps {
  month: number;
  year: number;
  onChange: (month: number, year: number) => void;
}

const MONTH_NAMES = [
  "Janeiro", "Fevereiro", "Março", "Abril",
  "Maio", "Junho", "Julho", "Agosto",
  "Setembro", "Outubro", "Novembro", "Dezembro",
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

  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="sm" onClick={handlePrev}>
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <div className="flex items-center gap-2 min-w-[160px] justify-center">
        <Calendar className="h-4 w-4 text-zinc-400" />
        <span className="text-sm font-semibold text-zinc-900 dark:text-white">
          {MONTH_NAMES[month - 1]} {year}
        </span>
      </div>
      <Button variant="ghost" size="sm" onClick={handleNext}>
        <ChevronRight className="h-4 w-4" />
      </Button>
      <Button variant="secondary" size="sm" onClick={handleCurrent}>
        Hoje
      </Button>
    </div>
  );
}
