"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useWallet } from "@lazorkit/wallet";
import { useContacts } from "@/hooks/useContacts";
import { useTokenBalances, TokenBalance } from "@/hooks/useTokenBalances";
import { SystemProgram, LAMPORTS_PER_SOL, PublicKey, TransactionInstruction } from "@solana/web3.js";
import { 
  getAssociatedTokenAddressSync, 
  createTransferCheckedInstruction, 
  createAssociatedTokenAccountInstruction,
  getAccount
} from "@solana/spl-token";
import { toast } from "sonner";
import { Contact } from "@/types/contact";
import { ArrowUpRight, Loader2, Coins, Zap } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

const SOL_TOKEN: TokenBalance = {
  mint: "native",
  symbol: "SOL",
  balance: 0,
  decimals: 9,
};

interface SendModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SendModal({ open, onOpenChange }: SendModalProps) {
  const { smartWalletPubkey, signAndSendTransaction, isConnected } = useWallet();
  const { contacts, updateLastUsed } = useContacts();
  const { tokens } = useTokenBalances();
  
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [manualAddress, setManualAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedToken, setSelectedToken] = useState<TokenBalance>(SOL_TOKEN);
  const [isSending, setIsSending] = useState(false);

  const recipientAddress = selectedContact?.address || manualAddress;

