import { theme as sharedTheme } from '@ustavia/shared';
import type { ViewStyle } from 'react-native';

export const palette = {
  // Brand Core - Primary requested colors
  orangeVibrant: '#FF6701', // Primary action / Mazdoor accent
  orangeWarm: '#FEA82F', // Warm amber / Stars / Radiance
  orangeDark: '#D95400',
  orangeLight: '#FFF4EB',
  orangeGlow: 'rgba(255, 103, 1, 0.25)',

  blueMarine: '#006199', // Trust anchor / Customer accent / Deep slate
  blueSky: '#8ACFF8', // Ice cyan / Soft highlights / Badges
  blueDark: '#004770',
  blueLight: '#EBF6FD',
  blueGlow: 'rgba(0, 97, 153, 0.22)',

  // Clean Slate Canvas & Surfaces
  white: '#FFFFFF',
  black: '#000000',
  canvas: '#F8FAFC',
  surface: '#FFFFFF',
  surfaceSubtle: '#F1F5F9',
  surfaceGlass: 'rgba(255, 255, 255, 0.88)',

  // Text Hierarchy
  textPrimary: '#0F172A', // Slate 900 - high contrast, award-winning crispness
  textSecondary: '#475569', // Slate 600
  textMuted: '#94A3B8', // Slate 400

  // Borders & Dividers
  border: '#E2E8F0', // Slate 200
  borderSubtle: '#F1F5F9',
  borderFocus: '#006199',

  // Feedback & Status
  success: '#10B981',
  successLight: '#ECFDF5',
  warning: '#F59E0B',
  warningLight: '#FFFBEB',
  danger: '#EF4444',
  dangerLight: '#FEF2F2',
  info: '#006199',
  infoLight: '#EBF6FD',

  // Mazdoor Tiers
  tierBronze: '#CD7F32',
  tierSilver: '#94A3B8',
  tierGold: '#FEA82F',
  tierDiamond: '#006199',
} as const;

export interface AppTheme {
  colors: {
    brandOrange: string;
    brandOrangeDark: string;
    brandOrangeLight: string;
    brandOrangeWarm: string;
    brandBlue: string;
    brandBlueDark: string;
    brandBlueLight: string;
    brandBlueSky: string;
    white: string;
    black: string;
    canvas: string;
    surface: string;
    surfaceSubtle: string;
    surfaceGlass: string;
    textPrimary: string;
    textSecondary: string;
    textMuted: string;
    border: string;
    borderSubtle: string;
    borderFocus: string;
    success: string;
    successLight: string;
    warning: string;
    warningLight: string;
    danger: string;
    dangerLight: string;
    info: string;
    infoLight: string;
    tierBronze: string;
    tierSilver: string;
    tierGold: string;
    tierDiamond: string;
    orangeGlow: string;
    blueGlow: string;
    [key: string]: string;
  };
  roleAccent: {
    mazdoor: string;
    customer: string;
  };
  typography: typeof sharedTheme.typography;
  spacing: typeof sharedTheme.spacing;
  radii: {
    sm: number;
    md: number;
    lg: number;
    full: number;
    xs?: number;
    xl?: number;
  };
  shadows: {
    none: ViewStyle;
    sm: ViewStyle;
    md: ViewStyle;
    lg: ViewStyle;
    glowOrange: ViewStyle;
    glowBlue: ViewStyle;
    [key: string]: ViewStyle;
  };
  gradients: {
    mazdoor: readonly [string, string];
    customer: readonly [string, string];
    glowOrange: readonly [string, string];
    glowBlue: readonly [string, string];
    surfaceGlow: readonly [string, string];
  };
  minTouchTarget: number;
}

export const appTheme: AppTheme = {
  colors: {
    ...sharedTheme.colors,
    brandOrange: palette.orangeVibrant,
    brandOrangeDark: palette.orangeDark,
    brandOrangeLight: palette.orangeLight,
    brandOrangeWarm: palette.orangeWarm,
    brandBlue: palette.blueMarine,
    brandBlueDark: palette.blueDark,
    brandBlueLight: palette.blueLight,
    brandBlueSky: palette.blueSky,
    white: palette.white,
    black: palette.black,
    canvas: palette.canvas,
    surface: palette.white,
    surfaceSubtle: palette.surfaceSubtle,
    surfaceGlass: palette.surfaceGlass,
    textPrimary: palette.textPrimary,
    textSecondary: palette.textSecondary,
    textMuted: palette.textMuted,
    border: palette.border,
    borderSubtle: palette.borderSubtle,
    borderFocus: palette.borderFocus,
    success: palette.success,
    successLight: palette.successLight,
    warning: palette.warning,
    warningLight: palette.warningLight,
    danger: palette.danger,
    dangerLight: palette.dangerLight,
    info: palette.blueMarine,
    infoLight: palette.blueLight,
    tierBronze: palette.tierBronze,
    tierSilver: palette.tierSilver,
    tierGold: palette.tierGold,
    tierDiamond: palette.tierDiamond,
    orangeGlow: palette.orangeGlow,
    blueGlow: palette.blueGlow,
  },
  roleAccent: {
    mazdoor: palette.orangeVibrant,
    customer: palette.blueMarine,
  },
  typography: sharedTheme.typography,
  spacing: sharedTheme.spacing,
  radii: {
    sm: 10,
    md: 14,
    lg: 18,
    full: 9999,
  },
  shadows: {
    none: {},
    sm: {
      shadowColor: '#0F172A',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    },
    md: {
      shadowColor: '#0F172A',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 12,
      elevation: 4,
    },
    lg: {
      shadowColor: '#0F172A',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.12,
      shadowRadius: 24,
      elevation: 8,
    },
    glowOrange: {
      shadowColor: palette.orangeVibrant,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.32,
      shadowRadius: 14,
      elevation: 6,
    },
    glowBlue: {
      shadowColor: palette.blueMarine,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.28,
      shadowRadius: 14,
      elevation: 6,
    },
  },
  gradients: {
    mazdoor: [palette.orangeVibrant, palette.orangeWarm] as const,
    customer: [palette.blueMarine, palette.blueSky] as const,
    glowOrange: ['rgba(255, 103, 1, 0.25)', 'transparent'] as const,
    glowBlue: ['rgba(0, 97, 153, 0.22)', 'transparent'] as const,
    surfaceGlow: ['rgba(138, 207, 248, 0.14)', 'rgba(254, 168, 47, 0.12)'] as const,
  },
  minTouchTarget: 48,
};
