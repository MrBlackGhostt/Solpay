"use client";

import { useWallet } from "@lazorkit/wallet";
import { Button } from "@/components/ui/button";
import { Fingerprint, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const PasskeyLogin = () => {
  const { connect, isConnecting, isConnected, error } = useWallet();
  const router = useRouter();

  useEffect(() => {
    if (isConnected) {
      router.push("/dashboard");
    }
  }, [isConnected, router]);

  useEffect(() => {
    if (error) {
      toast.error(error.message || "Failed to connect wallet");
    }
  }, [error]);

  const handleLogin = async () => {
    try {
      await connect();
      toast.success("Welcome to SolPay!");
    } catch (err: any) {
      console.error("Login failed:", err);
      // useWallet error state will handle the toast
    }
  };

  return (
    <Button
      onClick={handleLogin}
      disabled={isConnecting}
      size="lg"
      className="w-full h-14 text-lg font-semibold rounded-2xl transition-all hover:scale-[1.02] active:scale-[0.98] bg-primary hover:bg-primary-dark"
    >
      {isConnecting ? (
        <>
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Authenticating...
        </>
      ) : (
        <>
          <Fingerprint className="mr-2 h-6 w-6" />
          Continue with Passkey
        </>
      )}
    </Button>
  );
};
