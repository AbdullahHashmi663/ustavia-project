import { Pressable, StyleSheet, Text } from 'react-native';

import { useTheme } from '../theme/ThemeProvider';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'trust';
  disabled?: boolean;
}

/** Orange ("primary") is the default CTA color; "trust" (blue) is reserved for Customer/info actions. */
export function Button({ label, onPress, variant = 'primary', disabled }: ButtonProps) {
  const { colors } = useTheme();
  const backgroundColor = variant === 'primary' ? colors.brandOrange : colors.brandBlue;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor, opacity: disabled ? 0.5 : pressed ? 0.85 : 1 },
      ]}
    >
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  label: {
    color: '#FFFFFF',
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 16,
  },
});
