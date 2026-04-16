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
};

function ScoreBadge({ score }) {
  const color = score >= 80 ? "green" : score >= 60 ? "orange" : "red";
  return (
    <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-${color}-100 text-${color}-700 border border-${color}-200`}>
      <BrainCircuit size={10} /> AI Score {score}
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
          </div>
          <div className="flex items-center gap-3 mt-1 flex-wrap">
            <span className="text-xs text-gray-500">{product.category}</span>
            {product.price && <span className="text-xs text-gray-700 font-semibold">${Number(product.price).toFixed(2)}</span>}
            {product.cost && <span className="text-xs text-gray-400">cost ${Number(product.cost).toFixed(2)}</span>}
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
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">Selling Price ($)</label>
          <input
            name="price"
            type="number"
            step="0.01"
            value={form.price}
            onChange={ch}
            placeholder="29.99"
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">Product Cost ($)</label>
          <input
            name="cost"
            type="number"
            step="0.01"
            value={form.cost}
            onChange={ch}
            placeholder="8.00"
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>
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
