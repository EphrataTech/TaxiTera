"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export default function RegisterPage() {
  const router = useRouter();
  const { setSession, isAuthenticated, hydrated } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
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
  if (isAuthenticated) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="text-white">Redirecting...</div>
    </div>
  );

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const res = await api.register({ name, email, password, phone }) as any;
      
      const token = res.access_token || res.data?.access_token || res.accessToken || res.token;
      const user = res.user || res.data?.user || res.userData;
      
      if (token && user) {
        setSession(token, user);
        router.replace("/dashboard");
      } else {
        setSuccess('Account created successfully! Please log in to continue.');
        setTimeout(() => router.push('/login'), 2000);
      }
    } catch (err: any) {
      
      // Handle specific error cases
      if (err.status === 409 || err.message?.includes('already exists')) {
        setError('An account with this email already exists. Please try logging in instead.');
      } else if (err.status === 400) {
        setError(err.message || 'Please check your input and try again.');
      } else {
        setError(err?.message || "Registration failed. Please try again.");
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
            <span className="text-sm font-medium text-white">Join TaxiTera</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
          <p className="text-white/70">Start your journey with us</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Full Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full p-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent backdrop-blur-sm"
              placeholder="Enter your full name"
            />
          </div>
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
            <label className="block text-sm font-medium text-white/80 mb-2">Phone (optional)</label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent backdrop-blur-sm"
              placeholder="Enter your phone number"
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
              placeholder="Create a password"
            />
          </div>
          {error && (
            <div className="rounded-2xl bg-red-500/20 border border-red-400/30 p-4 text-sm text-red-300">{error}</div>
          )}
          {success && (
            <div className="rounded-2xl bg-green-500/20 border border-green-400/30 p-4 text-sm text-green-300">
              {success}
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-8 py-4 text-lg font-semibold text-black shadow-2xl shadow-amber-500/40 transition-all hover:shadow-amber-500/60 hover:scale-105 disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-white/70">
          Already have an account?{" "}
          <a className="text-amber-400 hover:text-amber-300 font-medium transition-colors" href="/login">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}


