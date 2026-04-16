import React, { useState } from "react";
import { Save, CheckCircle, Globe, Key, AlertCircle, Zap } from "lucide-react";

const MARKETPLACES = [
  { code: "US", label: "Amazon USA (amazon.com)" },
  { code: "CA", label: "Amazon Canada (amazon.ca)" },
  { code: "MX", label: "Amazon Mexico (amazon.com.mx)" },
  { code: "UK", label: "Amazon UK (amazon.co.uk)" },
];

export default function Settings() {
  const [form, setForm] = useState({
    apiUrl: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
    marketplace: "US",
    profileId: "",
    advertiserId: "",
    clientId: "",
    clientSecret: "",
    refreshToken: "",
  });
  const [saved, setSaved] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  const handleChange = (key, val) => {
    setForm(f => ({ ...f, [key]: val }));
    setSaved(false);
    setTestResult(null);
  };

  const handleSave = (e) => {
    e.preventDefault();
    // In production: call saveSettings(form)
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleTest = async () => {
    setTesting(true);
    setTestResult(null);
    await new Promise(r => setTimeout(r, 1200));
    // Mock test result
    setTestResult({ ok: true, msg: "Connection established successfully!" });
    setTesting(false);
  };

  return (
    <div className="max-w-2xl space-y-6">
      {/* Connection */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
          <Globe size={16} className="text-gray-400" />
          <h2 className="text-sm font-semibold text-gray-700">API Connection</h2>
        </div>
        <form onSubmit={handleSave} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Backend API URL</label>
            <input
              type="url"
              value={form.apiUrl}
              onChange={e => handleChange("apiUrl", e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
              placeholder="http://localhost:5000/api"
            />
            <p className="text-xs text-gray-400 mt-1">Base URL of your Node.js/Flask/etc backend server.</p>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Marketplace</label>
            <select
              value={form.marketplace}
              onChange={e => handleChange("marketplace", e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white">
              {MARKETPLACES.map(m => (
                <option key={m.code} value={m.code}>{m.label}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Profile ID</label>
              <input
                type="text"
                value={form.profileId}
                onChange={e => handleChange("profileId", e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                placeholder="e.g. 1234567890"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Advertiser ID</label>
              <input
                type="text"
                value={form.advertiserId}
                onChange={e => handleChange("advertiserId", e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                placeholder="e.g. A1B2C3D4E5F6"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={handleTest}
              disabled={testing}
              className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50">
              <Zap size={14} className={testing ? "animate-pulse text-orange-500" : ""} />
              {testing ? "Testing..." : "Test Connection"}
            </button>

            {testResult && (
              <div className={`flex items-center gap-1.5 text-xs font-medium ${testResult.ok ? "text-green-600" : "text-red-500"}`}>
                {testResult.ok ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
                {testResult.msg}
              </div>
            )}
          </div>
        </form>
      </div>

      {/* Amazon Ads API Credentials */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
          <Key size={16} className="text-gray-400" />
          <h2 className="text-sm font-semibold text-gray-700">Amazon Ads API Credentials</h2>
        </div>
        <div className="p-5 space-y-4">
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 text-xs text-blue-700">
            These credentials are used by the backend to authenticate with the Amazon Advertising API.
            Never share them publicly.
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Client ID (LWA)</label>
            <input
              type="text"
              value={form.clientId}
              onChange={e => handleChange("clientId", e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 font-mono"
              placeholder="amzn1.application-oa2-client.xxxxxxxx"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Client Secret</label>
            <input
              type="password"
              value={form.clientSecret}
              onChange={e => handleChange("clientSecret", e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 font-mono"
              placeholder="••••••••••••••••••••••••••••••"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Refresh Token</label>
            <input
              type="password"
              value={form.refreshToken}
              onChange={e => handleChange("refreshToken", e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 font-mono"
              placeholder="Atzr|IwEBIxxxxxxxxxx..."
            />
          </div>
        </div>
      </div>

      {/* Save button */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-5 py-2.5 bg-orange-500 text-white text-sm font-medium rounded-lg hover:bg-orange-600 transition-colors">
          <Save size={15} />
          Save Settings
        </button>
        {saved && (
          <div className="flex items-center gap-1.5 text-sm text-green-600 font-medium">
            <CheckCircle size={16} />
            Saved successfully!
          </div>
        )}
      </div>

      {/* Version info */}
      <div className="text-xs text-gray-400 pt-2">
        Vikingo Ads Brain™ v0.1.0 — Mode: mock data (connect a backend for real data)
      </div>
    </div>
  );
}
