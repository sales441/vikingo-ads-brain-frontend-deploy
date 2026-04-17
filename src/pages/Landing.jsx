import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Zap, BrainCircuit, ShieldCheck, TrendingUp, Target, Package,
  BarChart3, Search, Star, CheckCircle, ArrowRight, DollarSign,
  FileText, FlaskConical, Calendar,
} from "lucide-react";
import VikingShip from "../components/VikingShip";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Default pricing — mirrors backend defaults. Overwritten at runtime by the
// values returned from GET /billing/pricing so a change to env vars is
// reflected on the Landing page without redeploying the frontend.
const DEFAULT_PRICING = {
  baseCents: 49900,
  usagePctBps: 200,
  trialDays: 14,
  asinLimit: 10,
  asinOverageCents: 1000,
  currency: "USD",
};

function formatCents(cents) {
  return `$${(cents / 100).toLocaleString("en-US", { minimumFractionDigits: cents % 100 === 0 ? 0 : 2 })}`;
}

const FEATURES = [
  { icon: BrainCircuit, title: "AI that reads your campaigns", desc: "Vikingo Brain™ analyzes every metric and surfaces 1-click fixes." },
  { icon: Package,      title: "Register products by ASIN",    desc: "Automatic competitor analysis, keyword gaps, and profit break-down." },
  { icon: Target,       title: "Ads Creator with AI guardrails", desc: "4-step wizard that warns you about risky bids and unsafe strategies." },
  { icon: TrendingUp,   title: "Profit, not just revenue",      desc: "Full FBA/FBM cost model — referral, storage, shipping, and more." },
  { icon: BarChart3,    title: "Live Amazon Ads sync",          desc: "OAuth-authorized. Your real campaigns, refreshed every 15 minutes." },
  { icon: ShieldCheck,  title: "Enterprise-grade security",     desc: "Tokens encrypted at rest. Zero buyer PII. Full audit log." },
];

const WORKFLOW = [
  { step: "1", title: "Register your companies",
    desc: "Add one or many Amazon seller accounts. Assign users and roles per company." },
  { step: "2", title: "Connect with Amazon",
    desc: "One click, OAuth-based. No password shared. Only campaign-management scope." },
  { step: "3", title: "Register products",
    desc: "Paste an ASIN — AI pulls competitors, suggested keywords, and profit model." },
  { step: "4", title: "Let the AI run",
    desc: "Monitor campaigns, accept 1-click recommendations, automate rules." },
];

const AI_TOOLS = [
  { icon: FileText,     name: "Create Listing",     desc: "SEO-ready title + bullets + backend KWs, scored against competitors." },
  { icon: DollarSign,   name: "Price Optimizer",    desc: "Find the price that maximizes profit × volume, not just revenue." },
  { icon: FlaskConical, name: "A/B Test",           desc: "Compare 2 titles and predict which converts better, with confidence %." },
  { icon: Star,         name: "Review Analysis",    desc: "Mine competitor weaknesses from their 1- & 2-star reviews." },
  { icon: Search,       name: "Product Discovery",  desc: "Find niches with high demand and low competition." },
  { icon: Calendar,     name: "Seasonal Trends",    desc: "Plan inventory and budget 30/60/90 days ahead of peak events." },
];

