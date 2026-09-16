import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Eye, EyeOff, Lock, Phone } from 'lucide-react-native';

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

export function LoginScreen({ navigation }: Props) {
  const { colors, radii, spacing, typography } = useTheme();
  const setAccessToken = useSessionStore((state) => state.setAccessToken);
  const setUser = useAuthStore((state) => state.setUser);
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      const session = await loginWithPassword(normalizePakistaniPhone(phone), password);
      afterAuthSession(navigation, setAccessToken, setUser, session);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not reach Ustavia. Check your credentials and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.canvas ?? colors.white }}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={[styles.innerContainer, { padding: spacing.xl }]}>
        <View style={styles.logoContainer}>
          <Logo size={52} />
        </View>

        <Text
          style={[
            styles.heading,
            {
              color: colors.textPrimary,
              fontFamily: typography.headingWeights.bold,
              fontSize: 26,
              marginTop: spacing.lg,
            },
          ]}
        >
          Welcome Back
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
          Log in with your registered phone number and password.
        </Text>

        <View style={{ gap: spacing.md }}>
          <TextField
            label="Mobile Phone Number"
            placeholder="03XX XXXXXXX"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
            icon={Phone}
          />

          <TextField
            label="Password"
            placeholder="Enter your password"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
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
        </View>

        {error && (
          <View style={[styles.errorBox, { backgroundColor: colors.dangerLight, borderRadius: radii.md, marginTop: spacing.md }]}>
            <Text style={[styles.error, { color: colors.danger }]}>{error}</Text>
          </View>
        )}

        <View style={{ marginTop: spacing.xl }}>
          <Button
            label="Log In"
            variant="primary"
            loading={loading}
            disabled={phone.trim().length < 10 || !password}
            onPress={handleLogin}
          />
        </View>

        <Pressable
          onPress={() => navigation.navigate('PhoneEntry')}
          style={styles.signupLink}
        >
          <Text style={{ color: colors.brandBlue, fontSize: typography.size.sm, fontFamily: typography.headingWeights.semibold }}>
            New to Ustavia? Sign up with OTP
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
  errorBox: {
    padding: 12,
  },
  error: {
    fontSize: 13,
    textAlign: 'center',
  },
  signupLink: {
    marginTop: 24,
    alignSelf: 'center',
    padding: 8,
  },
});
