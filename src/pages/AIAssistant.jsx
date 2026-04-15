import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Zap, RefreshCw, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react";
import api from "../services/api";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

async function fetchAnalysis() {
  try {
    const r = await fetch(`${BASE_URL}/ai/analyze`);
    const d = await r.json();
    return d.analysis;
  } catch { return null; }
}

async function sendChat(message, history) {
  try {
    const r = await fetch(`${BASE_URL}/ai/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, history }),
    });
    const d = await r.json();
    return d.reply;
  } catch {
    return "Erro ao conectar com o Vikingo Brain. Tente novamente.";
  }
}

const SUGGESTIONS = [
  "Quais campanhas devo pausar agora?",
  "Como reduzir meu ACoS médio?",
  "Qual keyword tem melhor ROAS?",
  "Preciso aumentar meu budget?",
  "Como conquistar mais share of voice?",
];

const priorityColor = {
  alta: "bg-red-100 text-red-700 border-red-200",
  media: "bg-orange-100 text-orange-700 border-orange-200",
  baixa: "bg-blue-100 text-blue-700 border-blue-200",
};

const statusColor = {
  otimo: "text-green-600 bg-green-50 border-green-200",
  bom: "text-blue-600 bg-blue-50 border-blue-200",
  atencao: "text-orange-600 bg-orange-50 border-orange-200",
  critico: "text-red-600 bg-red-50 border-red-200",
};

export default function AIAssistant() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Olá! Sou o **Vikingo Brain™**, sua IA especialista em Amazon Ads. Analisei suas campanhas e estou pronto para ajudar. O que você quer otimizar hoje?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [loadingAnalysis, setLoadingAnalysis] = useState(true);
  const bottomRef = useRef(null);

  useEffect(() => {
    setLoadingAnalysis(true);
    fetchAnalysis().then(a => {
      setAnalysis(a);
      setLoadingAnalysis(false);
    });
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async (text) => {
    const msg = text || input.trim();
    if (!msg) return;
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: msg }]);
    setLoading(true);
    const history = messages.slice(-6).map(m => ({ role: m.role, content: m.content }));
    const reply = await sendChat(msg, history);
    setMessages(prev => [...prev, { role: "assistant", content: reply }]);
    setLoading(false);
  };

  const refreshAnalysis = () => {
    setLoadingAnalysis(true);
    fetchAnalysis().then(a => { setAnalysis(a); setLoadingAnalysis(false); });
  };

  const renderMessage = (content) => {
    return content.split("**").map((part, i) =>
      i % 2 === 1 ? <strong key={i}>{part}</strong> : part
    );
  };

  const scoreColor = analysis?.score >= 80 ? "text-green-600" : analysis?.score >= 60 ? "text-orange-500" : "text-red-500";

  return (
    <div className="flex gap-5 h-[calc(100vh-112px)]">

      {/* Left — Analysis Panel */}
      <div className="w-80 flex-shrink-0 flex flex-col gap-4 overflow-y-auto">

        {/* Score card */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center">
                <Zap size={16} className="text-white" />
              </div>
              <span className="text-sm font-semibold text-gray-700">Saúde das Campanhas</span>
            </div>
            <button onClick={refreshAnalysis} className="text-gray-400 hover:text-gray-600">
              <RefreshCw size={14} className={loadingAnalysis ? "animate-spin" : ""} />
            </button>
          </div>

          {loadingAnalysis ? (
            <div className="flex items-center gap-2 text-sm text-gray-400 py-2">
              <RefreshCw size={14} className="animate-spin" />
              Analisando campanhas...
            </div>
          ) : analysis ? (
            <>
              <div className="flex items-end gap-2 mb-2">
                <span className={`text-4xl font-bold ${scoreColor}`}>{analysis.score}</span>
                <span className="text-gray-400 text-sm mb-1">/100</span>
              </div>
              <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${statusColor[analysis.status] || statusColor.atencao}`}>
                {analysis.status?.toUpperCase()}
              </div>
              <p className="text-xs text-gray-500 mt-2 leading-relaxed">{analysis.resumo}</p>
            </>
          ) : (
            <p className="text-xs text-gray-400">Análise indisponível</p>
          )}
        </div>

        {/* Alerts */}
        {analysis?.alertas?.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
              <AlertTriangle size={14} className="text-orange-500" />
              <span className="text-xs font-semibold text-gray-700">Alertas ({analysis.alertas.length})</span>
            </div>
            <div className="divide-y divide-gray-50">
              {analysis.alertas.map((a, i) => (
                <div key={i} className="px-4 py-3">
                  <p className="text-xs font-medium text-gray-800 mb-0.5">{a.mensagem}</p>
                  <p className="text-xs text-orange-600">→ {a.acao}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommendations */}
        {analysis?.recomendacoes?.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
              <TrendingUp size={14} className="text-blue-500" />
              <span className="text-xs font-semibold text-gray-700">Recomendações</span>
            </div>
            <div className="divide-y divide-gray-50">
              {analysis.recomendacoes.map((r, i) => (
                <div key={i} className="px-4 py-3">
                  <div className="flex items-start gap-2 mb-1">
                    <span className={`flex-shrink-0 text-xs px-1.5 py-0.5 rounded border font-medium ${priorityColor[r.prioridade] || priorityColor.baixa}`}>
                      {r.prioridade}
                    </span>
                  </div>
                  <p className="text-xs text-gray-800 mb-0.5">{r.acao}</p>
                  <p className="text-xs text-green-600 flex items-center gap-1">
                    <CheckCircle size={10} />
                    {r.impacto}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right — Chat */}
      <div className="flex-1 flex flex-col bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">

        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-orange-500 flex items-center justify-center">
            <Zap size={18} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800">Vikingo Brain™</p>
            <p className="text-xs text-green-500 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
              Online • Monitorando suas campanhas
            </p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.map((m, i) => (
            <div key={i} className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
              <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs font-bold ${m.role === "user" ? "bg-slate-700" : "bg-orange-500"}`}>
                {m.role === "user" ? "V" : <Zap size={14} />}
              </div>
              <div className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${m.role === "user" ? "bg-slate-800 text-white rounded-tr-sm" : "bg-gray-50 text-gray-800 border border-gray-100 rounded-tl-sm"}`}>
                {renderMessage(m.content)}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center">
                <Zap size={14} className="text-white" />
              </div>
              <div className="bg-gray-50 border border-gray-100 rounded-2xl rounded-tl-sm px-4 py-3 flex gap-1 items-center">
                <span className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Suggestions */}
        <div className="px-5 pb-2 flex gap-2 flex-wrap">
          {SUGGESTIONS.map((s) => (
            <button key={s} onClick={() => send(s)}
              className="text-xs px-3 py-1.5 border border-gray-200 rounded-full text-gray-600 hover:bg-orange-50 hover:border-orange-300 hover:text-orange-700 transition-colors">
              {s}
            </button>
          ))}
        </div>

        {/* Input */}
        <div className="px-5 pb-5">
          <div className="flex gap-2">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && !e.shiftKey && send()}
              placeholder="Pergunte sobre suas campanhas..."
              className="flex-1 px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
              disabled={loading}
            />
            <button
              onClick={() => send()}
              disabled={loading || !input.trim()}
              className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center text-white hover:bg-orange-600 transition-colors disabled:opacity-40">
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
