import React, { useState, useEffect } from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import {
  DollarSign, TrendingUp, ShoppingCart, MousePointerClick,
  Eye, Percent, Award, Megaphone, BrainCircuit, AlertTriangle,
  CheckCircle, RefreshCw, ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import KPICard from "../components/KPICard";
import StatusBadge from "../components/StatusBadge";
import { dashboardMetrics, spendChartData, campaigns, topSearchTerms } from "../data/mockData";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const fmt = (v, type = "currency") => {
  if (type === "currency") return `R$ ${Number(v).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;
  if (type === "percent") return `${Number(v).toFixed(2)}%`;
  if (type === "large") return Number(v).toLocaleString("pt-BR");
  return v;
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-3 text-xs">
      <p className="font-semibold text-gray-700 mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }} className="flex items-center gap-1">
          <span className="font-medium">{p.name}:</span>
          <span>{fmt(p.value)}</span>
        </p>
      ))}
    </div>
  );
};

const scoreColor = (s) => s >= 80 ? "text-green-600" : s >= 60 ? "text-orange-500" : "text-red-500";
const scoreRing = (s) => s >= 80 ? "border-green-400" : s >= 60 ? "border-orange-400" : "border-red-400";

function AIBanner({ analysis, loading, onRefresh }) {
  if (loading) {
    return (
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl p-4 flex items-center gap-3 text-white">
        <RefreshCw size={18} className="animate-spin text-orange-400" />
        <span className="text-sm">Vikingo Brain™ analisando suas campanhas...</span>
      </div>
    );
  }
  if (!analysis) return null;

  const priorityAlerts = analysis.alertas?.filter(a => a.tipo === "acos_alto" || a.tipo === "budget_baixo") ?? [];
  const topRec = analysis.recomendacoes?.[0];

  return (
    <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl p-4 flex flex-wrap items-center gap-4">
      {/* Score */}
      <div className={`w-14 h-14 rounded-full border-2 ${scoreRing(analysis.score)} flex flex-col items-center justify-center flex-shrink-0`}>
        <span className={`text-lg font-bold ${scoreColor(analysis.score)}`}>{analysis.score}</span>
        <span className="text-gray-400 text-xs leading-none">score</span>
      </div>

      {/* Summary */}
      <div className="flex-1 min-w-48">
        <div className="flex items-center gap-2 mb-1">
          <BrainCircuit size={14} className="text-orange-400" />
          <span className="text-xs font-semibold text-orange-400">Vikingo Brain™</span>
          <span className="text-xs text-gray-500">• atualizado agora</span>
        </div>
        <p className="text-sm text-white leading-snug">{analysis.resumo}</p>
      </div>

      {/* Top alert */}
      {priorityAlerts[0] && (
        <div className="flex items-start gap-2 bg-red-900/40 border border-red-700/50 rounded-lg px-3 py-2 max-w-xs">
          <AlertTriangle size={13} className="text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs text-red-300 font-medium">{priorityAlerts[0].mensagem}</p>
            <p className="text-xs text-red-400 mt-0.5">→ {priorityAlerts[0].acao}</p>
          </div>
        </div>
      )}

      {/* Top rec */}
      {topRec && (
        <div className="flex items-start gap-2 bg-green-900/30 border border-green-700/40 rounded-lg px-3 py-2 max-w-xs">
          <CheckCircle size={13} className="text-green-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs text-green-300 font-medium">{topRec.acao}</p>
            <p className="text-xs text-green-500 mt-0.5">{topRec.impacto}</p>
          </div>
        </div>
      )}

      <div className="flex items-center gap-2 ml-auto">
        <button onClick={onRefresh} className="text-gray-500 hover:text-gray-300 transition-colors">
          <RefreshCw size={14} />
        </button>
        <Link to="/ai" className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-medium rounded-lg transition-colors">
          Ver análise completa <ArrowRight size={12} />
        </Link>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [aiLoading, setAiLoading] = useState(true);

  const loadAI = () => {
    setAiLoading(true);
    fetch(`${BASE_URL}/ai/analyze`)
      .then(r => r.json())
      .then(d => { setAiAnalysis(d.analysis); setAiLoading(false); })
      .catch(() => setAiLoading(false));
  };

  useEffect(() => { loadAI(); }, []);

  const topCampaigns = [...campaigns]
    .filter((c) => c.status === "active")
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* AI Banner */}
      <AIBanner analysis={aiAnalysis} loading={aiLoading} onRefresh={loadAI} />

      {/* KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Gasto Total" value={dashboardMetrics.totalSpend} delta={dashboardMetrics.spendDelta} format="currency" icon={DollarSign} iconBg="bg-orange-100" iconColor="text-orange-600" />
        <KPICard title="Receita Total" value={dashboardMetrics.totalRevenue} delta={dashboardMetrics.revenueDelta} format="currency" icon={TrendingUp} iconBg="bg-green-100" iconColor="text-green-600" />
        <KPICard title="Pedidos" value={dashboardMetrics.totalOrders} delta={dashboardMetrics.ordersDelta} format="large" icon={ShoppingCart} iconBg="bg-blue-100" iconColor="text-blue-600" />
        <KPICard title="Impressões" value={dashboardMetrics.totalImpressions} delta={dashboardMetrics.impressionsDelta} format="large" icon={Eye} iconBg="bg-purple-100" iconColor="text-purple-600" />
        <KPICard title="Cliques" value={dashboardMetrics.totalClicks} delta={dashboardMetrics.clicksDelta} format="large" icon={MousePointerClick} iconBg="bg-sky-100" iconColor="text-sky-600" />
        <KPICard title="ROAS Médio" value={dashboardMetrics.avgRoas} delta={dashboardMetrics.roasDelta} format="number" icon={Award} iconBg="bg-emerald-100" iconColor="text-emerald-600" />
        <KPICard title="ACoS Médio" value={dashboardMetrics.avgAcos} delta={dashboardMetrics.acosData} format="percent" icon={Percent} iconBg="bg-red-100" iconColor="text-red-500" />
        <KPICard title="CTR Médio" value={dashboardMetrics.avgCtr} format="percent" icon={Megaphone} iconBg="bg-yellow-100" iconColor="text-yellow-600" />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Gasto vs Receita — Últimos 30 dias</h2>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={spendChartData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#9ca3af" }} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} tickLine={false} axisLine={false} tickFormatter={(v) => `R$${v}`} />
              <Tooltip content={<CustomTooltip />} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
              <Area type="monotone" dataKey="revenue" name="Receita" stroke="#22c55e" strokeWidth={2} fill="url(#colorRevenue)" dot={false} activeDot={{ r: 4 }} />
              <Area type="monotone" dataKey="spend" name="Gasto" stroke="#f97316" strokeWidth={2} fill="url(#colorSpend)" dot={false} activeDot={{ r: 4 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm flex flex-col gap-4">
          <h2 className="text-sm font-semibold text-gray-700">Resumo Rápido</h2>
          <div className="flex-1 space-y-3">
            {[
              { label: "Campanhas ativas", value: campaigns.filter(c => c.status === "active").length, suffix: "de " + campaigns.length, color: "text-green-600" },
              { label: "Melhor ROAS", value: Math.max(...campaigns.map(c => c.roas)).toFixed(1) + "x", color: "text-blue-600" },
              { label: "Menor ACoS", value: Math.min(...campaigns.map(c => c.acos)).toFixed(2) + "%", color: "text-emerald-600" },
              { label: "CPC Médio", value: fmt(dashboardMetrics.avgCpc), color: "text-orange-600" },
              { label: "Campanhas pausadas", value: campaigns.filter(c => c.status === "paused").length, color: "text-yellow-600" },
            ].map(({ label, value, suffix, color }) => (
              <div key={label} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <span className="text-xs text-gray-500">{label}</span>
                <span className={`text-sm font-semibold ${color}`}>
                  {value}{suffix && <span className="text-gray-400 font-normal text-xs ml-1">{suffix}</span>}
                </span>
              </div>
            ))}
          </div>
          <Link to="/ai" className="flex items-center justify-center gap-2 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium rounded-lg transition-colors">
            <BrainCircuit size={13} />
            Abrir Vikingo Brain™
          </Link>
        </div>
      </div>

      {/* Top Campaigns */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-700">Top Campanhas por Receita</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-gray-50">
                {["Campanha", "Tipo", "Status", "Gasto", "Receita", "ROAS", "ACoS", "Pedidos"].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-gray-500 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {topCampaigns.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-800 max-w-xs truncate">{c.name}</td>
                  <td className="px-4 py-3 text-gray-500">{c.type.split(" ")[1]}</td>
                  <td className="px-4 py-3"><StatusBadge status={c.status} /></td>
                  <td className="px-4 py-3 text-gray-700">{fmt(c.spend)}</td>
                  <td className="px-4 py-3 font-semibold text-green-600">{fmt(c.revenue)}</td>
                  <td className="px-4 py-3 font-semibold text-blue-600">{c.roas.toFixed(1)}x</td>
                  <td className="px-4 py-3 text-gray-700">{c.acos.toFixed(2)}%</td>
                  <td className="px-4 py-3 text-gray-700">{c.orders}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top Search Terms */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-700">Top Termos de Busca</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-gray-50">
                {["Termo", "Impressões", "Cliques", "CTR", "Pedidos", "Gasto", "Receita", "ACoS"].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-gray-500 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {topSearchTerms.map((t) => (
                <tr key={t.term} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-800">{t.term}</td>
                  <td className="px-4 py-3 text-gray-600">{t.impressions.toLocaleString("pt-BR")}</td>
                  <td className="px-4 py-3 text-gray-600">{t.clicks.toLocaleString("pt-BR")}</td>
                  <td className="px-4 py-3 text-gray-600">{((t.clicks / t.impressions) * 100).toFixed(2)}%</td>
                  <td className="px-4 py-3 text-gray-600">{t.orders}</td>
                  <td className="px-4 py-3 text-gray-700">{fmt(t.spend)}</td>
                  <td className="px-4 py-3 font-semibold text-green-600">{fmt(t.revenue)}</td>
                  <td className="px-4 py-3 text-gray-700">{t.acos.toFixed(2)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
