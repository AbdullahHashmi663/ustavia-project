import { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { requestOtp } from '../../../api/auth';
import { ApiError } from '../../../api/client';
import { Logo } from '../../../components/Logo';
import { useTheme } from '../../../theme/ThemeProvider';
import type { AuthStackParamList } from '../../../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'Otp'>;

const CELL_COUNT = 6;
const RESEND_SECONDS = 30;

/**
 * 6 boxed cells, auto-advance/auto-submit on the last digit, resend
 * countdown — customer.pdf §2.2 / Workers.pdf §1.2.2. The code itself isn't
 * verified here: the real `role` it needs to send alongside the code to
 * `POST /auth/otp/verify` isn't known yet at this point in the flow (that's
 * the next screen), so this just collects 6 digits and hands {phone, code}
 * forward — RolePickerScreen makes the actual verify call.
 */
export function OtpScreen({ route, navigation }: Props) {
  const { colors, radii, spacing, typography } = useTheme();
  const [digits, setDigits] = useState<string[]>(Array(CELL_COUNT).fill(''));
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);
  const [resending, setResending] = useState(false);
  const [devCode, setDevCode] = useState(route.params.devCode);
  const [resendError, setResendError] = useState<string | null>(null);
  const inputs = useRef<Array<TextInput | null>>([]);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft]);

  const handleChange = (index: number, value: string) => {
    const char = value.replace(/[^0-9]/g, '').slice(-1);
    const next = [...digits];
    next[index] = char;
    setDigits(next);

    if (char && index < CELL_COUNT - 1) {
      inputs.current[index + 1]?.focus();
    }
    if (char && index === CELL_COUNT - 1 && next.every(Boolean)) {
      navigation.navigate('RolePicker', { phone: route.params.phone, code: next.join('') });
    }
  };

  const handleKeyPress = (index: number, key: string) => {
    if (key === 'Backspace' && !digits[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleResend = async () => {
    setResendError(null);
    setResending(true);
    try {
      const { devCode: nextDevCode } = await requestOtp(route.params.phone);
      setDevCode(nextDevCode);
      setSecondsLeft(RESEND_SECONDS);
      setDigits(Array(CELL_COUNT).fill(''));
      inputs.current[0]?.focus();
    } catch (err) {
      setResendError(err instanceof ApiError ? err.message : 'Could not resend the code. Try again.');
    } finally {
      setResending(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.white, padding: spacing.xl }]}>
      <Logo size={56} />
      <View style={{ height: spacing.xl }} />
      <Text style={[styles.heading, { color: colors.textPrimary, fontFamily: typography.headingWeights.bold, fontSize: 24 }]}>
        Verify your number
      </Text>
      <Text style={[styles.subheading, { color: colors.textSecondary, marginTop: spacing.xs, marginBottom: spacing.xl }]}>
        Enter the 6-digit code sent to {route.params.phone}
      </Text>
      {devCode && (
        <Text style={[styles.devHint, { color: colors.textMuted, marginBottom: spacing.md }]}>
          Dev preview — no SMS provider connected yet, your code is {devCode}
        </Text>
      )}

      <View style={styles.cellRow}>
        {digits.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => {
              inputs.current[index] = ref;
            }}
            style={[
              styles.cell,
              {
                borderColor: digit ? colors.brandBlue : colors.border,
                borderRadius: radii.sm,
                color: colors.textPrimary,
              },
            ]}
            keyboardType="number-pad"
            maxLength={1}
            value={digit}
            onChangeText={(value) => handleChange(index, value)}
            onKeyPress={({ nativeEvent }) => handleKeyPress(index, nativeEvent.key)}
            autoFocus={index === 0}
          />
        ))}
      </View>

      {resendError && (
        <Text style={[styles.error, { color: colors.danger, marginTop: spacing.sm }]}>{resendError}</Text>
      )}

      <View style={styles.resendRow}>
        {secondsLeft > 0 ? (
          <Text style={{ color: colors.textMuted }}>Resend code in 0:{secondsLeft.toString().padStart(2, '0')}</Text>
        ) : (
          <Pressable onPress={handleResend} disabled={resending}>
            <Text style={{ color: colors.brandBlue, fontFamily: typography.headingWeights.semibold, opacity: resending ? 0.6 : 1 }}>
              {resending ? 'Sending…' : 'Resend code'}
            </Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  heading: {},
  subheading: { fontSize: 14 },
  devHint: { fontSize: 12, fontStyle: 'italic' },
  error: { fontSize: 13 },
  cellRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
  cell: {
    flex: 1,
    minWidth: 0, // flex children default to min-width:auto on web; without this an <input>'s intrinsic width stops it shrinking to fit 6-in-a-row
    height: 52,
    borderWidth: 1.5,
    textAlign: 'center',
    fontSize: 20,
  },
  resendRow: { marginTop: 20, alignItems: 'center' },
});
