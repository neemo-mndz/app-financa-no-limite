"use client";

import { useState } from "react";
import { Card, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Plus, Pencil, Trash2, X, Check } from "lucide-react";
import type { Category } from "@/db/schema";

interface CategoryManagerProps {
  categories: Category[];
  onAdd: (name: string, color: string) => void;
  onUpdate: (id: string, name: string, color: string) => void;
  onDelete: (id: string) => void;
}

const PRESET_COLORS = [
  "#6366f1", "#8b5cf6", "#ec4899", "#ef4444",
  "#f97316", "#eab308", "#22c55e", "#06b6d4",
  "#3b82f6", "#64748b",
];

export function CategoryManager({
  categories,
  onAdd,
  onUpdate,
  onDelete,
}: CategoryManagerProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [color, setColor] = useState(PRESET_COLORS[0]);

  const handleAdd = () => {
    if (name.trim()) {
      onAdd(name.trim(), color);
      setName("");
      setColor(PRESET_COLORS[0]);
      setIsAdding(false);
    }
  };

  const handleEdit = (cat: Category) => {
    setEditingId(cat.id);
    setName(cat.name);
    setColor(cat.color);
  };

  const handleSaveEdit = () => {
    if (editingId && name.trim()) {
      onUpdate(editingId, name.trim(), color);
      setEditingId(null);
      setName("");
      setColor(PRESET_COLORS[0]);
    }
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    setName("");
    setColor(PRESET_COLORS[0]);
  };

  return (
    <Card>
      <CardHeader
        title="Categorias"
        subtitle="Organize seus gastos"
        action={
          !isAdding &&
          !editingId && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsAdding(true)}
            >
              <Plus className="h-4 w-4" />
              Nova
            </Button>
          )
        }
      />

      {/* Add/Edit Form */}
      {(isAdding || editingId) && (
        <div className="mb-4 rounded-xl border border-indigo-100 bg-indigo-50/50 p-4 dark:border-indigo-900 dark:bg-indigo-950/30">
          <div className="space-y-3">
            <Input
              placeholder="Nome da categoria"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  editingId ? handleSaveEdit() : handleAdd();
                }
              }}
            />
            <div className="flex flex-wrap gap-2">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`h-7 w-7 rounded-full transition-transform ${
                    color === c
                      ? "scale-125 ring-2 ring-offset-2 ring-indigo-500"
                      : "hover:scale-110"
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={editingId ? handleSaveEdit : handleAdd}
              >
                <Check className="h-4 w-4" />
                {editingId ? "Salvar" : "Adicionar"}
              </Button>
              <Button variant="ghost" size="sm" onClick={handleCancel}>
                <X className="h-4 w-4" />
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Category List */}
      <div className="space-y-2">
        {categories.length === 0 ? (
          <p className="py-6 text-center text-sm text-zinc-400">
            Nenhuma categoria criada
          </p>
        ) : (
          categories.map((cat) => (
            <div
              key={cat.id}
              className="flex items-center justify-between rounded-xl border border-zinc-100 p-3 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-800/50"
            >
              <div className="flex items-center gap-3">
                <div
                  className="h-4 w-4 rounded-full"
                  style={{ backgroundColor: cat.color }}
                />
                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  {cat.name}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleEdit(cat)}
                  className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => onDelete(cat.id)}
                  className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
