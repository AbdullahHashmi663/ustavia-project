import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useQueries } from '@tanstack/react-query';
import { MessageCircle, UserRound } from 'lucide-react-native';
import type { ChatMessage } from '@ustavia/shared';

import { listMessages } from '../../api/chat';
import { useJobsList } from '../../api/hooks';
import { EmptyState } from '../../components/EmptyState';
import type { AppStackParamList } from '../../navigation/types';
import { useAuthStore } from '../../store/auth';
import { useTheme } from '../../theme/ThemeProvider';

/**
 * One conversation thread per job with an assigned counterpart, across every
 * status — Worker.pdf §14.1: "Job complete: chat remains open for
 * post-completion communication." Chat isn't gated to negotiating/in_progress
 * for either role; this is the always-reachable inbox both sides get.
 *
 * There's no bulk "last message per job" endpoint, so this fires one
 * `GET /jobs/:id/chat` per thread via `useQueries` — fine at MVP scale
 * (a handful of jobs per user), worth revisiting with a real inbox
 * endpoint if that ever stops being true.
 */
export function MessagesScreen() {
  const { colors, radii, spacing, shadows, typography } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  const role = useAuthStore((state) => state.role);
  const { data: jobs = [] } = useJobsList({ mine: true });

  const myJobs = jobs.filter((job) => job.mazdoorId != null);

  const messageQueries = useQueries({
    queries: myJobs.map((job) => ({
      queryKey: ['chat', job.id],
      queryFn: () => listMessages(job.id),
      staleTime: 10_000,
    })),
  });

  const threads = myJobs
    .map((job, index) => {
      const messages: ChatMessage[] = messageQueries[index]?.data ?? [];
      const lastMessage = [...messages].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0] ?? null;
      return {
        job,
        lastMessage,
        sortKey: lastMessage ? new Date(lastMessage.createdAt).getTime() : new Date(job.createdAt).getTime(),
      };
    })
    .sort((a, b) => b.sortKey - a.sortKey);

  return (
    <View style={[styles.container, { backgroundColor: colors.white, padding: spacing.xl }]}>
      <Text style={[styles.heading, { color: colors.textPrimary, fontFamily: typography.headingWeights.bold, fontSize: typography.size.xl }]}>
        Messages
      </Text>
      <FlatList
        data={threads}
        keyExtractor={(t) => t.job.id}
        contentContainerStyle={{ gap: spacing.sm, marginTop: spacing.lg, flexGrow: 1 }}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => navigation.navigate('Chat', { jobId: item.job.id })}
            style={[
              styles.row,
              { backgroundColor: colors.white, borderColor: colors.border, borderRadius: radii.md, padding: spacing.md },
              shadows.sm,
            ]}
          >
            <View style={[styles.avatar, { backgroundColor: colors.surface, borderRadius: radii.full }]}>
              <UserRound size={20} color={colors.textMuted} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: colors.textPrimary, fontFamily: typography.headingWeights.semibold, fontSize: typography.size.base }}>
                {role === 'mazdoor' ? 'Customer' : 'Mazdoor'}
              </Text>
              <Text style={{ color: colors.textMuted, fontSize: typography.size.xs, marginTop: 1 }} numberOfLines={1}>
                {item.job.description}
              </Text>
              <Text
                numberOfLines={1}
                style={{
                  color: item.lastMessage ? colors.textSecondary : colors.textMuted,
                  fontSize: typography.size.sm,
                  marginTop: 4,
                  fontStyle: item.lastMessage ? 'normal' : 'italic',
                }}
              >
                {item.lastMessage ? item.lastMessage.body : 'No messages yet — say hello'}
              </Text>
            </View>
          </Pressable>
        )}
        ListEmptyComponent={
          <EmptyState
            icon={MessageCircle}
            title="No conversations yet"
            description={
              role === 'mazdoor'
                ? 'Once you start negotiating a job, the chat shows up here.'
                : 'Once a Mazdoor picks up your job, the chat shows up here.'
            }
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  heading: {},
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 1 },
  avatar: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
});
