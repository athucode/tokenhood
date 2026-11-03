"use client";

import { useState } from "react";
import { motion } from "framer-motion";

/** Hero centerpiece: type a ticker and see it sprayed onto a wall. */
export function HeroTag() {
  const [ticker, setTicker] = useState("MOON");
  const clean = ticker.replace(/[^A-Za-z0-9]/g, "").slice(0, 8).toUpperCase();
  return (
    <div className="border-2 border-curb bg-concrete p-4 shadow-block">
      <label className="mb-2 block text-sm font-semibold" htmlFor="hero-ticker">Type your ticker</label>
      <input id="hero-ticker" className="input mb-4 font-display text-xl" value={ticker} onChange={(e) => setTicker(e.target.value)} maxLength={8} />
      <div className="flex aspect-[4/3] items-center justify-center overflow-hidden border-2 border-curb" style={{ background: "repeating-linear-gradient(0deg,#2B2D34 0 28px,#25272D 28px 30px)" }}>
        <motion.p key={clean} initial={{ scale: 1.3, opacity: 0, rotate: -6 }} animate={{ scale: 1, opacity: 1, rotate: -4 }} transition={{ type: "spring", stiffness: 300, damping: 18 }} className="font-display text-6xl text-spray sm:text-7xl" style={{ textShadow: "3px 3px 0 #3DE3FF" }}>
          ${clean || "???"}
        </motion.p>
      </div>
    </div>
  );
}
