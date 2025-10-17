"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await api.post("/auth/register", { name, email, password, phone });
      if (typeof window !== "undefined") {
        localStorage.setItem("tt_access_token", res.accessToken);
        localStorage.setItem("tt_user", JSON.stringify(res.user));
        document.cookie = `tt_access_token=${res.accessToken}; Path=/; Max-Age=${7 * 24 * 3600}`;
      }
      router.replace("/dashboard");
    } catch (err: any) {
      setError(err?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl ring-1 ring-black/5">
        <h1 className="text-2xl font-bold text-text">Create your account</h1>
        <p className="mt-1 text-sm text-text/70">Join TaxiTera for fast city rides</p>

        <form onSubmit={handleRegister} className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-text/80">Full name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1 w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm text-text shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/60"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-text/80">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm text-text shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/60"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-text/80">Phone (optional)</label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-1 w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm text-text shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/60"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-text/80">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm text-text shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/60"
            />
          </div>
          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700 ring-1 ring-red-200">{error}</div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center rounded-xl bg-primary px-6 py-3 text-white shadow-lg shadow-primary/30 transition hover:brightness-110 disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-text/70">
          Already have an account? <a className="text-primary hover:underline" href="/login">Sign in</a>
        </p>
      </div>
    </div>
  );
}


