import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Campaigns from "./pages/Campaigns";
import Keywords from "./pages/Keywords";
import Competition from "./pages/Competition";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import AIAssistant from "./pages/AIAssistant";
import ListingCreator from "./pages/ListingCreator";
import AdsCreator from "./pages/AdsCreator";
import Login from "./pages/Login";
import Profitability from "./pages/Profitability";
import PnL from "./pages/PnL";
import CompetitorMonitor from "./pages/CompetitorMonitor";
import RankingTracker from "./pages/RankingTracker";
import ReviewAnalysis from "./pages/ReviewAnalysis";
import PricingOptimizer from "./pages/PricingOptimizer";
import InventoryAlerts from "./pages/InventoryAlerts";
import SeasonalTrends from "./pages/SeasonalTrends";
import ABTest from "./pages/ABTest";
import ProductDiscovery from "./pages/ProductDiscovery";
import { useAuth } from "./context/AuthContext";

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard"     element={<Dashboard />} />
        <Route path="campaigns"     element={<Campaigns />} />
        <Route path="keywords"      element={<Keywords />} />
        <Route path="competition"   element={<Competition />} />
        <Route path="reports"       element={<Reports />} />
        <Route path="ai"            element={<AIAssistant />} />
        <Route path="listing"       element={<ListingCreator />} />
        <Route path="ads"           element={<AdsCreator />} />
        <Route path="settings"      element={<Settings />} />
        <Route path="profitability" element={<Profitability />} />
        <Route path="pnl"           element={<PnL />} />
        <Route path="monitor"       element={<CompetitorMonitor />} />
        <Route path="ranking"       element={<RankingTracker />} />
        <Route path="reviews"       element={<ReviewAnalysis />} />
        <Route path="pricing"       element={<PricingOptimizer />} />
        <Route path="inventory"     element={<InventoryAlerts />} />
        <Route path="trends"        element={<SeasonalTrends />} />
        <Route path="abtest"        element={<ABTest />} />
        <Route path="discover"      element={<ProductDiscovery />} />
      </Route>
    </Routes>
  );
}
