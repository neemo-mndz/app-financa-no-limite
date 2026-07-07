"use client";

import { StatCard } from "@/components/ui/Card";
import { formatCurrency } from "@/lib/utils";
import {
  Wallet,
  TrendingDown,
  PiggyBank,
  Receipt,
  CalendarClock,
} from "lucide-react";

interface DashboardProps {
  limit: number;
  totalSpent: number;
  transactionCount: number;
  daysInMonth: number;
  currentDay: number;
}

export function Dashboard({
  limit,
  totalSpent,
  transactionCount,
  daysInMonth,
  currentDay,
}: DashboardProps) {
  const remaining = limit - totalSpent;
  const dailyAverage = currentDay > 0 ? totalSpent / currentDay : 0;
  const projectedTotal = dailyAverage * daysInMonth;
  const percentUsed = limit > 0 ? (totalSpent / limit) * 100 : 0;
  const dailyLimit = daysInMonth > 0 ? limit / daysInMonth : 0;
  const dailyRemaining = dailyLimit - dailyAverage;

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
            Uso do limite mensal
          </span>
          <span className="text-sm font-bold text-zinc-900 dark:text-white">
            {percentUsed.toFixed(1)}%
          </span>
        </div>
        <div className="h-3 w-full rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              percentUsed > 90
                ? "bg-red-500"
                : percentUsed > 70
                ? "bg-amber-500"
                : "bg-indigo-500"
            }`}
            style={{ width: `${Math.min(percentUsed, 100)}%` }}
          />
        </div>
        <div className="mt-2 flex justify-between text-xs text-zinc-400">
          <span>{formatCurrency(totalSpent)} gasto</span>
          <span>{formatCurrency(limit)} limite</span>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard
          title="Limite Mensal"
          value={formatCurrency(limit)}
          subtitle={`${transactionCount} transacoes`}
          icon={<Wallet className="h-5 w-5 text-indigo-600" />}
        />
        <StatCard
          title="Total Gasto"
          value={formatCurrency(totalSpent)}
          subtitle={`Media ${formatCurrency(dailyAverage)}/dia`}
          icon={<TrendingDown className="h-5 w-5 text-red-500" />}
          trend="down"
        />
        <StatCard
          title="Restante"
          value={formatCurrency(remaining)}
          subtitle={remaining < 0 ? "Limite excedido!" : "Disponivel"}
          icon={<PiggyBank className="h-5 w-5 text-emerald-600" />}
          trend={remaining >= 0 ? "up" : "down"}
        />
        <StatCard
          title="Limite Diario"
          value={formatCurrency(dailyLimit)}
          subtitle={
            dailyRemaining >= 0
              ? `Sobra ${formatCurrency(dailyRemaining)}/dia`
              : `Excedido em ${formatCurrency(Math.abs(dailyRemaining))}/dia`
          }
          icon={<CalendarClock className="h-5 w-5 text-cyan-600" />}
          trend={dailyRemaining >= 0 ? "up" : "down"}
        />
        <StatCard
          title="Projecao Fatura"
          value={formatCurrency(projectedTotal)}
          subtitle={
            projectedTotal > limit
              ? "Acima do limite!"
              : "Dentro do limite"
          }
          icon={<Receipt className="h-5 w-5 text-amber-600" />}
          trend={projectedTotal <= limit ? "up" : "down"}
        />
      </div>
    </div>
  );
}
