import type { LucideIcon } from "lucide-react";

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex min-h-60 flex-col items-center justify-center px-6 text-center">
      <div className="mb-4 grid size-12 place-items-center rounded-full bg-surface-muted text-primary">
        <Icon size={22} />
      </div>
      <h3 className="text-base font-bold">{title}</h3>
      <p className="mt-1 max-w-sm text-sm leading-6 text-muted">{description}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
