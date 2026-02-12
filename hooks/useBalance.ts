import { useState, useEffect, useMemo } from "react";
import { Connection, clusterApiUrl, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useWallet } from "@lazorkit/wallet";

export const useBalance = () => {
  const [balance, setBalance] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const { smartWalletPubkey } = useWallet();

  const connection = useMemo(
    () => new Connection(process.env.NEXT_PUBLIC_SOLANA_RPC || clusterApiUrl("devnet"), "confirmed"),
    []
  );

  useEffect(() => {
    if (!smartWalletPubkey) {
      setBalance(0);
      return;
    }

    const fetchBalance = async () => {
      setIsLoading(true);
      try {
        const bal = await connection.getBalance(smartWalletPubkey);
        setBalance(bal);
      } catch (error) {
        console.error("Error fetching balance:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBalance();

    // Set up a subscription for real-time updates
    const subscriptionId = connection.onAccountChange(
      smartWalletPubkey,
      (accountInfo) => {
        setBalance(accountInfo.lamports);
      }
    );

    return () => {
      connection.removeAccountChangeListener(subscriptionId);
    };
  }, [smartWalletPubkey, connection]);

  return {
    sol: balance / LAMPORTS_PER_SOL,
    lamports: balance,
    isLoading,
  };
};
