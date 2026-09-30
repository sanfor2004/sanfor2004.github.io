"use client";

import * as React from "react";
import gsap from "gsap";
import { cn } from "@/lib/cn";

/**
 * CardSwap — the React Bits stacked-card carousel, adapted to this site.
 *
 * A deck of cards sits in perspective; on each beat the front card drops out,
 * the rest step forward, and the dropped card returns to the back. Adapted so
 * it behaves on a content site: it pauses when scrolled out of view or when the
 * tab is hidden, pauses on hover, and collapses to a plain stack under
 * `prefers-reduced-motion` rather than animating.
 */

export type CardSwapProps = {
  children: React.ReactNode;
  /** ms between swaps */
  interval?: number;
  /** px each card is offset from the one in front */
  offset?: number;
  /** px each card is pushed back in Z */
  depth?: number;
  width?: number | string;
  height?: number | string;
  className?: string;
};

export function CardSwap({
  children,
  interval = 3200,
  offset = 26,
  depth = 44,
  width = 360,
  height = 240,
  className,
}: CardSwapProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const refs = React.useRef<Array<HTMLDivElement | null>>([]);
  const order = React.useRef<number[]>([]);
  const timer = React.useRef<number | null>(null);
  const paused = React.useRef(false);

  const items = React.Children.toArray(children);
  const count = items.length;

  // Place every card at its slot in the stack. Slot 0 is the front card.
  const place = React.useCallback(
    (animate: boolean) => {
      order.current.forEach((cardIndex, slot) => {
        const el = refs.current[cardIndex];
        if (!el) return;
        const to = {
          x: slot * offset,
          y: slot * -offset * 0.55,
          z: slot * -depth,
          scale: 1 - slot * 0.05,
          zIndex: count - slot,
          opacity: slot > 3 ? 0 : 1,
        };
        if (animate) {
          gsap.to(el, { ...to, duration: 0.6, ease: "power3.inOut" });
        } else {
          gsap.set(el, to);
        }
      });
    },
    [count, offset, depth],
  );

  React.useEffect(() => {
    if (count === 0) return;
    order.current = Array.from({ length: count }, (_, i) => i);

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    place(false);
    if (reduced) return;

    const swap = () => {
      if (paused.current) return;
      const front = order.current.shift();
      if (front === undefined) return;
      const el = refs.current[front];

      // Drop the front card out, then slot it back in at the rear.
      if (el) {
        gsap
          .timeline()
          .to(el, { y: "+=120", opacity: 0, duration: 0.35, ease: "power2.in" })
          .set(el, { zIndex: 0 })
          .to(el, { opacity: 1, duration: 0.3 }, ">");
      }
      order.current.push(front);
      place(true);
    };

    timer.current = window.setInterval(swap, interval);

    // Stop burning frames when nobody can see it.
    const io = new IntersectionObserver(
      ([entry]) => {
        paused.current = !entry?.isIntersecting;
      },
      { threshold: 0.2 },
    );
    if (containerRef.current) io.observe(containerRef.current);

    const onVisibility = () => {
      paused.current = document.hidden;
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      if (timer.current) window.clearInterval(timer.current);
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [count, interval, place]);

  return (
    <div
      ref={containerRef}
      className={cn("relative select-none", className)}
      style={{ width, height, perspective: 1000 }}
      onMouseEnter={() => (paused.current = true)}
      onMouseLeave={() => (paused.current = false)}
    >
      {items.map((child, i) => (
        <div
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          className="absolute inset-0 origin-center"
          style={{ transformStyle: "preserve-3d" }}
        >
          {child}
        </div>
      ))}
    </div>
  );
}

/** A card face sized for the deck. Slots, so it carries no content opinions. */
export function SwapCard({
  eyebrow,
  title,
  children,
  className,
}: {
  eyebrow?: string;
  title?: string;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex h-full w-full flex-col gap-2 rounded-lg border border-line bg-surface p-5",
        "shadow-[var(--shadow-pop)]",
        className,
      )}
    >
      {eyebrow && (
        <span className="font-mono text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-accent">
          {eyebrow}
        </span>
      )}
      {title && <h3 className="text-lg font-semibold leading-tight text-body">{title}</h3>}
      {children && <div className="text-sm text-subtle">{children}</div>}
    </div>
  );
}
