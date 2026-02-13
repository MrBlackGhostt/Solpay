"use client";

import { PrivyProvider } from "@privy-io/react-auth";
import { toSolanaWalletConnectors } from "@privy-io/react-auth/solana";
import { createSolanaRpc, createSolanaRpcSubscriptions } from "@solana/kit";
import { ReactNode } from "react";

// Use environment variable or fallback to placeholder
const PRIVY_APP_ID = process.env.NEXT_PUBLIC_PRIVY_APP_ID || "";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <PrivyProvider
      appId={PRIVY_APP_ID}
      config={{
        solana: {
          rpcs: {
            "solana:mainnet": {
              rpc: createSolanaRpc("https://api.mainnet-beta.solana.com"),
              rpcSubscriptions: createSolanaRpcSubscriptions("wss://api.mainnet-beta.solana.com"),
            },
            "solana:devnet": {
              rpc: createSolanaRpc("https://api.devnet.solana.com"),
              rpcSubscriptions: createSolanaRpcSubscriptions("wss://api.devnet.solana.com"),
            },
          },
        },
        appearance: {
          showWalletLoginFirst: true,
          walletChainType: "solana-only",
          theme: "dark",
          accentColor: "#8B5CF6", // Matching SolPay primary color
        },
        loginMethods: ["wallet", "email", "google"],
        externalWallets: {
          solana: {
            connectors: toSolanaWalletConnectors(),
          },
        },
        embeddedWallets: {
          solana: {
            createOnLogin: "all-users",
          },
        },
      }}
    >
      {children}
    </PrivyProvider>
  );
}
