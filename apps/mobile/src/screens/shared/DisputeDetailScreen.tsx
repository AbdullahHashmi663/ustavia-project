import { StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CheckCircle2 } from 'lucide-react-native';
import { DISPUTE_STATUSES, type DisputeStatus } from '@ustavia/shared';

import type { AppStackParamList } from '../../navigation/types';
import { useJobsStore } from '../../store/jobs';
import { useTheme } from '../../theme/ThemeProvider';

type Props = NativeStackScreenProps<AppStackParamList, 'DisputeDetail'>;

const CATEGORY_LABEL: Record<string, string> = {
  property_damage: 'Property damage',
  tardiness: 'Tardiness',
  harassment: 'Harassment',
  payment_issue: 'Payment issue',
  quality_issue: 'Quality issue',
  no_show: 'No show',
  other: 'Other',
};

const STATUS_LABEL: Record<DisputeStatus, string> = {
  open: 'Open',
  under_review: 'Under Review',
  resolved: 'Resolved',
  dismissed: 'Dismissed',
};

/** customer.pdf §12.3 Support Tickets Screen (single-dispute thread view). */
export function DisputeDetailScreen({ route }: Props) {
  const { jobId } = route.params;
  const { colors, radii, spacing, typography } = useTheme();
  const dispute = useJobsStore((state) =>
    [...state.disputes].reverse().find((d) => d.jobId === jobId),
  );

  if (!dispute) {
    return (
      <View style={[styles.container, { backgroundColor: colors.white, padding: spacing.xl }]}>
        <Text style={{ color: colors.textSecondary }}>No dispute found for this job.</Text>
      </View>
    );
  }

  const currentStepIndex = DISPUTE_STATUSES.indexOf(dispute.status);

  return (
    <View style={[styles.container, { backgroundColor: colors.white, padding: spacing.xl }]}>
      <Text style={[styles.heading, { color: colors.textPrimary, fontFamily: typography.headingWeights.bold, fontSize: typography.size.xl }]}>
        {CATEGORY_LABEL[dispute.category] ?? dispute.category}
      </Text>
      <Text style={{ color: colors.textMuted, fontSize: typography.size.xs, marginTop: spacing.xxs }}>
        Reported {new Date(dispute.createdAt).toLocaleDateString()}
      </Text>

      {dispute.details && (
        <Text style={{ color: colors.textSecondary, marginTop: spacing.md }}>{dispute.details}</Text>
      )}

      <View style={[styles.timeline, { marginTop: spacing.xl, gap: spacing.md }]}>
        {(['open', 'under_review', 'resolved'] as const).map((step, index) => {
          const reached = index <= currentStepIndex || dispute.status === 'dismissed';
          return (
            <View key={step} style={styles.timelineRow}>
              <CheckCircle2 size={18} color={reached ? colors.success : colors.border} />
              <Text style={{ color: reached ? colors.textPrimary : colors.textMuted }}>{STATUS_LABEL[step]}</Text>
            </View>
          );
        })}
      </View>

      {dispute.resolutionNotes && (
        <View style={[styles.notesCard, { backgroundColor: colors.surface, borderRadius: radii.md, padding: spacing.md, marginTop: spacing.xl }]}>
          <Text style={{ color: colors.textSecondary, fontSize: typography.size.xs, marginBottom: spacing.xxs }}>
            Resolution from Ustavia support
          </Text>
          <Text style={{ color: colors.textPrimary }}>{dispute.resolutionNotes}</Text>
        </View>
      )}

      {dispute.status === 'open' || dispute.status === 'under_review' ? (
        <Text style={{ color: colors.textMuted, marginTop: spacing.xl, fontSize: typography.size.sm }}>
          Our team typically responds within 24 hours.
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  heading: {},
  timeline: {},
  timelineRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  notesCard: {},
});
