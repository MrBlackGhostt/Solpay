import { useState, useEffect } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { Connection, PublicKey } from "@solana/web3.js";

export interface Transaction {
  signature: string;
  date: string;
  amount: string;
  type: "sent" | "received";
  status: "success" | "failed";
}

export const useTransactions = () => {
  const { user } = usePrivy();
  const walletAddress = user?.wallet?.address;
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!walletAddress) {
      setTransactions([]);
      return;
    }

    const fetchHistory = async () => {
      // Check cache first
      const cached = localStorage.getItem("solpay_transactions");
      if (cached) {
        try {
          const { data, timestamp } = JSON.parse(cached);
          if (Date.now() - timestamp < 2 * 60 * 1000) { // 2 minutes cache
            setTransactions(data);
            return;
          }
        } catch (e) {
          // invalid cache
        }
      }

      setIsLoading(true);
      try {
        // Use v1 Connection
        const connection = new Connection(
          process.env.NEXT_PUBLIC_SOLANA_RPC || "https://api.devnet.solana.com"
        );
        
        // 1. Fetch recent signatures
        const signatures = await connection.getSignaturesForAddress(
          new PublicKey(walletAddress),
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
        // Don't clear transactions on error if we have some?
        // setTransactions([]); 
      } finally {
        setIsLoading(false);
      }
    };

    // Only fetch once on mount
    fetchHistory();
    
  }, [walletAddress]);

  return { transactions, isLoading };
};
