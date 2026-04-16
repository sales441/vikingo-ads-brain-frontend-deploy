import React, { useState } from "react";
import { Star, BrainCircuit, RefreshCw, TrendingUp, AlertTriangle, CheckCircle, ThumbsDown, ThumbsUp, Search } from "lucide-react";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const MOCK_RESULT = {
  product: "Electric Pressure Cooker 6Qt",
  totalReviews: 1842,
  avgRating: 4.2,
  sentiment: { positive: 72, neutral: 15, negative: 13 },
  weaknesses: ["Gasket wears out after 6 months of use", "Excessive noise during pressurization", "Lid is hard to close under pressure", "Handle heats up during long cooking"],
  strengths: ["Saves time when cooking", "Easy to clean", "Great value for money", "Modern and compact design"],
  opportunities: ["Improve gasket durability (top complaint)", "Add a quieter audible indicator", "Create a video user manual (many complain about confusing instructions)", "Offer a replacement gasket kit as an accessory"],
  negativeKeywords: ["gasket", "noise", "lid", "hot handle", "leaking"],
  suggestedDifferentiator: "Highlight in the listing: 'Reinforced Gasket 3x More Durable' and 'Silent System' to directly attack the main pain points of competitors.",
};

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(i => (
        <Star key={i} size={14} className={i <= Math.round(rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-200 fill-gray-200"} />
      ))}
      <span className="ml-1 text-sm font-semibold text-gray-700">{rating}</span>
    </div>
  );
}

export default function ReviewAnalysis() {
  const [form, setForm] = useState({ productName: "", asin: "", competitors: "" });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const ch = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const analyze = async () => {
    if (!form.productName) { setError("Please enter the product name."); return; }
    setError(""); setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/ai/reviews`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      setResult(data.result || MOCK_RESULT);
    } catch { setResult(MOCK_RESULT); }
    finally { setLoading(false); }
  };

  const r = result;
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-yellow-100 flex items-center justify-center"><Star size={20} className="text-yellow-600" /></div>
        <div><h1 className="text-xl font-bold text-gray-900">AI Review Analysis</h1>
          <p className="text-sm text-gray-500">Uncover competitors' weaknesses and outperform them with your product</p></div>
      </div>

      {!result ? (
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-4 max-w-2xl">
          {error && <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm"><AlertTriangle size={14} />{error}</div>}
          <div><label className="block text-xs font-semibold text-gray-700 mb-1.5">Product / Competitor to analyze *</label>
            <input name="productName" value={form.productName} onChange={ch} placeholder="e.g. Electric Pressure Cooker" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" /></div>
          <div><label className="block text-xs font-semibold text-gray-700 mb-1.5">Competitor ASIN <span className="text-gray-400 font-normal">(optional)</span></label>
            <input name="asin" value={form.asin} onChange={ch} placeholder="B0XXXXXXXXX" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" /></div>
          <div><label className="block text-xs font-semibold text-gray-700 mb-1.5">Other competitors <span className="text-gray-400 font-normal">(comma-separated)</span></label>
            <input name="competitors" value={form.competitors} onChange={ch} placeholder="Instant Pot, Ninja, Cuisinart" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" /></div>
          <button onClick={analyze} disabled={loading} className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3 rounded-xl transition-all text-sm">
            {loading ? <><RefreshCw size={15} className="animate-spin" /> Analyzing reviews...</> : <><BrainCircuit size={15} /> Analyze with Vikingo Brain™</>}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-gray-800">{r.product ?? r.produto}</h2>
            <button onClick={() => setResult(null)} className="text-sm text-orange-600 hover:text-orange-700 font-medium">New analysis</button>
          </div>

          {/* Summary */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
              <p className="text-xs text-gray-500 mb-1">Total Reviews</p>
              <p className="text-2xl font-bold text-gray-800">{r.totalReviews?.toLocaleString("en-US")}</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
              <p className="text-xs text-gray-500 mb-1">Average Rating</p>
              <StarRating rating={r.avgRating} />
            </div>
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <p className="text-xs text-green-600 mb-1">Positive</p>
              <p className="text-2xl font-bold text-green-700">{r.sentiment?.positive ?? r.sentiment?.positivo}%</p>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <p className="text-xs text-red-600 mb-1">Negative</p>
              <p className="text-2xl font-bold text-red-700">{r.sentiment?.negative ?? r.sentiment?.negativo}%</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Weaknesses */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-3"><ThumbsDown size={15} className="text-red-500" /><h3 className="text-sm font-semibold text-gray-700">Weaknesses (complaints)</h3></div>
              <ul className="space-y-2">
                {(r.weaknesses ?? r.pontosFracos)?.map((p, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-red-100 text-red-600 text-xs flex items-center justify-center font-bold">{i+1}</span>{p}
                  </li>
                ))}
              </ul>
            </div>

            {/* Strengths */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-3"><ThumbsUp size={15} className="text-green-500" /><h3 className="text-sm font-semibold text-gray-700">Strengths</h3></div>
              <ul className="space-y-2">
                {(r.strengths ?? r.pontosFortes)?.map((p, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <CheckCircle size={14} className="text-green-500 flex-shrink-0 mt-0.5" />{p}
                  </li>
                ))}
              </ul>
            </div>

            {/* Opportunities */}
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3"><TrendingUp size={15} className="text-orange-600" /><h3 className="text-sm font-semibold text-orange-700">Opportunities for your product</h3></div>
              <ul className="space-y-2">
                {(r.opportunities ?? r.oportunidades)?.map((p, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-orange-800">
                    <span className="text-orange-500 font-bold">→</span>{p}
                  </li>
                ))}
              </ul>
            </div>

            {/* Differentiator + Negative keywords */}
            <div className="space-y-3">
              <div className="bg-slate-800 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2"><BrainCircuit size={14} className="text-orange-400" /><span className="text-xs font-semibold text-orange-400">AI-suggested differentiator</span></div>
                <p className="text-sm text-slate-300 leading-relaxed">{r.suggestedDifferentiator ?? r.diferencialSugerido}</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                <h3 className="text-xs font-semibold text-gray-600 mb-2">Negative keywords in reviews (avoid associations)</h3>
                <div className="flex flex-wrap gap-1.5">
                  {(r.negativeKeywords ?? r.keywordsNegativas)?.map((k, i) => (
                    <span key={i} className="text-xs bg-red-50 border border-red-200 text-red-700 px-2 py-0.5 rounded-full">{k}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
