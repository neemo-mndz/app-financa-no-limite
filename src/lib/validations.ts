import { z } from "zod";

export const transactionSchema = z.object({
  description: z.string().min(1, "Descricao e obrigatoria").max(200),
  amount: z.number().positive("Valor deve ser positivo"),
  categoryId: z.any().optional(),
  month: z.number().min(1).max(12),
  year: z.number().min(2020).max(2100),
});

export const categorySchema = z.object({
  name: z.string().min(1, "Nome e obrigatorio").max(50),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Cor invalida"),
  icon: z.string().optional(),
});

export const settingsSchema = z.object({
  monthlyLimit: z.number().positive("Limite deve ser positivo"),
});

export type TransactionInput = z.infer<typeof transactionSchema>;
export type CategoryInput = z.infer<typeof categorySchema>;
export type SettingsInput = z.infer<typeof settingsSchema>;
