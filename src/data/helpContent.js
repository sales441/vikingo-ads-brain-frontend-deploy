// Help Center content — detailed, step-by-step tutorials per topic.
// Each topic has sections which can contain: paragraphs, numbered steps,
// tips (AI guidance), warnings, and code/field references.
//
// This file is intentionally data-only. The Help.jsx page renders it.

export const helpTopics = [
  /* ───────────────────────── GETTING STARTED ───────────────────────── */
  {
    id: "getting-started",
    title: "Getting Started",
    icon: "Rocket",
    summary: "Your first 10 minutes. Set up your company, connect Amazon, and register your first product.",
    sections: [
      {
        id: "overview",
        title: "What is Vikingo Ads Brain?",
        paragraphs: [
          "Vikingo Ads Brain is an Amazon Ads management platform built for the US marketplace. It reads your real campaigns through the Amazon Ads API, analyzes every fee and metric, and surfaces AI-driven recommendations you can apply in one click.",
          "Everything is protected and guided by AI — when you change a bid, pick a bidding strategy, or register a product, the system warns you about risky values and suggests the ones top sellers use.",
        ],
      },
      {
        id: "first-10-minutes",
        title: "Your first 10 minutes",
        steps: [
          {
            title: "Register a company",
            body: "Go to Companies → New Company. Enter the legal name, contact email, and (optional) Seller Central URL. You can add API credentials later.",
          },
          {
            title: "Connect Amazon Ads",
            body: "On the company card, click Connect with Amazon. A 3-step wizard opens: authorize → exchange token → success. Your refresh token is stored encrypted and renewed automatically.",
            tip: "AI tip: if you haven't received Amazon Ads API approval yet, you can still explore the app in demo mode. Everything works the same — numbers are just simulated.",
          },
          {
            title: "Register your first product",
            body: "Open My Products → Register Product. Enter an ASIN, product name, category, price, and cost (plus FBA size or FBM shipping). Vikingo Brain™ will analyze competitors, calculate a break-even price, and pre-suggest keywords.",
          },
          {
            title: "Create your first campaign",
            body: "Go to Create Ads → pick Automatic AI or Manual. Select the program (Amazon Retail/Business/Beyond), the campaign type (SP/SB/SD), and your registered product. The AI fills in keywords, bids, and a recommended bidding strategy.",
          },
          {
            title: "Monitor on the Campaigns page",
            body: "After launch, the Campaigns page auto-syncs every time you open it. The AI flags campaigns needing attention (ACoS too high, budget capped, low CTR) with one-click fixes.",
          },
        ],
      },
      {
        id: "glossary",
        title: "Quick glossary",
        definitions: [
          { term: "ACoS", body: "Advertising Cost of Sales — Ad spend ÷ ad revenue. Lower is better. Most sellers target 15–30%." },
          { term: "ROAS", body: "Return on Ad Spend — ad revenue ÷ ad spend. Higher is better. 3× is the profitability floor for most categories." },
          { term: "CPC", body: "Cost per Click. Amazon auctions each click; you pay only when someone clicks." },
          { term: "CTR", body: "Click-through rate — clicks ÷ impressions. Below 0.3% usually means wrong keyword or weak creative." },
          { term: "Share of Voice", body: "How often your ad shows for a keyword compared to competitors. Higher = more visibility." },
          { term: "FBA / FBM", body: "Fulfilled by Amazon (they pick/pack/ship) vs Fulfilled by Merchant (you ship). Fees differ — FBA has fulfillment + storage; FBM doesn't." },
          { term: "ASIN", body: "Amazon Standard Identification Number — 10-character product ID (e.g. B08XYZ1234)." },
          { term: "Referral fee", body: "Amazon's commission, 8–17% depending on category. Usually 15%." },
        ],
      },
    ],
  },

  /* ──────────────────────────── MY PRODUCTS ─────────────────────────── */
  {
    id: "my-products",
    title: "My Products",
    icon: "Package",
    summary: "Register products by ASIN so the AI can study competitors, compute profitability, and pre-fill campaigns.",
    sections: [
      {
        id: "why-register",
        title: "Why register products first?",
        paragraphs: [
          "Every AI tool in Vikingo (Ads Creator, Listing, Pricing, A/B Test, etc.) reads from the product catalog. When you register a product, Vikingo Brain™ pulls the top 3 competitors, estimates the market price range, calculates an opportunity score, and pre-suggests keywords you can use later.",
          "You don't have to register everything — but every tool will be sharper when the product is registered first.",
        ],
      },
      {
        id: "how-to-register",
        title: "How to register a product",
        steps: [
          {
            title: "Open My Products → Register Product",
            body: "Only ASIN, product name, and category are required. Everything else adds accuracy.",
          },
          {
            title: "Paste the ASIN (10 characters)",
            body: "Find it in Seller Central → Inventory, or in the Amazon listing URL. Example: B08XYZ1234.",
          },
          {
            title: "Pick a category",
            body: "The category affects the referral fee the AI uses in profitability calculations (Electronics 8%, most others 15%, Clothing 17%).",
          },
          {
            title: "Enter selling price and product cost (★ required for profit)",
            body: "Without both, the AI can't tell you if the sale is profitable. A live profit estimate appears in the form as you type.",
          },
          {
            title: "Pick Fulfillment Type: FBA or FBM",
            body: "FBA → Amazon ships (add FBA size, inbound shipping to Amazon, monthly storage). FBM → you ship (add outbound shipping to customer, packaging).",
            tip: "AI tip: if you don't know the FBA size tier, start with Medium ($5.40). You can refine later — the AI will warn if the fee looks off for the price range.",
          },
          {
            title: "Optional: image URL and notes",
            body: "Notes become context the AI sees when generating listings or ad copy. Anything helpful — variations, target audience, supplier — improves results.",
          },
          {
            title: "Save & analyze",
            body: "Click Register & Analyze. Vikingo Brain™ runs the full competitor analysis (takes ~1 second in demo mode, 5–15 seconds in production).",
          },
        ],
      },
      {
        id: "profit-card",
        title: "Reading the profit card",
        paragraphs: [
          "When the product is expanded, the profit breakdown splits into two columns: Your costs (external) vs Amazon fees (read by AI).",
          "Your costs: product cost + inbound/outbound shipping + packaging + other. Amazon fees: referral % by category + FBA by size + monthly storage.",
          "The green/red badge on the card header shows net profit at a glance. Red 'LOSS' = you're losing money per unit and should raise price or cut cost.",
        ],
        tip: "AI tip: if margin is below 15%, any ad spend above half the profit will kill profitability. The AI will remind you of this when you try to create a campaign for that product.",
      },
      {
        id: "refresh-analysis",
        title: "Refreshing competitor analysis",
        paragraphs: [
          "Click the circular refresh icon on the product card to re-run the analysis. Do this when: a competitor launches a new product, prices shift in the category, or you change your own price significantly.",
        ],
      },
    ],
  },

  /* ───────────────────── CONNECT AMAZON (OAUTH) ─────────────────────── */
  {
    id: "connect-amazon",
    title: "Connect Amazon Ads",
    icon: "Zap",
    summary: "Authorize Vikingo to read and manage your real Amazon Ads campaigns via the Amazon Ads API.",
    sections: [
      {
        id: "prerequisites",
        title: "What you need before connecting",
        paragraphs: [
          "Connecting goes through Amazon's official OAuth flow and has two sides — the app owner (Vikingo) must be approved by Amazon, and each seller (you) authorizes the connection to their account.",
        ],
        definitions: [
          { term: "Amazon Developer account", body: "The app owner's side — already set up if you're using a hosted Vikingo deployment." },
          { term: "Ads API approval", body: "Vikingo's application must be approved for the regions you operate in (US, CA, MX for North America). Takes 2–6 weeks the first time." },
          { term: "Your Amazon Ads account", body: "The account you log in to at advertising.amazon.com. You'll authorize Vikingo with this." },
        ],
      },
      {
        id: "connect-flow",
        title: "Connecting step by step",
        steps: [
          {
            title: "Open Companies and pick the right company",
            body: "Credentials are per company. Make sure the company name matches the Amazon Ads account you want to connect.",
          },
          {
            title: "Click 'Connect with Amazon'",
            body: "A 3-step modal opens. You'll see: Authorizing → Exchanging → Success (or Error).",
          },
          {
            title: "Authorize on Amazon",
            body: "In production, you'll be redirected to amazon.com to log in and approve Vikingo. Only the scope advertising::campaign_management is requested — Vikingo never sees your banking, buyers, or reviews.",
            tip: "Amazon will ask you to pick which profile(s) to authorize. Pick all the marketplaces you want Vikingo to manage.",
          },
          {
            title: "Token exchange",
            body: "Vikingo's backend exchanges the authorization code for a refresh token (long-lived, encrypted at rest). Access tokens (1h each) are generated per API call.",
          },
          {
            title: "Done",
            body: "The company card now shows a green 'Connected' badge and the connection date. Go to Campaigns — the sync starts immediately.",
          },
        ],
      },
      {
        id: "approval-process",
        title: "How does Vikingo itself get Amazon's approval? (for app owners)",
        paragraphs: [
          "If you're self-hosting Vikingo or reselling it, you'll need your own Amazon Ads API approval.",
        ],
        steps: [
          {
            title: "Create an Amazon Developer account",
            body: "developer.amazon.com → sign up. Free. Takes ~10 minutes.",
          },
          {
            title: "Register a Security Profile",
            body: "In Developer Console → Apps & Services → Login with Amazon → Create Security Profile. You'll receive Client ID + Client Secret. Set the Allowed Return URL to your backend's /oauth/amazon/callback endpoint.",
          },
          {
            title: "Submit Amazon Ads API application",
            body: "advertising.amazon.com/API → Apply for access. Required: use case description, architecture diagram, privacy policy URL, terms URL, data retention/encryption statement, contact email.",
            tip: "AI tip: Amazon rejects applications without a public landing page. Spin up a minimal marketing site before applying.",
          },
          {
            title: "Wait for review",
            body: "Typically 2–6 weeks. Amazon may ask follow-up questions. Respond within 7 days or the application is dropped.",
          },
          {
            title: "Configure the approved app",
            body: "Once approved, Amazon will give you the LWA (Login with Amazon) credentials. Put them in Vikingo's backend environment: LWA_CLIENT_ID, LWA_CLIENT_SECRET, OAUTH_REDIRECT_URL.",
          },
          {
            title: "Test in sandbox before production",
            body: "Amazon offers a sandbox Ads API. Run a full connect flow against the sandbox first — saves a lot of customer support tickets later.",
          },
        ],
      },
      {
        id: "troubleshooting",
        title: "Troubleshooting common errors",
        definitions: [
          { term: "invalid_grant", body: "Authorization code expired (they're valid for ~5 minutes) or already used. Click Reconnect and complete the flow faster." },
          { term: "unauthorized_client", body: "The LWA Client ID in Vikingo's backend doesn't match the one Amazon approved. Double-check environment variables." },
          { term: "access_denied", body: "The seller declined the authorization on Amazon's screen. Re-open the flow and approve." },
          { term: "Profile not found", body: "The seller authorized, but none of the profiles they picked have Ads access. Ask them to enable advertising in Seller Central first." },
          { term: "Token expired", body: "Refresh tokens can be revoked manually from the seller's Amazon account. Look for the orange 'Reconnect' badge and click it." },
        ],
      },
      {
        id: "security",
        title: "Security & privacy",
        paragraphs: [
          "Vikingo stores the refresh token encrypted at rest (AES-256 via AWS KMS in production). Access tokens live only in memory during a request.",
          "Audit logs record every call made with the token. Sellers can revoke Vikingo at any time from amazon.com/ap/adam — the next API call will fail with invalid_grant and Vikingo will show the 'Reconnect' badge.",
          "No buyer PII (names, addresses, orders) is persisted by Vikingo. Only campaign-level aggregates (spend, clicks, impressions, ACoS).",
        ],
      },
    ],
  },
];
