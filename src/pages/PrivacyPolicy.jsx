import React from "react";
import { Link } from "react-router-dom";
import { Shield, ArrowLeft, Zap } from "lucide-react";

const SECTIONS = [
  {
    title: "1. Information we collect",
    body: [
      "Account data: name, email, password hash, company name and contact information you provide during signup or when creating a Company.",
      "Amazon Ads data: when you authorize Vikingo Ads Brain via the Amazon Ads API, we receive your Profile ID, Advertiser ID, and campaign-level metrics (spend, clicks, impressions, ACoS, ROAS). We also store an encrypted refresh token so we can keep syncing.",
      "Product data: ASINs, product names, selling prices, costs, and notes you enter in the My Products page.",
      "Usage data: pages visited, features used, errors encountered. Used only to improve the product and diagnose issues.",
    ],
  },
  {
    title: "2. Information we do NOT collect",
    body: [
      "We never read buyer personally identifiable information (names, addresses, emails, phone numbers of Amazon shoppers who bought your products).",
      "We never read or process payment data or bank information.",
      "We never read order-level PII. The Amazon Ads API does not expose it, and we do not request SP-API scopes that would.",
      "We never read your Amazon account password. Authorization is OAuth-based — your password is entered only on Amazon's site.",
    ],
  },
  {
    title: "3. How we use your information",
    body: [
      "To provide the service: sync your campaigns, analyze them with AI, and surface recommendations.",
      "To communicate with you: send account notifications, alerts you subscribe to, and critical service announcements.",
      "To secure the service: detect abuse, protect against unauthorized access.",
      "We do NOT sell your data to third parties. We do NOT train public AI models on your data. We do NOT share your data with competitors.",
    ],
  },
  {
    title: "4. Storage and security",
    body: [
      "Amazon refresh tokens are encrypted at rest using AES-256 with keys managed by AWS KMS (or equivalent in self-hosted deployments).",
      "Access tokens (1h lifetime) are kept only in memory during an API request and are never persisted.",
      "All traffic between your browser, our backend, and Amazon uses TLS 1.2+.",
      "Database backups are encrypted. Passwords are hashed with bcrypt (cost factor 12+).",
      "We maintain an audit log of every API call made with your token — you can request a copy at any time.",
    ],
  },
  {
    title: "5. Data retention",
    body: [
      "We retain your account data for as long as your account is active.",
      "If you close your account, we delete all personal and company data within 30 days. Aggregated, non-identifiable analytics may be retained.",
      "Audit logs are kept for 12 months to satisfy Amazon's compliance requirements.",
    ],
  },
  {
    title: "6. Your rights",
    body: [
      "Export: you can export all your data in JSON/CSV format at any time from Settings → Data Export.",
      "Delete: you can delete your account at any time. All data is purged within 30 days.",
      "Revoke Amazon access: you can disconnect any company from Amazon at any time from the Companies page. You can also revoke at amazon.com/ap/adam.",
      "GDPR/CCPA: if you are in the EU or California, you have additional rights regarding access, rectification, and portability. Contact privacy@vikingo-ads.example to exercise them.",
    ],
  },
  {
    title: "7. Cookies",
    body: [
      "We use first-party cookies and localStorage only for essential app functionality: keeping you logged in, remembering your selected company, and storing UI preferences.",
      "We do NOT use third-party advertising cookies.",
      "We may use privacy-respecting product analytics (PostHog or similar) configured in self-hosted, pseudonymous mode.",
    ],
  },
  {
    title: "8. Third-party services",
    body: [
      "Amazon Advertising API — to read and manage your campaigns (with your explicit OAuth consent).",
      "OpenAI / Anthropic API — to generate AI recommendations. Only aggregated, non-PII data is sent.",
      "AWS or equivalent cloud — for hosting, database, encrypted storage.",
      "Stripe (if applicable) — for subscription billing. We never see your card numbers.",
    ],
  },
  {
    title: "9. Children",
    body: [
      "Vikingo Ads Brain is a B2B tool and is not directed at children under 13. We do not knowingly collect data from minors.",
    ],
  },
  {
    title: "10. Changes to this policy",
    body: [
      "We may update this policy. Material changes will be announced via email and in-app banner at least 30 days before taking effect.",
    ],
  },
  {
    title: "11. Contact",
    body: [
      "Questions about this policy: privacy@vikingo-ads.example",
      "Data Protection Officer: dpo@vikingo-ads.example",
      "Amazon Ads API compliance: compliance@vikingo-ads.example",
    ],
  },
];

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Public header */}
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

      {/* Content */}
      <main className="max-w-3xl mx-auto px-6 py-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
            <Shield size={20} className="text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Privacy Policy</h1>
            <p className="text-sm text-gray-500">Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-6">
          <p className="text-sm text-gray-700 leading-relaxed">
            Vikingo Ads Brain™ ("Vikingo", "we", "our") operates an Amazon Ads management platform. This Privacy Policy explains what information we collect,
            how we use it, how we secure it, and the rights you have regarding your data.
          </p>

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

          <div className="pt-4 border-t border-gray-100 text-xs text-gray-400">
            This policy is written in plain English to be accessible. If any clause is unclear, please contact us — we'll rewrite it.
          </div>
        </div>

        <div className="flex justify-center gap-4 mt-6 text-sm">
          <Link to="/terms" className="text-orange-600 hover:underline">Terms of Service</Link>
          <span className="text-gray-300">|</span>
          <Link to="/login" className="text-orange-600 hover:underline">Sign in</Link>
        </div>
      </main>
    </div>
  );
}
