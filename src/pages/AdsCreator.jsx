import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  BrainCircuit, Settings, ShoppingBag, Star, Target, Zap,
  Check, AlertTriangle, TrendingUp, Eye, MousePointerClick,
  DollarSign, RefreshCw, ArrowLeft, ArrowRight, Megaphone,
  CheckCircle, Trash2, Edit3, Package,
} from "lucide-react";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const CATEGORIES = [
  "Home & Kitchen","Electronics","Tools","Beauty","Health",
  "Sports","Toys","Pet","Grocery","Clothing & Accessories",
  "Garden","Automotive","Office","Other",
];

const CAMPAIGN_TYPES = [
  { id:"SP", label:"Sponsored Products", desc:"Product in search results",   icon:ShoppingBag, color:"blue" },
  { id:"SB", label:"Sponsored Brands",   desc:"Brand headline with video",   icon:Star,        color:"purple" },
  { id:"SD", label:"Sponsored Display",  desc:"Display and retargeting",     icon:Target,      color:"green" },
];

const MATCH_COLORS = { broad:"bg-blue-100 text-blue-700", phrase:"bg-orange-100 text-orange-700", exact:"bg-green-100 text-green-700" };
const MATCH_LABELS = { broad:"Broad", phrase:"Phrase", exact:"Exact" };

const VOL_COLORS  = { high:"text-green-600", medium:"text-yellow-600", low:"text-gray-400" };
const COMP_COLORS = { high:"text-red-500", medium:"text-orange-500", low:"text-green-600" };

