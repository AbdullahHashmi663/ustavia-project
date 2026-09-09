/**
 * Design tokens — single source of truth for both apps/mobile (ThemeProvider)
 * and apps/admin (CSS variables). Do not hardcode hex values in either app;
 * import from here.
 */

export const colors = {
  brandOrange: '#F5680A',
  brandOrangeDark: '#C24F06',
  brandOrangeLight: '#FDECDD',

  brandBlue: '#1B6FB8',
  brandBlueDark: '#14507F',
  brandBlueLight: '#E4F0FA',

  white: '#FFFFFF',

  textPrimary: '#1A1A1A',
  textSecondary: '#5F5F5A',
  textMuted: '#8B8B85',
  border: '#E5E5E0',
  surface: '#F9F8F5',

  success: '#16A34A',
  warning: '#F59E0B',
  danger: '#DC2626',
  info: '#1B6FB8',

  tierBronze: '#B08D57',
  tierSilver: '#9CA3AF',
  tierGold: '#D4AF37',
  tierDiamond: '#3FB6C4',
} as const;

export type ColorToken = keyof typeof colors;

/** Accent used per role — orange for Mazdoor screens, blue for Customer screens. */
export const roleAccent = {
  mazdoor: colors.brandOrange,
  customer: colors.brandBlue,
} as const;

export const typography = {
  headingFamily: 'Poppins',
  bodyFamily: 'System',
} as const;

export const theme = {
  colors,
  roleAccent,
  typography,
} as const;

export type Theme = typeof theme;
