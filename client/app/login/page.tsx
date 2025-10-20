"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { setSession, isAuthenticated, hydrated } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (hydrated && isAuthenticated) {
      router.replace('/dashboard');
    }
  }, [hydrated, isAuthenticated, router]);
  
  if (!hydrated) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-400"></div>
    </div>
  );
  if (isAuthenticated) return <div>Redirecting...</div>;

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await api.login({ email, password }) as any;
      console.log('Login response:', res);
      const token = res.access_token || res.data?.access_token;
      const user = res.user || res.data?.user;
      console.log('Token:', token);
      console.log('User:', user);
      setSession(token, user);
      console.log('Session set, redirecting to dashboard');
      router.replace("/dashboard");
    } catch (err: any) {
      const errorMessage = err?.message || "Login failed";
      if (errorMessage.includes("verify your email")) {
        setError("Please check your email and click the verification link before logging in.");
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="absolute inset-0 -z-10">
        <img src="/addisababa.png" alt="Addis Ababa" className="h-full w-full object-cover opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black/90" />
      </div>
      
      <div className="w-full max-w-md bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-md px-4 py-2 border border-white/20 shadow-lg mb-4">
            <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse"></span>
            <span className="text-sm font-medium text-white">Welcome Back</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Sign In</h1>
          <p className="text-white/70">Access your TaxiTera account</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent backdrop-blur-sm"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent backdrop-blur-sm"
              placeholder="Enter your password"
            />
          </div>
          {error && (
            <div className="rounded-2xl bg-red-500/20 border border-red-400/30 p-4 text-sm text-red-300">
              {error}
              {error.includes("Invalid credentials") && (
                <div className="mt-2 text-xs text-red-200">
                  Make sure your email and password are correct, and that you've verified your email.
                </div>
              )}
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-8 py-4 text-lg font-semibold text-black shadow-2xl shadow-amber-500/40 transition-all hover:shadow-amber-500/60 hover:scale-105 disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-white/70 space-y-2">
          <p>
            New here?{" "}
            <a className="text-amber-400 hover:text-amber-300 font-medium transition-colors" href="/register">
              Create an account
            </a>
          </p>
          <p>
            <a className="text-blue-400 hover:text-blue-300 font-medium transition-colors" href="/reset-password">
              Forgot your password?
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}


