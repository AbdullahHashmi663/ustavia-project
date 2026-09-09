import { StyleSheet, Text, View } from 'react-native';

import { useTheme } from '../../theme/ThemeProvider';

export function PostJobScreen() {
  const { colors } = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: colors.white }]}>
      <View style={[styles.accentBar, { backgroundColor: colors.brandBlue }]} />
      <Text style={[styles.heading, { color: colors.textPrimary }]}>Post a Job</Text>
      <Text style={{ color: colors.textSecondary }}>Job posting form lands here.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, gap: 8 },
  accentBar: { height: 4, width: 48, borderRadius: 999, marginBottom: 8 },
  heading: { fontFamily: 'Poppins_700Bold', fontSize: 22 },
});
