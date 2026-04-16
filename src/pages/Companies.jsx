import React, { useState } from "react";
import { Building2, Plus, Edit2, Trash2, CheckCircle, XCircle, ChevronRight, Globe, Mail, Key, ExternalLink } from "lucide-react";
import { useCompanies } from "../context/CompaniesContext";

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
                ].map(({ label, ok }) => (
                  <span key={label} className={`flex items-center gap-1 text-xs font-medium ${ok ? "text-green-600" : "text-gray-400"}`}>
                    {ok ? <CheckCircle size={11} /> : <XCircle size={11} />}
                    {label}
                  </span>
                ))}
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
