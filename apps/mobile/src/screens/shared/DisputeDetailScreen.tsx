import { ScrollView, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AlertCircle, CheckCircle2, Clock, Shield } from 'lucide-react-native';
import { DISPUTE_STATUSES, type DisputeStatus } from '@ustavia/shared';

import { useJobDisputes } from '../../api/hooks';
import { Card } from '../../components/Card';
import type { AppStackParamList } from '../../navigation/types';
import { useTheme } from '../../theme/ThemeProvider';

type Props = NativeStackScreenProps<AppStackParamList, 'DisputeDetail'>;

const CATEGORY_LABEL: Record<string, string> = {
  property_damage: 'Property damage',
  tardiness: 'Tardiness',
  harassment: 'Harassment',
  payment_issue: 'Payment issue',
  quality_issue: 'Quality issue',
  no_show: 'No show',
  other: 'Other issue',
};

const STATUS_LABEL: Record<DisputeStatus, string> = {
  open: 'Dispute Open',
  under_review: 'Under Ustavia Review',
  resolved: 'Case Resolved',
  dismissed: 'Case Dismissed',
};

export function DisputeDetailScreen({ route }: Props) {
  const { jobId } = route.params;
  const { colors, radii, spacing, typography, shadows } = useTheme();
  const { data: disputes = [] } = useJobDisputes(jobId);
  const dispute = disputes[0];

  if (!dispute) {
    return (
      <View style={[styles.container, { backgroundColor: colors.canvas ?? colors.white, padding: spacing.xl, justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: colors.textSecondary }}>No dispute found for this job.</Text>
      </View>
    );
  }

  const currentStepIndex = DISPUTE_STATUSES.indexOf(dispute.status);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.canvas ?? colors.white }}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={[styles.innerContainer, { padding: spacing.xl }]}>
        <View style={styles.headerBadge}>
          <AlertCircle size={18} color={colors.danger} />
          <Text style={[styles.badgeText, { color: colors.danger, fontFamily: typography.headingWeights.bold }]}>
            Dispute Ticket
          </Text>
        </View>

        <Text style={[styles.heading, { color: colors.textPrimary, fontFamily: typography.headingWeights.bold, fontSize: 24, marginTop: spacing.sm }]}>
          {CATEGORY_LABEL[dispute.category] ?? dispute.category}
        </Text>
        <Text style={{ color: colors.textMuted, fontSize: typography.size.xs, marginTop: 4 }}>
          Reported on {new Date(dispute.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}
        </Text>

        {dispute.details && (
          <Card variant="raised" style={{ marginTop: spacing.lg }}>
            <Text style={{ color: colors.textSecondary, fontSize: 14, lineHeight: 20 }}>
              "{dispute.details}"
            </Text>
          </Card>
        )}

        {/* Resolution Pipeline Track */}
        <Text style={[styles.sectionTitle, { color: colors.textPrimary, fontFamily: typography.headingWeights.bold, marginTop: spacing.xl, marginBottom: spacing.sm }]}>
          Review Progress
        </Text>
        <View style={[styles.timelineCard, { backgroundColor: colors.white, borderRadius: radii.lg, padding: spacing.lg }, shadows.sm]}>
          {(['open', 'under_review', 'resolved'] as const).map((step, index) => {
            const reached = index <= currentStepIndex || dispute.status === 'dismissed';
            return (
              <View key={step} style={[styles.timelineRow, index < 2 && { marginBottom: 16 }]}>
                <View
                  style={[
                    styles.timelineDot,
                    {
                      backgroundColor: reached ? colors.successLight : colors.surfaceSubtle,
                      borderRadius: radii.full,
                    },
                  ]}
                >
                  <CheckCircle2 size={18} color={reached ? colors.success : colors.textMuted} strokeWidth={2.2} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      color: reached ? colors.textPrimary : colors.textMuted,
                      fontFamily: reached ? typography.headingWeights.bold : undefined,
                      fontSize: 14,
                    }}
                  >
                    {STATUS_LABEL[step]}
                  </Text>
                  <Text style={{ color: colors.textMuted, fontSize: 12, marginTop: 1 }}>
                    {step === 'open'
                      ? 'Ticket submitted and queued'
                      : step === 'under_review'
                      ? 'Escrow specialist reviewing evidence'
                      : 'Final settlement reached'}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>

        {dispute.resolutionNotes && (
          <View style={[styles.notesCard, { backgroundColor: colors.successLight, borderRadius: radii.lg, padding: spacing.lg, marginTop: spacing.xl }]}>
            <Text style={{ color: '#047857', fontSize: typography.size.xs, fontFamily: typography.headingWeights.bold, marginBottom: 4 }}>
              Ustavia Support Resolution
            </Text>
            <Text style={{ color: '#065F46', fontSize: 14, lineHeight: 20 }}>
              {dispute.resolutionNotes}
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingVertical: 20,
  },
  innerContainer: {
    width: '100%',
    maxWidth: 540,
  },
  headerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  badgeText: {
    fontSize: 12,
    letterSpacing: 0.5,
  },
  heading: {},
  sectionTitle: {
    fontSize: 15,
  },
  timelineCard: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  timelineRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  timelineDot: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  notesCard: {},
});
