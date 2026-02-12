import { useState, useEffect } from "react";
import { useWallet } from "@lazorkit/wallet";
import { createSolanaRpc, address } from "@solana/kit";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

export interface Transaction {
  signature: string;
  date: string;
  amount: string;
  type: "sent" | "received";
  status: "success" | "failed";
}

export const useTransactions = () => {
  const { smartWalletPubkey } = useWallet();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!smartWalletPubkey) {
      setTransactions([]);
      return;
    }

    const fetchHistory = async () => {
      // Check cache first
      const cached = localStorage.getItem("solpay_transactions");
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < 2 * 60 * 1000) { // 2 minutes cache
          setTransactions(data);
          return;
        }
      }

      setIsLoading(true);
      try {
        // Use v1 Connection for getParsedTransactions batch support which is reliable
        const connection = new (require("@solana/web3.js").Connection)(
          process.env.NEXT_PUBLIC_SOLANA_RPC || "https://api.devnet.solana.com"
        );
        const pubkeyStr = smartWalletPubkey.toString();

        // 1. Fetch recent signatures
        const signatures = await connection.getSignaturesForAddress(
          smartWalletPubkey,
          { limit: 5 }
        );

        if (!signatures || signatures.length === 0) {
          setTransactions([]);
          setIsLoading(false);
          return;
        }

        // Revert to basic signatures only to avoid 429s on getParsedTransactions
        const formattedTxs: Transaction[] = signatures.map((sig: any) => ({
          signature: sig.signature,
          date: new Date(sig.blockTime! * 1000).toLocaleDateString(),
          amount: "---", 
          type: "sent", // Default generic type
          status: sig.err ? "failed" : "success",
        }));

        setTransactions(formattedTxs);
        
        // Save to cache
        localStorage.setItem("solpay_transactions", JSON.stringify({
          data: formattedTxs,
          timestamp: Date.now()
        }));

      } catch (error: any) {
        console.error("Error fetching transactions:", error);
        // If rate limited, just keep existing transactions or use cache
        if (error.message?.includes("429")) {
          return;
        }
        setTransactions([]);
      } finally {
        setIsLoading(false);
      }
    };

    // Only fetch once on mount
    fetchHistory();
    
    // Disable auto-refresh for now to prevent 429 loops
    // const interval = setInterval(fetchHistory, 60000);
    // return () => clearInterval(interval);

  }, [smartWalletPubkey?.toString()]); // Use string to prevent object reference loop

  return { transactions, isLoading };
};
