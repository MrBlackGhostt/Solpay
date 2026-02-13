"use client";

import { useTransactions } from "@/hooks/useTransactions";
import { usePrivy } from "@privy-io/react-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, ExternalLink, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";

export function RecentActivity() {
  const { transactions, isLoading } = useTransactions();
  const { user } = usePrivy();
  const walletAddress = user?.wallet?.address;

  return (
    <Card className="lg:col-span-4 bg-surface/50 border-white/5 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Recent Activity</CardTitle>
        <Button variant="ghost" size="sm" className="h-8 text-xs text-muted-foreground hover:text-primary gap-1" asChild>
          <a 
            href={`https://solscan.io/account/${walletAddress}?cluster=devnet#splTransfers`}
            target="_blank"
            rel="noreferrer"
          >
            View All <ExternalLink className="w-3 h-3" />
          </a>
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
                <div className="space-y-2 flex flex-col items-end">
                  <Skeleton className="h-4 w-12" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
            ))}
          </div>
        ) : transactions.length > 0 ? (
          <div className="space-y-4">
            {transactions.map((tx) => (
              <div key={tx.signature} className="flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center
                    ${tx.status === 'failed' ? 'bg-red-500/10 text-red-500' : 'bg-primary/10 text-primary'}
                  `}>
                    <ArrowUpRight className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">
                      {tx.status === 'failed' ? 'Failed' : 'Transaction'}
                    </p>
                    <p className="text-xs text-muted-foreground font-mono">
                      {tx.date}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-sm text-muted-foreground">
                    Conf.
                  </p>
                  <a 
                    href={`https://solscan.io/tx/${tx.signature}?cluster=devnet`}
                    target="_blank"
                    rel="noreferrer" 
                    className="text-xs text-muted-foreground hover:text-primary transition-colors truncate w-24 block"
                  >
                    {tx.signature.slice(0, 8)}...
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Clock}
            title="No transactions yet"
            description="Your recent activity will appear here."
          />
        )}
      </CardContent>
    </Card>
  );
}
