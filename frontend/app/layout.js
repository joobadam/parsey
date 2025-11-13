import "./globals.css";
import { Providers } from "./providers";
import { Permanent_Marker } from "next/font/google";

const permanentMarker = Permanent_Marker({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-permanent-marker",
});

export const metadata = {
  title: "Parsey - Smart Expense Tracking with AI Receipt Recognition",
  description: "Take control of your finances with intelligent expense management",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={permanentMarker.variable}>
      <body><Providers>{children}</Providers></body>
    </html>
  );
}

