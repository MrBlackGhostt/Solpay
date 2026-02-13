"use client";

import { LazorkitProvider } from "@lazorkit/wallet";
import React from "react";

const CONFIG = {
  RPC_URL: process.env.NEXT_PUBLIC_SOLANA_RPC || "https://api.devnet.solana.com",
  PORTAL_URL: "https://portal.lazor.sh",
  PAYMASTER: {
    paymasterUrl: "https://kora.devnet.lazorkit.com",
  },
};

export function WalletProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazorkitProvider
      rpcUrl={CONFIG.RPC_URL}
      portalUrl={CONFIG.PORTAL_URL}
      // Disable paymaster by passing empty string to force user-pays
      paymasterConfig={{
        paymasterUrl: "",
      }}
    >
      {children}
    </LazorkitProvider>
  );
}
