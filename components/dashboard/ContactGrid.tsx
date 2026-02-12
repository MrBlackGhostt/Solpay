"use client";

import { Contact } from "@/types/contact";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { AddContactModal } from "@/components/modals/AddContactModal";

interface ContactGridProps {
  contacts: Contact[];
  onAdd: (name: string, address: string, emoji: string) => { success: boolean; error?: string };
  onDelete: (id: string) => void;
  onSelect?: (contact: Contact) => void;
}

export function ContactGrid({ contacts, onAdd, onDelete, onSelect }: ContactGridProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {/* Add Contact Button */}
        <button
          onClick={() => setShowAddModal(true)}
          className="group aspect-square rounded-2xl border-2 border-dashed border-white/10 hover:border-primary/50 bg-white/5 hover:bg-primary/5 transition-all flex flex-col items-center justify-center gap-3 cursor-pointer"
        >
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Plus className="w-6 h-6 text-primary" />
          </div>
          <span className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors">
            Add Contact
          </span>
        </button>

        {/* Contact Cards */}
        {contacts.map((contact) => (
          <div
            key={contact.id}
            className="relative group"
            onMouseEnter={() => setHoveredId(contact.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            <Card
              className="aspect-square rounded-2xl border-white/10 bg-surface/50 hover:bg-surface/80 backdrop-blur-sm cursor-pointer transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/10"
              onClick={() => onSelect?.(contact)}
            >
              <CardContent className="p-6 flex flex-col items-center justify-center h-full gap-3">
                <div className="text-5xl">{contact.emoji}</div>
                <div className="text-center space-y-1 w-full">
                  <p className="font-semibold text-sm truncate">{contact.name}</p>
                  <p className="text-xs text-muted-foreground font-mono truncate">
                    {contact.address.slice(0, 4)}...{contact.address.slice(-4)}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Delete Button (appears on hover) */}
            {hoveredId === contact.id && (
              <Button
                size="icon"
                variant="destructive"
                className="absolute top-2 right-2 w-8 h-8 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(contact.id);
                }}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        ))}
      </div>

      <AddContactModal
        open={showAddModal}
        onOpenChange={setShowAddModal}
        onAdd={onAdd}
      />
    </>
  );
}
