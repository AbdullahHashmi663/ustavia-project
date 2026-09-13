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

/** Color token pair (background/foreground) per state — matches both UX specs' color-coded status pill pattern (e.g. customer.pdf §12.1: "green Completed, blue Active, red Cancelled, orange Disputed"). */
const STATUS_TONE: Record<JobStatus, 'neutral' | 'info' | 'success' | 'danger'> = {
  posted: 'neutral',
  negotiating: 'info',
  confirmed: 'info',
  in_progress: 'info',
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
    neutral: { bg: colors.surface, fg: colors.textSecondary },
    info: { bg: colors.brandBlueLight, fg: colors.brandBlueDark },
    success: { bg: colors.successLight, fg: colors.success },
    danger: { bg: colors.dangerLight, fg: colors.danger },
  }[tone];

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: tonePalette.bg, borderRadius: radii.full, paddingHorizontal: spacing.sm, paddingVertical: spacing.xxs },
      ]}
    >
      <Text style={{ color: tonePalette.fg, fontSize: typography.size.xs, fontFamily: typography.headingWeights.semibold }}>
        {STATUS_LABEL[status]}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { alignSelf: 'flex-start' },
});
