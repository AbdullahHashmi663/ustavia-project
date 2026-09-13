import { useEffect, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import { SendHorizontal } from 'lucide-react-native';

import { useChatMessages, useJob, useSendMessage } from '../../api/hooks';
import { ChatBubble } from '../../components/ChatBubble';
import type { AppStackParamList } from '../../navigation/types';
import { useAuthStore } from '../../store/auth';
import { useTheme } from '../../theme/ThemeProvider';

type Props = NativeStackScreenProps<AppStackParamList, 'Chat'>;

const QUICK_REPLIES = ['On my way', "I'm at the gate", 'Running late'];

/** Real, persisted, server-redacted chat history (`src/api/chat.ts`) — polled every 4s, no Socket.IO push yet (ARCHITECTURE.md §2.4 is still just a plan). */
export function ChatScreen({ route }: Props) {
  const { jobId } = route.params;
  const { colors, radii, spacing, minTouchTarget } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  const role = useAuthStore((state) => state.role);
  const userId = useAuthStore((state) => state.userId);
  const { data: job } = useJob(jobId);
  const { data: messages = [] } = useChatMessages(jobId);
  const sendMessage = useSendMessage(jobId);
  const [draft, setDraft] = useState('');

  useEffect(() => {
    // No counterpart phone shown — ARCHITECTURE.md §7 (visible to Ustavia's
    // backend/CRM only, never the counterparty); apps/api's public-profile
    // endpoint deliberately doesn't return one either.
    navigation.setOptions({ title: job ? (role === 'mazdoor' ? 'Chat with customer' : 'Chat with Mazdoor') : 'Chat' });
  }, [navigation, job, role]);

  const handleSend = (body: string) => {
    if (!body.trim()) return;
    setDraft('');
    sendMessage.mutate(body.trim());
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.white }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <FlatList
        data={[...messages].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())}
        keyExtractor={(m) => m.id}
        contentContainerStyle={{ padding: spacing.lg, gap: 4, flexGrow: 1 }}
        renderItem={({ item }) => (
          <ChatBubble body={item.body} redacted={item.redacted} isOwnMessage={item.senderId === userId} />
        )}
      />

      <View style={[styles.quickReplyRow, { paddingHorizontal: spacing.lg }]}>
        {QUICK_REPLIES.map((reply) => (
          <Pressable
            key={reply}
            onPress={() => handleSend(reply)}
            style={[styles.chip, { borderColor: colors.border, borderRadius: radii.full }]}
          >
            <Text style={{ color: colors.textSecondary, fontSize: 12 }}>{reply}</Text>
          </Pressable>
        ))}
      </View>

      <View style={[styles.inputRow, { borderColor: colors.border, padding: spacing.md }]}>
        <TextInput
          style={[styles.input, { color: colors.textPrimary }]}
          placeholder="Type a message..."
          placeholderTextColor={colors.textMuted}
          value={draft}
          onChangeText={setDraft}
          onSubmitEditing={() => handleSend(draft)}
        />
        <Pressable
          onPress={() => handleSend(draft)}
          disabled={!draft.trim()}
          style={[
            styles.sendButton,
            { backgroundColor: colors.brandBlue, width: minTouchTarget, height: minTouchTarget, borderRadius: minTouchTarget / 2, opacity: draft.trim() ? 1 : 0.5 },
          ]}
        >
          <SendHorizontal size={18} color={colors.white} />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  quickReplyRow: { flexDirection: 'row', gap: 8, paddingBottom: 8, flexWrap: 'wrap' },
  chip: { borderWidth: 1, paddingHorizontal: 12, paddingVertical: 6 },
  inputRow: { flexDirection: 'row', gap: 8, borderTopWidth: 1, alignItems: 'center' },
  input: { flex: 1, fontSize: 15, paddingVertical: 8 },
  sendButton: { alignItems: 'center', justifyContent: 'center' },
});
