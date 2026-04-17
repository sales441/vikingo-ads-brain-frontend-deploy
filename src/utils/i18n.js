// ─────────────────────────────────────────────────────────────────────────────
// Client-side safety net: if the backend is still running the old Portuguese
// code, this normalizer translates common fields into English so the UI never
// shows mixed-language content. The real fix is to update the backend.
// ─────────────────────────────────────────────────────────────────────────────

// Field-level label translations (statuses, priorities, keywords common on
// AI responses coming from the legacy backend).
const LABEL_MAP = {
  // Health status
  otimo:     "excellent",
  bom:       "good",
  atencao:   "attention",
  critico:   "critical",
  // Alert / recommendation priority
  alta:      "high",
  media:     "medium",
  baixa:     "low",
  // Match types (old backend used these)
  ampla:     "broad",
  frase:     "phrase",
  exata:     "exact",
  // Volume / competition
  "muito alta":  "very high",
  "muito alto":  "very high",
  "média":       "medium",
  "médio":       "medium",
  // Yes/no, active/paused
  ativo:     "active",
  pausado:   "paused",
  encerrado: "ended",
  erro:      "error",
};

// Common Portuguese phrases the legacy backend returns — we only substitute
// the exact full message so we don't accidentally mangle English text.
const PHRASE_MAP = [
  ["As campanhas estão sem dados, o que impede uma análise mais aprofundada.",
   "No campaign data yet — connect Amazon Ads and run at least one campaign for the AI to work with."],
  ["Não há dados disponíveis para análise das campanhas.",
   "No campaign data available for analysis."],
  ["Iniciar campanhas e monitorar resultados.",
   "Launch campaigns and monitor the results."],
  ["Criar campanhas com segmentação adequada e monitorar performance.",
   "Create campaigns with proper targeting and monitor performance."],
  ["Aumentar visibilidade e potencial de vendas.",
   "Increase visibility and sales potential."],
  ["Definir palavras-chave relevantes para o seu nicho.",
   "Define keywords relevant to your niche."],
  ["Melhorar a relevância e a taxa de cliques.",
   "Improve relevance and click-through rate."],
  ["Estabelecer um orçamento inicial para as campanhas.",
   "Set an initial budget for the campaigns."],
  ["Permitir a coleta de dados para futuras otimizações.",
   "Enable data collection for future optimizations."],
  ["Produto Principal", "Main Product"],
  ["Produto Secundário", "Secondary Product"],
  ["Conquista Concorrente", "Competitor Conquest"],
  ["Retargeting Visitantes", "Visitor Retargeting"],
  ["Lançamento Linha Nova", "New Line Launch"],
];

function translateString(s) {
  if (typeof s !== "string" || !s) return s;
  // Exact phrase replacements first
  let out = s;
  for (const [pt, en] of PHRASE_MAP) {
    if (out.includes(pt)) out = out.split(pt).join(en);
  }
  // Lowercase label lookup (only if whole value matches)
  const key = out.toLowerCase().trim();
  if (LABEL_MAP[key]) return LABEL_MAP[key];
  return out;
}

function translateDeep(obj) {
  if (obj == null) return obj;
  if (typeof obj === "string") return translateString(obj);
  if (Array.isArray(obj)) return obj.map(translateDeep);
  if (typeof obj === "object") {
    const out = {};
    for (const k of Object.keys(obj)) out[k] = translateDeep(obj[k]);
    return out;
  }
  return obj;
}

export function normalizeBackendResponse(data) {
  return translateDeep(data);
}

export function normalizeLabel(s) {
  return translateString(s);
}
