import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Lock, Phone } from 'lucide-react-native';

import { loginWithPassword, normalizePakistaniPhone } from '../../../api/auth';
import { ApiError } from '../../../api/client';
import { Button } from '../../../components/Button';
import { Logo } from '../../../components/Logo';
import { TextField } from '../../../components/TextField';
import type { AuthStackParamList } from '../../../navigation/types';
import { useAuthStore } from '../../../store/auth';
import { useSessionStore } from '../../../store/session';
import { useTheme } from '../../../theme/ThemeProvider';
import { afterAuthSession } from './afterAuthSession';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

/** The returning-user fast path — phone + the password set via SetPasswordScreen, no OTP round trip. */
export function LoginScreen({ navigation }: Props) {
  const { colors, spacing, typography } = useTheme();
  const setAccessToken = useSessionStore((state) => state.setAccessToken);
  const setUser = useAuthStore((state) => state.setUser);
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      const session = await loginWithPassword(normalizePakistaniPhone(phone), password);
      afterAuthSession(navigation, setAccessToken, setUser, session);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not reach Ustavia. Check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.white, padding: spacing.xl }]}>
      <Logo size={56} />
      <View style={{ height: spacing.xl }} />
      <Text style={[styles.heading, { color: colors.textPrimary, fontFamily: typography.headingWeights.bold, fontSize: 24 }]}>
        Log in
      </Text>
      <Text style={[styles.subheading, { color: colors.textSecondary, marginTop: spacing.xs, marginBottom: spacing.lg }]}>
        Enter your phone number and password.
      </Text>

      <TextField
        placeholder="+92 3XX XXXXXXX"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
        icon={Phone}
      />
      <View style={{ height: spacing.md }} />
      <TextField
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        icon={Lock}
      />

      {error && <Text style={[styles.error, { color: colors.danger, marginTop: spacing.sm }]}>{error}</Text>}

      <View style={{ marginTop: spacing.lg }}>
        <Button
          label="Log In"
          loading={loading}
          disabled={phone.trim().length < 10 || !password}
          onPress={handleLogin}
        />
      </View>

      <Pressable onPress={() => navigation.navigate('PhoneEntry')} style={{ marginTop: spacing.lg, alignSelf: 'center' }}>
        <Text style={{ color: colors.brandBlue, fontSize: typography.size.sm }}>New here? Sign up with your phone number</Text>
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
