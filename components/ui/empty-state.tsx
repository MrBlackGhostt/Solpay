import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center space-y-3">
      <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
        <Icon className="w-6 h-6 text-muted-foreground/50" />
      </div>
      <div className="space-y-1">
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      {action && <div className="pt-2">{action}</div>}
    </div>
  );
}
