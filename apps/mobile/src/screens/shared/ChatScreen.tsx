import { useEffect, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import { SendHorizontal, ShieldCheck } from 'lucide-react-native';

import { useChatMessages, useJob, useSendMessage } from '../../api/hooks';
import { ChatBubble } from '../../components/ChatBubble';
import type { AppStackParamList } from '../../navigation/types';
import { useAuthStore } from '../../store/auth';
import { useTheme } from '../../theme/ThemeProvider';

type Props = NativeStackScreenProps<AppStackParamList, 'Chat'>;

const QUICK_REPLIES = ['On my way', "I'm at your door", 'Running 10 mins late', 'Can you confirm location?'];

export function ChatScreen({ route }: Props) {
  const { jobId } = route.params;
  const { colors, radii, spacing, typography, shadows, minTouchTarget } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  const role = useAuthStore((state) => state.role);
  const userId = useAuthStore((state) => state.userId);
  const { data: job } = useJob(jobId);
  const { data: messages = [] } = useChatMessages(jobId);
  const sendMessage = useSendMessage(jobId);
  const [draft, setDraft] = useState('');

  useEffect(() => {
    navigation.setOptions({
      title: job ? (role === 'mazdoor' ? 'Chat with Customer' : 'Chat with Mazdoor') : 'Chat',
    });
  }, [navigation, job, role]);

  const handleSend = (body: string) => {
    if (!body.trim()) return;
    setDraft('');
    sendMessage.mutate(body.trim());
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.canvas ?? colors.white }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.centerWrapper}>
        {/* Safe Escrow Notice Banner */}
        <View style={[styles.safetyBanner, { backgroundColor: colors.surfaceSubtle, borderBottomColor: colors.borderSubtle }]}>
          <ShieldCheck size={14} color={colors.brandBlue} />
          <Text style={[styles.safetyText, { color: colors.textSecondary, fontSize: typography.size.xs }]}>
            Ustavia Secure Chat · Messages are encrypted and logged for dispute protection
          </Text>
        </View>

        <FlatList
          data={[...messages].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())}
          keyExtractor={(m) => m.id}
          contentContainerStyle={{ padding: spacing.lg, gap: 6, flexGrow: 1 }}
          renderItem={({ item }) => (
            <ChatBubble body={item.body} redacted={item.redacted} isOwnMessage={item.senderId === userId} />
          )}
        />

        {/* Quick Replies Strip */}
        <View style={[styles.quickReplyRow, { paddingHorizontal: spacing.lg }]}>
          {QUICK_REPLIES.map((reply) => (
            <Pressable
              key={reply}
              onPress={() => handleSend(reply)}
              style={[
                styles.chip,
                {
                  backgroundColor: colors.white,
                  borderColor: colors.borderSubtle,
                  borderRadius: radii.full,
                },
                shadows.sm,
              ]}
            >
              <Text style={{ color: colors.textPrimary, fontSize: 12, fontFamily: typography.headingWeights.semibold }}>
                {reply}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Input Bar */}
        <View
          style={[
            styles.inputRow,
            {
              backgroundColor: colors.white,
              borderTopColor: colors.borderSubtle,
              padding: spacing.md,
            },
            shadows.sm,
          ]}
        >
          <View style={[styles.inputBox, { backgroundColor: colors.surfaceSubtle, borderRadius: radii.full, paddingHorizontal: spacing.md }]}>
            <TextInput
              style={[styles.input, { color: colors.textPrimary }]}
              placeholder="Type your message..."
              placeholderTextColor={colors.textMuted}
              value={draft}
              onChangeText={setDraft}
              onSubmitEditing={() => handleSend(draft)}
            />
          </View>

          <Pressable
            onPress={() => handleSend(draft)}
            disabled={!draft.trim()}
            style={[
              styles.sendButton,
              {
                backgroundColor: colors.brandBlue,
                width: minTouchTarget,
                height: minTouchTarget,
                borderRadius: radii.full,
                opacity: draft.trim() ? 1 : 0.5,
              },
            ]}
          >
            <SendHorizontal size={18} color={colors.white} />
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerWrapper: {
    flex: 1,
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
  },
  safetyBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  safetyText: {
    flex: 1,
  },
  quickReplyRow: {
    flexDirection: 'row',
    gap: 8,
    paddingBottom: 8,
    flexWrap: 'wrap',
  },
  chip: {
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 10,
    borderTopWidth: 1,
    alignItems: 'center',
  },
  inputBox: {
    flex: 1,
    height: 44,
    justifyContent: 'center',
  },
  input: {
    fontSize: 15,
  },
  sendButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
