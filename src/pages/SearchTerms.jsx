import React, { useState, useMemo } from "react";
import {
  Search, Download, BrainCircuit, AlertTriangle, TrendingUp, Plus, CheckCircle,
} from "lucide-react";
import { downloadCSV } from "../utils/csv";
import { topSearchTerms } from "../data/mockData";

// Richer mock dataset — the real integration would pull from Amazon's
// Search Term Report endpoint. Each row is a real buyer query that
// triggered your ads, with the campaign and keyword that matched it.
const EXTENDED = [
  ...topSearchTerms.map((t) => ({
    ...t,
    campaign: "SP - Main Product | Broad",
    matchedKeyword: "main product",
    matchType: "broad",
    convRate: t.impressions > 0 ? (t.orders / t.clicks) * 100 : 0,
  })),
  { term: "cheap pressure cooker 6 quart", impressions: 21230, clicks: 167, orders: 2, spend: 54.24, revenue: 120, acos: 45.2, roas: 2.21, campaign: "SP - Main Product | Broad", matchedKeyword: "pressure cooker", matchType: "broad", convRate: 1.2 },
  { term: "cooker for one person", impressions: 8420, clicks: 45, orders: 1, spend: 14.60, revenue: 75, acos: 19.5, roas: 5.14, campaign: "SP - Long Tail | Phrases", matchedKeyword: "cooker for beginners", matchType: "phrase", convRate: 2.2 },
  { term: "replacement gasket amazon", impressions: 4500, clicks: 28, orders: 0, spend: 8.4, revenue: 0, acos: null, roas: 0, campaign: "SP - Main Product | Broad", matchedKeyword: "pressure cooker", matchType: "broad", convRate: 0 },
  { term: "electric pressure cooker with timer", impressions: 31200, clicks: 251, orders: 31, spend: 88.55, revenue: 930, acos: 9.52, roas: 10.50, campaign: "SP - Main Product | Exact", matchedKeyword: "premium original product", matchType: "exact", convRate: 12.4 },
  { term: "instant pot alternative", impressions: 12400, clicks: 89, orders: 3, spend: 28.90, revenue: 180, acos: 16.05, roas: 6.23, campaign: "SP - Competitor Conquest", matchedKeyword: "competitor brand a", matchType: "phrase", convRate: 3.4 },
  { term: "free pressure cooker", impressions: 3200, clicks: 48, orders: 0, spend: 12.30, revenue: 0, acos: null, roas: 0, campaign: "SP - Main Product | Broad", matchedKeyword: "pressure cooker", matchType: "broad", convRate: 0 },
];

const MATCH_COLORS = { broad: "bg-blue-100 text-blue-700", phrase: "bg-orange-100 text-orange-700", exact: "bg-green-100 text-green-700" };

// AI classifies each search term:
//   winner     — high conversion, low ACoS → promote to exact keyword
//   waster     — zero conversions, significant spend → add to negative KW
//   explorer   — some clicks but low volume, needs more data
//   profitable — normal performer
function classifyTerm(t) {
  if ((t.orders === 0 || !t.orders) && t.spend > 8) return "waster";
  if (t.orders >= 5 && t.acos !== null && t.acos < 15) return "winner";
  if (t.clicks < 40) return "explorer";
  return "profitable";
}

const CLASS_INFO = {
  winner:     { label: "Winner — promote",            pill: "bg-green-100 text-green-700 border-green-200",   action: "Add as Exact keyword" },
  waster:     { label: "Waster — add as negative",    pill: "bg-red-100 text-red-700 border-red-200",         action: "Add as negative keyword" },
  explorer:   { label: "Explorer — needs data",       pill: "bg-blue-100 text-blue-700 border-blue-200",      action: "Monitor" },
  profitable: { label: "Profitable",                  pill: "bg-gray-100 text-gray-700 border-gray-200",      action: "Keep as is" },
};

