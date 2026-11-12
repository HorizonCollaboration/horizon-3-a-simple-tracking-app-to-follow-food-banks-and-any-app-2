/* The look of buttons, shared by real buttons and by links that look like buttons. */

const base =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-control px-4 py-2 text-base font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-60";

const variants = {
  primary: "bg-primary text-on-primary hover:bg-primary-hover",
  outline: "border border-line bg-surface text-ink hover:bg-sunken",
  danger: "border border-danger bg-surface text-danger hover:bg-danger-soft",
};

export type ButtonVariant = keyof typeof variants;

export function buttonClass(variant: ButtonVariant = "primary", extra = ""): string {
  return `${base} ${variants[variant]} ${extra}`.trim();
}

export const textLinkClass =
  "font-medium text-primary underline underline-offset-2 hover:text-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary";

export const inputClass =
  "mt-1 block min-h-11 w-full rounded-control border border-line bg-surface px-3 py-2 text-base text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary";
