"use client";

import { useState } from "react";
import DashboardHeader from "./DashboardHeader";
import AppSidebar from "./AppSidebar";

export default function DashboardWrapper({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#F9F5F3]">
      <AppSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div className="flex flex-col flex-1 lg:ml-64 bg-[#F9F5F3]">
        <DashboardHeader isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
        <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
          {children}
        </div>
      </div>
    </div>
  );
}

