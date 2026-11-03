"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

export function CopyButton({ value, label = "Copy" }: { value: string; label?: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      aria-label={`${label}: ${value}`}
      onClick={async () => {
        await navigator.clipboard.writeText(value);
        setDone(true);
        setTimeout(() => setDone(false), 1500);
      }}
      className="inline-flex items-center gap-1 border-2 border-current px-2 py-1 text-xs font-semibold"
    >
      {done ? <Check size={14} /> : <Copy size={14} />}
      {done ? "Copied" : label}
    </button>
  );
}
