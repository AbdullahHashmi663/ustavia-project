import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';

import { useTheme } from '../theme/ThemeProvider';

export type ButtonVariant = 'primary' | 'trust' | 'outline' | 'danger' | 'ghost';
export type ButtonSize = 'md' | 'lg';

interface ButtonProps {
  label: string;
  onPress: () => void;
  /** "primary" (orange) is the default Mazdoor CTA; "trust" (blue) the Customer one; "outline"/"ghost"/"danger" for secondary and destructive actions — see both UX specs' recurring outlined-vs-filled button pairs. */
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'lg',
  disabled,
  loading,
  icon: Icon,
  iconPosition = 'left',
  fullWidth = true,
}: ButtonProps) {
  const { colors, radii, spacing, typography, minTouchTarget } = useTheme();
  const isDisabled = disabled || loading;

  const palette: Record<ButtonVariant, { bg: string; fg: string; border?: string }> = {
    primary: { bg: colors.brandOrange, fg: colors.white },
    trust: { bg: colors.brandBlue, fg: colors.white },
    outline: { bg: 'transparent', fg: colors.textPrimary, border: colors.border },
    danger: { bg: 'transparent', fg: colors.danger, border: colors.danger },
    ghost: { bg: 'transparent', fg: colors.textSecondary },
  };
  const { bg, fg, border } = palette[variant];

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled }}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: bg,
          borderColor: border,
          borderWidth: border ? 1 : 0,
          borderRadius: radii.md,
          paddingVertical: size === 'lg' ? spacing.md + 2 : spacing.sm + 2,
          minHeight: minTouchTarget,
          opacity: isDisabled ? 0.5 : pressed ? 0.85 : 1,
          alignSelf: fullWidth ? 'stretch' : 'flex-start',
        },
      ]}
    >
      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator color={fg} />
        ) : (
          <>
            {Icon && iconPosition === 'left' && <Icon size={18} color={fg} />}
            <Text style={[styles.label, { color: fg, fontFamily: typography.headingWeights.semibold, fontSize: typography.size.md }]}>
              {label}
            </Text>
            {Icon && iconPosition === 'right' && <Icon size={18} color={fg} />}
          </>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  label: {
    textAlign: 'center',
  },
});
