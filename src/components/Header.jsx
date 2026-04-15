import React from "react";
import { useLocation } from "react-router-dom";
import { Bell, RefreshCw, Calendar } from "lucide-react";

const titles = {
  "/dashboard": "Dashboard",
  "/campaigns": "Gerenciar Campanhas",
  "/keywords": "Gerenciar Keywords",
  "/competition": "Análise de Concorrência",
  "/reports": "Relatórios & Analytics",
  "/settings": "Configurações",
};

export default function Header() {
  const { pathname } = useLocation();
  const title = titles[pathname] || "Vikingo Ads Brain";

  return (
    <header className="fixed top-0 left-64 right-0 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 z-20">
      <h1 className="text-lg font-semibold text-gray-800">{title}</h1>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 text-xs text-gray-500 bg-gray-100 rounded-lg px-3 py-1.5">
          <Calendar size={13} />
          <span>Últimos 30 dias</span>
        </div>

        <button className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors" title="Atualizar dados">
          <RefreshCw size={16} />
        </button>

        <button className="relative w-9 h-9 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors" title="Notificações">
          <Bell size={16} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-orange-500 rounded-full" />
        </button>

        <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white text-xs font-bold cursor-pointer select-none">
          V
        </div>
      </div>
    </header>
  );
}
