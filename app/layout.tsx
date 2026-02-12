import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
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
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased selection:bg-primary/30">
        <WalletProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster position="top-center" richColors />
          </ThemeProvider>
        </WalletProvider>
      </body>
    </html>
  );
}
