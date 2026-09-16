import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Clock, ShieldAlert, ShieldCheck, ShieldQuestion } from 'lucide-react-native';

import { useAuthStore } from '../../../store/auth';
import { useTheme } from '../../../theme/ThemeProvider';

const STATE_META = {
  pending: {
    icon: ShieldQuestion,
    tone: 'warning' as const,
    heading: 'Under Review',
    body: "We're verifying your CNIC documents against the official registry. This usually completes in under 24 hours.",
    eta: 'Estimated: 2–4 hours',
  },
  verified: {
    icon: ShieldCheck,
    tone: 'success' as const,
    heading: "You're Verified!",
    body: 'Your identity has been confirmed. You now have a verified trust badge on your profile.',
    eta: 'Account fully active',
  },
  rejected: {
    icon: ShieldAlert,
    tone: 'danger' as const,
    heading: 'Verification Incomplete',
    body: 'We couldn’t verify the uploaded CNIC photos. Please ensure your photos are well-lit and not blurry.',
    eta: 'Action required',
  },
};

export function PendingVerificationScreen() {
  const { colors, radii, spacing, typography, shadows } = useTheme();
  const verificationStatus = useAuthStore((state) => state.verificationStatus) ?? 'pending';
  const completeAuth = useAuthStore((state) => state.completeAuth);

  const meta = STATE_META[verificationStatus];
  const Icon = meta.icon;
  const tonePalette = {
    warning: { bg: colors.warningLight, fg: colors.brandOrangeWarm ?? '#FEA82F', border: 'rgba(254, 168, 47, 0.25)' },
    success: { bg: colors.successLight, fg: colors.success, border: 'rgba(16, 185, 129, 0.25)' },
    danger: { bg: colors.dangerLight, fg: colors.danger, border: 'rgba(239, 68, 68, 0.25)' },
  }[meta.tone];

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.canvas ?? colors.white }}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={[styles.innerContainer, { padding: spacing.xl }]}>
        {/* Double-ring animated emblem */}
        <View
          style={[
            styles.outerEmblem,
            {
              backgroundColor: tonePalette.bg,
              borderColor: tonePalette.border,
              borderRadius: radii.full,
            },
          ]}
        >
          <View
            style={[
              styles.innerEmblem,
              {
                backgroundColor: colors.white,
                borderRadius: radii.full,
              },
              shadows.sm,
            ]}
          >
            <Icon size={38} color={tonePalette.fg} strokeWidth={2.2} />
          </View>
        </View>

        <Text
          style={[
            styles.heading,
            {
              color: colors.textPrimary,
              fontFamily: typography.headingWeights.bold,
              fontSize: 24,
              marginTop: spacing.lg,
            },
          ]}
        >
          {meta.heading}
        </Text>

        <Text
          style={[
            styles.subheading,
            {
              color: colors.textSecondary,
              marginTop: spacing.xs,
              marginBottom: spacing.xl,
              lineHeight: 22,
            },
          ]}
        >
          {meta.body}
        </Text>

        {/* Timeline Status Box */}
        <View
          style={[
            styles.statusCard,
            {
              backgroundColor: colors.white,
              borderColor: colors.borderSubtle,
              borderRadius: radii.lg,
              padding: spacing.lg,
            },
            shadows.sm,
          ]}
        >
          <View style={styles.statusRow}>
            <Clock size={18} color={tonePalette.fg} />
            <Text
              style={[
                styles.etaText,
                {
                  color: colors.textPrimary,
                  fontFamily: typography.headingWeights.semibold,
                  fontSize: typography.size.sm,
                },
              ]}
            >
              {meta.eta}
            </Text>
          </View>
          <Text
            style={[
              styles.statusNote,
              {
                color: colors.textMuted,
                fontSize: typography.size.xs,
                marginTop: 4,
              },
            ]}
          >
            You’ll receive an SMS notification as soon as verification completes.
          </Text>
        </View>

        {/* DEV ONLY bypass */}
        <Pressable
          onPress={completeAuth}
          style={[
            styles.devBypass,
            {
              backgroundColor: colors.surfaceSubtle,
              borderRadius: radii.md,
              marginTop: spacing.xxl,
            },
          ]}
        >
          <Text style={[styles.devBypassLabel, { color: colors.textSecondary, fontFamily: typography.headingWeights.semibold }]}>
            Continue anyway (Dev Preview)
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
    alignItems: 'center',
  },
  outerEmblem: {
    width: 96,
    height: 96,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  innerEmblem: {
    width: 72,
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading: {
    textAlign: 'center',
  },
  subheading: {
    fontSize: 14,
    textAlign: 'center',
  },
  statusCard: {
    width: '100%',
    borderWidth: 1,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  etaText: {},
  statusNote: {
    lineHeight: 16,
    marginLeft: 26,
  },
  devBypass: {
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  devBypassLabel: {
    fontSize: 13,
  },
});
