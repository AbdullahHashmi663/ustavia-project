import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ShieldAlert, ShieldCheck, ShieldQuestion } from 'lucide-react-native';

import { useAuthStore } from '../../../store/auth';
import { useTheme } from '../../../theme/ThemeProvider';

const STATE_META = {
  pending: {
    icon: ShieldQuestion,
    tone: 'warning' as const,
    heading: 'Under review',
    body: "We're verifying your documents against NADRA. This usually takes less than 24 hours.",
  },
  verified: {
    icon: ShieldCheck,
    tone: 'success' as const,
    heading: "You're verified",
    body: 'Your identity has been confirmed. A verified badge now shows on your profile.',
  },
  rejected: {
    icon: ShieldAlert,
    tone: 'danger' as const,
    heading: 'Verification failed',
    body: 'We couldn’t verify your documents. Check that both photos are clear and re-upload.',
  },
};

/** Shown while verification_status is pending/verified/rejected — ARCHITECTURE.md §4 `users` table; states mirror customer.pdf §2.6 / Workers.pdf §1.2.6. */
export function PendingVerificationScreen() {
  const { colors, radii, spacing, typography } = useTheme();
  const verificationStatus = useAuthStore((state) => state.verificationStatus) ?? 'pending';
  const completeAuth = useAuthStore((state) => state.completeAuth);

  const meta = STATE_META[verificationStatus];
  const Icon = meta.icon;
  const tonePalette = {
    warning: { bg: colors.warningLight, fg: colors.warning },
    success: { bg: colors.successLight, fg: colors.success },
    danger: { bg: colors.dangerLight, fg: colors.danger },
  }[meta.tone];

  return (
    <View style={[styles.container, { backgroundColor: colors.white, padding: spacing.xl }]}>
      <View style={[styles.badge, { backgroundColor: tonePalette.bg, borderRadius: radii.full }]}>
        <Icon size={32} color={tonePalette.fg} />
      </View>
      <Text style={[styles.heading, { color: colors.textPrimary, fontFamily: typography.headingWeights.bold, fontSize: 22 }]}>
        {meta.heading}
      </Text>
      <Text style={[styles.subheading, { color: colors.textSecondary, marginTop: spacing.xs }]}>{meta.body}</Text>

      {/* DEV ONLY: real progression past this screen requires the verification module
          (CRM approval + a poll/push signal back to the client) — neither exists yet.
          Remove this once that flow ships. */}
      <Pressable onPress={completeAuth} style={{ marginTop: spacing.xl, padding: spacing.sm }}>
        <Text style={[styles.devBypassLabel, { color: colors.textMuted }]}>Continue anyway (dev preview)</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  badge: { width: 72, height: 72, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  heading: { textAlign: 'center' },
  subheading: { fontSize: 14, textAlign: 'center' },
  devBypassLabel: { fontSize: 12, textDecorationLine: 'underline' },
});
