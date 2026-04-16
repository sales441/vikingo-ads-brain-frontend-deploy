import React, { useState } from "react";
import { Tag, BrainCircuit, RefreshCw, TrendingUp, AlertTriangle, CheckCircle, DollarSign, Zap } from "lucide-react";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const MOCK = {
  precoAtual: 89.90,
  precoIdeal: 97.90,
  precoMinimo: 72.00,
  precoMaximo: 115.00,
  impactoReceita: "+12.4%",
  impactoConversao: "-3.1%",
  impactoLucro: "+18.7%",
  estrategia: "Seu produto está precificado abaixo do ideal para a categoria. O mercado aceita até R$115 para este perfil de produto. Recomendamos aumentar para R$97,90 — a elasticidade indica queda mínima de conversão com ganho significativo de margem.",
  benchmarks: [
    { nome:"Mondial 6L", preco:79.90, rating:4.2, bsr:342, posicao:"Mais barato" },
    { nome:"Tramontina 5L", preco:119.90, rating:4.6, bsr:198, posicao:"Premium" },
    { nome:"Oster 4L", preco:64.90, rating:4.1, bsr:891, posicao:"Entry-level" },
    { nome:"Philips 6L", preco:149.90, rating:4.4, bsr:520, posicao:"Top" },
    { nome:"Walita 5.5L", preco:98.90, rating:4.2, bsr:670, posicao:"Médio" },
  ],
  cenarios: [
    { preco: 79.90, conversao: 8.2, unidades: 185, receita: 14781.5, lucroUnit: 18.3 },
    { preco: 89.90, conversao: 7.1, unidades: 160, receita: 14384.0, lucroUnit: 24.1 },
    { preco: 97.90, conversao: 6.4, unidades: 144, receita: 14097.6, lucroUnit: 30.8 },
    { preco: 109.90, conversao: 5.2, unidades: 117, receita: 12858.3, lucroUnit: 40.2 },
    { preco: 119.90, conversao: 4.1, unidades: 92, receita: 11030.8, lucroUnit: 48.7 },
  ],
  alertas: ["Concorrente principal reduziu preço 15% esta semana", "Buy Box perdido para produto com preço R$82,90"],
};

