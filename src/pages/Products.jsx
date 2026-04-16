import React, { useState } from "react";
import {
  Package, Plus, Trash2, Edit2, RefreshCw, BrainCircuit, Star,
  TrendingUp, DollarSign, AlertTriangle, CheckCircle, Search,
  BarChart2, Target, ChevronDown, ChevronUp, Zap, ExternalLink,
} from "lucide-react";
import { useProducts } from "../context/ProductsContext";

const CATEGORIES = [
  "Home & Kitchen", "Electronics", "Tools", "Beauty", "Health",
  "Sports", "Toys", "Pet", "Grocery", "Clothing & Accessories",
  "Garden", "Automotive", "Office", "Other",
];

const EMPTY = {
  asin: "", name: "", category: "", price: "", cost: "", imageUrl: "", notes: "",
  fulfillmentType: "FBA", // FBA (Amazon ships) or FBM (you ship)
  // FBA-specific costs
  inboundShipping: "",    // shipping to Amazon warehouse, per unit
  fbaSize: "medium",      // small | medium | large | xlarge
  storageMonthly: "",     // monthly storage per unit
  // FBM-specific costs
  outboundShipping: "",   // shipping to customer, per unit
  packaging: "",          // packaging material, per unit
  // Common
  otherCosts: "",         // any other external cost per unit
};

// Amazon US FBA fulfillment fee by size tier (approximate avg)
const FBA_FEES = { small: 3.22, medium: 5.40, large: 8.60, xlarge: 15.20 };

// Referral fee % by category (Amazon US). Defaults to 15% for uncategorized.
const REFERRAL_PCT = {
  "Electronics": 0.08,
  "Tools": 0.15,
  "Home & Kitchen": 0.15,
  "Beauty": 0.15,
  "Health": 0.15,
  "Sports": 0.15,
  "Toys": 0.15,
  "Pet": 0.15,
  "Grocery": 0.15,
  "Clothing & Accessories": 0.17,
  "Garden": 0.15,
  "Automotive": 0.12,
  "Office": 0.15,
  "Other": 0.15,
};

function ScoreBadge({ score }) {
  const color = score >= 80 ? "green" : score >= 60 ? "orange" : "red";
  return (
    <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-${color}-100 text-${color}-700 border border-${color}-200`}>
      <BrainCircuit size={10} /> AI Score {score}
    </div>
  );
}

// Estimate net profit per unit on Amazon.
// Fees differ by fulfillment type:
//   FBA → referral + FBA fee + storage (+ inbound shipping you pay to send to Amazon)
//   FBM → referral only (but you pay shipping to customer + packaging yourself)
// The AI reads all applicable fees based on the fulfillment type the seller uses.
// Returns null if price or cost missing.
function computeProfitability(product) {
  const price = Number(product.price);
  const cost = Number(product.cost);
  if (!price || !cost) return null;

  const fulfillment = product.fulfillmentType || "FBA";
  const referralPct = REFERRAL_PCT[product.category] ?? 0.15;
  const referralFee = Math.max(price * referralPct, 0.30);
  const otherCosts = Number(product.otherCosts) || 0;

  let fbaFee = 0, storage = 0, inbound = 0;
  let outbound = 0, packaging = 0;
  let totalAmazonFees = referralFee;
  let totalExternalCosts = cost + otherCosts;

  if (fulfillment === "FBA") {
    fbaFee = FBA_FEES[product.fbaSize] ?? FBA_FEES.medium;
    storage = Number(product.storageMonthly) || 0.40;
    inbound = Number(product.inboundShipping) || 0;
    totalAmazonFees = referralFee + fbaFee + storage;
    totalExternalCosts += inbound;
  } else {
    // FBM: seller handles shipping and packaging
    outbound = Number(product.outboundShipping) || 0;
    packaging = Number(product.packaging) || 0;
    totalExternalCosts += outbound + packaging;
  }

  const netProfit = price - totalExternalCosts - totalAmazonFees;
  const margin = (netProfit / price) * 100;
  const roi = totalExternalCosts > 0 ? (netProfit / totalExternalCosts) * 100 : 0;

  return {
    fulfillment,
    netProfit, margin, roi,
    referralFee, referralPct,
    fbaFee, storage, inbound,
    outbound, packaging,
    otherCosts,
    totalAmazonFees, totalExternalCosts,
  };
}

function ProfitBadge({ product }) {
  const p = computeProfitability(product);
  if (!p) {
    return (
      <div className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500 border border-gray-200">
        <AlertTriangle size={10} /> Add price & cost to see profit
      </div>
    );
  }
  const profitable = p.netProfit > 0;
  const color = profitable ? (p.margin >= 25 ? "green" : "orange") : "red";
  return (
    <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-${color}-100 text-${color}-700 border border-${color}-200`}>
      <DollarSign size={10} />
      {profitable ? `+$${p.netProfit.toFixed(2)} profit` : `-$${Math.abs(p.netProfit).toFixed(2)} LOSS`}
      <span className="opacity-70">({p.margin.toFixed(0)}%)</span>
    </div>
  );
}

