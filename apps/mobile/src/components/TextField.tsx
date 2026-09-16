import { useState } from 'react';
import { StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';

import { useTheme } from '../theme/ThemeProvider';

interface TextFieldProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: LucideIcon;
  /** Rendered inline-right inside the field — e.g. an eye-toggle or a unit suffix. */
  rightAccessory?: React.ReactNode;
}

export function TextField({ label, error, helperText, icon: Icon, rightAccessory, ...inputProps }: TextFieldProps) {
  const { colors, radii, spacing, typography, shadows } = useTheme();
  const [focused, setFocused] = useState(false);

  const borderColor = error ? colors.danger : focused ? colors.brandBlue : colors.border;

  return (
    <View style={styles.container}>
      {label && (
        <Text
          style={[
            styles.label,
            {
              color: colors.textPrimary,
              fontSize: typography.size.sm,
              fontFamily: typography.headingWeights.semibold,
            },
          ]}
        >
          {label}
        </Text>
      )}

      <View
        style={[
          styles.field,
          focused && shadows.sm,
          {
            borderColor,
            borderRadius: radii.md,
            paddingHorizontal: spacing.md + 2,
            backgroundColor: colors.white,
          },
        ]}
      >
        {Icon && (
          <View style={styles.iconContainer}>
            <Icon size={19} color={error ? colors.danger : focused ? colors.brandBlue : colors.textMuted} strokeWidth={2} />
          </View>
        )}

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
          style={[
            styles.input,
            {
              color: colors.textPrimary,
              fontSize: typography.size.base,
            },
          ]}
        />

        {rightAccessory}
      </View>

      {(error || helperText) && (
        <Text
          style={[
            styles.helper,
            {
              color: error ? colors.danger : colors.textMuted,
              fontSize: typography.size.xs,
              fontFamily: error ? typography.headingWeights.semibold : undefined,
            },
          ]}
        >
          {error ?? helperText}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 7,
  },
  label: {
    letterSpacing: 0.15,
  },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1.5,
    minHeight: 52,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    minWidth: 0,
    paddingVertical: 13,
  },
  helper: {
    marginLeft: 2,
  },
});
