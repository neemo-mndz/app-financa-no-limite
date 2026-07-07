"use client";

import { cn } from "@/lib/utils";
import { forwardRef, useState } from "react";

interface CurrencyInputProps {
  value: number; // value in cents
  onChange: (valueInCents: number) => void;
  label?: string;
  error?: string;
  className?: string;
  placeholder?: string;
}

export const CurrencyInput = forwardRef<HTMLInputElement, CurrencyInputProps>(
  ({ value, onChange, label, error, className, placeholder }, ref) => {
    const [focused, setFocused] = useState(false);

    const formatDisplay = (cents: number): string => {
      const reais = (cents / 100).toFixed(2);
      return `R$ ${reais.replace(".", ",")}`;
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      // Allow: backspace, delete, tab, escape, enter
      if (["Backspace", "Delete", "Tab", "Escape", "Enter"].includes(e.key)) {
        if (e.key === "Backspace") {
          e.preventDefault();
          onChange(Math.floor(value / 10));
        }
        return;
      }

      // Only allow digits
      if (!/^[0-9]$/.test(e.key)) {
        e.preventDefault();
        return;
      }

      e.preventDefault();
      const newValue = value * 10 + parseInt(e.key);
      // Max 99999999 (R$ 999.999,99)
      if (newValue <= 99999999) {
        onChange(newValue);
      }
    };

    return (
      <div className="space-y-1.5">
        {label && (
          <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            {label}
          </label>
        )}
        <input
          ref={ref}
          type="text"
          inputMode="numeric"
          readOnly
          value={value === 0 && !focused ? "" : formatDisplay(value)}
          placeholder={placeholder || "R$ 0,00"}
          onKeyDown={handleKeyDown}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={cn(
            "flex h-11 w-full rounded-xl border border-zinc-200/80 bg-zinc-50 px-4 text-sm font-semibold text-zinc-900 placeholder:text-zinc-400 placeholder:font-normal",
            "transition-all duration-200 cursor-text",
            "focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10",
            "dark:border-zinc-700/80 dark:bg-zinc-800/50 dark:text-zinc-100 dark:placeholder:text-zinc-500",
            "dark:focus:border-indigo-500 dark:focus:bg-zinc-800 dark:focus:ring-indigo-500/20",
            error && "border-red-300 focus:border-red-400 focus:ring-red-500/10",
            className
          )}
        />
        {error && (
          <p className="text-xs font-medium text-red-500">{error}</p>
        )}
      </div>
    );
  }
);

CurrencyInput.displayName = "CurrencyInput";
