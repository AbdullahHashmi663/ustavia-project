import { StyleSheet, Text, View } from 'react-native';
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
  const { colors } = useTheme();
  const tierColor = colors[TIER_COLOR_KEY[tier]];

  return (
    <View style={[styles.badge, { backgroundColor: tierColor }]}>
      <Text style={styles.label}>
        {tier.toUpperCase()} · {ratingAvg.toFixed(1)}★
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  label: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Poppins_600SemiBold',
  },
});
