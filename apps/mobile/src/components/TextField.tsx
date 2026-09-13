import { useState } from 'react';
import { StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';

import { useTheme } from '../theme/ThemeProvider';

interface TextFieldProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: LucideIcon;
  /** Rendered inline-right inside the field — e.g. an eye-toggle or a unit suffix. Both UX specs use this pattern constantly (password visibility, currency prefix, card-brand icon). */
  rightAccessory?: React.ReactNode;
}

/** Label-above-input pattern used throughout both UX specs (2.3 Set Password, 2.4 Basic Profile, 8.4 Add Bank Account, ...). */
export function TextField({ label, error, helperText, icon: Icon, rightAccessory, ...inputProps }: TextFieldProps) {
  const { colors, radii, spacing, typography } = useTheme();
  const [focused, setFocused] = useState(false);

  const borderColor = error ? colors.danger : focused ? colors.brandBlue : colors.border;

  return (
    <View style={styles.container}>
      {label && (
        <Text style={[styles.label, { color: colors.textSecondary, fontSize: typography.size.sm }]}>{label}</Text>
      )}
      <View
        style={[
          styles.field,
          {
            borderColor,
            borderRadius: radii.sm,
            paddingHorizontal: spacing.md,
            backgroundColor: colors.white,
          },
        ]}
      >
        {Icon && <Icon size={18} color={colors.textMuted} />}
        <TextInput
          {...inputProps}
          onFocus={(e) => {
            setFocused(true);
            inputProps.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            inputProps.onBlur?.(e);
          }}
          placeholderTextColor={colors.textMuted}
          style={[styles.input, { color: colors.textPrimary, fontSize: typography.size.base }]}
        />
        {rightAccessory}
      </View>
      {(error || helperText) && (
        <Text style={[styles.helper, { color: error ? colors.danger : colors.textMuted, fontSize: typography.size.xs }]}>
          {error ?? helperText}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 6 },
  label: { fontWeight: '500' },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    minHeight: 48,
  },
  input: { flex: 1, minWidth: 0, paddingVertical: 12 }, // minWidth:0 — see OtpScreen.tsx's cell style comment
  helper: {},
});
