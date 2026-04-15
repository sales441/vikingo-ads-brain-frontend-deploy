import React, { useState } from "react";
import {
  FileText, Search, Sparkles, Copy, Check, ChevronRight,
  AlertCircle, TrendingUp, Tag, Users, Globe, Mic,
  Star, Target, Lightbulb, BarChart2, RefreshCw, ArrowLeft,
  BrainCircuit, Package,
} from "lucide-react";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const MARKETPLACE_OPTIONS = [
  { value: "BR", label: "Amazon Brasil (BR)" },
  { value: "US", label: "Amazon EUA (US)" },
  { value: "MX", label: "Amazon México (MX)" },
];

const TONE_OPTIONS = [
  { value: "profissional", label: "Profissional" },
  { value: "persuasivo", label: "Persuasivo" },
  { value: "informativo", label: "Informativo" },
  { value: "premium", label: "Premium / Luxo" },
];

const CATEGORY_OPTIONS = [
  "Casa e Cozinha", "Eletrônicos", "Ferramentas", "Beleza", "Saúde",
  "Esportes", "Brinquedos", "Pet", "Alimentos", "Roupas e Acessórios",
  "Jardim", "Automotivo", "Escritório", "Livros", "Outros",
];

function ScoreRing({ score, size = 72 }) {
  const color = score >= 80 ? "#22c55e" : score >= 60 ? "#f97316" : "#ef4444";
  const r = (size / 2) - 6;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - score / 100);
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e5e7eb" strokeWidth={5} />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke={color} strokeWidth={5}
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 0.8s ease" }}
      />
      <text
        x={size / 2} y={size / 2 + 5}
        textAnchor="middle" fontSize={18} fontWeight="bold"
        fill={color} style={{ transform: "rotate(90deg)", transformOrigin: `${size / 2}px ${size / 2}px` }}
      >
        {score}
      </text>
    </svg>
  );
}

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <button
      onClick={handleCopy}
      className={`flex items-center gap-1 text-xs px-2 py-1 rounded-lg transition-colors ${
        copied ? "bg-green-100 text-green-700" : "bg-gray-100 hover:bg-gray-200 text-gray-600"
      }`}
    >
      {copied ? <Check size={12} /> : <Copy size={12} />}
      {copied ? "Copiado!" : "Copiar"}
    </button>
  );
}

