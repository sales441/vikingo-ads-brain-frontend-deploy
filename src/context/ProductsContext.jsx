import React, { createContext, useContext, useState, useEffect } from "react";

const ProductsContext = createContext(null);
const STORAGE_KEY = "vab_products";

// Mock competitor analysis — replace with real API call later.
function generateMockCompetitorAnalysis(asin, name, category) {
  const base = (asin || name || "").toLowerCase();
  const seed = base.length;
  const vol = (n) => Math.max(5000, (seed * 1731 + n * 97) % 120000);

  return {
    topCompetitors: [
      { asin: "B0A0000001", name: `${category || "Category"} Leader Brand`, price: (19.99 + seed % 15).toFixed(2), rating: 4.5, reviews: 8420, bsr: 142 },
      { asin: "B0A0000002", name: "Amazon Choice Competitor", price: (24.99 + seed % 10).toFixed(2), rating: 4.3, reviews: 3201, bsr: 287 },
      { asin: "B0A0000003", name: "Budget Alternative", price: (14.99 + seed % 5).toFixed(2), rating: 4.1, reviews: 1567, bsr: 492 },
    ],
    suggestedKeywords: [
      { keyword: name?.toLowerCase().split(" ").slice(0, 3).join(" ") || "product", volume: vol(1), competition: "high", suggestedBid: 0.85 },
      { keyword: `best ${category?.toLowerCase() || "product"}`, volume: vol(2), competition: "high", suggestedBid: 0.72 },
      { keyword: `${category?.toLowerCase() || "product"} amazon`, volume: vol(3), competition: "medium", suggestedBid: 0.58 },
      { keyword: `premium ${name?.toLowerCase().split(" ")[0] || "product"}`, volume: vol(4), competition: "medium", suggestedBid: 0.49 },
      { keyword: `${name?.toLowerCase().split(" ")[0] || "product"} for home`, volume: vol(5), competition: "low", suggestedBid: 0.31 },
      { keyword: `cheap ${category?.toLowerCase() || "product"}`, volume: vol(6), competition: "low", suggestedBid: 0.24 },
    ],
    avgPrice: (22.50 + seed % 20).toFixed(2),
    priceRange: { min: (12.99 + seed % 8).toFixed(2), max: (49.99 + seed % 30).toFixed(2) },
    marketSaturation: seed % 3 === 0 ? "low" : seed % 3 === 1 ? "medium" : "high",
    opportunityScore: 60 + (seed % 35),
    aiInsights: [
      "Competition is concentrated in the mid-tier price range. Opportunity at $19–29.",
      "Top-ranked listings use lifestyle images and highlight a specific benefit in the title.",
      "Review gap detected: main weakness across competitors is durability.",
    ],
    analyzedAt: new Date().toISOString(),
  };
}

export function ProductsProvider({ children }) {
  const [products, setProducts] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  }, [products]);

  const addProduct = async (data) => {
    const analysis = generateMockCompetitorAnalysis(data.asin, data.name, data.category);
    const product = {
      id: `prod-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: "active",
      ...data,
      competitorAnalysis: analysis,
    };
    setProducts((prev) => [...prev, product]);
    return product;
  };

  const updateProduct = (id, data) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...data } : p)));
  };

  const deleteProduct = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const refreshAnalysis = (id) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, competitorAnalysis: generateMockCompetitorAnalysis(p.asin, p.name, p.category) }
          : p
      )
    );
  };

  const getProduct = (id) => products.find((p) => p.id === id);

  return (
    <ProductsContext.Provider
      value={{ products, addProduct, updateProduct, deleteProduct, refreshAnalysis, getProduct }}
    >
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const ctx = useContext(ProductsContext);
  if (!ctx) throw new Error("useProducts must be used within ProductsProvider");
  return ctx;
}
