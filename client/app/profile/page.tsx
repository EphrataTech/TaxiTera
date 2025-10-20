"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, hydrated, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    profilePicture: null as File | null
  });
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (hydrated && !isAuthenticated) {
      router.replace("/login");
    }
  }, [hydrated, isAuthenticated, router]);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        phone: user.phone || "",
        profilePicture: null
      });
    }
  }, [user]);

  if (!hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-400"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <div>Redirecting...</div>;
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, profilePicture: file });
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const updateData: any = {
        name: formData.name,
        phone: formData.phone
      };

      if (formData.profilePicture) {
        const formDataObj = new FormData();
        formDataObj.append('profilePicture', formData.profilePicture);
        formDataObj.append('name', formData.name);
        formDataObj.append('phone', formData.phone);
        
        await api.post('/users/profile/upload', formDataObj);
      } else {
        await api.updateProfile(updateData);
      }

      updateUser({ ...user, name: formData.name, phone: formData.phone });
      setSuccess("Profile updated successfully!");
    } catch (err: any) {
      setError(err.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="absolute inset-0 -z-10">
        <img src="/addisababa.png" alt="Addis Ababa" className="h-full w-full object-cover opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/80 to-black/95" />
      </div>

      {/* Header */}
      <div className="relative bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="mx-auto max-w-4xl px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Profile Settings</h1>
              <p className="text-white/70">Manage your account information</p>
            </div>
            <button
              onClick={() => router.push('/dashboard')}
              className="bg-white/10 border border-white/20 text-white px-4 py-2 rounded-full hover:bg-white/20 transition-colors"
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>
      </div>

      <div className="relative mx-auto max-w-2xl px-4 py-8">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl shadow-2xl">
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Profile Picture */}
              <div className="text-center">
                <div className="relative inline-block">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 flex items-center justify-center text-4xl font-bold text-black mx-auto mb-4 overflow-hidden">
                    {previewUrl ? (
                      <img src={previewUrl} alt="Profile" className="w-full h-full object-cover" />
                    ) : user?.profilePicture ? (
                      <img src={user.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      user?.name?.charAt(0).toUpperCase()
                    )}
                  </div>
                  <label className="absolute bottom-0 right-0 bg-amber-400 text-black p-2 rounded-full cursor-pointer hover:bg-amber-500 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
                <p className="text-white/70 text-sm">Click the camera icon to change your profile picture</p>
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full p-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent backdrop-blur-sm"
                  placeholder="Enter your full name"
                />
              </div>

              {/* Email (Read-only) */}
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Email</label>
                <input
                  type="email"
                  value={user?.email || ""}
                  disabled
                  className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-white/50 cursor-not-allowed backdrop-blur-sm"
                />
                <p className="text-white/50 text-xs mt-1">Email cannot be changed</p>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full p-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent backdrop-blur-sm"
                  placeholder="Enter your phone number"
                />
              </div>

              {/* Error/Success Messages */}
              {error && (
                <div className="rounded-2xl bg-red-500/20 border border-red-400/30 p-4 text-sm text-red-300">
                  {error}
                </div>
              )}
              
              {success && (
                <div className="rounded-2xl bg-green-500/20 border border-green-400/30 p-4 text-sm text-green-300">
                  {success}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-amber-400 to-orange-500 text-black px-8 py-4 rounded-full font-semibold hover:scale-105 transition-all disabled:opacity-60 disabled:hover:scale-100"
              >
                {loading ? "Updating..." : "Update Profile"}
              </button>
            </form>
            
            {/* Delete Account Section */}
            <div className="mt-8 pt-6 border-t border-white/20">
              <h3 className="text-lg font-semibold text-red-300 mb-4">Danger Zone</h3>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="w-full bg-red-500/20 border border-red-400/30 text-red-300 px-8 py-4 rounded-full font-semibold hover:bg-red-500/30 transition-all"
              >
                Delete Account
              </button>
              <p className="text-white/50 text-xs mt-2 text-center">
                This action cannot be undone. All your data will be permanently deleted.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 max-w-md w-full shadow-2xl">
            <div className="text-center">
              <div className="text-red-400 text-6xl mb-4">⚠️</div>
              <h3 className="font-bold text-xl text-white mb-4">Delete Account</h3>
              <p className="text-white/70 mb-6">
                This action cannot be undone. All your bookings and data will be permanently deleted.
              </p>
              
              <div className="flex space-x-4">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 bg-white/10 border border-white/20 text-white py-3 rounded-full hover:bg-white/20 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    try {
                      await api.deactivateAccount();
                      router.push('/');
                    } catch (err: any) {
                      setError(err.message || 'Failed to delete account');
                      setShowDeleteModal(false);
                    }
                  }}
                  className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white py-3 rounded-full font-semibold hover:scale-105 transition-all"
                >
                  Delete Forever
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}