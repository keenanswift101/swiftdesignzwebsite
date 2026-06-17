"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollUp = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          key="scroll-top"
          initial={{ opacity: 0, scale: 0.6, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 22 }}
          onClick={scrollUp}
          aria-label="Scroll to top"
          className="fixed bottom-6 right-6 z-[90] w-11 h-11 rounded-full flex items-center justify-center"
          style={{
            background: "rgba(16,16,16,0.75)",
            border: "1px solid rgba(48,176,176,0.35)",
            backdropFilter: "blur(12px)",
            boxShadow: "0 0 18px rgba(48,176,176,0.15), 0 4px 20px rgba(0,0,0,0.4)",
          }}
          whileHover={{
            scale: 1.12,
            boxShadow: "0 0 28px rgba(48,176,176,0.35), 0 4px 24px rgba(0,0,0,0.5)",
          }}
          whileTap={{ scale: 0.92 }}
        >
          <ArrowUp size={18} color="var(--swift-teal)" strokeWidth={2.5} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
