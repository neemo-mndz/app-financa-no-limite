"use client";

import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  glass?: boolean;
}

export function Card({ children, className, glass }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-zinc-200/60 bg-white p-6 shadow-sm",
        "dark:border-zinc-800/60 dark:bg-zinc-900/80",
        "transition-all duration-200 hover:shadow-md",
        glass && "glass",
        className
      )}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

export function CardHeader({ title, subtitle, action }: CardHeaderProps) {
  return (
    <div className="mb-5 flex items-center justify-between">
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
          {title}
        </h3>
        {subtitle && (
          <p className="mt-0.5 text-xs text-zinc-400 dark:text-zinc-600">
            {subtitle}
          </p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon?: ReactNode;
  trend?: "up" | "down" | "neutral";
  className?: string;
  gradient?: string;
}

export function StatCard({ title, value, subtitle, icon, trend, className, gradient }: StatCardProps) {
  const trendColors = {
    up: "text-emerald-500",
    down: "text-red-400",
    neutral: "text-zinc-500",
  };

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-zinc-200/60 bg-white p-5",
        "dark:border-zinc-800/60 dark:bg-zinc-900/80",
        "transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5",
        gradient && "text-white border-transparent",
        className
      )}
      style={gradient ? { background: gradient } : undefined}
    >
      {/* Decorative blur */}
      {!gradient && (
        <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-gradient-to-br from-indigo-500/5 to-purple-500/5 blur-2xl dark:from-indigo-500/10 dark:to-purple-500/10" />
      )}

      <div className="relative flex items-start justify-between">
        <div className="space-y-1.5">
          <p className={cn(
            "text-xs font-medium tracking-wide",
            gradient ? "text-white/70" : "text-zinc-500 dark:text-zinc-400"
          )}>
            {title}
          </p>
          <p className={cn(
            "text-xl font-bold tracking-tight",
            gradient ? "text-white" : "text-zinc-900 dark:text-white",
            !gradient && trend && trendColors[trend]
          )}>
            {value}
          </p>
          {subtitle && (
            <p className={cn(
              "text-xs",
              gradient ? "text-white/60" : "text-zinc-400 dark:text-zinc-500"
            )}>
              {subtitle}
            </p>
          )}
        </div>
        {icon && (
          <div className={cn(
            "rounded-xl p-2.5",
            gradient ? "bg-white/20" : "bg-zinc-100 dark:bg-zinc-800"
          )}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