  const handleSend = async () => {
    if (!isConnected || !smartWalletPubkey) {
      toast.error("Please connect your wallet first");
      return;
    }

    if (!recipientAddress) {
      toast.error("Please select a contact or enter an address");
      return;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    setIsSending(true);

    try {
      const { Connection } = await import("@solana/web3.js");
      const connection = new Connection(
        process.env.NEXT_PUBLIC_SOLANA_RPC || "https://api.devnet.solana.com"
      );
      
      const recipientPubkey = new PublicKey(recipientAddress);
      const instructions: TransactionInstruction[] = [];

      if (selectedToken.mint === "native") {
        // SOL Transfer
        instructions.push(
          SystemProgram.transfer({
            fromPubkey: smartWalletPubkey,
            toPubkey: recipientPubkey,
            lamports: Math.floor(amountNum * LAMPORTS_PER_SOL),
          })
        );
      } else {
        // SPL Token Transfer
        const mintPubkey = new PublicKey(selectedToken.mint);
        const fromAta = getAssociatedTokenAddressSync(mintPubkey, smartWalletPubkey);
        const toAta = getAssociatedTokenAddressSync(mintPubkey, recipientPubkey);

        // Check if destination ATA exists
        try {
          await getAccount(connection, toAta);
        } catch (e: any) {
          // If account doesn't exist, create it
          if (e.name === "TokenAccountNotFoundError" || e.name === "TokenInvalidAccountOwnerError") {
            instructions.push(
              createAssociatedTokenAccountInstruction(
                smartWalletPubkey, // payer
                toAta,
                recipientPubkey,
                mintPubkey
              )
            );
          } else {
            throw e;
          }
        }

        instructions.push(
          createTransferCheckedInstruction(
            fromAta,
            mintPubkey,
            toAta,
            smartWalletPubkey,
            Math.floor(amountNum * Math.pow(10, selectedToken.decimals)),
            selectedToken.decimals
          )
        );
      }

      // Sign and send transaction
      const signature = await signAndSendTransaction({
        instructions,
      });

      // Update last used for contact
      if (selectedContact) {
        updateLastUsed(selectedContact.id);
      }

      toast.success(
        <div className="space-y-1">
          <p className="font-semibold">Transaction Sent!</p>
          <p className="text-xs font-mono truncate">{signature}</p>
        </div>
      );

      // Reset form
      setSelectedContact(null);
      setManualAddress("");
      setAmount("");
      setSelectedToken(SOL_TOKEN);
      onOpenChange(false);
    } catch (error: any) {
      console.error("Transaction failed detailed error:", error);
      
      // Extract the most relevant error message
      let errorMessage = "Transaction failed";
      
      if (error.message) {
        if (error.message.includes("User rejected")) {
          errorMessage = "Transaction rejected by user";
        } else if (error.message.includes("simulation failed")) {
          errorMessage = "Transaction simulation failed. Check if you have enough funds.";
        } else {
          errorMessage = error.message;
        }
      }
      
      toast.error(errorMessage);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] w-full max-w-full h-full sm:h-auto bg-surface/95 backdrop-blur-xl border-white/10 pb-safe">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <ArrowUpRight className="w-6 h-6 text-primary" />
            Send {selectedToken.symbol}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Transfer {selectedToken.symbol} to any Solana address instantly.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          {/* Token Selection */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Select Currency</Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full h-12 justify-between bg-white/5 border-white/10 hover:bg-white/10">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                      {selectedToken.mint === "native" ? <Zap className="w-3 h-3 text-primary" /> : <Coins className="w-3 h-3 text-accent" />}
                    </div>
                    <span className="font-medium">{selectedToken.symbol}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      Balance: {selectedToken.mint === "native" ? "---" : selectedToken.balance}
                    </span>
                    <Zap className="w-4 h-4 text-muted-foreground" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)] bg-surface/95 backdrop-blur-xl border-white/10">
                <DropdownMenuLabel>Available Assets</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-white/5" />
                <DropdownMenuItem 
                  className="gap-2 focus:bg-primary/20"
                  onClick={() => setSelectedToken(SOL_TOKEN)}
                >
                  <Zap className="w-4 h-4 text-primary" />
                  <span>Solana (SOL)</span>
                </DropdownMenuItem>
                {tokens.map((token) => (
                  <DropdownMenuItem 
                    key={token.mint} 
                    className="gap-2 focus:bg-accent/20"
                    onClick={() => setSelectedToken(token)}
                  >
                    <Coins className="w-4 h-4 text-accent" />
                    <div className="flex justify-between flex-1">
                      <span>{token.symbol}</span>
                      <span className="text-xs text-muted-foreground">{token.balance}</span>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Contact Selection */}
          {contacts.length > 0 && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Quick Select Contact</Label>
              <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                {contacts.map((contact) => (
                  <button
                    key={contact.id}
                    onClick={() => {
                      setSelectedContact(contact);
                      setManualAddress("");
                    }}
                    className={`
                      p-3 rounded-xl text-left transition-all
                      ${selectedContact?.id === contact.id
                        ? 'bg-primary/20 ring-2 ring-primary'
                        : 'bg-white/5 hover:bg-white/10'
                      }
                    `}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{contact.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{contact.name}</p>
                        <p className="text-xs text-muted-foreground font-mono truncate">
                          {contact.address.slice(0, 4)}...{contact.address.slice(-4)}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Manual Address Input */}
          <div className="space-y-2">
            <Label htmlFor="address" className="text-sm font-medium">
              {contacts.length > 0 ? "Or Enter Address Manually" : "Recipient Address"}
            </Label>
            <Input
              id="address"
              placeholder="Enter Solana address"
              value={manualAddress}
              onChange={(e) => {
                setManualAddress(e.target.value);
                setSelectedContact(null);
              }}
              disabled={!!selectedContact}
              className="h-12 bg-white/5 border-white/10 focus:border-primary font-mono text-sm"
            />
          </div>

          {/* Amount Input */}
          <div className="space-y-2">
            <Label htmlFor="amount" className="text-sm font-medium">Amount ({selectedToken.symbol})</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="h-12 bg-white/5 border-white/10 focus:border-primary text-lg"
            />
          </div>

          {/* Transaction Preview */}
          {recipientAddress && amount && parseFloat(amount) > 0 && (
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Transaction Preview</p>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">To:</span>
                  <span className="font-mono">
                    {selectedContact?.name || `${recipientAddress.slice(0, 4)}...${recipientAddress.slice(-4)}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Amount:</span>
                  <span className="font-bold">{amount} {selectedToken.symbol}</span>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 h-12 border-white/10 hover:bg-white/5"
              disabled={isSending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSend}
              className="flex-1 h-12 bg-primary hover:bg-primary-dark"
              disabled={isSending || !recipientAddress || !amount || parseFloat(amount) <= 0}
            >
              {isSending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <ArrowUpRight className="mr-2 h-4 w-4" />
                  Send {selectedToken.symbol}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