function ResultCard({ title, icon: Icon, children, copyText, accent = "orange" }) {
  const accentMap = {
    orange: "border-orange-200 bg-orange-50",
    blue: "border-blue-200 bg-blue-50",
    green: "border-green-200 bg-green-50",
    purple: "border-purple-200 bg-purple-50",
  };
  return (
    <div className={`border rounded-xl p-4 ${accentMap[accent]}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Icon size={16} className="text-gray-600" />
          <span className="text-sm font-semibold text-gray-700">{title}</span>
        </div>
        {copyText && <CopyButton text={copyText} />}
      </div>
      {children}
    </div>
  );
}

export default function ListingCreator() {
  const [step, setStep] = useState("form"); // form | loading | result
  const [form, setForm] = useState({
    productName: "",
    category: "",
    mainFeatures: "",
    targetAudience: "",
    targetKeywords: "",
    competitors: "",
    marketplace: "BR",
    tone: "profissional",
  });
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.productName.trim() || !form.category) {
      setError("Preencha pelo menos o nome do produto e a categoria.");
      return;
    }
    setError(null);
    setStep("loading");
    try {
      const payload = {
        ...form,
        mainFeatures: form.mainFeatures.split("\n").filter(Boolean),
        targetKeywords: form.targetKeywords.split(",").map(s => s.trim()).filter(Boolean),
        competitors: form.competitors.split(",").map(s => s.trim()).filter(Boolean),
      };
      const res = await fetch(`${BASE_URL}/ai/listing`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setResult(data);
      setStep("result");
    } catch (err) {
      setError("Erro ao gerar listing. Tente novamente.");
      setStep("form");
    }
  };

  const handleReset = () => {
    setStep("form");
    setResult(null);
    setError(null);
  };

  if (step === "loading") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-lg animate-pulse">
          <BrainCircuit size={36} className="text-white" />
        </div>
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-800 mb-2">Vikingo Brain™ trabalhando...</h2>
          <p className="text-sm text-gray-500 max-w-sm">
            Analisando concorrentes, identificando keywords de alto impacto e gerando seu listing otimizado para Amazon.
          </p>
        </div>
        <div className="flex gap-2">
          {["Analisando concorrentes", "Identificando keywords", "Gerando listing", "Calculando score"].map((label, i) => (
            <div key={label} className="flex items-center gap-1 text-xs text-gray-400 bg-gray-100 px-3 py-1.5 rounded-full animate-pulse" style={{ animationDelay: `${i * 0.3}s` }}>
              <RefreshCw size={10} className="animate-spin" />
              {label}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (step === "result" && result) {
    const listing = result.listing || result;
    const competitors = result.competitors || {};
    const tituloScore = listing.tituloScore ?? 0;
    const scoreGeral = listing.scoreGeral ?? 0;
    const bulletPoints = listing.bulletPoints ?? [];
    const dicas = listing.dicas ?? [];
    const backendKeywords = Array.isArray(listing.backendKeywords)
      ? listing.backendKeywords.join(", ")
      : listing.backendKeywords ?? "";
    const keywordsAnalisadas = listing.keywordsAnalisadas ?? [];

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Listing Gerado — {form.productName}</h1>
            <p className="text-sm text-gray-500 mt-0.5">Otimizado para Amazon {form.marketplace} • {form.category}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft size={14} /> Novo Listing
            </button>
          </div>
        </div>

        {/* Score row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col items-center gap-1 shadow-sm">
            <ScoreRing score={scoreGeral} size={64} />
            <span className="text-xs font-medium text-gray-600 mt-1">Score Geral</span>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col items-center gap-1 shadow-sm">
            <ScoreRing score={tituloScore} size={64} />
            <span className="text-xs font-medium text-gray-600 mt-1">Score Título</span>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col items-center justify-center gap-1 shadow-sm">
            <span className="text-2xl font-bold text-blue-600">{keywordsAnalisadas.length}</span>
            <span className="text-xs font-medium text-gray-600">Keywords Analisadas</span>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col items-center justify-center gap-1 shadow-sm">
            <span className="text-lg font-bold text-emerald-600 text-center">{listing.estimativaRanking || "Alta"}</span>
            <span className="text-xs font-medium text-gray-600">Estimativa Ranking</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main listing */}
          <div className="lg:col-span-2 space-y-4">
            {/* Title */}
            <ResultCard title="Título do Produto" icon={FileText} copyText={listing.titulo} accent="orange">
              <p className="text-sm font-medium text-gray-900 leading-relaxed">{listing.titulo}</p>
              <p className="text-xs text-gray-400 mt-2">{listing.titulo?.length ?? 0} caracteres</p>
            </ResultCard>

            {/* Bullet Points */}
            <ResultCard
              title="Bullet Points (5)"
              icon={Star}
              copyText={bulletPoints.join("\n")}
              accent="blue"
            >
              <ol className="space-y-2">
                {bulletPoints.map((bp, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold mt-0.5">{i + 1}</span>
                    <p className="text-xs text-gray-700 leading-relaxed">{bp}</p>
                  </li>
                ))}
              </ol>
            </ResultCard>

            {/* Description */}
            <ResultCard title="Descrição do Produto" icon={FileText} copyText={listing.descricao} accent="green">
              <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-line">{listing.descricao}</p>
            </ResultCard>

            {/* Backend Keywords */}
            <ResultCard title="Palavras-chave Backend" icon={Tag} copyText={backendKeywords} accent="purple">
              <p className="text-xs text-gray-700 leading-relaxed font-mono">{backendKeywords}</p>
              <p className="text-xs text-gray-400 mt-2">{backendKeywords.length} caracteres (limite: 249)</p>
            </ResultCard>

            {/* Keywords analyzed */}
            {keywordsAnalisadas.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <Search size={16} className="text-gray-500" />
                  <span className="text-sm font-semibold text-gray-700">Keywords Priorizadas no Listing</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {keywordsAnalisadas.map((kw, i) => (
                    <span key={i} className="text-xs bg-orange-50 border border-orange-200 text-orange-700 px-2.5 py-1 rounded-full font-medium">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right panel */}
          <div className="space-y-4">
            {/* Tips */}
            {dicas.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <Lightbulb size={16} className="text-yellow-500" />
                  <span className="text-sm font-semibold text-gray-700">Dicas de Otimização</span>
                </div>
                <ul className="space-y-2">
                  {dicas.map((dica, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-gray-600">
                      <ChevronRight size={12} className="text-orange-400 flex-shrink-0 mt-0.5" />
                      {dica}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Competitor insights */}
            {competitors.insightsCompetidores?.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <Users size={16} className="text-blue-500" />
                  <span className="text-sm font-semibold text-gray-700">Análise de Concorrentes</span>
                </div>
                <ul className="space-y-2">
                  {competitors.insightsCompetidores.map((insight, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-gray-600">
                      <AlertCircle size={12} className="text-blue-400 flex-shrink-0 mt-0.5" />
                      {insight}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Keywords gap */}
            {competitors.keywordsGap?.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp size={16} className="text-green-500" />
                  <span className="text-sm font-semibold text-gray-700">Oportunidades de Keywords</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {competitors.keywordsGap.map((kw, i) => (
                    <span key={i} className="text-xs bg-green-50 border border-green-200 text-green-700 px-2 py-0.5 rounded-full">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Diferenciais */}
            {competitors.diferenciais?.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <Target size={16} className="text-purple-500" />
                  <span className="text-sm font-semibold text-gray-700">Diferenciais Sugeridos</span>
                </div>
                <ul className="space-y-1.5">
                  {competitors.diferenciais.map((d, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-gray-600">
                      <Check size={11} className="text-purple-400 flex-shrink-0 mt-0.5" />
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Strategy */}
            {competitors.estrategia && (
              <div className="bg-slate-800 rounded-xl p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <BrainCircuit size={14} className="text-orange-400" />
                  <span className="text-xs font-semibold text-orange-400">Estratégia Recomendada</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{competitors.estrategia}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Form step
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-sm">
          <Package size={24} className="text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Criador de Listing</h1>
          <p className="text-sm text-gray-500">Vikingo Brain™ analisa concorrentes e gera seu listing otimizado para Amazon</p>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
          <AlertCircle size={15} />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-5">
        {/* Product name */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
            Nome do Produto <span className="text-red-400">*</span>
          </label>
          <input
            name="productName"
            value={form.productName}
            onChange={handleChange}
            placeholder="Ex: Panela de Pressão Elétrica 6L Inox"
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
          />
        </div>

        {/* Category + Marketplace */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Categoria <span className="text-red-400">*</span>
            </label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
            >
              <option value="">Selecionar...</option>
              {CATEGORY_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Marketplace</label>
            <select
              name="marketplace"
              value={form.marketplace}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
            >
              {MARKETPLACE_OPTIONS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
            </select>
          </div>
        </div>

        {/* Main features */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
            Principais Características
            <span className="ml-1 text-gray-400 font-normal">(uma por linha)</span>
          </label>
          <textarea
            name="mainFeatures"
            value={form.mainFeatures}
            onChange={handleChange}
            rows={4}
            placeholder={"Capacidade 6 litros\nMaterial inox 304\nFechamento automático com trava\nTimer digital 24h\nGarantia 2 anos"}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
          />
        </div>

        {/* Target audience + Tone */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              <Users size={12} className="inline mr-1" />
              Público-Alvo
            </label>
            <input
              name="targetAudience"
              value={form.targetAudience}
              onChange={handleChange}
              placeholder="Ex: Donas de casa, cozinheiros"
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              <Mic size={12} className="inline mr-1" />
              Tom do Texto
            </label>
            <select
              name="tone"
              value={form.tone}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
            >
              {TONE_OPTIONS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
        </div>

        {/* Target keywords */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
            <Search size={12} className="inline mr-1" />
            Keywords-Alvo
            <span className="ml-1 text-gray-400 font-normal">(separadas por vírgula)</span>
          </label>
          <input
            name="targetKeywords"
            value={form.targetKeywords}
            onChange={handleChange}
            placeholder="panela pressão elétrica, panela inox, panela rápida"
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>

        {/* Competitors */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
            <BarChart2 size={12} className="inline mr-1" />
            Concorrentes Principais
            <span className="ml-1 text-gray-400 font-normal">(nomes separados por vírgula)</span>
          </label>
          <input
            name="competitors"
            value={form.competitors}
            onChange={handleChange}
            placeholder="Mondial, Tramontina, Oster"
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3 rounded-xl transition-all shadow-sm text-sm"
        >
          <Sparkles size={16} />
          Gerar Listing com Vikingo Brain™
          <ChevronRight size={16} />
        </button>

        <p className="text-center text-xs text-gray-400">
          O processo leva cerca de 15–30 segundos. O resultado inclui título, bullet points, descrição e keywords backend otimizados para SEO Amazon.
        </p>
      </form>
    </div>
  );
}
