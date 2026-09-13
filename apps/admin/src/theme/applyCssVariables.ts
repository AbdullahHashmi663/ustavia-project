import { colors, type ColorToken } from '@ustavia/shared';

/**
 * Maps shared token keys to CSS custom properties injected at runtime.
 * packages/shared/src/theme.ts stays the single source of truth — nothing
 * here duplicates a hex value.
 *
 * These are namespaced `--token-color-*` (not `--color-*`) on purpose: Tailwind's
 * `@theme` block in index.css defines `--color-*` itself (that's the namespace
 * Tailwind scans to generate `bg-*`/`text-*`/`border-*` utilities), and each of
 * those entries points at the matching `--token-color-*` variable set here — see
 * index.css. That indirection is what lets `bg-brand-orange` etc. reflect
 * runtime-injected tokens instead of a value baked in at build time.
 */
const CSS_VARIABLE_NAMES: Record<ColorToken, string> = {
  brandOrange: '--token-color-brand-orange',
  brandOrangeDark: '--token-color-brand-orange-dark',
  brandOrangeLight: '--token-color-brand-orange-light',
  brandBlue: '--token-color-brand-blue',
  brandBlueDark: '--token-color-brand-blue-dark',
  brandBlueLight: '--token-color-brand-blue-light',
  white: '--token-color-white',
  black: '--token-color-black',
  textPrimary: '--token-color-text-primary',
  textSecondary: '--token-color-text-secondary',
  textMuted: '--token-color-text-muted',
  border: '--token-color-border',
  surface: '--token-color-surface',
  success: '--token-color-success',
  successLight: '--token-color-success-light',
  warning: '--token-color-warning',
  warningLight: '--token-color-warning-light',
  danger: '--token-color-danger',
  dangerLight: '--token-color-danger-light',
  info: '--token-color-info',
  infoLight: '--token-color-info-light',
  tierBronze: '--token-color-tier-bronze',
  tierSilver: '--token-color-tier-silver',
  tierGold: '--token-color-tier-gold',
  tierDiamond: '--token-color-tier-diamond',
};

export function applyCssVariables(root: HTMLElement = document.documentElement): void {
  for (const [token, cssVariable] of Object.entries(CSS_VARIABLE_NAMES) as [ColorToken, string][]) {
    root.style.setProperty(cssVariable, colors[token]);
  }
}
