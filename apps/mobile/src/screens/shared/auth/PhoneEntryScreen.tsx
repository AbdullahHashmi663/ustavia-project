import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Phone } from 'lucide-react-native';

import { normalizePakistaniPhone, requestOtp } from '../../../api/auth';
import { ApiError } from '../../../api/client';
import { Button } from '../../../components/Button';
import { Logo } from '../../../components/Logo';
import { TextField } from '../../../components/TextField';
import { useTheme } from '../../../theme/ThemeProvider';
import type { AuthStackParamList } from '../../../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'PhoneEntry'>;

export function PhoneEntryScreen({ navigation }: Props) {
  const { colors, spacing, typography } = useTheme();
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
    <View style={[styles.container, { backgroundColor: colors.white, padding: spacing.xl }]}>
      <Logo size={56} />
      <View style={{ height: spacing.xl }} />
      <Text style={[styles.heading, { color: colors.textPrimary, fontFamily: typography.headingWeights.bold, fontSize: 24 }]}>
        Enter your phone number
      </Text>
      <Text style={[styles.subheading, { color: colors.textSecondary, marginTop: spacing.xs, marginBottom: spacing.lg }]}>
        We'll text you a one-time code to verify it's you.
      </Text>
      <TextField
        placeholder="+92 3XX XXXXXXX"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
        icon={Phone}
      />
      {error && (
        <Text style={[styles.error, { color: colors.danger, marginTop: spacing.sm }]}>{error}</Text>
      )}
      <View style={{ marginTop: spacing.lg }}>
        <Button label="Send OTP" loading={loading} disabled={phone.trim().length < 10} onPress={handleSend} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  heading: {},
  subheading: { fontSize: 14 },
  error: { fontSize: 13 },
});
