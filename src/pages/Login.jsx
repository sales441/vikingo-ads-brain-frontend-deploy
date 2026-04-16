import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Zap, Eye, EyeOff, AlertCircle, RefreshCw } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import VikingShip from "../components/VikingShip";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) { setError("Please enter email and password."); return; }
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-orange-500 flex items-center justify-center shadow-lg">
              <Zap size={24} className="text-white" />
            </div>
            <div>
              <p className="text-white font-bold text-xl leading-tight">Vikingo Ads</p>
              <p className="text-orange-400 text-sm font-medium">Brain™</p>
            </div>
          </div>
          <VikingShip size={56} />
          <p className="text-slate-400 text-sm mt-2">Sailing toward sales</p>
        </div>

        {/* Card */}
        <div className="bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl p-8">
          <h1 className="text-white text-xl font-bold mb-1">Sign in to the platform</h1>
          <p className="text-slate-400 text-sm mb-6">Access the Amazon Ads management dashboard</p>

          {error && (
            <div className="flex items-center gap-2 bg-red-900/40 border border-red-700/50 text-red-300 rounded-xl px-4 py-3 text-sm mb-4">
              <AlertCircle size={14} className="flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@email.com"
                autoComplete="email"
                className="w-full bg-slate-900 border border-slate-600 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full bg-slate-900 border border-slate-600 rounded-xl px-4 py-3 pr-12 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex justify-end -mt-1">
              <Link to="/forgot-password" className="text-xs text-slate-400 hover:text-orange-400">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:from-orange-400 disabled:to-orange-400 text-white font-semibold py-3 rounded-xl transition-all shadow-lg mt-2"
            >
              {loading ? (
                <><RefreshCw size={16} className="animate-spin" /> Signing in...</>
              ) : (
                <><Zap size={16} /> Sign in to Vikingo Brain™</>
              )}
            </button>
          </form>

          <p className="text-center text-xs text-slate-400 mt-6">
            No account yet?{" "}
            <Link to="/signup" className="text-orange-400 hover:underline font-semibold">Create one</Link>
          </p>
        </div>

        <p className="text-center text-slate-600 text-xs mt-6">
          Vikingo Ads Brain™ v2.0.0 • Amazon Ads Manager
        </p>
      </div>
    </div>
  );
}
