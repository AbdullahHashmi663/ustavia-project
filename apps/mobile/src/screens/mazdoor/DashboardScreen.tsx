import { StyleSheet, Text, View } from 'react-native';

import { useTheme } from '../../theme/ThemeProvider';

export function DashboardScreen() {
  const { colors } = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: colors.white }]}>
      <View style={[styles.accentBar, { backgroundColor: colors.brandOrange }]} />
      <Text style={[styles.heading, { color: colors.textPrimary }]}>Mazdoor Dashboard</Text>
      <Text style={{ color: colors.textSecondary }}>Nearby jobs will show up here.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, gap: 8 },
  accentBar: { height: 4, width: 48, borderRadius: 999, marginBottom: 8 },
  heading: { fontFamily: 'Poppins_700Bold', fontSize: 22 },
});
