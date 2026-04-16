import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  BrainCircuit, Settings, ShoppingBag, Star, Target, Zap,
  Check, AlertTriangle, TrendingUp, TrendingDown, Eye, MousePointerClick,
  DollarSign, RefreshCw, ArrowLeft, ArrowRight, Megaphone,
  CheckCircle, Trash2, Edit3, Package, ChevronDown, Calendar,
  ArrowUpDown, Lock, Sparkles,
} from "lucide-react";
import { useProducts } from "../context/ProductsContext";

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

// AI-suggested automation rule templates. Users can toggle them on
// and the AI will schedule the underlying bid/budget changes.
const RULE_TEMPLATES = [
  {
    id: "highTrafficBidUp",
    name: "Raise bids 20% during high-traffic hours",
    desc: "6 PM – 11 PM every day, bump bids +20% on the top 10 keywords.",
    aiNote: "Works well for consumer goods. The AI will reset bids back to baseline at midnight.",
    color: "orange",
  },
  {
    id: "weekendBoost",
    name: "Weekend budget boost +30%",
    desc: "Saturday and Sunday, raise daily budget by 30%.",
    aiNote: "Recommended for Home & Kitchen and Pet categories where weekend traffic spikes.",
    color: "purple",
  },
  {
    id: "acosGuard",
    name: "Pause keywords when ACoS > 40%",
    desc: "Daily check. Pauses any keyword whose 7-day ACoS exceeds 40%.",
    aiNote: "AI safeguard — protects margin automatically. You can whitelist keywords in the table.",
    color: "red",
  },
  {
    id: "lowInventoryPause",
    name: "Pause ads when inventory < 15 days",
    desc: "Pauses the campaign automatically when stock runs low to avoid out-of-stock ads.",
    aiNote: "Prevents Amazon from demoting your listing due to out-of-stock flags.",
    color: "blue",
  },
];

