"use client";

import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md",
        "dark:border-zinc-800 dark:bg-zinc-900",
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
    <div className="mb-4 flex items-center justify-between">
      <div>
        <h3 className="text-sm font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
          {title}
        </h3>
        {subtitle && (
          <p className="mt-0.5 text-xs text-zinc-400 dark:text-zinc-500">
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
}

export function StatCard({ title, value, subtitle, icon, trend, className }: StatCardProps) {
  const trendColors = {
    up: "text-emerald-600",
    down: "text-red-500",
    neutral: "text-zinc-500",
  };

  return (
    <Card className={cn("relative overflow-hidden", className)}>
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
            {title}
          </p>
          <p className={cn("text-2xl font-bold tracking-tight text-zinc-900 dark:text-white", trend && trendColors[trend])}>
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-zinc-400 dark:text-zinc-500">
              {subtitle}
            </p>
          )}
        </div>
        {icon && (
          <div className="rounded-xl bg-zinc-100 p-3 dark:bg-zinc-800">
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
}
