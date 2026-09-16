import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HelpCircle, KeyRound, LifeBuoy, Lock, LogOut, ShieldAlert, ShieldCheck, ShieldQuestion, UserRound } from 'lucide-react-native';

import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import type { AppStackParamList } from '../../navigation/types';
import { useAuthStore } from '../../store/auth';
import { useTheme } from '../../theme/ThemeProvider';

const VERIFICATION_META = {
  pending: { label: 'Under Review', icon: ShieldQuestion, tone: 'warning' as const },
  verified: { label: 'Verified Account', icon: ShieldCheck, tone: 'info' as const },
  rejected: { label: 'Re-upload Required', icon: ShieldAlert, tone: 'danger' as const },
};

export function SettingsScreen() {
  const { colors, radii, spacing, typography, shadows } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  const role = useAuthStore((state) => state.role);
  const phone = useAuthStore((state) => state.phone);
  const verificationStatus = useAuthStore((state) => state.verificationStatus);
  const passwordSet = useAuthStore((state) => state.passwordSet);
  const logout = useAuthStore((state) => state.logout);

  const verificationMeta = verificationStatus ? VERIFICATION_META[verificationStatus] : null;
  const tonePalette = {
    warning: { bg: colors.warningLight, fg: colors.brandOrangeWarm ?? '#FEA82F' },
    info: { bg: colors.successLight, fg: colors.success },
    danger: { bg: colors.dangerLight, fg: colors.danger },
  };

  const roleAccent = role === 'mazdoor' ? colors.brandOrange : colors.brandBlue;
  const roleTint = role === 'mazdoor' ? colors.brandOrangeLight : colors.brandBlueLight;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.canvas ?? colors.white }}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={[styles.innerContainer, { padding: spacing.xl }]}>
        <Text style={[styles.heading, { color: colors.textPrimary, fontFamily: typography.headingWeights.bold, fontSize: 24, marginBottom: spacing.lg }]}>
          Account & Settings
        </Text>

        {phone && (
          <Card variant="raised" style={{ marginBottom: spacing.xl }}>
            <View style={styles.profileRow}>
              <View
                style={[
                  styles.avatar,
                  {
                    backgroundColor: roleTint,
                    borderRadius: radii.full,
                  },
                ]}
              >
                <UserRound size={26} color={roleAccent} strokeWidth={2} />
              </View>

              <View style={{ flex: 1, gap: 2 }}>
                <Text style={{ color: colors.textPrimary, fontFamily: typography.headingWeights.bold, fontSize: 17 }}>
                  {phone}
                </Text>
                <View style={[styles.rolePill, { backgroundColor: roleTint, borderRadius: radii.full }]}>
                  <Text style={{ color: roleAccent, fontSize: 11, fontFamily: typography.headingWeights.bold, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                    {role} Account
                  </Text>
                </View>
              </View>
            </View>

            {verificationMeta && (
              <View
                style={[
                  styles.badge,
                  {
                    backgroundColor: tonePalette[verificationMeta.tone].bg,
                    borderRadius: radii.full,
                    marginTop: spacing.md,
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                  },
                ]}
              >
                <verificationMeta.icon size={15} color={tonePalette[verificationMeta.tone].fg} strokeWidth={2} />
                <Text
                  style={{
                    color: tonePalette[verificationMeta.tone].fg,
                    fontSize: typography.size.xs,
                    fontFamily: typography.headingWeights.semibold,
                  }}
                >
                  {verificationMeta.label}
                </Text>
              </View>
            )}
          </Card>
        )}

        {/* Security Section */}
        <Text style={[styles.sectionTitle, { color: colors.textPrimary, fontFamily: typography.headingWeights.bold, marginBottom: spacing.sm }]}>
          Security & Access
        </Text>
        <View style={{ marginBottom: spacing.xl }}>
          <Button
            label={passwordSet ? 'Change Account Password' : 'Set Up Account Password'}
            variant="outline"
            icon={KeyRound}
            onPress={() => navigation.navigate('ChangePassword')}
          />
        </View>

        {/* Support & Help Section */}
        <Text style={[styles.sectionTitle, { color: colors.textPrimary, fontFamily: typography.headingWeights.bold, marginBottom: spacing.sm }]}>
          Help & Assistance
        </Text>
        <View style={{ marginBottom: spacing.xl }}>
          <Button
            label="Help & Support Center"
            variant="outline"
            icon={LifeBuoy}
            onPress={() => navigation.navigate('HelpCenter')}
          />
        </View>

        {/* App Info Box */}
        <View
          style={[
            styles.infoCard,
            {
              backgroundColor: colors.white,
              borderColor: colors.borderSubtle,
              borderRadius: radii.lg,
              padding: spacing.lg,
              marginBottom: spacing.xxl,
            },
            shadows.sm,
          ]}
        >
          <View style={styles.infoRow}>
            <Text style={{ color: colors.textSecondary, fontSize: 13 }}>Platform</Text>
            <Text style={{ color: colors.textPrimary, fontFamily: typography.headingWeights.semibold, fontSize: 13 }}>Ustavia Escrow v0.1.0</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={{ color: colors.textSecondary, fontSize: 13 }}>Identity Verification</Text>
            <Text style={{ color: colors.success, fontFamily: typography.headingWeights.semibold, fontSize: 13 }}>NADRA Encrypted</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={{ color: colors.textSecondary, fontSize: 13 }}>Customer Support</Text>
            <Text style={{ color: colors.brandBlue, fontFamily: typography.headingWeights.semibold, fontSize: 13 }}>support@ustavia.pk</Text>
          </View>
        </View>

        {/* Logout Action */}
        <Button label="Log Out of Account" variant="danger" icon={LogOut} onPress={logout} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingVertical: 20,
  },
  innerContainer: {
    width: '100%',
    maxWidth: 520,
  },
  heading: {},
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  avatar: {
    width: 52,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rolePill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginTop: 2,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
  },
  sectionTitle: {
    fontSize: 15,
  },
  infoCard: {
    borderWidth: 1,
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
