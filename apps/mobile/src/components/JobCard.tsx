import { StyleSheet, Text, View } from 'react-native';

import { useTheme } from '../theme/ThemeProvider';

interface JobCardProps {
  title: string;
  subtitle: string;
}

export function JobCard({ title, subtitle }: JobCardProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: colors.white, borderColor: colors.border }]}>
      <Text style={[styles.title, { color: colors.textPrimary }]}>{title}</Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    gap: 4,
  },
  title: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 16,
  },
  subtitle: {
    fontSize: 14,
  },
});
