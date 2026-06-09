"use client";

import { useState } from "react";
import { Send, CheckCircle, Loader2 } from "lucide-react";

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = (await res.json()) as { success?: boolean; error?: string };

      if (!res.ok || !data.success) {
        setErrorMsg(data.error ?? "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }
      setStatus("success");
      setEmail("");
    } catch {
      setErrorMsg("Something went wrong. Please try again.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="flex items-center gap-2 text-sm" style={{ color: "#30B0B0" }}>
        <CheckCircle size={16} />
        <span>You&apos;re subscribed — we&apos;ll keep you in the loop.</span>
      </div>
    );
  }

  return (
    <div>
      <p
        className="text-sm font-semibold uppercase tracking-[2px] mb-4"
        style={{ color: "#30B0B0" }}
      >
        Stay Updated
      </p>
      <p className="text-sm text-gray-500 mb-4 leading-relaxed">
        Tips, launches, and updates from the Swift Designz team.
      </p>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          disabled={status === "loading"}
          className="flex-1 min-w-0 px-3 py-2 text-sm bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[rgba(48,176,176,0.5)] disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="flex items-center justify-center px-3 py-2 rounded-lg text-white transition-colors disabled:opacity-50"
          style={{ background: "linear-gradient(135deg,#30B0B0,#207070)" }}
          aria-label="Subscribe"
        >
          {status === "loading" ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Send size={16} />
          )}
        </button>
      </form>
      {status === "error" && (
        <p className="text-xs mt-2" style={{ color: "#f87171" }}>{errorMsg}</p>
      )}
    </div>
  );
}