function ProgressBar({ step }) {
  const steps = ["Mode","Product","Review","Done"];
  const idx = { mode_type:0, product:1, loading:2, review:2, creating:2, success:3 }[step] ?? 0;
  return (
    <div className="flex items-center gap-2 mb-6">
      {steps.map((s, i) => (
        <React.Fragment key={s}>
          <div className="flex items-center gap-1.5">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${i <= idx ? "bg-orange-500 text-white" : "bg-gray-200 text-gray-400"}`}>
              {i < idx ? <Check size={12} /> : i + 1}
            </div>
            <span className={`text-xs font-medium hidden sm:block ${i <= idx ? "text-gray-700" : "text-gray-400"}`}>{s}</span>
          </div>
          {i < steps.length - 1 && <div className={`flex-1 h-0.5 ${i < idx ? "bg-orange-400" : "bg-gray-200"}`} />}
        </React.Fragment>
      ))}
    </div>
  );
}

/* ─── STEP 1: Mode + Type ────────────────────────────────────────────────── */
function StepModeType({ mode, setMode, campaignType, setCampaignType, onNext }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-sm font-semibold text-gray-700 mb-3">How do you want to build it?</h2>
        <div className="grid grid-cols-2 gap-4">
          {[
            { id:"auto",   label:"Automatic AI",      desc:"AI builds everything in 1 click",    icon:BrainCircuit, cls:"from-orange-500 to-orange-600 text-white" },
            { id:"manual", label:"Manual + Assisted", desc:"You configure it with AI assistance", icon:Settings,     cls:"from-slate-700 to-slate-800 text-white" },
          ].map(({ id, label, desc, icon: Icon, cls }) => (
            <button key={id} onClick={() => setMode(id)}
              className={`p-5 rounded-xl border-2 text-left transition-all ${mode === id ? "border-orange-400 shadow-md" : "border-gray-200 hover:border-gray-300"}`}>
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${cls} flex items-center justify-center mb-3`}>
                <Icon size={20} />
              </div>
              <p className="font-semibold text-gray-800 text-sm">{label}</p>
              <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
            </button>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-sm font-semibold text-gray-700 mb-3">Campaign type</h2>
        <div className="grid grid-cols-3 gap-4">
          {CAMPAIGN_TYPES.map(({ id, label, desc, icon: Icon, color }) => (
            <button key={id} onClick={() => setCampaignType(id)}
              className={`p-4 rounded-xl border-2 text-left transition-all ${campaignType === id ? "border-orange-400 shadow-md" : "border-gray-200 hover:border-gray-300"}`}>
              <div className={`w-8 h-8 rounded-lg bg-${color}-100 flex items-center justify-center mb-2`}>
                <Icon size={16} className={`text-${color}-600`} />
              </div>
              <p className="font-semibold text-gray-800 text-xs">{id}</p>
              <p className="text-xs font-medium text-gray-700">{label}</p>
              <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
            </button>
          ))}
        </div>
      </div>

      <button disabled={!mode || !campaignType} onClick={onNext}
        className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-200 disabled:text-gray-400 text-white font-semibold py-3 rounded-xl transition-colors text-sm">
        Continue <ArrowRight size={16} />
      </button>
    </div>
  );
}

/* ─── STEP 2: Product form ───────────────────────────────────────────────── */
function StepProduct({ form, setForm, mode, campaignType, onBack, onGenerate, loading, error }) {
  const ch = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  return (
    <div className="space-y-4">
      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
          <AlertTriangle size={14} /> {error}
        </div>
      )}
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">Product Name <span className="text-red-400">*</span></label>
          <input name="productName" value={form.productName} onChange={ch} placeholder="e.g. 6Qt Electric Pressure Cooker" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">ASIN <span className="text-gray-400 font-normal">(optional)</span></label>
          <input name="asin" value={form.asin} onChange={ch} placeholder="B0XXXXXXXXX" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">Category <span className="text-red-400">*</span></label>
          <select name="category" value={form.category} onChange={ch} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white">
            <option value="">Select...</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">Daily Budget ($)</label>
          <input name="budget" type="number" min="5" value={form.budget} onChange={ch} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">Target ACoS (%)</label>
          <input name="targetAcos" type="number" min="1" max="100" value={form.targetAcos} onChange={ch} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">Marketplace</label>
          <select name="marketplace" value={form.marketplace} onChange={ch} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white">
            <option value="US">Amazon USA (US)</option>
            <option value="CA">Amazon Canada (CA)</option>
            <option value="MX">Amazon Mexico (MX)</option>
          </select>
        </div>
        <div className="col-span-2">
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">Description / Main Features</label>
          <textarea name="features" value={form.features} onChange={ch} rows={3} placeholder="Helps the AI generate more relevant keywords for your product..." className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none" />
        </div>
        <div className="col-span-2">
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">Competitors <span className="text-gray-400 font-normal">(comma-separated)</span></label>
          <input name="competitors" value={form.competitors} onChange={ch} placeholder="Instant Pot, Ninja, Cuisinart" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button onClick={onBack} className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-xl text-sm text-gray-700 hover:bg-gray-50 transition-colors">
          <ArrowLeft size={14} /> Back
        </button>
        <button onClick={onGenerate} disabled={loading || !form.productName || !form.category}
          className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:from-gray-300 disabled:to-gray-300 text-white font-semibold py-2.5 rounded-xl transition-all text-sm">
          {loading ? <RefreshCw size={15} className="animate-spin" /> : <BrainCircuit size={15} />}
          {loading ? "Generating..." : "Generate Campaign with AI"}
        </button>
      </div>
    </div>
  );
}

