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

  // Calculate ring progress
  const circumference = 2 * Math.PI * 54; // radius = 54
  const strokeDashoffset = circumference - (Math.min(percentUsed, 100) / 100) * circumference;

  const ringColor =
    percentUsed > 90
      ? "#ef4444"
      : percentUsed > 70
      ? "#f59e0b"
      : "#6366f1";

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Hero card with circular progress */}
      <div className="relative overflow-hidden rounded-3xl gradient-primary p-6 sm:p-8 shadow-xl shadow-indigo-500/20">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 h-48 w-48 rounded-full bg-white/5 translate-y-1/3 -translate-x-1/4" />

        <div className="relative flex flex-col sm:flex-row items-center gap-6 sm:gap-10">
          {/* Circular Progress */}
          <div className="relative flex-shrink-0">
            <svg className="h-32 w-32 -rotate-90" viewBox="0 0 120 120">
              <circle
                cx="60"
                cy="60"
                r="54"
                fill="none"
                stroke="rgba(255,255,255,0.15)"
                strokeWidth="8"
              />
              <circle
                cx="60"
                cy="60"
                r="54"
                fill="none"
                stroke="white"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-white">
                {Math.min(percentUsed, 100).toFixed(0)}%
              </span>
              <span className="text-xs text-white/60">usado</span>
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 text-center sm:text-left space-y-3">
            <div>
              <p className="text-sm text-white/60 font-medium">Gasto este mes</p>
              <p className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                {formatCurrency(totalSpent)}
              </p>
            </div>
            <div className="flex flex-wrap gap-4 justify-center sm:justify-start">
              <div>
                <p className="text-xs text-white/50">Limite</p>
                <p className="text-sm font-semibold text-white">{formatCurrency(limit)}</p>
              </div>
              <div>
                <p className="text-xs text-white/50">Restante</p>
                <p className="text-sm font-semibold text-white">{formatCurrency(remaining)}</p>
              </div>
              <div>
                <p className="text-xs text-white/50">Transacoes</p>
                <p className="text-sm font-semibold text-white">{transactionCount}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <StatCard
          title="Limite Diario"
          value={formatCurrency(dailyLimit)}
          subtitle={
            dailyRemaining >= 0
              ? `+${formatCurrency(dailyRemaining)} sobra`
              : `${formatCurrency(dailyRemaining)} excedido`
          }
          icon={<CalendarClock className="h-4 w-4 text-cyan-500" />}
          trend={dailyRemaining >= 0 ? "up" : "down"}
        />
        <StatCard
          title="Media/dia"
          value={formatCurrency(dailyAverage)}
          subtitle={`${currentDay} dias passados`}
          icon={<TrendingDown className="h-4 w-4 text-orange-500" />}
          trend="neutral"
        />
        <StatCard
          title="Restante"
          value={formatCurrency(remaining)}
          subtitle={remaining < 0 ? "Limite excedido!" : "Disponivel"}
          icon={<PiggyBank className="h-4 w-4 text-emerald-500" />}
          trend={remaining >= 0 ? "up" : "down"}
        />
        <StatCard
          title="Projecao"
          value={formatCurrency(projectedTotal)}
          subtitle={projectedTotal > limit ? "Acima!" : "OK"}
          icon={<Receipt className="h-4 w-4 text-amber-500" />}
          trend={projectedTotal <= limit ? "up" : "down"}
        />
      </div>
    </div>
  );
}
