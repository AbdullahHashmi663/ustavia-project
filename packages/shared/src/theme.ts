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
  black: '#000000',

  textPrimary: '#1A1A1A',
  textSecondary: '#5F5F5A',
  textMuted: '#8B8B85',
  border: '#E5E5E0',
  surface: '#F9F8F5',

  success: '#16A34A',
  successLight: '#E7F7ED',
  warning: '#F59E0B',
  warningLight: '#FEF3DE',
  danger: '#DC2626',
  dangerLight: '#FCE8E8',
  info: '#1B6FB8',
  infoLight: '#E4F0FA',

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
  /** Poppins is only loaded at these weights (see useLoadFonts.ts) — pick from this set, don't invent new suffixes. */
  headingWeights: {
    semibold: 'Poppins_600SemiBold',
    bold: 'Poppins_700Bold',
  },
  /** Type scale — px. Use the closest step rather than a one-off literal. */
  size: {
    xs: 12,
    sm: 13,
    base: 15,
    md: 16,
    lg: 18,
    xl: 22,
    xxl: 28,
  },
} as const;

/**
 * 4px-base spacing scale. Use these instead of ad hoc padding/margin/gap
 * literals so every screen shares one rhythm.
 */
export const spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

/** Corner radii — sm for chips/inputs, md for cards/buttons, full for pills/avatars. */
export const radii = {
  sm: 8,
  md: 12,
  lg: 16,
  full: 999,
} as const;

/**
 * Elevation tokens. Each level is a ready-to-spread React Native style object
 * (iOS shadow* props + Android `elevation`), so usage is
 * `style={[styles.card, shadows.sm]}` with no per-screen shadow tuning.
 */
export const shadows = {
  none: {},
  sm: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 1,
  },
  md: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  lg: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 6,
  },
} as const;

/** Minimum tap target side length — WCAG 2.1 (2.5.5) / both UX specs' "48px minimum tap area" note. */
export const minTouchTarget = 48;

export const theme = {
  colors,
  roleAccent,
  typography,
  spacing,
  radii,
  shadows,
  minTouchTarget,
} as const;

export type Theme = typeof theme;
