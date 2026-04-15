import React from "react";

const configs = {
  active:    { label: "Ativo",    cls: "bg-green-100 text-green-700" },
  paused:    { label: "Pausado",  cls: "bg-yellow-100 text-yellow-700" },
  ended:     { label: "Encerrado",cls: "bg-gray-100 text-gray-500" },
  error:     { label: "Erro",     cls: "bg-red-100 text-red-600" },
  // competition levels
  "muito alto": { label: "Muito Alto", cls: "bg-red-100 text-red-600" },
  alto:          { label: "Alto",       cls: "bg-orange-100 text-orange-600" },
  médio:         { label: "Médio",      cls: "bg-yellow-100 text-yellow-700" },
  baixo:         { label: "Baixo",      cls: "bg-green-100 text-green-700" },
  // match types
  exact:   { label: "Exato",   cls: "bg-blue-100 text-blue-700" },
  phrase:  { label: "Frase",   cls: "bg-purple-100 text-purple-700" },
  broad:   { label: "Ampla",   cls: "bg-indigo-100 text-indigo-700" },
  // opportunity
  "muito alta": { label: "Muito Alta", cls: "bg-green-100 text-green-700" },
  alta:          { label: "Alta",       cls: "bg-emerald-100 text-emerald-700" },
  média:         { label: "Média",      cls: "bg-yellow-100 text-yellow-700" },
};

export default function StatusBadge({ status }) {
  const cfg = configs[status] || { label: status, cls: "bg-gray-100 text-gray-500" };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${cfg.cls}`}>
      {cfg.label}
    </span>
  );
}
