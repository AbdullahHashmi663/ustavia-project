import { useEffect, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import { SendHorizontal } from 'lucide-react-native';

import { ChatBubble } from '../../components/ChatBubble';
import type { AppStackParamList } from '../../navigation/types';
import { useAuthStore } from '../../store/auth';
import { useJobsStore } from '../../store/jobs';
import { useTheme } from '../../theme/ThemeProvider';

type Props = NativeStackScreenProps<AppStackParamList, 'Chat'>;

const QUICK_REPLIES = ['On my way', "I'm at the gate", 'Running late'];

/** Realtime messaging via Socket.IO comes later; this mocks the client-side view of server-side redaction — ARCHITECTURE.md §3, §7. */
export function ChatScreen({ route }: Props) {
  const { jobId } = route.params;
  const { colors, radii, spacing, minTouchTarget } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  const role = useAuthStore((state) => state.role);
  const userId = useAuthStore((state) => state.userId);
  const job = useJobsStore((state) => state.jobs.find((j) => j.id === jobId));
  const mazdoors = useJobsStore((state) => state.mazdoors);
  const customers = useJobsStore((state) => state.customers);
  // Select the raw array (a stable reference) and filter in the component body — filtering
  // *inside* the selector returns a new array every render, which trips React's
  // useSyncExternalStore infinite-loop guard ("getSnapshot should be cached").
  const chatMessages = useJobsStore((state) => state.chatMessages);
  const messages = chatMessages.filter((m) => m.jobId === jobId);
  const sendChatMessage = useJobsStore((state) => state.sendChatMessage);
  const [draft, setDraft] = useState('');

  const counterpart =
    role === 'mazdoor'
      ? customers.find((c) => c.id === job?.customerId)
      : mazdoors.find((m) => m.id === job?.mazdoorId);

  useEffect(() => {
    navigation.setOptions({ title: counterpart?.phone ?? 'Chat' });
  }, [navigation, counterpart?.phone]);

  const handleSend = (body: string) => {
    if (!body.trim() || !userId) return;
    sendChatMessage(jobId, userId, body.trim());
    setDraft('');
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
