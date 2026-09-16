import { StyleSheet, Text, View } from 'react-native';
import type { JobStatus } from '@ustavia/shared';

import { useTheme } from '../theme/ThemeProvider';

const STATUS_LABEL: Record<JobStatus, string> = {
  posted: 'Awaiting replies',
  negotiating: 'In negotiation',
  confirmed: 'Confirmed',
  in_progress: 'In progress',
  completed: 'Completed',
  paid: 'Paid',
  disputed: 'Disputed',
};

const STATUS_TONE: Record<JobStatus, 'neutral' | 'negotiation' | 'active' | 'success' | 'danger'> = {
  posted: 'neutral',
  negotiating: 'negotiation',
  confirmed: 'active',
  in_progress: 'active',
  completed: 'success',
  paid: 'success',
  disputed: 'danger',
};

interface StatusBadgeProps {
  status: JobStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const { colors, radii, spacing, typography } = useTheme();
  const tone = STATUS_TONE[status];

  const tonePalette = {
    neutral: { bg: colors.surfaceSubtle, fg: colors.textSecondary, dot: colors.textMuted },
    negotiation: { bg: colors.warningLight, fg: '#B45309', dot: colors.brandOrangeWarm ?? '#FEA82F' },
    active: { bg: colors.brandBlueLight, fg: colors.brandBlue, dot: colors.brandBlue },
    success: { bg: colors.successLight, fg: '#047857', dot: colors.success },
    danger: { bg: colors.dangerLight, fg: colors.danger, dot: colors.danger },
  }[tone];

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: tonePalette.bg,
          borderRadius: radii.full,
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.xs,
        },
      ]}
    >
      <View style={[styles.indicatorDot, { backgroundColor: tonePalette.dot }]} />
      <Text
        style={{
          color: tonePalette.fg,
          fontSize: typography.size.xs + 0.5,
          fontFamily: typography.headingWeights.semibold,
          letterSpacing: 0.2,
        }}
      >
        {STATUS_LABEL[status]}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
  },
  indicatorDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});
