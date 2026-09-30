import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

/**
 * Static primitives — shadcn/ui shapes with no interactive dependency.
 * Everything reads the theme-following tokens (surface / body / subtle / line),
 * so a component never branches on light vs dark.
 */

/* ------------------------------------------------------------------ Card */

export const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("rounded-lg border border-line bg-surface", className)}
    {...props}
  />
));
Card.displayName = "Card";

export const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex flex-col gap-1 p-4", className)} {...props} />
));
CardHeader.displayName = "CardHeader";

export const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("text-lg font-semibold leading-tight tracking-[-0.01em] text-body", className)}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

export const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn("text-sm text-subtle", className)} {...props} />
));
CardDescription.displayName = "CardDescription";

export const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-4 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

export const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center gap-2 border-t border-line p-4", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

/* ----------------------------------------------------------------- Badge */

const badgeVariants = cva(
  cn(
    "inline-flex items-center gap-1 rounded-sm border px-2 py-0.5",
    "font-mono text-[0.7rem] uppercase tracking-[0.1em] whitespace-nowrap",
  ),
  {
    variants: {
      variant: {
        default: "border-line bg-surface-2 text-subtle",
        accent: "border-accent-line bg-accent-soft text-accent",
        solid: "border-transparent bg-accent text-paper-bright",
        outline: "border-line bg-transparent text-subtle",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

/* ------------------------------------------------------------- Separator */

export function Separator({
  orientation = "horizontal",
  label,
  className,
}: {
  orientation?: "horizontal" | "vertical";
  label?: string;
  className?: string;
}) {
  if (orientation === "vertical") {
    return (
      <div role="separator" aria-orientation="vertical" className={cn("w-px self-stretch bg-line", className)} />
    );
  }
  if (!label) {
    return <div role="separator" className={cn("h-px w-full bg-line", className)} />;
  }
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="h-px flex-1 bg-line" />
      <span className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-subtle">
        {label}
      </span>
      <div className="h-px flex-1 bg-line" />
    </div>
  );
}

/* -------------------------------------------------------------- Skeleton */

export function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden className={cn("animate-pulse rounded-sm bg-surface-2", className)} />;
}

/* ----------------------------------------------------------------- Alert */

const alertVariants = cva("flex gap-3 rounded-md border p-3", {
  variants: {
    variant: {
      default: "border-line bg-surface-2 text-body",
      accent: "border-accent-line bg-accent-soft text-body",
      destructive: "border-[var(--color-danger)]/40 bg-[var(--color-danger)]/10 text-body",
    },
  },
  defaultVariants: { variant: "default" },
});

export function Alert({
  variant,
  title,
  className,
  children,
}: VariantProps<typeof alertVariants> & {
  title: string;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div role={variant === "destructive" ? "alert" : "status"} className={cn(alertVariants({ variant }), className)}>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium">{title}</p>
        {children && <div className="mt-0.5 text-xs text-subtle">{children}</div>}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- Input */

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      "h-9 w-full rounded-md border border-line bg-surface px-3 text-sm text-body",
      "placeholder:text-subtle transition-colors duration-150",
      "hover:border-[var(--ink-400)] focus:border-accent focus:outline-none",
      "disabled:pointer-events-none disabled:opacity-45",
      className,
    )}
    {...props}
  />
));
Input.displayName = "Input";

/**
 * Underlined field — the quiet input treatment from the Social Impact Capital
 * reference: a rule, not a box, so the form recedes under the artwork.
 */
export const InputUnderline = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      "h-9 w-full border-0 border-b border-line bg-transparent px-0 text-sm text-body",
      "placeholder:font-mono placeholder:text-[0.7rem] placeholder:uppercase placeholder:tracking-[0.12em] placeholder:text-subtle",
      "transition-colors duration-150 focus:border-accent focus:outline-none",
      className,
    )}
    {...props}
  />
));
InputUnderline.displayName = "InputUnderline";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, rows = 4, ...props }, ref) => (
  <textarea
    ref={ref}
    rows={rows}
    className={cn(
      "w-full resize-y rounded-md border border-line bg-surface p-3 text-sm text-body",
      "placeholder:text-subtle transition-colors duration-150",
      "hover:border-[var(--ink-400)] focus:border-accent focus:outline-none",
      className,
    )}
    {...props}
  />
));
Textarea.displayName = "Textarea";

export function Label({
  className,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn(
        "font-mono text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-subtle",
        className,
      )}
      {...props}
    />
  );
}

/* -------------------------------------------------------------- Progress */

export function Progress({
  value,
  max = 100,
  label,
  className,
}: {
  value: number;
  max?: number;
  label?: string;
  className?: string;
}) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label && (
        <div className="flex items-baseline justify-between">
          <span className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-subtle">
            {label}
          </span>
          <span className="font-mono text-[0.65rem] tabular-nums text-body">
            {Math.round(pct)}%
          </span>
        </div>
      )}
      <div
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label}
        className="h-1 overflow-hidden rounded-full bg-surface-2"
      >
        <div
          className="h-full bg-accent transition-[width] duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ Stat */

export function Stat({
  label,
  value,
  sub,
  className,
}: {
  label: string;
  value: React.ReactNode;
  sub?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <span className="font-mono text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-subtle">
        {label}
      </span>
      <span className="font-mono text-2xl font-semibold leading-none tabular-nums text-body">
        {value}
      </span>
      {sub && <span className="text-xs text-subtle">{sub}</span>}
    </div>
  );
}
