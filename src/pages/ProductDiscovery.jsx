import React, { useState } from "react";
import { Compass, BrainCircuit, RefreshCw, TrendingUp, Star, DollarSign, BarChart2, CheckCircle, AlertTriangle, Zap } from "lucide-react";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const MOCK = {
  category: "Home & Kitchen",
  opportunities: [
    { product:"Modular Drawer Organizer", demand:"high", competition:"low", estimatedMargin:"42%", avgPrice:"$15-29", trend:"rising", score:92, keywords:["drawer organizer","kitchen drawer divider","utensil organizer"], rationale:"Search volume grew 280% over the last 6 months. Only 12 established sellers. High margin thanks to lightweight, compact size." },
    { product:"Wall-mounted Plant Holder", demand:"high", competition:"medium", estimatedMargin:"38%", avgPrice:"$12-25", trend:"rising", score:85, keywords:["wall plant holder","plant shelf","decorative plant stand"], rationale:"Indoor gardening trend accelerated post-pandemic. Instagrammable product with high repeat-purchase rate." },
    { product:"Silicone Meal Prep Containers", demand:"medium", competition:"low", estimatedMargin:"55%", avgPrice:"$9-18", trend:"stable", score:79, keywords:["silicone meal prep","silicone food containers","meal prep divider"], rationale:"Meal-prep niche on the rise. Few high-quality options available. Low production cost." },
    { product:"Premium Waterproof Table Cover", demand:"medium", competition:"medium", estimatedMargin:"35%", avgPrice:"$19-39", trend:"rising", score:74, keywords:["waterproof table cover","vinyl table protector","washable tablecloth"], rationale:"Steady search with seasonal peaks. Premium materials keep margins healthy." },
  ],
  growingTrends: ["Affordable smart home", "Organization & minimalism", "Indoor gardening", "Meal prep & healthy eating", "Ergonomic home office"],
  nichesToAvoid: ["Generic electronics (high competition)", "Fragile products with no differentiator", "Categories dominated by large local brands"],
};

const scoreColor = s => s >= 85 ? "text-green-600" : s >= 70 ? "text-orange-500" : "text-red-500";
const scoreBg = s => s >= 85 ? "bg-green-50 border-green-200" : s >= 70 ? "bg-orange-50 border-orange-200" : "bg-red-50 border-red-200";

export default function ProductDiscovery() {
  const [form, setForm] = useState({ category:"", budget:"5000", targetMargin:"30", currentProducts:"" });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const ch = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const discover = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/ai/discover`, {
        method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify(form),
      });
      const data = await res.json();
      setResult(data.result || MOCK);
    } catch { setResult(MOCK); }
    finally { setLoading(false); }
  };

  const r = result;
  const category = r?.category ?? r?.categoria;
  const opportunities = r?.opportunities ?? r?.oportunidades;
  const growingTrends = r?.growingTrends ?? r?.tendenciasCrescimento;
  const nichesToAvoid = r?.nichesToAvoid ?? r?.nichosEvitar;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center"><Compass size={20} className="text-teal-600" /></div>
        <div><h1 className="text-xl font-bold text-gray-900">Product Discovery</h1>
          <p className="text-sm text-gray-500">AI finds niches with high demand and low competition</p></div>
      </div>

      {!result ? (
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm max-w-xl space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Category of Interest</label>
            <select name="category" value={form.category} onChange={ch} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white">
              <option value="">Select...</option>
              {["Home & Kitchen","Electronics","Beauty","Health","Sports","Pet","Garden","Office","Other"].map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-xs font-semibold text-gray-700 mb-1.5">Available budget ($)</label>
              <input name="budget" type="number" value={form.budget} onChange={ch} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" /></div>
            <div><label className="block text-xs font-semibold text-gray-700 mb-1.5">Minimum target margin (%)</label>
              <input name="targetMargin" type="number" value={form.targetMargin} onChange={ch} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" /></div>
          </div>
          <div><label className="block text-xs font-semibold text-gray-700 mb-1.5">Products you already sell <span className="text-gray-400 font-normal">(optional)</span></label>
            <input name="currentProducts" value={form.currentProducts} onChange={ch} placeholder="e.g. cookware, small appliances"
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" /></div>
          <button onClick={discover} disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold py-3 rounded-xl text-sm">
            {loading ? <><RefreshCw size={15} className="animate-spin" />Discovering opportunities...</> : <><BrainCircuit size={15} />Discover with Vikingo Brain™</>}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-gray-800">Opportunities in {category}</h2>
            <button onClick={() => setResult(null)} className="text-sm text-orange-600 font-medium">New search</button>
          </div>

          {/* Opportunities */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {opportunities?.map((op, i) => {
              const product = op.product ?? op.produto;
              const demand = op.demand ?? op.demanda;
              const competition = op.competition ?? op.competicao;
              const estimatedMargin = op.estimatedMargin ?? op.margemEstimada;
              const avgPrice = op.avgPrice ?? op.precoMedio;
              const trend = op.trend ?? op.tendencia;
              const rationale = op.rationale ?? op.justificativa;
              return (
                <div key={i} className={`border rounded-xl p-4 ${scoreBg(op.score)}`}>
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold text-gray-800 text-sm">{product}</h3>
                    <div className="text-center ml-3">
                      <p className={`text-xl font-bold ${scoreColor(op.score)}`}>{op.score}</p>
                      <p className="text-xs text-gray-500">score</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    {[
                      { label:"Demand", value:demand },
                      { label:"Competition", value:competition },
                      { label:"Est. margin", value:estimatedMargin },
                      { label:"Avg. price", value:avgPrice },
                    ].map(({ label, value }) => (
                      <div key={label} className="bg-white/70 rounded-lg p-2 text-center">
                        <p className="text-xs text-gray-500">{label}</p>
                        <p className="text-sm font-semibold text-gray-800">{value}</p>
                      </div>
                    ))}
                  </div>
                  <div className={`flex items-center gap-1 text-xs font-medium mb-2 ${trend === "rising" || trend === "crescente" ? "text-green-600" : "text-gray-500"}`}>
                    <TrendingUp size={11} /> Trend: {trend}
                  </div>
                  <p className="text-xs text-gray-600 mb-2">{rationale}</p>
                  <div className="flex flex-wrap gap-1">
                    {op.keywords?.map((k, j) => (
                      <span key={j} className="text-xs bg-white border border-gray-200 text-gray-600 px-2 py-0.5 rounded-full">{k}</span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Trends + Avoid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-3"><Zap size={15} className="text-orange-500" /><h3 className="text-sm font-semibold text-gray-700">Growing Trends</h3></div>
              <ul className="space-y-1.5">
                {growingTrends?.map((t, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-700"><CheckCircle size={13} className="text-green-500" />{t}</li>
                ))}
              </ul>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3"><AlertTriangle size={15} className="text-red-500" /><h3 className="text-sm font-semibold text-red-700">Niches to Avoid</h3></div>
              <ul className="space-y-1.5">
                {nichesToAvoid?.map((n, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-red-800"><span className="text-red-400 font-bold flex-shrink-0">✗</span>{n}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
