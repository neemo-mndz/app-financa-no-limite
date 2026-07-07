"use client";

import { cn } from "@/lib/utils";
import { useRef } from "react";

interface CurrencyInputProps {
  value: number; // value in cents
  onChange: (valueInCents: number) => void;
  label?: string;
  error?: string;
  className?: string;
  placeholder?: string;
}

export function CurrencyInput({ value, onChange, label, error, className, placeholder }: CurrencyInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const formatDisplay = (cents: number): string => {
    if (cents === 0) return "";
    const reais = (cents / 100).toFixed(2);
    return reais.replace(".", ",");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove tudo que não é dígito
    const raw = e.target.value.replace(/\D/g, "");
    const numericValue = parseInt(raw || "0", 10);
    // Max R$ 999.999,99
    if (numericValue <= 99999999) {
      onChange(numericValue);
    }
  };

  return (
    <div className="space-y-1.5">
      {label && (
        <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          {label}
        </label>
      )}
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-medium text-zinc-400 dark:text-zinc-500">
          R$
        </span>
        <input
          ref={inputRef}
          type="text"
          inputMode="numeric"
          value={formatDisplay(value)}
          onChange={handleChange}
          placeholder={placeholder || "0,00"}
          className={cn(
            "flex h-11 w-full rounded-xl border border-zinc-200/80 bg-zinc-50 pl-10 pr-4 text-sm font-semibold text-zinc-900 placeholder:text-zinc-400 placeholder:font-normal",
            "transition-all duration-200",
            "focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10",
            "dark:border-zinc-700/80 dark:bg-zinc-800/50 dark:text-zinc-100 dark:placeholder:text-zinc-500",
            "dark:focus:border-indigo-500 dark:focus:bg-zinc-800 dark:focus:ring-indigo-500/20",
            error && "border-red-300 focus:border-red-400 focus:ring-red-500/10",
            className
          )}
        />
      </div>
      {error && (
        <p className="text-xs font-medium text-red-500">{error}</p>
      )}
    </div>
  );
}
