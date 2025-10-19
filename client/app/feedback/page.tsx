"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { motion } from "framer-motion";
import { Star, MessageCircle, Send } from "lucide-react";

export default function FeedbackPage() {
  const router = useRouter();
  const { isAuthenticated, hydrated, user } = useAuth();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [category, setCategory] = useState("general");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (hydrated && !isAuthenticated) {
      router.replace("/login");
    }
  }, [hydrated, isAuthenticated, router]);

  if (!hydrated || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-400"></div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating || !comment.trim()) {
      alert("Please provide both rating and comment");
      return;
    }

    setLoading(true);
    try {
      await api.post('/feedback', { rating, comment, category });
      setSubmitted(true);
    } catch (error) {
      alert("Failed to submit feedback. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="absolute inset-0 -z-10">
          <img src="/addisababa.png" alt="Addis Ababa" className="h-full w-full object-cover opacity-10" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/80 to-black/95" />
        </div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl text-center max-w-md"
        >
          <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Thank You!</h2>
          <p className="text-white/70 mb-6">Your feedback has been submitted successfully. We appreciate your input!</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="bg-gradient-to-r from-amber-400 to-orange-500 text-black px-6 py-3 rounded-full font-semibold hover:scale-105 transition-all"
          >
            Back to Dashboard
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="absolute inset-0 -z-10">
        <img src="/addisababa.png" alt="Addis Ababa" className="h-full w-full object-cover opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/80 to-black/95" />
      </div>

      <div className="relative px-4 py-12">
        <div className="mx-auto max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-md px-4 py-2 border border-white/20 shadow-lg mb-6">
              <MessageCircle className="w-4 h-4 text-amber-400" />
              <span className="text-sm font-medium text-white">Share Your Experience</span>
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">
              We Value Your
              <span className="block bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                Feedback
              </span>
            </h1>
            <p className="text-xl text-white/70">Help us improve our service by sharing your thoughts</p>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            onSubmit={handleSubmit}
            className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl"
          >
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-3 text-white/80">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-4 bg-gradient-to-r from-white/10 to-white/5 border border-white/20 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent backdrop-blur-sm appearance-none cursor-pointer"
                >
                  <option value="general" className="bg-gray-800 text-white">💬 General Feedback</option>
                  <option value="service" className="bg-gray-800 text-white">🚌 Service Quality</option>
                  <option value="driver" className="bg-gray-800 text-white">👨‍💼 Driver Experience</option>
                  <option value="app" className="bg-gray-800 text-white">📱 App Experience</option>
                  <option value="suggestion" className="bg-gray-800 text-white">💡 Suggestions</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-3 text-white/80">Rating</label>
                <div className="flex justify-center gap-2 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className={`p-2 rounded-full transition-all ${
                        star <= rating
                          ? 'text-amber-400 scale-110'
                          : 'text-white/30 hover:text-white/50'
                      }`}
                    >
                      <Star className="w-8 h-8" fill={star <= rating ? 'currentColor' : 'none'} />
                    </button>
                  ))}
                </div>
                <p className="text-center text-white/60 text-sm">
                  {rating === 0 && "Click to rate your experience"}
                  {rating === 1 && "😞 Poor"}
                  {rating === 2 && "😐 Fair"}
                  {rating === 3 && "🙂 Good"}
                  {rating === 4 && "😊 Very Good"}
                  {rating === 5 && "🤩 Excellent"}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-3 text-white/80">Your Comments</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Tell us about your experience with TaxiTera..."
                  rows={6}
                  className="w-full p-4 bg-gradient-to-r from-white/10 to-white/5 border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent backdrop-blur-sm resize-none"
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="flex-1 bg-white/10 border border-white/20 text-white py-4 rounded-2xl hover:bg-white/20 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || !rating || !comment.trim()}
                  className="flex-1 bg-gradient-to-r from-amber-400 to-orange-500 text-black py-4 rounded-2xl font-semibold hover:scale-105 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black"></div>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Submit Feedback
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.form>
        </div>
      </div>
    </div>
  );
}