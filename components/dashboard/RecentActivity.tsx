"use client";

import { useTransactions } from "@/hooks/useTransactions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ArrowUpRight } from "lucide-react";

export function RecentActivity() {
  const { transactions, isLoading } = useTransactions();

  return (
    <Card className="lg:col-span-4 bg-surface/50 border-white/5 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Recent Activity</CardTitle>
        {isLoading && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />}
      </CardHeader>
      <CardContent>
        {transactions.length > 0 ? (
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
          <div className="flex flex-col items-center justify-center py-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
              <ArrowUpRight className="w-6 h-6 text-muted-foreground/50" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">No transactions yet</p>
              <p className="text-xs text-muted-foreground">Your recent activity will appear here.</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
