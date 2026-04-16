import axios from "axios";
import {
  dashboardMetrics,
  campaigns as mockCampaigns,
  keywords as mockKeywords,
  competitionKeywords as mockCompetition,
  spendChartData,
  weeklyData,
} from "../data/mockData";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res.data,
  (err) => {
    const msg = err.response?.data?.message || err.message || "Unknown error";
    return Promise.reject(new Error(msg));
  }
);

// ─── Adapters (backend field names → frontend field names) ───────────────────

function adaptCampaign(c) {
  return {
    ...c,
    // backend uses 'enabled', frontend uses 'active'
    status: c.status === "enabled" ? "active" : c.status,
    // ensure numeric defaults for metrics that may be missing
    revenue: c.revenue ?? 0,
    roas: c.roas ?? 0,
    acos: c.acos ?? 0,
    orders: c.orders ?? 0,
    clicks: c.clicks ?? 0,
    impressions: c.impressions ?? 0,
    ctr: c.ctr ?? 0,
    cpc: c.cpc ?? 0,
    budget: c.budget ?? 0,
    spend: c.spend ?? 0,
    type: c.type ?? "Sponsored Products",
    name: c.name ?? c.id,
  };
}

function adaptKeyword(k) {
  return {
    ...k,
    // backend uses 'text', frontend uses 'keyword'
    keyword: k.keyword ?? k.text ?? "",
    // backend uses 'bids', frontend uses 'bid'
    bid: k.bid ?? k.bids ?? 0,
    suggestedBid: k.suggestedBid ?? 0,
    status: k.status === "enabled" ? "active" : (k.status ?? "active"),
    matchType: k.matchType ?? "broad",
    campaignName: k.campaignName ?? "",
    impressions: k.impressions ?? 0,
    clicks: k.clicks ?? 0,
    ctr: k.ctr ?? 0,
    orders: k.orders ?? 0,
    spend: k.spend ?? 0,
    revenue: k.revenue ?? 0,
    acos: k.acos ?? 0,
    roas: k.roas ?? 0,
  };
}

// ─── Campaigns ───────────────────────────────────────────────────────────────

export async function getCampaigns() {
  try {
    const data = await api.get("/ads/campaigns");
    const list = data?.campaigns ?? data ?? [];
    return Array.isArray(list) ? list.map(adaptCampaign) : mockCampaigns;
  } catch {
    return mockCampaigns;
  }
}

// Like getCampaigns but returns metadata so the UI can tell the user
// whether the data comes from the live Amazon Ads API or the fallback
// demo set. Shape: { campaigns, source: "live" | "demo", error?, syncedAt }.
export async function syncCampaignsFromAmazon() {
  const syncedAt = new Date().toISOString();
  try {
    const data = await api.get("/ads/campaigns");
    const list = data?.campaigns ?? data ?? [];
    if (Array.isArray(list) && list.length > 0) {
      return { campaigns: list.map(adaptCampaign), source: "live", syncedAt };
    }
    return { campaigns: mockCampaigns, source: "demo", syncedAt, error: "Backend responded without campaigns — showing demo data." };
  } catch (e) {
    return {
      campaigns: mockCampaigns,
      source: "demo",
      syncedAt,
      error: e?.message || "Could not reach Amazon Ads API. Showing demo data.",
    };
  }
}

export async function updateCampaign(id, payload) {
  try {
    return await api.put(`/ads/campaigns/${id}`, payload);
  } catch {
    return null;
  }
}

export async function createCampaign(payload) {
  try {
    return await api.post("/ads/campaigns", payload);
  } catch {
    return null;
  }
}

// ─── Keywords ────────────────────────────────────────────────────────────────

export async function getKeywords(campaignId) {
  try {
    const url = campaignId ? `/ads/keywords/${campaignId}` : "/ads/keywords/all";
    const data = await api.get(url);
    const list = data?.keywords ?? data ?? [];
    return Array.isArray(list) ? list.map(adaptKeyword) : mockKeywords;
  } catch {
    return mockKeywords;
  }
}

export async function applyBids(bids) {
  // bids: [{ keywordId, newBid }]
  try {
    return await api.post("/ads/bids/apply", { bids });
  } catch {
    return null;
  }
}

export async function updateKeyword(id, payload) {
  try {
    return await api.put(`/ads/keywords/${id}`, payload);
  } catch {
    return null;
  }
}

export async function createKeyword(payload) {
  try {
    return await api.post("/ads/keywords", payload);
  } catch {
    return null;
  }
}

export async function deleteKeyword(id) {
  try {
    return await api.delete(`/ads/keywords/${id}`);
  } catch {
    return null;
  }
}

// ─── Competition ─────────────────────────────────────────────────────────────

export async function getCompetitionData(keyword) {
  try {
    const data = await api.get("/competition", { params: { keyword } });
    return data ?? mockCompetition;
  } catch {
    return mockCompetition;
  }
}

// ─── Reports / Dashboard ─────────────────────────────────────────────────────

export async function getDashboardMetrics() {
  try {
    const data = await api.get("/reports/dashboard");
    return data ?? dashboardMetrics;
  } catch {
    return dashboardMetrics;
  }
}

export async function getReports(params) {
  try {
    const data = await api.get("/reports", { params });
    return data ?? { spendChartData, weeklyData };
  } catch {
    return { spendChartData, weeklyData };
  }
}

// ─── Settings ────────────────────────────────────────────────────────────────

export async function getSettings() {
  try {
    return await api.get("/settings");
  } catch {
    return null;
  }
}

export async function saveSettings(payload) {
  try {
    return await api.put("/settings", payload);
  } catch {
    return null;
  }
}

export default api;
