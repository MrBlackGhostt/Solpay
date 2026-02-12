"use client";

import { useState } from "react";
import { useWallet } from "@lazorkit/wallet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet, ArrowUpRight, ArrowDownLeft, Users, Loader2 } from "lucide-react";
import { ContactGrid } from "@/components/dashboard/ContactGrid";
import { useContacts } from "@/hooks/useContacts";
import { useBalance } from "@/hooks/useBalance";
import { useTransactions } from "@/hooks/useTransactions";
import { toast } from "sonner";
import { SendModal } from "@/components/modals/SendModal";
import { ReceiveModal } from "@/components/modals/ReceiveModal";

export default function DashboardPage() {
  const { smartWalletPubkey } = useWallet();
  const { contacts, addContact, deleteContact } = useContacts();
  const { sol, isLoading: isBalanceLoading } = useBalance();
  const { transactions, isLoading: isTransactionsLoading } = useTransactions();
  
  const [showSendModal, setShowSendModal] = useState(false);
  const [showReceiveModal, setShowReceiveModal] = useState(false);

  const handleDeleteContact = (id: string) => {
    const result = deleteContact(id);
    if (result.success) {
      toast.success("Contact removed");
    } else {
      toast.error(result.error || "Failed to delete contact");
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col gap-1">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">Welcome back to your seedless wallet.</p>
      </div>

      {/* Quick Stats / Overview */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-surface/50 border-white/5 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Balance</CardTitle>
            <Wallet className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center gap-2">
              {isBalanceLoading ? (
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              ) : (
                `${sol.toFixed(4)} SOL`
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1 tracking-wider uppercase font-mono">
              {smartWalletPubkey?.toString().slice(0, 12)}...
            </p>
          </CardContent>
        </Card>

        <Card 
          className="bg-surface/50 border-white/5 backdrop-blur-sm cursor-pointer hover:bg-surface/80 transition-colors group"
          onClick={() => setShowSendModal(true)}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Send Assets</CardTitle>
            <ArrowUpRight className="w-4 h-4 text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Send</div>
            <p className="text-xs text-muted-foreground mt-1">Transfer SOL to any address</p>
          </CardContent>
        </Card>

        <Card 
          className="bg-surface/50 border-white/5 backdrop-blur-sm cursor-pointer hover:bg-surface/80 transition-colors group"
          onClick={() => setShowReceiveModal(true)}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Receive Assets</CardTitle>
            <ArrowDownLeft className="w-4 h-4 text-secondary group-hover:-translate-x-0.5 group-hover:translate-y-0.5 transition-transform" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Receive</div>
            <p className="text-xs text-muted-foreground mt-1">Show QR code to get paid</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">

        <Card className="lg:col-span-4 bg-surface/50 border-white/5 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Recent Activity</CardTitle>
            {isTransactionsLoading && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />}
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
                          {tx.status === 'failed' ? 'Failed Transaction' : 'Sent SOL'}
                        </p>
                        <p className="text-xs text-muted-foreground font-mono">
                          {tx.date}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-sm">
                        {tx.amount === "0.00" ? "-" : `-${tx.amount} SOL`}
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

        <Card className="lg:col-span-3 bg-surface/50 border-white/5 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Contacts</CardTitle>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Users className="w-4 h-4" />
              <span>{contacts.length}</span>
            </div>
          </CardHeader>
          <CardContent>
            <ContactGrid
              contacts={contacts}
              onAdd={addContact}
              onDelete={handleDeleteContact}
            />
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      <SendModal open={showSendModal} onOpenChange={setShowSendModal} />
      <ReceiveModal open={showReceiveModal} onOpenChange={setShowReceiveModal} />
    </div>
  );
}