export default function PricingOptimizer() {
  const [form, setForm] = useState({ productName:"", currentPrice:"89.90", cost:"25.00", category:"", competitors:"" });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const ch = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const optimize = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/ai/pricing`, {
        method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify(form),
      });
      const data = await res.json();
      setResult(data.result || MOCK);
    } catch { setResult(MOCK); }
    finally { setLoading(false); }
  };

  const r = result;
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center"><Tag size={20} className="text-blue-600" /></div>
        <div><h1 className="text-xl font-bold text-gray-900">Otimizador de Preço</h1>
          <p className="text-sm text-gray-500">IA encontra o preço ideal para maximizar lucro e conversão</p></div>
      </div>

      {!result ? (
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm max-w-xl space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2"><label className="block text-xs font-semibold text-gray-700 mb-1.5">Nome do Produto</label>
              <input name="productName" value={form.productName} onChange={ch} placeholder="Ex: Panela de Pressão Elétrica 6L" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" /></div>
            <div><label className="block text-xs font-semibold text-gray-700 mb-1.5">Preço Atual (R$)</label>
              <input name="currentPrice" type="number" value={form.currentPrice} onChange={ch} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" /></div>
            <div><label className="block text-xs font-semibold text-gray-700 mb-1.5">Custo do Produto (R$)</label>
              <input name="cost" type="number" value={form.cost} onChange={ch} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" /></div>
            <div className="col-span-2"><label className="block text-xs font-semibold text-gray-700 mb-1.5">Concorrentes e Preços</label>
              <input name="competitors" value={form.competitors} onChange={ch} placeholder="Mondial R$79, Tramontina R$119..." className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" /></div>
          </div>
          <button onClick={optimize} disabled={loading} className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold py-3 rounded-xl transition-all text-sm">
            {loading ? <><RefreshCw size={15} className="animate-spin" />Analisando...</> : <><BrainCircuit size={15} />Otimizar Preço com IA</>}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <button onClick={() => setResult(null)} className="text-sm text-orange-600 font-medium">← Nova análise</button>

          {/* Alertas */}
          {r.alertas?.map((a, i) => (
            <div key={i} className="flex items-center gap-2 bg-orange-50 border border-orange-200 text-orange-800 rounded-xl px-4 py-2.5 text-sm">
              <AlertTriangle size={14} /> {a}
            </div>
          ))}

          {/* Recomendação principal */}
          <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3"><Zap size={16} className="text-orange-400" /><span className="text-orange-400 text-sm font-semibold">Preço Recomendado</span></div>
            <div className="flex items-end gap-4 mb-3">
              <div><p className="text-xs text-slate-400">Atual</p><p className="text-2xl font-bold text-slate-300">R$ {r.precoAtual?.toFixed(2)}</p></div>
              <span className="text-slate-500 text-xl mb-1">→</span>
              <div><p className="text-xs text-orange-400">Ideal</p><p className="text-3xl font-bold text-white">R$ {r.precoIdeal?.toFixed(2)}</p></div>
            </div>
            <div className="grid grid-cols-3 gap-3 mb-3">
              {[
                { label:"Impacto Receita", value: r.impactoReceita, color: "text-green-400" },
                { label:"Impacto Conversão", value: r.impactoConversao, color: "text-yellow-400" },
                { label:"Impacto Lucro", value: r.impactoLucro, color: "text-emerald-400" },
              ].map(({ label, value, color }) => (
                <div key={label} className="bg-slate-700/50 rounded-lg p-2.5 text-center">
                  <p className={`text-sm font-bold ${color}`}>{value}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{label}</p>
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">{r.estrategia}</p>
          </div>

          {/* Cenários */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100"><h3 className="text-sm font-semibold text-gray-700">Simulação de Cenários</h3></div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead><tr className="bg-gray-50">
                  {["Preço","Conversão","Unid./mês","Receita/mês","Lucro/unid."].map(h => <th key={h} className="px-4 py-2.5 text-left text-gray-500 font-medium">{h}</th>)}
                </tr></thead>
                <tbody className="divide-y divide-gray-50">
                  {r.cenarios?.map((c, i) => {
                    const isIdeal = Math.abs(c.preco - r.precoIdeal) < 1;
                    return (
                      <tr key={i} className={isIdeal ? "bg-orange-50" : "hover:bg-gray-50"}>
                        <td className={`px-4 py-2.5 font-bold ${isIdeal ? "text-orange-600" : "text-gray-800"}`}>
                          R$ {c.preco.toFixed(2)} {isIdeal && <span className="ml-1 text-xs bg-orange-500 text-white px-1.5 py-0.5 rounded-full">ideal</span>}
                        </td>
                        <td className="px-4 py-2.5 text-gray-700">{c.conversao}%</td>
                        <td className="px-4 py-2.5 text-gray-700">{c.unidades}</td>
                        <td className="px-4 py-2.5 font-medium text-green-600">R$ {c.receita.toLocaleString("pt-BR",{minimumFractionDigits:2})}</td>
                        <td className="px-4 py-2.5 font-medium text-blue-600">R$ {c.lucroUnit.toFixed(2)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Benchmark */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Benchmark de Concorrentes</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {r.benchmarks?.map((b, i) => (
                <div key={i} className="border border-gray-100 rounded-lg p-3">
                  <p className="text-xs text-gray-500 truncate">{b.nome}</p>
                  <p className="text-base font-bold text-gray-800">R$ {b.preco.toFixed(2)}</p>
                  <p className="text-xs text-orange-500">{b.posicao}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
