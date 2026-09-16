import { Pressable, StyleSheet } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';

import { useTheme } from '../theme/ThemeProvider';

interface IconButtonProps {
  icon: LucideIcon;
  onPress: () => void;
  color?: string;
  /** Optional tinted circular background (e.g. the SOS button, chat header call icon). */
  variant?: 'plain' | 'filled' | 'outline';
  accessibilityLabel: string;
}

/**
 * Square touch target sized to the shared `minTouchTarget` token (>=48pt)
 * with tactile press state and clean circular layout.
 */
export function IconButton({ icon: Icon, onPress, color, variant = 'plain', accessibilityLabel }: IconButtonProps) {
  const { colors, radii, minTouchTarget } = useTheme();
  const iconColor = color ?? colors.textPrimary;

  const bgStyle = {
    plain: 'transparent',
    filled: colors.surfaceSubtle,
    outline: colors.white,
  }[variant];

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      hitSlop={8}
      style={({ pressed }) => [
        styles.button,
        {
          width: minTouchTarget,
          height: minTouchTarget,
          backgroundColor: bgStyle,
          borderColor: variant === 'outline' ? colors.border : 'transparent',
          borderWidth: variant === 'outline' ? 1 : 0,
          borderRadius: radii.full,
          opacity: pressed ? 0.75 : 1,
          transform: [{ scale: pressed ? 0.95 : 1 }],
        },
      ]}
    >
      <Icon size={21} color={iconColor} strokeWidth={2} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
