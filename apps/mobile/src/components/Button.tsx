import { ActivityIndicator, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import type { LucideIcon } from 'lucide-react-native';

import { useTheme } from '../theme/ThemeProvider';

export type ButtonVariant = 'primary' | 'trust' | 'outline' | 'danger' | 'ghost';
export type ButtonSize = 'md' | 'lg';

interface ButtonProps {
  label: string;
  onPress: () => void;
  /** "primary" (orange gradient) is the default Mazdoor CTA; "trust" (blue gradient) the Customer one; "outline"/"ghost"/"danger" for secondary and destructive actions. */
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
  const { colors, radii, spacing, typography, shadows, gradients, minTouchTarget } = useTheme();
  const isDisabled = disabled || loading;

  const isGradient = variant === 'primary' || variant === 'trust';
  const gradientColors = variant === 'primary' ? gradients.mazdoor : gradients.customer;

  // Base colors
  let bg = isGradient
    ? gradientColors[0]
    : variant === 'outline'
    ? colors.white
    : variant === 'danger'
    ? colors.dangerLight
    : 'transparent';

  let fg = isGradient
    ? colors.white
    : variant === 'outline'
    ? colors.textPrimary
    : variant === 'danger'
    ? colors.danger
    : colors.textSecondary;

  let border = variant === 'outline' ? colors.border : variant === 'danger' ? colors.danger : undefined;

  // Disabled state override: clear, accessible, and visible
  if (isDisabled) {
    bg = colors.surfaceSubtle ?? '#F1F5F9';
    fg = colors.textMuted ?? '#94A3B8';
    border = undefined;
  }

  const shadowStyle =
    !isDisabled && variant === 'primary'
      ? shadows.glowOrange
      : !isDisabled && variant === 'trust'
      ? shadows.glowBlue
      : !isDisabled && variant === 'outline'
      ? shadows.sm
      : undefined;

  // Web native CSS gradient support
  const webGradientStyle =
    Platform.OS === 'web' && isGradient && !isDisabled
      ? ({
          backgroundImage: `linear-gradient(135deg, ${gradientColors[0]} 0%, ${gradientColors[1]} 100%)`,
        } as unknown as object)
      : {};

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled }}
      style={({ pressed }) => [
        styles.button,
        shadowStyle,
        {
          backgroundColor: bg,
          borderColor: border,
          borderWidth: border ? 1.5 : 0,
          borderRadius: radii.md,
          paddingVertical: size === 'lg' ? spacing.md + 2 : spacing.sm + 2,
          paddingHorizontal: spacing.xl,
          minHeight: minTouchTarget,
          opacity: pressed && !isDisabled ? 0.9 : 1,
          transform: [{ scale: pressed && !isDisabled ? 0.985 : 1 }],
          alignSelf: fullWidth ? 'stretch' : 'flex-start',
          overflow: 'hidden',
        },
        webGradientStyle,
      ]}
    >
      {/* Native SVG gradient for iOS & Android */}
      {Platform.OS !== 'web' && isGradient && !isDisabled && (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          <Svg width="100%" height="100%">
            <Defs>
              <LinearGradient id={`btn-grad-${variant}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor={gradientColors[0]} />
                <Stop offset="100%" stopColor={gradientColors[1]} />
              </LinearGradient>
            </Defs>
            <Rect width="100%" height="100%" rx={radii.md} fill={`url(#btn-grad-${variant})`} />
          </Svg>
        </View>
      )}

      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator color={fg} size="small" />
        ) : (
          <>
            {Icon && iconPosition === 'left' && <Icon size={18} color={fg} strokeWidth={2.2} />}
            <Text
              style={[
                styles.label,
                {
                  color: fg,
                  fontFamily: typography.headingWeights.semibold,
                  fontSize: size === 'lg' ? typography.size.md : typography.size.base,
                  letterSpacing: 0.3,
                },
              ]}
            >
              {label}
            </Text>
            {Icon && iconPosition === 'right' && <Icon size={18} color={fg} strokeWidth={2.2} />}
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
    position: 'relative',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    zIndex: 2,
  },
  label: {
    textAlign: 'center',
  },
});
