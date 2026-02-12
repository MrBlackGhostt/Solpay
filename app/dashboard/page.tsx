"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";
import { ContactGrid } from "@/components/dashboard/ContactGrid";
import { WalletBalance } from "@/components/dashboard/WalletBalance";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { useContacts } from "@/hooks/useContacts";
import { toast } from "sonner";
import { SendModal } from "@/components/modals/SendModal";
import { ReceiveModal } from "@/components/modals/ReceiveModal";

export default function DashboardPage() {
  const { contacts, isLoading: isContactsLoading, addContact, deleteContact } = useContacts();
  
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
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Welcome Section */}
      <div className="flex flex-col gap-1">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">Welcome back to your seedless wallet.</p>
      </div>

      {/* Quick Stats / Overview */}
      <div className="grid gap-4 md:grid-cols-3">
        <WalletBalance />
        <QuickActions 
          onSend={() => setShowSendModal(true)} 
          onReceive={() => setShowReceiveModal(true)} 
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <RecentActivity />

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
              loading={isContactsLoading}
              limit={6}
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