export default function Landing() {
  const [pricing, setPricing] = useState(DEFAULT_PRICING);
  useEffect(() => {
    fetch(`${BASE_URL}/billing/pricing`)
      .then((r) => r.ok ? r.json() : null)
      .then((p) => p && setPricing({ ...DEFAULT_PRICING, ...p }))
      .catch(() => {});
  }, []);

  const usagePct = (pricing.usagePctBps / 100).toFixed(pricing.usagePctBps % 100 === 0 ? 0 : 1);
  const baseLabel = formatCents(pricing.baseCents);
  const exampleSpendCents = 500000; // $5,000
  const exampleUsageCents = Math.round(exampleSpendCents * pricing.usagePctBps / 10_000);
  const exampleTotalCents = pricing.baseCents + exampleUsageCents;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Nav */}
      <nav className="border-b border-slate-800 sticky top-0 bg-slate-950/95 backdrop-blur z-30">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-orange-500 flex items-center justify-center">
              <Zap size={18} className="text-white" />
            </div>
            <div>
              <p className="font-bold text-sm leading-tight">Vikingo Ads</p>
              <p className="text-orange-400 text-xs font-medium">Brain™</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a href="#features" className="hidden sm:inline text-sm text-slate-300 hover:text-white">Features</a>
            <a href="#workflow" className="hidden sm:inline text-sm text-slate-300 hover:text-white">How it works</a>
            <a href="#pricing" className="hidden sm:inline text-sm text-slate-300 hover:text-white">Pricing</a>
            <Link to="/login" className="text-sm text-slate-300 hover:text-white">Sign in</Link>
            <Link to="/login" className="text-sm px-4 py-1.5 bg-orange-500 hover:bg-orange-600 rounded-lg font-semibold">
              Get started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <div>
          <span className="inline-flex items-center gap-1.5 bg-orange-500/10 text-orange-400 border border-orange-500/30 px-3 py-1 rounded-full text-xs font-semibold mb-4">
            <BrainCircuit size={12} /> Powered by Amazon Advertising API
          </span>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-5">
            Amazon Ads that <span className="text-orange-400">defend your margin</span>, not just your rank.
          </h1>
          <p className="text-lg text-slate-300 leading-relaxed mb-7">
            Vikingo Ads Brain™ reads every fee, every competitor, every keyword in your account —
            then hands you the one change that will move the needle today. Built for US marketplace sellers.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/login" className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 px-5 py-3 rounded-xl font-semibold text-sm">
              Start free <ArrowRight size={14} />
            </Link>
            <a href="#workflow" className="flex items-center gap-2 border border-slate-600 hover:border-slate-400 px-5 py-3 rounded-xl font-semibold text-sm">
              See how it works
            </a>
          </div>
          <p className="text-xs text-slate-500 mt-4 flex items-center gap-1.5">
            <ShieldCheck size={12} className="text-green-500" />
            No credit card required · Demo mode works without Amazon credentials
          </p>
        </div>
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-orange-500/20 blur-3xl rounded-full" />
            <VikingShip size={280} className="relative" />
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="border-y border-slate-800 bg-slate-900/50">
        <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { value: "23", label: "Built-in tutorials" },
            { value: "15+", label: "AI-driven tools" },
            { value: "US", label: "Marketplace focus" },
            { value: "OAuth", label: "Amazon API integration" },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-3xl font-bold text-orange-400">{s.value}</p>
              <p className="text-xs text-slate-400 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3">Everything a serious Amazon seller needs</h2>
          <p className="text-slate-400">All in one place. All guided by AI. All protected with safety nets.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-orange-500/50 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center mb-3">
                <Icon size={18} className="text-orange-400" />
              </div>
              <h3 className="font-bold mb-1">{title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Workflow */}
      <section id="workflow" className="bg-slate-900/50 border-y border-slate-800">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">From zero to optimized in 10 minutes</h2>
            <p className="text-slate-400">Four guided steps — the AI does the heavy lifting.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            {WORKFLOW.map((w) => (
              <div key={w.step} className="relative bg-slate-900 border border-slate-800 rounded-xl p-5">
                <div className="absolute -top-3 -left-3 w-9 h-9 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center font-bold text-sm shadow-lg">
                  {w.step}
                </div>
                <h3 className="font-bold mt-3 mb-2">{w.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI tools */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3">Six AI tools that replace an agency</h2>
          <p className="text-slate-400">Each one trained on Amazon's own patterns.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {AI_TOOLS.map(({ icon: Icon, name, desc }) => (
            <div key={name} className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                <Icon size={16} className="text-orange-400" />
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-sm mb-1">{name}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="bg-slate-900/50 border-y border-slate-800">
        <div className="max-w-4xl mx-auto px-6 py-20">
          <div className="text-center mb-10">
            <span className="inline-flex items-center gap-1.5 bg-orange-500/10 text-orange-400 border border-orange-500/30 px-3 py-1 rounded-full text-xs font-semibold mb-3">
              Simple pricing
            </span>
            <h2 className="text-3xl font-bold mb-3">Pay as your ads grow</h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              One price per Amazon seller account you manage, plus a small fee on what you actually spend on ads.
            </p>
          </div>

          <div className="bg-slate-900 border-2 border-orange-500/40 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-bl-xl">
              Per company
            </div>

            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-5xl font-bold">{baseLabel}</span>
              <span className="text-xl text-slate-400">/ month</span>
            </div>
            <p className="text-slate-300 mb-6">
              + <strong className="text-orange-400">{usagePct}% of your Amazon ad spend</strong>, billed monthly.
            </p>

            <ul className="space-y-2.5 mb-7">
              {[
                "Every feature in the platform — no tiers, no upsells",
                `${pricing.asinLimit} ASINs included per company (${formatCents(pricing.asinOverageCents)}/month per extra ASIN)`,
                "Unlimited users, keywords, campaigns",
                "AI recommendations & one-click actions",
                "Real Amazon Ads API sync (Sponsored Products, Brands, Display)",
                "Full Help Center + AI assistant",
                "Automation rules, negative keyword/product targeting",
                `${pricing.trialDays}-day free trial — no credit card required`,
                "Cancel anytime from the Billing page",
              ].map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-slate-300">
                  <CheckCircle size={14} className="text-green-400 flex-shrink-0 mt-0.5" />
                  {f}
                </li>
              ))}
            </ul>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-7">
              <div className="bg-slate-800 rounded-lg p-3 text-center">
                <p className="text-xs text-slate-400">Monthly base</p>
                <p className="text-lg font-bold text-white">{baseLabel}</p>
              </div>
              <div className="bg-slate-800 rounded-lg p-3 text-center">
                <p className="text-xs text-slate-400">Usage fee</p>
                <p className="text-lg font-bold text-orange-400">{usagePct}%</p>
              </div>
              <div className="bg-slate-800 rounded-lg p-3 text-center">
                <p className="text-xs text-slate-400">ASINs included</p>
                <p className="text-lg font-bold text-white">{pricing.asinLimit}</p>
              </div>
              <div className="bg-slate-800 rounded-lg p-3 text-center">
                <p className="text-xs text-slate-400">Free trial</p>
                <p className="text-lg font-bold text-green-400">{pricing.trialDays}d</p>
              </div>
            </div>

            <Link
              to="/signup"
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-3 rounded-xl"
            >
              Start {pricing.trialDays}-day free trial <ArrowRight size={14} />
            </Link>

            <p className="text-center text-xs text-slate-500 mt-4">
              Example: one Amazon account, {pricing.asinLimit} ASINs, $5,000/month ad spend →
              {" "}{baseLabel} + {formatCents(exampleUsageCents)} ={" "}
              <strong className="text-slate-300">{formatCents(exampleTotalCents)}</strong> monthly.
            </p>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-slate-400">
              Multiple seller accounts? Each company is priced independently.
              <Link to="/signup" className="text-orange-400 hover:underline ml-1">Contact us</Link> for 5+ seats.
            </p>
          </div>
        </div>
      </section>

      {/* Security */}
      <section className="bg-slate-900/50 border-y border-slate-800">
        <div className="max-w-4xl mx-auto px-6 py-16 text-center">
          <ShieldCheck size={40} className="text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-3">Built on Amazon's security standards</h2>
          <p className="text-slate-300 mb-6 max-w-2xl mx-auto leading-relaxed">
            OAuth-only authorization. Tokens encrypted at rest with AES-256 via AWS KMS.
            Zero buyer PII ever touches our systems. Full audit log. Revoke anytime.
          </p>
          <div className="flex flex-wrap justify-center gap-5 text-sm text-slate-400">
            {["TLS 1.2+", "AES-256 at rest", "Zero buyer PII", "GDPR-ready", "CCPA-ready"].map((t) => (
              <span key={t} className="flex items-center gap-1.5">
                <CheckCircle size={13} className="text-green-500" /> {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to stop overpaying Amazon?</h2>
        <p className="text-slate-400 mb-7">Sign in and explore the platform in demo mode. No credit card. No Amazon credentials required to start.</p>
        <Link to="/login" className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 px-6 py-3 rounded-xl font-semibold">
          Sign in to Vikingo Brain™ <ArrowRight size={14} />
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <VikingShip size={32} />
            <div>
              <p className="text-sm font-bold">Vikingo Ads Brain™</p>
              <p className="text-xs text-slate-500">Amazon Ads Manager · Sailing toward sales</p>
            </div>
          </div>
          <div className="flex gap-5 text-sm text-slate-400">
            <Link to="/privacy" className="hover:text-white">Privacy</Link>
            <Link to="/terms" className="hover:text-white">Terms</Link>
            <Link to="/login" className="hover:text-white">Sign in</Link>
            <a href="mailto:support@vikingo-ads.example" className="hover:text-white">Contact</a>
          </div>
          <p className="text-xs text-slate-500">© {new Date().getFullYear()} Vikingo Ads Brain</p>
        </div>
      </footer>
    </div>
  );
}
