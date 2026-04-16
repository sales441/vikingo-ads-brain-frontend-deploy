import React, { useState } from "react";
import { FlaskConical, BrainCircuit, RefreshCw, TrendingUp, CheckCircle, Copy, Check } from "lucide-react";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const MOCK = {
  variantA: {
    title: "6Qt Electric Pressure Cooker — 304 Stainless Steel with Glass Lid, Digital Timer and Automatic Safety Lock",
    score: 72,
    strengths: ["Specifies material (304 Stainless)","Mentions safety","Has technical differentiators"],
    weaknesses: ["Too long (182 chars)","Main keyword at the end","Lacks emotional benefit"],
  },
  variantB: {
    title: "6 Quart Electric Pressure Cooker Stainless Steel — Cook 70% Faster with Full Safety and 24h Digital Timer",
    score: 89,
    strengths: ["Clear benefit (70% faster)","Main keyword up front","Creates emotional urgency","Ideal length (155 chars)"],
    weaknesses: ["Could specify material (304)"],
  },
  winner: "B",
  confidence: 94,
  estimatedImpact: "+23% CTR",
  explanation: "Variant B wins because it places the main keyword up front and transforms a technical spec (70% faster) into a tangible benefit. Shoppers' brains process 'Cook 70% faster' much faster than a list of attributes.",
  recommendations: ["Use Variant B as your main title", "Test for 2 weeks: measure CTR and conversion", "Add 304 Stainless material in the bullet points"],
};

function CopyBtn({ text }) {
  const [copied, setCopied] = useState(false);
  return (
    <button onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(()=>setCopied(false),2000); }}
      className={`flex items-center gap-1 text-xs px-2 py-1 rounded-lg ${copied ? "bg-green-100 text-green-700" : "bg-gray-100 hover:bg-gray-200 text-gray-600"}`}>
      {copied ? <Check size={11} /> : <Copy size={11} />} {copied ? "Copied!" : "Copy"}
    </button>
  );
}

export default function ABTest() {
  const [form, setForm] = useState({ titleA:"", titleB:"", productContext:"" });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const ch = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const test = async () => {
    if (!form.titleA || !form.titleB) return;
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/ai/abtest`, {
        method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify(form),
      });
      const data = await res.json();
      setResult(data.result || MOCK);
    } catch { setResult(MOCK); }
    finally { setLoading(false); }
  };

  const r = result;
  const winner = r?.winner ?? r?.vencedor;
  const confidence = r?.confidence ?? r?.confianca;
  const estimatedImpact = r?.estimatedImpact ?? r?.impactoEstimado;
  const explanation = r?.explanation ?? r?.explicacao;
  const variantA = r?.variantA ?? r?.varianteA;
  const variantB = r?.variantB ?? r?.varianteB;
  const recommendations = r?.recommendations ?? r?.recomendacoes;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center"><FlaskConical size={20} className="text-indigo-600" /></div>
        <div><h1 className="text-xl font-bold text-gray-900">Listing A/B Test</h1>
          <p className="text-sm text-gray-500">Compare title variants and find which one converts better</p></div>
      </div>

      {!result ? (
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-4 max-w-2xl">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Title — Variant A (current)</label>
            <textarea name="titleA" value={form.titleA} onChange={ch} rows={3} placeholder="Paste your current title here..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none" />
            <p className="text-xs text-gray-400 mt-0.5">{form.titleA.length} characters</p>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Title — Variant B (new version)</label>
            <textarea name="titleB" value={form.titleB} onChange={ch} rows={3} placeholder="Paste the alternative version to compare..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none" />
            <p className="text-xs text-gray-400 mt-0.5">{form.titleB.length} characters</p>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Product Context <span className="text-gray-400 font-normal">(optional)</span></label>
            <input name="productContext" value={form.productContext} onChange={ch} placeholder="e.g. 6Qt electric pressure cooker, target: home cooks"
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-xs text-blue-700">
            💡 Tip: no Variant B yet? Click "Generate with AI" and the AI will create an optimized version of your Title A.
          </div>
          <button onClick={test} disabled={loading || !form.titleA || !form.titleB}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold py-3 rounded-xl transition-all text-sm disabled:from-gray-300 disabled:to-gray-300">
            {loading ? <><RefreshCw size={15} className="animate-spin" />Analyzing...</> : <><BrainCircuit size={15} />Analyze with AI</>}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <button onClick={() => setResult(null)} className="text-sm text-orange-600 font-medium">← New test</button>

          {/* Winner banner */}
          <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-2"><CheckCircle size={18} className="text-green-400" />
              <span className="text-white font-bold">Variant {winner} wins with {confidence}% confidence!</span>
            </div>
            <p className="text-sm text-slate-300 mb-2">{explanation}</p>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-green-900/40 border border-green-700/40 text-green-300 px-3 py-1 rounded-full font-medium">
                <TrendingUp size={10} className="inline mr-1" />Estimated impact: {estimatedImpact}
              </span>
            </div>
          </div>

          {/* Side by side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {[["A", variantA], ["B", variantB]].map(([v, variant]) => {
              const isWinner = winner === v;
              const title = variant?.title ?? variant?.titulo;
              const strengths = variant?.strengths ?? variant?.forcas;
              const weaknesses = variant?.weaknesses ?? variant?.fraquezas;
              return (
                <div key={v} className={`bg-white border-2 rounded-xl p-4 shadow-sm ${isWinner ? "border-green-400" : "border-gray-200"}`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold ${isWinner ? "bg-green-500 text-white" : "bg-gray-200 text-gray-600"}`}>{v}</span>
                      {isWinner && <span className="text-xs text-green-600 font-semibold">Winner</span>}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-bold ${variant.score >= 80 ? "text-green-600" : variant.score >= 60 ? "text-orange-500" : "text-red-500"}`}>Score {variant.score}/100</span>
                      <CopyBtn text={title} />
                    </div>
                  </div>
                  <p className="text-sm text-gray-800 leading-relaxed mb-3 bg-gray-50 rounded-lg p-3">{title}</p>
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs font-semibold text-green-600 mb-1">Strengths</p>
                      {strengths?.map((f, i) => <p key={i} className="text-xs text-gray-600 flex items-start gap-1"><CheckCircle size={10} className="text-green-500 flex-shrink-0 mt-0.5" />{f}</p>)}
                    </div>
                    {weaknesses?.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-red-500 mb-1">Weaknesses</p>
                        {weaknesses?.map((f, i) => <p key={i} className="text-xs text-gray-600 flex items-start gap-1"><span className="text-red-400">✗</span>{f}</p>)}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Recommendations */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Recommended next steps</h3>
            <ul className="space-y-1.5">
              {recommendations?.map((rec, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="text-orange-500 font-bold flex-shrink-0">{i+1}.</span>{rec}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
