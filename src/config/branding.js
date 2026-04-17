// ─────────────────────────────────────────────────────────────────────────────
// BRANDING — single source of truth for company identity.
// ─────────────────────────────────────────────────────────────────────────────
// Edit the values below ONCE and every public-facing page (Landing, Privacy
// Policy, Terms of Service, Help Center, footer, emails) will reflect them.
//
// Optional: each field can be overridden at build time with a Vite env var
// (VITE_BRAND_*). Useful when hosting multiple white-labelled deployments from
// the same codebase.
// ─────────────────────────────────────────────────────────────────────────────

const env = typeof import.meta !== "undefined" ? import.meta.env : {};

export const BRANDING = {
  // ── Company ──────────────────────────────────────────────────────────
  companyName:   env.VITE_BRAND_COMPANY   || "Vikingo Ads Brain",
  legalName:     env.VITE_BRAND_LEGAL     || "Vikingo Ads Brain LLC",
  productName:   env.VITE_BRAND_PRODUCT   || "Vikingo Ads Brain™",
  tagline:       env.VITE_BRAND_TAGLINE   || "Sailing toward sales",

  // ── Web presence (update when you own the domain) ────────────────────
  domain:        env.VITE_BRAND_DOMAIN    || "vikingo-ads.example",
  marketingUrl:  env.VITE_BRAND_MARKETING || "https://www.vikingo-ads.example",
  appUrl:        env.VITE_BRAND_APP_URL   || "https://app.vikingo-ads.example",

  // ── Contact addresses (one email per function — makes triage easy) ──
  email: {
    support:  env.VITE_BRAND_EMAIL_SUPPORT  || "support@vikingo-ads.example",
    privacy:  env.VITE_BRAND_EMAIL_PRIVACY  || "privacy@vikingo-ads.example",
    dpo:      env.VITE_BRAND_EMAIL_DPO      || "dpo@vikingo-ads.example",
    legal:    env.VITE_BRAND_EMAIL_LEGAL    || "legal@vikingo-ads.example",
    compliance: env.VITE_BRAND_EMAIL_COMPLIANCE || "compliance@vikingo-ads.example",
  },

  // ── Legal jurisdiction (change before public launch) ────────────────
  jurisdiction: {
    state:   env.VITE_BRAND_STATE   || "Delaware",
    country: env.VITE_BRAND_COUNTRY || "USA",
  },

  // ── Marketplace focus ───────────────────────────────────────────────
  marketplace: env.VITE_BRAND_MARKETPLACE || "Amazon US",
};

// Convenience helpers used across pages.
export const addr = (key) => BRANDING.email[key] || BRANDING.email.support;
export const mailto = (key) => `mailto:${addr(key)}`;
