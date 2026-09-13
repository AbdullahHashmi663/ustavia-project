import { StyleSheet, Text, View } from 'react-native';
import { LogOut, ShieldCheck, ShieldAlert, ShieldQuestion, UserRound } from 'lucide-react-native';

import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { RatingBadge } from '../../components/RatingBadge';
import { useAuthStore } from '../../store/auth';
import { useJobsStore } from '../../store/jobs';
import { useTheme } from '../../theme/ThemeProvider';

const VERIFICATION_META = {
  pending: { label: 'Pending review', icon: ShieldQuestion, tone: 'warning' as const },
  verified: { label: 'Verified', icon: ShieldCheck, tone: 'info' as const },
  rejected: { label: 'Rejected', icon: ShieldAlert, tone: 'danger' as const },
};

/** Profile card + logout. Saved Addresses / Payment Methods / Notification Preferences rows land in Phase 3 (PLANNING.md §8) once there's a real screen behind each. */
export function SettingsScreen() {
  const { colors, radii, spacing, typography } = useTheme();
  const role = useAuthStore((state) => state.role);
  const userId = useAuthStore((state) => state.userId);
  const logout = useAuthStore((state) => state.logout);
  const mazdoors = useJobsStore((state) => state.mazdoors);
  const customers = useJobsStore((state) => state.customers);

  const profile = role === 'mazdoor' ? mazdoors.find((m) => m.id === userId) : customers.find((c) => c.id === userId);
  const verificationMeta = profile ? VERIFICATION_META[profile.verificationStatus] : null;
  const tonePalette = {
    warning: { bg: colors.warningLight, fg: colors.warning },
    info: { bg: colors.infoLight, fg: colors.info },
    danger: { bg: colors.dangerLight, fg: colors.danger },
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.white, padding: spacing.xl }]}>
      <Text style={[styles.heading, { color: colors.textPrimary, fontFamily: typography.headingWeights.bold, fontSize: typography.size.xl }]}>
        Settings
      </Text>

      {profile && (
        <Card style={{ marginTop: spacing.lg }}>
          <View style={styles.profileRow}>
            <View style={[styles.avatar, { backgroundColor: colors.surface, borderRadius: radii.full }]}>
              <UserRound size={24} color={colors.textMuted} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: colors.textPrimary, fontFamily: typography.headingWeights.semibold, fontSize: typography.size.base }}>
                {profile.phone}
              </Text>
              {'email' in profile && profile.email && (
                <Text style={{ color: colors.textSecondary, fontSize: typography.size.sm }}>{profile.email}</Text>
              )}
              <Text style={{ color: colors.textMuted, fontSize: typography.size.xs, marginTop: 2, textTransform: 'capitalize' }}>
                {role} account
              </Text>
            </View>
          </View>

          {verificationMeta && (
            <View
              style={[
                styles.badge,
                { backgroundColor: tonePalette[verificationMeta.tone].bg, borderRadius: radii.full, marginTop: spacing.md },
              ]}
            >
              <verificationMeta.icon size={14} color={tonePalette[verificationMeta.tone].fg} />
              <Text style={{ color: tonePalette[verificationMeta.tone].fg, fontSize: typography.size.xs, fontFamily: typography.headingWeights.semibold }}>
                {verificationMeta.label}
              </Text>
            </View>
          )}

          {'tier' in profile && profile.tier && profile.ratingAvg != null && (
            <View style={{ marginTop: spacing.md }}>
              <RatingBadge tier={profile.tier} ratingAvg={profile.ratingAvg} />
            </View>
          )}
        </Card>
      )}

      <View style={{ marginTop: spacing.xl }}>
        <Button label="Log out" variant="danger" icon={LogOut} onPress={logout} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  heading: {},
  profileRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { width: 48, height: 48, alignItems: 'center', justifyContent: 'center' },
  badge: { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 5 },
});
