import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

/**
 * Button — shadcn/ui pattern (CVA variants + `asChild`), styled against the
 * site's cream/ink/orange tokens rather than shadcn's default palette.
 *
 * Orange is a signal, not decoration: `default` is the one accent-carrying
 * variant, and a view should have at most one of it.
 */
const buttonVariants = cva(
  cn(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md",
    "font-sans font-medium transition-colors duration-150",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
    "disabled:pointer-events-none disabled:opacity-45",
    "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  ),
  {
    variants: {
      variant: {
        default: "bg-accent text-paper-bright hover:bg-accent-bright",
        outline:
          "border border-line bg-transparent text-body hover:border-accent hover:text-accent",
        ghost: "bg-transparent text-subtle hover:bg-surface-2 hover:text-body",
        link: "bg-transparent text-accent underline-offset-4 hover:underline",
        destructive: "bg-[var(--color-danger)] text-paper-bright hover:brightness-110",
        // The terminal register the site already speaks in.
        mono: cn(
          "border border-line bg-transparent font-mono text-xs uppercase tracking-[0.12em]",
          "text-subtle hover:border-accent hover:text-accent",
        ),
      },
      size: {
        sm: "h-8 px-3 text-xs",
        md: "h-9 px-4 text-sm",
        lg: "h-11 px-6 text-base",
        icon: "size-9",
      },
    },
    defaultVariants: { variant: "default", size: "md" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** Render the child element instead of a <button>, keeping the styling. */
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { buttonVariants };
