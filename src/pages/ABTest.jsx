import React, { useState } from "react";
import { FlaskConical, BrainCircuit, RefreshCw, TrendingUp, CheckCircle, Copy, Check } from "lucide-react";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const MOCK = {
  varianteA: {
    titulo: "Panela de Pressão Elétrica 6L — Inox 304 com Tampa de Vidro, Timer Digital e Trava de Segurança Automática",
    score: 72,
    forcas: ["Especifica material (Inox 304)","Menciona segurança","Tem diferenciais técnicos"],
    fraquezas: ["Muito longa (182 chars)","Keyword principal no final","Falta benefício emocional"],
  },
  varianteB: {
    titulo: "Panela de Pressão Elétrica 6 Litros Inox — Cozinhe 70% Mais Rápido com Segurança Total e Timer Digital 24h",
    score: 89,
    forcas: ["Benefício claro (70% mais rápido)","Keyword principal no início","Cria urgência emocional","Tamanho ideal (155 chars)"],
    fraquezas: ["Poderia especificar o material (304)"],
  },
  vencedor: "B",
  confianca: 94,
  impactoEstimado: "+23% CTR",
  explicacao: "A variante B vence por colocar a keyword principal no início e transformar uma especificação técnica (70% mais rápido) em benefício tangível. O cérebro do comprador processa 'Cozinhe 70% mais rápido' muito mais rapidamente do que lista de atributos.",
  recomendacoes: ["Use a Variante B como título principal", "Teste em 2 semanas: meça CTR e conversão", "Adicione o material Inox 304 nos bullet points"],
};

function CopyBtn({ text }) {
  const [copied, setCopied] = useState(false);
  return (
    <button onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(()=>setCopied(false),2000); }}
      className={`flex items-center gap-1 text-xs px-2 py-1 rounded-lg ${copied ? "bg-green-100 text-green-700" : "bg-gray-100 hover:bg-gray-200 text-gray-600"}`}>
      {copied ? <Check size={11} /> : <Copy size={11} />} {copied ? "Copiado!" : "Copiar"}
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
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center"><FlaskConical size={20} className="text-indigo-600" /></div>
        <div><h1 className="text-xl font-bold text-gray-900">A/B Test de Listing</h1>
          <p className="text-sm text-gray-500">Compare variantes de título e descubra qual converte mais</p></div>
      </div>

      {!result ? (
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-4 max-w-2xl">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Título — Variante A (atual)</label>
            <textarea name="titleA" value={form.titleA} onChange={ch} rows={3} placeholder="Cole seu título atual aqui..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none" />
            <p className="text-xs text-gray-400 mt-0.5">{form.titleA.length} caracteres</p>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Título — Variante B (nova versão)</label>
            <textarea name="titleB" value={form.titleB} onChange={ch} rows={3} placeholder="Cole a versão alternativa para comparar..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none" />
            <p className="text-xs text-gray-400 mt-0.5">{form.titleB.length} caracteres</p>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Contexto do Produto <span className="text-gray-400 font-normal">(opcional)</span></label>
            <input name="productContext" value={form.productContext} onChange={ch} placeholder="Ex: panela pressão elétrica 6L, público: donas de casa"
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-xs text-blue-700">
            💡 Dica: não tem variante B? Clique em "Gerar com IA" e a IA cria uma versão otimizada do seu título A.
          </div>
          <button onClick={test} disabled={loading || !form.titleA || !form.titleB}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold py-3 rounded-xl transition-all text-sm disabled:from-gray-300 disabled:to-gray-300">
            {loading ? <><RefreshCw size={15} className="animate-spin" />Analisando...</> : <><BrainCircuit size={15} />Analisar com IA</>}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <button onClick={() => setResult(null)} className="text-sm text-orange-600 font-medium">← Novo teste</button>

          {/* Winner banner */}
          <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-2"><CheckCircle size={18} className="text-green-400" />
              <span className="text-white font-bold">Variante {r.vencedor} vence com {r.confianca}% de confiança!</span>
            </div>
            <p className="text-sm text-slate-300 mb-2">{r.explicacao}</p>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-green-900/40 border border-green-700/40 text-green-300 px-3 py-1 rounded-full font-medium">
                <TrendingUp size={10} className="inline mr-1" />Impacto estimado: {r.impactoEstimado}
              </span>
            </div>
          </div>

          {/* Side by side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {[["A", r.varianteA], ["B", r.varianteB]].map(([v, variant]) => {
              const isWinner = r.vencedor === v;
              return (
                <div key={v} className={`bg-white border-2 rounded-xl p-4 shadow-sm ${isWinner ? "border-green-400" : "border-gray-200"}`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold ${isWinner ? "bg-green-500 text-white" : "bg-gray-200 text-gray-600"}`}>{v}</span>
                      {isWinner && <span className="text-xs text-green-600 font-semibold">Vencedor</span>}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-bold ${variant.score >= 80 ? "text-green-600" : variant.score >= 60 ? "text-orange-500" : "text-red-500"}`}>Score {variant.score}/100</span>
                      <CopyBtn text={variant.titulo} />
                    </div>
                  </div>
                  <p className="text-sm text-gray-800 leading-relaxed mb-3 bg-gray-50 rounded-lg p-3">{variant.titulo}</p>
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs font-semibold text-green-600 mb-1">Pontos fortes</p>
                      {variant.forcas?.map((f, i) => <p key={i} className="text-xs text-gray-600 flex items-start gap-1"><CheckCircle size={10} className="text-green-500 flex-shrink-0 mt-0.5" />{f}</p>)}
                    </div>
                    {variant.fraquezas?.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-red-500 mb-1">Pontos fracos</p>
                        {variant.fraquezas?.map((f, i) => <p key={i} className="text-xs text-gray-600 flex items-start gap-1"><span className="text-red-400">✗</span>{f}</p>)}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Recommendations */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Próximos passos recomendados</h3>
            <ul className="space-y-1.5">
              {r.recomendacoes?.map((rec, i) => (
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