export default function SearchTerms() {
  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("all");
  const [sortCol, setSortCol] = useState("spend");
  const [sortDir, setSortDir] = useState("desc");

  const enriched = useMemo(() => EXTENDED.map((t) => ({ ...t, _class: classifyTerm(t) })), []);

  const filtered = useMemo(() => {
    let rows = enriched;
    if (search) rows = rows.filter((t) => t.term.toLowerCase().includes(search.toLowerCase()));
    if (classFilter !== "all") rows = rows.filter((t) => t._class === classFilter);
    return [...rows].sort((a, b) => {
      const av = a[sortCol] ?? 0, bv = b[sortCol] ?? 0;
      return sortDir === "asc" ? av - bv : bv - av;
    });
  }, [enriched, search, classFilter, sortCol, sortDir]);

  const stats = useMemo(() => {
    const s = { winner: 0, waster: 0, explorer: 0, profitable: 0, totalSpend: 0, wastedSpend: 0 };
    enriched.forEach((t) => {
      s[t._class] = (s[t._class] || 0) + 1;
      s.totalSpend += t.spend;
      if (t._class === "waster") s.wastedSpend += t.spend;
    });
    return s;
  }, [enriched]);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
            <Search size={20} className="text-purple-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Search Term Report</h1>
            <p className="text-sm text-gray-500">
              Real buyer queries that triggered your ads. Mine winners, kill wasters.
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            const stamp = new Date().toISOString().slice(0, 10);
            downloadCSV(
              `vikingo-search-terms-${stamp}.csv`,
              filtered,
              [
                { key: "term",           label: "Search term" },
                { key: "campaign",       label: "Campaign" },
                { key: "matchedKeyword", label: "Matched keyword" },
                { key: "matchType",      label: "Match" },
                { key: "impressions",    label: "Impressions" },
                { key: "clicks",         label: "Clicks" },
                { key: "convRate",       label: "Conv. %" },
                { key: "orders",         label: "Orders" },
                { key: "spend",          label: "Spend" },
                { key: "revenue",        label: "Revenue" },
                { key: "acos",           label: "ACoS (%)" },
                { key: "roas",           label: "ROAS" },
                { key: "_class",         label: "AI class" },
              ],
            );
          }}
          className="flex items-center gap-1.5 px-3 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Download size={14} /> Export CSV
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          { label: "Winners", value: stats.winner, color: "text-green-600", bg: "bg-green-50 border-green-200" },
          { label: "Wasters", value: stats.waster, color: "text-red-600", bg: "bg-red-50 border-red-200" },
          { label: "Explorers", value: stats.explorer, color: "text-blue-600", bg: "bg-blue-50 border-blue-200" },
          { label: "Profitable", value: stats.profitable, color: "text-gray-700", bg: "bg-gray-50 border-gray-200" },
          {
            label: "Wasted spend",
            value: `$${stats.wastedSpend.toFixed(2)}`,
            color: "text-red-700",
            bg: "bg-red-50 border-red-200",
          },
        ].map((s) => (
          <div key={s.label} className={`border rounded-xl p-3 text-center ${s.bg}`}>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-600 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* AI callout */}
      {stats.waster > 0 && (
        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 flex items-start gap-3">
          <BrainCircuit size={18} className="text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-red-700">
              AI detected {stats.waster} wasteful search term(s) costing ${stats.wastedSpend.toFixed(2)}
            </p>
            <p className="text-xs text-red-700 mt-0.5">
              Add them as negative keywords (exact match) to the matching campaigns.
              One-click actions available on each row.
            </p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search a term..."
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>

        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
          {[
            { id: "all", label: "All" },
            { id: "winner", label: "Winners" },
            { id: "waster", label: "Wasters" },
            { id: "explorer", label: "Explorers" },
            { id: "profitable", label: "Profitable" },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setClassFilter(f.id)}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                classFilter === f.id ? "bg-white shadow text-gray-800" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
          <span className="text-sm text-gray-500">{filtered.length} search term(s)</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs min-w-max">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left px-4 py-3 text-gray-500 font-medium">Search term</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">AI</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">Campaign / KW matched</th>
                <th className="text-right px-4 py-3 text-gray-500 font-medium">Impr.</th>
                <th className="text-right px-4 py-3 text-gray-500 font-medium">Clicks</th>
                <th className="text-right px-4 py-3 text-gray-500 font-medium">Conv. %</th>
                <th className="text-right px-4 py-3 text-gray-500 font-medium">Orders</th>
                <th className="text-right px-4 py-3 text-gray-500 font-medium">Spend</th>
                <th className="text-right px-4 py-3 text-gray-500 font-medium">Revenue</th>
                <th className="text-right px-4 py-3 text-gray-500 font-medium">ACoS</th>
                <th className="text-center px-4 py-3 text-gray-500 font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((t, i) => {
                const info = CLASS_INFO[t._class];
                return (
                  <tr key={i} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-800 max-w-xs truncate">{t.term}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${info.pill}`}>
                        {info.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-gray-700 truncate max-w-[200px]">{t.campaign}</p>
                      <p className="text-gray-400 text-xs">
                        <span className={`px-1 py-0.5 rounded text-xs font-medium ${MATCH_COLORS[t.matchType]}`}>
                          {t.matchType}
                        </span>{" "}
                        · {t.matchedKeyword}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-right text-gray-600">{t.impressions.toLocaleString("en-US")}</td>
                    <td className="px-4 py-3 text-right text-gray-600">{t.clicks.toLocaleString("en-US")}</td>
                    <td className="px-4 py-3 text-right text-gray-600">{t.convRate.toFixed(1)}%</td>
                    <td className="px-4 py-3 text-right text-gray-700">{t.orders}</td>
                    <td className="px-4 py-3 text-right text-gray-700">${t.spend.toFixed(2)}</td>
                    <td className="px-4 py-3 text-right font-semibold text-green-600">${t.revenue.toFixed(2)}</td>
                    <td className={`px-4 py-3 text-right font-medium ${t.acos === null ? "text-gray-400" : t.acos > 25 ? "text-red-500" : "text-gray-700"}`}>
                      {t.acos === null ? "—" : `${t.acos.toFixed(1)}%`}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-colors ${
                          t._class === "winner"
                            ? "bg-green-500 hover:bg-green-600 text-white"
                            : t._class === "waster"
                            ? "bg-red-500 hover:bg-red-600 text-white"
                            : "border border-gray-300 text-gray-500"
                        }`}
                        disabled={t._class === "explorer" || t._class === "profitable"}
                      >
                        {info.action}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
