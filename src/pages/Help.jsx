import React, { useState, useMemo, useRef, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  HelpCircle, Search, ChevronRight, BookOpen, Lightbulb,
  Rocket, Package, Zap, Megaphone, KeyRound, LayoutDashboard,
  BrainCircuit, FileText, Tag, FlaskConical, Star, Compass,
  Calculator, TrendingUp, BarChart3, Eye, Award, Calendar,
  Building2, Users, Settings, AlertTriangle,
} from "lucide-react";
import { helpTopics } from "../data/helpContent";

const ICONS = {
  Rocket, Package, Zap, Megaphone, KeyRound, LayoutDashboard,
  BrainCircuit, FileText, Tag, FlaskConical, Star, Compass,
  Calculator, TrendingUp, BarChart3, Eye, Award, Calendar,
  Building2, Users, Settings, HelpCircle,
};

function Highlight({ text, query }) {
  if (!query) return <>{text}</>;
  const q = query.toLowerCase();
  const lower = text.toLowerCase();
  const idx = lower.indexOf(q);
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-orange-200 rounded px-0.5">{text.slice(idx, idx + q.length)}</mark>
      {text.slice(idx + q.length)}
    </>
  );
}

/* Search inside a topic — returns a flat list of matching hits. */
function searchTopics(query) {
  if (!query || query.trim().length < 2) return null;
  const q = query.toLowerCase();
  const hits = [];
  for (const topic of helpTopics) {
    for (const section of topic.sections) {
      const bucket = [];
      if (section.title?.toLowerCase().includes(q)) bucket.push({ type: "section-title", text: section.title });
      section.paragraphs?.forEach((p) => p.toLowerCase().includes(q) && bucket.push({ type: "paragraph", text: p }));
      section.steps?.forEach((s) => {
        if (s.title?.toLowerCase().includes(q) || s.body?.toLowerCase().includes(q)) {
          bucket.push({ type: "step", text: `${s.title}: ${s.body}` });
        }
      });
      section.definitions?.forEach((d) => {
        if (d.term?.toLowerCase().includes(q) || d.body?.toLowerCase().includes(q)) {
          bucket.push({ type: "definition", text: `${d.term} — ${d.body}` });
        }
      });
      if (section.tip?.toLowerCase().includes(q)) bucket.push({ type: "tip", text: section.tip });
      if (bucket.length > 0) {
        hits.push({ topicId: topic.id, topicTitle: topic.title, sectionId: section.id, sectionTitle: section.title, matches: bucket });
      }
    }
  }
  return hits;
}

/* ────────────────────── SECTION RENDERERS ──────────────────────── */

function SectionContent({ section, query }) {
  return (
    <section id={section.id} className="scroll-mt-24">
      <h3 className="text-lg font-bold text-gray-900 mb-3">
        <Highlight text={section.title} query={query} />
      </h3>

      {section.paragraphs?.map((p, i) => (
        <p key={i} className="text-sm text-gray-700 leading-relaxed mb-2">
          <Highlight text={p} query={query} />
        </p>
      ))}

      {section.steps && (
        <ol className="space-y-3 my-4">
          {section.steps.map((step, i) => (
            <li key={i} className="flex items-start gap-3 bg-gray-50 border border-gray-200 rounded-xl p-3">
              <span className="w-6 h-6 rounded-full bg-orange-500 text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                {i + 1}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 mb-0.5">
                  <Highlight text={step.title} query={query} />
                </p>
                <p className="text-sm text-gray-600 leading-relaxed">
                  <Highlight text={step.body} query={query} />
                </p>
                {step.tip && (
                  <p className="text-xs text-blue-700 mt-1.5 bg-blue-50 border border-blue-200 rounded-lg px-2.5 py-1.5 flex items-start gap-1.5">
                    <Lightbulb size={12} className="flex-shrink-0 mt-0.5" />
                    <span><Highlight text={step.tip} query={query} /></span>
                  </p>
                )}
              </div>
            </li>
          ))}
        </ol>
      )}

      {section.definitions && (
        <dl className="space-y-2 my-4">
          {section.definitions.map((d, i) => (
            <div key={i} className="border-l-4 border-orange-300 bg-orange-50/40 pl-4 py-2 rounded-r-lg">
              <dt className="text-sm font-semibold text-gray-800">
                <Highlight text={d.term} query={query} />
              </dt>
              <dd className="text-sm text-gray-600 mt-0.5 leading-relaxed">
                <Highlight text={d.body} query={query} />
              </dd>
            </div>
          ))}
        </dl>
      )}

      {section.tip && (
        <div className="flex items-start gap-2 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 my-3">
          <BrainCircuit size={15} className="text-blue-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-blue-900">
            <Highlight text={section.tip} query={query} />
          </p>
        </div>
      )}
    </section>
  );
}

/* ────────────────────────── MAIN PAGE ──────────────────────────── */

