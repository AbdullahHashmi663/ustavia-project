import { useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ArrowLeft, Clock, Info } from 'lucide-react-native';

import { requestOtp } from '../../../api/auth';
import { ApiError } from '../../../api/client';
import { Button } from '../../../components/Button';
import { Logo } from '../../../components/Logo';
import { useTheme } from '../../../theme/ThemeProvider';
import type { AuthStackParamList } from '../../../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'Otp'>;

const CELL_COUNT = 6;
const RESEND_SECONDS = 30;

export function OtpScreen({ route, navigation }: Props) {
  const { colors, radii, spacing, typography, shadows } = useTheme();
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

  const isComplete = digits.every(Boolean);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.canvas ?? colors.white }}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={[styles.innerContainer, { padding: spacing.xl }]}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={[styles.backButton, { backgroundColor: colors.surfaceSubtle, borderRadius: radii.full }]}
          accessibilityLabel="Go back"
        >
          <ArrowLeft size={18} color={colors.textPrimary} />
        </Pressable>

        <View style={styles.logoContainer}>
          <Logo size={48} />
        </View>

        <Text
          style={[
            styles.heading,
            {
              color: colors.textPrimary,
              fontFamily: typography.headingWeights.bold,
              fontSize: 24,
              marginTop: spacing.lg,
            },
          ]}
        >
          Verify your number
        </Text>

        <Text
          style={[
            styles.subheading,
            {
              color: colors.textSecondary,
              marginTop: spacing.xs,
              marginBottom: spacing.lg,
            },
          ]}
        >
          Enter the 6-digit code sent to <Text style={{ color: colors.textPrimary, fontWeight: '600' }}>{route.params.phone}</Text>
        </Text>

        {devCode && (
          <View
            style={[
              styles.devBadge,
              {
                backgroundColor: colors.warningLight,
                borderColor: colors.warning,
                borderRadius: radii.md,
                padding: spacing.md,
                marginBottom: spacing.lg,
              },
            ]}
          >
            <Info size={16} color={colors.warning} />
            <Text style={[styles.devHint, { color: '#92400E', fontSize: typography.size.xs }]}>
              Dev Preview: Your test code is <Text style={{ fontWeight: '700' }}>{devCode}</Text>
            </Text>
          </View>
        )}

        <View style={styles.cellRow}>
          {digits.map((digit, index) => {
            const isFilled = Boolean(digit);
            return (
              <TextInput
                key={index}
                ref={(ref) => {
                  inputs.current[index] = ref;
                }}
                style={[
                  styles.cell,
                  isFilled && shadows.sm,
                  {
                    borderColor: isFilled ? colors.brandOrange : colors.border,
                    borderRadius: radii.md,
                    backgroundColor: colors.white,
                    color: colors.textPrimary,
                    fontFamily: typography.headingWeights.bold,
                  },
                ]}
                keyboardType="number-pad"
                maxLength={1}
                value={digit}
                onChangeText={(value) => handleChange(index, value)}
                onKeyPress={({ nativeEvent }) => handleKeyPress(index, nativeEvent.key)}
                autoFocus={index === 0}
              />
            );
          })}
        </View>

        {resendError && (
          <Text style={[styles.error, { color: colors.danger, marginTop: spacing.md }]}>{resendError}</Text>
        )}

        <View style={styles.resendRow}>
          {secondsLeft > 0 ? (
            <View style={[styles.timerPill, { backgroundColor: colors.surfaceSubtle, borderRadius: radii.full }]}>
              <Clock size={13} color={colors.textMuted} />
              <Text style={{ color: colors.textSecondary, fontSize: 13 }}>
                Resend code in <Text style={{ fontWeight: '600' }}>0:{secondsLeft.toString().padStart(2, '0')}</Text>
              </Text>
            </View>
          ) : (
            <Pressable onPress={handleResend} disabled={resending} style={{ padding: 4 }}>
              <Text
                style={{
                  color: colors.brandBlue,
                  fontFamily: typography.headingWeights.semibold,
                  fontSize: 14,
                  opacity: resending ? 0.6 : 1,
                }}
              >
                {resending ? 'Sending new code…' : "Didn't get the code? Resend"}
              </Text>
            </Pressable>
          )}
        </View>

        <View style={{ marginTop: spacing.xl }}>
          <Button
            label="Verify & Continue"
            variant="primary"
            disabled={!isComplete}
            onPress={() => navigation.navigate('RolePicker', { phone: route.params.phone, code: digits.join('') })}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
  },
  innerContainer: {
    width: '100%',
    maxWidth: 480,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    top: 24,
    left: 20,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  logoContainer: {
    alignItems: 'center',
  },
  heading: {
    textAlign: 'center',
  },
  subheading: {
    fontSize: 14,
    textAlign: 'center',
  },
  devBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
  },
  devHint: {
    flex: 1,
  },
  error: {
    fontSize: 13,
    textAlign: 'center',
  },
  cellRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginVertical: 12,
  },
  cell: {
    flex: 1,
    minWidth: 0,
    height: 56,
    borderWidth: 1.5,
    textAlign: 'center',
    fontSize: 22,
  },
  resendRow: {
    marginTop: 16,
    alignItems: 'center',
  },
  timerPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
});
