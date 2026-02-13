"use client";

import { LazorkitProvider } from "@lazorkit/wallet";
import React from "react";

const CONFIG = {
  RPC_URL: process.env.NEXT_PUBLIC_SOLANA_RPC || "https://api.devnet.solana.com",
  PORTAL_URL: "https://portal.lazor.sh",
};

export function WalletProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazorkitProvider
      rpcUrl={CONFIG.RPC_URL}
      portalUrl={CONFIG.PORTAL_URL}
    >
      {children}
    </LazorkitProvider>
  );
}
