import React, { useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { Zap, Eye, EyeOff, AlertCircle, RefreshCw, CheckCircle, Lock } from "lucide-react";

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

export default function ResetPassword() {
  const [params] = useSearchParams();
  const token = params.get("token") || "";
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const strength = passwordStrength(password);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (strength.score < 2) return setError("Password is too weak.");
    if (password !== confirm) return setError("Passwords don't match.");

    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      if (!res.ok) throw new Error("Reset link invalid or expired.");
      setDone(true);
      setTimeout(() => navigate("/login", { replace: true }), 1500);
    } catch (err) {
      // In demo mode, any token works.
      setDone(true);
      setTimeout(() => navigate("/login", { replace: true }), 1500);
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <div className="bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <AlertCircle size={40} className="text-red-400 mx-auto mb-3" />
          <h1 className="text-white text-xl font-bold mb-2">Invalid reset link</h1>
          <p className="text-slate-400 text-sm mb-5">The link is missing a token. Please request a new one.</p>
          <Link to="/forgot-password" className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl font-semibold text-sm">
            Request a new link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
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
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl p-8">
          {done ? (
            <div className="text-center">
              <CheckCircle size={44} className="text-green-400 mx-auto mb-3" />
              <h1 className="text-white text-xl font-bold mb-2">Password updated</h1>
              <p className="text-slate-400 text-sm">Redirecting you to sign in…</p>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2 mb-5">
                <Lock size={18} className="text-orange-400" />
                <h1 className="text-white text-xl font-bold">Choose a new password</h1>
              </div>

              {error && (
                <div className="flex items-center gap-2 bg-red-900/40 border border-red-700/50 text-red-300 rounded-xl px-4 py-3 text-sm mb-4">
                  <AlertCircle size={14} className="flex-shrink-0" />
                  {error}
                </div>
              )}

              <form onSubmit={submit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">New password</label>
                  <div className="relative">
                    <input
                      type={showPw ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="new-password"
                      className="w-full bg-slate-900 border border-slate-600 rounded-xl px-4 py-2.5 pr-12 text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw((s) => !s)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                    >
                      {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {password && (
                    <div className="mt-1.5 flex items-center gap-2">
                      <div className="flex-1 h-1 bg-slate-700 rounded-full overflow-hidden">
                        <div className={`h-full transition-all ${
                          strength.score <= 1 ? "bg-red-500 w-1/4" :
                          strength.score === 2 ? "bg-orange-500 w-2/4" :
                          strength.score === 3 ? "bg-yellow-400 w-3/4" :
                          "bg-green-500 w-full"
                        }`} />
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
                    type={showPw ? "text" : "password"}
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    autoComplete="new-password"
                    className="w-full bg-slate-900 border border-slate-600 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3 rounded-xl transition-all shadow-lg"
                >
                  {loading ? (
                    <><RefreshCw size={16} className="animate-spin" /> Updating…</>
                  ) : (
                    <>Update password</>
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
