"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
  href?: string;
  children: React.ReactNode;
  className?: string;
}

const variants = {
  primary:
    "bg-phoenix-primary text-white hover:bg-phoenix-primary-hover border-transparent",
  secondary:
    "bg-phoenix-card text-phoenix-text border-phoenix-border hover:bg-phoenix-surface",
  ghost: "bg-transparent text-phoenix-text-muted hover:bg-phoenix-card hover:text-phoenix-text",
  outline:
    "border border-phoenix-primary text-phoenix-primary hover:bg-phoenix-primary/10",
};

const sizes = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-5 py-2.5 text-sm",
  lg: "px-6 py-3 text-base",
};

export function Button({
  variant = "primary",
  size = "md",
  href,
  children,
  className,
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-phoenix-primary disabled:pointer-events-none disabled:opacity-50 border";

  const combined = cn(base, variants[variant], sizes[size], className);

  if (href) {
    return (
      <Link href={href} className={combined} aria-label={typeof children === "string" ? children : "Ação"}>
        {children}
      </Link>
    );
  }

  return (
    <button type="button" className={combined} {...props}>
      {children}
    </button>
  );
}
