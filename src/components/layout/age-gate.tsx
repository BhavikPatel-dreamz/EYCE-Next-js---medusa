"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

const KEY = "eyce-age-verified";

export function AgeGate() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined" && !localStorage.getItem(KEY)) setVisible(true);
  }, []);
  const confirm = () => {
    localStorage.setItem(KEY, "1");
    setVisible(false);
  };
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background/95 backdrop-blur-xl"
        >
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="mx-4 max-w-md rounded-xl border border-border bg-card p-8 text-center"
          >
            <div className="mx-auto mb-4 text-3xl font-bold tracking-tight">EYCE.</div>
            <p className="text-sm text-muted-foreground">
              This site contains products intended for adults 21+ only. By entering you
              confirm you are of legal age in your jurisdiction.
            </p>
            <div className="mt-6 flex gap-3">
              <Button className="flex-1" onClick={confirm}>I am 21 or older</Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => (window.location.href = "https://google.com")}
              >
                Exit
              </Button>
            </div>
            <p className="mt-4 text-[10px] uppercase tracking-widest text-muted-foreground">
              21+ only. Intended for legal use.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
