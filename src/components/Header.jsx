import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Bell, RefreshCw, Calendar, LogOut, User, Building2, ChevronDown, Check, Plus } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCompanies } from "../context/CompaniesContext";

const titles = {
  "/dashboard":     "Dashboard",
  "/campaigns":     "Gerenciar Campanhas",
  "/keywords":      "Gerenciar Keywords",
  "/competition":   "Análise de Concorrência",
  "/reports":       "Relatórios & Analytics",
  "/ai":            "Vikingo Brain IA",
  "/listing":       "Criar Listing",
  "/ads":           "Criar Ads",
  "/settings":      "Configurações",
  "/profitability": "Calculadora de Rentabilidade",
  "/pnl":           "Dashboard P&L",
  "/monitor":       "Monitor de Concorrentes",
  "/ranking":       "Rastreador de Ranking",
  "/reviews":       "Análise de Reviews",
  "/pricing":       "Otimizador de Preço",
  "/inventory":     "Alertas de Estoque",
  "/trends":        "Tendências Sazonais",
  "/abtest":        "A/B Test de Listing",
  "/discover":      "Descobridor de Produtos",
  "/companies":     "Empresas",
  "/users":         "Usuários",
};

function CompanySelector() {
  const { companies, selectedCompany, selectCompany } = useCompanies();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const initials = selectedCompany?.name.split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase() || "?";

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(s => !s)}
        className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors text-sm"
      >
        <div className="w-5 h-5 rounded bg-orange-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
          {initials}
        </div>
        <span className="font-medium text-gray-800 max-w-[130px] truncate hidden sm:block">
          {selectedCompany?.name || "Selecionar empresa"}
        </span>
        <span className="text-xs text-blue-600 font-medium hidden sm:block">🇺🇸</span>
        <ChevronDown size={13} className="text-gray-500" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-10 z-20 w-72 bg-white border border-gray-200 rounded-xl shadow-lg py-2 overflow-hidden">
            <p className="px-4 py-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Minhas Empresas</p>
            {companies.map(company => {
              const isSelected = company.id === selectedCompany?.id;
              const ini = company.name.split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase();
              return (
                <button key={company.id}
                  onClick={() => { selectCompany(company.id); setOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-gray-50 transition-colors ${isSelected ? "bg-orange-50" : ""}`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0 ${isSelected ? "bg-orange-500" : "bg-slate-600"}`}>
                    {ini}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${isSelected ? "text-orange-700" : "text-gray-800"}`}>{company.name}</p>
                    <p className="text-xs text-gray-400">🇺🇸 Amazon US</p>
                  </div>
                  {isSelected && <Check size={14} className="text-orange-500 flex-shrink-0" />}
                </button>
              );
            })}
            <div className="border-t border-gray-100 mt-1 pt-1">
              <button
                onClick={() => { navigate("/companies"); setOpen(false); }}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-orange-600 hover:bg-orange-50 transition-colors font-medium"
              >
                <Plus size={14} /> Gerenciar empresas
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

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
        {/* Company selector */}
        <CompanySelector />

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
                  onClick={() => { setShowMenu(false); navigate("/companies"); }}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Building2 size={14} /> Empresas
                </button>
                <button
                  onClick={() => { setShowMenu(false); navigate("/users"); }}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <User size={14} /> Usuários
                </button>
                <button
                  onClick={() => { setShowMenu(false); navigate("/settings"); }}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <User size={14} /> Configurações
                </button>
                <div className="border-t border-gray-100 mt-1" />
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
