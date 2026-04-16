import React, { useState } from "react";
import {
  Building2, Plus, Edit2, Trash2, CheckCircle, XCircle, ChevronRight, Globe,
  Mail, Key, ExternalLink, Zap, RefreshCw, AlertTriangle, ShieldCheck,
  BrainCircuit,
} from "lucide-react";
import { useCompanies } from "../context/CompaniesContext";

// Build the OAuth URL that will be opened when the user clicks "Connect with Amazon".
// In production the backend would provide a signed state + redirect_uri. Here we use
// the app's own callback page so the flow can be tested in demo mode.
function buildAmazonOAuthUrl(company) {
  const params = new URLSearchParams({
    client_id: import.meta.env.VITE_LWA_CLIENT_ID || "amzn1.application-oa2-client.DEMO",
    scope: "advertising::campaign_management",
    response_type: "code",
    redirect_uri: `${window.location.origin}/oauth/amazon/callback`,
    state: btoa(JSON.stringify({ companyId: company.id, ts: Date.now() })),
  });
  return `https://www.amazon.com/ap/oa?${params.toString()}`;
}

const EMPTY_FORM = {
  name: "", legalName: "", website: "", profileId: "",
  advertiserId: "", clientId: "", clientSecret: "", contactEmail: "",
};

function CompanyForm({ initial = EMPTY_FORM, onSave, onCancel }) {
  const [form, setForm] = useState(initial);
  const [showSecrets, setShowSecrets] = useState(false);
  const ch = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-4">
      <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
        <Building2 size={16} className="text-orange-500" />
        <h3 className="text-sm font-semibold text-gray-800">{initial.name ? "Edit Company" : "New Company"}</h3>
        <span className="ml-auto text-xs bg-blue-50 border border-blue-200 text-blue-700 px-2 py-0.5 rounded-full font-medium">🇺🇸 Amazon US</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">Company Name *</label>
          <input name="name" value={form.name} onChange={ch} placeholder="e.g. My Brand Store"
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">Legal Name</label>
          <input name="legalName" value={form.legalName} onChange={ch} placeholder="e.g. My Brand Store LLC"
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">Contact Email</label>
          <input name="contactEmail" type="email" value={form.contactEmail} onChange={ch} placeholder="ads@mybrand.com"
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">Website / Seller Central URL</label>
          <input name="website" value={form.website} onChange={ch} placeholder="https://sellercentral.amazon.com/..."
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
        </div>
      </div>

      <div className="border-t border-gray-100 pt-4">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Amazon Advertising API — US</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Profile ID</label>
            <input name="profileId" value={form.profileId} onChange={ch} placeholder="e.g. 1234567890"
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-orange-400" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Advertiser ID</label>
            <input name="advertiserId" value={form.advertiserId} onChange={ch} placeholder="e.g. ADV0000000000"
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-orange-400" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Client ID (LWA)</label>
            <input name="clientId" value={form.clientId} onChange={ch} placeholder="amzn1.application-oa2-client..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-orange-400" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Client Secret (LWA)
              <button type="button" onClick={() => setShowSecrets(s => !s)} className="ml-2 text-orange-500 font-normal normal-case">{showSecrets ? "hide" : "show"}</button>
            </label>
            <input name="clientSecret" type={showSecrets ? "text" : "password"} value={form.clientSecret} onChange={ch} placeholder="••••••••••••••••"
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-orange-400" />
          </div>
        </div>
      </div>

      <div className="flex gap-2 pt-2">
        <button onClick={onCancel} className="px-4 py-2 border border-gray-300 text-gray-700 text-sm rounded-xl hover:bg-gray-50">Cancel</button>
        <button onClick={() => { if (form.name) onSave(form); }}
          disabled={!form.name}
          className="px-5 py-2 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white text-sm font-semibold rounded-xl transition-colors">
          Save Company
        </button>
      </div>
    </div>
  );
}

