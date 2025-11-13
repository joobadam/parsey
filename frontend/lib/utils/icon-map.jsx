"use client";

import { convertEmojiToIcon, isEmoji } from "./emoji-to-icon";
import {
  Gamepad2,
  UtensilsCrossed,
  Heart,
  Home,
  Shield,
  Briefcase,
  Sparkles,
  DollarSign,
  Plane,
  ShoppingCart,
  Film,
  Package,
  Car,
  Shirt,
  PawPrint,
  Theater,
} from "lucide-react";

export const ICON_MAP = {
  Gamepad2: Gamepad2,
  UtensilsCrossed: UtensilsCrossed,
  Heart: Heart,
  Home: Home,
  Shield: Shield,
  Briefcase: Briefcase,
  Sparkles: Sparkles,
  DollarSign: DollarSign,
  Plane: Plane,
  ShoppingCart: ShoppingCart,
  Film: Film,
  Package: Package,
  Car: Car,
  Shirt: Shirt,
  PawPrint: PawPrint,
  Theater: Theater,
};

const SIZE_MAP = {
  4: "w-4 h-4",
  5: "w-5 h-5",
  6: "w-6 h-6",
  8: "w-8 h-8",
  10: "w-10 h-10",
};

export function CategoryIcon({ icon, size = 5, color = "text-[#FF6B35]" }) {
  let iconName = icon;

  if (isEmoji(icon)) {
    iconName = convertEmojiToIcon(icon);
  }

  const IconComponent = ICON_MAP[iconName] || Package;

  return <IconComponent className={`${SIZE_MAP[size] || SIZE_MAP[5]} ${color}`} />;
}

