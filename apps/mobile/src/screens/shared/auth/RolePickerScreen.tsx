import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CheckCircle2, HardHat, UserSearch } from 'lucide-react-native';
import type { UserRole } from '@ustavia/shared';

import { verifyOtp } from '../../../api/auth';
import { ApiError } from '../../../api/client';
import { Button } from '../../../components/Button';
import { Logo } from '../../../components/Logo';
import { useAuthStore } from '../../../store/auth';
import { useSessionStore } from '../../../store/session';
import { useTheme } from '../../../theme/ThemeProvider';
import type { AuthStackParamList } from '../../../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'RolePicker'>;

const ROLE_OPTIONS: Array<{ role: UserRole; title: string; description: string; icon: typeof HardHat }> = [
  { role: 'mazdoor', title: "I'm a Mazdoor", description: 'I do jobs and get paid for my work.', icon: HardHat },
  { role: 'customer', title: "I'm a Customer", description: 'I need to hire help for a job.', icon: UserSearch },
];

/**
 * The real `POST /auth/otp/verify` call happens here, not on OtpScreen —
 * the API only pins a role the *first* time a phone is seen, so the role
 * has to already be chosen before the call is made.
 */
export function RolePickerScreen({ route, navigation }: Props) {
  const { colors, radii, spacing, typography } = useTheme();
  const setAccessToken = useSessionStore((state) => state.setAccessToken);
  const setUser = useAuthStore((state) => state.setUser);
  const completeAuth = useAuthStore((state) => state.completeAuth);
  const [selected, setSelected] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const accentFor = (role: UserRole) => (role === 'mazdoor' ? colors.brandOrange : colors.brandBlue);
  const tintFor = (role: UserRole) => (role === 'mazdoor' ? colors.brandOrangeLight : colors.brandBlueLight);

  const handleContinue = async () => {
    if (!selected) return;
    setError(null);
    setLoading(true);
    try {
      const { accessToken, user } = await verifyOtp(route.params.phone, route.params.code, selected);
      setAccessToken(accessToken);
      setUser(user);
      if (user.verificationStatus === 'verified') {
        // setUser already flips isAuthenticated for this case, but call it
        // explicitly too so the intent reads clearly at the call site.
        completeAuth();
      } else {
        navigation.navigate('KycUpload');
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not verify that code. Check it and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.white, padding: spacing.xl }]}>
      <Logo size={48} />
      <View style={{ height: spacing.lg }} />
      <Text style={[styles.heading, { color: colors.textPrimary, fontFamily: typography.headingWeights.bold, fontSize: 24 }]}>
        How will you use Ustavia?
      </Text>
      <Text style={[styles.subheading, { color: colors.textSecondary, marginTop: spacing.xs, marginBottom: spacing.lg }]}>
        This choice is permanent for this account.
      </Text>

      <View style={{ gap: spacing.md, marginBottom: spacing.lg }}>
        {ROLE_OPTIONS.map((option) => {
          const isSelected = selected === option.role;
          const Icon = option.icon;
          return (
            <Pressable
              key={option.role}
              onPress={() => setSelected(option.role)}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
              style={[
                styles.card,
                {
                  borderColor: isSelected ? accentFor(option.role) : colors.border,
                  backgroundColor: isSelected ? tintFor(option.role) : colors.white,
                  borderRadius: radii.lg,
                  padding: spacing.lg,
                },
              ]}
            >
              <View style={styles.cardTopRow}>
                <View style={[styles.iconCircle, { backgroundColor: colors.white, borderRadius: radii.full }]}>
                  <Icon size={22} color={accentFor(option.role)} />
                </View>
                {isSelected && <CheckCircle2 size={20} color={accentFor(option.role)} />}
              </View>
              <Text style={[styles.cardTitle, { color: colors.textPrimary, fontFamily: typography.headingWeights.semibold, marginTop: spacing.sm }]}>
                {option.title}
              </Text>
              <Text style={[styles.cardDescription, { color: colors.textSecondary, marginTop: 2 }]}>{option.description}</Text>
            </Pressable>
          );
        })}
      </View>

      {error && <Text style={[styles.error, { color: colors.danger, marginBottom: spacing.md }]}>{error}</Text>}

      <Button label="Continue" loading={loading} disabled={!selected} onPress={handleContinue} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  heading: {},
  subheading: { fontSize: 14 },
  error: { fontSize: 13 },
  card: { borderWidth: 2 },
  cardTopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  iconCircle: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  cardTitle: { fontSize: 17 },
  cardDescription: { fontSize: 13 },
});
