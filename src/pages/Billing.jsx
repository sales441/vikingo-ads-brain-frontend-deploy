import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  CreditCard, DollarSign, TrendingUp, Calendar, CheckCircle, AlertTriangle,
  RefreshCw, ExternalLink, Building2, Info, Download, Zap,
} from "lucide-react";
import { useCompanies } from "../context/CompaniesContext";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function authHeader() {
  const t = typeof localStorage !== "undefined" ? localStorage.getItem("vab_token") : null;
  return t ? { Authorization: `Bearer ${t}` } : {};
}

function formatUSD(cents) {
  return `$${(Number(cents) / 100).toLocaleString("en-US", { minimumFractionDigits: 2 })}`;
}

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

const STATUS_COLORS = {
  trialing:   "bg-blue-100 text-blue-700 border-blue-200",
  active:     "bg-green-100 text-green-700 border-green-200",
  past_due:   "bg-red-100 text-red-700 border-red-200",
  canceled:   "bg-gray-100 text-gray-500 border-gray-200",
  incomplete: "bg-orange-100 text-orange-700 border-orange-200",
};

export default function Billing() {
  const { selectedCompany } = useCompanies();
  const [params] = useSearchParams();
  const companyId = selectedCompany?.id;

  const [data, setData] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [action, setAction] = useState(null); // "checkout" | "portal"

  useEffect(() => {
    if (!companyId) return;
    setLoading(true);
    setError(null);
    Promise.all([
      fetch(`${BASE_URL}/billing/${companyId}`, { headers: authHeader() }).then((r) => r.json()),
      fetch(`${BASE_URL}/billing/${companyId}/invoices`, { headers: authHeader() }).then((r) => r.json()),
    ])
      .then(([billing, inv]) => {
        setData(billing);
        setInvoices(inv.invoices || []);
      })
      .catch(() => {
        // Graceful demo fallback when the backend isn't reachable
        setData({
          subscription: {
            companyId,
            status: "trialing",
            baseCents: 29900,
            usagePctBps: 200,
            currency: "USD",
            trialEndsAt: new Date(Date.now() + 14 * 86400_000).toISOString(),
            currentPeriodStart: new Date().toISOString(),
            currentPeriodEnd: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString(),
          },
          trialDaysLeft: 14,
          upcomingInvoice: {
            periodStart: new Date().toISOString(),
            periodEnd: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString(),
            baseCents: 29900,
            usageSpendCents: 0,
            usageFeeCents: 0,
            totalCents: 29900,
            currency: "USD",
          },
          pricing: { baseCents: 29900, usagePctBps: 200, trialDays: 14 },
        });
        setInvoices([]);
      })
      .finally(() => setLoading(false));
  }, [companyId, params.get("checkout")]);

  const startCheckout = async () => {
    setAction("checkout");
    setError(null);
    try {
      const res = await fetch(`${BASE_URL}/billing/${companyId}/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeader() },
      });
      const json = await res.json();
      if (json.url) window.location.assign(json.url);
      else throw new Error(json.error || "Could not start checkout.");
    } catch (e) { setError(e.message); setAction(null); }
  };

  const openPortal = async () => {
    setAction("portal");
    setError(null);
    try {
      const res = await fetch(`${BASE_URL}/billing/${companyId}/portal`, { headers: authHeader() });
      const json = await res.json();
      if (json.url) window.location.assign(json.url);
      else throw new Error(json.error || "Could not open portal.");
    } catch (e) { setError(e.message); setAction(null); }
  };

  if (!companyId) {
    return (
      <div className="max-w-2xl mx-auto bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-sm text-yellow-800">
        <AlertTriangle className="inline mr-2" size={16} />
        Select a company from the top bar to view its billing.
      </div>
    );
  }

  if (loading || !data) {
    return (
      <div className="flex items-center gap-2 text-gray-500">
        <RefreshCw size={14} className="animate-spin" /> Loading billing…
      </div>
    );
  }

  const s = data.subscription;
  const inv = data.upcomingInvoice;
  const pricing = data.pricing;
  const usagePct = (pricing.usagePctBps / 100).toFixed(1);

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
          <CreditCard size={20} className="text-orange-600" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Billing — {selectedCompany.name}</h1>
          <p className="text-sm text-gray-500">
            {formatUSD(pricing.baseCents)} / month per company + {usagePct}% of Amazon ad spend
          </p>
        </div>
      </div>

      {/* Status / trial banner */}
      {s.status === "trialing" && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
          <Info size={18} className="text-blue-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-blue-800">
              You have {data.trialDaysLeft} day{data.trialDaysLeft === 1 ? "" : "s"} of free trial left
            </p>
            <p className="text-xs text-blue-700 mt-0.5">
              Your first invoice of {formatUSD(inv.totalCents)} will be charged on{" "}
              <strong>{formatDate(s.trialEndsAt)}</strong>.
              Add a payment method to keep your campaigns syncing after the trial.
            </p>
          </div>
          <button
            onClick={startCheckout}
            disabled={action === "checkout"}
            className="flex items-center gap-1.5 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-xl disabled:opacity-50"
          >
            {action === "checkout" ? <RefreshCw size={14} className="animate-spin" /> : <Zap size={14} />}
            Add payment method
          </button>
        </div>
      )}

      {s.status === "past_due" && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle size={18} className="text-red-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-red-800">Payment failed</p>
            <p className="text-xs text-red-700 mt-0.5">
              We couldn't charge your card for the current period. Update your payment
              method to restore full access.
            </p>
          </div>
          <button onClick={openPortal} className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-xl">
            Update payment method
          </button>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      {/* Plan card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Current plan */}
        <div className="lg:col-span-1 bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Plan</p>
            <span className={`text-xs px-2 py-0.5 rounded-full font-bold border ${STATUS_COLORS[s.status] || STATUS_COLORS.active}`}>
              {s.status.toUpperCase()}
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{formatUSD(s.baseCents)} <span className="text-sm font-normal text-gray-500">/ month</span></p>
          <p className="text-xs text-gray-500">+ {usagePct}% of ad spend, billed monthly</p>
          <div className="border-t border-gray-100 pt-3 text-xs text-gray-600 space-y-1.5">
            <div className="flex justify-between"><span>Current period starts</span><span className="font-medium">{formatDate(s.currentPeriodStart)}</span></div>
            <div className="flex justify-between"><span>Current period ends</span><span className="font-medium">{formatDate(s.currentPeriodEnd)}</span></div>
          </div>
          <button
            onClick={openPortal}
            disabled={action === "portal"}
            className="w-full flex items-center justify-center gap-1.5 px-4 py-2 border border-gray-300 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
          >
            {action === "portal" ? <RefreshCw size={13} className="animate-spin" /> : <ExternalLink size={13} />}
            Manage payment method
          </button>
        </div>

        {/* Upcoming invoice breakdown */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Upcoming invoice</p>
            <p className="text-xs text-gray-400">
              {formatDate(inv.periodStart)} — {formatDate(inv.periodEnd)}
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                  <Building2 size={14} className="text-blue-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">Per-company subscription</p>
                  <p className="text-xs text-gray-500">Flat monthly fee</p>
                </div>
              </div>
              <p className="text-sm font-semibold text-gray-900">{formatUSD(inv.baseCents)}</p>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center">
                  <TrendingUp size={14} className="text-orange-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">Usage fee ({usagePct}%)</p>
                  <p className="text-xs text-gray-500">
                    {usagePct}% × {formatUSD(inv.usageSpendCents)} ad spend this period
                  </p>
                </div>
              </div>
              <p className="text-sm font-semibold text-gray-900">{formatUSD(inv.usageFeeCents)}</p>
            </div>

            <div className="flex items-center justify-between pt-2">
              <p className="text-sm font-bold text-gray-900">Estimated total</p>
              <p className="text-2xl font-bold text-orange-600">{formatUSD(inv.totalCents)}</p>
            </div>
          </div>

          <div className="mt-4 bg-gray-50 border border-gray-200 rounded-lg p-3 text-xs text-gray-600 flex items-start gap-2">
            <Info size={12} className="text-gray-400 mt-0.5 flex-shrink-0" />
            <span>
              The usage fee updates as your ad spend grows during the period.
              The final invoice is generated on <strong>{formatDate(s.currentPeriodEnd)}</strong>.
            </span>
          </div>
        </div>
      </div>

      {/* Invoices history */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-700">Invoice history</h2>
          <span className="text-xs text-gray-500">{invoices.length} invoice(s)</span>
        </div>
        {invoices.length === 0 ? (
          <div className="px-5 py-10 text-center">
            <Calendar size={28} className="text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-500">No invoices yet.</p>
            <p className="text-xs text-gray-400 mt-1">Your first invoice will appear here after the trial ends.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-2 text-xs text-gray-500 font-medium">Date</th>
                <th className="text-left px-4 py-2 text-xs text-gray-500 font-medium">Period</th>
                <th className="text-right px-4 py-2 text-xs text-gray-500 font-medium">Base</th>
                <th className="text-right px-4 py-2 text-xs text-gray-500 font-medium">Usage</th>
                <th className="text-right px-4 py-2 text-xs text-gray-500 font-medium">Total</th>
                <th className="text-left px-4 py-2 text-xs text-gray-500 font-medium">Status</th>
                <th className="px-4 py-2 text-xs text-gray-500 font-medium">PDF</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {invoices.map((i) => (
                <tr key={i.id}>
                  <td className="px-4 py-2 text-gray-700">{formatDate(i.createdAt)}</td>
                  <td className="px-4 py-2 text-gray-500 text-xs">
                    {formatDate(i.periodStart)} → {formatDate(i.periodEnd)}
                  </td>
                  <td className="px-4 py-2 text-right text-gray-700">{formatUSD(i.baseCents)}</td>
                  <td className="px-4 py-2 text-right text-gray-700">{formatUSD(i.usageFeeCents)}</td>
                  <td className="px-4 py-2 text-right font-semibold text-gray-900">{formatUSD(i.totalCents)}</td>
                  <td className="px-4 py-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      i.status === "paid" ? "bg-green-100 text-green-700" :
                      i.status === "open" ? "bg-orange-100 text-orange-700" :
                      "bg-gray-100 text-gray-500"
                    }`}>
                      {i.status}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    {i.hostedInvoiceUrl && (
                      <a href={i.hostedInvoiceUrl} target="_blank" rel="noreferrer" className="text-orange-600 hover:underline text-xs flex items-center gap-1">
                        <Download size={11} /> PDF
                      </a>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pricing FAQ */}
      <div className="bg-slate-900 text-white rounded-xl p-5">
        <p className="text-sm font-semibold mb-3">Pricing details</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <p className="text-orange-400 font-semibold mb-1">Per company</p>
            <p className="text-slate-300">
              Every registered company on the platform incurs a flat {formatUSD(pricing.baseCents)} / month,
              regardless of how many users, products or campaigns it has.
            </p>
          </div>
          <div>
            <p className="text-orange-400 font-semibold mb-1">Usage fee</p>
            <p className="text-slate-300">
              An additional {usagePct}% is charged on every dollar you spend on Amazon Ads.
              This fee is computed automatically from the ad spend synced via the Amazon Ads API.
            </p>
          </div>
          <div>
            <p className="text-orange-400 font-semibold mb-1">Free trial</p>
            <p className="text-slate-300">
              {pricing.trialDays} days free. Cancel anytime before the trial ends without being charged.
              See <Link to="/terms" className="text-orange-400 underline">Terms of Service</Link>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