const PROGRAMS = [
  {
    id: "retail",
    label: "Amazon Retail",
    desc: "Standard Amazon.com shoppers (B2C)",
    aiNote: "Best for most sellers. Largest audience. Works with SP, SB and SD.",
    supportedTypes: ["SP", "SB", "SD"],
    recommended: true,
  },
  {
    id: "business",
    label: "Amazon Business",
    desc: "B2B buyers on amazon.com/business",
    aiNote: "Higher AOV, bulk purchases. Requires a Business-registered account. Works with SP and SB.",
    supportedTypes: ["SP", "SB"],
  },
  {
    id: "beyond",
    label: "Amazon Beyond",
    desc: "Audiences off-Amazon (DSP / third-party sites)",
    aiNote: "Reaches shoppers outside Amazon through DSP. Best for retargeting with SD.",
    supportedTypes: ["SD"],
  },
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

/* ─── STEP 1: Mode + Program + Type ──────────────────────────────────────── */
function StepModeType({ mode, setMode, program, setProgram, campaignType, setCampaignType, onNext }) {
  const currentProgram = PROGRAMS.find((p) => p.id === program);
  const availableTypes = currentProgram
    ? CAMPAIGN_TYPES.filter((t) => currentProgram.supportedTypes.includes(t.id))
    : CAMPAIGN_TYPES;

  // Clear selected type if it's no longer supported by the new program
  React.useEffect(() => {
    if (currentProgram && campaignType && !currentProgram.supportedTypes.includes(campaignType)) {
      setCampaignType(null);
    }
  }, [program]);

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

      {/* NEW: Program selector */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <h2 className="text-sm font-semibold text-gray-700">Advertising program</h2>
          <span className="text-xs bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
            <BrainCircuit size={10} /> AI recommends Amazon Retail
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {PROGRAMS.map((p) => {
            const active = program === p.id;
            return (
              <button key={p.id} type="button" onClick={() => setProgram(p.id)}
                className={`relative p-4 rounded-xl border-2 text-left transition-all ${active ? "border-orange-400 bg-orange-50" : "border-gray-200 hover:border-gray-300 bg-white"}`}>
                {p.recommended && (
                  <span className="absolute top-2 right-2 text-xs bg-green-100 text-green-700 border border-green-200 px-1.5 py-0.5 rounded-full font-semibold flex items-center gap-0.5">
                    <BrainCircuit size={9} /> AI pick
                  </span>
                )}
                <p className={`text-sm font-bold ${active ? "text-orange-700" : "text-gray-800"}`}>{p.label}</p>
                <p className="text-xs text-gray-600 font-medium">{p.desc}</p>
                <p className="text-xs text-blue-600 mt-2 flex items-start gap-1">
                  <BrainCircuit size={10} className="flex-shrink-0 mt-0.5" /><span>{p.aiNote}</span>
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  Supports: {p.supportedTypes.join(", ")}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <h2 className="text-sm font-semibold text-gray-700 mb-3">
          Campaign type{" "}
          {currentProgram && (
            <span className="text-xs text-gray-400 font-normal">
              (filtered by {currentProgram.label})
            </span>
          )}
        </h2>
        <div className="grid grid-cols-3 gap-4">
          {availableTypes.map(({ id, label, desc, icon: Icon, color }) => (
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

      <button disabled={!mode || !program || !campaignType} onClick={onNext}
        className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-200 disabled:text-gray-400 text-white font-semibold py-3 rounded-xl transition-colors text-sm">
        Continue <ArrowRight size={16} />
      </button>
    </div>
  );
}

/* ─── Registered Products Picker ─────────────────────────────────────────── */
function RegisteredProductPicker({ selectedId, onSelect }) {
  const { products } = useProducts();
  const [open, setOpen] = useState(false);
  const selected = products.find((p) => p.id === selectedId);

  if (products.length === 0) {
    return (
      <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex items-start gap-3">
        <BrainCircuit size={16} className="text-orange-500 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm font-semibold text-orange-800">
            No products registered yet
          </p>
          <p className="text-xs text-orange-700 mt-0.5">
            Register a product first so Vikingo Brain™ can study the competition and pre-fill this form with accurate data.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-1 mt-2 text-xs font-semibold text-orange-700 hover:text-orange-900"
          >
            Go to My Products → register by ASIN
          </Link>
          <p className="text-xs text-gray-500 mt-2">
            Or continue below to create a campaign manually (without AI competitor context).
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border-2 border-orange-200 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <BrainCircuit size={15} className="text-orange-500" />
          <span className="text-sm font-semibold text-gray-800">Select a registered product</span>
          <span className="text-xs bg-orange-100 text-orange-700 border border-orange-200 px-2 py-0.5 rounded-full font-medium">
            AI-protected
          </span>
        </div>
        <Link to="/products" className="text-xs text-orange-600 hover:text-orange-800 font-medium">
          Manage products →
        </Link>
      </div>

      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((s) => !s)}
          className="w-full flex items-center justify-between border border-gray-300 rounded-lg px-3 py-2.5 text-sm hover:border-orange-400 transition-colors bg-white"
        >
          {selected ? (
            <span className="flex items-center gap-2 min-w-0">
              <span className="w-6 h-6 rounded bg-orange-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {selected.asin?.slice(-2) || "??"}
              </span>
              <span className="truncate text-gray-800">{selected.name}</span>
              <span className="text-xs text-gray-400 font-mono flex-shrink-0">{selected.asin}</span>
            </span>
          ) : (
            <span className="text-gray-400">Pick a product to auto-fill…</span>
          )}
          <ChevronDown size={14} className="text-gray-400" />
        </button>

        {open && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
            <div className="absolute left-0 right-0 top-full mt-1 z-20 bg-white border border-gray-200 rounded-xl shadow-lg py-1 max-h-72 overflow-y-auto">
              <button
                onClick={() => { onSelect(null); setOpen(false); }}
                className="w-full text-left px-4 py-2 text-xs text-gray-500 hover:bg-gray-50"
              >
                — Enter product manually —
              </button>
              <div className="border-t border-gray-100" />
              {products.map((p) => {
                const score = p.competitorAnalysis?.opportunityScore ?? 0;
                return (
                  <button
                    key={p.id}
                    onClick={() => { onSelect(p.id); setOpen(false); }}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-orange-50 ${selectedId === p.id ? "bg-orange-50" : ""}`}
                  >
                    <div className="w-7 h-7 rounded-lg bg-orange-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {p.asin?.slice(-2) || "??"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{p.name}</p>
                      <p className="text-xs text-gray-400 font-mono">{p.asin} • {p.category}</p>
                    </div>
                    <span className={`text-xs font-bold ${score >= 80 ? "text-green-600" : score >= 60 ? "text-orange-500" : "text-red-500"}`}>
                      {score}
                    </span>
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>

      {selected && (
        <div className="mt-3 pt-3 border-t border-gray-100 grid grid-cols-3 gap-2">
          <div className="text-xs">
            <p className="text-gray-500">Opportunity</p>
            <p className="font-bold text-gray-800">{selected.competitorAnalysis?.opportunityScore ?? 0}/100</p>
          </div>
          <div className="text-xs">
            <p className="text-gray-500">AI keywords</p>
            <p className="font-bold text-gray-800">{selected.competitorAnalysis?.suggestedKeywords?.length ?? 0}</p>
          </div>
          <div className="text-xs">
            <p className="text-gray-500">Competitors</p>
            <p className="font-bold text-gray-800">{selected.competitorAnalysis?.topCompetitors?.length ?? 0}</p>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── STEP 2: Product form ───────────────────────────────────────────────── */
function StepProduct({ form, setForm, mode, campaignType, onBack, onGenerate, loading, error }) {
  const { getProduct } = useProducts();
  const ch = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const selectProduct = (productId) => {
    if (!productId) {
      setForm((f) => ({ ...f, productId: null }));
      return;
    }
    const p = getProduct(productId);
    if (!p) return;
    const a = p.competitorAnalysis || {};
    setForm((f) => ({
      ...f,
      productId: p.id,
      productName: p.name,
      asin: p.asin,
      category: p.category,
      features: p.notes || f.features,
      competitors: (a.topCompetitors || []).map((c) => c.name).join(", "),
    }));
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
          <AlertTriangle size={14} /> {error}
        </div>
      )}

      {/* NEW: registered product picker */}
      <RegisteredProductPicker selectedId={form.productId} onSelect={selectProduct} />

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

      {/* Campaign schedule & targeting */}
      <div className="bg-white border-2 border-gray-200 rounded-xl p-4 space-y-4">
        <div className="flex items-center gap-2">
          <Calendar size={15} className="text-orange-500" />
          <h3 className="text-sm font-semibold text-gray-800">Campaign Schedule & Targeting</h3>
          <span className="ml-auto text-xs bg-orange-50 text-orange-700 border border-orange-200 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
            <BrainCircuit size={10} /> AI monitors for unsafe values
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Campaign Name <span className="text-gray-400 font-normal">(optional — AI will auto-generate)</span></label>
            <input name="campaignName" value={form.campaignName} onChange={ch} placeholder="e.g. SP - 6Qt Cooker | Exact | Main"
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Start Date</label>
            <input name="startDate" type="date" value={form.startDate} onChange={ch}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">End Date <span className="text-gray-400 font-normal">(optional)</span></label>
            <input name="endDate" type="date" value={form.endDate} onChange={ch}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Default Bid ($)</label>
            <input name="defaultBid" type="number" step="0.01" min="0.02" value={form.defaultBid} onChange={ch}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
            <p className="text-xs text-gray-400 mt-0.5">Used for any keyword without a specific bid</p>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Targeting Type</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id:"manual", label:"Manual", desc:"You pick keywords", icon:Edit3 },
                { id:"auto",   label:"Automatic", desc:"Amazon picks for you", icon:Sparkles },
              ].map(({ id, label, desc, icon: Icon }) => (
                <button key={id} type="button"
                  onClick={() => setForm(f => ({ ...f, targetingType: id }))}
                  className={`flex items-start gap-2 p-2.5 rounded-lg border-2 text-left transition-all ${form.targetingType === id ? "border-orange-400 bg-orange-50" : "border-gray-200 hover:border-gray-300"}`}>
                  <Icon size={14} className={form.targetingType === id ? "text-orange-600" : "text-gray-500"} />
                  <div className="min-w-0">
                    <p className={`text-xs font-semibold ${form.targetingType === id ? "text-orange-700" : "text-gray-700"}`}>{label}</p>
                    <p className="text-xs text-gray-500">{desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bidding strategy */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <label className="block text-xs font-semibold text-gray-700">Bidding Strategy</label>
            <span className="text-xs bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
              <BrainCircuit size={10} /> AI recommends "Down only" for new campaigns
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {[
              {
                id: "dynamic_updown",
                label: "Dynamic bids – up and down",
                icon: ArrowUpDown,
                color: "purple",
                desc: "We'll raise your bids (by a maximum of 100% on all placements) in real time when your ad may be more likely to convert to a sale, and lower your bids when less likely to convert to a sale.",
                aiNote: "Best for proven campaigns with data history. Higher risk of overspend.",
              },
              {
                id: "dynamic_down",
                label: "Dynamic bids – down only",
                icon: TrendingDown,
                color: "green",
                desc: "We'll lower your bids in real time when your ad may be less likely to convert to a sale.",
                aiNote: "Recommended for new campaigns. Safest option — Amazon only reduces bids.",
              },
              {
                id: "fixed",
                label: "Fixed bids",
                icon: Lock,
                color: "gray",
                desc: "We'll use your exact bid and any manual adjustments you set, and won't change your bids based on likelihood of a sale.",
                aiNote: "Maximum control. Use only if you want full manual bid authority.",
              },
            ].map(({ id, label, icon: Icon, color, desc, aiNote }) => {
              const active = form.biddingStrategy === id;
              const recommended = id === "dynamic_down";
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setForm(f => ({ ...f, biddingStrategy: id }))}
                  className={`relative p-3 rounded-xl border-2 text-left transition-all ${active ? "border-orange-400 bg-orange-50" : "border-gray-200 hover:border-gray-300 bg-white"}`}
                >
                  {recommended && (
                    <span className="absolute top-2 right-2 text-xs bg-green-100 text-green-700 border border-green-200 px-1.5 py-0.5 rounded-full font-semibold flex items-center gap-0.5">
                      <BrainCircuit size={9} /> AI pick
                    </span>
                  )}
                  <div className={`w-7 h-7 rounded-lg bg-${color}-100 flex items-center justify-center mb-2`}>
                    <Icon size={14} className={`text-${color}-600`} />
                  </div>
                  <p className={`text-xs font-bold ${active ? "text-orange-700" : "text-gray-800"}`}>{label}</p>
                  <p className="text-xs text-gray-500 mt-1 leading-snug">{desc}</p>
                  <p className="text-xs text-blue-600 mt-2 flex items-start gap-1">
                    <BrainCircuit size={10} className="flex-shrink-0 mt-0.5" /><span>{aiNote}</span>
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* AI warnings */}
        {form.biddingStrategy === "dynamic_updown" && (
          <div className="flex items-start gap-2 bg-purple-50 border border-purple-200 text-purple-800 rounded-lg px-3 py-2 text-xs">
            <AlertTriangle size={13} className="flex-shrink-0 mt-0.5" />
            <span>
              <strong>AI heads up:</strong> Up-and-down can double your CPC on hot placements.
              Monitor daily spend for the first 7 days or keep a low budget cap.
            </span>
          </div>
        )}
        {Number(form.defaultBid) > 3 && (
          <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-800 rounded-lg px-3 py-2 text-xs">
            <AlertTriangle size={13} className="flex-shrink-0 mt-0.5" />
            <span>
              <strong>AI safeguard:</strong> Default bid of ${Number(form.defaultBid).toFixed(2)} is above the 90th percentile for this category.
              Consider lowering to $0.50–$1.20 to avoid wasted spend.
            </span>
          </div>
        )}
        {form.endDate && form.startDate && form.endDate < form.startDate && (
          <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-800 rounded-lg px-3 py-2 text-xs">
            <AlertTriangle size={13} className="flex-shrink-0 mt-0.5" />
            <span>End date is before start date. Please fix before generating.</span>
          </div>
        )}
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
  const [showUpload, setShowUpload] = useState(false);
  const [uploadText, setUploadText] = useState("");
  const [showNegAdd, setShowNegAdd] = useState(false);
  const [negInput, setNegInput] = useState({ keyword: "", matchType: "exact" });
  const [showNegProdAdd, setShowNegProdAdd] = useState(false);
  const [negProdInput, setNegProdInput] = useState({ type: "asin", value: "" });
  const [showRuleAdd, setShowRuleAdd] = useState(false);

  const negProducts = campaign.negativeProducts ?? [];
  const addNegProduct = () => {
    if (!negProdInput.value.trim()) return;
    const next = [...negProducts, { type: negProdInput.type, value: negProdInput.value.trim() }];
    setCampaign((c) => ({ ...c, negativeProducts: next }));
    setNegProdInput({ type: "asin", value: "" });
    setShowNegProdAdd(false);
  };
  const removeNegProduct = (i) => {
    const next = negProducts.filter((_, idx) => idx !== i);
    setCampaign((c) => ({ ...c, negativeProducts: next }));
  };

  const rules = campaign.automationRules ?? [];
  const addRule = (template) => {
    // Prevent duplicate rules by template id
    if (rules.some((r) => r.id === template.id)) {
      setShowRuleAdd(false);
      return;
    }
    const next = [...rules, { ...template, enabled: true }];
    setCampaign((c) => ({ ...c, automationRules: next }));
    setShowRuleAdd(false);
  };
  const toggleRule = (i) => {
    const next = rules.map((r, idx) => (idx === i ? { ...r, enabled: !r.enabled } : r));
    setCampaign((c) => ({ ...c, automationRules: next }));
  };
  const removeRule = (i) => {
    const next = rules.filter((_, idx) => idx !== i);
    setCampaign((c) => ({ ...c, automationRules: next }));
  };

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

  // AI bid suggestion based on volume + competition + target ACoS
  const bidSuggestion = (kw) => {
    const bid = Number(kw.bid) || 0;
    const targetAcos = Number(form.targetAcos) / 100 || 0.25;
    // Ideal bid = CPC the seller can afford given target ACoS
    const ideal = 0.35 + (kw.volume === "high" ? 0.3 : kw.volume === "medium" ? 0.15 : 0) +
                  (kw.competition === "high" ? 0.3 : kw.competition === "medium" ? 0.1 : 0);
    const min = ideal * 0.7;
    const max = ideal * 1.3;
    if (bid < min) return { action: "up", to: ideal, reason: `Below suggested range — raise to $${ideal.toFixed(2)} to stay competitive.` };
    if (bid > max) return { action: "down", to: ideal, reason: `Above suggested range — lower to $${ideal.toFixed(2)} to protect ACoS.` };
    return { action: "ok", to: bid, reason: "Within the AI-recommended range." };
  };

  const uploadKeywords = () => {
    const parsed = uploadText
      .split(/[\n,;]+/)
      .map((s) => s.trim())
      .filter(Boolean)
      .map((keyword) => ({
        keyword,
        matchType: "broad",
        bid: Number(form.defaultBid) || 0.75,
        volume: "medium",
        competition: "medium",
        _userUploaded: true,
      }));
    if (parsed.length === 0) return;
    setCampaign((c) => ({ ...c, keywords: [...(c.keywords || []), ...parsed] }));
    setUploadText("");
    setShowUpload(false);
  };

  const addNegative = () => {
    if (!negInput.keyword.trim()) return;
    const next = [...negKeywords, { keyword: negInput.keyword.trim(), matchType: negInput.matchType }];
    setCampaign((c) => ({ ...c, negativeKeywords: next, keywordsNegativas: next }));
    setNegInput({ keyword: "", matchType: "exact" });
    setShowNegAdd(false);
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

  const targetAcos = Number(form.targetAcos) || 0;
  const acosOverrun = estimatedAcos && targetAcos && estimatedAcos > targetAcos;

  return (
    <div className="space-y-4">
      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
          <AlertTriangle size={14} /> {error}
        </div>
      )}

      {/* AI ACoS alert banner */}
      {acosOverrun && (
        <div className="flex items-start gap-3 bg-red-50 border-2 border-red-300 rounded-xl px-4 py-3">
          <AlertTriangle size={18} className="text-red-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-bold text-red-700 mb-0.5 flex items-center gap-1">
              <BrainCircuit size={13} /> AI alert — estimated ACoS above your target
            </p>
            <p className="text-xs text-red-700">
              Estimated ACoS is <strong>{estimatedAcos}%</strong> but your target is <strong>{targetAcos}%</strong>.
              The AI suggests lowering bids on high-competition keywords, removing low-converting ones, or raising your selling price.
            </p>
          </div>
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
            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-gray-700">Keywords</h3>
                <span className="text-xs bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                  <BrainCircuit size={10} /> AI bid guidance
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">{selected.length} of {campaign.keywords?.length || 0} selected</span>
                <button onClick={() => setShowUpload((s) => !s)}
                  className="flex items-center gap-1 text-xs px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium">
                  <Plus size={11} /> Upload keywords
                </button>
              </div>
            </div>

            {/* Upload panel */}
            {showUpload && (
              <div className="px-4 py-3 bg-orange-50 border-b border-orange-100 space-y-2">
                <p className="text-xs text-gray-700">
                  Paste keywords (comma, semicolon or newline-separated). Each will be added as Broad match using the default bid (${Number(form.defaultBid).toFixed(2)}).
                </p>
                <textarea
                  rows={3}
                  value={uploadText}
                  onChange={(e) => setUploadText(e.target.value)}
                  placeholder={"stainless pressure cooker\n6 quart electric cooker\ninstant cooker"}
                  className="w-full border border-orange-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none bg-white"
                />
                <div className="flex justify-end gap-2">
                  <button onClick={() => { setShowUpload(false); setUploadText(""); }}
                    className="px-3 py-1 text-xs border border-gray-300 rounded-lg">Cancel</button>
                  <button onClick={uploadKeywords} disabled={!uploadText.trim()}
                    className="px-3 py-1 text-xs bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white rounded-lg font-medium">
                    Add to campaign
                  </button>
                </div>
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-3 py-2 text-left text-gray-500 font-medium w-8"></th>
                    <th className="px-3 py-2 text-left text-gray-500 font-medium">Keyword</th>
                    <th className="px-3 py-2 text-left text-gray-500 font-medium">Type</th>
                    <th className="px-3 py-2 text-left text-gray-500 font-medium">Bid</th>
                    <th className="px-3 py-2 text-left text-gray-500 font-medium">AI Bid</th>
                    <th className="px-3 py-2 text-left text-gray-500 font-medium">Volume</th>
                    <th className="px-3 py-2 text-left text-gray-500 font-medium">Comp.</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {(campaign.keywords || []).map((kw, i) => {
                    const volume = kw.volume;
                    const competition = kw.competition ?? kw.competicao;
                    const sug = bidSuggestion(kw);
                    return (
                      <tr key={i} className={`hover:bg-gray-50 ${kw._excluded ? "opacity-40" : ""}`}>
                        <td className="px-3 py-2">
                          <input type="checkbox" checked={!kw._excluded} onChange={() => toggleKw(i)} className="rounded accent-orange-500" />
                        </td>
                        <td className="px-3 py-2 font-medium text-gray-800 max-w-[160px] truncate">
                          {kw.keyword}
                          {kw._userUploaded && <span className="ml-1 text-xs text-gray-400">(uploaded)</span>}
                        </td>
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
                        <td className="px-3 py-2">
                          <button onClick={() => updateBid(i, sug.to.toFixed(2))}
                            title={sug.reason}
                            className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-medium transition-colors ${
                              sug.action === "up" ? "bg-orange-100 text-orange-700 hover:bg-orange-200" :
                              sug.action === "down" ? "bg-blue-100 text-blue-700 hover:bg-blue-200" :
                              "bg-green-100 text-green-700"
                            }`}>
                            {sug.action === "up" && <TrendingUp size={10} />}
                            {sug.action === "down" && <TrendingDown size={10} />}
                            {sug.action === "ok" && <Check size={10} />}
                            ${sug.to.toFixed(2)}
                          </button>
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

          {/* Negative keywords — always shown, expandable */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-gray-700">Negative Keyword Targeting</h3>
                <span className="text-xs bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                  <BrainCircuit size={10} /> AI blocks irrelevant traffic
                </span>
              </div>
              <button onClick={() => setShowNegAdd((s) => !s)}
                className="flex items-center gap-1 text-xs px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium">
                <Plus size={11} /> Add negative
              </button>
            </div>

            {showNegAdd && (
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <input
                  value={negInput.keyword}
                  onChange={(e) => setNegInput((n) => ({ ...n, keyword: e.target.value }))}
                  placeholder="negative keyword..."
                  className="flex-1 min-w-32 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
                <select
                  value={negInput.matchType}
                  onChange={(e) => setNegInput((n) => ({ ...n, matchType: e.target.value }))}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
                >
                  <option value="exact">Exact</option>
                  <option value="phrase">Phrase</option>
                </select>
                <button onClick={addNegative} disabled={!negInput.keyword.trim()}
                  className="px-3 py-2 text-sm bg-red-500 hover:bg-red-600 disabled:bg-gray-300 text-white rounded-lg font-medium">
                  Add
                </button>
              </div>
            )}

            {negKeywords.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {negKeywords.map((kw, i) => (
                  <span key={i} className="flex items-center gap-1 text-xs bg-red-50 border border-red-200 text-red-700 px-2 py-1 rounded-full">
                    {kw.keyword} <span className="text-red-400">({kw.matchType})</span>
                    <button onClick={() => removeNeg(i)} className="ml-0.5 hover:text-red-900"><Trash2 size={10} /></button>
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-400 italic">
                No negative keywords yet. Adding terms like "free", "cheap" or competitor brands prevents wasted clicks.
              </p>
            )}
          </div>

          {/* Negative product targeting */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-gray-700">Negative Product Targeting</h3>
                <span className="text-xs bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                  <BrainCircuit size={10} /> AI blocks your ad from showing on these ASINs
                </span>
              </div>
              <button onClick={() => setShowNegProdAdd((s) => !s)}
                className="flex items-center gap-1 text-xs px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium">
                <Plus size={11} /> Add ASIN / brand
              </button>
            </div>

            {showNegProdAdd && (
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <input
                  value={negProdInput.value}
                  onChange={(e) => setNegProdInput((n) => ({ ...n, value: e.target.value }))}
                  placeholder={negProdInput.type === "asin" ? "B0XXXXXXXXX" : "Brand name"}
                  className="flex-1 min-w-32 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 font-mono"
                />
                <select
                  value={negProdInput.type}
                  onChange={(e) => setNegProdInput((n) => ({ ...n, type: e.target.value }))}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
                >
                  <option value="asin">ASIN</option>
                  <option value="brand">Brand</option>
                </select>
                <button onClick={addNegProduct} disabled={!negProdInput.value.trim()}
                  className="px-3 py-2 text-sm bg-red-500 hover:bg-red-600 disabled:bg-gray-300 text-white rounded-lg font-medium">
                  Add
                </button>
              </div>
            )}

            {negProducts.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {negProducts.map((p, i) => (
                  <span key={i} className="flex items-center gap-1 text-xs bg-red-50 border border-red-200 text-red-700 px-2 py-1 rounded-full">
                    <span className="font-mono">{p.value}</span>
                    <span className="text-red-400">({p.type})</span>
                    <button onClick={() => removeNegProduct(i)} className="ml-0.5 hover:text-red-900"><Trash2 size={10} /></button>
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-400 italic">
                Add competitor ASINs or brands here to stop your ad from appearing on their listings (and vice versa).
              </p>
            )}
          </div>

          {/* Automation rules */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-gray-700">Automation Rules</h3>
                <span className="text-xs bg-orange-50 text-orange-700 border border-orange-200 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                  <BrainCircuit size={10} /> AI-assisted
                </span>
              </div>
              <button onClick={() => setShowRuleAdd((s) => !s)}
                className="flex items-center gap-1 text-xs px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium">
                <Plus size={11} /> Create rule
              </button>
            </div>

            <p className="text-xs text-gray-500 mb-3">
              Automate manual tasks and optimize performance. AI-recommended templates below — pick one or write your own.
            </p>

            {/* Templates */}
            {showRuleAdd && (
              <div className="space-y-2 mb-3">
                {RULE_TEMPLATES.map((tpl) => (
                  <button key={tpl.id} onClick={() => addRule(tpl)}
                    className="w-full flex items-start gap-3 p-3 rounded-lg border border-gray-200 hover:border-orange-400 hover:bg-orange-50 text-left transition-colors">
                    <div className={`w-7 h-7 rounded-lg bg-${tpl.color}-100 flex items-center justify-center flex-shrink-0`}>
                      <Zap size={14} className={`text-${tpl.color}-600`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800">{tpl.name}</p>
                      <p className="text-xs text-gray-500">{tpl.desc}</p>
                      <p className="text-xs text-blue-600 mt-1 flex items-start gap-1">
                        <BrainCircuit size={10} className="flex-shrink-0 mt-0.5" />
                        <span>{tpl.aiNote}</span>
                      </p>
                    </div>
                    <Plus size={14} className="text-orange-500 flex-shrink-0 mt-1" />
                  </button>
                ))}
              </div>
            )}

            {/* Active rules */}
            {rules.length > 0 ? (
              <div className="space-y-1.5">
                {rules.map((r, i) => (
                  <div key={i} className="flex items-center gap-3 p-2 bg-orange-50 border border-orange-200 rounded-lg">
                    <input type="checkbox" checked={r.enabled} onChange={() => toggleRule(i)} className="rounded accent-orange-500" />
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium ${r.enabled ? "text-gray-800" : "text-gray-400 line-through"}`}>{r.name}</p>
                      <p className="text-xs text-gray-500">{r.desc}</p>
                    </div>
                    <button onClick={() => removeRule(i)} className="text-gray-400 hover:text-red-500">
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-400 italic">
                No automation rules yet. Click "Create rule" to pick a template — e.g. raise bids during high-traffic hours.
              </p>
            )}
          </div>
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
  const [program, setProgram] = useState("retail");
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
        program,
        campaignName: form.campaignName,
        startDate: form.startDate,
        endDate: form.endDate,
        defaultBid: form.defaultBid,
        targetingType: form.targetingType,
        biddingStrategy: form.biddingStrategy,
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
    setStep("mode_type"); setMode(null); setProgram("retail"); setCampaignType(null);
    setForm({ productId:null, productName:"", asin:"", category:"", marketplace:"US", budget:50, targetAcos:20, features:"", competitors:"", campaignName:"", startDate: new Date().toISOString().slice(0,10), endDate:"", defaultBid: 0.75, targetingType: "manual", biddingStrategy: "dynamic_down" });
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
        {step === "mode_type" && <StepModeType mode={mode} setMode={setMode} program={program} setProgram={setProgram} campaignType={campaignType} setCampaignType={setCampaignType} onNext={() => setStep("product")} />}
        {step === "product"   && <StepProduct form={form} setForm={setForm} mode={mode} campaignType={campaignType} onBack={() => setStep("mode_type")} onGenerate={handleGenerate} loading={loading} error={error} />}
        {step === "loading"   && <StepLoading />}
        {step === "review"    && campaign && <StepReview campaign={campaign} setCampaign={setCampaign} campaignType={campaignType} form={form} onBack={() => setStep("product")} onCreate={handleCreate} creating={creating} error={error} />}
        {step === "success"   && <StepSuccess result={result} form={form} campaignType={campaignType} onReset={handleReset} />}
      </div>
    </div>
  );
}
