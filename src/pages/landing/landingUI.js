/* Shared class strings so buttons, sections and headings look the same everywhere. */

const focusRing =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lp-accent-text';

export const container = 'mx-auto w-full max-w-[1120px] px-5 sm:px-8';

export const sectionSpacing = 'py-20 sm:py-24 lg:py-32';

export const btnPrimary = `inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full bg-lp-accent px-5 py-2.5 text-sm font-medium text-lp-accent-ink transition duration-200 hover:bg-lp-accent-hover active:scale-[0.98] ${focusRing}`;

export const btnSecondary = `inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full border border-lp-line-strong px-5 py-2.5 text-sm font-medium text-lp-fg transition duration-200 hover:bg-lp-fg/5 active:scale-[0.98] ${focusRing}`;

export const btnGhost = `inline-flex items-center justify-center whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium text-lp-muted transition-colors duration-200 hover:text-lp-fg ${focusRing}`;

export const btnLarge = 'px-6 py-3 text-[0.95rem]';

export const eyebrow =
  'inline-flex items-center gap-2 rounded-full border border-lp-line bg-lp-surface/70 px-3.5 py-1.5 text-xs font-medium text-lp-muted';

export const sectionTitle =
  'font-lp-display text-[clamp(2rem,4vw,3rem)] font-medium leading-[1.1] tracking-[-0.02em] text-lp-fg';

export const sectionLead = 'text-base leading-7 text-lp-muted sm:text-[1.0625rem]';

export const card = 'rounded-2xl border border-lp-line bg-lp-surface';

export { focusRing };