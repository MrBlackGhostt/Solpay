"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownLeft } from "lucide-react";

interface QuickActionsProps {
  onSend: () => void;
  onReceive: () => void;
}

export function QuickActions({ onSend, onReceive }: QuickActionsProps) {
  return (
    <>
      <Card 
        className="bg-surface/50 border-white/5 backdrop-blur-sm cursor-pointer hover:bg-surface/80 transition-colors group"
        onClick={onSend}
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
        onClick={onReceive}
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
    </>
  );
}
