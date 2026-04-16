import React, { useState, useMemo } from "react";
import { Search, Filter, PauseCircle, PlayCircle, Edit2, Plus, ChevronUp, ChevronDown } from "lucide-react";
import StatusBadge from "../components/StatusBadge";
import { campaigns as initialCampaigns } from "../data/mockData";

const fmt = (v, type = "currency") => {
  if (type === "currency") return `$${Number(v).toLocaleString("en-US", { minimumFractionDigits: 2 })}`;
  if (type === "percent") return `${Number(v).toFixed(2)}%`;
  return v;
};

const typeShort = { "Sponsored Products": "SP", "Sponsored Brands": "SB", "Sponsored Display": "SD" };
const typeBadge = {
  SP: "bg-blue-100 text-blue-700",
  SB: "bg-purple-100 text-purple-700",
  SD: "bg-indigo-100 text-indigo-700",
};

function SortIcon({ col, sortCol, sortDir }) {
  if (sortCol !== col) return <ChevronUp size={12} className="opacity-20" />;
  return sortDir === "asc" ? <ChevronUp size={12} /> : <ChevronDown size={12} />;
}

export default function Campaigns() {
  const [campaigns, setCampaigns] = useState(initialCampaigns);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sortCol, setSortCol] = useState("revenue");
  const [sortDir, setSortDir] = useState("desc");
  const [editBudget, setEditBudget] = useState(null); // { id, value }

  const filtered = useMemo(() => {
    let rows = campaigns;
    if (search) rows = rows.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));
    if (statusFilter !== "all") rows = rows.filter(c => c.status === statusFilter);
    if (typeFilter !== "all") rows = rows.filter(c => typeShort[c.type] === typeFilter);
    rows = [...rows].sort((a, b) => {
      const av = a[sortCol] ?? 0, bv = b[sortCol] ?? 0;
      return sortDir === "asc" ? av - bv : bv - av;
    });
    return rows;
  }, [campaigns, search, statusFilter, typeFilter, sortCol, sortDir]);

  const handleSort = (col) => {
    if (sortCol === col) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortCol(col); setSortDir("desc"); }
  };

  const toggleStatus = (id) => {
    setCampaigns(prev => prev.map(c =>
      c.id === id ? { ...c, status: c.status === "active" ? "paused" : "active" } : c
    ));
  };

  const saveBudget = () => {
    if (!editBudget) return;
    setCampaigns(prev => prev.map(c =>
      c.id === editBudget.id ? { ...c, budget: parseFloat(editBudget.value) } : c
    ));
    setEditBudget(null);
  };

  const cols = [
    { key: "spend", label: "Spend" },
    { key: "revenue", label: "Revenue" },
    { key: "roas", label: "ROAS" },
    { key: "acos", label: "ACoS" },
    { key: "orders", label: "Orders" },
    { key: "impressions", label: "Impressions" },
    { key: "clicks", label: "Clicks" },
    { key: "ctr", label: "CTR" },
  ];

  const summary = useMemo(() => ({
    spend: filtered.reduce((s, c) => s + c.spend, 0),
    revenue: filtered.reduce((s, c) => s + c.revenue, 0),
    orders: filtered.reduce((s, c) => s + c.orders, 0),
  }), [filtered]);

  return (
    <div className="space-y-5">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
            placeholder="Search campaign..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
          {["all", "active", "paused"].map(s => (
            <button key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${statusFilter === s ? "bg-white shadow text-gray-800" : "text-gray-500 hover:text-gray-700"}`}>
              {s === "all" ? "All" : s === "active" ? "Active" : "Paused"}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
          {["all", "SP", "SB", "SD"].map(t => (
            <button key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${typeFilter === t ? "bg-white shadow text-gray-800" : "text-gray-500 hover:text-gray-700"}`}>
              {t === "all" ? "All" : t}
            </button>
          ))}
        </div>

        <button className="flex items-center gap-1.5 px-3 py-2 bg-orange-500 text-white text-sm rounded-lg hover:bg-orange-600 transition-colors ml-auto">
          <Plus size={15} />
          New Campaign
        </button>
      </div>

      {/* Summary bar */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Spend (filtered)", val: fmt(summary.spend) },
          { label: "Total Revenue (filtered)", val: fmt(summary.revenue) },
          { label: "Orders (filtered)", val: summary.orders.toLocaleString("en-US") },
        ].map(({ label, val }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-200 px-5 py-3 flex items-center justify-between shadow-sm">
            <span className="text-xs text-gray-500">{label}</span>
            <span className="text-sm font-bold text-gray-800">{val}</span>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
          <span className="text-sm text-gray-500">{filtered.length} campaign(s)</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs min-w-max">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left px-4 py-3 text-gray-500 font-medium">Campaign</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">Type</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">Status</th>
                <th className="text-right px-4 py-3 text-gray-500 font-medium">Daily Budget</th>
                {cols.map(({ key, label }) => (
                  <th key={key}
                    onClick={() => handleSort(key)}
                    className="text-right px-4 py-3 text-gray-500 font-medium cursor-pointer hover:text-gray-700 select-none">
                    <span className="flex items-center justify-end gap-1">
                      {label}
                      <SortIcon col={key} sortCol={sortCol} sortDir={sortDir} />
                    </span>
                  </th>
                ))}
                <th className="px-4 py-3 text-gray-500 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((c) => {
                const t = typeShort[c.type];
                return (
                  <tr key={c.id} className={`hover:bg-gray-50 transition-colors ${c.status === "paused" ? "opacity-60" : ""}`}>
                    <td className="px-4 py-3 font-medium text-gray-800 max-w-xs truncate">{c.name}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-0.5 rounded text-xs font-semibold ${typeBadge[t]}`}>{t}</span>
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={c.status} /></td>
                    <td className="px-4 py-3 text-right">
                      {editBudget?.id === c.id ? (
                        <div className="flex items-center justify-end gap-1">
                          <input
                            type="number"
                            value={editBudget.value}
                            onChange={e => setEditBudget({ ...editBudget, value: e.target.value })}
                            className="w-20 px-1.5 py-0.5 border border-orange-400 rounded text-xs text-right focus:outline-none"
                            autoFocus
                          />
                          <button onClick={saveBudget} className="text-green-600 font-medium hover:underline">OK</button>
                          <button onClick={() => setEditBudget(null)} className="text-gray-400 hover:underline">✕</button>
                        </div>
                      ) : (
                        <span className="text-gray-700">{fmt(c.budget)}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-700">{fmt(c.spend)}</td>
                    <td className="px-4 py-3 text-right font-semibold text-green-600">{fmt(c.revenue)}</td>
                    <td className="px-4 py-3 text-right font-semibold text-blue-600">{c.roas.toFixed(1)}x</td>
                    <td className={`px-4 py-3 text-right font-medium ${c.acos > 10 ? "text-red-500" : "text-gray-700"}`}>
                      {fmt(c.acos, "percent")}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-700">{c.orders}</td>
                    <td className="px-4 py-3 text-right text-gray-600">{c.impressions.toLocaleString("en-US")}</td>
                    <td className="px-4 py-3 text-right text-gray-600">{c.clicks.toLocaleString("en-US")}</td>
                    <td className="px-4 py-3 text-right text-gray-600">{fmt(c.ctr, "percent")}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 justify-center">
                        <button
                          onClick={() => toggleStatus(c.id)}
                          title={c.status === "active" ? "Pause" : "Activate"}
                          className={`hover:opacity-70 transition-opacity ${c.status === "active" ? "text-yellow-500" : "text-green-500"}`}>
                          {c.status === "active" ? <PauseCircle size={16} /> : <PlayCircle size={16} />}
                        </button>
                        <button
                          onClick={() => setEditBudget({ id: c.id, value: c.budget })}
                          title="Edit budget"
                          className="text-gray-400 hover:text-gray-700 transition-colors">
                          <Edit2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400 text-sm">
            No campaigns found with the applied filters.
          </div>
        )}
      </div>
    </div>
  );
}
