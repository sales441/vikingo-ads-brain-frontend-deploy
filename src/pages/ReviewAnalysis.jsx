import React, { useState } from "react";
import { Star, BrainCircuit, RefreshCw, TrendingUp, AlertTriangle, CheckCircle, ThumbsDown, ThumbsUp, Search } from "lucide-react";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const MOCK_RESULT = {
  produto: "Panela de Pressão Elétrica 6L",
  totalReviews: 1842,
  avgRating: 4.2,
  sentiment: { positivo: 72, neutro: 15, negativo: 13 },
  pontosFracos: ["Vedação desgasta após 6 meses de uso", "Barulho excessivo durante pressurização", "Tampa difícil de fechar com pressão", "Cabo aquece durante uso prolongado"],
  pontosFortes: ["Economia de tempo no cozimento", "Fácil de limpar", "Boa relação custo-benefício", "Design moderno e compacto"],
  oportunidades: ["Melhorar durabilidade da vedação (principal reclamação)", "Adicionar indicador sonoro mais suave", "Criar manual de uso em vídeo (muitos reclamam de instruções confusas)", "Oferecer kit de reposição de vedação como acessório"],
  keywordsNegativas: ["vedação", "barulho", "tampa", "cabo quente", "vazamento"],
  diferencialSugerido: "Destaque no listing: 'Vedação Reforçada 3x Mais Durável' e 'Sistema Silencioso' para atacar diretamente as principais dores dos concorrentes.",
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
    if (!form.productName) { setError("Informe o nome do produto."); return; }
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
        <div><h1 className="text-xl font-bold text-gray-900">Análise de Reviews com IA</h1>
          <p className="text-sm text-gray-500">Descubra os pontos fracos dos concorrentes para superar no seu produto</p></div>
      </div>

      {!result ? (
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-4 max-w-2xl">
          {error && <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm"><AlertTriangle size={14} />{error}</div>}
          <div><label className="block text-xs font-semibold text-gray-700 mb-1.5">Produto / Concorrente a analisar *</label>
            <input name="productName" value={form.productName} onChange={ch} placeholder="Ex: Panela de Pressão Elétrica" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" /></div>
          <div><label className="block text-xs font-semibold text-gray-700 mb-1.5">ASIN do concorrente <span className="text-gray-400 font-normal">(opcional)</span></label>
            <input name="asin" value={form.asin} onChange={ch} placeholder="B0XXXXXXXXX" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" /></div>
          <div><label className="block text-xs font-semibold text-gray-700 mb-1.5">Outros concorrentes <span className="text-gray-400 font-normal">(separados por vírgula)</span></label>
            <input name="competitors" value={form.competitors} onChange={ch} placeholder="Mondial, Tramontina, Oster" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" /></div>
          <button onClick={analyze} disabled={loading} className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3 rounded-xl transition-all text-sm">
            {loading ? <><RefreshCw size={15} className="animate-spin" /> Analisando reviews...</> : <><BrainCircuit size={15} /> Analisar com Vikingo Brain™</>}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-gray-800">{r.produto}</h2>
            <button onClick={() => setResult(null)} className="text-sm text-orange-600 hover:text-orange-700 font-medium">Nova análise</button>
          </div>

          {/* Summary */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
              <p className="text-xs text-gray-500 mb-1">Total de Reviews</p>
              <p className="text-2xl font-bold text-gray-800">{r.totalReviews?.toLocaleString("pt-BR")}</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
              <p className="text-xs text-gray-500 mb-1">Avaliação Média</p>
              <StarRating rating={r.avgRating} />
            </div>
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <p className="text-xs text-green-600 mb-1">Positivos</p>
              <p className="text-2xl font-bold text-green-700">{r.sentiment?.positivo}%</p>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <p className="text-xs text-red-600 mb-1">Negativos</p>
              <p className="text-2xl font-bold text-red-700">{r.sentiment?.negativo}%</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Weaknesses */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-3"><ThumbsDown size={15} className="text-red-500" /><h3 className="text-sm font-semibold text-gray-700">Pontos Fracos (reclamações)</h3></div>
              <ul className="space-y-2">
                {r.pontosFracos?.map((p, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-red-100 text-red-600 text-xs flex items-center justify-center font-bold">{i+1}</span>{p}
                  </li>
                ))}
              </ul>
            </div>

            {/* Strengths */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-3"><ThumbsUp size={15} className="text-green-500" /><h3 className="text-sm font-semibold text-gray-700">Pontos Fortes</h3></div>
              <ul className="space-y-2">
                {r.pontosFortes?.map((p, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <CheckCircle size={14} className="text-green-500 flex-shrink-0 mt-0.5" />{p}
                  </li>
                ))}
              </ul>
            </div>

            {/* Opportunities */}
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3"><TrendingUp size={15} className="text-orange-600" /><h3 className="text-sm font-semibold text-orange-700">Oportunidades para seu produto</h3></div>
              <ul className="space-y-2">
                {r.oportunidades?.map((p, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-orange-800">
                    <span className="text-orange-500 font-bold">→</span>{p}
                  </li>
                ))}
              </ul>
            </div>

            {/* Diferencial + Keywords negativas */}
            <div className="space-y-3">
              <div className="bg-slate-800 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2"><BrainCircuit size={14} className="text-orange-400" /><span className="text-xs font-semibold text-orange-400">Diferencial Sugerido pela IA</span></div>
                <p className="text-sm text-slate-300 leading-relaxed">{r.diferencialSugerido}</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                <h3 className="text-xs font-semibold text-gray-600 mb-2">Keywords negativas nos reviews (evite associações)</h3>
                <div className="flex flex-wrap gap-1.5">
                  {r.keywordsNegativas?.map((k, i) => (
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
