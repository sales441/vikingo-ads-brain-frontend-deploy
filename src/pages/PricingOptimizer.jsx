import React, { useState } from "react";
import { Tag, BrainCircuit, RefreshCw, TrendingUp, AlertTriangle, CheckCircle, DollarSign, Zap } from "lucide-react";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const MOCK = {
  currentPrice: 29.90,
  idealPrice: 34.90,
  minPrice: 22.00,
  maxPrice: 42.00,
  revenueImpact: "+12.4%",
  conversionImpact: "-3.1%",
  profitImpact: "+18.7%",
  strategy: "Your product is priced below the ideal for this category. The market will pay up to $42 for this product profile. We recommend raising to $34.90 — elasticity shows a minimal drop in conversion with a significant margin gain.",
  benchmarks: [
    { name:"Instant Pot 6Qt", price:79.90, rating:4.2, bsr:342, position:"Cheaper" },
    { name:"Tramontina 5L", price:119.90, rating:4.6, bsr:198, position:"Premium" },
    { name:"Oster 4L", price:64.90, rating:4.1, bsr:891, position:"Entry-level" },
    { name:"Philips 6L", price:149.90, rating:4.4, bsr:520, position:"Top" },
    { name:"Walita 5.5L", price:98.90, rating:4.2, bsr:670, position:"Mid" },
  ],
  scenarios: [
    { price: 24.90, conversion: 8.2, units: 185, revenue: 4606.50, unitProfit: 6.30 },
    { price: 29.90, conversion: 7.1, units: 160, revenue: 4784.00, unitProfit: 8.40 },
    { price: 34.90, conversion: 6.4, units: 144, revenue: 5025.60, unitProfit: 11.60 },
    { price: 39.90, conversion: 5.2, units: 117, revenue: 4668.30, unitProfit: 14.80 },
    { price: 44.90, conversion: 4.1, units: 92, revenue: 4130.80, unitProfit: 18.20 },
  ],
  alerts: ["Main competitor lowered price 15% this week", "Buy Box lost to a product priced at $27.90"],
};

