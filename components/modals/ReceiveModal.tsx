"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { usePrivy } from "@privy-io/react-auth";
import { toast } from "sonner";
import QRCode from "react-qr-code";
import { ArrowDownLeft, Copy, Check } from "lucide-react";

interface ReceiveModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ReceiveModal({ open, onOpenChange }: ReceiveModalProps) {
  const { user } = usePrivy();
  const [copied, setCopied] = useState(false);

  const address = user?.wallet?.address || "";

  const handleCopy = async () => {
    if (!address) return;

    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      toast.success("Address copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("Failed to copy address");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] w-full max-w-full h-full sm:h-auto bg-surface/95 backdrop-blur-xl border-white/10 pb-safe">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <ArrowDownLeft className="w-6 h-6 text-secondary" />
            Receive SOL
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Share your address or QR code to receive payments.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          {/* QR Code */}
          <div className="flex justify-center">
            <div className="p-6 bg-white rounded-2xl shadow-lg">
              {address ? (
                <QRCode value={address} size={200} />
              ) : (
                <div className="w-[200px] h-[200px] bg-gray-200 rounded-xl flex items-center justify-center">
                  <p className="text-gray-500 text-sm">No wallet connected</p>
                </div>
              )}
            </div>
          </div>

          {/* Address Display */}
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground uppercase tracking-wider text-center">
              Your Wallet Address
            </p>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <p className="text-sm font-mono text-center break-all">
                {address || "Not connected"}
              </p>
            </div>
          </div>

          {/* Copy Button */}
          <Button
            onClick={handleCopy}
            disabled={!address}
            className="w-full h-12 bg-secondary hover:bg-secondary/80"
          >
            {copied ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="mr-2 h-4 w-4" />
                Copy Address
              </>
            )}
          </Button>

          {/* Info */}
          <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
            <p className="text-xs text-center text-muted-foreground">
              Send only <span className="font-bold text-primary">SOL</span> and{" "}
              <span className="font-bold text-primary">SPL tokens</span> to this address.
              Sending other assets may result in permanent loss.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
