"use client";

import { useState, useEffect, useMemo } from "react";
import { useWallet } from "@lazorkit/wallet";
import { Connection, PublicKey } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";

export interface TokenBalance {
  mint: string;
  symbol: string;
  balance: number;
  decimals: number;
  logo?: string;
}

const COMMON_TOKENS_DEVNET: Record<string, { symbol: string; decimals: number }> = {
  "4zMMC9srtvSqzRLUX2oqqqcPbCYuVtW7T6rYoXEnU9DE": { symbol: "USDC", decimals: 6 },
  "EJw9qYg7ToEpeqe4VfCERzN1Y2S2en5Q99j3JuJ98B9o": { symbol: "BONK", decimals: 5 }, // Just an example
};

export function useTokenBalances() {
  const { smartWalletPubkey } = useWallet();
  const [tokens, setTokens] = useState<TokenBalance[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const connection = useMemo(
    () => new Connection(process.env.NEXT_PUBLIC_SOLANA_RPC || "https://api.devnet.solana.com"),
    []
  );

  useEffect(() => {
    if (!smartWalletPubkey) {
      setTokens([]);
      return;
    }

    const fetchTokens = async () => {
      // Check cache
      const cacheKey = `token_balances_${smartWalletPubkey.toString()}`;
      const cached = sessionStorage.getItem(cacheKey);
      if (cached) {
        try {
          const { data, timestamp } = JSON.parse(cached);
          if (Date.now() - timestamp < 30000) { // 30s cache
            setTokens(data);
            return;
          }
        } catch (e) {
          // invalid cache
        }
      }

      setIsLoading(true);
      try {
        const response = await connection.getParsedTokenAccountsByOwner(
          smartWalletPubkey,
          { programId: TOKEN_PROGRAM_ID }
        );

        const tokenBalances: TokenBalance[] = response.value
          .map((account) => {
            const info = account.account.data.parsed.info;
            const mint = info.mint;
            const balance = info.tokenAmount.uiAmount;
            const decimals = info.tokenAmount.decimals;

            const metadata = COMMON_TOKENS_DEVNET[mint] || {
              symbol: mint.slice(0, 4) + "...",
              decimals: decimals,
            };

            return {
              mint,
              symbol: metadata.symbol,
              balance,
              decimals,
            };
          })
          .filter((token) => token.balance > 0);

        setTokens(tokenBalances);
        sessionStorage.setItem(cacheKey, JSON.stringify({
          data: tokenBalances,
          timestamp: Date.now()
        }));

      } catch (error) {
        console.error("Error fetching token balances:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTokens();
    const interval = setInterval(fetchTokens, 60000);
    return () => clearInterval(interval);

  }, [smartWalletPubkey?.toString(), connection]);

  return { tokens, isLoading };
}
