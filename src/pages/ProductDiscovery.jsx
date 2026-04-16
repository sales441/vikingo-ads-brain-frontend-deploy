import React, { useState } from "react";
import { Compass, BrainCircuit, RefreshCw, TrendingUp, Star, DollarSign, BarChart2, CheckCircle, AlertTriangle, Zap } from "lucide-react";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const MOCK = {
  categoria: "Casa e Cozinha",
  oportunidades: [
    { produto:"Organizador de Gaveta Modular", demanda:"alta", competicao:"baixa", margemEstimada:"42%", precoMedio:"R$45-89", tendencia:"crescente", score:92, keywords:["organizador gaveta","divisor gaveta cozinha","organizador talheres"], justificativa:"Volume de busca cresceu 280% nos últimos 6 meses. Apenas 12 vendedores estabelecidos. Margem alta por ser produto leve e compacto." },
    { produto:"Suporte para Plantas de Parede", demanda:"alta", competicao:"média", margemEstimada:"38%", precoMedio:"R$35-75", tendencia:"crescente", score:85, keywords:["suporte planta parede","prateleira vaso","suporte vasos decoração"], justificativa:"Tendência de jardinagem indoor acelerada pós-pandemia. Produto instagramável com alto índice de compra repetida." },
    { produto:"Forma de Silicone para Marmita", demanda:"média", competicao:"baixa", margemEstimada:"55%", precoMedio:"R$28-55", tendencia:"estável", score:79, keywords:["forma silicone marmita","divisória marmita silicone","recipiente silicone"], justificativa:"Nicho de meal prep em crescimento. Poucas opções de qualidade no mercado BR. Custo de produção baixo." },
    { produto:"Toalha de Mesa Impermeável Premium", demanda:"média", competicao:"média", margemEstimada:"35%", precoMedio:"R$65-130", tendencia:"crescente", score:74, keywords:["toalha mesa impermeável","protetor mesa pvc","toalha mesa lavável"], justificativa:"Busca estável com sazonalidade em festas. Diferencial em materiais premium garante margem maior." },
  ],
  tendenciasCrescimento: ["Smart home acessível", "Organização e minimalismo", "Jardinagem indoor", "Meal prep e alimentação saudável", "Home office ergonômico"],
  nichosEvitar: ["Eletrônicos genéricos (alta competição)", "Produtos frágeis sem diferencial", "Categorias dominadas por marcas locais grandes"],
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
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center"><Compass size={20} className="text-teal-600" /></div>
        <div><h1 className="text-xl font-bold text-gray-900">Descobridor de Produtos</h1>
          <p className="text-sm text-gray-500">IA encontra nichos com alta demanda e baixa competição</p></div>
      </div>

      {!result ? (
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm max-w-xl space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Categoria de Interesse</label>
            <select name="category" value={form.category} onChange={ch} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white">
              <option value="">Selecionar...</option>
              {["Casa e Cozinha","Eletrônicos","Beleza","Saúde","Esportes","Pet","Jardim","Escritório","Outros"].map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-xs font-semibold text-gray-700 mb-1.5">Budget disponível (R$)</label>
              <input name="budget" type="number" value={form.budget} onChange={ch} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" /></div>
            <div><label className="block text-xs font-semibold text-gray-700 mb-1.5">Margem mínima desejada (%)</label>
              <input name="targetMargin" type="number" value={form.targetMargin} onChange={ch} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" /></div>
          </div>
          <div><label className="block text-xs font-semibold text-gray-700 mb-1.5">Produtos que você já vende <span className="text-gray-400 font-normal">(opcional)</span></label>
            <input name="currentProducts" value={form.currentProducts} onChange={ch} placeholder="Ex: panelas, eletrodomésticos pequenos"
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" /></div>
          <button onClick={discover} disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold py-3 rounded-xl text-sm">
            {loading ? <><RefreshCw size={15} className="animate-spin" />Descobrindo oportunidades...</> : <><BrainCircuit size={15} />Descobrir com Vikingo Brain™</>}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-gray-800">Oportunidades em {r.categoria}</h2>
            <button onClick={() => setResult(null)} className="text-sm text-orange-600 font-medium">Nova busca</button>
          </div>

          {/* Opportunities */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {r.oportunidades?.map((op, i) => (
              <div key={i} className={`border rounded-xl p-4 ${scoreBg(op.score)}`}>
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-gray-800 text-sm">{op.produto}</h3>
                  <div className="text-center ml-3">
                    <p className={`text-xl font-bold ${scoreColor(op.score)}`}>{op.score}</p>
                    <p className="text-xs text-gray-500">score</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  {[
                    { label:"Demanda", value:op.demanda },
                    { label:"Competição", value:op.competicao },
                    { label:"Margem est.", value:op.margemEstimada },
                    { label:"Preço médio", value:op.precoMedio },
                  ].map(({ label, value }) => (
                    <div key={label} className="bg-white/70 rounded-lg p-2 text-center">
                      <p className="text-xs text-gray-500">{label}</p>
                      <p className="text-sm font-semibold text-gray-800">{value}</p>
                    </div>
                  ))}
                </div>
                <div className={`flex items-center gap-1 text-xs font-medium mb-2 ${op.tendencia === "crescente" ? "text-green-600" : "text-gray-500"}`}>
                  <TrendingUp size={11} /> Tendência {op.tendencia}
                </div>
                <p className="text-xs text-gray-600 mb-2">{op.justificativa}</p>
                <div className="flex flex-wrap gap-1">
                  {op.keywords?.map((k, j) => (
                    <span key={j} className="text-xs bg-white border border-gray-200 text-gray-600 px-2 py-0.5 rounded-full">{k}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Trends + Avoid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-3"><Zap size={15} className="text-orange-500" /><h3 className="text-sm font-semibold text-gray-700">Tendências em Crescimento</h3></div>
              <ul className="space-y-1.5">
                {r.tendenciasCrescimento?.map((t, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-700"><CheckCircle size={13} className="text-green-500" />{t}</li>
                ))}
              </ul>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3"><AlertTriangle size={15} className="text-red-500" /><h3 className="text-sm font-semibold text-red-700">Nichos para Evitar</h3></div>
              <ul className="space-y-1.5">
                {r.nichosEvitar?.map((n, i) => (
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
