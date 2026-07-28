"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useToast } from "@/store/toast-store";

export function Toaster() {
  const { toasts, remove } = useToast();

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            className={`pointer-events-auto flex items-start gap-3 rounded-lg border px-4 py-3 shadow-lg backdrop-blur ${
              t.type === "error"
                ? "border-red-500/30 bg-red-950/80 text-red-200"
                : "border-green-500/30 bg-green-950/80 text-green-200"
            }`}
          >
            <span className="text-sm leading-relaxed">{t.message}</span>
            <button
              onClick={() => remove(t.id)}
              className="shrink-0 mt-0.5 rounded p-0.5 hover:bg-black/10 transition-colors"
            >
              <X className="size-3.5" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
