import { ReactNode } from "react";

export function Spinner({ className = "" }: { className?: string }) {
  return (
    <span
      role="status"
      aria-label="Cargando"
      className={`inline-block h-8 w-8 animate-spin rounded-full border-[3px] border-plum-200 border-t-plum-700 ${className}`}
    />
  );
}

/** Card-shaped placeholder matching ProductCard's footprint. */
export function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-3xl border border-cream-200 bg-white shadow-soft">
      <div className="skeleton aspect-[4/3] w-full rounded-none" />
      <div className="space-y-3 p-5">
        <div className="skeleton h-5 w-3/4" />
        <div className="skeleton h-3 w-full" />
        <div className="skeleton h-3 w-5/6" />
        <div className="skeleton mt-4 h-9 w-24 rounded-full" />
      </div>
    </div>
  );
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-cream-300 bg-cream-50 px-6 py-16 text-center">
      {icon && <div className="mb-4 text-4xl text-plum-300">{icon}</div>}
      <h3 className="text-xl font-semibold text-ink">{title}</h3>
      {description && <p className="mt-2 max-w-md text-sm text-ink-soft">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
