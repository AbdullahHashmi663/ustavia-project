import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import type { JobStatus } from '@ustavia/shared';

import { useTheme } from '../theme/ThemeProvider';
import { StatusBadge } from './StatusBadge';

interface JobCardProps {
  title: string;
  /** Secondary line — distance, date/time, or counterpart name depending on the list. */
  meta?: string;
  status?: JobStatus;
  price?: number | null;
  onPress?: () => void;
}

/** The one job-list row used across Dashboard, Schedule, Scheduled, and History — see both UX specs' recurring job-card layout (title, meta row, status pill, price, chevron). */
export function JobCard({ title, meta, status, price, onPress }: JobCardProps) {
  const { colors, radii, spacing, shadows, typography } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: colors.white,
          borderColor: colors.border,
          borderRadius: radii.md,
          padding: spacing.lg,
          opacity: pressed ? 0.85 : 1,
        },
        shadows.sm,
      ]}
    >
      <View style={styles.mainRow}>
        <View style={styles.textColumn}>
          <Text
            numberOfLines={2}
            style={[styles.title, { color: colors.textPrimary, fontFamily: typography.headingWeights.semibold, fontSize: typography.size.base }]}
          >
            {title}
          </Text>
          {meta && (
            <Text style={[styles.meta, { color: colors.textSecondary, fontSize: typography.size.sm }]}>{meta}</Text>
          )}
        </View>
        {onPress && <ChevronRight size={20} color={colors.textMuted} />}
      </View>

      {(status || price != null) && (
        <View style={[styles.footerRow, { marginTop: spacing.sm }]}>
          {status && <StatusBadge status={status} />}
          {price != null && (
            <Text style={{ color: colors.textPrimary, fontFamily: typography.headingWeights.semibold, fontSize: typography.size.base }}>
              Rs {price.toLocaleString()}
            </Text>
          )}
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { borderWidth: 1 },
  mainRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  textColumn: { flex: 1, gap: 2 },
  title: {},
  meta: {},
  footerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
});
