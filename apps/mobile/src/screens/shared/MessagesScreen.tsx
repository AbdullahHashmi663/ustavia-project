import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useQueries } from '@tanstack/react-query';
import { ChevronRight, MessageCircle, UserRound } from 'lucide-react-native';
import type { ChatMessage } from '@ustavia/shared';

import { listMessages } from '../../api/chat';
import { useJobsList } from '../../api/hooks';
import { EmptyState } from '../../components/EmptyState';
import type { AppStackParamList } from '../../navigation/types';
import { useAuthStore } from '../../store/auth';
import { useTheme } from '../../theme/ThemeProvider';

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
    <View style={[styles.container, { backgroundColor: colors.canvas ?? colors.white }]}>
      <View style={styles.centerWrapper}>
        <View style={[styles.headerRow, { paddingHorizontal: spacing.xl, paddingTop: spacing.xl, paddingBottom: spacing.md }]}>
          <Text style={[styles.heading, { color: colors.textPrimary, fontFamily: typography.headingWeights.bold, fontSize: 24 }]}>
            Messages
          </Text>
          <Text style={{ color: colors.textSecondary, fontSize: 13, marginTop: 2 }}>
            {threads.length} active discussion{threads.length === 1 ? '' : 's'}
          </Text>
        </View>

        <FlatList
          data={threads}
          keyExtractor={(t) => t.job.id}
          contentContainerStyle={{
            gap: spacing.sm,
            paddingHorizontal: spacing.xl,
            paddingTop: spacing.xs,
            paddingBottom: spacing.xxl,
            flexGrow: 1,
          }}
          renderItem={({ item }) => {
            const roleAccent = role === 'mazdoor' ? colors.brandBlue : colors.brandOrange;
            return (
              <Pressable
                onPress={() => navigation.navigate('Chat', { jobId: item.job.id })}
                style={({ pressed }) => [
                  styles.threadCard,
                  {
                    backgroundColor: colors.white,
                    borderColor: pressed ? roleAccent : colors.borderSubtle,
                    borderRadius: radii.lg,
                    padding: spacing.md + 2,
                    transform: [{ scale: pressed ? 0.99 : 1 }],
                  },
                  shadows.sm,
                ]}
              >
                <View
                  style={[
                    styles.avatar,
                    {
                      backgroundColor: role === 'mazdoor' ? colors.brandBlueLight : colors.brandOrangeLight,
                      borderRadius: radii.full,
                    },
                  ]}
                >
                  <UserRound size={22} color={roleAccent} strokeWidth={2} />
                </View>

                <View style={{ flex: 1, gap: 2 }}>
                  <View style={styles.titleRow}>
                    <Text style={{ color: colors.textPrimary, fontFamily: typography.headingWeights.bold, fontSize: typography.size.base }}>
                      {role === 'mazdoor' ? 'Customer' : 'Assigned Mazdoor'}
                    </Text>
                    {item.lastMessage && (
                      <Text style={{ color: colors.textMuted, fontSize: 11 }}>
                        {new Date(item.lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </Text>
                    )}
                  </View>

                  <Text style={{ color: colors.textMuted, fontSize: typography.size.xs }} numberOfLines={1}>
                    Job: {item.job.description}
                  </Text>

                  <Text
                    numberOfLines={1}
                    style={{
                      color: item.lastMessage ? colors.textSecondary : colors.textMuted,
                      fontSize: 13,
                      marginTop: 2,
                      fontStyle: item.lastMessage ? 'normal' : 'italic',
                    }}
                  >
                    {item.lastMessage ? item.lastMessage.body : 'No messages yet — tap to start chat'}
                  </Text>
                </View>

                <ChevronRight size={18} color={colors.textMuted} />
              </Pressable>
            );
          }}
          ListEmptyComponent={
            <EmptyState
              icon={MessageCircle}
              title="No messages yet"
              description={
                role === 'mazdoor'
                  ? 'Open jobs you claim will show your direct chat with customers here.'
                  : 'Chat will appear here once you connect with a Mazdoor on a posted job.'
              }
            />
          }
        />
      </View>
    </View>
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
  headerRow: {},
  heading: {},
  threadCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
  },
  avatar: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
