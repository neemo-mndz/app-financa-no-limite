// Cores baseadas na porcentagem de gastos (sistema de alerta)
// Verde → Amarelo → Laranja → Vermelho

export interface SpendingTheme {
  gradient: string;
  color: string;
  shadow: string;
  label: string;
}

export function getSpendingTheme(percentUsed: number): SpendingTheme {
  if (percentUsed <= 25) {
    return {
      gradient: "linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%)",
      color: "#10b981",
      shadow: "rgba(16, 185, 129, 0.3)",
      label: "Tranquilo",
    };
  }
  if (percentUsed <= 50) {
    return {
      gradient: "linear-gradient(135deg, #6366f1 0%, #4f46e5 50%, #4338ca 100%)",
      color: "#6366f1",
      shadow: "rgba(99, 102, 241, 0.3)",
      label: "No controle",
    };
  }
  if (percentUsed <= 75) {
    return {
      gradient: "linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #b45309 100%)",
      color: "#f59e0b",
      shadow: "rgba(245, 158, 11, 0.3)",
      label: "Atencao",
    };
  }
  if (percentUsed <= 90) {
    return {
      gradient: "linear-gradient(135deg, #f97316 0%, #ea580c 50%, #c2410c 100%)",
      color: "#f97316",
      shadow: "rgba(249, 115, 22, 0.3)",
      label: "Cuidado!",
    };
  }
  // > 90%
  return {
    gradient: "linear-gradient(135deg, #ef4444 0%, #dc2626 50%, #b91c1c 100%)",
    color: "#ef4444",
    shadow: "rgba(239, 68, 68, 0.35)",
    label: "Critico!",
  };
}
