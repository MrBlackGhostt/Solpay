import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { WalletProvider } from "@/providers/LazorkitProvider";
import { Toaster } from "@/components/ui/sonner";
import PWARegister from "@/components/PWARegister";

export const metadata: Metadata = {
  title: "TapSOL - Solana Wallet",
  description: "Send Solana with Face ID. No seed phrases needed.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "TapSOL",
    startupImage: [
      "/icon-512.png",
    ],
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: "/icon-192.png",
    apple: "/icon-192.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#8B5CF6",
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
            <PWARegister />
          </ThemeProvider>
        </WalletProvider>
      </body>
    </html>
  );
}
