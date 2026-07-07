"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Dashboard } from "@/components/Dashboard";
import { TransactionForm } from "@/components/TransactionForm";
import { TransactionList } from "@/components/TransactionList";
import { CategoryManager } from "@/components/CategoryManager";
import { MonthFilter } from "@/components/MonthFilter";
import { SettingsModal } from "@/components/SettingsModal";
import { Button } from "@/components/ui/Button";
import { LogOut, Wallet } from "lucide-react";
import { getCurrentMonthYear } from "@/lib/utils";
import type { Transaction, Category } from "@/db/schema";
import Papa from "papaparse";

export default function DashboardPage() {
  const router = useRouter();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [monthlyLimit, setMonthlyLimit] = useState(5000);
  const [loading, setLoading] = useState(true);
  const { month: currentMonth, year: currentYear } = getCurrentMonthYear();
  const [month, setMonth] = useState(currentMonth);
  const [year, setYear] = useState(currentYear);
  const [userEmail, setUserEmail] = useState("");

  const fetchData = useCallback(async () => {
    try {
      const [transRes, catRes, settingsRes] = await Promise.all([
        fetch(`/api/transactions?month=${month}&year=${year}`),
        fetch("/api/categories"),
        fetch("/api/settings"),
      ]);

      if (transRes.ok) {
        const data = await transRes.json();
        setTransactions(data);
      }
      if (catRes.ok) {
        const data = await catRes.json();
        setCategories(data);
      }
      if (settingsRes.ok) {
        const data = await settingsRes.json();
        setMonthlyLimit(Number(data.monthlyLimit));
      }
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
        if (!res.ok) {
          router.push("/auth/login");
          return;
        }
        const data = await res.json();
        setUserEmail(data.user.email);
        fetchData();
      } catch {
        router.push("/auth/login");
      }
    };
    checkUser();
  }, [fetchData, router]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/auth/login");
    router.refresh();
  };

  const handleAddTransaction = async (data: {
    description: string;
    amount: number;
    categoryId: string | null;
    month: number;
    year: number;
  }) => {
    const res = await fetch("/api/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      fetchData();
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    const res = await fetch(`/api/transactions?id=${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      fetchData();
    }
  };

  const handleAddCategory = async (name: string, color: string) => {
    const res = await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, color }),
    });
    if (res.ok) {
      fetchData();
    }
  };

  const handleUpdateCategory = async (
    id: string,
    name: string,
    color: string
  ) => {
    const res = await fetch("/api/categories", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, name, color }),
    });
    if (res.ok) {
      fetchData();
    }
  };

  const handleDeleteCategory = async (id: string) => {
    const res = await fetch(`/api/categories?id=${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      fetchData();
    }
  };

  const handleUpdateLimit = async (limit: number) => {
    const res = await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ monthlyLimit: limit }),
    });
    if (res.ok) {
      setMonthlyLimit(limit);
    }
  };

  const handleExportCSV = () => {
    const data = transactions.map((t) => {
      const category = categories.find((c) => c.id === t.categoryId);
      return {
        Descrição: t.description,
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

  const handleMonthChange = (newMonth: number, newYear: number) => {
    setMonth(newMonth);
    setYear(newYear);
  };

  const totalSpent = transactions.reduce(
    (sum, t) => sum + Number(t.amount),
    0
  );
  const daysInMonth = new Date(year, month, 0).getDate();
  const today = new Date();
  const currentDay =
    today.getMonth() + 1 === month && today.getFullYear() === year
      ? today.getDate()
      : daysInMonth;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
          <p className="text-sm text-zinc-500">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/80 backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-900/80">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600">
              <Wallet className="h-5 w-5 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-base font-bold text-zinc-900 dark:text-white">
                Finança no Limite
              </h1>
              <p className="text-xs text-zinc-500">{userEmail}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <SettingsModal
              currentLimit={monthlyLimit}
              onSave={handleUpdateLimit}
            />
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Sair</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        {/* Month Filter */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <MonthFilter
            month={month}
            year={year}
            onChange={handleMonthChange}
          />
        </div>

        {/* Dashboard Stats */}
        <Dashboard
          limit={monthlyLimit}
          totalSpent={totalSpent}
          transactionCount={transactions.length}
          daysInMonth={daysInMonth}
          currentDay={currentDay}
        />

        {/* Transaction Form */}
        <TransactionForm
          categories={categories}
          month={month}
          year={year}
          onSubmit={handleAddTransaction}
        />

        {/* Content Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <TransactionList
              transactions={transactions}
              categories={categories}
              onDelete={handleDeleteTransaction}
              onExportCSV={handleExportCSV}
            />
          </div>
          <div>
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
