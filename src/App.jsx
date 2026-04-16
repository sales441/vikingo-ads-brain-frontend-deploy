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
import Companies from "./pages/Companies";
import Users from "./pages/Users";
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
import Products from "./pages/Products";
import Help from "./pages/Help";
import Landing from "./pages/Landing";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Terms from "./pages/Terms";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
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
  return isAuthenticated ? children : <Navigate to="/welcome" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/welcome" element={<Landing />} />
      <Route path="/privacy" element={<PrivacyPolicy />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
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
        <Route path="products"      element={<Products />} />
        <Route path="companies"     element={<Companies />} />
        <Route path="users"         element={<Users />} />
        <Route path="help"          element={<Help />} />
      </Route>
    </Routes>
  );
}
