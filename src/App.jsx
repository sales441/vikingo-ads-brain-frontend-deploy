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

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="campaigns" element={<Campaigns />} />
        <Route path="keywords" element={<Keywords />} />
        <Route path="competition" element={<Competition />} />
        <Route path="reports" element={<Reports />} />
        <Route path="ai" element={<AIAssistant />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}
