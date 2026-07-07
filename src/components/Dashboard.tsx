"use client";

import { useState } from "react";
import { StatCard } from "@/components/ui/Card";
import { formatCurrency } from "@/lib/utils";
import { CurrencyInput } from "@/components/ui/CurrencyInput";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import {
  TrendingDown,
  PiggyBank,
  Receipt,
  CalendarClock,
  Clock,
  CreditCard,
  Plus,
  Trash2,
  X,
} from "lucide-react";

interface CardItem {
  id: string;
  name: string;
  invoiceAmount: string;
}

interface DashboardProps {
  limit: number;
  totalSpent: number;
  transactionCount: number;
  daysInMonth: number;
  currentDay: number;
  cards: CardItem[];
  onAddCard: (name: string, invoiceAmount: number) => void;
  onUpdateCard: (id: string, name: string, invoiceAmount: number) => void;
  onDeleteCard: (id: string) => void;
  children?: React.ReactNode;
}

export function Dashboard({
  limit,
  totalSpent,
  transactionCount,
  daysInMonth,
  currentDay,
  cards,
  onAddCard,
  onUpdateCard,
  onDeleteCard,
  children,
}: DashboardProps) {
  const [showCardModal, setShowCardModal] = useState(false);
  const [newCardName, setNewCardName] = useState("");
  const [newCardAmountCents, setNewCardAmountCents] = useState(0);

  const remaining = limit - totalSpent;
  const daysRemaining = Math.max(daysInMonth - currentDay, 0);
  const dailyAverage = currentDay > 0 ? totalSpent / currentDay : 0;
  const projectedExpenses = dailyAverage * daysInMonth;
  const percentUsed = limit > 0 ? (totalSpent / limit) * 100 : 0;

  // Daily limit base
  const dailyLimitBase = daysInMonth > 0 ? limit / daysInMonth : 0;

  // Dilution: remaining budget spread across remaining days
  const adjustedDailyLimit = daysRemaining > 0 ? remaining / daysRemaining : 0;

  // Total cards invoice
  const totalCardsInvoice = cards.reduce((sum, c) => sum + Number(c.invoiceAmount), 0);

  // Projection = projected expenses + cards invoice
  const totalProjection = projectedExpenses + totalCardsInvoice;

  // Circular progress
  const circumference = 2 * Math.PI * 54;
  const strokeDashoffset = circumference - (Math.min(percentUsed, 100) / 100) * circumference;

  const handleAddCard = () => {
    if (newCardName.trim() && newCardAmountCents > 0) {
      onAddCard(newCardName.trim(), newCardAmountCents / 100);
      setNewCardName("");
      setNewCardAmountCents(0);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Hero card with circular progress */}
      <div className="relative overflow-hidden rounded-3xl gradient-primary p-6 sm:p-8 shadow-xl shadow-indigo-500/20">
        <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 h-48 w-48 rounded-full bg-white/5 translate-y-1/3 -translate-x-1/4" />

        <div className="relative flex flex-col sm:flex-row items-center gap-6 sm:gap-10">
          {/* Circular Progress */}
          <div className="relative flex-shrink-0">
            <svg className="h-32 w-32 -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="8" />
              <circle cx="60" cy="60" r="54" fill="none" stroke="white" strokeWidth="8" strokeLinecap="round"
                strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
                className="transition-all duration-1000 ease-out" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-white">{Math.min(percentUsed, 100).toFixed(0)}%</span>
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

      {/* Transaction Form slot */}
      {children}

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-5">
        <StatCard
          title="Dias Restantes"
          value={`${daysRemaining}`}
          subtitle={`de ${daysInMonth} dias`}
          icon={<Clock className="h-4 w-4 text-indigo-500" />}
          trend="neutral"
        />
        <StatCard
          title="Limite Diario"
          value={formatCurrency(adjustedDailyLimit)}
          subtitle={
            adjustedDailyLimit > dailyLimitBase
              ? `+${formatCurrency(adjustedDailyLimit - dailyLimitBase)} bonus`
              : adjustedDailyLimit < dailyLimitBase
              ? `Base: ${formatCurrency(dailyLimitBase)}`
              : "Sem ajuste"
          }
          icon={<CalendarClock className="h-4 w-4 text-cyan-500" />}
          trend={adjustedDailyLimit >= dailyLimitBase ? "up" : "down"}
        />
        <StatCard
          title="Media/dia"
          value={formatCurrency(dailyAverage)}
          subtitle={`${currentDay} dias passados`}
          icon={<TrendingDown className="h-4 w-4 text-orange-500" />}
          trend={dailyAverage <= dailyLimitBase ? "up" : "down"}
        />
        <StatCard
          title="Restante"
          value={formatCurrency(remaining)}
          subtitle={remaining < 0 ? "Excedido!" : "Disponivel"}
          icon={<PiggyBank className="h-4 w-4 text-emerald-500" />}
          trend={remaining >= 0 ? "up" : "down"}
        />
        {/* Projection card - clickable */}
        <div
          className="cursor-pointer"
          onClick={() => setShowCardModal(true)}
        >
          <StatCard
            title="Projecao"
            value={formatCurrency(totalProjection)}
            subtitle={
              totalCardsInvoice > 0
                ? `${cards.length} cartao(oes) + gastos`
                : "Clique p/ add cartao"
            }
            icon={<CreditCard className="h-4 w-4 text-amber-500" />}
            trend={totalProjection <= limit ? "up" : "down"}
          />
        </div>
      </div>

      {/* Card Modal */}
      {showCardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowCardModal(false)} />
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-zinc-900 animate-slide-up">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-indigo-500" />
                  Cartoes & Projecao
                </h2>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Gastos projetados: {formatCurrency(projectedExpenses)} + Cartoes: {formatCurrency(totalCardsInvoice)}
                </p>
              </div>
              <button onClick={() => setShowCardModal(false)} className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800">
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Existing cards list */}
            <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
              {cards.length === 0 ? (
                <p className="text-sm text-zinc-400 text-center py-4">Nenhum cartao adicionado</p>
              ) : (
                cards.map((card) => (
                  <div key={card.id} className="flex items-center justify-between rounded-xl bg-zinc-50 p-3 dark:bg-zinc-800/50">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-indigo-400" />
                      <div>
                        <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{card.name}</p>
                        <p className="text-xs text-zinc-400">Fatura: {formatCurrency(Number(card.invoiceAmount))}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => onDeleteCard(card.id)}
                      className="rounded-lg p-1.5 text-zinc-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Total */}
            <div className="rounded-xl bg-indigo-50 p-3 mb-4 dark:bg-indigo-950/30">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-indigo-700 dark:text-indigo-300">Total Projecao</span>
                <span className="text-lg font-bold text-indigo-700 dark:text-indigo-300">{formatCurrency(totalProjection)}</span>
              </div>
            </div>

            {/* Add new card */}
            <div className="border-t border-zinc-200 pt-4 dark:border-zinc-800">
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-3">Adicionar cartao</p>
              <div className="space-y-3">
                <Input
                  placeholder="Nome do cartao (ex: Nubank)"
                  value={newCardName}
                  onChange={(e) => setNewCardName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddCard()}
                />
                <CurrencyInput
                  value={newCardAmountCents}
                  onChange={setNewCardAmountCents}
                  placeholder="Valor da fatura"
                />
                <Button onClick={handleAddCard} variant="gradient" className="w-full">
                  <Plus className="h-4 w-4" />
                  Adicionar Cartao
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
