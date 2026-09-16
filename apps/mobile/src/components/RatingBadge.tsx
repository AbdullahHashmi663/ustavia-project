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
        {
          backgroundColor: tierColor,
          borderRadius: radii.full,
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.xxs + 3,
        },
      ]}
    >
      <Text
        style={[
          styles.tierLabel,
          {
            fontFamily: typography.headingWeights.bold,
            color: colors.white,
          },
        ]}
      >
        {tier.toUpperCase()}
      </Text>

      <View style={styles.divider} />

      <View style={styles.starRow}>
        <Star size={12} color={colors.white} fill={colors.white} />
        <Text
          style={[
            styles.ratingLabel,
            {
              fontFamily: typography.headingWeights.bold,
              color: colors.white,
            },
          ]}
        >
          {ratingAvg.toFixed(1)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    alignSelf: 'flex-start',
  },
  tierLabel: {
    fontSize: 11,
    letterSpacing: 0.5,
  },
  divider: {
    width: 1,
    height: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.45)',
  },
  starRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  ratingLabel: {
    fontSize: 12,
  },
});
