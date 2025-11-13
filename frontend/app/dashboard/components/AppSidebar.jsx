"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import {
  LayoutDashboard,
  Brain,
  Receipt,
  FolderTree,
  LogOut,
  ChevronDown,
} from "lucide-react";

export default function AppSidebar({ isOpen, setIsOpen }) {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isUserMenuOpen && !event.target.closest(".user-menu")) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isUserMenuOpen]);

  const closeSidebar = () => {
    setIsOpen(false);
  };

  const handleSignOut = () => {
    signOut({ redirectTo: "/" });
  };

  const isActive = (path) => {
    if (path === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname.startsWith(path);
  };

  const getUserInitials = () => {
    if (session?.user?.name) {
      return session.user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    if (session?.user?.email) {
      return session.user.email[0].toUpperCase();
    }
    return "U";
  };

  const menuItems = [
    {
      title: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Transactions",
      path: "/dashboard/transactions",
      icon: Receipt,
    },
    {
      title: "Categories",
      path: "/dashboard/categories",
      icon: FolderTree,
    },
  ];

  return (
    <>
      {isOpen && (
        <div
          onClick={closeSidebar}
          className="lg:hidden fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-screen w-64 bg-white border-r border-[#e8e2db] z-50
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:fixed lg:z-auto
          flex flex-col
        `}
      >
        <div className="p-6 border-b border-[#e8e2db]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#FF6B35] flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-[#171717]" style={{ fontFamily: 'var(--font-permanent-marker), cursive' }}>Parsey</h1>
              <p className="text-xs text-[#6b6b6f]">Expense Tracker</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                href={item.path}
                onClick={closeSidebar}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
                  ${
                    active
                      ? "bg-[#FF6B35] text-white font-medium"
                      : "text-[#171717] hover:bg-[#f5f0eb]"
                  }
                `}
              >
                <Icon className="w-5 h-5" />
                <span>{item.title}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-[#e8e2db] user-menu">
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-[#f5f0eb] transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-[#FF6B35] flex items-center justify-center text-white font-medium text-xs overflow-hidden">
                {session?.user?.image ? (
                  <img
                    src={session.user.image}
                    alt={session.user.name || "User"}
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <span>{getUserInitials()}</span>
                )}
              </div>

              <div className="flex-1 text-left">
                <p className="text-sm font-medium text-[#171717]">
                  {session?.user?.name || "User"}
                </p>
                <p className="text-xs text-[#6b6b6f] truncate">
                  {session?.user?.email || ""}
                </p>
              </div>

              <ChevronDown
                className={`w-4 h-4 text-[#6b6b6f] transition-transform duration-200 ${
                  isUserMenuOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isUserMenuOpen && (
              <div className="absolute bottom-full left-0 right-0 mb-2 bg-white border border-[#e8e2db] rounded-lg shadow-lg overflow-hidden">
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm text-[#171717] hover:bg-[#f5f0eb] transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
