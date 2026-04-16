import React, { useState } from "react";
import { AlertTriangle, TrendingDown, TrendingUp, Package, Star, RefreshCw, Bell, BellOff, Eye, ExternalLink } from "lucide-react";
import StatusBadge from "../components/StatusBadge";

const MOCK = [
  { id:1, name:"Panela Pressão Mondial 6L", asin:"B08XYZ1234", price:79.90, prevPrice:89.90, stock:"in_stock", rating:4.3, reviews:1842, bsr:342, prevBsr:410, priceAlert:true, stockAlert:false },
  { id:2, name:"Panela Tramontina 5L", asin:"B07ABC5678", price:119.90, prevPrice:99.90, stock:"in_stock", rating:4.6, reviews:3201, bsr:198, prevBsr:220, priceAlert:false, stockAlert:false },
  { id:3, name:"Panela Oster 4L Inox", asin:"B09DEF9012", price:64.90, prevPrice:64.90, stock:"low_stock", rating:4.1, reviews:567, bsr:891, prevBsr:750, priceAlert:false, stockAlert:true },
  { id:4, name:"Panela Elétrica Philips 6L", asin:"B0AGHI3456", price:149.90, prevPrice:179.90, stock:"out_of_stock", rating:4.4, reviews:2103, bsr:520, prevBsr:480, priceAlert:true, stockAlert:true },
  { id:5, name:"Panela Walita 5.5L", asin:"B0BJKL7890", price:98.90, prevPrice:98.90, stock:"in_stock", rating:4.2, reviews:892, bsr:670, prevBsr:710, priceAlert:false, stockAlert:false },
];

const alerts = [
  { type:"price_drop", icon:TrendingDown, color:"text-green-600", bg:"bg-green-50 border-green-200", msg:"Tramontina baixou para R$119,90 (era R$99,90) — oportunidade de competir por preço", time:"há 2h" },
  { type:"out_of_stock", icon:Package, color:"text-blue-600", bg:"bg-blue-50 border-blue-200", msg:"Philips 6L ficou SEM ESTOQUE — aumente seus bids agora para capturar as vendas!", time:"há 45min" },
  { type:"price_up", icon:TrendingUp, color:"text-orange-600", bg:"bg-orange-50 border-orange-200", msg:"Oster 4L aumentou 20% — seus produtos ficaram mais competitivos", time:"há 5h" },
];

const stockBadge = { in_stock: { label:"Em estoque", cls:"bg-green-100 text-green-700" }, low_stock: { label:"Estoque baixo", cls:"bg-yellow-100 text-yellow-700" }, out_of_stock: { label:"Sem estoque", cls:"bg-red-100 text-red-700" } };

export default function CompetitorMonitor() {
  const [competitors, setCompetitors] = useState(MOCK);
  const [loading, setLoading] = useState(false);
  const [newAsin, setNewAsin] = useState("");

  const refresh = () => { setLoading(true); setTimeout(() => setLoading(false), 1500); };
  const toggleAlert = (id, field) => setCompetitors(cs => cs.map(c => c.id === id ? { ...c, [field]: !c[field] } : c));

  const opportunities = competitors.filter(c => c.stock === "out_of_stock").length;
  const priceDrop = competitors.filter(c => c.price < c.prevPrice).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center"><Eye size={20} className="text-blue-600" /></div>
          <div><h1 className="text-xl font-bold text-gray-900">Monitor de Concorrentes</h1>
            <p className="text-sm text-gray-500">Alertas em tempo real de preço e estoque</p></div>
        </div>
        <button onClick={refresh} className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-xl transition-colors">
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Atualizar
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label:"Concorrentes monitorados", value: competitors.length, color:"text-gray-800" },
          { label:"Sem estoque (oportunidade!)", value: opportunities, color:"text-blue-600" },
          { label:"Reduziram preço hoje", value: priceDrop, color:"text-green-600" },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm text-center">
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Alerts */}
      <div className="space-y-2">
        <h2 className="text-sm font-semibold text-gray-700">Alertas Recentes</h2>
        {alerts.map((a, i) => (
          <div key={i} className={`flex items-start gap-3 border rounded-xl px-4 py-3 ${a.bg}`}>
            <a.icon size={16} className={`${a.color} flex-shrink-0 mt-0.5`} />
            <div className="flex-1">
              <p className="text-sm text-gray-800">{a.msg}</p>
              <p className="text-xs text-gray-400 mt-0.5">{a.time}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Add competitor */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
        <h2 className="text-sm font-semibold text-gray-700 mb-3">Adicionar Concorrente</h2>
        <div className="flex gap-2">
          <input value={newAsin} onChange={e => setNewAsin(e.target.value)} placeholder="Cole o ASIN do concorrente (ex: B08XYZ1234)"
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
          <button onClick={() => setNewAsin("")} className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium rounded-xl transition-colors">
            Monitorar
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-700">Concorrentes Monitorados</h2>
          <span className="text-xs text-gray-400">Atualizado há 2 min</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead><tr className="bg-gray-50">
              {["Produto","Preço","Variação","Estoque","Rating","BSR","Alertas"].map(h => (
                <th key={h} className="px-4 py-3 text-left text-gray-500 font-medium">{h}</th>
              ))}
            </tr></thead>
            <tbody className="divide-y divide-gray-50">
              {competitors.map(c => {
                const priceChg = ((c.price - c.prevPrice) / c.prevPrice * 100);
                const bsrChg = c.bsr - c.prevBsr;
                const sb = stockBadge[c.stock];
                return (
                  <tr key={c.id} className={`hover:bg-gray-50 ${c.stock === "out_of_stock" ? "bg-blue-50/30" : ""}`}>
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-800 max-w-[180px] truncate">{c.name}</p>
                      <p className="text-gray-400">{c.asin}</p>
                    </td>
                    <td className="px-4 py-3 font-semibold text-gray-800">R$ {c.price.toFixed(2)}</td>
                    <td className="px-4 py-3">
                      {priceChg !== 0 ? (
                        <span className={`flex items-center gap-0.5 font-medium ${priceChg < 0 ? "text-green-600" : "text-red-500"}`}>
                          {priceChg < 0 ? <TrendingDown size={12} /> : <TrendingUp size={12} />}
                          {Math.abs(priceChg).toFixed(1)}%
                        </span>
                      ) : <span className="text-gray-400">—</span>}
                    </td>
                    <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${sb.cls}`}>{sb.label}</span></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Star size={11} className="text-yellow-400 fill-yellow-400" />
                        <span className="font-medium text-gray-700">{c.rating}</span>
                        <span className="text-gray-400">({c.reviews.toLocaleString("pt-BR")})</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-medium text-gray-700">#{c.bsr}</span>
                      <span className={`ml-1 text-xs ${bsrChg < 0 ? "text-green-600" : "text-red-500"}`}>
                        {bsrChg < 0 ? "↑" : "↓"}{Math.abs(bsrChg)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <button onClick={() => toggleAlert(c.id, "priceAlert")} title="Alerta de preço"
                          className={`p-1.5 rounded-lg transition-colors ${c.priceAlert ? "bg-orange-100 text-orange-600" : "bg-gray-100 text-gray-400"}`}>
                          {c.priceAlert ? <Bell size={11} /> : <BellOff size={11} />}
                        </button>
                        <button onClick={() => toggleAlert(c.id, "stockAlert")} title="Alerta de estoque"
                          className={`p-1.5 rounded-lg transition-colors ${c.stockAlert ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-400"}`}>
                          <Package size={11} />
                        </button>
                      </div>
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
