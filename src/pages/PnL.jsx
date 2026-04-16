import React, { useState } from "react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Percent, Award } from "lucide-react";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const now = new Date();

function genMonths(n) {
  return Array.from({ length: n }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (n - 1 - i), 1);
    return MONTHS[d.getMonth()] + "/" + String(d.getFullYear()).slice(2);
  });
}

const months = genMonths(12);
const revenue =  [18200, 21500, 19800, 24300, 22100, 26700, 28400, 25900, 31200, 29800, 34100, 38500];
const adSpend =  [3200,  3800,  3500,  4100,  3900,  4600,  4900,  4400,  5200,  5100,  5800,  6400];
const cogs =     [6300,  7400,  6900,  8400,  7700,  9200,  9800,  8900, 10700, 10200, 11700, 13200];
const fees =     [2730,  3225,  2970,  3645,  3315,  4005,  4260,  3885,  4680,  4470,  5115,  5775];
const taxes =    [910,   1075,   990,  1215,  1105,  1335,  1420,  1295,  1560,  1490,  1705,  1925];

const pnlData = months.map((m, i) => {
  const gross = revenue[i];
  const totalCosts = adSpend[i] + cogs[i] + fees[i] + taxes[i];
  const net = gross - totalCosts;
  return { month: m, revenue: gross, costs: totalCosts, profit: net, adSpend: adSpend[i], cogs: cogs[i], fees: fees[i] };
});

const totalRevenue = revenue.reduce((a, b) => a + b, 0);
const totalAds = adSpend.reduce((a, b) => a + b, 0);
const totalCOGS = cogs.reduce((a, b) => a + b, 0);
const totalFees = fees.reduce((a, b) => a + b, 0);
const totalTax = taxes.reduce((a, b) => a + b, 0);
const totalCosts = totalAds + totalCOGS + totalFees + totalTax;
const totalNet = totalRevenue - totalCosts;
const avgMargin = (totalNet / totalRevenue) * 100;

const fmt = v => `$${Number(v).toLocaleString("en-US", { minimumFractionDigits: 0 })}`;

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-3 text-xs">
      <p className="font-semibold text-gray-700 mb-1">{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{ color: p.color }}>{p.name}: {fmt(p.value)}</p>
      ))}
    </div>
  );
};

export default function PnL() {
  const [period, setPeriod] = useState("12");
  const n = parseInt(period);
  const slice = pnlData.slice(-n);
  const sliceRev = revenue.slice(-n).reduce((a, b) => a + b, 0);
  const sliceNet = slice.reduce((a, s) => a + s.profit, 0);
  const sliceMargin = (sliceNet / sliceRev) * 100;
  const lastMonth = slice[slice.length - 1];
  const prevMonth = slice[slice.length - 2];
  const revDelta = prevMonth ? ((lastMonth.revenue - prevMonth.revenue) / prevMonth.revenue * 100).toFixed(1) : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center"><TrendingUp size={20} className="text-green-600" /></div>
          <div><h1 className="text-xl font-bold text-gray-900">P&L Dashboard</h1>
            <p className="text-sm text-gray-500">Profit and Loss — full business view</p></div>
        </div>
        <div className="flex gap-2">
          {["3","6","12"].map(p => (
            <button key={p} onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${period === p ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
              {p}m
            </button>
          ))}
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Revenue", value: fmt(sliceRev), icon: DollarSign, color: "text-green-600", bg: "bg-green-50" },
          { label: "Net Profit", value: fmt(sliceNet), icon: TrendingUp, color: sliceNet >= 0 ? "text-emerald-600" : "text-red-500", bg: sliceNet >= 0 ? "bg-emerald-50" : "bg-red-50" },
          { label: "Average Margin", value: `${sliceMargin.toFixed(1)}%`, icon: Percent, color: sliceMargin >= 20 ? "text-blue-600" : "text-orange-600", bg: "bg-blue-50" },
          { label: "Last month change", value: revDelta ? `${revDelta > 0 ? "+" : ""}${revDelta}%` : "—", icon: revDelta > 0 ? TrendingUp : TrendingDown, color: revDelta > 0 ? "text-green-600" : "text-red-500", bg: "bg-gray-50" },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <div className={`w-8 h-8 ${bg} rounded-lg flex items-center justify-center mb-2`}><Icon size={16} className={color} /></div>
            <p className={`text-xl font-bold ${color}`}>{value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Revenue vs Costs chart */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">Revenue vs Costs vs Profit</h2>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={slice} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#9ca3af" }} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} tickLine={false} axisLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
            <Tooltip content={<CustomTooltip />} />
            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
            <Bar dataKey="revenue" name="Revenue" fill="#22c55e" radius={[3,3,0,0]} />
            <Bar dataKey="costs" name="Costs" fill="#f97316" radius={[3,3,0,0]} />
            <Bar dataKey="profit" name="Profit" fill="#3b82f6" radius={[3,3,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Cost breakdown + table */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Cost Breakdown ({period}m)</h2>
          {[
            { label: "Cost of Goods (COGS)", value: cogs.slice(-n).reduce((a,b)=>a+b,0), color: "bg-red-400" },
            { label: "Amazon Fees (15%)", value: fees.slice(-n).reduce((a,b)=>a+b,0), color: "bg-orange-400" },
            { label: "Ad Spend", value: adSpend.slice(-n).reduce((a,b)=>a+b,0), color: "bg-yellow-400" },
            { label: "Taxes", value: taxes.slice(-n).reduce((a,b)=>a+b,0), color: "bg-purple-400" },
          ].map(({ label, value, color }) => {
            const total = cogs.slice(-n).reduce((a,b)=>a+b,0) + fees.slice(-n).reduce((a,b)=>a+b,0) + adSpend.slice(-n).reduce((a,b)=>a+b,0) + taxes.slice(-n).reduce((a,b)=>a+b,0);
            const pct = ((value / total) * 100).toFixed(1);
            return (
              <div key={label} className="mb-3">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-600">{label}</span>
                  <span className="font-medium text-gray-800">{fmt(value)} ({pct}%)</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5">
                  <div className={`${color} h-1.5 rounded-full`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-700">Monthly P&L</h2>
          </div>
          <div className="overflow-y-auto max-h-64">
            <table className="w-full text-xs">
              <thead><tr className="bg-gray-50">
                {["Month","Revenue","Costs","Profit","Margin"].map(h => <th key={h} className="px-3 py-2 text-left text-gray-500 font-medium">{h}</th>)}
              </tr></thead>
              <tbody className="divide-y divide-gray-50">
                {[...slice].reverse().map(row => {
                  const m = (row.profit / row.revenue * 100).toFixed(1);
                  return (
                    <tr key={row.month} className="hover:bg-gray-50">
                      <td className="px-3 py-2 font-medium text-gray-700">{row.month}</td>
                      <td className="px-3 py-2 text-green-600">{fmt(row.revenue)}</td>
                      <td className="px-3 py-2 text-red-500">{fmt(row.costs)}</td>
                      <td className={`px-3 py-2 font-semibold ${row.profit >= 0 ? "text-blue-600" : "text-red-600"}`}>{fmt(row.profit)}</td>
                      <td className={`px-3 py-2 ${+m >= 15 ? "text-green-600" : "text-orange-600"}`}>{m}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
