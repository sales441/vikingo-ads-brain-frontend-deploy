import React, { useState } from "react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { TrendingUp, Calendar, Sun, CloudSnow, Star, AlertTriangle } from "lucide-react";

const MONTHS = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];

const seasonalData = [
  { mes:"Jan", demanda:65, cpc:0.62, conversao:5.8, oportunidade:60 },
  { mes:"Fev", demanda:58, cpc:0.58, conversao:5.5, oportunidade:55 },
  { mes:"Mar", demanda:72, cpc:0.68, conversao:6.1, oportunidade:70 },
  { mes:"Abr", demanda:80, cpc:0.74, conversao:6.8, oportunidade:78 },
  { mes:"Mai", demanda:95, cpc:0.88, conversao:7.4, oportunidade:86 },
  { mes:"Jun", demanda:88, cpc:0.82, conversao:7.1, oportunidade:80 },
  { mes:"Jul", demanda:78, cpc:0.73, conversao:6.5, oportunidade:72 },
  { mes:"Ago", demanda:85, cpc:0.79, conversao:7.0, oportunidade:79 },
  { mes:"Set", demanda:90, cpc:0.85, conversao:7.3, oportunidade:82 },
  { mes:"Out", demanda:110, cpc:1.05, conversao:8.2, oportunidade:88 },
  { mes:"Nov", demanda:145, cpc:1.38, conversao:9.8, oportunidade:92 },
  { mes:"Dez", demanda:160, cpc:1.52, conversao:10.5, oportunidade:78 },
];

const events = [
  { mes:"Nov", evento:"Black Friday", impacto:"altíssimo", icon:"🛒", dica:"Comece a anunciar 3 semanas antes. Aumente budget 3x na semana do evento." },
  { mes:"Dez", evento:"Natal", impacto:"altíssimo", icon:"🎄", dica:"Último prazo de envio FBA: 10/Dez. Estoque para 60 dias no mínimo." },
  { mes:"Mai", evento:"Dia das Mães", impacto:"alto", icon:"💐", dica:"Pico de conversão. Lance 2 semanas antes com bid 40% maior." },
  { mes:"Jun", evento:"Amazon Prime Day", impacto:"alto", icon:"⚡", dica:"Ofereça desconto mínimo 20%. Estoque 45 dias antes do evento." },
  { mes:"Out", evento:"Dia das Crianças", impacto:"médio", icon:"🎮", dica:"Relevante para eletrônicos e brinquedos." },
  { mes:"Mar", evento:"Dia do Consumidor", impacto:"médio", icon:"🛍️", dica:"Ótima oportunidade para liquidar estoque antigo com promoção." },
];

const curMonth = new Date().getMonth();
const nextEvents = events.filter(e => {
  const eIdx = MONTHS.indexOf(e.mes);
  const diff = (eIdx - curMonth + 12) % 12;
  return diff <= 3;
}).sort((a, b) => {
  const ai = (MONTHS.indexOf(a.mes) - curMonth + 12) % 12;
  const bi = (MONTHS.indexOf(b.mes) - curMonth + 12) % 12;
  return ai - bi;
});

const impactColor = { "altíssimo":"text-red-600 bg-red-50 border-red-200", "alto":"text-orange-600 bg-orange-50 border-orange-200", "médio":"text-yellow-600 bg-yellow-50 border-yellow-200" };

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-3 text-xs">
      <p className="font-semibold text-gray-700 mb-1">{label}</p>
      {payload.map(p => <p key={p.name} style={{ color: p.color }}>{p.name}: {p.value}{p.name === "CPC" ? " R$" : p.name === "Conversão" ? "%" : ""}</p>)}
    </div>
  );
};

export default function SeasonalTrends() {
  const [metric, setMetric] = useState("demanda");
  const curData = seasonalData[curMonth];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-sky-100 flex items-center justify-center"><Calendar size={20} className="text-sky-600" /></div>
        <div><h1 className="text-xl font-bold text-gray-900">Tendências Sazonais</h1>
          <p className="text-sm text-gray-500">Planeje budget e estoque com antecedência</p></div>
      </div>

      {/* Current month highlight */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-3"><Star size={14} className="text-orange-400" /><span className="text-orange-400 text-sm font-semibold">Mês Atual — {MONTHS[curMonth]}</span></div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label:"Índice de Demanda", value:`${curData.demanda}`, suffix:"/100", color:"text-white" },
            { label:"CPC Médio estimado", value:`R$ ${curData.cpc.toFixed(2)}`, color:"text-orange-300" },
            { label:"Conversão estimada", value:`${curData.conversao}%`, color:"text-green-400" },
            { label:"Índice de Oportunidade", value:`${curData.oportunidade}`, suffix:"/100", color:"text-blue-400" },
          ].map(({ label, value, suffix, color }) => (
            <div key={label} className="bg-slate-700/50 rounded-lg p-3">
              <p className={`text-xl font-bold ${color}`}>{value}<span className="text-xs ml-0.5">{suffix}</span></p>
              <p className="text-xs text-slate-400 mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Próximos eventos */}
      {nextEvents.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-sm font-semibold text-gray-700">Próximos Eventos (3 meses)</h2>
          {nextEvents.map((e, i) => (
            <div key={i} className={`flex items-start gap-3 border rounded-xl px-4 py-3 ${impactColor[e.impacto]}`}>
              <span className="text-xl">{e.icon}</span>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-semibold text-sm">{e.evento}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-white/60 font-medium">{e.mes} • {e.impacto}</span>
                </div>
                <p className="text-xs opacity-80">{e.dica}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Annual chart */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-gray-700">Calendário Anual de Demanda</h2>
          <div className="flex gap-2">
            {[["demanda","Demanda"],["cpc","CPC"],["conversao","Conversão"]].map(([v,l]) => (
              <button key={v} onClick={() => setMetric(v)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${metric === v ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-600"}`}>{l}</button>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={seasonalData} margin={{ top:5, right:10, left:0, bottom:0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="mes" tick={{ fontSize:10, fill:"#9ca3af" }} tickLine={false} />
            <YAxis tick={{ fontSize:10, fill:"#9ca3af" }} tickLine={false} axisLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey={metric} name={metric === "demanda" ? "Índice Demanda" : metric === "cpc" ? "CPC" : "Conversão"} fill="#f97316" radius={[4,4,0,0]}
              label={{ position:"top", fontSize:9, fill:"#9ca3af" }} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* All events table */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100"><h2 className="text-sm font-semibold text-gray-700">Todos os Eventos do Ano</h2></div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead><tr className="bg-gray-50">
              {["Mês","Evento","Impacto","Dica"].map(h => <th key={h} className="px-4 py-2.5 text-left text-gray-500 font-medium">{h}</th>)}
            </tr></thead>
            <tbody className="divide-y divide-gray-50">
              {events.map((e, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-4 py-2.5 font-medium text-gray-700">{e.mes}</td>
                  <td className="px-4 py-2.5"><span className="flex items-center gap-1.5">{e.icon} {e.evento}</span></td>
                  <td className="px-4 py-2.5"><span className={`px-2 py-0.5 rounded-full font-medium text-xs border ${impactColor[e.impacto]}`}>{e.impacto}</span></td>
                  <td className="px-4 py-2.5 text-gray-600 max-w-xs">{e.dica}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
