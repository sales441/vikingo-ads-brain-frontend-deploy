import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell, AlertTriangle, Package, BrainCircuit, Trash2, Search,
  CheckCheck, Filter, RotateCcw,
} from "lucide-react";
import { useNotifications } from "../context/NotificationsContext";

const TYPE_ICONS = {
  acos_alert: AlertTriangle,
  stock_alert: Package,
  ai_insight: BrainCircuit,
  info: Bell,
};

const TYPE_COLORS = {
  critical: { pill: "bg-red-100 text-red-700 border-red-200",       icon: "text-red-500 bg-red-50" },
  warning:  { pill: "bg-orange-100 text-orange-700 border-orange-200", icon: "text-orange-500 bg-orange-50" },
  info:     { pill: "bg-blue-100 text-blue-700 border-blue-200",    icon: "text-blue-500 bg-blue-50" },
};

function formatFull(iso) {
  return new Date(iso).toLocaleString("en-US", {
    month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
  });
}

export default function Alerts() {
  const { notifications, markRead, markAllRead, remove, clear } = useNotifications();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = useMemo(() => {
    return notifications.filter((n) => {
      if (search && !(`${n.title} ${n.message}`.toLowerCase().includes(search.toLowerCase()))) return false;
      if (severityFilter !== "all" && n.severity !== severityFilter) return false;
      if (typeFilter !== "all" && n.type !== typeFilter) return false;
      if (statusFilter === "unread" && n.read) return false;
      if (statusFilter === "read" && !n.read) return false;
      return true;
    });
  }, [notifications, search, severityFilter, typeFilter, statusFilter]);

  const stats = useMemo(() => ({
    total: notifications.length,
    unread: notifications.filter((n) => !n.read).length,
    critical: notifications.filter((n) => n.severity === "critical").length,
    warning: notifications.filter((n) => n.severity === "warning").length,
  }), [notifications]);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
            <Bell size={20} className="text-orange-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Alerts & Notifications</h1>
            <p className="text-sm text-gray-500">Everything the AI flagged, in one timeline.</p>
          </div>
        </div>
        <div className="flex gap-2">
          {stats.unread > 0 && (
            <button
              onClick={markAllRead}
              className="flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-300 text-gray-700 text-sm rounded-xl hover:bg-gray-50"
            >
              <CheckCheck size={13} /> Mark all read
            </button>
          )}
          {notifications.length > 0 && (
            <button
              onClick={() => { if (confirm("Clear all notifications?")) clear(); }}
              className="flex items-center gap-1.5 px-3 py-2 bg-white border border-red-200 text-red-600 text-sm rounded-xl hover:bg-red-50"
            >
              <RotateCcw size={13} /> Clear all
            </button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total", value: stats.total, color: "text-gray-800", bg: "bg-white border-gray-200" },
          { label: "Unread", value: stats.unread, color: "text-orange-600", bg: "bg-orange-50 border-orange-200" },
          { label: "Critical", value: stats.critical, color: "text-red-600", bg: "bg-red-50 border-red-200" },
          { label: "Warnings", value: stats.warning, color: "text-yellow-600", bg: "bg-yellow-50 border-yellow-200" },
        ].map((s) => (
          <div key={s.label} className={`border rounded-xl p-3 text-center ${s.bg}`}>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-600 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search alerts..."
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>

        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
          {["all", "unread", "read"].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                statusFilter === s ? "bg-white shadow text-gray-800" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {s[0].toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>

        <select
          value={severityFilter}
          onChange={(e) => setSeverityFilter(e.target.value)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-700"
        >
          <option value="all">All severities</option>
          <option value="critical">Critical</option>
          <option value="warning">Warning</option>
          <option value="info">Info</option>
        </select>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-700"
        >
          <option value="all">All types</option>
          <option value="acos_alert">ACoS alerts</option>
          <option value="stock_alert">Stock alerts</option>
          <option value="ai_insight">AI insights</option>
          <option value="info">Info</option>
        </select>
      </div>

      {/* Timeline */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <Bell size={32} className="text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-500">
              {notifications.length === 0
                ? "No notifications yet. The AI will alert you when it spots issues."
                : "No notifications match the current filters."}
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {filtered.map((n) => {
              const Icon = TYPE_ICONS[n.type] || Bell;
              const colors = TYPE_COLORS[n.severity] || TYPE_COLORS.info;
              return (
                <li
                  key={n.id}
                  className={`px-4 py-4 flex gap-3 hover:bg-gray-50 transition-colors ${
                    !n.read ? "bg-orange-50/30" : ""
                  }`}
                >
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${colors.icon}`}>
                    <Icon size={15} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      <p className={`text-sm font-semibold ${!n.read ? "text-gray-900" : "text-gray-700"}`}>{n.title}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${colors.pill}`}>
                        {n.severity}
                      </span>
                      {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />}
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed mb-1">{n.message}</p>
                    <p className="text-xs text-gray-400">{formatFull(n.createdAt)}</p>
                  </div>

                  <div className="flex gap-2 items-start">
                    {n.route && (
                      <button
                        onClick={() => { markRead(n.id); navigate(n.route); }}
                        className="text-xs px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium"
                      >
                        View
                      </button>
                    )}
                    {!n.read && (
                      <button
                        onClick={() => markRead(n.id)}
                        className="p-1.5 text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded-lg"
                        title="Mark as read"
                      >
                        <CheckCheck size={13} />
                      </button>
                    )}
                    <button
                      onClick={() => remove(n.id)}
                      className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg"
                      title="Dismiss"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
