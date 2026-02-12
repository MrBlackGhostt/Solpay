import { PasskeyLogin } from "@/components/auth/PasskeyLogin";
import { Shield, Zap, Smartphone, Globe } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen relative overflow-hidden bg-background selection:bg-primary/20">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full animate-pulse-subtle" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/5 blur-[120px] rounded-full animate-pulse-subtle" style={{ animationDelay: '1s' }} />

      <div className="max-w-6xl mx-auto px-6 py-12 md:py-24 relative z-10">
        {/* Header */}
        <nav className="flex items-center justify-between mb-20 animate-fade-in">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
              <Zap className="text-white w-6 h-6 fill-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
              SolPay
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <a href="#" className="hover:text-primary transition-colors">Features</a>
            <a href="#" className="hover:text-primary transition-colors">Security</a>
            <a href="#" className="hover:text-primary transition-colors">Developers</a>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8 animate-slide-up">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Now Live on Devnet
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1]">
              The Future of <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-secondary animate-gradient">
                Seedless
              </span> Solana.
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl">
              Experience the first truly biometric Solana wallet. No seed phrases, 
              no jargon, just pure speed. Secure your assets with FaceID or TouchID.
            </p>

            <div className="max-w-sm pt-4">
              <PasskeyLogin />
              <p className="mt-4 text-xs text-center text-muted-foreground">
                By continuing, you agree to our terms and privacy policy.
              </p>
            </div>
          </div>

          <div className="hidden lg:block relative animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="relative z-10 rounded-3xl border border-white/10 bg-surface/50 backdrop-blur-3xl p-8 shadow-2xl glass-card">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-secondary/20 flex items-center justify-center">
                    <Shield className="text-secondary w-6 h-6" />
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground uppercase tracking-widest">Security Level</p>
                    <p className="font-bold text-secondary">Bank Grade</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="h-[2px] w-full bg-gradient-to-r from-secondary/50 to-transparent rounded-full" />
                  <div className="grid grid-cols-2 gap-4">
                    <FeatureItem icon={<Fingerprint className="w-4 h-4" />} title="Passkey Auth" />
                    <FeatureItem icon={<Smartphone className="w-4 h-4" />} title="Mobile First" />
                    <FeatureItem icon={<Zap className="w-4 h-4" />} title="Instant Tx" />
                    <FeatureItem icon={<Globe className="w-4 h-4" />} title="Global Acc" />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Abstract visual elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] border border-primary/10 rounded-full animate-spin-slow pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] border border-accent/5 rounded-full animate-spin-slow-reverse pointer-events-none" />
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-32 pt-12 border-t border-white/5 grid md:grid-cols-3 gap-12 animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <StatItem value="100%" label="Seedless Experience" />
          <StatItem value="< 2s" label="Transaction Finality" />
          <StatItem value="Zero" label="On-boarding Friction" />
        </div>
      </div>
    </main>
  );
}

function FeatureItem({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
      <div className="text-primary">{icon}</div>
      <span className="text-sm font-medium">{title}</span>
    </div>
  );
}

function StatItem({ value, label }: { value: string; label: string }) {
  return (
    <div className="space-y-1">
      <p className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-br from-white to-white/50">{value}</p>
      <p className="text-sm text-muted-foreground font-medium">{label}</p>
    </div>
  );
}

import { Fingerprint } from "lucide-react";
