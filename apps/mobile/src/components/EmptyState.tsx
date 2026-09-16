import { StyleSheet, Text, View } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';

import { useTheme } from '../theme/ThemeProvider';
import { Button } from './Button';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

/**
 * Modern empty-state layout featuring double-ringed ambient icon emblem,
 * high-contrast typography, and contextual action.
 */
export function EmptyState({ icon: Icon, title, description, actionLabel, onAction }: EmptyStateProps) {
  const { colors, spacing, typography, radii } = useTheme();

  return (
    <View style={[styles.container, { paddingVertical: spacing.xxxl, gap: spacing.md }]}>
      <View
        style={[
          styles.outerRing,
          {
            backgroundColor: colors.brandBlueLight,
            borderRadius: radii.full,
          },
        ]}
      >
        <View
          style={[
            styles.innerRing,
            {
              backgroundColor: colors.white,
              borderRadius: radii.full,
              borderColor: 'rgba(0, 97, 153, 0.12)',
            },
          ]}
        >
          <Icon size={30} color={colors.brandBlue} strokeWidth={2} />
        </View>
      </View>

      <View style={styles.textStack}>
        <Text
          style={[
            styles.title,
            {
              color: colors.textPrimary,
              fontFamily: typography.headingWeights.bold,
              fontSize: typography.size.lg,
            },
          ]}
        >
          {title}
        </Text>
        {description && (
          <Text
            style={[
              styles.description,
              {
                color: colors.textSecondary,
                fontSize: typography.size.base,
                lineHeight: 22,
              },
            ]}
          >
            {description}
          </Text>
        )}
      </View>

      {actionLabel && onAction && (
        <View style={{ marginTop: spacing.xs }}>
          <Button label={actionLabel} onPress={onAction} variant="trust" fullWidth={false} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  outerRing: {
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerRing: {
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
  },
  textStack: {
    alignItems: 'center',
    gap: 6,
  },
  title: {
    textAlign: 'center',
  },
  description: {
    textAlign: 'center',
  },
});
