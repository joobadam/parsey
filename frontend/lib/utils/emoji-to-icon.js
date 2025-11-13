export const EMOJI_TO_ICON_MAP = {
  // Entertainment
  "🎮": "Gamepad2",
  "🎬": "Film",
  "🎭": "Theater",

  // Food & Dining
  "🍔": "UtensilsCrossed",
  "🍕": "UtensilsCrossed",
  "🍜": "UtensilsCrossed",
  "🍽️": "UtensilsCrossed",
  "☕": "UtensilsCrossed",

  // Health
  "🏥": "Heart",
  "💊": "Heart",

  // Home & Garden
  "🏠": "Home",

  // Insurance
  "🛡️": "Shield",

  // Personal Care
  "💅": "Sparkles",
  "💄": "Sparkles",
  "🧴": "Sparkles",
  "💆": "Sparkles",

  // Salary
  "💰": "DollarSign",

  // Travel
  "✈️": "Plane",
  "🚗": "Car",

  // Shopping
  "🛒": "ShoppingCart",
  "🛍️": "ShoppingCart",
  "👜": "ShoppingCart",
  "💳": "ShoppingCart",

  // Other
  "📦": "Package",
  "💼": "Briefcase",

  // Pets
  "🐶": "PawPrint",
  "🐱": "PawPrint",
  "🐾": "PawPrint",
  "🦴": "PawPrint",
};

export function convertEmojiToIcon(emoji) {
  if (!emoji || typeof emoji !== "string") return "Package";
  if (!isEmoji(emoji)) return emoji;
  return EMOJI_TO_ICON_MAP[emoji] || "Package";
}

export function isEmoji(str) {
  if (!str) return false;
  const emojiRegex = /(\u00d7|\u20e3|[\u2600-\u27BF]|[\uD800-\uDBFF][\uDC00-\uDFFF])/g;
  return emojiRegex.test(str);
}

