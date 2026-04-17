import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Bell, RefreshCw, Calendar, LogOut, User, Building2, ChevronDown, Check, Plus, HelpCircle, AlertTriangle, Package, BrainCircuit, CheckCheck, Trash2, Menu } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCompanies } from "../context/CompaniesContext";
import { useNotifications } from "../context/NotificationsContext";

function formatRelative(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return "just now";
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const d = Math.floor(hr / 24);
  return `${d}d ago`;
}

const NOTIF_ICONS = {
  acos_alert: AlertTriangle,
  stock_alert: Package,
  ai_insight: BrainCircuit,
  info: Bell,
};

const NOTIF_COLORS = {
  critical: "text-red-500 bg-red-50",
  warning:  "text-orange-500 bg-orange-50",
  info:     "text-blue-500 bg-blue-50",
};

function NotificationsBell() {
  const { notifications, unreadCount, markRead, markAllRead, remove } = useNotifications();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleClick = (n) => {
    markRead(n.id);
    if (n.route) {
      navigate(n.route);
      setOpen(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((s) => !s)}
        className="relative w-9 h-9 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors"
        title="Notifications"
      >
        <Bell size={16} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 min-w-[16px] h-[16px] rounded-full bg-orange-500 text-white text-[10px] font-bold flex items-center justify-center px-1">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-10 z-20 w-96 max-w-[calc(100vw-2rem)] bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-gray-800">Notifications</p>
                <p className="text-xs text-gray-500">{unreadCount} unread</p>
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="text-xs text-orange-600 hover:underline flex items-center gap-1"
                >
                  <CheckCheck size={11} /> Mark all read
                </button>
              )}
            </div>

            <div className="max-h-[60vh] overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="px-4 py-10 text-center text-sm text-gray-400">
                  You're all caught up.
                </div>
              ) : (
                <ul className="divide-y divide-gray-100">
                  {notifications.map((n) => {
                    const Icon = NOTIF_ICONS[n.type] || Bell;
                    const colors = NOTIF_COLORS[n.severity] || NOTIF_COLORS.info;
                    return (
                      <li
                        key={n.id}
                        className={`px-4 py-3 flex gap-3 hover:bg-gray-50 transition-colors ${!n.read ? "bg-orange-50/30" : ""}`}
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${colors}`}>
                          <Icon size={14} />
                        </div>
                        <button
                          onClick={() => handleClick(n)}
                          className="flex-1 text-left min-w-0"
                        >
                          <div className="flex items-center gap-2 mb-0.5">
                            <p className={`text-sm font-semibold truncate ${!n.read ? "text-gray-900" : "text-gray-700"}`}>
                              {n.title}
                            </p>
                            {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-orange-500 flex-shrink-0" />}
                          </div>
                          <p className="text-xs text-gray-600 line-clamp-2">{n.message}</p>
                          <p className="text-xs text-gray-400 mt-1">{formatRelative(n.createdAt)}</p>
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); remove(n.id); }}
                          className="text-gray-300 hover:text-red-500 self-start"
                          title="Dismiss"
                        >
                          <Trash2 size={12} />
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            <div className="px-4 py-2 border-t border-gray-100 text-center">
              <button
                onClick={() => { navigate("/alerts"); setOpen(false); }}
                className="text-xs text-orange-600 hover:underline font-medium"
              >
                View all alerts →
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

const titles = {
  "/dashboard":     "Dashboard",
  "/campaigns":     "Manage Campaigns",
  "/keywords":      "Manage Keywords",
  "/competition":   "Competition Analysis",
  "/reports":       "Reports & Analytics",
  "/ai":            "Vikingo Brain AI",
  "/listing":       "Create Listing",
  "/ads":           "Create Ads",
  "/settings":      "Settings",
  "/profitability": "Profitability Calculator",
  "/pnl":           "P&L Dashboard",
  "/monitor":       "Competitor Monitor",
  "/ranking":       "Ranking Tracker",
  "/reviews":       "Review Analysis",
  "/pricing":       "Price Optimizer",
  "/inventory":     "Inventory Alerts",
  "/trends":        "Seasonal Trends",
  "/abtest":        "Listing A/B Test",
  "/discover":      "Product Discovery",
  "/products":      "My Products",
  "/companies":     "Companies",
  "/users":         "Users",
  "/help":          "Help Center",
  "/alerts":        "Alerts & Notifications",
  "/search-terms":  "Search Term Report",
  "/billing":       "Billing",
};

// Maps the current route to the matching Help Center topic id.
const HELP_TOPIC_FOR_ROUTE = {
  "/dashboard":     "dashboard",
  "/campaigns":     "campaigns",
  "/keywords":      "keywords",
  "/reports":       "reports",
  "/ai":            "ai-assistant",
  "/listing":       "listing-creator",
  "/ads":           "create-ads",
  "/settings":      "settings",
  "/profitability": "profitability",
  "/pnl":           "pnl",
  "/monitor":       "competitor-monitor",
  "/ranking":       "ranking-tracker",
  "/reviews":       "review-analysis",
  "/pricing":       "pricing-optimizer",
  "/inventory":     "inventory",
  "/trends":        "seasonal",
  "/abtest":        "ab-test",
  "/discover":      "product-discovery",
  "/products":      "my-products",
  "/companies":     "companies",
  "/users":         "users",
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
          {selectedCompany?.name || "Select company"}
        </span>
        <span className="text-xs text-blue-600 font-medium hidden sm:block">🇺🇸</span>
        <ChevronDown size={13} className="text-gray-500" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-10 z-20 w-72 bg-white border border-gray-200 rounded-xl shadow-lg py-2 overflow-hidden">
            <p className="px-4 py-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">My Companies</p>
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
                <Plus size={14} /> Manage companies
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default function Header({ onOpenSidebar }) {
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
    <header className="fixed top-0 left-0 md:left-64 right-0 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-3 sm:px-6 z-20">
      <div className="flex items-center gap-2 min-w-0">
        {/* Mobile hamburger */}
        <button
          onClick={onOpenSidebar}
          className="md:hidden w-10 h-10 rounded-lg flex items-center justify-center text-gray-600 hover:bg-gray-100"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>
        <h1 className="text-base sm:text-lg font-semibold text-gray-800 truncate">{title}</h1>
      </div>

      <div className="flex items-center gap-1 sm:gap-3">
        {/* Company selector */}
        <CompanySelector />

        {/* Contextual Help — opens Help Center at the topic for the current route */}
        {HELP_TOPIC_FOR_ROUTE[pathname] && (
          <button
            onClick={() => navigate(`/help?topic=${HELP_TOPIC_FOR_ROUTE[pathname]}`)}
            className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-500 hover:bg-orange-50 hover:text-orange-600 transition-colors"
            title="Help for this page"
          >
            <HelpCircle size={16} />
          </button>
        )}

        <button className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors" title="Refresh data">
          <RefreshCw size={16} />
        </button>

        <NotificationsBell />

        {/* User menu */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(s => !s)}
            className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white text-xs font-bold hover:bg-orange-600 transition-colors"
            title={user?.email || "User"}
          >
            {initials}
          </button>

          {showMenu && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
              <div className="absolute right-0 top-10 z-20 w-56 bg-white border border-gray-200 rounded-xl shadow-lg py-1 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-800">{user?.name || "Administrator"}</p>
                  <p className="text-xs text-gray-500 truncate">{user?.email || ""}</p>
                </div>
                <button
                  onClick={() => { setShowMenu(false); navigate("/companies"); }}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Building2 size={14} /> Companies
                </button>
                <button
                  onClick={() => { setShowMenu(false); navigate("/users"); }}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <User size={14} /> Users
                </button>
                <button
                  onClick={() => { setShowMenu(false); navigate("/settings"); }}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <User size={14} /> Settings
                </button>
                <div className="border-t border-gray-100 mt-1" />
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut size={14} /> Sign out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
