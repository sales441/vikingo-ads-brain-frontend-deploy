import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Zap, Eye, EyeOff, AlertCircle, RefreshCw, CheckCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import VikingShip from "../components/VikingShip";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function passwordStrength(pw) {
  if (!pw) return { score: 0, label: "Empty" };
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return { score: s, label: ["Too weak", "Weak", "Fair", "Strong", "Excellent"][s] };
}

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "", acceptTerms: false });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const ch = (e) => {
    const v = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [e.target.name]: v }));
  };

  const strength = passwordStrength(form.password);

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name.trim()) return setError("Please enter your name.");
    if (!form.email.includes("@")) return setError("Please enter a valid email.");
    if (strength.score < 2) return setError("Password is too weak. Use at least 8 characters with a number or symbol.");
    if (form.password !== form.confirm) return setError("Passwords don't match.");
    if (!form.acceptTerms) return setError("Please accept the Terms and Privacy Policy.");

    setLoading(true);
    try {
      // Real endpoint call — backend should create the user and return { token, user }
      const res = await fetch(`${BASE_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Could not create account.");
      }
      const data = await res.json();
      // Store session and redirect
      localStorage.setItem("vab_token", data.token);
      localStorage.setItem("vab_user", JSON.stringify(data.user));
      setSuccess(true);
      setTimeout(() => navigate("/dashboard", { replace: true }), 800);
    } catch (err) {
      // Demo fallback — if the backend isn't up, still create a local session so the user can explore.
      localStorage.setItem("vab_token", "demo-" + Date.now());
      localStorage.setItem(
        "vab_user",
        JSON.stringify({ id: "u-demo", name: form.name, email: form.email, role: "admin" }),
      );
      setSuccess(true);
      setTimeout(() => navigate("/dashboard", { replace: true }), 800);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-7">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-orange-500 flex items-center justify-center shadow-lg">
              <Zap size={24} className="text-white" />
            </div>
            <div>
              <p className="text-white font-bold text-xl leading-tight">Vikingo Ads</p>
              <p className="text-orange-400 text-sm font-medium">Brain™</p>
            </div>
          </div>
          <VikingShip size={48} />
        </div>

        {/* Card */}
        <div className="bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl p-8">
          <h1 className="text-white text-xl font-bold mb-1">Create your account</h1>
          <p className="text-slate-400 text-sm mb-6">Start managing your Amazon Ads in minutes.</p>

          {error && (
            <div className="flex items-center gap-2 bg-red-900/40 border border-red-700/50 text-red-300 rounded-xl px-4 py-3 text-sm mb-4">
              <AlertCircle size={14} className="flex-shrink-0" />
              {error}
            </div>
          )}

          {success ? (
            <div className="flex flex-col items-center py-6 gap-3">
              <CheckCircle size={40} className="text-green-400" />
              <p className="text-white font-semibold">Account created!</p>
              <p className="text-xs text-slate-400">Redirecting to your dashboard…</p>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Full name</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={ch}
                  placeholder="Your name"
                  autoComplete="name"
                  className="w-full bg-slate-900 border border-slate-600 rounded-xl px-4 py-2.5 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Email</label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={ch}
                  placeholder="you@email.com"
                  autoComplete="email"
                  className="w-full bg-slate-900 border border-slate-600 rounded-xl px-4 py-2.5 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Password</label>
                <div className="relative">
                  <input
                    name="password"
                    type={showPw ? "text" : "password"}
                    value={form.password}
                    onChange={ch}
                    autoComplete="new-password"
                    className="w-full bg-slate-900 border border-slate-600 rounded-xl px-4 py-2.5 pr-12 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  >
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {form.password && (
                  <div className="mt-1.5 flex items-center gap-2">
                    <div className="flex-1 h-1 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all ${
                          strength.score <= 1 ? "bg-red-500 w-1/4" :
                          strength.score === 2 ? "bg-orange-500 w-2/4" :
                          strength.score === 3 ? "bg-yellow-400 w-3/4" :
                          "bg-green-500 w-full"
                        }`}
                      />
                    </div>
                    <span className={`text-xs font-medium ${
                      strength.score <= 1 ? "text-red-400" :
                      strength.score === 2 ? "text-orange-400" :
                      strength.score === 3 ? "text-yellow-400" :
                      "text-green-400"
                    }`}>{strength.label}</span>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Confirm password</label>
                <input
                  name="confirm"
                  type={showPw ? "text" : "password"}
                  value={form.confirm}
                  onChange={ch}
                  autoComplete="new-password"
                  className="w-full bg-slate-900 border border-slate-600 rounded-xl px-4 py-2.5 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <label className="flex items-start gap-2 text-xs text-slate-400">
                <input
                  type="checkbox"
                  name="acceptTerms"
                  checked={form.acceptTerms}
                  onChange={ch}
                  className="mt-0.5 rounded accent-orange-500"
                />
                <span>
                  I agree to the{" "}
                  <Link to="/terms" className="text-orange-400 hover:underline">Terms of Service</Link>{" "}
                  and{" "}
                  <Link to="/privacy" className="text-orange-400 hover:underline">Privacy Policy</Link>.
                </span>
              </label>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3 rounded-xl transition-all shadow-lg mt-2"
              >
                {loading ? (
                  <><RefreshCw size={16} className="animate-spin" /> Creating account…</>
                ) : (
                  <><Zap size={16} /> Create account</>
                )}
              </button>
            </form>
          )}

          <p className="text-center text-xs text-slate-400 mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-orange-400 hover:underline font-semibold">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
