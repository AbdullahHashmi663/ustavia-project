import { StyleSheet, Text, View } from 'react-native';

import { useTheme } from '../theme/ThemeProvider';

interface ChatBubbleProps {
  body: string;
  isOwnMessage: boolean;
}

export function ChatBubble({ body, isOwnMessage }: ChatBubbleProps) {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.bubble,
        isOwnMessage
          ? { backgroundColor: colors.brandBlue, alignSelf: 'flex-end' }
          : { backgroundColor: colors.surface, alignSelf: 'flex-start' },
      ]}
    >
      <Text style={{ color: isOwnMessage ? colors.white : colors.textPrimary }}>{body}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  bubble: {
    maxWidth: '80%',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginVertical: 4,
  },
});
