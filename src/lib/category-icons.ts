// Mapeamento de icones/nomes de categorias para emojis
const ICON_EMOJI_MAP: Record<string, string> = {
  utensils: "🍽️",
  wine: "🍺",
  cigarette: "🚬",
  gamepad: "🎮",
  car: "🚗",
  heart: "❤️",
  home: "🏠",
  book: "📚",
  "credit-card": "💳",
  tag: "🏷️",
};

// Fallback por nome da categoria
const NAME_EMOJI_MAP: Record<string, string> = {
  alimentacao: "🍽️",
  alimentação: "🍽️",
  comida: "🍽️",
  bebidas: "🍺",
  bebida: "🍺",
  cigarro: "🚬",
  lazer: "🎮",
  entretenimento: "🎮",
  transporte: "🚗",
  uber: "🚗",
  saude: "❤️",
  saúde: "❤️",
  moradia: "🏠",
  casa: "🏠",
  aluguel: "🏠",
  educacao: "📚",
  educação: "📚",
  assinaturas: "💳",
  assinatura: "💳",
  streaming: "📺",
  outros: "🏷️",
  roupas: "👕",
  compras: "🛒",
  mercado: "🛒",
  supermercado: "🛒",
  academia: "💪",
  pets: "🐾",
  viagem: "✈️",
  presente: "🎁",
  investimento: "📈",
};

export function getCategoryEmoji(icon?: string | null, name?: string): string {
  // Primeiro tenta pelo icon
  if (icon && ICON_EMOJI_MAP[icon]) {
    return ICON_EMOJI_MAP[icon];
  }

  // Depois tenta pelo nome
  if (name) {
    const normalized = name.toLowerCase().trim();
    if (NAME_EMOJI_MAP[normalized]) {
      return NAME_EMOJI_MAP[normalized];
    }

    // Tenta match parcial
    for (const [key, emoji] of Object.entries(NAME_EMOJI_MAP)) {
      if (normalized.includes(key) || key.includes(normalized)) {
        return emoji;
      }
    }
  }

  // Fallback
  return "📌";
}
