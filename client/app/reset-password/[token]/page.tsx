"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { useRouter, useParams } from "next/navigation";

export default function ResetPasswordTokenPage() {
  const router = useRouter();
  const params = useParams();
  const token = params.token as string;
  
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      await api.resetPassword(token, newPassword);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <div className="w-full max-w-md bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl text-center">
          <div className="text-green-400 text-6xl mb-4">✅</div>
          <h1 className="text-2xl font-bold text-white mb-4">Password Reset</h1>
          <p className="text-white/70 mb-6">
            Your password has been successfully reset!
          </p>
          <button
            onClick={() => router.push('/login')}
            className="bg-gradient-to-r from-amber-400 to-orange-500 text-black px-6 py-3 rounded-full font-semibold hover:scale-105 transition-all"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Set New Password</h1>
          <p className="text-white/70">Enter your new password below</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={6}
              className="w-full p-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent backdrop-blur-sm"
              placeholder="Enter new password"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
              className="w-full p-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent backdrop-blur-sm"
              placeholder="Confirm new password"
            />
          </div>
          
          {error && (
            <div className="rounded-2xl bg-red-500/20 border border-red-400/30 p-4 text-sm text-red-300">
              {error}
            </div>
          )}
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-amber-400 to-orange-500 text-black px-8 py-4 rounded-full font-semibold hover:scale-105 transition-all disabled:opacity-60"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
}