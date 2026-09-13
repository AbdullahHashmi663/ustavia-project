import type { PropsWithChildren } from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';

import { useTheme } from '../theme/ThemeProvider';

interface CardProps {
  style?: ViewStyle;
  /** "flat" (bordered, no shadow) for dense lists; "raised" (shadow, no border) for standalone summary cards. */
  variant?: 'flat' | 'raised';
  padding?: 'sm' | 'md' | 'lg';
}

export function Card({ children, style, variant = 'flat', padding = 'md' }: PropsWithChildren<CardProps>) {
  const { colors, radii, spacing, shadows } = useTheme();
  const paddingValue = { sm: spacing.md, md: spacing.lg, lg: spacing.xl }[padding];

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.white,
          borderRadius: radii.md,
          padding: paddingValue,
          borderWidth: variant === 'flat' ? 1 : 0,
          borderColor: colors.border,
        },
        variant === 'raised' && shadows.md,
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
