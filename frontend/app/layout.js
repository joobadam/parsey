import "./globals.css";

export const metadata = {
  title: "Parsey - Smart Expense Tracking with AI Receipt Recognition",
  description: "Take control of your finances with intelligent expense management",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

