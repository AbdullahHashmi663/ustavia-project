import { colors, type ColorToken } from '@ustavia/shared';

/**
 * Maps shared token keys to the kebab-case CSS variable names used
 * throughout apps/admin's stylesheets. packages/shared/src/theme.ts stays
 * the single source of truth — nothing here duplicates a hex value.
 */
const CSS_VARIABLE_NAMES: Record<ColorToken, string> = {
  brandOrange: '--color-brand-orange',
  brandOrangeDark: '--color-brand-orange-dark',
  brandOrangeLight: '--color-brand-orange-light',
  brandBlue: '--color-brand-blue',
  brandBlueDark: '--color-brand-blue-dark',
  brandBlueLight: '--color-brand-blue-light',
  white: '--color-white',
  textPrimary: '--color-text-primary',
  textSecondary: '--color-text-secondary',
  textMuted: '--color-text-muted',
  border: '--color-border',
  surface: '--color-surface',
  success: '--color-success',
  warning: '--color-warning',
  danger: '--color-danger',
  info: '--color-info',
  tierBronze: '--color-tier-bronze',
  tierSilver: '--color-tier-silver',
  tierGold: '--color-tier-gold',
  tierDiamond: '--color-tier-diamond',
};

export function applyCssVariables(root: HTMLElement = document.documentElement): void {
  for (const [token, cssVariable] of Object.entries(CSS_VARIABLE_NAMES) as [ColorToken, string][]) {
    root.style.setProperty(cssVariable, colors[token]);
  }
}
