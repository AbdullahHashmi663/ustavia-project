import { StyleSheet, Text, View } from 'react-native';
import { ShieldAlert } from 'lucide-react-native';

import { useTheme } from '../theme/ThemeProvider';

interface ChatBubbleProps {
  body: string;
  isOwnMessage: boolean;
  redacted?: boolean;
}

export function ChatBubble({ body, isOwnMessage, redacted }: ChatBubbleProps) {
  const { colors, radii, spacing, shadows, typography } = useTheme();

  return (
    <View
      style={[
        styles.bubble,
        {
          borderRadius: radii.lg,
          borderBottomRightRadius: isOwnMessage ? 4 : radii.lg,
          borderBottomLeftRadius: !isOwnMessage ? 4 : radii.lg,
          paddingHorizontal: spacing.md + 2,
          paddingVertical: spacing.sm + 2,
        },
        isOwnMessage
          ? {
              backgroundColor: colors.brandBlue,
              alignSelf: 'flex-end',
            }
          : {
              backgroundColor: colors.white,
              borderWidth: 1,
              borderColor: colors.borderSubtle,
              alignSelf: 'flex-start',
              ...shadows.sm,
            },
      ]}
    >
      <Text
        style={{
          color: isOwnMessage ? colors.white : colors.textPrimary,
          fontSize: 15,
          lineHeight: 21,
        }}
      >
        {body}
      </Text>

      {redacted && (
        <View
          style={[
            styles.redactedBox,
            {
              backgroundColor: isOwnMessage ? 'rgba(0, 0, 0, 0.15)' : colors.warningLight,
              borderRadius: radii.sm,
            },
          ]}
        >
          <ShieldAlert size={12} color={isOwnMessage ? colors.white : colors.warning} />
          <Text
            style={[
              styles.redactedNote,
              { color: isOwnMessage ? colors.white : '#92400E' },
            ]}
          >
            Direct contact info filtered for your escrow security
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  bubble: {
    maxWidth: '82%',
    marginVertical: 4,
  },
  redactedBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginTop: 6,
  },
  redactedNote: {
    fontSize: 11,
    flex: 1,
    lineHeight: 14,
  },
});
