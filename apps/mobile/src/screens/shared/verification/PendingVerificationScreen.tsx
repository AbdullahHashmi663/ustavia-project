import { StyleSheet, Text, View } from 'react-native';

import { useTheme } from '../../../theme/ThemeProvider';

/** Shown while verification_status is "pending" — ARCHITECTURE.md §4 `users` table. */
export function PendingVerificationScreen() {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.white }]}>
      <View style={[styles.badge, { backgroundColor: colors.warning }]} />
      <Text style={[styles.heading, { color: colors.textPrimary }]}>Under review</Text>
      <Text style={[styles.subheading, { color: colors.textSecondary }]}>
        We're verifying your documents. This usually takes less than 24 hours.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, alignItems: 'center', justifyContent: 'center', gap: 12 },
  badge: { width: 48, height: 48, borderRadius: 999, marginBottom: 8 },
  heading: { fontFamily: 'Poppins_700Bold', fontSize: 22 },
  subheading: { fontSize: 14, textAlign: 'center' },
});
