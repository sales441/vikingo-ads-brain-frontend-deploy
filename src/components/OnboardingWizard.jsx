import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Zap, ArrowRight, Check, Building2, Package, Megaphone, BrainCircuit,
  X, Rocket,
} from "lucide-react";
import { useCompanies } from "../context/CompaniesContext";
import { useProducts } from "../context/ProductsContext";
import { useAuth } from "../context/AuthContext";

const STORAGE_KEY = "vab_onboarding_done";

const STEPS = [
  {
    id: "welcome",
    icon: Rocket,
    title: "Welcome aboard, Viking",
    body: "In 3 quick steps you'll have a company connected, your first product registered, and the AI analyzing your Amazon Ads account. Ready?",
    cta: "Let's go",
  },
  {
    id: "company",
    icon: Building2,
    title: "Step 1 · Register your company",
    body: "Every seller account in Vikingo is represented by a Company. You can add one now or use the Demo Company to explore.",
    checker: ({ companies }) => companies.length > 0,
    actionLabel: "Go to Companies",
    actionRoute: "/companies",
    skipLabel: "I'll do this later",
  },
  {
    id: "connect",
    icon: Zap,
    title: "Step 2 · Connect Amazon Ads",
    body: "Authorize Vikingo to read and manage your Amazon campaigns. OAuth-based, one click. Tokens are encrypted at rest.",
    checker: ({ companies }) => companies.some((c) => c.refreshToken),
    actionLabel: "Connect Amazon",
    actionRoute: "/companies",
    skipLabel: "Explore in demo mode",
  },
  {
    id: "product",
    icon: Package,
    title: "Step 3 · Register your first product",
    body: "Paste an ASIN — the AI pulls competitors, suggested keywords and a full FBA/FBM profit breakdown. Every other tool uses this data.",
    checker: ({ products }) => products.length > 0,
    actionLabel: "Register Product",
    actionRoute: "/products",
    skipLabel: "Skip for now",
  },
  {
    id: "done",
    icon: BrainCircuit,
    title: "You're ready to sail",
    body: "The AI is now watching your account. Visit Campaigns to see live data, or open the Help Center anytime by clicking the ? icon in the header.",
    cta: "Go to Dashboard",
    routeOnFinish: "/dashboard",
  },
];

export default function OnboardingWizard() {
  const { user } = useAuth();
  const { companies } = useCompanies();
  const { products } = useProducts();
  const navigate = useNavigate();

  const hasDismissed = typeof localStorage !== "undefined" && localStorage.getItem(STORAGE_KEY) === "1";

  // Only show on first login (no dismissal flag yet and user is authenticated).
  const [open, setOpen] = useState(() => !hasDismissed && Boolean(user));
  const [stepIdx, setStepIdx] = useState(0);

  // Re-show if user changes (fresh signup)
  useEffect(() => {
    if (user && !hasDismissed) setOpen(true);
  }, [user, hasDismissed]);

  if (!open) return null;

  const step = STEPS[stepIdx];
  const Icon = step.icon;
  const ctx = { companies, products };
  const doneHere = step.checker ? step.checker(ctx) : true;

  const close = () => {
    localStorage.setItem(STORAGE_KEY, "1");
    setOpen(false);
  };
  const next = () => {
    if (stepIdx < STEPS.length - 1) setStepIdx((i) => i + 1);
    else {
      if (step.routeOnFinish) navigate(step.routeOnFinish);
      close();
    }
  };
  const act = () => {
    if (step.actionRoute) {
      navigate(step.actionRoute);
      close();
    } else next();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-6 py-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center flex-shrink-0">
            <Icon size={18} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-bold">Getting started</p>
            <p className="text-slate-400 text-xs">Step {Math.min(stepIdx + 1, STEPS.length)} of {STEPS.length}</p>
          </div>
          <button onClick={close} className="text-slate-400 hover:text-white" title="Close">
            <X size={16} />
          </button>
        </div>

        {/* Progress dots */}
        <div className="flex gap-1.5 px-6 pt-4">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-colors ${
                i < stepIdx ? "bg-orange-500" : i === stepIdx ? "bg-orange-400" : "bg-gray-200"
              }`}
            />
          ))}
        </div>

        {/* Body */}
        <div className="px-6 py-6">
          <h2 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h2>
          <p className="text-sm text-gray-600 leading-relaxed mb-5">{step.body}</p>

          {step.checker && (
            <div className={`flex items-center gap-2 mb-4 px-3 py-2 rounded-lg border text-xs font-medium ${
              doneHere ? "bg-green-50 border-green-200 text-green-700" : "bg-gray-50 border-gray-200 text-gray-500"
            }`}>
              {doneHere ? <Check size={12} /> : <span className="w-3 h-3 rounded-full border border-gray-400" />}
              {doneHere ? "Done" : "Not yet completed"}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-2">
            {step.actionRoute && !doneHere && (
              <button
                onClick={act}
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-2.5 rounded-xl text-sm"
              >
                {step.actionLabel} <ArrowRight size={14} />
              </button>
            )}
            {step.cta && (
              <button
                onClick={next}
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-2.5 rounded-xl text-sm"
              >
                {step.cta} <ArrowRight size={14} />
              </button>
            )}
            {step.skipLabel && (
              <button
                onClick={next}
                className="flex-1 py-2.5 border border-gray-300 text-gray-600 hover:bg-gray-50 rounded-xl text-sm font-medium"
              >
                {step.skipLabel}
              </button>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
          <button onClick={close} className="text-xs text-gray-500 hover:text-gray-700">
            Don't show again
          </button>
          {stepIdx > 0 && stepIdx < STEPS.length - 1 && (
            <button
              onClick={() => setStepIdx((i) => i - 1)}
              className="text-xs text-orange-600 hover:underline"
            >
              ← Previous
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
