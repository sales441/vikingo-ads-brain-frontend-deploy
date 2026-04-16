import React, { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { TrendingUp, TrendingDown, Search, Plus, Trash2, Award } from "lucide-react";

const DAYS = Array.from({length:30},(_,i)=>{const d=new Date(); d.setDate(d.getDate()-(29-i)); return d.toLocaleDateString("pt-BR",{day:"2-digit",month:"2-digit"});});

function genRank(start, volatility = 3, trend = -0.5) {
  let r = start;
  return DAYS.map(() => { r = Math.max(1, Math.round(r + trend + (Math.random()-0.5)*volatility)); return r; });
}

const MOCK_KEYWORDS = [
  { id:1, keyword:"panela pressão elétrica", organic: genRank(28, 4, -0.8), paid: genRank(3, 1, 0), color:"#f97316", active:true },
  { id:2, keyword:"panela pressão inox", organic: genRank(45, 5, -1.2), paid: genRank(5, 2, 0.1), color:"#3b82f6", active:true },
  { id:3, keyword:"panela elétrica 6 litros", organic: genRank(62, 6, -1.5), paid: genRank(4, 1, -0.1), color:"#22c55e", active:true },
];

function rankDelta(arr) {
  const last = arr[arr.length - 1];
  const prev = arr[arr.length - 8] ?? arr[0];
  return prev - last; // positive = improved (rank number decreased)
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-3 text-xs">
      <p className="font-semibold text-gray-700 mb-1">{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{ color: p.color }}>{p.name}: #{p.value}</p>
      ))}
    </div>
  );
};

export default function RankingTracker() {
  const [keywords, setKeywords] = useState(MOCK_KEYWORDS);
  const [newKw, setNewKw] = useState("");
  const [view, setView] = useState("organic"); // organic | paid

  const addKeyword = () => {
    if (!newKw.trim()) return;
    const colors = ["#8b5cf6","#ec4899","#14b8a6","#f59e0b"];
    setKeywords(ks => [...ks, {
      id: Date.now(), keyword: newKw.trim(),
      organic: genRank(80, 8, -2),
      paid: genRank(10, 3, 0),
      color: colors[ks.length % colors.length],
      active: true,
    }]);
    setNewKw("");
  };

  const toggle = id => setKeywords(ks => ks.map(k => k.id === id ? { ...k, active: !k.active } : k));
  const remove = id => setKeywords(ks => ks.filter(k => k.id !== id));

  const chartData = DAYS.map((day, i) => {
    const obj = { day };
    keywords.filter(k => k.active).forEach(k => {
      obj[`${k.keyword}_org`] = k.organic[i];
      obj[`${k.keyword}_paid`] = k.paid[i];
    });
    return obj;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center"><Award size={20} className="text-purple-600" /></div>
        <div><h1 className="text-xl font-bold text-gray-900">Rastreador de Ranking</h1>
          <p className="text-sm text-gray-500">Posição orgânica e paga por keyword nos últimos 30 dias</p></div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {keywords.map(k => {
          const delta = rankDelta(k.organic);
          const current = k.organic[k.organic.length - 1];
          return (
            <div key={k.id} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
              <p className="text-xs text-gray-500 truncate mb-1">{k.keyword}</p>
              <p className="text-2xl font-bold text-gray-800">#{current}</p>
              <div className={`flex items-center gap-1 text-xs font-medium mt-1 ${delta > 0 ? "text-green-600" : delta < 0 ? "text-red-500" : "text-gray-400"}`}>
                {delta > 0 ? <TrendingUp size={12} /> : delta < 0 ? <TrendingDown size={12} /> : null}
                {delta > 0 ? `+${delta} posições` : delta < 0 ? `${delta} posições` : "Estável"} (7d)
              </div>
            </div>
          );
        })}
      </div>

      {/* Chart */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-gray-700">Evolução do Ranking — 30 dias</h2>
          <div className="flex gap-2">
            {["organic","paid"].map(v => (
              <button key={v} onClick={() => setView(v)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${view === v ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-600"}`}>
                {v === "organic" ? "Orgânico" : "Pago (Ads)"}
              </button>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="day" tick={{ fontSize: 9, fill: "#9ca3af" }} tickLine={false} interval={4} />
            <YAxis reversed tick={{ fontSize: 10, fill: "#9ca3af" }} tickLine={false} axisLine={false} tickFormatter={v => `#${v}`} domain={['auto','auto']} />
            <Tooltip content={<CustomTooltip />} />
            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
            {keywords.filter(k => k.active).map(k => (
              <Line key={k.id} type="monotone"
                dataKey={view === "organic" ? `${k.keyword}_org` : `${k.keyword}_paid`}
                name={k.keyword} stroke={k.color} strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
            ))}
          </LineChart>
        </ResponsiveContainer>
        <p className="text-xs text-gray-400 mt-2">* Y invertido: posição #1 = topo. Subir no gráfico = melhorar ranking.</p>
      </div>

      {/* Keyword list + add */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-3">
        <h2 className="text-sm font-semibold text-gray-700">Keywords Rastreadas</h2>
        {keywords.map(k => {
          const delta = rankDelta(k.organic);
          const current = k.organic[k.organic.length - 1];
          return (
            <div key={k.id} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
              <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: k.color }} />
              <span className="flex-1 text-sm text-gray-700">{k.keyword}</span>
              <span className="text-xs text-gray-500">Orgânico #{current}</span>
              <span className="text-xs text-gray-500">Pago #{k.paid[k.paid.length-1]}</span>
              <span className={`text-xs font-medium ${delta > 0 ? "text-green-600" : delta < 0 ? "text-red-500" : "text-gray-400"}`}>
                {delta > 0 ? `↑${delta}` : delta < 0 ? `↓${Math.abs(delta)}` : "="}
              </span>
              <button onClick={() => remove(k.id)} className="text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={13} /></button>
            </div>
          );
        })}
        <div className="flex gap-2 pt-1">
          <input value={newKw} onChange={e => setNewKw(e.target.value)} onKeyDown={e => e.key === "Enter" && addKeyword()}
            placeholder="Adicionar keyword para rastrear..."
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
          <button onClick={addKeyword} className="flex items-center gap-1.5 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-xl transition-colors">
            <Plus size={14} /> Rastrear
          </button>
        </div>
      </div>
    </div>
  );
}