/* ─── STEP 3: Loading ────────────────────────────────────────────────────── */
function StepLoading() {
  const pills = ["Researching competitors","Analyzing search volume","Calculating optimal bids","Structuring campaign","Finalizing recommendations"];
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-6">
      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-lg animate-pulse">
        <BrainCircuit size={36} className="text-white" />
      </div>
      <div className="text-center">
        <h2 className="text-xl font-bold text-gray-800 mb-1">Vikingo Brain™ is building your campaign...</h2>
        <p className="text-sm text-gray-500">Analyzing competitors and calculating the best bids</p>
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        {pills.map((p, i) => (
          <span key={p} className="flex items-center gap-1.5 text-xs text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full animate-pulse" style={{ animationDelay: `${i * 0.4}s` }}>
            <RefreshCw size={10} className="animate-spin" /> {p}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─── STEP 4: Review ─────────────────────────────────────────────────────── */
function StepReview({ campaign, setCampaign, campaignType, form, onBack, onCreate, creating, error }) {
  const [editingBid, setEditingBid] = useState(null);

  const toggleKw = (i) => {
    const kws = [...campaign.keywords];
    kws[i] = { ...kws[i], _excluded: !kws[i]._excluded };
    setCampaign(c => ({ ...c, keywords: kws }));
  };

  const updateBid = (i, val) => {
    const kws = [...campaign.keywords];
    kws[i] = { ...kws[i], bid: parseFloat(val) || kws[i].bid };
    setCampaign(c => ({ ...c, keywords: kws }));
  };

  const negKeywords = campaign.negativeKeywords ?? campaign.keywordsNegativas ?? [];
  const removeNeg = (i) => {
    const neg = negKeywords.filter((_, idx) => idx !== i);
    setCampaign(c => ({ ...c, negativeKeywords: neg, keywordsNegativas: neg }));
  };

  const perf = campaign.performanceEstimate || campaign.estimativaPerformance || {};
  const selected = (campaign.keywords || []).filter(k => !k._excluded);

  const impressionsDay = perf.impressionsDay ?? perf.impressoesDia;
  const clicksDay = perf.clicksDay ?? perf.cliquesDia;
  const spendDay = perf.spendDay ?? perf.gastoDia;
  const ordersDay = perf.ordersDay ?? perf.pedidosDia;
  const estimatedAcos = perf.estimatedAcos ?? perf.acosEstimado;
  const estimatedRoas = perf.estimatedRoas ?? perf.roasEstimado;

  const insights = campaign.insights;
  const alerts = campaign.alerts ?? campaign.alertas;
  const strategyDescription = campaign.strategyDescription ?? campaign.descricaoEstrategia;

  return (
    <div className="space-y-4">
      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
          <AlertTriangle size={14} /> {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left: Campaign config + Keywords */}
        <div className="lg:col-span-2 space-y-4">

          {/* Campaign settings */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm space-y-3">
            <h3 className="text-sm font-semibold text-gray-700">Campaign Settings</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="block text-xs text-gray-500 mb-1">Name</label>
                <input value={campaign.campaignName ?? campaign.nomeCampanha ?? ""} onChange={e => setCampaign(c => ({ ...c, campaignName: e.target.value, nomeCampanha: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Daily Budget ($)</label>
                <input type="number" value={campaign.dailyBudget ?? campaign.orcamentoDiario ?? ""} onChange={e => setCampaign(c => ({ ...c, dailyBudget: e.target.value, orcamentoDiario: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Default Bid ($)</label>
                <input type="number" step="0.01" value={campaign.defaultBid ?? campaign.lanceDefault ?? ""} onChange={e => setCampaign(c => ({ ...c, defaultBid: e.target.value, lanceDefault: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Bidding Strategy</label>
                <select value={campaign.bidStrategy ?? campaign.estrategiaLance ?? "legacyForSales"} onChange={e => setCampaign(c => ({ ...c, bidStrategy: e.target.value, estrategiaLance: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white">
                  <option value="legacyForSales">Manual CPC</option>
                  <option value="autoForSales">Auto for Sales</option>
                  <option value="enhanced">Enhanced CPC</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Targeting</label>
                <select value={campaign.targetingType ?? campaign.tipoSegmentacao ?? "manual"} onChange={e => setCampaign(c => ({ ...c, targetingType: e.target.value, tipoSegmentacao: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white">
                  <option value="manual">Manual</option>
                  <option value="auto">Automatic</option>
                </select>
              </div>
            </div>
            {strategyDescription && (
              <p className="text-xs text-gray-500 bg-orange-50 border border-orange-100 rounded-lg px-3 py-2">{strategyDescription}</p>
            )}
          </div>

          {/* Keywords table */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-700">Keywords</h3>
              <span className="text-xs text-gray-500">{selected.length} of {campaign.keywords?.length || 0} selected</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-3 py-2 text-left text-gray-500 font-medium w-8"></th>
                    <th className="px-3 py-2 text-left text-gray-500 font-medium">Keyword</th>
                    <th className="px-3 py-2 text-left text-gray-500 font-medium">Type</th>
                    <th className="px-3 py-2 text-left text-gray-500 font-medium">Bid</th>
                    <th className="px-3 py-2 text-left text-gray-500 font-medium">Volume</th>
                    <th className="px-3 py-2 text-left text-gray-500 font-medium">Comp.</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {(campaign.keywords || []).map((kw, i) => {
                    const volume = kw.volume;
                    const competition = kw.competition ?? kw.competicao;
                    return (
                      <tr key={i} className={`hover:bg-gray-50 ${kw._excluded ? "opacity-40" : ""}`}>
                        <td className="px-3 py-2">
                          <input type="checkbox" checked={!kw._excluded} onChange={() => toggleKw(i)} className="rounded accent-orange-500" />
                        </td>
                        <td className="px-3 py-2 font-medium text-gray-800 max-w-[160px] truncate">{kw.keyword}</td>
                        <td className="px-3 py-2">
                          <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${MATCH_COLORS[kw.matchType] || "bg-gray-100 text-gray-600"}`}>
                            {MATCH_LABELS[kw.matchType] || kw.matchType}
                          </span>
                        </td>
                        <td className="px-3 py-2">
                          {editingBid === i ? (
                            <input autoFocus type="number" step="0.01" defaultValue={kw.bid}
                              onBlur={e => { updateBid(i, e.target.value); setEditingBid(null); }}
                              onKeyDown={e => { if (e.key === "Enter") { updateBid(i, e.target.value); setEditingBid(null); } }}
                              className="w-16 border border-orange-300 rounded px-1 py-0.5 text-xs focus:outline-none" />
                          ) : (
                            <button onClick={() => setEditingBid(i)} className="flex items-center gap-1 text-gray-700 hover:text-orange-600">
                              ${Number(kw.bid).toFixed(2)} <Edit3 size={10} />
                            </button>
                          )}
                        </td>
                        <td className={`px-3 py-2 font-medium ${VOL_COLORS[volume] || "text-gray-500"}`}>{volume}</td>
                        <td className={`px-3 py-2 font-medium ${COMP_COLORS[competition] || "text-gray-500"}`}>{competition}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Negative keywords */}
          {negKeywords.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Negative Keywords</h3>
              <div className="flex flex-wrap gap-2">
                {negKeywords.map((kw, i) => (
                  <span key={i} className="flex items-center gap-1 text-xs bg-red-50 border border-red-200 text-red-700 px-2 py-1 rounded-full">
                    {kw.keyword} <span className="text-red-400">({kw.matchType})</span>
                    <button onClick={() => removeNeg(i)} className="ml-0.5 hover:text-red-900"><Trash2 size={10} /></button>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Performance + Insights + Create */}
        <div className="space-y-4">
          {/* Estimated performance */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Performance Estimate</h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label:"Impressions/day", value: impressionsDay?.toLocaleString("en-US") || "—", icon:Eye, color:"text-purple-600" },
                { label:"Clicks/day",      value: clicksDay?.toLocaleString("en-US") || "—",       icon:MousePointerClick, color:"text-blue-600" },
                { label:"Spend/day",       value: spendDay ? `$${spendDay}` : "—",                icon:DollarSign, color:"text-orange-600" },
                { label:"Orders/day",      value: ordersDay || "—",                                icon:Package, color:"text-green-600" },
                { label:"Est. ACoS",       value: estimatedAcos ? `${estimatedAcos}%` : "—",      icon:TrendingUp, color:"text-red-500" },
                { label:"Est. ROAS",       value: estimatedRoas ? `${estimatedRoas}x` : "—",      icon:Zap, color:"text-emerald-600" },
              ].map(({ label, value, icon: Icon, color }) => (
                <div key={label} className="bg-gray-50 rounded-lg p-2 text-center">
                  <Icon size={14} className={`${color} mx-auto mb-1`} />
                  <p className={`text-sm font-bold ${color}`}>{value}</p>
                  <p className="text-xs text-gray-400 leading-tight">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Insights */}
          {insights?.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">AI Insights</h3>
              <ul className="space-y-1.5">
                {insights.map((ins, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-gray-600">
                    <CheckCircle size={12} className="text-green-500 flex-shrink-0 mt-0.5" /> {ins}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Alerts */}
          {alerts?.length > 0 && (
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-orange-700 mb-2">Heads up</h3>
              <ul className="space-y-1.5">
                {alerts.map((a, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-orange-700">
                    <AlertTriangle size={12} className="flex-shrink-0 mt-0.5" /> {a}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <button onClick={onBack} className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-xl text-sm text-gray-700 hover:bg-gray-50 transition-colors">
              <ArrowLeft size={14} /> Edit product
            </button>
            <button onClick={onCreate} disabled={creating || selected.length === 0}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:from-gray-300 disabled:to-gray-300 text-white font-semibold py-3 rounded-xl transition-all text-sm">
              {creating ? <RefreshCw size={15} className="animate-spin" /> : <Megaphone size={15} />}
              {creating ? "Creating..." : "Create Campaign on Amazon"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── STEP 5: Success ────────────────────────────────────────────────────── */
function StepSuccess({ result, form, campaignType, onReset }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-6 text-center">
      <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
        <CheckCircle size={40} className="text-green-500" />
      </div>
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Campaign created successfully!</h2>
        <p className="text-sm text-gray-500 mb-1">{form.productName} · {campaignType}</p>
        {result?.campaignId && <p className="text-xs text-gray-400">ID: {result.campaignId}</p>}
        <p className={`text-xs mt-2 font-medium ${result?.mode === "live" ? "text-green-600" : "text-orange-500"}`}>
          {result?.mode === "live" ? "✓ Live on Amazon Ads" : "✓ Simulated successfully (connect Amazon credentials to go live)"}
        </p>
      </div>
      <div className="flex gap-3">
        <Link to="/campaigns" className="flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium rounded-xl transition-colors">
          <Megaphone size={14} /> View Campaigns
        </Link>
        <button onClick={onReset} className="flex items-center gap-2 px-5 py-2.5 border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-xl transition-colors">
          <RefreshCw size={14} /> New Campaign
        </button>
      </div>
    </div>
  );
}

/* ─── MAIN COMPONENT ─────────────────────────────────────────────────────── */
export default function AdsCreator() {
  const [step, setStep] = useState("mode_type");
  const [mode, setMode] = useState(null);
  const [campaignType, setCampaignType] = useState(null);
  const [form, setForm] = useState({ productName:"", asin:"", category:"", marketplace:"US", budget:50, targetAcos:20, features:"", competitors:"" });
  const [campaign, setCampaign] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);

  const handleGenerate = async () => {
    setError(null);
    setLoading(true);
    setStep("loading");
    try {
      const payload = {
        productName: form.productName,
        asin: form.asin,
        category: form.category,
        marketplace: form.marketplace,
        budget: form.budget,
        targetAcos: form.targetAcos,
        features: form.features,
        competitors: form.competitors.split(",").map(s => s.trim()).filter(Boolean),
        campaignType,
        mode,
      };
      const res = await fetch(`${BASE_URL}/ai/ads/suggest`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const sug = data.suggestion || data;
      setCampaign(sug);
      setStep("review");
    } catch (err) {
      setError("Error generating campaign. Please try again.");
      setStep("product");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    setCreating(true);
    setError(null);
    try {
      const payload = {
        productName: form.productName,
        asin: form.asin,
        category: form.category,
        campaignType,
        campaign: { ...campaign, keywords: campaign.keywords.filter(k => !k._excluded) },
      };
      const res = await fetch(`${BASE_URL}/ai/ads/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setResult(data);
      setStep("success");
    } catch (err) {
      setError("Error creating campaign. Please try again.");
    } finally {
      setCreating(false);
    }
  };

  const handleReset = () => {
    setStep("mode_type"); setMode(null); setCampaignType(null);
    setForm({ productName:"", asin:"", category:"", marketplace:"US", budget:50, targetAcos:20, features:"", competitors:"" });
    setCampaign(null); setResult(null); setError(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-sm">
          <Megaphone size={22} className="text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Ads Creator</h1>
          <p className="text-sm text-gray-500">Vikingo Brain™ analyzes competitors and builds Amazon-optimized campaigns</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
        <ProgressBar step={step} />
        {step === "mode_type" && <StepModeType mode={mode} setMode={setMode} campaignType={campaignType} setCampaignType={setCampaignType} onNext={() => setStep("product")} />}
        {step === "product"   && <StepProduct form={form} setForm={setForm} mode={mode} campaignType={campaignType} onBack={() => setStep("mode_type")} onGenerate={handleGenerate} loading={loading} error={error} />}
        {step === "loading"   && <StepLoading />}
        {step === "review"    && campaign && <StepReview campaign={campaign} setCampaign={setCampaign} campaignType={campaignType} form={form} onBack={() => setStep("product")} onCreate={handleCreate} creating={creating} error={error} />}
        {step === "success"   && <StepSuccess result={result} form={form} campaignType={campaignType} onReset={handleReset} />}
      </div>
    </div>
  );
}
