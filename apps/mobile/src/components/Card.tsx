import type { PropsWithChildren } from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';

import { useTheme } from '../theme/ThemeProvider';

interface CardProps {
  style?: ViewStyle;
  /** "flat" (bordered, crisp); "raised" (soft ambient shadow, subtle border); "glass" (frosted translucent); "tinted" (subtle slate fill). */
  variant?: 'flat' | 'raised' | 'glass' | 'tinted';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export function Card({ children, style, variant = 'raised', padding = 'md' }: PropsWithChildren<CardProps>) {
  const { colors, radii, spacing, shadows } = useTheme();
  const paddingValue = {
    none: 0,
    sm: spacing.md,
    md: spacing.lg,
    lg: spacing.xl,
  }[padding];

  const variantStyle: ViewStyle = {
    flat: {
      backgroundColor: colors.white,
      borderWidth: 1,
      borderColor: colors.border,
    },
    raised: {
      backgroundColor: colors.white,
      borderWidth: 1,
      borderColor: colors.borderSubtle,
      ...shadows.md,
    },
    glass: {
      backgroundColor: colors.surfaceGlass,
      borderWidth: 1.5,
      borderColor: colors.border,
      ...shadows.sm,
    },
    tinted: {
      backgroundColor: colors.surfaceSubtle,
      borderWidth: 1,
      borderColor: colors.borderSubtle,
    },
  }[variant];

  return (
    <View
      style={[
        styles.card,
        {
          borderRadius: radii.lg,
          padding: paddingValue,
        },
        variantStyle,
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 8,
  },
});
