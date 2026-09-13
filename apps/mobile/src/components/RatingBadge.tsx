import { StyleSheet, Text, View } from 'react-native';
import { Star } from 'lucide-react-native';
import type { MazdoorTier } from '@ustavia/shared';

import { useTheme } from '../theme/ThemeProvider';

const TIER_COLOR_KEY = {
  bronze: 'tierBronze',
  silver: 'tierSilver',
  gold: 'tierGold',
  diamond: 'tierDiamond',
} as const;

interface RatingBadgeProps {
  tier: MazdoorTier;
  ratingAvg: number;
}

export function RatingBadge({ tier, ratingAvg }: RatingBadgeProps) {
  const { colors, radii, spacing, typography } = useTheme();
  const tierColor = colors[TIER_COLOR_KEY[tier]];

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: tierColor, borderRadius: radii.full, paddingHorizontal: spacing.sm + 2, paddingVertical: spacing.xxs + 2 },
      ]}
    >
      <Text style={[styles.label, { fontFamily: typography.headingWeights.semibold }]}>{tier.toUpperCase()}</Text>
      <View style={styles.starRow}>
        <Star size={11} color={colors.white} fill={colors.white} />
        <Text style={[styles.label, { fontFamily: typography.headingWeights.semibold }]}>{ratingAvg.toFixed(1)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start' },
  starRow: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  label: { color: '#FFFFFF', fontSize: 12 },
});
