"use client";

import { useWallet } from "@lazorkit/wallet";
import { useBalance } from "@/hooks/useBalance";
import { useTokenBalances } from "@/hooks/useTokenBalances";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet, Loader2, Coins } from "lucide-react";

export function WalletBalance() {
  const { smartWalletPubkey } = useWallet();
  const { sol, isLoading: isSolLoading } = useBalance();
  const { tokens, isLoading: isTokensLoading } = useTokenBalances();

  const isLoading = isSolLoading || isTokensLoading;

  return (
    <Card className="bg-surface/50 border-white/5 backdrop-blur-sm overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium">Assets</CardTitle>
        <Wallet className="w-4 h-4 text-primary" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* SOL Balance */}
          <div>
            <div className="text-2xl font-bold flex items-center gap-2">
              {isSolLoading ? (
                <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
              ) : (
                `${sol.toFixed(4)} SOL`
              )}
            </div>
            <p className="text-[10px] text-muted-foreground mt-0.5 tracking-wider uppercase font-mono">
              Native Solana
            </p>
          </div>

          {/* Token List */}
          {tokens.length > 0 && (
            <div className="pt-3 border-t border-white/5 space-y-2">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">SPL Tokens</p>
              {tokens.map((token) => (
                <div key={token.mint} className="flex items-center justify-between group">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center">
                      <Coins className="w-3 h-3 text-accent" />
                    </div>
                    <div>
                      <p className="text-xs font-medium">{token.symbol}</p>
                    </div>
                  </div>
                  <p className="text-xs font-mono">{token.balance.toFixed(2)}</p>
                </div>
              ))}
            </div>
          )}

          <p className="text-[10px] text-muted-foreground mt-2 pt-2 border-t border-white/5 font-mono overflow-hidden text-ellipsis">
            {smartWalletPubkey?.toString()}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
