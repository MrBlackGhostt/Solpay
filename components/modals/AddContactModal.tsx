"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface AddContactModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (name: string, address: string, emoji: string) => { success: boolean; error?: string };
}

const EMOJI_OPTIONS = ["👤", "👨", "👩", "🧑", "👨‍💼", "👩‍💼", "🧑‍💻", "👨‍🎓", "👩‍🎓", "🤝", "💼", "🏦", "🏪", "🏢"];

export function AddContactModal({ open, onOpenChange, onAdd }: AddContactModalProps) {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [selectedEmoji, setSelectedEmoji] = useState("👤");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error("Please enter a contact name");
      return;
    }

    if (!address.trim()) {
      toast.error("Please enter a Solana address");
      return;
    }

    setIsSubmitting(true);
    
    const result = onAdd(name.trim(), address.trim(), selectedEmoji);
    
    if (result.success) {
      toast.success(`${selectedEmoji} ${name} added to contacts!`);
      setName("");
      setAddress("");
      setSelectedEmoji("👤");
      onOpenChange(false);
    } else {
      toast.error(result.error || "Failed to add contact");
    }
    
    setIsSubmitting(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] w-full max-w-full h-full sm:h-auto bg-surface/95 backdrop-blur-xl border-white/10 pb-safe">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Add New Contact</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Save a Solana address for quick transfers.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          {/* Emoji Selector */}
          <div className="space-y-2">
            <Label htmlFor="emoji" className="text-sm font-medium">Contact Icon</Label>
            <div className="grid grid-cols-7 gap-2">
              {EMOJI_OPTIONS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setSelectedEmoji(emoji)}
                  className={`
                    w-full aspect-square rounded-xl text-2xl flex items-center justify-center
                    transition-all hover:scale-110 active:scale-95
                    ${selectedEmoji === emoji 
                      ? 'bg-primary/20 ring-2 ring-primary shadow-lg shadow-primary/20' 
                      : 'bg-white/5 hover:bg-white/10'
                    }
                  `}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Name Input */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">Contact Name</Label>
            <Input
              id="name"
              placeholder="e.g., Alice, Bob's Wallet, Exchange"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-12 bg-white/5 border-white/10 focus:border-primary"
              maxLength={30}
            />
          </div>

          {/* Address Input */}
          <div className="space-y-2">
            <Label htmlFor="address" className="text-sm font-medium">Solana Address</Label>
            <Input
              id="address"
              placeholder="Enter public key (e.g., 7xKXtg...)"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="h-12 bg-white/5 border-white/10 focus:border-primary font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">
              Paste the recipient's Solana wallet address
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 h-12 border-white/10 hover:bg-white/5"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 h-12 bg-primary hover:bg-primary-dark"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Adding..." : "Add Contact"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
