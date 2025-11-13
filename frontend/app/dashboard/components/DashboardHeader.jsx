"use client";

import { signOut } from "next-auth/react";
import { Menu, X, LogOut } from "lucide-react";

export default function DashboardHeader({ isSidebarOpen, setIsSidebarOpen }) {
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSignOut = () => {
    signOut({ redirectTo: "/" });
  };

  return (
    <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-4 border-b border-[#e8e2db] bg-white px-4 lg:pl-6">
      <button
        onClick={toggleSidebar}
        className="lg:hidden p-2 rounded-lg hover:bg-[#f5f0eb] transition-colors"
        aria-label="Toggle menu"
      >
        {isSidebarOpen ? (
          <X className="w-6 h-6 text-[#171717]" />
        ) : (
          <Menu className="w-6 h-6 text-[#171717]" />
        )}
      </button>
      <h1 className="text-xl font-semibold text-[#171717]">Dashboard</h1>
      <div className="flex-1" />
      <button
        onClick={handleSignOut}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-[#171717] hover:bg-[#f5f0eb] rounded-lg transition-colors"
      >
        <LogOut className="w-4 h-4" />
        <span className="hidden sm:inline">Sign Out</span>
      </button>
    </header>
  );
}


