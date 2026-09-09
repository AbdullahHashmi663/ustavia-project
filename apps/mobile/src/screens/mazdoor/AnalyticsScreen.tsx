import { StyleSheet, Text, View } from 'react-native';

import { useTheme } from '../../theme/ThemeProvider';

export function AnalyticsScreen() {
  const { colors } = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: colors.white }]}>
      <Text style={[styles.heading, { color: colors.textPrimary }]}>Analytics</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  heading: { fontFamily: 'Poppins_700Bold', fontSize: 22 },
});
