"use client";

import { useEffect, useState } from "react";

export function showToast(message: string, variant: "success" | "error" = "success") {
  if (typeof window === 'undefined') return;
  const event = new CustomEvent('tt_toast', { detail: { message, variant } });
  window.dispatchEvent(event);
}

export default function ToastViewport() {
  const [toasts, setToasts] = useState<{ id: number; message: string; variant: 'success' | 'error' }[]>([]);

  useEffect(() => {
    function handler(e: any) {
      const id = Date.now();
      const toast = { id, message: e.detail.message, variant: e.detail.variant } as const;
      setToasts((prev) => [...prev, toast as any]);
      setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 2500);
    }
    window.addEventListener('tt_toast', handler as any);
    return () => window.removeEventListener('tt_toast', handler as any);
  }, []);

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((t) => (
        <div key={t.id} className={
          `rounded-lg px-4 py-2 text-white shadow-lg ${t.variant === 'success' ? 'bg-primary shadow-primary/30' : 'bg-red-600'}`
        }>
          {t.message}
        </div>
      ))}
    </div>
  );
}


