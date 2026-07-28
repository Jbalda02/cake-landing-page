import { InputHTMLAttributes, useId } from "react";

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: string;
  error?: string;
}

/**
 * Labelled input. The old forms used bare <label> tags with margin hacks
 * (mr-48, mr-44…) to fake alignment and never linked label to input,
 * so clicking a label did nothing and screen readers saw orphaned text.
 */
export function Field({ label, hint, error, className = "", ...rest }: FieldProps) {
  const generatedId = useId();
  const id = rest.id ?? generatedId;
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;

  return (
    <div className={`w-full ${className}`}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-ink-soft">
        {label}
      </label>
      <input
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={`w-full rounded-xl border bg-white px-4 py-3 text-ink placeholder:text-ink-muted
          transition-colors focus:border-plum-500
          ${error ? "border-blush-500" : "border-cream-300 hover:border-cream-400"}`}
        {...rest}
      />
      {hint && !error && (
        <p id={`${id}-hint`} className="mt-1.5 text-xs text-ink-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-xs font-medium text-blush-500">
          {error}
        </p>
      )}
    </div>
  );
}
