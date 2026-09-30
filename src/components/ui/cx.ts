/**
 * Join class names, dropping falsy entries.
 *
 * Deliberately NOT tailwind-merge: the kit styles components with their own
 * `.ui-*` classes rather than utility soup, so there is little to de-duplicate,
 * and tailwind-merge would need teaching about this project's custom theme keys
 * (`text-display`, `shadow-glow-signal`, ...) before it could merge them safely.
 *
 * A `class` passed into a component lands last in the attribute, which does not
 * by itself win the cascade - order in the stylesheet decides, not order in the
 * attribute. Tailwind utilities sit in the `utilities` layer and component rules
 * here are unlayered, so unlayered component rules win. Where you need a utility
 * to override one, mark it important (e.g. `!p-0`).
 */
export type ClassValue = string | false | null | undefined;

export const cx = (...parts: ClassValue[]): string =>
  parts.filter(Boolean).join(" ");
