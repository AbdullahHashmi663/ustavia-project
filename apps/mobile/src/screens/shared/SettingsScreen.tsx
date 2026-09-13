import { StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { KeyRound, LogOut, ShieldCheck, ShieldAlert, ShieldQuestion, UserRound } from 'lucide-react-native';

import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import type { AppStackParamList } from '../../navigation/types';
import { useAuthStore } from '../../store/auth';
import { useTheme } from '../../theme/ThemeProvider';

const VERIFICATION_META = {
  pending: { label: 'Pending review', icon: ShieldQuestion, tone: 'warning' as const },
  verified: { label: 'Verified', icon: ShieldCheck, tone: 'info' as const },
  rejected: { label: 'Rejected', icon: ShieldAlert, tone: 'danger' as const },
};

/** Profile card + logout. Saved Addresses / Payment Methods / Notification Preferences rows land in Phase 3 (PLANNING.md §8) once there's a real screen behind each. */
export function SettingsScreen() {
  const { colors, radii, spacing, typography } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  const role = useAuthStore((state) => state.role);
  const phone = useAuthStore((state) => state.phone);
  const verificationStatus = useAuthStore((state) => state.verificationStatus);
  const passwordSet = useAuthStore((state) => state.passwordSet);
  const logout = useAuthStore((state) => state.logout);

  const verificationMeta = verificationStatus ? VERIFICATION_META[verificationStatus] : null;
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

      {phone && (
        <Card style={{ marginTop: spacing.lg }}>
          <View style={styles.profileRow}>
            <View style={[styles.avatar, { backgroundColor: colors.surface, borderRadius: radii.full }]}>
              <UserRound size={24} color={colors.textMuted} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: colors.textPrimary, fontFamily: typography.headingWeights.semibold, fontSize: typography.size.base }}>
                {phone}
              </Text>
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
        </Card>
      )}

      <View style={{ marginTop: spacing.xl }}>
        <Button
          label={passwordSet ? 'Change password' : 'Set up a password'}
          variant="outline"
          icon={KeyRound}
          onPress={() => navigation.navigate('ChangePassword')}
        />
      </View>

      <View style={{ marginTop: spacing.md }}>
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
