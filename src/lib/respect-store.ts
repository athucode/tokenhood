import { create } from "zustand";
import { persist } from "zustand/middleware";

type Vote = 1 | -1;

interface RespectState {
  /** The current visitor's vote per page slug. Stored locally; move server-side once wallets sign votes. */
  votes: Record<string, Vote | undefined>;
  vote: (slug: string, v: Vote) => void;
}

export const useRespect = create<RespectState>()(
  persist(
    (set, get) => ({
      votes: {},
      // Clicking the same arrow again removes the vote.
      vote: (slug, v) => set({ votes: { ...get().votes, [slug]: get().votes[slug] === v ? undefined : v } }),
    }),
    { name: "tokenhood-respect" },
  ),
);
