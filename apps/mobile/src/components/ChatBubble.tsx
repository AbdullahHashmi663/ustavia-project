import { StyleSheet, Text, View } from 'react-native';
import { Lock } from 'lucide-react-native';

import { useTheme } from '../theme/ThemeProvider';

interface ChatBubbleProps {
  body: string;
  isOwnMessage: boolean;
  redacted?: boolean;
}

export function ChatBubble({ body, isOwnMessage, redacted }: ChatBubbleProps) {
  const { colors, radii, spacing } = useTheme();

  return (
    <View
      style={[
        styles.bubble,
        { borderRadius: radii.lg, paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
        isOwnMessage
          ? { backgroundColor: colors.brandBlue, alignSelf: 'flex-end' }
          : { backgroundColor: colors.surface, alignSelf: 'flex-start' },
      ]}
    >
      <Text style={{ color: isOwnMessage ? colors.white : colors.textPrimary }}>{body}</Text>
      {redacted && (
        <View style={styles.redactedRow}>
          <Lock size={10} color={isOwnMessage ? colors.brandBlueLight : colors.textMuted} />
          <Text style={[styles.redactedNote, { color: isOwnMessage ? colors.brandBlueLight : colors.textMuted }]}>
            Contact info hidden for your safety
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  bubble: {
    maxWidth: '80%',
    marginVertical: 4,
  },
  redactedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  redactedNote: {
    fontSize: 10,
  },
});
