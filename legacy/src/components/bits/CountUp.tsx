"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

/**
 * CountUp — animated number (React Bits pattern), rewritten to respect the
 * site's constraints.
 *
 * Three things the stock version does not do:
 *  - renders the final value in the DOM first, so it is correct before hydration
 *    and for anyone who never triggers the animation,
 *  - honours `prefers-reduced-motion` by skipping straight to the value,
 *  - animates only once it scrolls into view, so numbers above the fold are not
 *    already finished by the time you reach them.
 */
export function CountUp({
  to,
  from = 0,
  duration = 1600,
  decimals = 0,
  prefix = "",
  suffix = "",
  separator = ",",
  className,
}: {
  to: number;
  from?: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  separator?: string;
  className?: string;
}) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const [value, setValue] = React.useState(to);
  const started = React.useRef(false);

  const format = React.useCallback(
    (n: number) => {
      const fixed = n.toFixed(decimals);
      const [whole, frac] = fixed.split(".");
      const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, separator);
      return `${prefix}${frac ? `${grouped}.${frac}` : grouped}${suffix}`;
    },
    [decimals, prefix, suffix, separator],
  );

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setValue(to);
      return;
    }

    const run = () => {
      if (started.current) return;
      started.current = true;
      const t0 = performance.now();
      // easeOutExpo — fast out of the gate, long settle, so the last digits read.
      const ease = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

      const tick = (now: number) => {
        const t = Math.min((now - t0) / duration, 1);
        setValue(from + (to - from) * ease(t));
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setValue(from);
            run();
            io.disconnect();
          }
        }
      },
      { threshold: 0.4 },
    );

    io.observe(el);
    return () => io.disconnect();
  }, [to, from, duration]);

  return (
    <span ref={ref} className={cn("font-mono tabular-nums", className)}>
      {format(value)}
    </span>
  );
}
