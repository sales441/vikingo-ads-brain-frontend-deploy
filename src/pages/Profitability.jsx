import React, { useState } from "react";
import { DollarSign, Package, TrendingUp, Percent, Calculator, ChevronDown, ChevronUp, AlertCircle, CheckCircle } from "lucide-react";

const FEE_RATES = { US: 0.15, CA: 0.15, MX: 0.15 };
const FBA_RATES = { small: 3.22, medium: 5.40, large: 8.60, xlarge: 15.20 };

function Num({ label, name, value, onChange, prefix = "$", min = 0, step = "0.01", hint }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1">{label}</label>
      <div className="relative">
        {prefix && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">{prefix}</span>}
        <input type="number" name={name} value={value} onChange={onChange} min={min} step={step}
          className={`w-full border border-gray-300 rounded-lg py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 ${prefix ? "pl-9 pr-3" : "px-3"}`} />
      </div>
      {hint && <p className="text-xs text-gray-400 mt-0.5">{hint}</p>}
    </div>
  );
}

export default function Profitability() {
  const [form, setForm] = useState({
    price: 29.99, cost: 8.00, fbaSize: "medium", marketplace: "US",
    adsSpend: 2.50, otherCosts: 1.00, taxRate: 0.0, units: 100,
  });
  const [showAdvanced, setShowAdvanced] = useState(false);

  const ch = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const price = +form.price;
  const cost = +form.cost;
  const fbaFee = FBA_RATES[form.fbaSize];
  const amazonFee = price * FEE_RATES[form.marketplace];
  const tax = price * (+form.taxRate / 100);
  const adsSpend = +form.adsSpend;
  const otherCosts = +form.otherCosts;
  const totalCosts = cost + fbaFee + amazonFee + tax + adsSpend + otherCosts;
  const profit = price - totalCosts;
  const margin = price > 0 ? (profit / price) * 100 : 0;
  const roi = cost > 0 ? (profit / cost) * 100 : 0;
  const monthlyProfit = profit * +form.units;
  const breakeven = totalCosts;

  const status = margin >= 25 ? "great" : margin >= 15 ? "ok" : margin >= 0 ? "low" : "loss";
  const statusConfig = {
    great: { label: "Excellent", color: "text-green-600", bg: "bg-green-50 border-green-200" },
    ok:    { label: "Acceptable", color: "text-blue-600",  bg: "bg-blue-50 border-blue-200" },
    low:   { label: "Low margin", color: "text-orange-600", bg: "bg-orange-50 border-orange-200" },
    loss:  { label: "Losing money", color: "text-red-600", bg: "bg-red-50 border-red-200" },
  }[status];

  const breakdown = [
    { label: "Selling Price", value: price, color: "text-green-600", positive: true },
    { label: "Product Cost", value: -cost, color: "text-red-500" },
    { label: `FBA Fee (${form.fbaSize})`, value: -fbaFee, color: "text-red-500" },
    { label: "Amazon Referral Fee (15%)", value: -amazonFee, color: "text-red-500" },
    { label: `Tax (${form.taxRate}%)`, value: -tax, color: "text-red-500" },
    { label: "Ad Spend", value: -adsSpend, color: "text-orange-500" },
    { label: "Other Costs", value: -otherCosts, color: "text-orange-500" },
    { label: "Net Profit", value: profit, color: profit >= 0 ? "text-green-700" : "text-red-700", bold: true },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center"><Calculator size={20} className="text-emerald-600" /></div>
        <div><h1 className="text-xl font-bold text-gray-900">Profitability Calculator</h1>
          <p className="text-sm text-gray-500">Calculate real profit per product after all fees</p></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-4">
          <h2 className="text-sm font-semibold text-gray-700">Product Data</h2>
          <div className="grid grid-cols-2 gap-3">
            <Num label="Selling Price" name="price" value={form.price} onChange={ch} />
            <Num label="Product Cost" name="cost" value={form.cost} onChange={ch} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">FBA Size</label>
              <select name="fbaSize" value={form.fbaSize} onChange={ch} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white">
                <option value="small">Small — $3.22</option>
                <option value="medium">Medium — $5.40</option>
                <option value="large">Large — $8.60</option>
                <option value="xlarge">Extra Large — $15.20</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Marketplace</label>
              <select name="marketplace" value={form.marketplace} onChange={ch} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white">
                <option value="US">Amazon US</option>
                <option value="CA">Amazon CA</option>
                <option value="MX">Amazon MX</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Num label="Ad Spend (per unit)" name="adsSpend" value={form.adsSpend} onChange={ch} />
            <Num label="Units/month (estimate)" name="units" value={form.units} onChange={ch} prefix="" step="1" />
          </div>
          <button onClick={() => setShowAdvanced(s => !s)} className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700">
            {showAdvanced ? <ChevronUp size={13} /> : <ChevronDown size={13} />} Advanced settings
          </button>
          {showAdvanced && (
            <div className="grid grid-cols-2 gap-3 pt-1">
              <Num label="Other Costs (packaging, etc)" name="otherCosts" value={form.otherCosts} onChange={ch} />
              <Num label="Tax Rate (%)" name="taxRate" value={form.taxRate} onChange={ch} prefix="%" step="0.1" />
            </div>
          )}
        </div>

        {/* Results */}
        <div className="space-y-4">
          {/* Status card */}
          <div className={`border rounded-xl p-4 ${statusConfig.bg}`}>
            <div className="flex items-center justify-between mb-3">
              <span className={`text-sm font-bold ${statusConfig.color}`}>{statusConfig.label}</span>
              {status === "loss" ? <AlertCircle size={18} className="text-red-500" /> : <CheckCircle size={18} className="text-green-500" />}
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Profit per unit", value: `$${profit.toFixed(2)}`, color: profit >= 0 ? "text-green-700" : "text-red-600" },
                { label: "Net margin", value: `${margin.toFixed(1)}%`, color: margin >= 15 ? "text-green-700" : "text-red-600" },
                { label: "ROI", value: `${roi.toFixed(0)}%`, color: "text-blue-700" },
                { label: "Est. monthly profit", value: `$${monthlyProfit.toFixed(2)}`, color: "text-emerald-700" },
              ].map(({ label, value, color }) => (
                <div key={label} className="bg-white/70 rounded-lg p-2.5">
                  <p className="text-xs text-gray-500">{label}</p>
                  <p className={`text-base font-bold ${color}`}>{value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Breakdown */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Cost Breakdown</h3>
            <div className="space-y-2">
              {breakdown.map(({ label, value, color, bold }) => (
                <div key={label} className={`flex justify-between items-center py-1.5 border-b border-gray-50 last:border-0 ${bold ? "border-t border-gray-200 pt-2 mt-1" : ""}`}>
                  <span className={`text-xs ${bold ? "font-bold text-gray-800" : "text-gray-600"}`}>{label}</span>
                  <span className={`text-sm font-${bold ? "bold" : "medium"} ${color}`}>
                    {value >= 0 ? "+" : ""}${Math.abs(value).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Breakeven */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Break-even Price</h3>
            <p className="text-2xl font-bold text-orange-600">${breakeven.toFixed(2)}</p>
            <p className="text-xs text-gray-500 mt-1">Below this price you'll lose money. Your current price is <span className="font-semibold text-gray-700">${price.toFixed(2)}</span> ({profit >= 0 ? "+" : ""}{(((price - breakeven) / breakeven) * 100).toFixed(1)}% above break-even).</p>
          </div>
        </div>
      </div>
    </div>
  );
}
