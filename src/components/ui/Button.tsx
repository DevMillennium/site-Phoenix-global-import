"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
  href?: string;
  children: React.ReactNode;
  className?: string;
  trackingEvent?: string;
  trackingPayload?: Record<string, unknown>;
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
  sm: "px-3 py-2 min-h-[36px] text-sm",
  md: "px-5 py-2.5 min-h-touch text-sm",
  lg: "px-6 py-3 min-h-touch text-base",
};

export function Button({
  variant = "primary",
  size = "md",
  href,
  children,
  className,
  trackingEvent,
  trackingPayload,
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-phoenix-primary disabled:pointer-events-none disabled:opacity-50 border touch-manipulation";

  const combined = cn(base, variants[variant], sizes[size], className);

  if (href) {
    const trackPayload = trackingPayload ? JSON.stringify(trackingPayload) : undefined;
    return (
      <Link
        href={href}
        className={combined}
        aria-label={typeof children === "string" ? children : "Ação"}
        data-track-event={trackingEvent}
        data-track-payload={trackPayload}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      type="button"
      className={combined}
      data-track-event={trackingEvent}
      data-track-payload={trackingPayload ? JSON.stringify(trackingPayload) : undefined}
      {...props}
    >
      {children}
    </button>
  );
}
