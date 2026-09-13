import { Pressable, StyleSheet } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';

import { useTheme } from '../theme/ThemeProvider';

interface IconButtonProps {
  icon: LucideIcon;
  onPress: () => void;
  color?: string;
  /** Optional tinted circular background (e.g. the SOS button, chat header call icon). */
  variant?: 'plain' | 'filled';
  accessibilityLabel: string;
}

/** Square touch target sized to the shared `minTouchTarget` token — every icon-only control (back arrow, share, call, filter) should use this instead of a bare `<Pressable>` so tap targets stay accessible. */
export function IconButton({ icon: Icon, onPress, color, variant = 'plain', accessibilityLabel }: IconButtonProps) {
  const { colors, minTouchTarget } = useTheme();
  const iconColor = color ?? colors.textPrimary;

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
          backgroundColor: variant === 'filled' ? colors.surface : 'transparent',
          borderRadius: minTouchTarget / 2,
          opacity: pressed ? 0.6 : 1,
        },
      ]}
    >
      <Icon size={22} color={iconColor} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: { alignItems: 'center', justifyContent: 'center' },
});