function ProductCard({ product, onEdit, onDelete, onRefresh }) {
  const [expanded, setExpanded] = useState(false);
  const a = product.competitorAnalysis || {};
  const score = a.opportunityScore ?? 0;
  const saturationColor = { low: "text-green-600", medium: "text-orange-500", high: "text-red-500" };

  return (
    <div className="bg-white border-2 border-gray-200 rounded-xl shadow-sm overflow-hidden">
      {/* Header row */}
      <div className="p-4 flex items-start gap-3 flex-wrap">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
          {product.asin?.slice(-4) || "----"}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-gray-800 text-sm">{product.name}</h3>
            <span className="text-xs bg-blue-50 border border-blue-200 text-blue-700 px-2 py-0.5 rounded-full font-mono">{product.asin}</span>
            <ScoreBadge score={score} />
            <ProfitBadge product={product} />
          </div>
          <div className="flex items-center gap-3 mt-1 flex-wrap">
            <span className="text-xs text-gray-500">{product.category}</span>
            {product.price && <span className="text-xs text-gray-700 font-semibold">${Number(product.price).toFixed(2)}</span>}
            {product.cost && <span className="text-xs text-gray-400">cost ${Number(product.cost).toFixed(2)}</span>}
            <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold border ${product.fulfillmentType === "FBA" ? "bg-blue-50 text-blue-700 border-blue-200" : "bg-purple-50 text-purple-700 border-purple-200"}`}>
              {product.fulfillmentType || "FBA"}
            </span>
            <span className={`text-xs font-medium ${saturationColor[a.marketSaturation]}`}>
              Saturation: {a.marketSaturation}
            </span>
          </div>
        </div>
        <div className="flex gap-1">
          <button onClick={() => onRefresh(product.id)} title="Refresh AI analysis" className="p-1.5 text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded-lg">
            <RefreshCw size={14} />
          </button>
          <button onClick={() => onEdit(product)} className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg">
            <Edit2 size={14} />
          </button>
          <button onClick={() => onDelete(product.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg">
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* AI insights preview */}
      {a.aiInsights?.length > 0 && (
        <div className="px-4 pb-3 border-t border-gray-100 pt-3">
          <div className="flex items-center gap-2 mb-2">
            <BrainCircuit size={13} className="text-orange-500" />
            <span className="text-xs font-semibold text-gray-700">AI Insights</span>
          </div>
          <ul className="space-y-1">
            {a.aiInsights.slice(0, expanded ? 10 : 1).map((ins, i) => (
              <li key={i} className="text-xs text-gray-600 flex items-start gap-1.5">
                <span className="text-orange-500 flex-shrink-0">→</span>{ins}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Expand toggle */}
      <button
        onClick={() => setExpanded((s) => !s)}
        className="w-full flex items-center justify-center gap-1 border-t border-gray-100 py-2 text-xs font-medium text-orange-600 hover:bg-orange-50 transition-colors"
      >
        {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
        {expanded ? "Hide full analysis" : "View full AI analysis"}
      </button>

      {/* Expanded analysis */}
      {expanded && (
        <div className="border-t border-gray-100 p-4 bg-gray-50 space-y-4">
          {/* Profitability breakdown */}
          {(() => {
            const p = computeProfitability(product);
            if (!p) {
              return (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-xs text-yellow-800 flex items-start gap-2">
                  <AlertTriangle size={13} className="flex-shrink-0 mt-0.5" />
                  <span>Add both selling price and product cost to see if this Amazon sale is profitable.</span>
                </div>
              );
            }
            const profitable = p.netProfit > 0;
            return (
              <div className={`border rounded-lg p-3 ${profitable ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
                <div className="flex items-center gap-2 mb-3">
                  <DollarSign size={14} className={profitable ? "text-green-600" : "text-red-600"} />
                  <span className="text-xs font-semibold text-gray-800">Profitability on Amazon US — full fee breakdown</span>
                  {!profitable && (
                    <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-full font-bold">LOSS</span>
                  )}
                  <span className="ml-auto text-xs bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                    <BrainCircuit size={10} /> AI reading all Amazon fees
                  </span>
                </div>

                {/* Two columns: External costs | Amazon fees */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                  {/* External costs */}
                  <div className="bg-white rounded-lg p-3 border border-gray-200">
                    <p className="text-xs font-semibold text-gray-600 mb-2">
                      Your costs (external) — {p.fulfillment === "FBA" ? "FBA" : "FBM"}
                    </p>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between"><span className="text-gray-500">Product cost</span><span className="font-semibold text-red-600">-${Number(product.cost).toFixed(2)}</span></div>
                      {p.fulfillment === "FBA" ? (
                        <div className="flex justify-between"><span className="text-gray-500">Inbound shipping to Amazon</span><span className="font-semibold text-red-600">-${p.inbound.toFixed(2)}</span></div>
                      ) : (
                        <>
                          <div className="flex justify-between"><span className="text-gray-500">Outbound shipping to customer</span><span className="font-semibold text-red-600">-${p.outbound.toFixed(2)}</span></div>
                          <div className="flex justify-between"><span className="text-gray-500">Packaging</span><span className="font-semibold text-red-600">-${p.packaging.toFixed(2)}</span></div>
                        </>
                      )}
                      <div className="flex justify-between"><span className="text-gray-500">Other costs</span><span className="font-semibold text-red-600">-${p.otherCosts.toFixed(2)}</span></div>
                      <div className="flex justify-between border-t border-gray-100 pt-1 mt-1"><span className="font-semibold text-gray-700">Subtotal external</span><span className="font-bold text-red-700">-${p.totalExternalCosts.toFixed(2)}</span></div>
                    </div>
                  </div>

                  {/* Amazon fees */}
                  <div className="bg-white rounded-lg p-3 border border-gray-200">
                    <p className="text-xs font-semibold text-gray-600 mb-2">Amazon fees (read by AI)</p>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between"><span className="text-gray-500">Referral fee ({(p.referralPct * 100).toFixed(0)}%)</span><span className="font-semibold text-red-500">-${p.referralFee.toFixed(2)}</span></div>
                      {p.fulfillment === "FBA" ? (
                        <>
                          <div className="flex justify-between"><span className="text-gray-500">FBA fulfillment ({product.fbaSize})</span><span className="font-semibold text-red-500">-${p.fbaFee.toFixed(2)}</span></div>
                          <div className="flex justify-between"><span className="text-gray-500">Storage (monthly)</span><span className="font-semibold text-red-500">-${p.storage.toFixed(2)}</span></div>
                        </>
                      ) : (
                        <div className="flex justify-between"><span className="text-gray-400 italic">No FBA or storage fee (FBM)</span><span className="text-gray-400">—</span></div>
                      )}
                      <div className="flex justify-between border-t border-gray-100 pt-1 mt-1"><span className="font-semibold text-gray-700">Subtotal Amazon</span><span className="font-bold text-red-600">-${p.totalAmazonFees.toFixed(2)}</span></div>
                    </div>
                  </div>
                </div>

                {/* Summary row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div className="bg-white rounded-lg p-2 text-center border border-gray-200">
                    <p className="text-xs text-gray-500">Selling Price</p>
                    <p className="text-sm font-bold text-gray-800">${Number(product.price).toFixed(2)}</p>
                  </div>
                  <div className="bg-white rounded-lg p-2 text-center border border-gray-200">
                    <p className="text-xs text-gray-500">Total Costs</p>
                    <p className="text-sm font-bold text-red-600">-${(p.totalAmazonFees + p.totalExternalCosts).toFixed(2)}</p>
                  </div>
                  <div className={`rounded-lg p-2 text-center border-2 ${profitable ? "bg-green-100 border-green-300" : "bg-red-100 border-red-300"}`}>
                    <p className="text-xs text-gray-600">Net Profit</p>
                    <p className={`text-sm font-bold ${profitable ? "text-green-700" : "text-red-700"}`}>{profitable ? "+" : ""}${p.netProfit.toFixed(2)}</p>
                  </div>
                  <div className="bg-white rounded-lg p-2 text-center border border-gray-200">
                    <p className="text-xs text-gray-500">Margin / ROI</p>
                    <p className={`text-sm font-bold ${p.margin >= 15 ? "text-green-700" : "text-orange-600"}`}>{p.margin.toFixed(1)}% · {p.roi.toFixed(0)}%</p>
                  </div>
                </div>

                {!profitable && (
                  <p className="text-xs text-red-700 mt-3 flex items-start gap-1">
                    <BrainCircuit size={11} className="flex-shrink-0 mt-0.5" />
                    <span>
                      <strong>AI advice:</strong> you're losing ${Math.abs(p.netProfit).toFixed(2)} per unit. Break-even price is approximately ${(p.totalExternalCosts + p.fbaFee + p.storage) / (1 - p.referralPct) > 0 ? ((p.totalExternalCosts + p.fbaFee + p.storage) / (1 - p.referralPct)).toFixed(2) : "—"}. Raise the price or reduce product/inbound cost.
                    </span>
                  </p>
                )}
                {profitable && p.margin < 15 && (
                  <p className="text-xs text-orange-700 mt-3 flex items-start gap-1">
                    <BrainCircuit size={11} className="flex-shrink-0 mt-0.5" />
                    <span>
                      <strong>AI advice:</strong> margin is tight ({p.margin.toFixed(1)}%). Keep ad spend below ${(p.netProfit * 0.5).toFixed(2)}/unit to stay profitable.
                    </span>
                  </p>
                )}
              </div>
            );
          })()}

          {/* Market stats */}
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-white rounded-lg p-2.5 text-center border border-gray-200">
              <p className="text-xs text-gray-500">Average Price</p>
              <p className="text-base font-bold text-gray-800">${a.avgPrice}</p>
            </div>
            <div className="bg-white rounded-lg p-2.5 text-center border border-gray-200">
              <p className="text-xs text-gray-500">Price Range</p>
              <p className="text-sm font-bold text-gray-800">${a.priceRange?.min}–${a.priceRange?.max}</p>
            </div>
            <div className="bg-white rounded-lg p-2.5 text-center border border-gray-200">
              <p className="text-xs text-gray-500">Opportunity</p>
              <p className={`text-base font-bold ${score >= 80 ? "text-green-600" : score >= 60 ? "text-orange-600" : "text-red-500"}`}>{score}/100</p>
            </div>
          </div>

          {/* Top competitors */}
          {a.topCompetitors?.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Target size={13} className="text-blue-500" />
                <span className="text-xs font-semibold text-gray-700">Top Competitors</span>
              </div>
              <div className="space-y-1.5">
                {a.topCompetitors.map((c, i) => (
                  <div key={i} className="flex items-center gap-3 bg-white rounded-lg p-2 border border-gray-200">
                    <span className="text-xs font-bold text-gray-500 w-4">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-800 truncate">{c.name}</p>
                      <p className="text-xs text-gray-400 font-mono">{c.asin}</p>
                    </div>
                    <span className="text-xs font-semibold text-gray-700">${c.price}</span>
                    <span className="flex items-center gap-0.5 text-xs text-yellow-600">
                      <Star size={10} className="fill-yellow-400" />{c.rating}
                    </span>
                    <span className="text-xs text-gray-400">#{c.bsr}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Suggested keywords */}
          {a.suggestedKeywords?.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Search size={13} className="text-purple-500" />
                <span className="text-xs font-semibold text-gray-700">AI-Suggested Keywords</span>
              </div>
              <div className="overflow-x-auto bg-white rounded-lg border border-gray-200">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-3 py-2 text-left text-gray-500 font-medium">Keyword</th>
                      <th className="px-3 py-2 text-right text-gray-500 font-medium">Volume</th>
                      <th className="px-3 py-2 text-left text-gray-500 font-medium">Competition</th>
                      <th className="px-3 py-2 text-right text-gray-500 font-medium">Suggested Bid</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {a.suggestedKeywords.map((k, i) => (
                      <tr key={i} className="hover:bg-gray-50">
                        <td className="px-3 py-1.5 font-medium text-gray-700">{k.keyword}</td>
                        <td className="px-3 py-1.5 text-right text-gray-600">{k.volume.toLocaleString("en-US")}</td>
                        <td className="px-3 py-1.5">
                          <span className={`px-1.5 py-0.5 rounded-full text-xs font-medium ${
                            k.competition === "high" ? "bg-red-100 text-red-700" :
                            k.competition === "medium" ? "bg-yellow-100 text-yellow-700" :
                            "bg-green-100 text-green-700"
                          }`}>{k.competition}</span>
                        </td>
                        <td className="px-3 py-1.5 text-right font-semibold text-orange-600">${k.suggestedBid.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <p className="text-xs text-gray-400 flex items-center gap-1">
            <CheckCircle size={10} className="text-green-500" />
            Analyzed by Vikingo Brain™ {a.analyzedAt ? `• ${new Date(a.analyzedAt).toLocaleString("en-US")}` : ""}
          </p>
        </div>
      )}
    </div>
  );
}

function ProductForm({ initial = EMPTY, onSave, onCancel, loading }) {
  const [form, setForm] = useState(initial);
  const ch = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  const isValid = form.asin.trim().length >= 8 && form.name.trim() && form.category;

  return (
    <div className="bg-white border-2 border-orange-300 rounded-xl p-5 shadow-sm space-y-4">
      <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
        <Package size={18} className="text-orange-500" />
        <h3 className="text-sm font-semibold text-gray-800">
          {initial.asin ? "Edit Product" : "Register New Product"}
        </h3>
        <span className="ml-auto text-xs bg-orange-50 text-orange-700 border border-orange-200 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
          <BrainCircuit size={10} /> AI will analyze on save
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
            ASIN <span className="text-red-400">*</span>
          </label>
          <input
            name="asin"
            value={form.asin}
            onChange={ch}
            placeholder="B0XXXXXXXXX"
            maxLength={10}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
          <p className="text-xs text-gray-400 mt-0.5">10-character Amazon product ID</p>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
            Category <span className="text-red-400">*</span>
          </label>
          <select
            name="category"
            value={form.category}
            onChange={ch}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
          >
            <option value="">Select category...</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
            Product Name <span className="text-red-400">*</span>
          </label>
          <input
            name="name"
            value={form.name}
            onChange={ch}
            placeholder="e.g. 6Qt Stainless Steel Electric Pressure Cooker"
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
            Selling Price ($) <span className="text-orange-500">★</span>
          </label>
          <input
            name="price"
            type="number"
            step="0.01"
            value={form.price}
            onChange={ch}
            placeholder="29.99"
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
          <p className="text-xs text-gray-400 mt-0.5">Your Amazon listing price</p>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
            Product Cost ($) <span className="text-orange-500">★</span>
          </label>
          <input
            name="cost"
            type="number"
            step="0.01"
            value={form.cost}
            onChange={ch}
            placeholder="8.00"
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
          <p className="text-xs text-gray-400 mt-0.5">What you pay your supplier per unit</p>
        </div>
        {/* Fulfillment type selector — fees differ between FBA and FBM */}
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
            Fulfillment Type <span className="text-orange-500">★</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: "FBA", label: "FBA", desc: "Fulfilled by Amazon", tip: "Amazon picks, packs, ships. You pay FBA + storage + inbound." },
              { id: "FBM", label: "FBM", desc: "Fulfilled by Merchant", tip: "You ship directly to the customer. No FBA or storage fees." },
            ].map(({ id, label, desc, tip }) => {
              const active = form.fulfillmentType === id;
              return (
                <button key={id} type="button"
                  onClick={() => setForm((f) => ({ ...f, fulfillmentType: id }))}
                  className={`p-3 rounded-lg border-2 text-left transition-all ${active ? "border-orange-400 bg-orange-50" : "border-gray-200 hover:border-gray-300"}`}>
                  <p className={`text-sm font-bold ${active ? "text-orange-700" : "text-gray-700"}`}>{label}</p>
                  <p className="text-xs text-gray-600 font-medium">{desc}</p>
                  <p className="text-xs text-gray-500 mt-1">{tip}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* FBA-specific fields */}
        {form.fulfillmentType === "FBA" && (
          <>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">FBA Size Tier</label>
              <select name="fbaSize" value={form.fbaSize} onChange={ch}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white">
                <option value="small">Small standard — $3.22</option>
                <option value="medium">Medium standard — $5.40</option>
                <option value="large">Large standard — $8.60</option>
                <option value="xlarge">Oversize — $15.20</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Inbound Shipping ($/unit)</label>
              <input name="inboundShipping" type="number" step="0.01" value={form.inboundShipping} onChange={ch} placeholder="0.75"
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
              <p className="text-xs text-gray-400 mt-0.5">Cost to ship from supplier to Amazon</p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Storage / month ($/unit)</label>
              <input name="storageMonthly" type="number" step="0.01" value={form.storageMonthly} onChange={ch} placeholder="0.40"
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
              <p className="text-xs text-gray-400 mt-0.5">Avg Amazon storage per unit per month</p>
            </div>
          </>
        )}

        {/* FBM-specific fields */}
        {form.fulfillmentType === "FBM" && (
          <>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Outbound Shipping ($/unit)</label>
              <input name="outboundShipping" type="number" step="0.01" value={form.outboundShipping} onChange={ch} placeholder="4.99"
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
              <p className="text-xs text-gray-400 mt-0.5">What you pay to ship to the customer</p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Packaging ($/unit)</label>
              <input name="packaging" type="number" step="0.01" value={form.packaging} onChange={ch} placeholder="0.50"
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
            </div>
          </>
        )}

        {/* Common: other costs */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">Other Costs ($/unit)</label>
          <input name="otherCosts" type="number" step="0.01" value={form.otherCosts} onChange={ch} placeholder="0.00"
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
          <p className="text-xs text-gray-400 mt-0.5">Returns, refunds, misc</p>
        </div>

        {/* Live profit estimate — uses the same full calc as the card */}
        {form.price && form.cost && (() => {
          const p = computeProfitability(form);
          if (!p) return null;
          const profitable = p.netProfit > 0;
          return (
            <div className={`sm:col-span-2 rounded-lg p-3 border ${profitable ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
              <div className="flex items-center gap-2 text-xs flex-wrap">
                <DollarSign size={12} className={profitable ? "text-green-600" : "text-red-600"} />
                <span className="font-semibold text-gray-700">Live profit estimate ({p.fulfillment}):</span>
                <span className={`font-bold ${profitable ? "text-green-700" : "text-red-700"}`}>
                  {profitable ? "+" : ""}${p.netProfit.toFixed(2)} per unit
                </span>
                <span className="text-gray-500">({p.margin.toFixed(1)}% margin · ROI {p.roi.toFixed(0)}%)</span>
                {!profitable && (
                  <span className="ml-auto text-xs bg-red-500 text-white px-2 py-0.5 rounded-full font-bold">LOSS</span>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                AI read: Amazon referral {(p.referralPct * 100).toFixed(0)}% = ${p.referralFee.toFixed(2)}
                {p.fulfillment === "FBA" && ` · FBA $${p.fbaFee.toFixed(2)} · Storage $${p.storage.toFixed(2)}/mo · Inbound $${p.inbound.toFixed(2)}`}
                {p.fulfillment === "FBM" && ` · Outbound shipping $${p.outbound.toFixed(2)} · Packaging $${p.packaging.toFixed(2)}`}
                {p.otherCosts > 0 && ` · Other $${p.otherCosts.toFixed(2)}`}
              </p>
            </div>
          );
        })()}
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">Image URL <span className="text-gray-400 font-normal">(optional)</span></label>
          <input
            name="imageUrl"
            value={form.imageUrl}
            onChange={ch}
            placeholder="https://m.media-amazon.com/images/..."
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">Notes <span className="text-gray-400 font-normal">(optional)</span></label>
          <textarea
            name="notes"
            value={form.notes}
            onChange={ch}
            rows={2}
            placeholder="Key features, variations, supplier, etc."
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
          />
        </div>
      </div>

      <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 text-xs text-orange-800 flex items-start gap-2">
        <BrainCircuit size={14} className="flex-shrink-0 mt-0.5" />
        <span>
          On save, Vikingo Brain™ will analyze competitors for this ASIN, calculate an
          opportunity score, detect the ideal price range, and pre-suggest keywords you can use
          across Ads, Listing and Pricing tools.
        </span>
      </div>

      <div className="flex gap-2">
        <button
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 text-gray-700 text-sm rounded-xl hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={() => isValid && onSave(form)}
          disabled={!isValid || loading}
          className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:from-gray-300 disabled:to-gray-300 text-white text-sm font-semibold rounded-xl transition-colors"
        >
          {loading ? <RefreshCw size={14} className="animate-spin" /> : <BrainCircuit size={14} />}
          {loading ? "Analyzing competition..." : initial.asin ? "Save Changes" : "Register & Analyze"}
        </button>
      </div>
    </div>
  );
}

export default function Products() {
  const { products, addProduct, updateProduct, deleteProduct, refreshAnalysis } = useProducts();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.asin.toLowerCase().includes(search.toLowerCase())
  );

  const avgOpportunity = products.length
    ? Math.round(products.reduce((s, p) => s + (p.competitorAnalysis?.opportunityScore ?? 0), 0) / products.length)
    : 0;
  const highOpp = products.filter((p) => (p.competitorAnalysis?.opportunityScore ?? 0) >= 80).length;

  const handleAdd = async (form) => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900)); // simulate AI work
    await addProduct(form);
    setLoading(false);
    setShowForm(false);
  };

  const handleEdit = async (form) => {
    updateProduct(editing.id, form);
    setEditing(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
            <Package size={20} className="text-orange-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">My Products</h1>
            <p className="text-sm text-gray-500">
              Register products by ASIN and let Vikingo Brain™ analyze the competition for you
            </p>
          </div>
        </div>
        {!showForm && !editing && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-xl transition-colors"
          >
            <Plus size={14} /> Register Product
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Registered Products", value: products.length, color: "text-orange-600", bg: "bg-orange-50 border-orange-200" },
          { label: "High Opportunity (80+)", value: highOpp, color: "text-green-600", bg: "bg-green-50 border-green-200" },
          { label: "Average Score", value: `${avgOpportunity}/100`, color: "text-blue-600", bg: "bg-blue-50 border-blue-200" },
          { label: "Marketplace", value: "🇺🇸 US", color: "text-purple-600", bg: "bg-purple-50 border-purple-200" },
        ].map(({ label, value, color, bg }) => (
          <div key={label} className={`border rounded-xl p-4 text-center ${bg}`}>
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
            <p className="text-xs text-gray-600 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Forms */}
      {showForm && <ProductForm onSave={handleAdd} onCancel={() => setShowForm(false)} loading={loading} />}
      {editing && <ProductForm initial={editing} onSave={handleEdit} onCancel={() => setEditing(null)} />}

      {/* Search */}
      {products.length > 0 && !showForm && !editing && (
        <div className="relative max-w-md">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or ASIN..."
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>
      )}

      {/* Products list */}
      {filtered.length > 0 ? (
        <div className="space-y-3">
          {filtered.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              onEdit={(product) => setEditing(product)}
              onDelete={(id) => setConfirmDelete(id)}
              onRefresh={refreshAnalysis}
            />
          ))}
        </div>
      ) : (
        !showForm && !editing && (
          <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-xl">
            <Package size={40} className="text-gray-300 mx-auto mb-3" />
            <p className="text-sm font-semibold text-gray-600 mb-1">
              {products.length === 0 ? "No products registered yet" : "No products match your search"}
            </p>
            <p className="text-xs text-gray-400 mb-4">
              {products.length === 0
                ? "Register your first product to unlock AI-powered competitor analysis across the app."
                : "Try a different search term."}
            </p>
            {products.length === 0 && (
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-xl"
              >
                <Plus size={14} /> Register First Product
              </button>
            )}
          </div>
        )
      )}

      {/* Delete confirm */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 shadow-xl max-w-sm w-full mx-4">
            <p className="text-sm font-semibold text-gray-800 mb-2">Remove product?</p>
            <p className="text-xs text-gray-500 mb-6">
              The competitor analysis will be lost. You can re-register with the same ASIN later.
            </p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setConfirmDelete(null)}
                className="px-4 py-2 border border-gray-300 text-gray-700 text-sm rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={() => { deleteProduct(confirmDelete); setConfirmDelete(null); }}
                className="px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-xl"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
