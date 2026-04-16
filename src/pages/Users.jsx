import React, { useState, useEffect } from "react";
import { Users as UsersIcon, Plus, Trash2, Edit2, Shield, Eye, BarChart3, Crown, Mail, Calendar } from "lucide-react";
import { useCompanies } from "../context/CompaniesContext";

const ROLES = [
  { id: "admin",   label: "Admin",    desc: "Acesso total: editar, criar, excluir", icon: Crown,   color: "text-red-600 bg-red-50 border-red-200" },
  { id: "manager", label: "Gerente",  desc: "Gerenciar campanhas e relatórios",     icon: BarChart3,color: "text-blue-600 bg-blue-50 border-blue-200" },
  { id: "viewer",  label: "Viewer",   desc: "Apenas visualizar dados e relatórios", icon: Eye,      color: "text-gray-600 bg-gray-50 border-gray-200" },
];

const STORAGE_KEY = "vab_users";

const DEFAULT_USERS = [
  { id: "u-001", name: "Admin", email: "admin@vikingo.com", role: "admin", companyId: "demo-001", createdAt: new Date().toISOString(), status: "active" },
];

function useUsers(companyId) {
  const [users, setUsers] = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || DEFAULT_USERS; }
    catch { return DEFAULT_USERS; }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  }, [users]);

  const companyUsers = users.filter(u => u.companyId === companyId);

  const addUser = (data) => {
    const user = { ...data, id: `u-${Date.now()}`, companyId, createdAt: new Date().toISOString(), status: "active" };
    setUsers(prev => [...prev, user]);
  };

  const updateUser = (id, data) => setUsers(prev => prev.map(u => u.id === id ? { ...u, ...data } : u));
  const removeUser = (id) => setUsers(prev => prev.filter(u => u.id !== id));

  return { companyUsers, addUser, updateUser, removeUser };
}

const EMPTY = { name: "", email: "", role: "viewer" };

export default function Users() {
  const { selectedCompany } = useCompanies();
  const { companyUsers, addUser, updateUser, removeUser } = useUsers(selectedCompany?.id);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const ch = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const openAdd = () => { setForm(EMPTY); setEditing(null); setShowForm(true); };
  const openEdit = (user) => { setForm({ name: user.name, email: user.email, role: user.role }); setEditing(user); setShowForm(true); };
  const save = () => {
    if (!form.name || !form.email) return;
    if (editing) { updateUser(editing.id, form); }
    else { addUser(form); }
    setShowForm(false);
    setForm(EMPTY);
    setEditing(null);
  };

  const roleMap = Object.fromEntries(ROLES.map(r => [r.id, r]));
  const admins = companyUsers.filter(u => u.role === "admin").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center">
            <UsersIcon size={20} className="text-violet-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Usuários</h1>
            <p className="text-sm text-gray-500">{selectedCompany?.name} — Amazon US</p>
          </div>
        </div>
        <button onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-xl transition-colors">
          <Plus size={14} /> Adicionar Usuário
        </button>
      </div>

      {/* Role legend */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {ROLES.map(({ id, label, desc, icon: Icon, color }) => (
          <div key={id} className={`border rounded-xl p-3 ${color}`}>
            <div className="flex items-center gap-2 mb-1">
              <Icon size={14} />
              <span className="text-sm font-semibold">{label}</span>
              <span className="ml-auto text-xs font-bold">{companyUsers.filter(u => u.role === id).length}</span>
            </div>
            <p className="text-xs opacity-80">{desc}</p>
          </div>
        ))}
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-4">
          <h3 className="text-sm font-semibold text-gray-800">{editing ? "Editar Usuário" : "Novo Usuário"}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Nome *</label>
              <input name="name" value={form.name} onChange={ch} placeholder="Nome completo"
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">E-mail *</label>
              <input name="email" type="email" value={form.email} onChange={ch} placeholder="email@empresa.com"
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-gray-700 mb-2">Perfil de Acesso *</label>
              <div className="grid grid-cols-3 gap-2">
                {ROLES.map(({ id, label, desc, icon: Icon }) => (
                  <button key={id} type="button" onClick={() => setForm(f => ({ ...f, role: id }))}
                    className={`border-2 rounded-xl p-3 text-left transition-all ${form.role === id ? "border-orange-400 bg-orange-50" : "border-gray-200 hover:border-gray-300"}`}>
                    <div className="flex items-center gap-1.5 mb-1">
                      <Icon size={13} className={form.role === id ? "text-orange-600" : "text-gray-500"} />
                      <span className={`text-xs font-semibold ${form.role === id ? "text-orange-700" : "text-gray-700"}`}>{label}</span>
                    </div>
                    <p className="text-xs text-gray-500 leading-tight">{desc}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => { setShowForm(false); setEditing(null); }} className="px-4 py-2 border border-gray-300 text-gray-700 text-sm rounded-xl hover:bg-gray-50">Cancelar</button>
            <button onClick={save} disabled={!form.name || !form.email}
              className="px-5 py-2 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white text-sm font-semibold rounded-xl transition-colors">
              {editing ? "Salvar" : "Adicionar"}
            </button>
          </div>
        </div>
      )}

      {/* Users list */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-700">{companyUsers.length} usuário{companyUsers.length !== 1 ? "s" : ""}</h2>
        </div>
        <div className="divide-y divide-gray-50">
          {companyUsers.map(user => {
            const role = roleMap[user.role];
            const RoleIcon = role?.icon || Shield;
            const initials = user.name.split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase();
            return (
              <div key={user.id} className="px-4 py-3 flex items-center gap-4 hover:bg-gray-50">
                <div className="w-9 h-9 rounded-full bg-slate-700 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{user.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-gray-500 flex items-center gap-1"><Mail size={9} />{user.email}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border font-medium ${role?.color}`}>
                    <RoleIcon size={10} />{role?.label}
                  </span>
                  <span className="text-xs text-gray-400 flex items-center gap-1 hidden sm:flex">
                    <Calendar size={10} />{new Date(user.createdAt).toLocaleDateString("pt-BR")}
                  </span>
                  <button onClick={() => openEdit(user)} className="p-1.5 text-gray-400 hover:text-blue-500 rounded-lg">
                    <Edit2 size={13} />
                  </button>
                  {!(user.role === "admin" && admins <= 1) && (
                    <button onClick={() => setConfirmDelete(user.id)} className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg">
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
          {companyUsers.length === 0 && (
            <div className="px-4 py-8 text-center text-gray-400 text-sm">Nenhum usuário cadastrado.</div>
          )}
        </div>
      </div>

      {/* Delete confirm modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 shadow-xl max-w-sm w-full mx-4">
            <p className="text-sm font-semibold text-gray-800 mb-4">Remover usuário?</p>
            <p className="text-xs text-gray-500 mb-6">Esta ação não pode ser desfeita.</p>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setConfirmDelete(null)} className="px-4 py-2 border border-gray-300 text-gray-700 text-sm rounded-xl">Cancelar</button>
              <button onClick={() => { removeUser(confirmDelete); setConfirmDelete(null); }} className="px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-xl">Remover</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
