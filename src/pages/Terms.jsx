import React from "react";
import { Link } from "react-router-dom";
import { FileText, ArrowLeft, Zap } from "lucide-react";

const SECTIONS = [
  {
    title: "1. Acceptance",
    body: [
      "By creating an account on Vikingo Ads Brain™ ('the Service'), you agree to these Terms of Service. If you do not agree, do not use the Service.",
      "You must be at least 18 years old and legally able to enter binding contracts in your jurisdiction.",
    ],
  },
  {
    title: "2. The service",
    body: [
      "Vikingo Ads Brain is a software-as-a-service platform that reads, analyzes, and manages Amazon Advertising campaigns on your behalf, via the Amazon Ads API.",
      "We provide AI-generated recommendations. These recommendations are informational — you remain responsible for every action you take inside the product and on your Amazon account.",
    ],
  },
  {
    title: "3. Your account",
    body: [
      "You are responsible for keeping your password confidential and for all activity under your account.",
      "You must notify us immediately if you suspect unauthorized access: support@vikingo-ads.example.",
      "You must not share your account with other people. Each seat requires its own login (see Users page for roles and invites).",
    ],
  },
  {
    title: "4. Amazon Ads API compliance",
    body: [
      "When you connect an Amazon account, you grant us permission to use the Amazon Ads API strictly within the scope you authorized (campaign management).",
      "We comply with Amazon's Data Protection Policy and Acceptable Use Policy. We do NOT resell Amazon data, do NOT train public models on your data, and do NOT use your data for any purpose beyond providing this Service to you.",
      "You may revoke access at any time from Companies → Disconnect or at amazon.com/ap/adam.",
    ],
  },
  {
    title: "5. AI recommendations — no warranty",
    body: [
      "Recommendations are estimates based on historical data and market patterns. They are NOT guarantees of future results.",
      "Pausing, changing bids, or changing budgets based on AI suggestions may increase or decrease your sales. You acknowledge that results depend on many factors outside our control, including Amazon's algorithm, competitor behavior, seasonality, and inventory.",
      "You should review significant changes before they are applied, especially in early campaigns without enough data history.",
    ],
  },
  {
    title: "6. Acceptable use",
    body: [
      "You must not use the Service to: (a) violate any law or third-party right; (b) circumvent Amazon's policies; (c) inject malware or attempt to breach our infrastructure; (d) resell the Service or scrape data we provide; (e) misrepresent the performance of your Amazon account.",
      "We may suspend accounts that violate these rules, with notice where possible.",
    ],
  },
  {
    title: "7. Fees and billing",
    body: [
      "If the Service is offered on a paid plan, pricing and billing terms are presented at checkout. You authorize us (or our payment processor) to charge the subscription fee on the cycle you selected.",
      "All fees are non-refundable except where required by law. You may cancel at any time; cancellation takes effect at the end of the current billing cycle.",
      "We may change prices with 30 days' notice. Price changes do not affect the current cycle.",
    ],
  },
  {
    title: "8. Data ownership",
    body: [
      "Your data is yours. We store and process it only to provide the Service.",
      "You can export or delete your data at any time. See the Privacy Policy for details.",
    ],
  },
  {
    title: "9. Service availability",
    body: [
      "We work hard to keep the Service available, but we do not guarantee uninterrupted uptime.",
      "We may perform maintenance that briefly takes the Service offline. We aim to announce planned maintenance in advance.",
      "Amazon's own API occasionally has outages outside our control. During those periods the Service will fall back to the most recent synced data.",
    ],
  },
  {
    title: "10. Limitation of liability",
    body: [
      "To the maximum extent allowed by law, our total liability to you under these Terms is limited to the amount you paid us in the 12 months preceding the event giving rise to the claim.",
      "We are not liable for indirect, consequential, incidental, special, or punitive damages — including lost profits, lost sales, lost data, or business interruption.",
    ],
  },
  {
    title: "11. Indemnification",
    body: [
      "You agree to indemnify Vikingo Ads Brain and its employees against any third-party claim arising from your misuse of the Service, your violation of these Terms, or your violation of any law.",
    ],
  },
  {
    title: "12. Termination",
    body: [
      "You may terminate your account at any time.",
      "We may suspend or terminate your account for material violation of these Terms, non-payment, or by Amazon's request.",
      "Upon termination, access to the Service ends. Your data is deleted within 30 days unless we are required to retain it by law.",
    ],
  },
  {
    title: "13. Changes to the terms",
    body: [
      "We may update these Terms. Material changes will be notified at least 30 days in advance via email and an in-app banner.",
      "Continued use of the Service after the effective date constitutes acceptance of the new Terms.",
    ],
  },
  {
    title: "14. Governing law",
    body: [
      "These Terms are governed by the laws of the State of Delaware, USA, without regard to conflict-of-law principles. Disputes shall be resolved in the state or federal courts of Delaware, unless local consumer protection law applies.",
    ],
  },
  {
    title: "15. Contact",
    body: [
      "Legal: legal@vikingo-ads.example",
      "Support: support@vikingo-ads.example",
    ],
  },
];

export default function Terms() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-slate-900 border-b border-slate-800">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-orange-500 flex items-center justify-center">
              <Zap size={18} className="text-white" />
            </div>
            <div>
              <p className="text-white font-bold text-sm leading-tight">Vikingo Ads</p>
              <p className="text-orange-400 text-xs font-medium">Brain™</p>
            </div>
          </Link>
          <Link to="/" className="flex items-center gap-1 text-sm text-slate-400 hover:text-white">
            <ArrowLeft size={14} /> Back
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
            <FileText size={20} className="text-green-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Terms of Service</h1>
            <p className="text-sm text-gray-500">Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-6">
          {SECTIONS.map((section, i) => (
            <section key={i}>
              <h2 className="text-lg font-bold text-gray-900 mb-2">{section.title}</h2>
              <ul className="space-y-2">
                {section.body.map((p, j) => (
                  <li key={j} className="text-sm text-gray-700 leading-relaxed flex items-start gap-2">
                    <span className="text-orange-400 font-bold flex-shrink-0">·</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <div className="flex justify-center gap-4 mt-6 text-sm">
          <Link to="/privacy" className="text-orange-600 hover:underline">Privacy Policy</Link>
          <span className="text-gray-300">|</span>
          <Link to="/login" className="text-orange-600 hover:underline">Sign in</Link>
        </div>
      </main>
    </div>
  );
}
