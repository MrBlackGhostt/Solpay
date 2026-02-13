"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, Share, PlusSquare } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { usePathname } from "next/navigation";

// Define the beforeinstallprompt event interface
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export default function AddToHomeScreen() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      return;
    }

    // Check if dismissed previously
    const isDismissed = localStorage.getItem("pwaDismissed");
    if (isDismissed) {
      // Optional: Check timestamp to show again after X days
      return;
    }

    // Check if iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    if (isIosDevice) {
      // Show iOS prompt after a delay
      const timer = setTimeout(() => setIsVisible(true), 3000);
      return () => clearTimeout(timer);
    }

    // Chrome/Android logic
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsVisible(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIOSInstructions(true);
    } else if (deferredPrompt) {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User response to the install prompt: ${outcome}`);
      setDeferredPrompt(null);
      setIsVisible(false);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem("pwaDismissed", "true");
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Floating Banner */}
      <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:w-96 animate-in fade-in slide-in-from-bottom-10 duration-500">
        <div className="bg-primary text-primary-foreground rounded-lg shadow-lg p-4 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-white/20" />
          
          <button 
            onClick={handleDismiss}
            className="absolute top-2 right-2 p-1 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="flex flex-col gap-3">
            <div className="pr-6">
              <h3 className="font-semibold text-lg">Install TapSOL</h3>
              <p className="text-sm opacity-90">
                Add to home screen for the best experience.
              </p>
            </div>
            
            <Button 
              onClick={handleInstallClick}
              variant="secondary"
              className="w-full font-semibold"
            >
              Add to Home Screen
            </Button>
          </div>
        </div>
      </div>

      {/* iOS Instructions Modal */}
      <Dialog open={showIOSInstructions} onOpenChange={setShowIOSInstructions}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Install on iOS</DialogTitle>
            <DialogDescription>
              Follow these simple steps to add TapSOL to your home screen.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4">
            <div className="flex items-center gap-4">
              <div className="bg-muted p-2 rounded-lg">
                <Share className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="font-medium">1. Tap the Share button</p>
                <p className="text-sm text-muted-foreground">Usually at the bottom of your screen</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-muted p-2 rounded-lg">
                <PlusSquare className="h-6 w-6 text-gray-700 dark:text-gray-300" />
              </div>
              <div>
                <p className="font-medium">2. Select "Add to Home Screen"</p>
                <p className="text-sm text-muted-foreground">Scroll down to find this option</p>
              </div>
            </div>
          </div>
          <Button onClick={() => setShowIOSInstructions(false)} className="w-full">
            Got it
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
