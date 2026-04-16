import React, { useState } from "react";
import { Package, AlertTriangle, CheckCircle, Bell, BellOff, Plus, Trash2, TrendingDown, Zap } from "lucide-react";

const INIT = [
  { id:1, name:"Panela Pressão Elétrica 6L", asin:"B08XYZ1234", stock:142, minStock:80, dailySales:12, pauseAds:true, status:"ok" },
  { id:2, name:"Panela Pressão Inox 5L", asin:"B07ABC5678", stock:28, minStock:50, dailySales:8, pauseAds:true, status:"low" },
  { id:3, name:"Acessório Vedação Universal", asin:"B09DEF9012", stock:5, minStock:30, dailySales:4, pauseAds:true, status:"critical" },
  { id:4, name:"Panela Elétrica Mini 2L", asin:"B0AGHI3456", stock:310, minStock:60, dailySales:15, pauseAds:false, status:"ok" },
];

const statusConfig = {
  ok:       { label:"Estoque OK",    bg:"bg-green-50 border-green-200", badge:"bg-green-100 text-green-700", icon:CheckCircle, iconColor:"text-green-500" },
  low:      { label:"Estoque Baixo", bg:"bg-yellow-50 border-yellow-200", badge:"bg-yellow-100 text-yellow-700", icon:AlertTriangle, iconColor:"text-yellow-500" },
  critical: { label:"Crítico!",      bg:"bg-red-50 border-red-200", badge:"bg-red-100 text-red-700", icon:AlertTriangle, iconColor:"text-red-500" },
};

