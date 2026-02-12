"use client";

import { useWallet } from "@lazorkit/wallet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet, ArrowUpRight, ArrowDownLeft, Users } from "lucide-react";
import { ContactGrid } from "@/components/dashboard/ContactGrid";
import { useContacts } from "@/hooks/useContacts";
import { toast } from "sonner";

export default function DashboardPage() {
  const { smartWalletPubkey } = useWallet();
  const { contacts, addContact, deleteContact } = useContacts();

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
            <div className="text-2xl font-bold">0.00 SOL</div>
            <p className="text-xs text-muted-foreground mt-1 tracking-wider uppercase font-mono">
              {smartWalletPubkey?.toString().slice(0, 12)}...
            </p>
          </CardContent>
        </Card>

        <Card className="bg-surface/50 border-white/5 backdrop-blur-sm cursor-pointer hover:bg-surface/80 transition-colors group">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Send Assets</CardTitle>
            <ArrowUpRight className="w-4 h-4 text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Send</div>
            <p className="text-xs text-muted-foreground mt-1">Transfer SOL to any address</p>
          </CardContent>
        </Card>

        <Card className="bg-surface/50 border-white/5 backdrop-blur-sm cursor-pointer hover:bg-surface/80 transition-colors group">
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
          <CardHeader>
            <CardTitle className="text-lg">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                <ArrowUpRight className="w-6 h-6 text-muted-foreground/50" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">No transactions yet</p>
                <p className="text-xs text-muted-foreground">Your recent activity will appear here.</p>
              </div>
            </div>
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
    </div>
  );
}
