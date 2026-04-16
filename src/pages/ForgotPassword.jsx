import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Zap, Mail, AlertCircle, RefreshCw, CheckCircle, ArrowLeft } from "lucide-react";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email.includes("@")) return setError("Please enter a valid email.");

    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      // Silently succeed even if the backend is offline — don't leak whether the email exists.
      setSent(true);
    } catch {
      setSent(true);
    } finally {
      setLoading(false);
    }
  };

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
          {sent ? (
            <div className="text-center">
              <CheckCircle size={44} className="text-green-400 mx-auto mb-3" />
              <h1 className="text-white text-xl font-bold mb-2">Check your inbox</h1>
              <p className="text-slate-400 text-sm mb-6">
                If an account exists for <strong className="text-white">{email}</strong>,
                we've just sent a password reset link. The link expires in 1 hour.
              </p>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-orange-400 hover:underline text-sm"
              >
                <ArrowLeft size={14} /> Back to sign in
              </Link>
            </div>
          ) : (
            <>
              <h1 className="text-white text-xl font-bold mb-1">Forgot your password?</h1>
              <p className="text-slate-400 text-sm mb-6">
                Enter your email and we'll send you a link to reset it.
              </p>

              {error && (
                <div className="flex items-center gap-2 bg-red-900/40 border border-red-700/50 text-red-300 rounded-xl px-4 py-3 text-sm mb-4">
                  <AlertCircle size={14} className="flex-shrink-0" />
                  {error}
                </div>
              )}

              <form onSubmit={submit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">Email</label>
                  <div className="relative">
                    <Mail
                      size={15}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                    />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@email.com"
                      autoComplete="email"
                      className="w-full bg-slate-900 border border-slate-600 rounded-xl pl-10 pr-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3 rounded-xl transition-all shadow-lg"
                >
                  {loading ? (
                    <><RefreshCw size={16} className="animate-spin" /> Sending…</>
                  ) : (
                    <>Send reset link</>
                  )}
                </button>
              </form>

              <p className="text-center text-xs text-slate-400 mt-6">
                Remembered it?{" "}
                <Link to="/login" className="text-orange-400 hover:underline font-semibold">Sign in</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
