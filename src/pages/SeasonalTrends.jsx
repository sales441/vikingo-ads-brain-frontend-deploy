import React, { useState } from "react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { TrendingUp, Calendar, Sun, CloudSnow, Star, AlertTriangle } from "lucide-react";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const seasonalData = [
  { month:"Jan", demand:65, cpc:0.62, conversion:5.8, opportunity:60 },
  { month:"Feb", demand:68, cpc:0.58, conversion:5.5, opportunity:55 },
  { month:"Mar", demand:72, cpc:0.68, conversion:6.1, opportunity:70 },
  { month:"Apr", demand:80, cpc:0.74, conversion:6.8, opportunity:78 },
  { month:"May", demand:95, cpc:0.88, conversion:7.4, opportunity:86 },
  { month:"Jun", demand:88, cpc:0.82, conversion:7.1, opportunity:80 },
  { month:"Jul", demand:105, cpc:1.02, conversion:7.9, opportunity:88 },
  { month:"Aug", demand:85, cpc:0.79, conversion:7.0, opportunity:79 },
  { month:"Sep", demand:90, cpc:0.85, conversion:7.3, opportunity:82 },
  { month:"Oct", demand:110, cpc:1.05, conversion:8.2, opportunity:88 },
  { month:"Nov", demand:160, cpc:1.52, conversion:10.5, opportunity:92 },
  { month:"Dec", demand:145, cpc:1.38, conversion:9.8, opportunity:78 },
];

const events = [
  { month:"Nov", event:"Black Friday / Cyber Monday", impact:"very high", icon:"🛒", tip:"Start advertising 3 weeks before. Increase budget 3x during event week." },
  { month:"Dec", event:"Christmas / Holiday Season", impact:"very high", icon:"🎄", tip:"Final FBA shipping deadline: Dec 10. Stock at least 60 days of inventory." },
  { month:"May", event:"Mother's Day", impact:"high", icon:"💐", tip:"Peak conversion period. Launch 2 weeks early with 40% higher bids." },
  { month:"Jul", event:"Amazon Prime Day", impact:"high", icon:"⚡", tip:"Offer at least 20% discount. Stock 45 days before the event." },
  { month:"Feb", event:"Valentine's Day", impact:"medium", icon:"💝", tip:"Great for gifting and beauty categories." },
  { month:"Sep", event:"Back to School", impact:"medium", icon:"🎒", tip:"Start end of July; peaks in mid-August through early September." },
];

const curMonth = new Date().getMonth();
const nextEvents = events.filter(e => {
  const eIdx = MONTHS.indexOf(e.month);
  const diff = (eIdx - curMonth + 12) % 12;
  return diff <= 3;
}).sort((a, b) => {
  const ai = (MONTHS.indexOf(a.month) - curMonth + 12) % 12;
  const bi = (MONTHS.indexOf(b.month) - curMonth + 12) % 12;
  return ai - bi;
});

const impactColor = { "very high":"text-red-600 bg-red-50 border-red-200", "high":"text-orange-600 bg-orange-50 border-orange-200", "medium":"text-yellow-600 bg-yellow-50 border-yellow-200" };

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-3 text-xs">
      <p className="font-semibold text-gray-700 mb-1">{label}</p>
      {payload.map(p => <p key={p.name} style={{ color: p.color }}>{p.name}: {p.value}{p.name === "CPC" ? " $" : p.name === "Conversion" ? "%" : ""}</p>)}
    </div>
  );
};

export default function SeasonalTrends() {
  const [metric, setMetric] = useState("demand");
  const curData = seasonalData[curMonth];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-sky-100 flex items-center justify-center"><Calendar size={20} className="text-sky-600" /></div>
        <div><h1 className="text-xl font-bold text-gray-900">Seasonal Trends</h1>
          <p className="text-sm text-gray-500">Plan budget and inventory in advance</p></div>
      </div>

      {/* Current month highlight */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-3"><Star size={14} className="text-orange-400" /><span className="text-orange-400 text-sm font-semibold">Current Month — {MONTHS[curMonth]}</span></div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label:"Demand Index", value:`${curData.demand}`, suffix:"/100", color:"text-white" },
            { label:"Estimated avg. CPC", value:`$${curData.cpc.toFixed(2)}`, color:"text-orange-300" },
            { label:"Estimated conversion", value:`${curData.conversion}%`, color:"text-green-400" },
            { label:"Opportunity Index", value:`${curData.opportunity}`, suffix:"/100", color:"text-blue-400" },
          ].map(({ label, value, suffix, color }) => (
            <div key={label} className="bg-slate-700/50 rounded-lg p-3">
              <p className={`text-xl font-bold ${color}`}>{value}<span className="text-xs ml-0.5">{suffix}</span></p>
              <p className="text-xs text-slate-400 mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming events */}
      {nextEvents.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-sm font-semibold text-gray-700">Upcoming Events (next 3 months)</h2>
          {nextEvents.map((e, i) => (
            <div key={i} className={`flex items-start gap-3 border rounded-xl px-4 py-3 ${impactColor[e.impact]}`}>
              <span className="text-xl">{e.icon}</span>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-semibold text-sm">{e.event}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-white/60 font-medium">{e.month} • {e.impact}</span>
                </div>
                <p className="text-xs opacity-80">{e.tip}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Annual chart */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-gray-700">Annual Demand Calendar</h2>
          <div className="flex gap-2">
            {[["demand","Demand"],["cpc","CPC"],["conversion","Conversion"]].map(([v,l]) => (
              <button key={v} onClick={() => setMetric(v)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${metric === v ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-600"}`}>{l}</button>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={seasonalData} margin={{ top:5, right:10, left:0, bottom:0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" tick={{ fontSize:10, fill:"#9ca3af" }} tickLine={false} />
            <YAxis tick={{ fontSize:10, fill:"#9ca3af" }} tickLine={false} axisLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey={metric} name={metric === "demand" ? "Demand Index" : metric === "cpc" ? "CPC" : "Conversion"} fill="#f97316" radius={[4,4,0,0]}
              label={{ position:"top", fontSize:9, fill:"#9ca3af" }} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* All events table */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100"><h2 className="text-sm font-semibold text-gray-700">All Events This Year</h2></div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead><tr className="bg-gray-50">
              {["Month","Event","Impact","Tip"].map(h => <th key={h} className="px-4 py-2.5 text-left text-gray-500 font-medium">{h}</th>)}
            </tr></thead>
            <tbody className="divide-y divide-gray-50">
              {events.map((e, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-4 py-2.5 font-medium text-gray-700">{e.month}</td>
                  <td className="px-4 py-2.5"><span className="flex items-center gap-1.5">{e.icon} {e.event}</span></td>
                  <td className="px-4 py-2.5"><span className={`px-2 py-0.5 rounded-full font-medium text-xs border ${impactColor[e.impact]}`}>{e.impact}</span></td>
                  <td className="px-4 py-2.5 text-gray-600 max-w-xs">{e.tip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
