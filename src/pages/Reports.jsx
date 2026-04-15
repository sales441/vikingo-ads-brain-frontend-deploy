import React, { useState, useMemo } from "react";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { Download } from "lucide-react";
import { weeklyData, campaigns, spendChartData } from "../data/mockData";

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
        <p key={p.name} style={{ color: p.color }} className="flex justify-between gap-4">
          <span>{p.name}</span>
          <span className="font-medium">{typeof p.value === "number" && p.value > 100 ? fmt(p.value) : p.value}</span>
        </p>
      ))}
    </div>
  );
};

const PERIODS = [
  { label: "7 dias", days: 7 },
  { label: "30 dias", days: 30 },
  { label: "90 dias", days: 90 },
];

export default function Reports() {
  const [period, setPeriod] = useState(30);

  const chartData = useMemo(() => {
    if (period === 7) return spendChartData.slice(-7);
    if (period === 30) return spendChartData;
    // 90 days — repeat weekly data 3x with slight variation
    return weeklyData.map(w => ({
      ...w,
      date: w.week,
      spend: w.spend,
      revenue: w.revenue,
    }));
  }, [period]);

  const roasAcosData = useMemo(() =>
    weeklyData.map(w => ({
      week: w.week,
      ROAS: parseFloat((w.revenue / w.spend).toFixed(2)),
      ACoS: parseFloat(((w.spend / w.revenue) * 100).toFixed(2)),
    }))
  , []);

  const campaignPerf = useMemo(() =>
    campaigns.map(c => ({
      ...c,
      roas: parseFloat(c.roas.toFixed(2)),
    })).sort((a, b) => b.revenue - a.revenue)
  , []);

  const totals = useMemo(() => ({
    spend: campaignPerf.reduce((s, c) => s + c.spend, 0),
    revenue: campaignPerf.reduce((s, c) => s + c.revenue, 0),
    orders: campaignPerf.reduce((s, c) => s + c.orders, 0),
    impressions: campaignPerf.reduce((s, c) => s + c.impressions, 0),
    clicks: campaignPerf.reduce((s, c) => s + c.clicks, 0),
  }), [campaignPerf]);

  return (
    <div className="space-y-6">
      {/* Period selector */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
          {PERIODS.map(({ label, days }) => (
            <button key={days} onClick={() => setPeriod(days)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${period === days ? "bg-white shadow text-gray-800" : "text-gray-500 hover:text-gray-700"}`}>
              {label}
            </button>
          ))}
        </div>
        <button className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors">
          <Download size={14} />
          Exportar CSV
        </button>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: "Gasto Total", val: fmt(totals.spend), color: "text-gray-800" },
          { label: "Receita Total", val: fmt(totals.revenue), color: "text-green-600" },
          { label: "Pedidos", val: totals.orders.toLocaleString("pt-BR"), color: "text-blue-600" },
          { label: "Impressões", val: totals.impressions.toLocaleString("pt-BR"), color: "text-purple-600" },
          { label: "Cliques", val: totals.clicks.toLocaleString("pt-BR"), color: "text-sky-600" },
        ].map(({ label, val, color }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <p className="text-xs text-gray-500 mb-1">{label}</p>
            <p className={`text-xl font-bold ${color}`}>{val}</p>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Spend vs Revenue bar */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Gasto vs Receita por Período</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={period === 30 ? spendChartData.filter((_, i) => i % 3 === 0) : chartData}
              margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey={period === 30 ? "date" : "date"} tick={{ fontSize: 10, fill: "#9ca3af" }} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} tickLine={false} axisLine={false}
                tickFormatter={v => `R$${v}`} />
              <Tooltip content={<CustomTooltip />} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="revenue" name="Receita" fill="#22c55e" radius={[3, 3, 0, 0]} />
              <Bar dataKey="spend" name="Gasto" fill="#f97316" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* ROAS & ACoS line */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Evolução de ROAS e ACoS (semanal)</h2>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={roasAcosData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="week" tick={{ fontSize: 10, fill: "#9ca3af" }} tickLine={false} />
              <YAxis yAxisId="left" tick={{ fontSize: 10, fill: "#9ca3af" }} tickLine={false} axisLine={false} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10, fill: "#9ca3af" }} tickLine={false} axisLine={false}
                tickFormatter={v => `${v}%`} />
              <Tooltip content={<CustomTooltip />} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
              <Line yAxisId="left" type="monotone" dataKey="ROAS" stroke="#3b82f6" strokeWidth={2}
                dot={{ r: 3 }} activeDot={{ r: 5 }} />
              <Line yAxisId="right" type="monotone" dataKey="ACoS" stroke="#f97316" strokeWidth={2}
                dot={{ r: 3 }} activeDot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Campaign performance table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-700">Performance por Campanha</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs min-w-max">
            <thead>
              <tr className="bg-gray-50">
                {["Campanha", "Tipo", "Gasto", "Receita", "ROAS", "ACoS", "Pedidos", "Impressões", "Cliques", "CTR", "CPC"].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-gray-500 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {campaignPerf.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-800 max-w-xs truncate">{c.name}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{c.type.split(" ")[1]}</td>
                  <td className="px-4 py-3 text-gray-700">{fmt(c.spend)}</td>
                  <td className="px-4 py-3 font-semibold text-green-600">{fmt(c.revenue)}</td>
                  <td className="px-4 py-3 font-semibold text-blue-600">{c.roas.toFixed(1)}x</td>
                  <td className={`px-4 py-3 font-medium ${c.acos > 10 ? "text-red-500" : "text-gray-700"}`}>
                    {fmt(c.acos, "percent")}
                  </td>
                  <td className="px-4 py-3 text-gray-700">{c.orders}</td>
                  <td className="px-4 py-3 text-gray-600">{c.impressions.toLocaleString("pt-BR")}</td>
                  <td className="px-4 py-3 text-gray-600">{c.clicks.toLocaleString("pt-BR")}</td>
                  <td className="px-4 py-3 text-gray-600">{fmt(c.ctr, "percent")}</td>
                  <td className="px-4 py-3 text-gray-600">{fmt(c.cpc)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-gray-50 font-semibold">
                <td colSpan={2} className="px-4 py-3 text-gray-700 text-xs">TOTAL</td>
                <td className="px-4 py-3 text-xs text-gray-800">{fmt(totals.spend)}</td>
                <td className="px-4 py-3 text-xs text-green-600">{fmt(totals.revenue)}</td>
                <td className="px-4 py-3 text-xs text-blue-600">{(totals.revenue / totals.spend).toFixed(1)}x</td>
                <td className="px-4 py-3 text-xs text-gray-800">{((totals.spend / totals.revenue) * 100).toFixed(2)}%</td>
                <td className="px-4 py-3 text-xs text-gray-800">{totals.orders}</td>
                <td className="px-4 py-3 text-xs text-gray-800">{totals.impressions.toLocaleString("pt-BR")}</td>
                <td className="px-4 py-3 text-xs text-gray-800">{totals.clicks.toLocaleString("pt-BR")}</td>
                <td colSpan={2} />
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
