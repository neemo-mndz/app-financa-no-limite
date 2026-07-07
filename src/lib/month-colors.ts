// Cada mês tem sua cor/gradiente único para diferenciação visual
export const MONTH_THEMES = [
  // Janeiro
  { gradient: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)", color: "#6366f1", name: "Indigo" },
  // Fevereiro
  { gradient: "linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)", color: "#ec4899", name: "Rosa" },
  // Março
  { gradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)", color: "#10b981", name: "Esmeralda" },
  // Abril
  { gradient: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)", color: "#f59e0b", name: "Ambar" },
  // Maio
  { gradient: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)", color: "#8b5cf6", name: "Violeta" },
  // Junho
  { gradient: "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)", color: "#06b6d4", name: "Ciano" },
  // Julho
  { gradient: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)", color: "#3b82f6", name: "Azul" },
  // Agosto
  { gradient: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)", color: "#ef4444", name: "Vermelho" },
  // Setembro
  { gradient: "linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)", color: "#14b8a6", name: "Teal" },
  // Outubro
  { gradient: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)", color: "#f97316", name: "Laranja" },
  // Novembro
  { gradient: "linear-gradient(135deg, #a855f7 0%, #9333ea 100%)", color: "#a855f7", name: "Purpura" },
  // Dezembro
  { gradient: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)", color: "#22c55e", name: "Verde" },
];

export function getMonthTheme(month: number) {
  return MONTH_THEMES[month - 1] || MONTH_THEMES[0];
}

// Shadow color for buttons/cards based on month
export function getMonthShadow(month: number) {
  const theme = getMonthTheme(month);
  return `${theme.color}30`;
}
