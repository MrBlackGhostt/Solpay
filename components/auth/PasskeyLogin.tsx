"use client";

import { useLogin, usePrivy } from "@privy-io/react-auth";
import { Button } from "@/components/ui/button";
import { Fingerprint, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const PasskeyLogin = () => {
  const router = useRouter();
  const { authenticated, ready } = usePrivy();
  
  const { login } = useLogin({
    onComplete: (user) => {
      console.log("User logged in:", user);
      toast.success("Welcome back!");
      router.push("/dashboard");
    },
    onError: (error) => {
      console.error("Login error:", error);
      toast.error("Failed to login");
    },
  });

  useEffect(() => {
    if (ready && authenticated) {
      router.push("/dashboard");
    }
  }, [ready, authenticated, router]);

  const isLoading = !ready;

  return (
    <Button
      onClick={login}
      disabled={isLoading || authenticated}
      size="lg"
      className="w-full h-14 text-lg font-semibold rounded-2xl transition-all hover:scale-[1.02] active:scale-[0.98] bg-primary hover:bg-primary-dark"
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Loading...
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
