import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { http } from "wagmi";
import { HOOD_CHAIN, HOOD_RPC_PUBLIC } from "./hood";

export const wagmiConfig = getDefaultConfig({
  appName: "Tokenhood",
  projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID || "demo",
  chains: [HOOD_CHAIN],
  transports: { [HOOD_CHAIN.id]: http(HOOD_RPC_PUBLIC) },
  ssr: true,
});
