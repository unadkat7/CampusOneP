import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const DEMO_ACCOUNTS = [
  {
    role: "Admin",
    email: "admin@campusone.com",
    password: "admin@campusone#",
  },
  {
    role: "Faculty",
    email: "rajesh.sharma@campusone.com",
    password: "rajesh@10041975#",
  },
  {
    role: "Student",
    email: "aarav.patel@campusone.com",
    password: "aarav@15032004#",
  },
];

/**
 * Login — Production-grade split-screen login page with quick role chips.
 */

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const fillDemoAccount = (account) => {
    setEmail(account.email);
    setPassword(account.password);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const success = await login(email, password);
      if (success) {
        navigate("/dashboard", { replace: true });
      } else {
        setError("Invalid email address or password.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please verify credentials.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-900 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Left Panel — Platform Highlights */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-950 p-12 flex-col justify-between overflow-hidden border-r border-slate-800">
        {/* Subtle background grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30"></div>

        {/* Top Branding */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
            </svg>
          </div>
          <span className="font-bold text-xl tracking-tight text-white">CampusOne</span>
        </div>

        {/* Center Content */}
        <div className="relative z-10 my-auto max-w-lg space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
            Unified Digital Campus System
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight leading-tight text-white">
            Everything your campus needs, in one seamless platform.
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed">
            Role-based ERP management, digital interactive classrooms, real-time attendance tracking, automated fee portal, and an integrated LeetCode-style coding practice environment.
          </p>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-3 gap-4 pt-4">
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 text-left backdrop-blur-xs">
              <div className="text-xl font-extrabold text-white">3 Modules</div>
              <div className="text-[11px] text-slate-400 font-medium">ERP, Classroom, CodeStage</div>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 text-left backdrop-blur-xs">
              <div className="text-xl font-extrabold text-white">22+ Schemas</div>
              <div className="text-[11px] text-slate-400 font-medium">Fully Normalized MongoDB</div>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 text-left backdrop-blur-xs">
              <div className="text-xl font-extrabold text-white">RBAC Auth</div>
              <div className="text-[11px] text-slate-400 font-medium">Student, Faculty & Admin</div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="relative z-10 text-xs text-slate-500 flex items-center justify-between">
          <span>CampusOne Digital Portal</span>
          <span>Security • Role-Based Encrypted Auth</span>
        </div>
      </div>

      {/* Right Panel — Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-slate-900">
        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <div>
            <div className="flex items-center gap-2.5 lg:hidden mb-6">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
                </svg>
              </div>
              <span className="font-bold text-lg text-white">CampusOne</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-white">Sign in to your account</h2>
            <p className="text-xs text-slate-400 mt-1">Enter your registered credentials to access your portal.</p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium flex items-center gap-2">
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@campusone.com"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-100 text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-100 text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 text-xs font-medium"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm tracking-wide shadow-lg shadow-indigo-600/30 transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
            >
              {submitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  Authenticating...
                </>
              ) : (
                "Sign In to CampusOne"
              )}
            </button>
          </form>

          <section aria-labelledby="demo-accounts-heading" className="border-t border-slate-800 pt-5">
            <div className="flex items-center justify-between gap-3 mb-3">
              <h3 id="demo-accounts-heading" className="text-xs font-semibold text-slate-300">
                Seeded development accounts
              </h3>
              <span className="text-[11px] text-slate-500">Select to fill</span>
            </div>
            <div className="space-y-2">
              {DEMO_ACCOUNTS.map((account) => (
                <button
                  key={account.role}
                  type="button"
                  onClick={() => fillDemoAccount(account)}
                  className="w-full rounded-lg border border-slate-800 bg-slate-950/40 px-3 py-2.5 text-left transition-colors hover:border-indigo-500/50 hover:bg-indigo-500/5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs font-semibold text-indigo-300">{account.role}</span>
                    <span className="text-[10px] font-medium text-slate-500">Use this account</span>
                  </div>
                  <div className="mt-1 grid gap-0.5 text-[11px] leading-4 sm:grid-cols-[1fr_auto] sm:gap-x-3">
                    <span className="font-mono text-slate-300 break-all">{account.email}</span>
                    <span className="font-mono text-slate-400 break-all">{account.password}</span>
                  </div>
                </button>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
