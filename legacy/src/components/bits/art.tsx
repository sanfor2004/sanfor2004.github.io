"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

/**
 * Art layer — the duotone/stipple register from the reference boards.
 *
 * Two inks and no more: the paper ground shows through, the ink does the
 * shading. Everything here is decorative — aria-hidden, non-interactive, and
 * never the only thing carrying information.
 */

/* --------------------------------------------------------------- Halftone */

/**
 * Duotone halftone: an image reduced to dots of one ink on the paper ground,
 * as in the ultramarine statue board. Implemented with an SVG filter so the
 * source image keeps its own resolution and no canvas work is needed.
 *
 * `ink` and `paper` default to the live theme tokens, so the treatment flips
 * with light/dark instead of being baked in.
 */
export function Halftone({
  src,
  alt = "",
  dotSize = 3,
  contrast = 12,
  className,
}: {
  src: string;
  alt?: string;
  dotSize?: number;
  contrast?: number;
  className?: string;
}) {
  const id = React.useId().replace(/:/g, "");
  return (
    <figure className={cn("relative overflow-hidden", className)}>
      <svg className="absolute size-0" aria-hidden>
        <filter id={`halftone-${id}`}>
          {/* Flatten to luminance, crush to near 1-bit, then punch the dot grid. */}
          <feColorMatrix
            type="matrix"
            values="0.33 0.33 0.33 0 0
                    0.33 0.33 0.33 0 0
                    0.33 0.33 0.33 0 0
                    0    0    0    1 0"
          />
          <feComponentTransfer>
            <feFuncR type="gamma" exponent={contrast} />
            <feFuncG type="gamma" exponent={contrast} />
            <feFuncB type="gamma" exponent={contrast} />
          </feComponentTransfer>
        </filter>
      </svg>
      <img
        src={src}
        alt={alt}
        className="block h-full w-full object-cover"
        style={{ filter: `url(#halftone-${id})` }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 mix-blend-screen"
        style={{
          backgroundImage:
            "radial-gradient(circle at center, transparent 32%, var(--color-bg) 34%)",
          backgroundSize: `${dotSize}px ${dotSize}px`,
        }}
      />
    </figure>
  );
}

/* --------------------------------------------------------------- Stipple */

/**
 * Stipple shading — the engraving register from the sage "Mapping the future
 * of AI" board. Dot density falls off across the field rather than a gradient
 * changing lightness, which is what makes it read as ink on paper.
 */
export function StippleField({
  direction = 160,
  className,
  children,
}: {
  direction?: number;
  className?: string;
  children?: React.ReactNode;
}) {
  const fade = `linear-gradient(${direction}deg, #000 0%, rgb(0 0 0 / 0.55) 42%, transparent 88%)`;
  return (
    <div className={cn("relative overflow-hidden bg-surface", className)}>
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle at center, var(--color-text) 0.9px, transparent 1px)",
          backgroundSize: "5px 5px",
          maskImage: fade,
          WebkitMaskImage: fade,
          opacity: 0.55,
        }}
      />
      {children && <div className="relative">{children}</div>}
    </div>
  );
}

/* ----------------------------------------------------------------- Grain */

/** Uniform paper grain. One density across the whole field, never only the darks. */
export function Grain({ opacity = 0.35 }: { opacity?: number }) {
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute inset-0 mix-blend-multiply"
      style={{
        opacity,
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)' opacity='0.35'/%3E%3C/svg%3E\")",
      }}
    />
  );
}

/* ---------------------------------------------------------- DecryptedText */

/**
 * DecryptedText — the React Bits scramble reveal, which sits naturally next to
 * the site's existing ASCII/terminal labels.
 *
 * The real text is in the DOM from the start and the scramble is layered as an
 * aria-hidden overlay, so the accessible name never changes mid-animation and
 * reduced-motion users simply see the text.
 */
export function DecryptedText({
  text,
  speed = 45,
  className,
}: {
  text: string;
  speed?: number;
  className?: string;
}) {
  const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/\\<>[]{}#*+=-_";
  const ref = React.useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = React.useState(text);
  const [scrambling, setScrambling] = React.useState(false);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    let raf = 0;
    let done = false;

    const run = () => {
      setScrambling(true);
      const step = () => {
        const revealed = Math.floor(frame / 2);
        setDisplay(
          text
            .split("")
            .map((ch, i) => {
              if (ch === " ") return ch;
              if (i < revealed) return ch;
              return CHARS[Math.floor(Math.random() * CHARS.length)];
            })
            .join(""),
        );
        frame += 1;
        if (revealed <= text.length) {
          raf = window.setTimeout(() => requestAnimationFrame(step), speed);
        } else {
          setDisplay(text);
          setScrambling(false);
          done = true;
        }
      };
      step();
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting && !done) {
          run();
          io.disconnect();
        }
      },
      { threshold: 0.5 },
    );
    io.observe(el);

    return () => {
      io.disconnect();
      window.clearTimeout(raf);
    };
  }, [text, speed]);

  return (
    <span ref={ref} className={cn("relative font-mono", className)}>
      {/* The accessible, selectable text — never replaced. */}
      <span className={scrambling ? "invisible" : undefined}>{text}</span>
      {scrambling && (
        <span aria-hidden className="absolute inset-0 text-accent">
          {display}
        </span>
      )}
    </span>
  );
}
