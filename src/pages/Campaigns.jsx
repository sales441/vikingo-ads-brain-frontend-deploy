import React, { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Search, Filter, PauseCircle, PlayCircle, Edit2, Plus, ChevronUp, ChevronDown,
  RefreshCw, Cloud, CloudOff, BrainCircuit, AlertTriangle, CheckCircle,
} from "lucide-react";
import StatusBadge from "../components/StatusBadge";
import { campaigns as initialCampaigns } from "../data/mockData";
import { syncCampaignsFromAmazon } from "../services/api";
import { useCompanies } from "../context/CompaniesContext";

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
  const { selectedCompany } = useCompanies();
  const [campaigns, setCampaigns] = useState(initialCampaigns);
  const [sync, setSync] = useState({ source: "demo", syncedAt: null, error: null, syncing: false });
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sortCol, setSortCol] = useState("revenue");
  const [sortDir, setSortDir] = useState("desc");

  // Is Amazon Ads API configured for the selected company?
  const credentialsOk = Boolean(
    selectedCompany?.profileId && selectedCompany?.clientId && selectedCompany?.clientSecret
  );

  const runSync = async () => {
    setSync((s) => ({ ...s, syncing: true, error: null }));
    const result = await syncCampaignsFromAmazon();
    setCampaigns(result.campaigns);
    setSync({
      source: result.source,
      syncedAt: result.syncedAt,
      error: result.error || null,
      syncing: false,
    });
  };

  // Auto-sync on mount and whenever selected company changes
  useEffect(() => {
    runSync();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCompany?.id]);
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
      {/* Amazon Ads connection status */}
      <div className={`border-2 rounded-xl p-4 ${
        sync.source === "live"
          ? "bg-green-50 border-green-200"
          : credentialsOk
          ? "bg-orange-50 border-orange-200"
          : "bg-yellow-50 border-yellow-200"
      }`}>
        <div className="flex items-start gap-3 flex-wrap">
          {sync.source === "live" ? (
            <Cloud size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
          ) : (
            <CloudOff size={20} className={`${credentialsOk ? "text-orange-500" : "text-yellow-500"} flex-shrink-0 mt-0.5`} />
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-sm font-bold text-gray-800">
                {sync.source === "live" ? "Live data from Amazon Ads" : "Demo mode"}
              </p>
              <span className={`text-xs px-2 py-0.5 rounded-full font-semibold border flex items-center gap-1 ${
                sync.source === "live"
                  ? "bg-green-100 text-green-700 border-green-200"
                  : "bg-yellow-100 text-yellow-700 border-yellow-200"
              }`}>
                {sync.source === "live" ? <CheckCircle size={10} /> : <AlertTriangle size={10} />}
                {sync.source === "live" ? "Connected" : "Not connected"}
              </span>
              {sync.syncedAt && (
                <span className="text-xs text-gray-500">
                  • last sync {new Date(sync.syncedAt).toLocaleString("en-US")}
                </span>
              )}
            </div>

            {sync.source === "live" ? (
              <p className="text-xs text-gray-600 mt-1 flex items-start gap-1">
                <BrainCircuit size={11} className="text-orange-500 flex-shrink-0 mt-0.5" />
                <span>
                  Vikingo Brain™ is analyzing your {campaigns.length} live campaigns and
                  will surface bid/budget recommendations as they change.
                </span>
              </p>
            ) : credentialsOk ? (
              <p className="text-xs text-orange-700 mt-1">
                Credentials are set but the Amazon Ads API is not reachable. Showing demo data —
                the AI won't act on real numbers until the API responds.
                {sync.error && <span className="block text-gray-500 mt-0.5">API said: {sync.error}</span>}
              </p>
            ) : (
              <p className="text-xs text-yellow-800 mt-1">
                Connect your Amazon Ads account so the AI can read your real campaigns,
                spend, and ACoS.
                {" "}
                <Link to="/companies" className="font-semibold underline hover:text-yellow-900">
                  Add credentials in Companies →
                </Link>
              </p>
            )}
          </div>

          <button
            onClick={runSync}
            disabled={sync.syncing}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-gray-50 border border-gray-300 text-sm text-gray-700 rounded-lg font-medium disabled:opacity-50"
          >
            <RefreshCw size={13} className={sync.syncing ? "animate-spin" : ""} />
            {sync.syncing ? "Syncing..." : "Sync from Amazon"}
          </button>
        </div>
      </div>

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
