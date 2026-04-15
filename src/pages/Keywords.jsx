import React, { useState, useMemo } from "react";
import { Search, TrendingUp, TrendingDown, AlertTriangle, Plus, ChevronUp, ChevronDown } from "lucide-react";
import StatusBadge from "../components/StatusBadge";
import { keywords as initialKeywords } from "../data/mockData";

const fmt = (v, type = "currency") => {
  if (type === "currency") return `R$ ${Number(v).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;
  if (type === "percent") return `${Number(v).toFixed(2)}%`;
  return v;
};

function BidCell({ kw, onSave }) {
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(kw.bid);
  const needsIncrease = kw.suggestedBid > kw.bid * 1.05;

  if (editing) {
    return (
      <div className="flex items-center gap-1 justify-end">
        <input
          type="number" step="0.01"
          value={val}
          onChange={e => setVal(e.target.value)}
          className="w-16 px-1 py-0.5 border border-orange-400 rounded text-xs text-right focus:outline-none"
          autoFocus
        />
        <button onClick={() => { onSave(kw.id, parseFloat(val)); setEditing(false); }}
          className="text-green-600 text-xs font-medium hover:underline">OK</button>
        <button onClick={() => { setVal(kw.bid); setEditing(false); }}
          className="text-gray-400 text-xs hover:underline">✕</button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5 justify-end">
      <span className={`font-medium ${needsIncrease ? "text-orange-500" : "text-gray-700"}`}>
        {fmt(kw.bid)}
      </span>
      {needsIncrease && (
        <TrendingUp size={12} className="text-orange-500" title={`Sugerido: ${fmt(kw.suggestedBid)}`} />
      )}
      <button onClick={() => setEditing(true)} className="text-gray-300 hover:text-orange-500 transition-colors text-xs">✎</button>
    </div>
  );
}

export default function Keywords() {
  const [keywords, setKeywords] = useState(initialKeywords);
  const [search, setSearch] = useState("");
  const [matchFilter, setMatchFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("active");
  const [sortCol, setSortCol] = useState("revenue");
  const [sortDir, setSortDir] = useState("desc");

  const filtered = useMemo(() => {
    let rows = keywords;
    if (search) rows = rows.filter(k =>
      k.keyword.toLowerCase().includes(search.toLowerCase()) ||
      k.campaignName.toLowerCase().includes(search.toLowerCase())
    );
    if (matchFilter !== "all") rows = rows.filter(k => k.matchType === matchFilter);
    if (statusFilter !== "all") rows = rows.filter(k => k.status === statusFilter);
    return [...rows].sort((a, b) => {
      const av = a[sortCol] ?? 0, bv = b[sortCol] ?? 0;
      return sortDir === "asc" ? av - bv : bv - av;
    });
  }, [keywords, search, matchFilter, statusFilter, sortCol, sortDir]);

  const handleSort = (col) => {
    if (sortCol === col) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortCol(col); setSortDir("desc"); }
  };

  const updateBid = (id, newBid) => {
    setKeywords(prev => prev.map(k => k.id === id ? { ...k, bid: newBid } : k));
  };

  const alerts = keywords.filter(k => k.status === "active" && k.acos > 10).length;
  const opportunities = keywords.filter(k => k.status === "active" && k.suggestedBid > k.bid * 1.05).length;

  const cols = [
    { key: "impressions", label: "Impressões" },
    { key: "clicks", label: "Cliques" },
    { key: "ctr", label: "CTR" },
    { key: "orders", label: "Pedidos" },
    { key: "spend", label: "Gasto" },
    { key: "revenue", label: "Receita" },
    { key: "acos", label: "ACoS" },
    { key: "roas", label: "ROAS" },
  ];

  return (
    <div className="space-y-5">
      {/* Alert cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <p className="text-xs text-gray-500 mb-1">Total de Keywords</p>
          <p className="text-2xl font-bold text-gray-800">{keywords.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <p className="text-xs text-gray-500 mb-1">Ativas</p>
          <p className="text-2xl font-bold text-green-600">{keywords.filter(k => k.status === "active").length}</p>
        </div>
        <div className={`rounded-xl border p-4 shadow-sm ${alerts > 0 ? "bg-red-50 border-red-200" : "bg-white border-gray-200"}`}>
          <div className="flex items-center gap-1.5 mb-1">
            <AlertTriangle size={13} className={alerts > 0 ? "text-red-500" : "text-gray-400"} />
            <p className="text-xs text-gray-500">ACoS Alto (&gt;10%)</p>
          </div>
          <p className={`text-2xl font-bold ${alerts > 0 ? "text-red-600" : "text-gray-800"}`}>{alerts}</p>
        </div>
        <div className={`rounded-xl border p-4 shadow-sm ${opportunities > 0 ? "bg-orange-50 border-orange-200" : "bg-white border-gray-200"}`}>
          <div className="flex items-center gap-1.5 mb-1">
            <TrendingUp size={13} className={opportunities > 0 ? "text-orange-500" : "text-gray-400"} />
            <p className="text-xs text-gray-500">Bid Abaixo Sugerido</p>
          </div>
          <p className={`text-2xl font-bold ${opportunities > 0 ? "text-orange-600" : "text-gray-800"}`}>{opportunities}</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
            placeholder="Buscar keyword ou campanha..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
          {["all", "active", "paused"].map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${statusFilter === s ? "bg-white shadow text-gray-800" : "text-gray-500 hover:text-gray-700"}`}>
              {s === "all" ? "Todos" : s === "active" ? "Ativos" : "Pausados"}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
          {["all", "exact", "phrase", "broad"].map(m => (
            <button key={m} onClick={() => setMatchFilter(m)}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${matchFilter === m ? "bg-white shadow text-gray-800" : "text-gray-500 hover:text-gray-700"}`}>
              {m === "all" ? "Todos" : m === "exact" ? "Exato" : m === "phrase" ? "Frase" : "Ampla"}
            </button>
          ))}
        </div>

        <button className="flex items-center gap-1.5 px-3 py-2 bg-orange-500 text-white text-sm rounded-lg hover:bg-orange-600 transition-colors ml-auto">
          <Plus size={15} />
          Adicionar Keyword
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100">
          <span className="text-sm text-gray-500">{filtered.length} keyword(s)</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs min-w-max">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left px-4 py-3 text-gray-500 font-medium">Keyword</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">Match</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">Campanha</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">Status</th>
                <th className="text-right px-4 py-3 text-gray-500 font-medium">Bid Atual</th>
                <th className="text-right px-4 py-3 text-gray-500 font-medium">Bid Sugerido</th>
                {cols.map(({ key, label }) => (
                  <th key={key} onClick={() => handleSort(key)}
                    className="text-right px-4 py-3 text-gray-500 font-medium cursor-pointer hover:text-gray-700 select-none">
                    <span className="flex items-center justify-end gap-1">
                      {label}
                      {sortCol === key ? (sortDir === "asc" ? <ChevronUp size={12} /> : <ChevronDown size={12} />) : <ChevronUp size={12} className="opacity-20" />}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((k) => {
                const acosHigh = k.acos > 10;
                const roasLow = k.roas < 10;
                return (
                  <tr key={k.id} className={`hover:bg-gray-50 transition-colors ${k.status === "paused" ? "opacity-60" : ""}`}>
                    <td className="px-4 py-3 font-medium text-gray-800 max-w-xs">
                      <div className="flex items-center gap-1.5">
                        {(acosHigh || roasLow) && <AlertTriangle size={12} className="text-red-400 flex-shrink-0" />}
                        <span className="truncate">{k.keyword}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={k.matchType} /></td>
                    <td className="px-4 py-3 text-gray-500 max-w-xs truncate">{k.campaignName}</td>
                    <td className="px-4 py-3"><StatusBadge status={k.status} /></td>
                    <td className="px-4 py-3 text-right">
                      <BidCell kw={k} onSave={updateBid} />
                    </td>
                    <td className="px-4 py-3 text-right text-gray-500">{fmt(k.suggestedBid)}</td>
                    <td className="px-4 py-3 text-right text-gray-600">{k.impressions.toLocaleString("pt-BR")}</td>
                    <td className="px-4 py-3 text-right text-gray-600">{k.clicks.toLocaleString("pt-BR")}</td>
                    <td className="px-4 py-3 text-right text-gray-600">{fmt(k.ctr, "percent")}</td>
                    <td className="px-4 py-3 text-right text-gray-700">{k.orders}</td>
                    <td className="px-4 py-3 text-right text-gray-700">{fmt(k.spend)}</td>
                    <td className="px-4 py-3 text-right font-semibold text-green-600">{fmt(k.revenue)}</td>
                    <td className={`px-4 py-3 text-right font-medium ${acosHigh ? "text-red-500" : "text-gray-700"}`}>
                      {fmt(k.acos, "percent")}
                    </td>
                    <td className={`px-4 py-3 text-right font-medium ${roasLow ? "text-orange-500" : "text-blue-600"}`}>
                      {k.roas.toFixed(1)}x
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400 text-sm">
            Nenhuma keyword encontrada com os filtros aplicados.
          </div>
        )}
      </div>
    </div>
  );
}
