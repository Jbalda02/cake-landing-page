import { ButtonHTMLAttributes, ReactNode } from "react";
import { Link } from "react-router-dom";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-wide " +
  "transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary:
    "bg-plum-700 text-cream-50 shadow-soft hover:bg-plum-800 hover:shadow-lift active:translate-y-px",
  secondary:
    "border border-plum-300 bg-cream-50 text-plum-800 hover:border-plum-500 hover:bg-plum-50",
  ghost: "text-plum-700 hover:bg-plum-50",
  danger: "bg-blush-500 text-white hover:bg-blush-400 active:translate-y-px",
};

const sizes: Record<Size, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-sm",
  lg: "px-8 py-4 text-base",
};

interface CommonProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...rest
}: CommonProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...rest}>
      {children}
    </button>
  );
}

export function ButtonLink({
  to,
  variant = "primary",
  size = "md",
  className = "",
  children,
}: CommonProps & { to: string }) {
  const isExternal = /^https?:\/\//.test(to);
  const classes = `${base} ${variants[variant]} ${sizes[size]} ${className}`;

  if (isExternal) {
    return (
      <a href={to} target="_blank" rel="noopener noreferrer" className={classes}>
        {children}
      </a>
    );
  }

  return (
    <Link to={to} className={classes}>
      {children}
    </Link>
  );
}
