import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Lock } from 'lucide-react-native';

import { setPassword as setPasswordApi } from '../../../api/auth';
import { ApiError } from '../../../api/client';
import { Button } from '../../../components/Button';
import { Logo } from '../../../components/Logo';
import { TextField } from '../../../components/TextField';
import type { AuthStackParamList } from '../../../navigation/types';
import { useAuthStore } from '../../../store/auth';
import { useTheme } from '../../../theme/ThemeProvider';

type Props = NativeStackScreenProps<AuthStackParamList, 'SetPassword'>;

/**
 * Shown once, right after a fresh OTP verify (or a password login for an
 * account that never set one) — lets a returning user skip the OTP round
 * trip next time via `POST /auth/login`. Skippable; nothing downstream
 * depends on this actually happening.
 */
export function SetPasswordScreen({ route, navigation }: Props) {
  const { colors, spacing, typography } = useTheme();
  const completeAuth = useAuthStore((state) => state.completeAuth);
  const [password, setPasswordInput] = useState('');
  const [confirm, setConfirm] = useState('');
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

  return (
    <View style={[styles.container, { backgroundColor: colors.white, padding: spacing.xl }]}>
      <Logo size={48} />
      <View style={{ height: spacing.lg }} />
      <Text style={[styles.heading, { color: colors.textPrimary, fontFamily: typography.headingWeights.bold, fontSize: 24 }]}>
        Set up a password
      </Text>
      <Text style={[styles.subheading, { color: colors.textSecondary, marginTop: spacing.xs, marginBottom: spacing.lg }]}>
        Skip the SMS code next time — log in with your phone number and this password instead.
      </Text>

      <TextField
        placeholder="New password"
        secureTextEntry
        value={password}
        onChangeText={setPasswordInput}
        icon={Lock}
      />
      <View style={{ height: spacing.md }} />
      <TextField
        placeholder="Confirm password"
        secureTextEntry
        value={confirm}
        onChangeText={setConfirm}
        icon={Lock}
      />

      {error && <Text style={[styles.error, { color: colors.danger, marginTop: spacing.sm }]}>{error}</Text>}

      <View style={{ marginTop: spacing.lg }}>
        <Button label="Set Password" loading={loading} disabled={!password || !confirm} onPress={handleSet} />
      </View>
      <Pressable onPress={proceed} style={{ marginTop: spacing.md, padding: spacing.sm, alignSelf: 'center' }}>
        <Text style={{ color: colors.textMuted, fontSize: typography.size.sm }}>Skip for now</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  heading: {},
  subheading: { fontSize: 14 },
  error: { fontSize: 13 },
});