/* ─── Amazon OAuth Connect wizard ─────────────────────────────────────── */
function AmazonConnectButton({ company, onConnected }) {
  const [open, setOpen] = useState(false);
  const [phase, setPhase] = useState("idle"); // idle | authorizing | exchanging | success | error
  const [error, setError] = useState(null);

  const connected = Boolean(company.refreshToken && company.connectedAt);
  const expired = connected && company.tokenExpiresAt && new Date(company.tokenExpiresAt) < new Date();

  const startOAuth = () => {
    setOpen(true);
    setPhase("authorizing");
    setError(null);

    // In production: open Amazon OAuth in a popup and listen for the code.
    //   const w = window.open(buildAmazonOAuthUrl(company), "amazonOAuth", "width=600,height=720");
    //   window.addEventListener("message", receiveOAuthMessage);
    //
    // In demo mode we simulate the full flow so the UX can be tested without
    // a live Amazon Developer application.
    const simulate = async () => {
      await new Promise((r) => setTimeout(r, 1400));
      setPhase("exchanging");
      await new Promise((r) => setTimeout(r, 1200));

      // Randomly fail 1 out of 10 to exercise the error path
      if (Math.random() < 0.1) {
        setPhase("error");
        setError("Amazon returned invalid_grant. Please try again or check that your Ads API application is approved for this marketplace.");
        return;
      }

      const now = new Date();
      const expires = new Date(now.getTime() + 60 * 60 * 1000); // 1h access token
      onConnected({
        profileId: company.profileId || String(Math.floor(Math.random() * 9e9) + 1e9),
        advertiserId: company.advertiserId || `ADV${Math.floor(Math.random() * 9e9) + 1e9}`,
        clientId: company.clientId || "amzn1.application-oa2-client.DEMO",
        clientSecret: company.clientSecret || "•••••demo-secret•••••",
        refreshToken: `Atzr|DEMO-${Math.random().toString(36).slice(2)}`,
        connectedAt: now.toISOString(),
        tokenExpiresAt: expires.toISOString(),
      });
      setPhase("success");
    };
    simulate();
  };

  const disconnect = () => {
    if (!confirm("Disconnect this company from Amazon Ads? You'll need to re-authorize to pull new data.")) return;
    onConnected({
      refreshToken: "",
      connectedAt: null,
      tokenExpiresAt: null,
    });
  };

  return (
    <>
      <button
        onClick={connected ? disconnect : startOAuth}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
          connected && !expired
            ? "bg-green-100 text-green-700 border border-green-200 hover:bg-green-200"
            : expired
            ? "bg-orange-100 text-orange-700 border border-orange-200 hover:bg-orange-200"
            : "bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700"
        }`}
      >
        {connected && !expired && <><ShieldCheck size={12} /> Connected</>}
        {connected && expired && <><RefreshCw size={12} /> Reconnect</>}
        {!connected && <><Zap size={12} /> Connect with Amazon</>}
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-6 py-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center">
                <Zap size={18} className="text-white" />
              </div>
              <div className="flex-1">
                <p className="text-white font-bold">Connect Amazon Ads</p>
                <p className="text-slate-400 text-xs">{company.name}</p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-slate-400 hover:text-white text-xl leading-none"
              >
                ×
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4">
              {/* Step progress */}
              <div className="flex items-center gap-2 mb-2">
                {["authorizing", "exchanging", "success"].map((p, i) => {
                  const phases = { authorizing: 0, exchanging: 1, success: 2, error: 1 };
                  const current = phases[phase] ?? -1;
                  const active = i <= current;
                  return (
                    <React.Fragment key={p}>
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                          active ? "bg-orange-500 text-white" : "bg-gray-200 text-gray-400"
                        }`}
                      >
                        {phase === "success" || i < current ? <CheckCircle size={14} /> : i + 1}
                      </div>
                      {i < 2 && (
                        <div className={`flex-1 h-0.5 ${i < current ? "bg-orange-400" : "bg-gray-200"}`} />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>

              {/* Phase content */}
              {phase === "authorizing" && (
                <div className="space-y-3">
                  <p className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                    <RefreshCw size={14} className="animate-spin text-orange-500" />
                    Redirecting to Amazon…
                  </p>
                  <p className="text-xs text-gray-500">
                    You'll be asked to log in to your Amazon Ads account and approve
                    <strong> Vikingo Ads Brain</strong> to read and manage your campaigns.
                  </p>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-700 flex items-start gap-2">
                    <BrainCircuit size={13} className="flex-shrink-0 mt-0.5" />
                    <span>
                      <strong>AI note:</strong> approval only grants the scope
                      <code className="bg-blue-100 px-1 rounded mx-0.5">advertising::campaign_management</code>.
                      We never see your bank, buyer data, or product reviews.
                    </span>
                  </div>
                </div>
              )}

              {phase === "exchanging" && (
                <div className="space-y-3">
                  <p className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                    <RefreshCw size={14} className="animate-spin text-orange-500" />
                    Exchanging authorization code for refresh token…
                  </p>
                  <p className="text-xs text-gray-500">
                    Vikingo backend is storing the refresh token encrypted. It will be used to
                    generate a new 1-hour access token for every API call.
                  </p>
                </div>
              )}

              {phase === "success" && (
                <div className="space-y-3">
                  <p className="text-sm font-bold text-green-700 flex items-center gap-2">
                    <CheckCircle size={16} /> Connected successfully!
                  </p>
                  <p className="text-xs text-gray-600">
                    Vikingo Brain™ will now sync campaigns for <strong>{company.name}</strong> every 15 minutes.
                    You can force a sync at any time from the Campaigns page.
                  </p>
                  <button
                    onClick={() => setOpen(false)}
                    className="w-full py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl text-sm"
                  >
                    Done
                  </button>
                </div>
              )}

              {phase === "error" && (
                <div className="space-y-3">
                  <p className="text-sm font-bold text-red-700 flex items-center gap-2">
                    <AlertTriangle size={16} /> Could not connect
                  </p>
                  <p className="text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg p-3">{error}</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setOpen(false)}
                      className="flex-1 py-2 border border-gray-300 text-gray-700 font-medium rounded-xl text-sm"
                    >
                      Close
                    </button>
                    <button
                      onClick={startOAuth}
                      className="flex-1 py-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl text-sm"
                    >
                      Retry
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-3 border-t border-gray-100 bg-gray-50 text-xs text-gray-500 flex items-center gap-1.5">
              <ShieldCheck size={11} className="text-green-600" />
              Tokens are encrypted at rest. Revoke anytime from
              <a href="https://www.amazon.com/ap/adam" target="_blank" rel="noreferrer" className="text-orange-600 hover:underline">
                your Amazon account
              </a>
              .
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function Companies() {
  const { companies, selectedCompanyId, addCompany, updateCompany, deleteCompany, selectCompany } = useCompanies();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const handleAdd = (form) => {
    const company = addCompany(form);
    selectCompany(company.id);
    setShowForm(false);
  };

  const handleEdit = (form) => {
    updateCompany(editing.id, form);
    setEditing(null);
  };

  const handleDelete = (id) => {
    deleteCompany(id);
    setConfirmDelete(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
            <Building2 size={20} className="text-blue-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Companies</h1>
            <p className="text-sm text-gray-500">Manage all your Amazon US accounts</p>
          </div>
        </div>
        {!showForm && !editing && (
          <button onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-xl transition-colors">
            <Plus size={14} /> New Company
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Companies", value: companies.length, color: "text-blue-600", bg: "bg-blue-50 border-blue-200" },
          { label: "Active", value: companies.filter(c => c.status === "active").length, color: "text-green-600", bg: "bg-green-50 border-green-200" },
          { label: "Marketplace", value: "🇺🇸 US", color: "text-orange-600", bg: "bg-orange-50 border-orange-200" },
        ].map(({ label, value, color, bg }) => (
          <div key={label} className={`border rounded-xl p-4 text-center ${bg}`}>
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
            <p className="text-xs text-gray-600 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Add form */}
      {showForm && <CompanyForm onSave={handleAdd} onCancel={() => setShowForm(false)} />}

      {/* Edit form */}
      {editing && <CompanyForm initial={editing} onSave={handleEdit} onCancel={() => setEditing(null)} />}

      {/* Company list */}
      <div className="space-y-3">
        {companies.map(company => {
          const isSelected = company.id === selectedCompanyId;
          const initials = company.name.split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase();
          return (
            <div key={company.id} className={`bg-white border-2 rounded-xl p-4 shadow-sm transition-colors ${isSelected ? "border-orange-400" : "border-gray-200"}`}>
              <div className="flex items-center gap-4 flex-wrap">
                {/* Avatar */}
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0 ${isSelected ? "bg-orange-500" : "bg-slate-600"}`}>
                  {initials}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-gray-800">{company.name}</h3>
                    {isSelected && <span className="text-xs bg-orange-100 text-orange-700 border border-orange-200 px-2 py-0.5 rounded-full font-medium">Active</span>}
                    <span className="text-xs bg-blue-50 border border-blue-200 text-blue-700 px-2 py-0.5 rounded-full">🇺🇸 Amazon US</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${company.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                      {company.status === "active" ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mt-1 flex-wrap">
                    {company.legalName && <span className="text-xs text-gray-500">{company.legalName}</span>}
                    {company.contactEmail && (
                      <span className="text-xs text-gray-500 flex items-center gap-1"><Mail size={10} />{company.contactEmail}</span>
                    )}
                    {company.profileId && (
                      <span className="text-xs text-gray-500 flex items-center gap-1"><Key size={10} />Profile: {company.profileId}</span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <AmazonConnectButton
                    company={company}
                    onConnected={(patch) => updateCompany(company.id, patch)}
                  />
                  {!isSelected && (
                    <button onClick={() => selectCompany(company.id)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium rounded-lg transition-colors">
                      Select <ChevronRight size={12} />
                    </button>
                  )}
                  <button onClick={() => setEditing({ ...company })}
                    className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
                    <Edit2 size={15} />
                  </button>
                  {companies.length > 1 && (
                    <button onClick={() => setConfirmDelete(company.id)}
                      className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>
              </div>

              {/* API status row */}
              <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-4 flex-wrap">
                {[
                  { label: "Profile ID", ok: !!company.profileId },
                  { label: "Advertiser ID", ok: !!company.advertiserId },
                  { label: "Client ID", ok: !!company.clientId },
                  { label: "Client Secret", ok: !!company.clientSecret },
                  { label: "Refresh Token", ok: !!company.refreshToken },
                ].map(({ label, ok }) => (
                  <span key={label} className={`flex items-center gap-1 text-xs font-medium ${ok ? "text-green-600" : "text-gray-400"}`}>
                    {ok ? <CheckCircle size={11} /> : <XCircle size={11} />}
                    {label}
                  </span>
                ))}
                {company.connectedAt && (
                  <span className="flex items-center gap-1 text-xs text-gray-500 ml-auto">
                    <ShieldCheck size={11} className="text-green-600" />
                    Connected {new Date(company.connectedAt).toLocaleDateString("en-US")}
                  </span>
                )}
              </div>

              {/* Delete confirm */}
              {confirmDelete === company.id && (
                <div className="mt-3 pt-3 border-t border-red-100 flex items-center gap-3">
                  <p className="text-sm text-red-700 flex-1">Are you sure you want to delete <strong>{company.name}</strong>?</p>
                  <button onClick={() => setConfirmDelete(null)} className="px-3 py-1.5 border border-gray-300 text-gray-700 text-xs rounded-lg">Cancel</button>
                  <button onClick={() => handleDelete(company.id)} className="px-3 py-1.5 bg-red-500 text-white text-xs font-medium rounded-lg">Delete</button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Help box */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-xs text-blue-800 space-y-1.5">
        <p className="font-semibold text-sm text-blue-900">How do I get my Amazon Advertising API credentials?</p>
        <p>1. Go to <strong>advertising.amazon.com</strong> → Settings → API Access</p>
        <p>2. Click "Request Access" to get your Client ID and Secret</p>
        <p>3. The Profile ID is in the URL when you select your account: <code className="bg-blue-100 px-1 rounded">/cm/sp?entityId=XXXXXX</code></p>
        <p>4. The Advertiser ID (entity ID) is also available in your profile settings</p>
      </div>
    </div>
  );
}
