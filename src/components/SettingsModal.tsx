"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Settings, X } from "lucide-react";

interface SettingsModalProps {
  currentLimit: number;
  onSave: (limit: number) => void;
}

export function SettingsModal({ currentLimit, onSave }: SettingsModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [limit, setLimit] = useState(currentLimit.toString());

  const handleSave = () => {
    const value = Number(limit);
    if (value > 0) {
      onSave(value);
      setIsOpen(false);
    }
  };

  if (!isOpen) {
    return (
      <Button variant="ghost" size="sm" onClick={() => setIsOpen(true)}>
        <Settings className="h-4 w-4" />
        Limite
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl dark:bg-zinc-900">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
            Configurar Limite
          </h2>
          <button
            onClick={() => setIsOpen(false)}
            className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="space-y-4">
          <Input
            label="Limite mensal (R$)"
            type="number"
            step="0.01"
            min="0"
            value={limit}
            onChange={(e) => setLimit(e.target.value)}
          />
          <div className="flex gap-2">
            <Button onClick={handleSave} className="flex-1">
              Salvar
            </Button>
            <Button
              variant="secondary"
              onClick={() => setIsOpen(false)}
              className="flex-1"
            >
              Cancelar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
