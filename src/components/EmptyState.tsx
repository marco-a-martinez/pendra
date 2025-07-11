import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ 
  icon: Icon, 
  title, 
  description, 
  actionLabel, 
  onAction 
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
        <Icon className="w-10 h-10 text-primary" />
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-3">
        {title}
      </h3>
      <p className="text-muted-foreground mb-8 max-w-md leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="btn-primary"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
