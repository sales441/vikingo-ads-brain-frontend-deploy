import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Megaphone,
  KeyRound,
  LineChart,
  BarChart3,
  Settings,
  Zap,
  BrainCircuit,
  FileText,
  Calculator,
  TrendingUp,
  Users,
  Building2,
  Star,
  Tag,
  Package,
  Calendar,
  FlaskConical,
  Compass,
  DollarSign,
  Search,
} from "lucide-react";

const groups = [
  {
    label: "Home",
    items: [
      { to: "/dashboard",  label: "Dashboard",     icon: LayoutDashboard },
      { to: "/pnl",        label: "P&L",           icon: DollarSign },
      { to: "/reports",    label: "Reports",       icon: BarChart3 },
    ],
  },
  {
    label: "Analysis",
    items: [
      { to: "/profitability", label: "Profitability",    icon: Calculator },
      { to: "/ranking",       label: "Organic Ranking",  icon: Search },
      { to: "/trends",        label: "Trends",           icon: Calendar },
      { to: "/reviews",       label: "Review Analysis",  icon: Star, highlight: true },
    ],
  },
  {
    label: "Monitor",
    items: [
      { to: "/monitor",    label: "Competitors",   icon: Users },
      { to: "/competition",label: "Competition",   icon: LineChart },
      { to: "/inventory",  label: "Inventory",     icon: Package },
    ],
  },
  {
    label: "Optimize",
    items: [
      { to: "/campaigns",  label: "Campaigns",     icon: Megaphone },
      { to: "/keywords",   label: "Keywords",      icon: KeyRound },
      { to: "/pricing",    label: "Pricing",       icon: Tag, highlight: true },
    ],
  },
  {
    label: "AI & Creation",
    items: [
      { to: "/ai",       label: "Vikingo Brain AI", icon: BrainCircuit, highlight: true },
      { to: "/listing",  label: "Create Listing",   icon: FileText,     highlight: true },
      { to: "/ads",      label: "Create Ads",       icon: Megaphone,    highlight: true },
      { to: "/abtest",   label: "A/B Test",         icon: FlaskConical, highlight: true },
      { to: "/discover", label: "Discover Products",icon: Compass,     highlight: true },
    ],
  },
  {
    label: "Account",
    items: [
      { to: "/companies", label: "Companies",    icon: Building2 },
      { to: "/users",     label: "Users",        icon: Users },
      { to: "/settings",  label: "Settings",     icon: Settings },
    ],
  },
];

export default function Sidebar() {
  return (
    <aside className="fixed top-0 left-0 h-full w-64 bg-slate-900 flex flex-col z-30">
      {/* Brand */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-700">
        <div className="w-9 h-9 rounded-lg bg-orange-500 flex items-center justify-center flex-shrink-0">
          <Zap size={20} className="text-white" />
        </div>
        <div>
          <p className="text-white font-bold text-sm leading-tight">Vikingo Ads</p>
          <p className="text-orange-400 text-xs font-medium">Brain™</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-3 overflow-y-auto">
        {groups.map((group, gi) => (
          <div key={gi} className={gi > 0 ? "mt-4" : ""}>
            {group.label && (
              <p className="px-3 mb-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {group.label}
              </p>
            )}
            <div className="space-y-0.5">
              {group.items.map(({ to, label, icon: Icon, highlight }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-orange-500 text-white"
                        : highlight
                        ? "text-orange-300 hover:bg-slate-800 hover:text-orange-200"
                        : "text-slate-400 hover:bg-slate-800 hover:text-white"
                    }`
                  }
                >
                  <Icon size={16} />
                  <span className="flex-1 truncate">{label}</span>
                  {highlight && (
                    <span className="text-xs bg-orange-500/30 text-orange-300 px-1.5 py-0.5 rounded-full border border-orange-500/30">
                      AI
                    </span>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-slate-700">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-slate-400 text-xs">Connected • Amazon US</span>
        </div>
      </div>
    </aside>
  );
}
