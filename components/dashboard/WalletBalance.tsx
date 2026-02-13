"use client";

import { usePrivy } from "@privy-io/react-auth";
import { useBalance } from "@/hooks/useBalance";
import { useTokenBalances } from "@/hooks/useTokenBalances";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet, Loader2, Coins, RefreshCcw, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export function WalletBalance() {
  const { user } = usePrivy();
  const walletAddress = user?.wallet?.address;
  
  const { sol, isLoading: isSolLoading, refresh: refreshSol } = useBalance();
  const { tokens, isLoading: isTokensLoading, refresh: refreshTokens } = useTokenBalances();

  const isLoading = isSolLoading || isTokensLoading;

  const handleRefresh = () => {
    refreshSol();
    refreshTokens();
  };

  return (
    <Card className="bg-surface/50 border-white/5 backdrop-blur-sm overflow-hidden relative group">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium">Assets</CardTitle>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-muted-foreground hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCcw className={`h-3 w-3 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
          <Wallet className="w-4 h-4 text-primary" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* SOL Balance */}
          <div>
            <div className="text-2xl font-bold flex items-center gap-2">
              {isSolLoading ? (
                <Skeleton className="h-8 w-32" />
              ) : (
                `${sol.toFixed(4)} SOL`
              )}
            </div>
            <div className="flex items-center justify-between mt-0.5">
              <p className="text-[10px] text-muted-foreground tracking-wider uppercase font-mono">
                Native Solana
              </p>
              {sol < 0.01 && (
                <a 
                  href="https://faucet.solana.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[10px] text-accent hover:underline flex items-center gap-1"
                >
                  Get Devnet SOL <ArrowUpRight className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>

          {/* Token List */}
          {(tokens.length > 0 || isTokensLoading) && (
            <div className="pt-3 border-t border-white/5 space-y-2">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">SPL Tokens</p>
              {isTokensLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                </div>
              ) : (
                tokens.map((token) => (
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
                ))
              )}
            </div>
          )}

          <p className="text-[10px] text-muted-foreground mt-2 pt-2 border-t border-white/5 font-mono overflow-hidden text-ellipsis">
            {walletAddress}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
