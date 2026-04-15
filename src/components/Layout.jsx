import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import VikingShip from "./VikingShip";

export default function Layout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <Header />
      <main className="ml-64 pt-16 min-h-screen flex flex-col">
        <div className="p-6 flex-1">
          <Outlet />
        </div>

        {/* Footer */}
        <footer className="ml-0 border-t border-gray-200 bg-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <VikingShip size={40} />
            <div>
              <p className="text-xs font-bold text-gray-700">Vikingo Ads Brain™</p>
              <p className="text-xs text-gray-400">Navegando rumo às vendas</p>
            </div>
          </div>
          <p className="text-xs text-gray-400">v2.0.0 • Amazon Ads Manager • {new Date().getFullYear()}</p>
        </footer>
      </main>
    </div>
  );
}
