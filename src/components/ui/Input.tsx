"use client";

import { cn } from "@/lib/utils";
import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            "flex h-10 w-full rounded-xl border border-zinc-200 bg-white px-4 text-sm text-zinc-900 placeholder:text-zinc-400 transition-colors",
            "focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20",
            "dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500",
            error && "border-red-300 focus:border-red-500 focus:ring-red-500/20",
            className
          )}
          {...props}
        />
        {error && (
          <p className="text-xs text-red-500">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
