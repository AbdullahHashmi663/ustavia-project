import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Check, Eye, EyeOff, Lock, Shield } from 'lucide-react-native';

import { setPassword as setPasswordApi } from '../../../api/auth';
import { ApiError } from '../../../api/client';
import { Button } from '../../../components/Button';
import { Logo } from '../../../components/Logo';
import { TextField } from '../../../components/TextField';
import type { AuthStackParamList } from '../../../navigation/types';
import { useAuthStore } from '../../../store/auth';
import { useTheme } from '../../../theme/ThemeProvider';

type Props = NativeStackScreenProps<AuthStackParamList, 'SetPassword'>;

export function SetPasswordScreen({ route, navigation }: Props) {
  const { colors, radii, spacing, typography } = useTheme();
  const completeAuth = useAuthStore((state) => state.completeAuth);
  const [password, setPasswordInput] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const proceed = () => {
    if (route.params.afterVerified) completeAuth();
    else navigation.navigate('KycUpload');
  };

  const handleSet = async () => {
    setError(null);
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirm) {
      setError("Passwords don't match.");
      return;
    }
    setLoading(true);
    try {
      await setPasswordApi(password);
      proceed();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not set your password. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const isLongEnough = password.length >= 6;
  const isMatching = Boolean(password && password === confirm);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.canvas ?? colors.white }}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={[styles.innerContainer, { padding: spacing.xl }]}>
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
          Set up a password
        </Text>

        <Text
          style={[
            styles.subheading,
            {
              color: colors.textSecondary,
              marginTop: spacing.xs,
              marginBottom: spacing.xl,
            },
          ]}
        >
          Skip SMS verification next time. Log in instantly using your phone number and password.
        </Text>

        <View style={{ gap: spacing.md }}>
          <TextField
            label="New Password"
            placeholder="Minimum 6 characters"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPasswordInput}
            icon={Lock}
            rightAccessory={
              <Pressable
                onPress={() => setShowPassword((prev) => !prev)}
                hitSlop={8}
                style={{ paddingHorizontal: 4 }}
                accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <EyeOff size={18} color={colors.textMuted} />
                ) : (
                  <Eye size={18} color={colors.textMuted} />
                )}
              </Pressable>
            }
          />

          <TextField
            label="Confirm Password"
            placeholder="Re-enter your password"
            secureTextEntry={!showPassword}
            value={confirm}
            onChangeText={setConfirm}
            icon={Lock}
          />
        </View>

        {/* Requirements check */}
        <View style={[styles.checklist, { backgroundColor: colors.surfaceSubtle, borderRadius: radii.md, padding: spacing.md, marginTop: spacing.md }]}>
          <View style={styles.checkItem}>
            <Check size={14} color={isLongEnough ? colors.success : colors.textMuted} strokeWidth={2.5} />
            <Text style={{ fontSize: 12, color: isLongEnough ? colors.textPrimary : colors.textMuted }}>
              At least 6 characters
            </Text>
          </View>
          <View style={styles.checkItem}>
            <Check size={14} color={isMatching ? colors.success : colors.textMuted} strokeWidth={2.5} />
            <Text style={{ fontSize: 12, color: isMatching ? colors.textPrimary : colors.textMuted }}>
              Passwords match
            </Text>
          </View>
        </View>

        {error && (
          <View style={[styles.errorBox, { backgroundColor: colors.dangerLight, borderRadius: radii.md, marginTop: spacing.md }]}>
            <Text style={[styles.error, { color: colors.danger }]}>{error}</Text>
          </View>
        )}

        <View style={{ marginTop: spacing.xl }}>
          <Button
            label="Save Password"
            variant="primary"
            loading={loading}
            disabled={!isLongEnough || !isMatching}
            onPress={handleSet}
          />
        </View>

        <Pressable onPress={proceed} style={styles.skipButton}>
          <Text style={{ color: colors.textMuted, fontSize: typography.size.sm, fontFamily: typography.headingWeights.semibold }}>
            Skip for now
          </Text>
        </Pressable>
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
  checklist: {
    gap: 6,
  },
  checkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  errorBox: {
    padding: 12,
  },
  error: {
    fontSize: 13,
    textAlign: 'center',
  },
  skipButton: {
    marginTop: 16,
    alignSelf: 'center',
    padding: 8,
  },
});
