import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { DEFAULT_WARRANTY_WINDOW_DAYS } from '@ustavia/shared';
import { History, RefreshCw, ShieldCheck } from 'lucide-react-native';

import { useJobsList } from '../../api/hooks';
import { EmptyState } from '../../components/EmptyState';
import { IconButton } from '../../components/IconButton';
import { JobCard } from '../../components/JobCard';
import type { AppStackParamList } from '../../navigation/types';
import { useTheme } from '../../theme/ThemeProvider';

const DONE_STATUSES = ['completed', 'paid', 'disputed'] as const;

function warrantyDaysLeft(completedAt: Date | null): number | null {
  if (!completedAt) return null;
  const elapsedDays = (Date.now() - new Date(completedAt).getTime()) / (1000 * 60 * 60 * 24);
  const remaining = Math.ceil(DEFAULT_WARRANTY_WINDOW_DAYS - elapsedDays);
  return remaining > 0 ? remaining : null;
}

export function HistoryScreen() {
  const { colors, radii, spacing, typography } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  const { data: jobs = [], isLoading, refetch, isRefetching } = useJobsList({ mine: true });

  const myJobs = jobs.filter((job) => DONE_STATUSES.includes(job.status as (typeof DONE_STATUSES)[number]));

  return (
    <View style={[styles.container, { backgroundColor: colors.canvas ?? colors.white }]}>
      <View style={styles.centerWrapper}>
        <View style={[styles.headerRow, { paddingHorizontal: spacing.xl, paddingTop: spacing.xl, paddingBottom: spacing.md }]}>
          <View>
            <Text style={[styles.heading, { color: colors.textPrimary, fontFamily: typography.headingWeights.bold, fontSize: 24 }]}>
              Past History
            </Text>
            <Text style={{ color: colors.textSecondary, fontSize: 13, marginTop: 2 }}>
              {myJobs.length} completed & archived job{myJobs.length === 1 ? '' : 's'}
            </Text>
          </View>

          <IconButton
            icon={RefreshCw}
            onPress={() => refetch()}
            variant="filled"
            accessibilityLabel="Refresh history"
          />
        </View>

        <FlatList
          data={myJobs}
          keyExtractor={(job) => job.id}
          refreshing={isRefetching}
          onRefresh={refetch}
          contentContainerStyle={{
            gap: spacing.md,
            paddingHorizontal: spacing.xl,
            paddingTop: spacing.sm,
            paddingBottom: spacing.xxl,
            flexGrow: 1,
          }}
          renderItem={({ item }) => {
            const daysLeft = item.status === 'paid' ? warrantyDaysLeft(item.completedAt) : null;
            return (
              <View style={{ gap: 6 }}>
                <JobCard
                  title={item.description}
                  status={item.status}
                  price={item.agreedPrice}
                  onPress={() => navigation.navigate('JobDetail', { jobId: item.id })}
                />
                {daysLeft != null && (
                  <View
                    style={[
                      styles.warrantyRow,
                      {
                        backgroundColor: colors.successLight,
                        borderRadius: radii.md,
                        paddingHorizontal: spacing.md,
                        paddingVertical: spacing.xs + 2,
                      },
                    ]}
                  >
                    <ShieldCheck size={16} color={colors.success} />
                    <Text style={{ color: '#047857', fontSize: typography.size.xs, fontFamily: typography.headingWeights.semibold }}>
                      Active Warranty: {daysLeft} day{daysLeft === 1 ? '' : 's'} remaining
                    </Text>
                  </View>
                )}
              </View>
            );
          }}
          ListEmptyComponent={
            isLoading ? null : (
              <EmptyState
                icon={History}
                title="No completed jobs yet"
                description="Once your jobs are completed, receipts and warranty records will be archived here."
                actionLabel="Refresh"
                onAction={() => refetch()}
              />
            )
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  heading: {},
  warrantyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});
