"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Dashboard } from "@/components/Dashboard";
import { TransactionForm } from "@/components/TransactionForm";
import { TransactionList } from "@/components/TransactionList";
import { CategoryManager } from "@/components/CategoryManager";
import { Calendar } from "@/components/Calendar";
import { MonthFilter } from "@/components/MonthFilter";
import { SettingsModal } from "@/components/SettingsModal";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LogOut, Wallet } from "lucide-react";
import { getCurrentMonthYear, formatCurrency } from "@/lib/utils";
import type { Transaction, Category } from "@/db/schema";
import Papa from "papaparse";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

interface CardItem {
  id: string;
  name: string;
  invoiceAmount: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [cards, setCards] = useState<CardItem[]>([]);
  const [monthlyLimit, setMonthlyLimit] = useState(5000);
  const [loading, setLoading] = useState(true);
  const { month: currentMonth, year: currentYear } = getCurrentMonthYear();
  const [month, setMonth] = useState(currentMonth);
  const [year, setYear] = useState(currentYear);
  const [userEmail, setUserEmail] = useState("");

  const fetchData = useCallback(async () => {
    try {
      const [transRes, catRes, settingsRes, cardsRes] = await Promise.all([
        fetch(`/api/transactions?month=${month}&year=${year}`),
        fetch("/api/categories"),
        fetch("/api/settings"),
        fetch(`/api/cards?month=${month}&year=${year}`),
      ]);

      if (transRes.ok) setTransactions(await transRes.json());
      if (catRes.ok) setCategories(await catRes.json());
      if (settingsRes.ok) {
        const data = await settingsRes.json();
        setMonthlyLimit(Number(data.monthlyLimit));
      }
      if (cardsRes.ok) setCards(await cardsRes.json());
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, [month, year]);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (!res.ok) { router.push("/auth/login"); return; }
        const data = await res.json();
        setUserEmail(data.user.email);
        fetchData();
      } catch { router.push("/auth/login"); }
    };
    checkUser();
  }, [fetchData, router]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/auth/login");
    router.refresh();
  };

  const handleAddTransaction = async (data: {
    description: string; amount: number; categoryId: string | null; month: number; year: number;
  }) => {
    const res = await fetch("/api/transactions", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data),
    });
    if (res.ok) {
      await fetchData();
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    const res = await fetch(`/api/transactions?id=${id}`, { method: "DELETE" });
    if (res.ok) await fetchData();
  };

  const handleAddCategory = async (name: string, color: string) => {
    const res = await fetch("/api/categories", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, color }),
    });
    if (res.ok) await fetchData();
  };

  const handleUpdateCategory = async (id: string, name: string, color: string) => {
    const res = await fetch("/api/categories", {
      method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, name, color }),
    });
    if (res.ok) await fetchData();
  };

  const handleDeleteCategory = async (id: string) => {
    const res = await fetch(`/api/categories?id=${id}`, { method: "DELETE" });
    if (res.ok) await fetchData();
  };

  const handleUpdateLimit = async (limit: number) => {
    const res = await fetch("/api/settings", {
      method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ monthlyLimit: limit }),
    });
    if (res.ok) setMonthlyLimit(limit);
  };

  const handleAddCard = async (name: string, invoiceAmount: number) => {
    const res = await fetch("/api/cards", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, invoiceAmount, month, year }),
    });
    if (res.ok) await fetchData();
  };

  const handleUpdateCard = async (id: string, name: string, invoiceAmount: number) => {
    const res = await fetch("/api/cards", {
      method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, name, invoiceAmount, month, year }),
    });
    if (res.ok) await fetchData();
  };

  const handleDeleteCard = async (id: string) => {
    const res = await fetch(`/api/cards?id=${id}`, { method: "DELETE" });
    if (res.ok) await fetchData();
  };

  const handleExportCSV = () => {
    const data = transactions.map((t) => {
      const category = categories.find((c) => c.id === t.categoryId);
      return {
        Descricao: t.description,
        Valor: Number(t.amount),
        Categoria: category?.name || "Sem categoria",
        Data: new Date(t.createdAt).toLocaleDateString("pt-BR"),
      };
    });
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `gastos-${month}-${year}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    const monthNames = [
      "Janeiro", "Fevereiro", "Marco", "Abril", "Maio", "Junho",
      "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
    ];
    const totalSpent = transactions.reduce((sum, t) => sum + Number(t.amount), 0);
    const remaining = monthlyLimit - totalSpent;
    const dIM = new Date(year, month, 0).getDate();
    const dailyLimit = monthlyLimit / dIM;

    doc.setFontSize(22);
    doc.setTextColor(99, 102, 241);
    doc.text("Financa no Limite", 14, 22);
    doc.setFontSize(9);
    doc.setTextColor(120);
    doc.text(`${monthNames[month - 1]} ${year} | ${userEmail}`, 14, 30);
    doc.setDrawColor(230);
    doc.line(14, 34, 196, 34);
    doc.setFontSize(11);
    doc.setTextColor(40);
    doc.text("Resumo", 14, 42);
    doc.setFontSize(9);
    doc.setTextColor(80);
    doc.text(`Limite Mensal: ${formatCurrency(monthlyLimit)}`, 14, 50);
    doc.text(`Limite Diario: ${formatCurrency(dailyLimit)}`, 14, 56);
    doc.text(`Total Gasto: ${formatCurrency(totalSpent)}`, 100, 50);
    doc.text(`Restante: ${formatCurrency(remaining)}`, 100, 56);

    const tableData = transactions.map((t) => {
      const category = categories.find((c) => c.id === t.categoryId);
      return [t.description, category?.name || "-", formatCurrency(Number(t.amount)), new Date(t.createdAt).toLocaleDateString("pt-BR")];
    });

    autoTable(doc, {
      startY: 64,
      head: [["Descricao", "Categoria", "Valor", "Data"]],
      body: tableData,
      styles: { fontSize: 8, cellPadding: 3 },
      headStyles: { fillColor: [99, 102, 241], textColor: 255, fontSize: 8, fontStyle: "bold" },
      alternateRowStyles: { fillColor: [248, 250, 252] },
      margin: { left: 14, right: 14 },
    });

    doc.save(`relatorio-${month}-${year}.pdf`);
  };

  const handleMonthChange = (newMonth: number, newYear: number) => {
    setMonth(newMonth);
    setYear(newYear);
  };

  const totalSpent = transactions.reduce((sum, t) => sum + Number(t.amount), 0);
  const daysInMonth = new Date(year, month, 0).getDate();
  const today = new Date();
  const currentDay =
    today.getMonth() + 1 === month && today.getFullYear() === year
      ? today.getDate()
      : daysInMonth;

  // Calculate weekly spent (current week: Mon-Sun)
  const getWeeklySpent = () => {
    const now = new Date();
    // Get Monday of current week
    const dayOfWeek = now.getDay(); // 0=Sun
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const monday = new Date(now);
    monday.setDate(now.getDate() + mondayOffset);
    monday.setHours(0, 0, 0, 0);

    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    sunday.setHours(23, 59, 59, 999);

    return transactions
      .filter((t) => {
        const d = new Date(t.createdAt);
        return d >= monday && d <= sunday;
      })
      .reduce((sum, t) => sum + Number(t.amount), 0);
  };

  const weeklySpent = getWeeklySpent();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="flex flex-col items-center gap-4">
          <div className="relative h-12 w-12">
            <div className="absolute inset-0 h-12 w-12 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600 dark:border-indigo-900 dark:border-t-indigo-500" />
          </div>
          <p className="text-sm font-medium text-zinc-500">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 transition-colors duration-300">
      <div className="fixed inset-0 gradient-mesh pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-zinc-200/50 bg-white/70 backdrop-blur-xl dark:border-zinc-800/50 dark:bg-zinc-950/70">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary shadow-sm shadow-indigo-500/20">
              <Wallet className="h-4 w-4 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-sm font-bold text-zinc-900 dark:text-white leading-none">Financa no Limite</h1>
              <p className="text-[11px] text-zinc-400 mt-0.5">{userEmail}</p>
            </div>
          </div>
          <div className="flex items-center gap-0.5">
            <MonthFilter month={month} year={year} onChange={handleMonthChange} />
            <div className="ml-2 flex items-center gap-0.5 border-l border-zinc-200 pl-2 dark:border-zinc-800">
              <ThemeToggle />
              <SettingsModal currentLimit={monthlyLimit} onSave={handleUpdateLimit} />
              <button onClick={handleLogout} className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200">
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative mx-auto max-w-6xl space-y-5 px-4 py-6 sm:px-6">
        {/* Dashboard: Hero + Form + Stats */}
        <Dashboard
          limit={monthlyLimit}
          totalSpent={totalSpent}
          transactionCount={transactions.length}
          daysInMonth={daysInMonth}
          currentDay={currentDay}
          month={month}
          cards={cards}
          weeklySpent={weeklySpent}
          onAddCard={handleAddCard}
          onUpdateCard={handleUpdateCard}
          onDeleteCard={handleDeleteCard}
        >
          {/* Transaction Form embedded between hero and stat cards */}
          <TransactionForm
            categories={categories}
            month={month}
            year={year}
            onSubmit={handleAddTransaction}
          />
        </Dashboard>

        {/* Content Grid */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-5">
            <TransactionList
              transactions={transactions}
              categories={categories}
              onDelete={handleDeleteTransaction}
              onExportCSV={handleExportCSV}
              onExportPDF={handleExportPDF}
            />
          </div>
          <div className="space-y-5">
            <Calendar
              transactions={transactions}
              categories={categories}
              month={month}
              year={year}
              onDelete={handleDeleteTransaction}
            />
            <CategoryManager
              categories={categories}
              onAdd={handleAddCategory}
              onUpdate={handleUpdateCategory}
              onDelete={handleDeleteCategory}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
