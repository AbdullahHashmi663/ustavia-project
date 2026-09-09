import { StyleSheet, Text, View } from 'react-native';

import { useTheme } from '../../theme/ThemeProvider';

/** Reserved for the SOS/emergency flow, visible during in_progress jobs — red is exclusive to this context. */
export function SosScreen() {
  const { colors } = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: colors.white }]}>
      <View style={[styles.sosButton, { backgroundColor: colors.danger }]}>
        <Text style={styles.sosLabel}>SOS</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  sosButton: { width: 120, height: 120, borderRadius: 999, alignItems: 'center', justifyContent: 'center' },
  sosLabel: { color: '#FFFFFF', fontFamily: 'Poppins_700Bold', fontSize: 24 },
});
