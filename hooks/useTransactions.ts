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
      setIsLoading(true);
      try {
        const rpc = createSolanaRpc(process.env.NEXT_PUBLIC_SOLANA_RPC || "https://api.devnet.solana.com");
        const pubkeyStr = smartWalletPubkey.toString();

        // 1. Fetch recent signatures
        const signatures = await rpc
          .getSignaturesForAddress(address(pubkeyStr), { limit: 10 })
          .send();

        if (!signatures || signatures.length === 0) {
          setTransactions([]);
          return;
        }

        // 2. Map direct signatures to format (basic version for speed)
        // Note: For full details like amount, we would need getTransaction or getParsedTransaction
        // But the new API might be different. Let's stick to signatures first and key details.
        
        // For now, we will just show the signatures as a placeholder for real parsed data
        // because parsing instruction data for amounts is complex without a robust indexer.
        // We will try to infer some details or mock the amount for the demo if parsing is too heavy.
        
        const formattedTxs: Transaction[] = signatures.map((sig: any) => ({
          signature: sig.signature,
          date: new Date(Number(sig.blockTime || Date.now() / 1000) * 1000).toLocaleDateString(),
          amount: "0.00", // Placeholder until we parse proper
          type: "sent",   // Placeholder
          status: sig.err ? "failed" : "success",
        }));

        setTransactions(formattedTxs);

      } catch (error: any) {
        console.error("Error fetching transactions:", error);
        // If rate limited, just keep existing transactions
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

  }, [smartWalletPubkey]);

  return { transactions, isLoading };
};
