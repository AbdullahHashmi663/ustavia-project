import { StyleSheet, Text, View } from 'react-native';

import { useTheme } from '../../theme/ThemeProvider';

/** Realtime messaging via Socket.IO, server-side phone/email redaction — see ARCHITECTURE.md §3, §7. */
export function ChatScreen() {
  const { colors } = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: colors.white }]}>
      <Text style={{ color: colors.textSecondary }}>Chat lands here once the chat module is wired up.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
});
