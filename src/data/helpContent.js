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

  /* ───────────────────────────── DASHBOARD ──────────────────────────── */
  {
    id: "dashboard",
    title: "Dashboard",
    icon: "LayoutDashboard",
    summary: "The home screen. A live AI summary, 8 KPIs, a 30-day spend vs revenue chart, and your top campaigns at a glance.",
    sections: [
      {
        id: "ai-banner",
        title: "The AI banner on top",
        paragraphs: [
          "The dark banner at the very top is updated every 15 minutes by Vikingo Brain™. It contains four things:",
        ],
        definitions: [
          { term: "Score (0–100)", body: "A single number that tells you if your account is healthy. 80+ = great. 60–79 = tune up needed. Under 60 = urgent action." },
          { term: "Plain-English summary", body: "One sentence describing the overall state of your campaigns." },
          { term: "Top alert (red)", body: "The most important issue the AI detected — usually ACoS overruns or budget caps." },
          { term: "Top recommendation (green)", body: "The highest-impact change you can make right now." },
        ],
        tip: "AI tip: refresh the banner (circular arrow on the right) after making a big change to see how your score moves.",
      },
      {
        id: "kpis",
        title: "The 8 KPIs",
        paragraphs: [
          "Each KPI compares the current period to the previous one (default: last 30 days vs the 30 before that).",
        ],
        definitions: [
          { term: "Total Spend", body: "Sum of ad spend across all campaigns. Delta shows if you're spending more or less than before." },
          { term: "Total Revenue", body: "Sales attributed to ads. Should grow faster than spend — otherwise ACoS climbs." },
          { term: "Orders", body: "Units sold from ads. Useful to see trend when your AOV shifts." },
          { term: "Impressions", body: "How many times an ad was shown. Drops mean lost reach (check bids or budget)." },
          { term: "Clicks", body: "Shoppers who clicked. Trend tells you if your ad is still relevant." },
          { term: "Average ROAS", body: "Revenue ÷ Spend. Should be higher than 1 ÷ (target ACoS)." },
          { term: "Average ACoS", body: "Spend ÷ Revenue. Lower is better. Should be below your margin." },
          { term: "Average CTR", body: "Clicks ÷ Impressions. Industry average is 0.3–0.5%; above 1% is excellent." },
        ],
      },
      {
        id: "chart",
        title: "The 30-day chart",
        paragraphs: [
          "Green line = revenue. Orange line = spend. The area between them is gross profit from ads.",
          "Look for days when the orange crosses above green — those are days you lost money on ads. One or two is normal (testing, stockouts). A pattern is a red flag.",
        ],
      },
      {
        id: "quick-summary",
        title: "Quick Summary card",
        paragraphs: [
          "The side panel shows: active campaigns, best ROAS, lowest ACoS, average CPC, paused campaigns. Quick reality check before diving deeper.",
        ],
      },
      {
        id: "top-campaigns",
        title: "Top Campaigns & Top Search Terms",
        paragraphs: [
          "Two tables at the bottom. Top Campaigns by Revenue shows what's working — clone their structure for new campaigns. Top Search Terms shows real queries that triggered your ads — mine it for new keyword ideas.",
        ],
      },
    ],
  },

  /* ───────────────────────────── AI ASSISTANT ───────────────────────── */
  {
    id: "ai-assistant",
    title: "Vikingo Brain™ AI Assistant",
    icon: "BrainCircuit",
    summary: "Ask anything about your campaigns and get strategic advice. Live campaign health, alerts, and chat-based Q&A.",
    sections: [
      {
        id: "when-to-use",
        title: "When to use the AI Assistant",
        paragraphs: [
          "Use it as a second brain, not a search engine. Best for: 'what should I pause?', 'how do I lower my ACoS?', 'why is campaign X underperforming?', 'which keyword has the best ROAS this week?'.",
          "It reads live campaign data, so answers reflect your actual account, not generic advice.",
        ],
      },
      {
        id: "left-panel",
        title: "The left panel (analysis)",
        paragraphs: [
          "The left side always shows: a health Score, up to 5 Alerts (things to act on), and up to 5 Recommendations (high-impact moves). Click the refresh icon to re-analyze.",
        ],
        definitions: [
          { term: "Alert priority", body: "Alerts are sorted by urgency. The first alert is always the one costing you the most right now." },
          { term: "Recommendation impact", body: "Shown as 'Save ~$X/week' or '+X% revenue'. These are AI estimates, not guarantees." },
        ],
      },
      {
        id: "chat",
        title: "The chat (right panel)",
        paragraphs: [
          "Type a question at the bottom and press Enter. The AI will use your campaign data as context. Try the suggested questions at the bottom of the input to see the style of answers.",
        ],
        tip: "AI tip: be specific. 'Why is my ACoS high?' gives generic advice. 'Why did campaign SP-Main's ACoS jump from 18% to 31% this week?' gives targeted analysis.",
      },
      {
        id: "good-questions",
        title: "Great questions to ask",
        paragraphs: [
          "A curated list of prompts that unlock the most value from Vikingo Brain™.",
        ],
        definitions: [
          { term: "Which campaigns should I pause right now?", body: "Returns a ranked list with reasoning — not just names." },
          { term: "What 5 keywords are wasting the most money?", body: "Pulls last-7-day ACoS and flags the biggest leaks." },
          { term: "How can I lower my average ACoS by 5 points?", body: "Gives a concrete multi-step plan." },
          { term: "What's my best campaign and why?", body: "Explains the pattern so you can replicate it." },
          { term: "Am I underspending on any keyword?", body: "Finds keywords with high impression share loss." },
          { term: "Should I raise my budget?", body: "Checks budget utilization across campaigns before answering." },
        ],
      },
      {
        id: "limits",
        title: "What the AI can and can't do",
        paragraphs: [
          "CAN: read your campaigns, keywords, ACoS, ROAS, impressions, budgets. Suggest concrete actions. Compare campaigns. Explain Amazon Ads concepts.",
          "CAN'T: place orders, call vendors, change prices in Seller Central, talk to Amazon support, or predict the future with certainty. All estimates are based on 30-day history and typical market behavior.",
        ],
      },
    ],
  },

  /* ──────────────────────── LISTING CREATOR ─────────────────────────── */
  {
    id: "listing-creator",
    title: "Create Listing",
    icon: "FileText",
    summary: "Generate SEO-optimized Amazon listings (title, bullets, description, backend keywords) with competitor analysis.",
    sections: [
      {
        id: "what-it-does",
        title: "What Create Listing does",
        paragraphs: [
          "Produces a full listing ready to paste into Seller Central: SEO-optimized title, 5 bullet points, long description, and backend search terms. It also analyzes 3–5 top competitors to find keyword gaps and differentiator angles.",
          "Everything is scored: a title score, an overall listing score, and a ranking estimate (High / Medium / Low).",
        ],
      },
      {
        id: "form-fields",
        title: "Filling the form (step by step)",
        steps: [
          {
            title: "Product name",
            body: "Write the plain, simple name — don't stuff keywords. The AI will do the optimization. E.g. '6Qt Stainless Steel Pressure Cooker' is better than 'Best Premium 6 Qt Electric Pressure Cooker with Lid'.",
          },
          {
            title: "Category",
            body: "Affects word-count limits Amazon enforces (e.g. 200 chars for Home & Kitchen, 150 for Clothing). The AI trims the title to the right length automatically.",
          },
          {
            title: "Marketplace",
            body: "US, CA, or MX. Language, fee structure, and buyer behavior differ — the AI writes differently for each.",
          },
          {
            title: "Main features (one per line)",
            body: "List the concrete features: capacity, material, dimensions, warranty. The AI turns each into a benefit-driven bullet point. Tip: 3–7 features is the sweet spot.",
          },
          {
            title: "Target audience (optional but powerful)",
            body: "'Busy parents cooking for 4' → generates different copy than 'professional chefs'. The more specific, the better.",
          },
          {
            title: "Copy tone",
            body: "Professional (neutral authority), Persuasive (emotional hook), Informative (spec-heavy), Premium/Luxury (high-ticket positioning). Pick the one that matches your price point.",
          },
          {
            title: "Target keywords (comma-separated)",
            body: "The keywords you want to rank for. The AI will place them in title/bullets/backend according to Amazon's weight rules. If left empty, the AI picks from the category.",
          },
          {
            title: "Main competitors (comma-separated names)",
            body: "Feed 3–5 competitor brand names. The AI reads their listings and finds keywords they use but you don't — that's your opportunity gap.",
          },
        ],
      },
      {
        id: "reading-result",
        title: "Reading the output",
        steps: [
          {
            title: "Overall Score",
            body: "Combination of title SEO, bullet clarity, keyword coverage, and length compliance. Aim for 80+. Below 60 the AI will flag specific fixes in 'Optimization tips'." ,
          },
          {
            title: "Title Score",
            body: "Scored on keyword density, placement of primary keyword (first 80 chars are king), character usage, and readability." ,
          },
          {
            title: "Bullet points",
            body: "Copy-paste each individually or all at once (Copy button in each card). Amazon accepts 5 bullets, ~200 chars each." ,
          },
          {
            title: "Description",
            body: "Goes into the 'Product Description' field in Seller Central. If you have Brand Registry, use A+ Content instead and repurpose the copy." ,
          },
          {
            title: "Backend keywords",
            body: "249-character limit. These are invisible to shoppers but indexed by Amazon. The AI never duplicates what's already in title/bullets." ,
          },
          {
            title: "Competitor insights panel",
            body: "Shows keyword gaps (opportunities), suggested differentiators, and a recommended strategy sentence. Read this BEFORE posting the listing." ,
          },
        ],
        tip: "AI tip: if the overall score is below 70, re-generate with more specific features. Generic inputs → generic listings.",
      },
      {
        id: "after-creation",
        title: "After you paste the listing to Amazon",
        paragraphs: [
          "Amazon reindexes listings in 24–72 hours. Don't evaluate impact before day 4. After a week, check the Ranking Tracker page — your organic rank for target keywords should improve.",
          "Keep the old listing version saved somewhere. If the new version doesn't improve conversion in 2 weeks, you can roll back.",
        ],
      },
    ],
  },

  /* ────────────────────── PRICING OPTIMIZER ─────────────────────────── */
  {
    id: "pricing-optimizer",
    title: "Price Optimizer",
    icon: "Tag",
    summary: "AI-driven pricing: find the price that maximizes profit, not just revenue. Scenario simulation + competitor benchmark.",
    sections: [
      {
        id: "why-it-matters",
        title: "Why price matters more than ads",
        paragraphs: [
          "A 10% price increase often outperforms a 50% budget boost. Most sellers leave money on the table by defaulting to 'round down by $1 below the cheapest competitor'.",
          "Price Optimizer finds the price that maximizes profit × volume — not just revenue. It uses category elasticity curves to estimate how your conversion rate changes at different price points.",
        ],
      },
      {
        id: "form",
        title: "Filling the form",
        steps: [
          {
            title: "Product name",
            body: "Used to pull competitor prices. Be specific: '6Qt Electric Pressure Cooker' not just 'Pressure Cooker'." ,
          },
          {
            title: "Current price ($)",
            body: "What you sell for today. This is the baseline for impact calculations." ,
          },
          {
            title: "Product cost ($)",
            body: "Your cost to acquire one unit (supplier price + landing costs). The AI uses this to compute real profit per unit at each scenario price." ,
          },
          {
            title: "Competitors and prices (optional but powerful)",
            body: "Format: 'Instant Pot $79, Ninja $119, Cuisinart $89'. If left empty the AI pulls from the category average." ,
          },
        ],
      },
      {
        id: "reading-result",
        title: "Reading the recommendation",
        paragraphs: [
          "The dark hero card at the top is the headline: Current price → Ideal price, with three impact bubbles (Revenue, Conversion, Profit).",
        ],
        definitions: [
          { term: "Revenue Impact", body: "Total revenue change. Green = up, yellow = slight down. Ideal price often trades some conversion for much higher profit — revenue may dip slightly." },
          { term: "Conversion Impact", body: "Expected conversion rate change. Nearly always negative when raising price. The key is: does profit grow enough to offset?" },
          { term: "Profit Impact", body: "The one that matters. Should be strongly positive. If profit impact is less than +5%, stay put." },
        ],
        tip: "AI tip: if the AI recommends raising price by more than 20%, split it: raise 10% now, wait 2 weeks, measure, then raise another 10%. Smaller moves are easier to walk back.",
      },
      {
        id: "scenarios",
        title: "Scenario simulation table",
        paragraphs: [
          "Shows 5 price points (cheaper than current → more expensive) with projected conversion %, units/month, revenue/month, and profit per unit. The 'ideal' row is highlighted orange.",
          "Useful sanity check: the revenue curve should be dome-shaped. If revenue keeps growing at the highest price, you're still under-priced — test higher.",
        ],
      },
      {
        id: "benchmark",
        title: "Competitor benchmark grid",
        paragraphs: [
          "At the bottom — 5 competitor cards with their price and positioning (Cheaper / Mid / Premium / Top / Entry-level). Useful to see the price bracket you're aiming for.",
        ],
      },
      {
        id: "alerts",
        title: "The alert banners",
        definitions: [
          { term: "Main competitor lowered price", body: "A direct competitor dropped price recently. Consider matching temporarily or emphasizing quality in your listing." },
          { term: "Buy Box lost", body: "You're no longer winning the Buy Box. Could be price, stock, or seller metrics. Check the Competitor Monitor page for details." },
        ],
      },
    ],
  },

  /* ──────────────────────────── A/B TEST ────────────────────────────── */
  {
    id: "ab-test",
    title: "A/B Test",
    icon: "FlaskConical",
    summary: "Compare two listing titles (or generate one) and let the AI predict which converts better — with a confidence score.",
    sections: [
      {
        id: "when-to-use",
        title: "When to run an A/B Test",
        paragraphs: [
          "Any time you're about to change a title, subtitle, or headline on your listing. Titles drive 40–60% of Amazon conversion — a small change can swing sales double digits.",
          "Also useful to validate titles from freelancers or ChatGPT before publishing.",
        ],
      },
      {
        id: "inputs",
        title: "How to feed it",
        steps: [
          { title: "Title – Variant A", body: "Paste your current title. Character counter shows length at a glance." },
          { title: "Title – Variant B", body: "Paste the alternative you want to test. If empty, the AI can generate one based on Variant A." },
          { title: "Product context (optional)", body: "A few words about the product and audience. Improves analysis quality significantly." },
        ],
      },
      {
        id: "reading-output",
        title: "Reading the output",
        paragraphs: [
          "The black banner at the top declares the winner (A or B) with a confidence percentage. Confidence above 90% = ship it. 70–89% = test live if possible. Below 70% = the two titles are too similar.",
        ],
        definitions: [
          { term: "Score per variant", body: "0–100 score on SEO, clarity, benefit communication, and keyword placement." },
          { term: "Strengths / Weaknesses", body: "Plain-English list of what each title does well and poorly." },
          { term: "Estimated impact", body: "Projected CTR lift if you switch to the winning variant." },
          { term: "Recommended next steps", body: "A numbered list of actions — paste the winning title, test live for 2 weeks, move strong keywords to bullets, etc." },
        ],
        tip: "AI tip: the AI rewards titles with the primary keyword in the first 80 characters and a clear benefit statement ('Cook 70% faster' beats 'Digital timer').",
      },
    ],
  },

  /* ────────────────────────── REVIEW ANALYSIS ───────────────────────── */
  {
    id: "review-analysis",
    title: "Review Analysis",
    icon: "Star",
    summary: "Mine competitor reviews to find their weaknesses — and exploit them in your own listing.",
    sections: [
      {
        id: "why",
        title: "Why analyze reviews?",
        paragraphs: [
          "Your competitors' 1- and 2-star reviews are a goldmine. They tell you exactly what shoppers hate about the category — so you can solve those problems in your product, or at least claim you do in the listing.",
          "This is one of the highest-leverage AI tools in Vikingo. Every hour spent here often translates to a measurable conversion lift.",
        ],
      },
      {
        id: "how-to",
        title: "How to run an analysis",
        steps: [
          { title: "Product name / keyword to analyze", body: "Can be your own product, a competitor, or a category term like 'electric pressure cooker'." },
          { title: "Competitor ASIN (optional)", body: "If you want the AI to focus on one specific competitor's reviews, paste their ASIN." },
          { title: "Other competitors (comma-separated)", body: "List of brand names. The AI aggregates patterns across all of them." },
          { title: "Run analysis", body: "Takes ~10–20 seconds in production. Reads hundreds of reviews behind the scenes." },
        ],
      },
      {
        id: "reading-result",
        title: "Reading the result",
        definitions: [
          { term: "Sentiment breakdown", body: "% positive, neutral, negative across all reviews analyzed. Good benchmark: if competitor positive % is below 70, they have quality issues you can exploit." },
          { term: "Weaknesses (ranked)", body: "The recurring complaints, ordered by frequency. These are your opportunities." },
          { term: "Strengths", body: "What competitors do well — you need to at least match these." },
          { term: "Opportunities for your product", body: "Concrete actions: improve this feature, add that accessory, create a video manual, etc." },
          { term: "AI-suggested differentiator", body: "The one headline claim that would directly attack the #1 competitor weakness. Paste this into your title or A+ content." },
          { term: "Negative keywords in reviews", body: "Words like 'leaking', 'hot handle', 'broken'. Avoid these in your own listing — they create unwanted associations." },
        ],
      },
    ],
  },

  /* ──────────────────────── PRODUCT DISCOVERY ───────────────────────── */
  {
    id: "product-discovery",
    title: "Product Discovery",
    icon: "Compass",
    summary: "Find new products to launch. AI scans categories for high-demand, low-competition niches that match your budget and margin target.",
    sections: [
      {
        id: "use-case",
        title: "Who should use this",
        paragraphs: [
          "Sellers thinking about their next SKU. It won't tell you what will succeed, but it narrows the field from 'millions of products' to '10 promising niches' in seconds.",
          "Best used as a first filter — always validate the top picks manually before committing inventory.",
        ],
      },
      {
        id: "form",
        title: "Filling the form",
        steps: [
          { title: "Category of interest", body: "Pick a broad category you know. Niching inside a familiar area beats chasing trends in unknown ones." },
          { title: "Available budget ($)", body: "Total capital you can invest (inventory + advertising + misc). Narrows recommendations to products that fit." },
          { title: "Minimum target margin (%)", body: "Anything below this won't be shown. 25–30% is typical for FBA private-label." },
          { title: "Products you already sell (optional)", body: "Helps the AI avoid suggesting products that would cannibalize your current catalog." },
        ],
      },
      {
        id: "reading-output",
        title: "Reading the opportunities",
        paragraphs: [
          "Each opportunity card has: product idea name, AI score (0–100), demand level, competition level, estimated margin, average market price, trend (rising/stable/declining), and a short rationale explaining the score.",
          "The colored border reflects the score: green (80+) = strong pick, orange (70–79) = worth researching, red (below 70) = probably skip.",
        ],
        definitions: [
          { term: "Growing Trends section", body: "Macro patterns the AI sees in the market. Useful for positioning even if you don't pick a specific suggestion." },
          { term: "Niches to Avoid", body: "Categories the AI recommends staying away from (saturated, dominated by big brands, fragile products, etc.)." },
        ],
        tip: "AI tip: before ordering inventory for a suggested product, register it as a new product in My Products and run the full competitor analysis. Trust but verify.",
      },
    ],
  },

  /* ────────────────────── PROFITABILITY CALC ────────────────────────── */
  {
    id: "profitability",
    title: "Profitability Calculator",
    icon: "Calculator",
    summary: "Standalone calculator for any product idea. Tweak price/cost/ads and see margin, ROI and break-even live.",
    sections: [
      {
        id: "vs-products",
        title: "When to use this vs My Products",
        paragraphs: [
          "My Products persists each SKU with full competitor analysis — use it for products you actively sell.",
          "The Profitability Calculator is for one-off simulations: evaluating a new supplier quote, testing a hypothetical price, comparing two SKUs side by side. Nothing is saved.",
        ],
      },
      {
        id: "inputs",
        title: "All the inputs",
        steps: [
          { title: "Selling Price", body: "Final price on Amazon." },
          { title: "Product Cost", body: "Landed supplier cost per unit." },
          { title: "FBA Size tier", body: "Small ($3.22), Medium ($5.40), Large ($8.60), XLarge ($15.20). If unsure, start with Medium." },
          { title: "Marketplace", body: "Determines referral % (US/CA 15%, some categories 8%)." },
          { title: "Ad spend per unit", body: "Target ad cost per conversion. If ACoS target is 20% and price is $30, that's $6 per unit." },
          { title: "Units per month (estimated)", body: "Used to compute monthly profit. Conservative 50 → realistic 150 → aspirational 300." },
          { title: "Advanced: Other Costs & Tax Rate", body: "Packaging, returns, insurance, income tax %. Expand to include these." },
        ],
      },
      {
        id: "reading-output",
        title: "Reading the results",
        definitions: [
          { term: "Status card", body: "Excellent (margin ≥25%), Acceptable (15–25%), Low margin (0–15%), Losing money (negative). Color-coded." },
          { term: "Profit per unit", body: "Dollars you keep after every fee and cost." },
          { term: "Net margin (%)", body: "Profit ÷ Price. The number everybody quotes. Below 15% is fragile." },
          { term: "ROI (%)", body: "Profit ÷ Cost. How fast you're multiplying your capital per cycle." },
          { term: "Est. monthly profit", body: "Profit × units. Useful for cashflow planning." },
          { term: "Cost Breakdown", body: "Line-by-line list of every outflow. If a number looks wrong, you know exactly where to dig." },
          { term: "Break-even price", body: "The price below which you lose money. Never quote below this — not even in Black Friday promos." },
        ],
        tip: "AI tip: run three scenarios — conservative (low volume, high ads), realistic (medium both), aspirational (high volume, low ads). If conservative is profitable, the SKU is safe.",
      },
    ],
  },

  /* ───────────────────────────── P&L ────────────────────────────────── */
  {
    id: "pnl",
    title: "P&L Dashboard",
    icon: "TrendingUp",
    summary: "Full Profit & Loss across 3 / 6 / 12 months. Revenue vs costs vs profit, cost breakdown, monthly table.",
    sections: [
      {
        id: "overview",
        title: "What P&L shows",
        paragraphs: [
          "Your business health over time. Unlike the Dashboard (which focuses on ads), P&L includes everything: revenue, COGS (cost of goods), Amazon fees, ads, taxes, and net profit.",
          "Use the 3m / 6m / 12m toggle at the top right to change the view. 12 months is the default for spotting seasonal patterns.",
        ],
      },
      {
        id: "kpis",
        title: "The four KPIs",
        definitions: [
          { term: "Total Revenue", body: "Sum of sales across the selected period." },
          { term: "Net Profit", body: "Revenue minus every cost. This is your paycheck." },
          { term: "Average Margin", body: "Net profit ÷ revenue. Aim for 15%+ to have room for growth investment." },
          { term: "Last month change", body: "Month-over-month revenue delta. Green = growing, red = declining." },
        ],
      },
      {
        id: "chart",
        title: "Revenue vs Costs vs Profit chart",
        paragraphs: [
          "Three bars per month: green (revenue), orange (total costs), blue (net profit). When blue is a thick slice = healthy month. Blue below zero = loss month.",
          "Look for the pattern, not just the last month. Two consecutive loss months = investigate urgently.",
        ],
      },
      {
        id: "breakdown",
        title: "Cost breakdown (% of total costs)",
        paragraphs: [
          "COGS (usually the biggest), Amazon fees (~25–30% of revenue in FBA), ads (15–25% is normal), taxes (varies by region). Any line above its typical range is a red flag.",
        ],
        definitions: [
          { term: "COGS > 45% of revenue", body: "Supplier cost too high. Renegotiate or switch." },
          { term: "Amazon fees > 35%", body: "Low-margin category or oversized FBA. Consider FBM or repricing." },
          { term: "Ads > 30%", body: "Either ACoS is out of control, or organic is broken and you're over-relying on ads." },
        ],
      },
      {
        id: "monthly-table",
        title: "Monthly P&L table",
        paragraphs: [
          "Scrollable month-by-month numbers. Export to CSV (coming) for your accountant. Red margin % = loss month.",
        ],
      },
    ],
  },

  /* ─────────────────────────── REPORTS ──────────────────────────────── */
  {
    id: "reports",
    title: "Reports & Analytics",
    icon: "BarChart3",
    summary: "Deep-dive ads performance. Campaign-level breakdown, weekly ROAS/ACoS evolution, CSV export.",
    sections: [
      {
        id: "period",
        title: "Choosing the period",
        paragraphs: [
          "Top-left selector: 7 days / 30 days / 90 days. 7d is noisy — use it only to spot fresh issues. 30d is the honest performance window. 90d reveals trends.",
        ],
      },
      {
        id: "summary",
        title: "Summary KPIs (top row)",
        paragraphs: [
          "Total Spend, Total Revenue, Orders, Impressions, Clicks — aggregated for the chosen period. Useful to confirm what you'll see in the charts below.",
        ],
      },
      {
        id: "charts",
        title: "The two charts",
        definitions: [
          { term: "Spend vs Revenue by Period (bar chart)", body: "Grouped bars. Useful to see spend/revenue balance per day or week." },
          { term: "ROAS and ACoS Trend (line chart)", body: "ROAS on left axis, ACoS on right. Ideal pattern: ROAS climbing, ACoS flat or declining. Both climbing = revenue grew but cost grew faster — investigate." },
        ],
      },
      {
        id: "campaign-table",
        title: "Campaign Performance table",
        paragraphs: [
          "Full data per campaign: spend, revenue, ROAS, ACoS, orders, impressions, clicks, CTR, CPC. The TOTAL row at the bottom is the account-level rollup.",
          "Sort by any column by clicking the header. Red ACoS > 10% means over-target — not necessarily bad if margin allows, but always worth reviewing.",
        ],
      },
      {
        id: "export",
        title: "Export to CSV",
        paragraphs: [
          "Click the Export CSV button top-right. Contains the full campaign table. Import into Excel / Google Sheets for custom pivots or share with a stakeholder.",
        ],
        tip: "AI tip: export once a month and keep a running archive. Amazon only keeps 90 days of granular data — your own archive becomes a long-term benchmark.",
      },
    ],
  },

  /* ──────────────────── COMPETITOR MONITOR ──────────────────────────── */
  {
    id: "competitor-monitor",
    title: "Competitor Monitor",
    icon: "Eye",
    summary: "Real-time alerts when competitors drop price, run out of stock, or change rating — so you can react in minutes.",
    sections: [
      {
        id: "why",
        title: "Why monitor competitors",
        paragraphs: [
          "Amazon is a price/stock auction. When a competitor runs out or cuts price, the Buy Box shifts — you can grab thousands of extra sales in 48 hours if you raise bids at the right moment.",
          "Without monitoring, you miss these windows. Vikingo polls tracked competitors every 30 minutes and raises alerts.",
        ],
      },
      {
        id: "adding",
        title: "Adding a competitor",
        steps: [
          { title: "Paste the ASIN", body: "Grab the 10-char ID from any Amazon listing URL." },
          { title: "Click Monitor", body: "Vikingo starts polling price, stock, rating, review count, and BSR." },
        ],
        tip: "AI tip: track 3–7 direct competitors per SKU. More than that creates noise.",
      },
      {
        id: "alerts",
        title: "Alerts to watch",
        definitions: [
          { term: "Price drop (green)", body: "Match or undercut if margin allows. Or raise bids on shared keywords to steal traffic." },
          { term: "Out of stock (blue)", body: "The highest-value alert. Raise your bids +30–50% for 24–48h to capture their Buy Box." },
          { term: "Price up (orange)", body: "Your relative position improved. Consider raising your own price slightly — the market just shifted up." },
          { term: "BSR drop", body: "Competitor gaining rank. Investigate what changed (new creative, deal, review burst)." },
        ],
      },
      {
        id: "table",
        title: "Reading the competitor table",
        paragraphs: [
          "Each row has: product name, price (today), price change %, stock badge, rating + review count, BSR + delta, and per-product alert toggles.",
          "Toggle the bell icon to enable/disable price alerts. Toggle the package icon to enable/disable stock alerts.",
        ],
      },
    ],
  },

  /* ──────────────────── RANKING TRACKER ─────────────────────────────── */
  {
    id: "ranking-tracker",
    title: "Ranking Tracker",
    icon: "Award",
    summary: "Track your organic and paid rank for specific keywords over 30 days. Spot wins and regressions immediately.",
    sections: [
      {
        id: "organic-vs-paid",
        title: "Organic vs Paid ranking",
        paragraphs: [
          "Organic rank: your natural position in search results, driven by sales velocity, CTR, and conversions.",
          "Paid rank: where your Sponsored ad appears for that keyword. Driven by your bid and relevance.",
          "Both matter. Good SEO (organic) means cheaper traffic. Good bid management (paid) means guaranteed presence.",
        ],
      },
      {
        id: "tracking",
        title: "Tracking a keyword",
        steps: [
          { title: "Type keyword", body: "The exact phrase you want to rank for. Start with 3–5 main terms." },
          { title: "Click Track", body: "Vikingo polls your rank every 12 hours and plots the history." },
          { title: "Remove with trash icon", body: "Stop tracking anytime. History is preserved." },
        ],
      },
      {
        id: "reading-chart",
        title: "Reading the chart",
        paragraphs: [
          "Y-axis is inverted: #1 is the TOP of the chart. Line going UP = rank improving. Line going DOWN = slipping.",
          "Toggle Organic / Paid view at the top right to switch between the two. Compare both for the same keyword to understand how ads are affecting organic.",
        ],
        tip: "AI tip: after 7 days of running ads on a keyword, check if the organic line also improved. That's a sign the Amazon algorithm is rewarding you.",
      },
      {
        id: "deltas",
        title: "Ranking deltas (KPI cards)",
        paragraphs: [
          "Each KPI card shows current rank + 7-day delta. Green arrow = climbed. Red arrow = slipped. Flat = stable.",
        ],
      },
    ],
  },

  /* ───────────────────── INVENTORY ALERTS ───────────────────────────── */
  {
    id: "inventory",
    title: "Inventory Alerts",
    icon: "Package",
    summary: "Automatic ad pause when stock runs low — protects your listing from the out-of-stock ranking penalty.",
    sections: [
      {
        id: "why",
        title: "Why this matters",
        paragraphs: [
          "Amazon PUNISHES listings that run out of stock. Your organic rank drops, and you can lose a #1 position it took months to earn.",
          "Worse: if your ads keep running while you have no stock, you pay for clicks that can't convert. Double whammy.",
          "Auto-pause prevents both. When stock dips below threshold, Vikingo pauses the ads automatically.",
        ],
      },
      {
        id: "adding",
        title: "Registering a product",
        steps: [
          { title: "Click Add Product", body: "A form opens." },
          { title: "Fill Name, ASIN, Current Stock, Minimum Stock, Daily Sales", body: "Daily Sales is the average units sold per day — used to calculate days-remaining." },
          { title: "Toggle 'Pause ads automatically'", body: "If on, Vikingo pauses when stock < minimum. If off, you only get a notification." },
        ],
      },
      {
        id: "status",
        title: "Status meanings",
        definitions: [
          { term: "Stock OK (green)", body: "Stock is above minimum. Days left is shown per card." },
          { term: "Low Stock (yellow)", body: "Below minimum but not zero. Time to reorder or start a replenishment shipment." },
          { term: "Critical (red)", body: "Zero or nearly zero. If auto-pause is on, ads are stopped. If off, decide urgently." },
        ],
      },
      {
        id: "best-practices",
        title: "AI-recommended thresholds",
        paragraphs: [
          "Minimum Stock should equal 'days to next shipment' × average daily sales. If your supplier ships in 30 days and you sell 10/day, set min = 300.",
          "For FBA, factor in inbound time (another 2–5 days) and add a buffer of 20%.",
        ],
      },
    ],
  },

  /* ───────────────────── SEASONAL TRENDS ────────────────────────────── */
  {
    id: "seasonal",
    title: "Seasonal Trends",
    icon: "Calendar",
    summary: "Annual demand calendar + upcoming shopping events. Plan inventory and ad budgets 30 / 60 / 90 days out.",
    sections: [
      {
        id: "why",
        title: "Why seasonality matters",
        paragraphs: [
          "Amazon traffic swings 2–3× between low and high seasons for many categories. If you treat December the same as March, you're leaving money on the table (or overspending in slow months).",
          "This page helps plan both inventory (so you don't stock out in peak) and ad budget (so you don't burn money in dead months).",
        ],
      },
      {
        id: "current-month",
        title: "Current Month card",
        paragraphs: [
          "The dark card at the top shows the current month's Demand Index (0–100), estimated average CPC, estimated conversion rate, and opportunity index. Use as a baseline.",
        ],
      },
      {
        id: "upcoming-events",
        title: "Upcoming events (next 3 months)",
        paragraphs: [
          "Color-coded by impact. Red = very high (Black Friday, Christmas). Orange = high (Prime Day, Mother's Day). Yellow = medium. Each event has a concrete tip — e.g. 'Start advertising 3 weeks before, raise budget 3× during event week.'",
        ],
        tip: "AI tip: send your FBA inventory 45 days before peak events. Amazon's inbound warehouses get clogged in Oct–Dec.",
      },
      {
        id: "annual-chart",
        title: "Annual Demand Calendar chart",
        paragraphs: [
          "Toggle Demand / CPC / Conversion at the top right to switch the metric. Bar heights let you compare every month at a glance.",
        ],
      },
      {
        id: "all-events-table",
        title: "All Events table",
        paragraphs: [
          "The full-year calendar — month, event, impact, and specific tip per event. Use this to lay out your marketing calendar for the year.",
        ],
      },
    ],
  },

  /* ───────────────────────────── COMPANIES ──────────────────────────── */
  {
    id: "companies",
    title: "Companies",
    icon: "Building2",
    summary: "Manage one or many Amazon seller accounts. Each company has its own credentials, users, and campaigns.",
    sections: [
      {
        id: "why-multiple",
        title: "Why Companies?",
        paragraphs: [
          "Agencies typically manage several Amazon accounts. Even solo sellers often run separate entities (LLCs) to segment risk.",
          "A Company in Vikingo represents one Amazon Ads account. Switching company with the selector at the top-right changes everything the app shows — campaigns, reports, products, users.",
        ],
      },
      {
        id: "fields",
        title: "Company fields explained",
        definitions: [
          { term: "Company Name *", body: "Short display name. Shown in the company selector." },
          { term: "Legal Name", body: "LLC / corporation name for internal reference. Not sent to Amazon." },
          { term: "Contact Email", body: "Default contact — used when sending internal notifications (stock alerts, ACoS alerts)." },
          { term: "Website / Seller Central URL", body: "Helpful for users managing several brands to identify the right account quickly." },
          { term: "Profile ID", body: "Amazon Advertising profile numeric ID. Required for API calls." },
          { term: "Advertiser ID", body: "The entity ID. Required for some SB/SD campaign types." },
          { term: "Client ID (LWA)", body: "From your Amazon Developer Security Profile. Starts with 'amzn1.application-oa2-client.'" },
          { term: "Client Secret (LWA)", body: "Paired with Client ID. Never share publicly. Stored encrypted." },
        ],
      },
      {
        id: "connect",
        title: "Connecting a company to Amazon",
        paragraphs: [
          "See the full Connect Amazon Ads topic. Short version: click 'Connect with Amazon' on the company card → authorize → Vikingo stores the refresh token.",
        ],
      },
      {
        id: "status-checklist",
        title: "Status checklist (bottom of card)",
        paragraphs: [
          "Five small indicators show if each credential is filled: Profile ID, Advertiser ID, Client ID, Client Secret, Refresh Token. Green check = filled. Gray X = missing.",
          "A company is fully ready when all five are green. Until then, ads functionality is demo-only for that company.",
        ],
      },
    ],
  },

  /* ───────────────────────────── USERS ──────────────────────────────── */
  {
    id: "users",
    title: "Users",
    icon: "Users",
    summary: "Invite teammates with role-based access. Users are scoped per company.",
    sections: [
      {
        id: "overview",
        title: "Per-company users",
        paragraphs: [
          "A user can have different roles in different companies. Switching company shows only that company's users.",
        ],
      },
      {
        id: "roles",
        title: "The three roles",
        definitions: [
          { term: "Admin", body: "Full access. Can edit any setting, create/delete campaigns, manage users, change credentials. Reserved for owners and trusted senior staff." },
          { term: "Manager", body: "Can view and edit campaigns and reports. Cannot manage users or credentials. Ideal for internal media buyers." },
          { term: "Viewer", body: "Read-only. Can see data and reports but can't change anything. Good for clients or stakeholders." },
        ],
      },
      {
        id: "adding",
        title: "Adding a user",
        steps: [
          { title: "Click Add User", body: "The form opens." },
          { title: "Enter name + email", body: "Email is where the invite is sent. In demo mode no email is sent — the user is created locally." },
          { title: "Pick a role", body: "Three cards; pick one. You can change later." },
          { title: "Add", body: "User appears in the list with their role badge and date added." },
        ],
      },
      {
        id: "protection",
        title: "The last-admin rule",
        paragraphs: [
          "A company must always have at least 1 admin. Vikingo hides the delete button for the last remaining admin. To replace, promote another user first, then delete the previous admin.",
        ],
      },
    ],
  },

  /* ───────────────────────────── SETTINGS ───────────────────────────── */
  {
    id: "settings",
    title: "Settings",
    icon: "Settings",
    summary: "App-level preferences: API URL, default marketplace, and credentials (mirrored from the Company).",
    sections: [
      {
        id: "api",
        title: "API Connection",
        definitions: [
          { term: "Backend API URL", body: "Where Vikingo's backend is hosted. Defaults to http://localhost:5000/api in development. Change if you're pointing to staging or production." },
          { term: "Marketplace", body: "Default Amazon marketplace used for new companies. US, CA, MX, UK." },
        ],
      },
      {
        id: "credentials",
        title: "Credential fields",
        paragraphs: [
          "Same credentials as in the Company card. Edit here for global defaults; edit in Company for per-account overrides.",
        ],
      },
      {
        id: "test",
        title: "Test Connection",
        paragraphs: [
          "The Test Connection button calls the backend with the current credentials and reports success or error. Run this after any credential change — don't assume.",
        ],
      },
    ],
  },
];
