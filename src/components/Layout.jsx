import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import VikingShip from "./VikingShip";
import OnboardingWizard from "./OnboardingWizard";

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { pathname } = useLocation();

  // Auto-close the mobile sidebar whenever the route changes
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-gray-50">
      <OnboardingWizard />
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <Header onOpenSidebar={() => setSidebarOpen(true)} />
      <main className="md:ml-64 pt-16 min-h-screen flex flex-col">
        <div className="p-4 sm:p-6 flex-1">
          <Outlet />
        </div>

        {/* Footer */}
        <footer className="border-t border-gray-200 bg-white px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <VikingShip size={40} />
            <div>
              <p className="text-xs font-bold text-gray-700">Vikingo Ads Brain™</p>
              <p className="text-xs text-gray-400">Sailing toward sales</p>
            </div>
          </div>
          <p className="text-xs text-gray-400">v2.0.0 • Amazon Ads Manager • {new Date().getFullYear()}</p>
        </footer>
      </main>
    </div>
  );
}