export default function Help() {
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState("");
  const activeTopicId = params.get("topic") || helpTopics[0].id;
  const activeTopic = helpTopics.find((t) => t.id === activeTopicId) || helpTopics[0];

  const searchHits = useMemo(() => searchTopics(query), [query]);

  const setActiveTopic = (id) => {
    setParams({ topic: id });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const jumpToHit = (hit) => {
    setParams({ topic: hit.topicId });
    setQuery("");
    setTimeout(() => {
      const el = document.getElementById(hit.sectionId);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 60);
  };

  return (
    <div className="flex gap-6 min-h-[calc(100vh-160px)]">
      {/* ── Sidebar: topic list ──────────────────────────────────── */}
      <aside className="w-64 flex-shrink-0 hidden lg:block">
        <div className="sticky top-20 bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
            <BookOpen size={15} className="text-orange-500" />
            <span className="text-sm font-bold text-gray-800">Topics</span>
            <span className="ml-auto text-xs text-gray-400">{helpTopics.length}</span>
          </div>
          <nav className="py-1 max-h-[calc(100vh-220px)] overflow-y-auto">
            {helpTopics.map((t) => {
              const Icon = ICONS[t.icon] || HelpCircle;
              const active = t.id === activeTopic.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveTopic(t.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 text-left text-sm transition-colors ${
                    active ? "bg-orange-50 text-orange-700 border-l-2 border-orange-500" : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <Icon size={14} className={active ? "text-orange-600" : "text-gray-400"} />
                  <span className="flex-1 truncate">{t.title}</span>
                  {active && <ChevronRight size={12} className="text-orange-400" />}
                </button>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* ── Main: search + content ───────────────────────────────── */}
      <main className="flex-1 min-w-0 space-y-5">
        {/* Header + search */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center">
              <HelpCircle size={20} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-bold text-white">Help Center</h1>
              <p className="text-xs text-slate-400">
                Detailed tutorials for every page. Search across all topics, or pick one from the sidebar.
              </p>
            </div>
          </div>

          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder='Search — e.g. "how do I lower ACoS", "OAuth", "negative keywords"'
              className="w-full pl-10 pr-3 py-3 text-sm bg-slate-900/70 border border-slate-700 text-white placeholder-slate-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Search results view */}
        {searchHits !== null ? (
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="px-5 py-3 border-b border-gray-100">
              <p className="text-sm font-bold text-gray-800">
                {searchHits.length === 0 ? "No matches" : `${searchHits.length} section(s) match "${query}"`}
              </p>
              {searchHits.length === 0 && (
                <p className="text-xs text-gray-500 mt-1">
                  Try fewer words, or ask the AI assistant on the right of this page (coming).
                </p>
              )}
            </div>
            <div className="divide-y divide-gray-100">
              {searchHits.map((hit, i) => (
                <button
                  key={i}
                  onClick={() => jumpToHit(hit)}
                  className="w-full text-left px-5 py-3 hover:bg-orange-50 transition-colors"
                >
                  <p className="text-xs text-orange-600 font-semibold uppercase tracking-wide mb-0.5">
                    {hit.topicTitle} → {hit.sectionTitle}
                  </p>
                  <p className="text-sm text-gray-700 line-clamp-2">
                    <Highlight text={hit.matches[0].text} query={query} />
                  </p>
                  {hit.matches.length > 1 && (
                    <p className="text-xs text-gray-400 mt-1">+ {hit.matches.length - 1} more mention(s) in this section</p>
                  )}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <article className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-5">
            {/* Topic header */}
            <header className="pb-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                {(() => {
                  const Icon = ICONS[activeTopic.icon] || HelpCircle;
                  return (
                    <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center flex-shrink-0">
                      <Icon size={20} className="text-orange-600" />
                    </div>
                  );
                })()}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{activeTopic.title}</h2>
                  <p className="text-sm text-gray-500 mt-0.5">{activeTopic.summary}</p>
                </div>
              </div>
            </header>

            {/* Table of contents */}
            {activeTopic.sections.length > 2 && (
              <nav className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">On this page</p>
                <ul className="space-y-1">
                  {activeTopic.sections.map((s) => (
                    <li key={s.id}>
                      <a
                        href={`#${s.id}`}
                        className="text-sm text-gray-700 hover:text-orange-600 flex items-center gap-1.5"
                        onClick={(e) => {
                          e.preventDefault();
                          document.getElementById(s.id)?.scrollIntoView({ behavior: "smooth" });
                        }}
                      >
                        <ChevronRight size={11} className="text-gray-400" />
                        {s.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            )}

            {/* Sections */}
            {activeTopic.sections.map((s) => (
              <SectionContent key={s.id} section={s} query={null} />
            ))}

            {/* Navigation */}
            <nav className="flex justify-between pt-4 border-t border-gray-100 mt-4">
              {(() => {
                const idx = helpTopics.findIndex((t) => t.id === activeTopic.id);
                const prev = helpTopics[idx - 1];
                const next = helpTopics[idx + 1];
                return (
                  <>
                    {prev ? (
                      <button
                        onClick={() => setActiveTopic(prev.id)}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-orange-600"
                      >
                        ← <span>{prev.title}</span>
                      </button>
                    ) : <span />}
                    {next && (
                      <button
                        onClick={() => setActiveTopic(next.id)}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-orange-600 hover:text-orange-700 font-medium ml-auto"
                      >
                        <span>{next.title}</span> →
                      </button>
                    )}
                  </>
                );
              })()}
            </nav>
          </article>
        )}
      </main>
    </div>
  );
}