export default function PricingOptimizer() {
  const [form, setForm] = useState({ productName:"", currentPrice:"29.90", cost:"8.00", category:"", competitors:"" });
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
  const currentPrice = r?.currentPrice ?? r?.precoAtual;
  const idealPrice = r?.idealPrice ?? r?.precoIdeal;
  const strategy = r?.strategy ?? r?.estrategia;
  const alerts = r?.alerts ?? r?.alertas;
  const scenarios = r?.scenarios ?? r?.cenarios;
  const benchmarks = r?.benchmarks;
  const revenueImpact = r?.revenueImpact ?? r?.impactoReceita;
  const conversionImpact = r?.conversionImpact ?? r?.impactoConversao;
  const profitImpact = r?.profitImpact ?? r?.impactoLucro;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center"><Tag size={20} className="text-blue-600" /></div>
        <div><h1 className="text-xl font-bold text-gray-900">Price Optimizer</h1>
          <p className="text-sm text-gray-500">AI finds the ideal price to maximize profit and conversion</p></div>
      </div>

      {!result ? (
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm max-w-xl space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2"><label className="block text-xs font-semibold text-gray-700 mb-1.5">Product Name</label>
              <input name="productName" value={form.productName} onChange={ch} placeholder="e.g. Electric Pressure Cooker 6Qt" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" /></div>
            <div><label className="block text-xs font-semibold text-gray-700 mb-1.5">Current Price ($)</label>
              <input name="currentPrice" type="number" value={form.currentPrice} onChange={ch} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" /></div>
            <div><label className="block text-xs font-semibold text-gray-700 mb-1.5">Product Cost ($)</label>
              <input name="cost" type="number" value={form.cost} onChange={ch} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" /></div>
            <div className="col-span-2"><label className="block text-xs font-semibold text-gray-700 mb-1.5">Competitors and Prices</label>
              <input name="competitors" value={form.competitors} onChange={ch} placeholder="Instant Pot $79, Tramontina $119..." className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" /></div>
          </div>
          <button onClick={optimize} disabled={loading} className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold py-3 rounded-xl transition-all text-sm">
            {loading ? <><RefreshCw size={15} className="animate-spin" />Analyzing...</> : <><BrainCircuit size={15} />Optimize Price with AI</>}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <button onClick={() => setResult(null)} className="text-sm text-orange-600 font-medium">← New analysis</button>

          {/* Alerts */}
          {alerts?.map((a, i) => (
            <div key={i} className="flex items-center gap-2 bg-orange-50 border border-orange-200 text-orange-800 rounded-xl px-4 py-2.5 text-sm">
              <AlertTriangle size={14} /> {a}
            </div>
          ))}

          {/* Main recommendation */}
          <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3"><Zap size={16} className="text-orange-400" /><span className="text-orange-400 text-sm font-semibold">Recommended Price</span></div>
            <div className="flex items-end gap-4 mb-3">
              <div><p className="text-xs text-slate-400">Current</p><p className="text-2xl font-bold text-slate-300">${currentPrice?.toFixed(2)}</p></div>
              <span className="text-slate-500 text-xl mb-1">→</span>
              <div><p className="text-xs text-orange-400">Ideal</p><p className="text-3xl font-bold text-white">${idealPrice?.toFixed(2)}</p></div>
            </div>
            <div className="grid grid-cols-3 gap-3 mb-3">
              {[
                { label:"Revenue Impact", value: revenueImpact, color: "text-green-400" },
                { label:"Conversion Impact", value: conversionImpact, color: "text-yellow-400" },
                { label:"Profit Impact", value: profitImpact, color: "text-emerald-400" },
              ].map(({ label, value, color }) => (
                <div key={label} className="bg-slate-700/50 rounded-lg p-2.5 text-center">
                  <p className={`text-sm font-bold ${color}`}>{value}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{label}</p>
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">{strategy}</p>
          </div>

          {/* Scenarios */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100"><h3 className="text-sm font-semibold text-gray-700">Scenario Simulation</h3></div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead><tr className="bg-gray-50">
                  {["Price","Conversion","Units/mo","Revenue/mo","Profit/unit"].map(h => <th key={h} className="px-4 py-2.5 text-left text-gray-500 font-medium">{h}</th>)}
                </tr></thead>
                <tbody className="divide-y divide-gray-50">
                  {scenarios?.map((c, i) => {
                    const price = c.price ?? c.preco;
                    const conversion = c.conversion ?? c.conversao;
                    const units = c.units ?? c.unidades;
                    const revenue = c.revenue ?? c.receita;
                    const unitProfit = c.unitProfit ?? c.lucroUnit;
                    const isIdeal = Math.abs(price - idealPrice) < 1;
                    return (
                      <tr key={i} className={isIdeal ? "bg-orange-50" : "hover:bg-gray-50"}>
                        <td className={`px-4 py-2.5 font-bold ${isIdeal ? "text-orange-600" : "text-gray-800"}`}>
                          ${price.toFixed(2)} {isIdeal && <span className="ml-1 text-xs bg-orange-500 text-white px-1.5 py-0.5 rounded-full">ideal</span>}
                        </td>
                        <td className="px-4 py-2.5 text-gray-700">{conversion}%</td>
                        <td className="px-4 py-2.5 text-gray-700">{units}</td>
                        <td className="px-4 py-2.5 font-medium text-green-600">${revenue.toLocaleString("en-US",{minimumFractionDigits:2})}</td>
                        <td className="px-4 py-2.5 font-medium text-blue-600">${unitProfit.toFixed(2)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Benchmark */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Competitor Benchmark</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {benchmarks?.map((b, i) => (
                <div key={i} className="border border-gray-100 rounded-lg p-3">
                  <p className="text-xs text-gray-500 truncate">{b.name ?? b.nome}</p>
                  <p className="text-base font-bold text-gray-800">${(b.price ?? b.preco).toFixed(2)}</p>
                  <p className="text-xs text-orange-500">{b.position ?? b.posicao}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
