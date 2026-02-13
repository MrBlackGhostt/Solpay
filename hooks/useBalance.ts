import { useState, useEffect, useMemo } from "react";
import { Connection, clusterApiUrl, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { usePrivy } from "@privy-io/react-auth";

export const useBalance = () => {
  const [balance, setBalance] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = usePrivy();
  const walletAddress = user?.wallet?.address;

  const connection = useMemo(
    () => new Connection(process.env.NEXT_PUBLIC_SOLANA_RPC || clusterApiUrl("devnet"), "confirmed"),
    []
  );

  useEffect(() => {
    if (!walletAddress) {
      setBalance(0);
      return;
    }

    const fetchBalance = async () => {
      // Simple cache to prevent rapid re-fetching
      const cacheKey = `balance_${walletAddress}`;
      const cached = sessionStorage.getItem(cacheKey);
      if (cached) {
        const { lamports, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < 30000) { // 30s cache
          setBalance(lamports);
          return;
        }
      }

      setIsLoading(true);
      try {
        const bal = await connection.getBalance(new PublicKey(walletAddress));
        setBalance(bal);
        sessionStorage.setItem(cacheKey, JSON.stringify({
          lamports: bal,
          timestamp: Date.now()
        }));
      } catch (error) {
        console.error("Error fetching balance:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBalance();

    // Polling every 60s instead of WebSocket to avoid WSS errors
    const interval = setInterval(fetchBalance, 60000);
    return () => clearInterval(interval);
  }, [walletAddress, connection]);

  const refresh = async () => {
    if (!walletAddress) return;
    setIsLoading(true);
    try {
      const bal = await connection.getBalance(new PublicKey(walletAddress));
      setBalance(bal);
      const cacheKey = `balance_${walletAddress}`;
      sessionStorage.setItem(cacheKey, JSON.stringify({
        lamports: bal,
        timestamp: Date.now()
      }));
    } catch (error) {
      console.error("Error refreshing balance:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    sol: balance / LAMPORTS_PER_SOL,
    lamports: balance,
    isLoading,
    refresh,
  };
};
