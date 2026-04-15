import React from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export default function KPICard({ title, value, delta, format = "number", icon: Icon, iconBg = "bg-orange-100", iconColor = "text-orange-600" }) {
  const formatValue = (v) => {
    if (format === "currency") return `R$ ${Number(v).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;
    if (format === "percent") return `${Number(v).toFixed(2)}%`;
    if (format === "large") return Number(v).toLocaleString("pt-BR");
    return v;
  };

  const deltaNum = parseFloat(delta);
  const isPositive = deltaNum > 0;
  const isNeutral = deltaNum === 0 || delta === undefined || delta === null;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <p className="text-sm text-gray-500 font-medium">{title}</p>
        {Icon && (
          <div className={`w-9 h-9 rounded-lg ${iconBg} flex items-center justify-center`}>
            <Icon size={18} className={iconColor} />
          </div>
        )}
      </div>

      <p className="text-2xl font-bold text-gray-900 mb-2">{formatValue(value)}</p>

      {!isNeutral && (
        <div className={`flex items-center gap-1 text-xs font-medium ${isPositive ? "text-green-600" : "text-red-500"}`}>
          {isPositive ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
          <span>{isPositive ? "+" : ""}{deltaNum.toFixed(1)}% vs período anterior</span>
        </div>
      )}
      {isNeutral && delta !== undefined && (
        <div className="flex items-center gap-1 text-xs font-medium text-gray-400">
          <Minus size={13} />
          <span>Sem variação</span>
        </div>
      )}
    </div>
  );
}
