import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Lock, Phone, ShieldCheck } from 'lucide-react-native';

import { normalizePakistaniPhone, requestOtp } from '../../../api/auth';
import { ApiError } from '../../../api/client';
import { Button } from '../../../components/Button';
import { Logo } from '../../../components/Logo';
import { TextField } from '../../../components/TextField';
import { useTheme } from '../../../theme/ThemeProvider';
import type { AuthStackParamList } from '../../../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'PhoneEntry'>;

export function PhoneEntryScreen({ navigation }: Props) {
  const { colors, radii, spacing, typography } = useTheme();
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSend = async () => {
    const normalized = normalizePakistaniPhone(phone);
    setError(null);
    setLoading(true);
    try {
      const { devCode } = await requestOtp(normalized);
      navigation.navigate('Otp', { phone: normalized, devCode });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not reach Ustavia. Check your connection and try again.');
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
          Welcome to Ustavia
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
          Enter your mobile number to get started with instant local hiring and jobs.
        </Text>

        <View style={styles.inputStack}>
          <TextField
            label="Mobile Phone Number"
            placeholder="03XX XXXXXXX"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
            icon={Phone}
            helperText="Enter 11-digit Pakistani mobile number"
          />
        </View>

        {error && (
          <View style={[styles.errorBox, { backgroundColor: colors.dangerLight, borderRadius: radii.md }]}>
            <Text style={[styles.error, { color: colors.danger }]}>{error}</Text>
          </View>
        )}

        <View style={{ marginTop: spacing.md }}>
          <Button
            label="Send Verification Code"
            variant="primary"
            loading={loading}
            disabled={phone.trim().length < 10}
            onPress={handleSend}
          />
        </View>

        {/* Privacy Note */}
        <View
          style={[
            styles.privacyBadge,
            {
              backgroundColor: colors.surfaceSubtle,
              borderRadius: radii.md,
              padding: spacing.md,
              marginTop: spacing.xl,
            },
          ]}
        >
          <ShieldCheck size={16} color={colors.brandBlue} strokeWidth={2} />
          <Text style={[styles.privacyText, { color: colors.textSecondary, fontSize: typography.size.xs }]}>
            Your number is securely verified and will never be shared without consent.
          </Text>
        </View>

        <Pressable
          onPress={() => navigation.navigate('Login')}
          style={styles.loginLink}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Lock size={14} color={colors.brandBlue} />
            <Text
              style={{
                color: colors.brandBlue,
                fontSize: typography.size.sm,
                fontFamily: typography.headingWeights.semibold,
              }}
            >
              Have a password? Log in directly
            </Text>
          </View>
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
  inputStack: {
    marginBottom: 8,
  },
  errorBox: {
    padding: 12,
    marginTop: 12,
    marginBottom: 4,
  },
  error: {
    fontSize: 13,
    textAlign: 'center',
  },
  privacyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  privacyText: {
    flex: 1,
    lineHeight: 16,
  },
  loginLink: {
    marginTop: 20,
    alignSelf: 'center',
    padding: 8,
  },
});
