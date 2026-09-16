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

/**
 * Modern bento-style job row with elevated surface, high-contrast typography,
 * status chip with indicator dot, and dedicated price badge.
 */
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
          borderColor: pressed ? colors.brandOrange : colors.borderSubtle,
          borderRadius: radii.lg,
          padding: spacing.lg,
          transform: [{ scale: pressed && onPress ? 0.99 : 1 }],
        },
        shadows.sm,
      ]}
    >
      <View style={styles.mainRow}>
        <View style={styles.textColumn}>
          <Text
            numberOfLines={2}
            style={[
              styles.title,
              {
                color: colors.textPrimary,
                fontFamily: typography.headingWeights.semibold,
                fontSize: typography.size.base + 1,
                lineHeight: 22,
              },
            ]}
          >
            {title}
          </Text>
          {meta && (
            <Text style={[styles.meta, { color: colors.textSecondary, fontSize: typography.size.sm }]}>{meta}</Text>
          )}
        </View>

        {onPress && (
          <View style={[styles.chevronBadge, { backgroundColor: colors.surfaceSubtle, borderRadius: radii.full }]}>
            <ChevronRight size={18} color={colors.textSecondary} />
          </View>
        )}
      </View>

      {(status || price != null) && (
        <View style={[styles.footerRow, { marginTop: spacing.md, paddingTop: spacing.xs }]}>
          {status ? <StatusBadge status={status} /> : <View />}
          {price != null && (
            <View
              style={[
                styles.pricePill,
                {
                  backgroundColor: colors.brandOrangeLight,
                  borderColor: 'rgba(255, 103, 1, 0.2)',
                  borderRadius: radii.full,
                },
              ]}
            >
              <Text
                style={[
                  styles.priceText,
                  {
                    color: colors.brandOrangeDark,
                    fontFamily: typography.headingWeights.bold,
                    fontSize: typography.size.base,
                  },
                ]}
              >
                Rs {price.toLocaleString()}
              </Text>
            </View>
          )}
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
  },
  mainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  textColumn: {
    flex: 1,
    gap: 4,
  },
  title: {},
  meta: {
    letterSpacing: 0.1,
  },
  chevronBadge: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pricePill: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderWidth: 1,
  },
  priceText: {},
});
