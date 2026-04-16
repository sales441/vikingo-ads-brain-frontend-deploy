import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Bell, RefreshCw, Calendar, LogOut, User } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const titles = {
  "/dashboard":   "Dashboard",
  "/campaigns":   "Gerenciar Campanhas",
  "/keywords":    "Gerenciar Keywords",
  "/competition": "Análise de Concorrência",
  "/reports":     "Relatórios & Analytics",
  "/ai":          "Vikingo Brain IA",
  "/listing":     "Criar Listing",
  "/ads":         "Criar Ads",
  "/settings":    "Configurações",
};

export default function Header() {
  const { pathname } = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const title = titles[pathname] || "Vikingo Ads Brain";

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const initials = user?.name
    ? user.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
    : "V";

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

        {/* User menu */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(s => !s)}
            className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white text-xs font-bold hover:bg-orange-600 transition-colors"
            title={user?.email || "Usuário"}
          >
            {initials}
          </button>

          {showMenu && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
              <div className="absolute right-0 top-10 z-20 w-56 bg-white border border-gray-200 rounded-xl shadow-lg py-1 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-800">{user?.name || "Administrador"}</p>
                  <p className="text-xs text-gray-500 truncate">{user?.email || ""}</p>
                </div>
                <button
                  onClick={() => { setShowMenu(false); navigate("/settings"); }}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <User size={14} /> Configurações
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut size={14} /> Sair
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
