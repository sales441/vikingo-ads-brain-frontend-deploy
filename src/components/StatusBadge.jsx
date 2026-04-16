import React from "react";

const configs = {
  active:    { label: "Active",   cls: "bg-green-100 text-green-700" },
  paused:    { label: "Paused",   cls: "bg-yellow-100 text-yellow-700" },
  ended:     { label: "Ended",    cls: "bg-gray-100 text-gray-500" },
  error:     { label: "Error",    cls: "bg-red-100 text-red-600" },
  // competition levels
  "very high": { label: "Very High", cls: "bg-red-100 text-red-600" },
  high:        { label: "High",      cls: "bg-orange-100 text-orange-600" },
  medium:      { label: "Medium",    cls: "bg-yellow-100 text-yellow-700" },
  low:         { label: "Low",       cls: "bg-green-100 text-green-700" },
  // match types
  exact:   { label: "Exact",   cls: "bg-blue-100 text-blue-700" },
  phrase:  { label: "Phrase",  cls: "bg-purple-100 text-purple-700" },
  broad:   { label: "Broad",   cls: "bg-indigo-100 text-indigo-700" },
};

export default function StatusBadge({ status }) {
  const cfg = configs[status] || { label: status, cls: "bg-gray-100 text-gray-500" };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${cfg.cls}`}>
      {cfg.label}
    </span>
  );
}
