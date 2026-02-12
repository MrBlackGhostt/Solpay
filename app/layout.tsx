import type { Metadata } from "next";
import "./globals.css";
import { WalletProvider } from "@/providers/LazorkitProvider";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "SolPay - Seedless Solana Wallet",
  description: "Experience the future of Solana with SolPay. Secure, seedless, and biometric-fast.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased selection:bg-primary/30">
        <WalletProvider>
          {children}
          <Toaster position="top-center" richColors />
        </WalletProvider>
      </body>
    </html>
  );
}