export default function InventoryAlerts() {
  const [products, setProducts] = useState(INIT);
  const [showAdd, setShowAdd] = useState(false);
  const [newP, setNewP] = useState({ name:"", asin:"", stock:"", minStock:"50", dailySales:"", pauseAds:true });

  const computeStatus = (stock, min) => stock <= 0 ? "critical" : stock < min ? "low" : "ok";

  const toggle = (id, field) => setProducts(ps => ps.map(p => p.id === id ? { ...p, [field]: !p[field] } : p));
  const updateField = (id, field, val) => setProducts(ps => ps.map(p => {
    if (p.id !== id) return p;
    const updated = { ...p, [field]: +val };
    return { ...updated, status: computeStatus(field === "stock" ? +val : updated.stock, field === "minStock" ? +val : updated.minStock) };
  }));
  const remove = id => setProducts(ps => ps.filter(p => p.id !== id));
  const addProduct = () => {
    if (!newP.name || !newP.stock) return;
    const stock = +newP.stock, min = +newP.minStock;
    setProducts(ps => [...ps, { ...newP, id: Date.now(), stock, minStock: min, dailySales: +newP.dailySales, status: computeStatus(stock, min) }]);
    setNewP({ name:"", asin:"", stock:"", minStock:"50", dailySales:"", pauseAds:true });
    setShowAdd(false);
  };

  const critical = products.filter(p => p.status === "critical").length;
  const low = products.filter(p => p.status === "low").length;
  const autoPause = products.filter(p => p.pauseAds && p.status !== "ok").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center"><Package size={20} className="text-orange-600" /></div>
          <div><h1 className="text-xl font-bold text-gray-900">Alertas de Estoque</h1>
            <p className="text-sm text-gray-500">Pausa automática de ads quando estoque está baixo</p></div>
        </div>
        <button onClick={() => setShowAdd(s => !s)} className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-xl transition-colors">
          <Plus size={14} /> Adicionar Produto
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label:"Crítico", value:critical, bg:"bg-red-50 border-red-200", color:"text-red-600" },
          { label:"Estoque Baixo", value:low, bg:"bg-yellow-50 border-yellow-200", color:"text-yellow-600" },
          { label:"Ads Pausarão", value:autoPause, bg:"bg-blue-50 border-blue-200", color:"text-blue-600" },
        ].map(({ label, value, bg, color }) => (
          <div key={label} className={`border rounded-xl p-4 text-center ${bg}`}>
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
            <p className="text-xs text-gray-600 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Add form */}
      {showAdd && (
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Novo Produto</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label:"Nome do Produto", name:"name", placeholder:"Ex: Panela 6L Inox", type:"text", col:2 },
              { label:"ASIN", name:"asin", placeholder:"B0XXXXXXXXX", type:"text", col:1 },
              { label:"Estoque Atual", name:"stock", placeholder:"150", type:"number", col:1 },
              { label:"Estoque Mínimo", name:"minStock", placeholder:"50", type:"number", col:1 },
              { label:"Vendas/dia (média)", name:"dailySales", placeholder:"10", type:"number", col:1 },
            ].map(({ label, name, placeholder, type, col }) => (
              <div key={name} className={col === 2 ? "col-span-2" : ""}>
                <label className="block text-xs font-semibold text-gray-600 mb-1">{label}</label>
                <input type={type} value={newP[name]} onChange={e => setNewP(p => ({ ...p, [name]: e.target.value }))} placeholder={placeholder}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2 mt-3">
            <input type="checkbox" id="pauseNew" checked={newP.pauseAds} onChange={e => setNewP(p => ({ ...p, pauseAds: e.target.checked }))} className="rounded accent-orange-500" />
            <label htmlFor="pauseNew" className="text-xs text-gray-700">Pausar ads automaticamente quando estoque ficar baixo</label>
          </div>
          <div className="flex gap-2 mt-3">
            <button onClick={() => setShowAdd(false)} className="px-4 py-2 border border-gray-300 text-gray-700 text-sm rounded-xl hover:bg-gray-50">Cancelar</button>
            <button onClick={addProduct} className="px-4 py-2 bg-orange-500 text-white text-sm font-medium rounded-xl hover:bg-orange-600">Adicionar</button>
          </div>
        </div>
      )}

      {/* Product cards */}
      <div className="space-y-3">
        {products.map(p => {
          const cfg = statusConfig[p.status];
          const daysLeft = p.dailySales > 0 ? Math.floor(p.stock / p.dailySales) : 999;
          const pct = Math.min(100, (p.stock / (p.minStock * 3)) * 100);
          return (
            <div key={p.id} className={`border rounded-xl p-4 ${cfg.bg}`}>
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="flex items-start gap-3">
                  <cfg.icon size={18} className={`${cfg.iconColor} flex-shrink-0 mt-0.5`} />
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{p.name}</p>
                    <p className="text-xs text-gray-500">{p.asin}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cfg.badge}`}>{cfg.label}</span>
                  <button onClick={() => remove(p.id)} className="text-gray-400 hover:text-red-500"><Trash2 size={13} /></button>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Estoque atual</label>
                  <input type="number" value={p.stock} onChange={e => updateField(p.id, "stock", e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-sm font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-400" />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Mínimo</label>
                  <input type="number" value={p.minStock} onChange={e => updateField(p.id, "minStock", e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-400" />
                </div>
                <div className="flex flex-col justify-center">
                  <p className="text-xs text-gray-500">Dias restantes</p>
                  <p className={`text-lg font-bold ${daysLeft <= 7 ? "text-red-600" : daysLeft <= 15 ? "text-yellow-600" : "text-green-600"}`}>{daysLeft === 999 ? "∞" : daysLeft}d</p>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id={`pa-${p.id}`} checked={p.pauseAds} onChange={() => toggle(p.id, "pauseAds")} className="rounded accent-orange-500" />
                  <label htmlFor={`pa-${p.id}`} className="text-xs text-gray-700 leading-tight">
                    {p.pauseAds ? <span className="flex items-center gap-1 text-orange-600 font-medium"><Zap size={11} />Pausa automática ativa</span> : "Pausar ads automaticamente"}
                  </label>
                </div>
              </div>

              <div className="mt-3">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Nível de estoque</span>
                  <span>{p.stock} unid.</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className={`h-2 rounded-full transition-all ${p.status === "critical" ? "bg-red-500" : p.status === "low" ? "bg-yellow-400" : "bg-green-500"}`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
