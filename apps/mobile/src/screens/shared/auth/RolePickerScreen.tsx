import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CheckCircle2, HardHat, ShieldCheck, Sparkles, UserSearch } from 'lucide-react-native';
import type { UserRole } from '@ustavia/shared';

import { verifyOtp } from '../../../api/auth';
import { ApiError } from '../../../api/client';
import { Button } from '../../../components/Button';
import { Logo } from '../../../components/Logo';
import { useAuthStore } from '../../../store/auth';
import { useSessionStore } from '../../../store/session';
import { useTheme } from '../../../theme/ThemeProvider';
import type { AuthStackParamList } from '../../../navigation/types';
import { afterAuthSession } from './afterAuthSession';

type Props = NativeStackScreenProps<AuthStackParamList, 'RolePicker'>;

interface RoleOption {
  role: UserRole;
  title: string;
  badge: string;
  description: string;
  icon: typeof HardHat;
  perks: string[];
}

const ROLE_OPTIONS: RoleOption[] = [
  {
    role: 'mazdoor',
    title: "I'm a Mazdoor",
    badge: 'Worker & Specialist',
    description: 'Find nearby jobs, quote prices, and receive guaranteed payouts.',
    icon: HardHat,
    perks: ['Instant local job leads', 'Guaranteed escrow payment', 'Daily wallet withdrawals'],
  },
  {
    role: 'customer',
    title: "I'm a Customer",
    badge: 'Hiring Services',
    description: 'Post jobs, negotiate fair quotes, and hire verified local workers.',
    icon: UserSearch,
    perks: ['Verified worker profiles', 'Payment held in escrow', 'NADRA-vetted specialists'],
  },
];

export function RolePickerScreen({ route, navigation }: Props) {
  const { colors, radii, spacing, typography, shadows } = useTheme();
  const setAccessToken = useSessionStore((state) => state.setAccessToken);
  const setUser = useAuthStore((state) => state.setUser);
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
      const session = await verifyOtp(route.params.phone, route.params.code, selected);
      afterAuthSession(navigation, setAccessToken, setUser, session);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not verify that code. Check it and try again.');
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
          <Logo size={48} />
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
          How will you use Ustavia?
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
          Select your primary role. This choice personalizes your app experience.
        </Text>

        <View style={{ gap: spacing.md, marginBottom: spacing.xl }}>
          {ROLE_OPTIONS.map((option) => {
            const isSelected = selected === option.role;
            const Icon = option.icon;
            const roleAccent = accentFor(option.role);
            const roleTint = tintFor(option.role);
            const activeShadow = option.role === 'mazdoor' ? shadows.glowOrange : shadows.glowBlue;

            return (
              <Pressable
                key={option.role}
                onPress={() => setSelected(option.role)}
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected }}
                style={({ pressed }) => [
                  styles.card,
                  {
                    borderColor: isSelected ? roleAccent : colors.borderSubtle,
                    borderWidth: isSelected ? 2 : 1.5,
                    backgroundColor: isSelected ? roleTint : colors.white,
                    borderRadius: radii.lg,
                    padding: spacing.lg,
                    transform: [{ scale: pressed ? 0.99 : 1 }],
                  },
                  isSelected ? activeShadow : shadows.sm,
                ]}
              >
                <View style={styles.cardHeader}>
                  <View
                    style={[
                      styles.iconCircle,
                      {
                        backgroundColor: isSelected ? colors.white : roleTint,
                        borderRadius: radii.full,
                      },
                    ]}
                  >
                    <Icon size={24} color={roleAccent} strokeWidth={2.2} />
                  </View>

                  <View style={styles.headerTitles}>
                    <View style={styles.titleRow}>
                      <Text
                        style={[
                          styles.cardTitle,
                          {
                            color: colors.textPrimary,
                            fontFamily: typography.headingWeights.bold,
                            fontSize: 18,
                          },
                        ]}
                      >
                        {option.title}
                      </Text>
                      {isSelected && <CheckCircle2 size={22} color={roleAccent} strokeWidth={2.5} />}
                    </View>
                    <Text style={[styles.badgeText, { color: roleAccent, fontFamily: typography.headingWeights.semibold }]}>
                      {option.badge}
                    </Text>
                  </View>
                </View>

                <Text
                  style={[
                    styles.cardDescription,
                    {
                      color: colors.textSecondary,
                      fontSize: 13,
                      lineHeight: 18,
                      marginTop: spacing.sm,
                      marginBottom: spacing.sm,
                    },
                  ]}
                >
                  {option.description}
                </Text>

                <View style={styles.perksList}>
                  {option.perks.map((perk, i) => (
                    <View key={i} style={styles.perkItem}>
                      <Sparkles size={12} color={roleAccent} />
                      <Text style={[styles.perkText, { color: colors.textPrimary }]}>{perk}</Text>
                    </View>
                  ))}
                </View>
              </Pressable>
            );
          })}
        </View>

        {error && (
          <View style={[styles.errorBox, { backgroundColor: colors.dangerLight, borderRadius: radii.md }]}>
            <Text style={[styles.error, { color: colors.danger }]}>{error}</Text>
          </View>
        )}

        <Button
          label="Continue"
          variant={selected === 'customer' ? 'trust' : 'primary'}
          loading={loading}
          disabled={!selected}
          onPress={handleContinue}
        />
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
    maxWidth: 500,
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
  card: {
    position: 'relative',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  iconCircle: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitles: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardTitle: {},
  badgeText: {
    fontSize: 12,
    marginTop: 1,
  },
  cardDescription: {},
  perksList: {
    gap: 5,
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  perkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  perkText: {
    fontSize: 12,
  },
  errorBox: {
    padding: 12,
    marginBottom: 16,
  },
  error: {
    fontSize: 13,
    textAlign: 'center',
  },
});
