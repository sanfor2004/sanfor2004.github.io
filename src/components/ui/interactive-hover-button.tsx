import type { ButtonHTMLAttributes } from "react";
import { Calendar } from "lucide-react";

import { cn } from "@/lib/cn";

/**
 * Ported from Magic UI's Interactive Hover Button
 * (https://magicui.design/docs/components/interactive-hover-button), adapted
 * to the Ink/Ember tokens: shadcn's bg-background/bg-primary/text-primary-foreground
 * become bg-silk/bg-(--signal)/text-ember-paper (the dot's hover-fill is the same
 * #EE5712 as --ember-primary, so its overlay text takes the Ember-surface pairing,
 * not the AA text-signal variant), and spans replace divs so the button's content
 * stays valid phrasing content. Pure CSS group-hover — no client directive needed
 * where this is used.
 */
export function InteractiveHoverButton({
  children,
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        "group border-line bg-silk text-frost relative w-auto cursor-pointer overflow-hidden rounded-full border p-2 px-6 text-center font-semibold",
        className,
      )}
      {...props}
    >
      <span className="inline-flex items-center justify-center gap-2">
        <span className="bg-(--signal) ease-standard duration-(--duration-base) h-2 w-2 rounded-full transition-transform group-hover:scale-[100.8]" />
        <span className="ease-standard duration-(--duration-base) inline-block transition-all group-hover:translate-x-12 group-hover:opacity-0">
          {children}
        </span>
      </span>
      <span
        aria-hidden="true"
        className="text-ember-paper ease-standard duration-(--duration-base) absolute top-0 z-10 flex h-full w-full translate-x-12 items-center justify-center gap-2 opacity-0 transition-all group-hover:-translate-x-5 group-hover:opacity-100"
      >
        <span>{children}</span>
        <Calendar className="size-4" />
      </span>
    </button>
  );
}
