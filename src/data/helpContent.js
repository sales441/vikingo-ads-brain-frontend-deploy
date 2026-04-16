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

  /* ───────────────────────────── CAMPAIGNS ──────────────────────────── */
  {
    id: "campaigns",
    title: "Campaigns (view & manage)",
    icon: "Megaphone",
    summary: "Read your live Amazon campaigns, see AI diagnostics per campaign, and act with one click.",
    sections: [
      {
        id: "connection-banner",
        title: "Reading the connection banner",
        paragraphs: [
          "The top of the Campaigns page always shows a status banner. The color tells you where the data comes from:",
        ],
        definitions: [
          { term: "Green — Live data", body: "Amazon Ads API responded. Vikingo Brain™ is analyzing your real campaigns and will refresh every time you open the page or click Sync from Amazon." },
          { term: "Orange — Demo mode (credentials OK)", body: "You have credentials saved, but the API is unreachable right now. The error message is shown under the banner. Try Sync in a minute or check Amazon's API status page." },
          { term: "Yellow — Not connected", body: "No Amazon credentials yet. Click the inline link to go to Companies and connect — or continue exploring with demo data." },
        ],
      },
      {
        id: "sync-button",
        title: "Sync from Amazon (manual refresh)",
        paragraphs: [
          "The 'Sync from Amazon' button forces an immediate pull of all campaigns. Use it after you made changes in Seller Central / Amazon Ads Console and want Vikingo to catch up instantly.",
          "Normal automatic sync runs whenever the page is opened and whenever the selected company changes.",
        ],
        tip: "AI tip: Amazon caches campaign stats for ~5 minutes. If you just changed something there, give it a couple of minutes before clicking Sync.",
      },
      {
        id: "ai-attention-panel",
        title: "'Campaigns needing attention' panel",
        paragraphs: [
          "Right below the banner, Vikingo Brain™ highlights up to 4 campaigns that need action. Each card shows:",
        ],
        steps: [
          { title: "Severity badge", body: "Critical (red) means act now — losing money or missing impressions. Warning (orange) means watch closely. OK campaigns are hidden from this panel." },
          { title: "Issues list", body: "Plain-English diagnosis: e.g. 'ACoS 38% is 1.5× your target (25%)' or 'Only 18% of budget used — bids might be too low.'" },
          { title: "One-click action buttons", body: "The AI proposes 1–3 concrete fixes per campaign. Clicking applies the change to the local copy (demo) or sends it to the Amazon Ads API (live)." },
        ],
        tip: "AI tip: when multiple actions are suggested, the first one is always the highest-impact. Apply it, re-sync after 24h, and reassess.",
      },
      {
        id: "available-actions",
        title: "What each action does",
        definitions: [
          { term: "Pause until ROAS improves", body: "Triggered when ROAS < 3×. Stops spending until you investigate root cause (bad keywords, wrong price, weak listing)." },
          { term: "Lower top keyword bids 20%", body: "For critical ACoS overruns. Cuts bids on the 10 highest-spend keywords to reduce CPC immediately." },
          { term: "Tune bids down on weak keywords", body: "For moderate ACoS overruns. Touches only the keywords with ACoS above target, leaving profitable ones alone." },
          { term: "Raise bids 10–15%", body: "When budget is underused. Bumps bids on the top-performing keywords to win more impressions." },
          { term: "Raise daily budget 25%", body: "When budget is exhausted before end of day. Gives the campaign more runway without changing bids." },
          { term: "Review keyword relevance", body: "When CTR < 0.3% with many impressions. Flags the campaign for manual keyword review — often signals a search-term mismatch." },
        ],
      },
      {
        id: "table-columns",
        title: "Reading the campaign table",
        paragraphs: [
          "Every row represents one campaign. The AI column shows a 1-word status (Act / Watch / OK) — hover for the full diagnosis. Other columns: Type (SP/SB/SD), Status (Active/Paused), Daily Budget, Spend, Revenue, ROAS, ACoS, Orders, Impressions, Clicks, CTR.",
          "Click a column header to sort. The AI column is non-sortable but you can filter using the status buttons above the table (All / Active / Paused).",
        ],
      },
      {
        id: "toggle-pause",
        title: "Pause or activate a campaign",
        paragraphs: [
          "Click the small pause/play icon on the right of any row. In demo mode the change is local; in live mode it's pushed to Amazon immediately (takes ~2 minutes to propagate).",
        ],
        tip: "AI tip: pausing a campaign stops spend but keeps history. Deleting loses the learning data Amazon's algorithm collected. Prefer pause over delete.",
      },
      {
        id: "edit-budget",
        title: "Change the daily budget inline",
        paragraphs: [
          "Click the pencil icon next to the budget value. Type the new number and press OK. The AI warns you if the new budget is below the average daily spend — that would cap the campaign every morning.",
        ],
      },
    ],
  },

  /* ────────────────────────── CREATE ADS ────────────────────────────── */
  {
    id: "create-ads",
    title: "Create Ads",
    icon: "Megaphone",
    summary: "Guided campaign builder with AI safeguards. From scratch to launched in 4 steps.",
    sections: [
      {
        id: "intro",
        title: "Before you start",
        paragraphs: [
          "The Ads Creator is a 4-step flow: Mode → Product setup → AI generates → Review & launch. Every decision is accompanied by AI guidance — the system warns when you pick a risky option and shows the 'AI pick' badge on its recommendation.",
          "For best results, register the product in My Products first. The Ads Creator will offer it in a dropdown and pre-fill 90% of the form.",
        ],
      },
      {
        id: "step1-mode",
        title: "Step 1 — Mode, Program, Campaign Type",
        steps: [
          {
            title: "Pick a creation mode",
            body: "Automatic AI — Vikingo builds every setting (keywords, bids, match types, strategy) in one click. Best for new users. Manual + Assisted — you configure each field, the AI adds warnings and recommendations on top.",
            tip: "AI tip: start with Automatic for your first 2–3 campaigns. Once you understand the logic, switch to Manual for fine control.",
          },
          {
            title: "Pick an advertising program",
            body: "Amazon Retail (B2C — the usual Amazon.com shoppers — supports SP/SB/SD). Amazon Business (B2B — higher average order value, bulk buyers — supports SP/SB). Amazon Beyond (DSP-style reach off-Amazon — supports SD only).",
            tip: "AI tip: Amazon Retail has the largest audience and is the default pick. Amazon Business requires a Business-registered Amazon account.",
          },
          {
            title: "Pick a campaign type",
            body: "SP (Sponsored Products) — ads in search results or product pages. Cheapest CPCs, best for proven ASINs. SB (Sponsored Brands) — headline/video at the top of search, requires brand registration. SD (Sponsored Display) — banners on Amazon and off-Amazon via DSP, best for retargeting.",
          },
        ],
      },
      {
        id: "step2-product",
        title: "Step 2 — Product & Campaign setup",
        steps: [
          {
            title: "Select a registered product (or enter manually)",
            body: "The dropdown lists everything from My Products with its AI opportunity score. Picking a product auto-fills: name, ASIN, category, top competitors, AI-suggested keywords, notes.",
          },
          {
            title: "Adjust daily budget and target ACoS",
            body: "Daily budget is how much the campaign can spend per day before Amazon pauses it. Target ACoS is what you're willing to pay for sales — Vikingo uses this to calibrate bid suggestions.",
            tip: "AI tip: target ACoS should be below your profit margin. If your margin is 25%, target 15–20% ACoS to stay profitable.",
          },
          {
            title: "Campaign Schedule",
            body: "Campaign Name — leave blank and the AI auto-generates one (e.g. 'SP - Product | Exact | Main'). Start Date — defaults to today. End Date — optional; leave empty to run indefinitely.",
          },
          {
            title: "Default Bid",
            body: "Used for any keyword added without a specific bid. The AI triggers a red safeguard if you pick a default above the category's 90th percentile (~$3).",
          },
          {
            title: "Targeting Type",
            body: "Manual — you pick keywords (best for established products). Automatic — Amazon picks keywords for you from the listing (useful for research in the first 2 weeks, then switch to Manual).",
          },
          {
            title: "Bidding Strategy",
            body: "Dynamic bids - down only (AI pick for new campaigns) — Amazon only lowers bids when conversion is unlikely. Safest. Dynamic bids - up and down — can raise bids up to +100% on hot placements; higher risk of overspend. Fixed bids — your bid never changes automatically; maximum manual control.",
            tip: "AI tip: stick with Down only for the first 4 weeks. Move to Up-and-down once you have data and know which keywords convert.",
          },
        ],
      },
      {
        id: "step3-loading",
        title: "Step 3 — AI generates (no user input)",
        paragraphs: [
          "Vikingo Brain™ does: researches competitors for the ASIN, analyzes search volume, calculates bid ranges per keyword, groups keywords by match type, and picks a campaign structure. Takes ~15–30s in production.",
        ],
      },
      {
        id: "step4-review",
        title: "Step 4 — Review & launch",
        steps: [
          {
            title: "ACoS alert banner",
            body: "If the estimated ACoS is above your target, a red banner appears explaining what to change (usually lower bids on high-competition keywords or raise your price).",
          },
          {
            title: "Keywords table",
            body: "Checkbox to exclude a keyword. Click the bid to edit. The 'AI Bid' pill shows the suggested bid — click it to snap your bid to the AI's number. Up-arrow orange = raise bid. Down-arrow blue = lower bid. Green check = on target.",
          },
          {
            title: "Upload keywords (paste in bulk)",
            body: "Click 'Upload keywords' to paste a list separated by commas, semicolons or newlines. Each added keyword uses the default bid and Broad match type.",
          },
          {
            title: "Negative keyword targeting",
            body: "Words that should NEVER trigger your ad. Add 'free', 'cheap', competitor names, or anything off-brand. Use Exact (blocks only the exact phrase) or Phrase (blocks any phrase containing the term).",
          },
          {
            title: "Negative product targeting",
            body: "Block specific ASINs or brands. Useful in SB/SD campaigns to stop showing on a specific competitor's listing (or prevent them from showing on yours, once they reciprocate).",
          },
          {
            title: "Automation rules",
            body: "Pick from 4 templates: raise bids during high-traffic hours, weekend budget boost, auto-pause keywords above 40% ACoS, auto-pause when inventory drops below 15 days. Toggle them on/off per campaign.",
          },
          {
            title: "Launch",
            body: "Click 'Create Campaign on Amazon'. In demo mode you get a simulated campaign ID. In live mode the campaign is pushed to Amazon Ads and takes ~5 minutes to become active.",
          },
        ],
      },
      {
        id: "best-practices",
        title: "AI-recommended best practices",
        definitions: [
          { term: "1 product per campaign", body: "Don't mix ASINs in the same campaign. You won't know which product is winning or losing." },
          { term: "Split by match type", body: "Separate Exact, Phrase, and Broad into their own campaigns. Different strategies require different bids." },
          { term: "Start with branded keywords", body: "Your own brand name is cheap and converts well. Run it as its own SB 'Brand Defense' campaign." },
          { term: "Let it run 14 days before judging", body: "Amazon's algorithm needs 7–14 days to learn. Don't pause based on day 3 data." },
          { term: "Budget ≥ target ACoS × 20", body: "Rule of thumb: if target ACoS is 25%, daily budget should be at least $25 × 20 = $500... or you won't gather enough data." },
        ],
      },
    ],
  },

  /* ───────────────────────────── KEYWORDS ───────────────────────────── */
  {
    id: "keywords",
    title: "Keywords",
    icon: "KeyRound",
    summary: "Inspect and optimize every keyword in your live campaigns. Edit bids, pause weak ones, catch opportunities.",
    sections: [
      {
        id: "overview",
        title: "What you see",
        paragraphs: [
          "The Keywords page lists every keyword across all your campaigns. Four KPI cards at the top summarize the state: total keywords, active, high ACoS (alert), and 'Bid below suggested' (opportunities).",
          "Filters let you narrow by status (Active/Paused), match type (Exact/Phrase/Broad), and free-text search on the keyword or campaign name.",
        ],
      },
      {
        id: "inline-edit",
        title: "Editing a bid inline",
        paragraphs: [
          "Click the pencil icon next to any bid. Type a new value and press Enter or click OK. The change is local in demo mode and pushed to Amazon immediately in live mode.",
          "If your bid is more than 5% below the suggested bid, an orange up-arrow appears — Vikingo's hint to consider raising it.",
        ],
      },
      {
        id: "alerts",
        title: "What the alerts mean",
        definitions: [
          { term: "High ACoS (>10%)", body: "On its own this might be fine — depends on your margin. But if more than 3 keywords trigger this, the campaign structure is off." },
          { term: "Bid below suggested", body: "Amazon's suggested bid is typically the median winning bid for that keyword. Below it, you're losing the auction more often." },
          { term: "Warning triangle on a row", body: "Shown when ACoS > 10% OR ROAS < 10×. Hover to see which one." },
        ],
        tip: "AI tip: a handful of keywords with very high ACoS are often responsible for 60–80% of the waste. Sort by Spend descending and fix the top 5 first.",
      },
    ],
  },
];
