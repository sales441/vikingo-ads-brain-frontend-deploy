import React, { useState, useMemo } from "react";
import { Search, TrendingUp, TrendingDown, Zap, AlertCircle } from "lucide-react";
import StatusBadge from "../components/StatusBadge";
import { competitionKeywords } from "../data/mockData";

const COLORS = ["#f97316", "#3b82f6", "#8b5cf6", "#22c55e", "#94a3b8"];

function CompetitionBar({ score }) {
  const color =
    score >= 80 ? "bg-red-500" :
    score >= 60 ? "bg-orange-500" :
    score >= 40 ? "bg-yellow-500" : "bg-green-500";
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 bg-gray-100 rounded-full h-1.5">
        <div className={`${color} h-1.5 rounded-full transition-all`} style={{ width: `${score}%` }} />
      </div>
      <span className="text-xs font-semibold text-gray-600 w-6 text-right">{score}</span>
    </div>
  );
}

function ShareOfVoiceBar({ brands }) {
  return (
    <div className="flex h-3 rounded-full overflow-hidden w-32">
      {brands.map((b, i) => (
        <div
          key={b.brand}
          style={{ width: `${b.shareOfVoice}%`, backgroundColor: COLORS[i % COLORS.length] }}
          title={`${b.brand}: ${b.shareOfVoice}%`}
        />
      ))}
    </div>
  );
}

