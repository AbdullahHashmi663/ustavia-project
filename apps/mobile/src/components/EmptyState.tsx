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

/** Centered icon + heading + subtext (+ optional CTA) pattern both UX specs use for every empty list (no jobs posted, empty portfolio, no notifications, ...). */
export function EmptyState({ icon: Icon, title, description, actionLabel, onAction }: EmptyStateProps) {
  const { colors, spacing, typography } = useTheme();

  return (
    <View style={[styles.container, { paddingVertical: spacing.xxl, gap: spacing.sm }]}>
      <View style={[styles.iconCircle, { backgroundColor: colors.surface }]}>
        <Icon size={28} color={colors.textMuted} />
      </View>
      <Text style={[styles.title, { color: colors.textPrimary, fontFamily: typography.headingWeights.semibold, fontSize: typography.size.md }]}>
        {title}
      </Text>
      {description && (
        <Text style={[styles.description, { color: colors.textSecondary, fontSize: typography.size.base }]}>{description}</Text>
      )}
      {actionLabel && onAction && (
        <View style={{ marginTop: spacing.sm, width: '100%' }}>
          <Button label={actionLabel} onPress={onAction} variant="outline" fullWidth={false} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', paddingHorizontal: 24 },
  iconCircle: { width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center' },
  title: { textAlign: 'center' },
  description: { textAlign: 'center' },
});
