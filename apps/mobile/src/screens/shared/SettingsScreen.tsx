import { StyleSheet, Text, View } from 'react-native';

import { useAuthStore } from '../../store/auth';
import { useTheme } from '../../theme/ThemeProvider';

export function SettingsScreen() {
  const { colors } = useTheme();
  const role = useAuthStore((state) => state.role);

  return (
    <View style={[styles.container, { backgroundColor: colors.white }]}>
      <Text style={{ color: colors.textPrimary }}>Signed in as: {role}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
});