export default function Competition() {
  const [search, setSearch] = useState("");
  const [compFilter, setCompFilter] = useState("all");
  const [oppFilter, setOppFilter] = useState("all");
  const [selected, setSelected] = useState(null);

  const filtered = useMemo(() => {
    let rows = competitionKeywords;
    if (search) rows = rows.filter(k => k.keyword.toLowerCase().includes(search.toLowerCase()));
    if (compFilter !== "all") rows = rows.filter(k => k.competition === compFilter);
    if (oppFilter !== "all") rows = rows.filter(k => k.opportunity === oppFilter);
    return rows;
  }, [search, compFilter, oppFilter]);

  const opportunities = competitionKeywords.filter(k =>
    (k.opportunity === "very high" || k.opportunity === "high") && !k.yourBid
  );

  const detail = selected ? competitionKeywords.find(k => k.id === selected) : null;

  return (
    <div className="space-y-5">
      {/* Opportunity alert */}
      {opportunities.length > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex items-start gap-3">
          <Zap size={18} className="text-orange-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-orange-800">
              {opportunities.length} keyword(s) with high opportunity and no active ad!
            </p>
            <div className="flex flex-wrap gap-2 mt-1.5">
              {opportunities.map(k => (
                <span key={k.id} className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-medium">
                  {k.keyword}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Monitored Keywords", val: competitionKeywords.length, color: "text-gray-800" },
          { label: "High Opportunity", val: competitionKeywords.filter(k => k.opportunity === "very high" || k.opportunity === "high").length, color: "text-green-600" },
          { label: "Very High Competition", val: competitionKeywords.filter(k => k.competition === "very high").length, color: "text-red-500" },
          { label: "You in 1st Place (SoV)", val: competitionKeywords.filter(k => k.topBrands[0]?.brand === "You").length, color: "text-blue-600" },
        ].map(({ label, val, color }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <p className="text-xs text-gray-500 mb-1">{label}</p>
            <p className={`text-2xl font-bold ${color}`}>{val}</p>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
            placeholder="Search keyword..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <select
          value={compFilter}
          onChange={e => setCompFilter(e.target.value)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white text-gray-700">
          <option value="all">All levels</option>
          <option value="very high">Very High</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>

        <select
          value={oppFilter}
          onChange={e => setOppFilter(e.target.value)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white text-gray-700">
          <option value="all">All opportunities</option>
          <option value="very high">Very High</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      <div className="flex gap-5">
        {/* Main table */}
        <div className="flex-1 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-100">
            <span className="text-sm text-gray-500">{filtered.length} keyword(s)</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left px-4 py-3 text-gray-500 font-medium">Keyword</th>
                  <th className="text-right px-4 py-3 text-gray-500 font-medium">Search Vol.</th>
                  <th className="text-right px-4 py-3 text-gray-500 font-medium">Trend</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-medium w-32">Competition</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-medium">Share of Voice</th>
                  <th className="text-right px-4 py-3 text-gray-500 font-medium">Min Bid</th>
                  <th className="text-right px-4 py-3 text-gray-500 font-medium">Max Bid</th>
                  <th className="text-right px-4 py-3 text-gray-500 font-medium">Your Bid</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-medium">Opportunity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((k) => (
                  <tr
                    key={k.id}
                    onClick={() => setSelected(selected === k.id ? null : k.id)}
                    className={`hover:bg-gray-50 transition-colors cursor-pointer ${selected === k.id ? "bg-orange-50" : ""}`}>
                    <td className="px-4 py-3 font-medium text-gray-800">{k.keyword}</td>
                    <td className="px-4 py-3 text-right text-gray-600">{k.searchVolume.toLocaleString("en-US")}</td>
                    <td className="px-4 py-3 text-right">
                      <span className={`flex items-center justify-end gap-1 font-medium ${k.volumeTrend >= 0 ? "text-green-600" : "text-red-500"}`}>
                        {k.volumeTrend >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                        {k.volumeTrend > 0 ? "+" : ""}{k.volumeTrend}%
                      </span>
                    </td>
                    <td className="px-4 py-3 w-40">
                      <CompetitionBar score={k.competitionScore} />
                    </td>
                    <td className="px-4 py-3">
                      <ShareOfVoiceBar brands={k.topBrands} />
                    </td>
                    <td className="px-4 py-3 text-right text-gray-600">${k.suggestedBidMin.toFixed(2)}</td>
                    <td className="px-4 py-3 text-right text-gray-600">${k.suggestedBidMax.toFixed(2)}</td>
                    <td className="px-4 py-3 text-right">
                      {k.yourBid
                        ? <span className="font-medium text-orange-600">${k.yourBid.toFixed(2)}</span>
                        : <span className="text-gray-300 italic">—</span>
                      }
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={k.opportunity} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-gray-400 text-sm">No keywords found.</div>
          )}
        </div>

        {/* Detail panel */}
        {detail && (
          <div className="w-72 flex-shrink-0 bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-4 self-start">
            <div className="flex items-start justify-between">
              <h3 className="text-sm font-semibold text-gray-800 leading-tight">{detail.keyword}</h3>
              <button onClick={() => setSelected(null)} className="text-gray-300 hover:text-gray-500 text-lg leading-none">✕</button>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Share of Voice</p>
              {detail.topBrands.map((b, i) => (
                <div key={b.brand} className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-0.5">
                      <span className={`text-xs font-medium ${b.brand === "You" ? "text-orange-600" : "text-gray-700"}`}>{b.brand}</span>
                      <span className="text-xs text-gray-500">{b.shareOfVoice}%</span>
                    </div>
                    <div className="bg-gray-100 rounded-full h-1">
                      <div className="h-1 rounded-full" style={{ width: `${b.shareOfVoice}%`, backgroundColor: COLORS[i % COLORS.length] }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 pt-3 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-500">Search Volume</span>
                <span className="font-medium">{detail.searchVolume.toLocaleString("en-US")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Trend</span>
                <span className={`font-medium ${detail.volumeTrend >= 0 ? "text-green-600" : "text-red-500"}`}>
                  {detail.volumeTrend > 0 ? "+" : ""}{detail.volumeTrend}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Competition Score</span>
                <span className="font-medium">{detail.competitionScore}/100</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Suggested Bid</span>
                <span className="font-medium">${detail.suggestedBidMin.toFixed(2)} – ${detail.suggestedBidMax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Your Current Bid</span>
                <span className={`font-medium ${detail.yourBid ? "text-orange-600" : "text-gray-300"}`}>
                  {detail.yourBid ? `$${detail.yourBid.toFixed(2)}` : "No ad"}
                </span>
              </div>
            </div>

            {!detail.yourBid && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-xs text-green-700">
                <div className="flex gap-1.5 items-start">
                  <AlertCircle size={13} className="flex-shrink-0 mt-0.5" />
                  <span>You aren't advertising on this keyword yet. Suggested starting bid: <strong>${((detail.suggestedBidMin + detail.suggestedBidMax) / 2).toFixed(2)}</strong></span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
