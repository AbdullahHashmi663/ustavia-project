import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { DEFAULT_WARRANTY_WINDOW_DAYS } from '@ustavia/shared';
import { History, ShieldCheck } from 'lucide-react-native';

import { EmptyState } from '../../components/EmptyState';
import { JobCard } from '../../components/JobCard';
import type { AppStackParamList } from '../../navigation/types';
import { useAuthStore } from '../../store/auth';
import { useJobsStore } from '../../store/jobs';
import { useTheme } from '../../theme/ThemeProvider';

const DONE_STATUSES = ['completed', 'paid', 'disputed'] as const;

/** Days remaining in the flat warranty window, or null if the job isn't paid/completed or the window has passed. */
function warrantyDaysLeft(completedAt: Date | null): number | null {
  if (!completedAt) return null;
  const elapsedDays = (Date.now() - new Date(completedAt).getTime()) / (1000 * 60 * 60 * 24);
  const remaining = Math.ceil(DEFAULT_WARRANTY_WINDOW_DAYS - elapsedDays);
  return remaining > 0 ? remaining : null;
}

export function HistoryScreen() {
  const { colors, radii, spacing, typography } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  const userId = useAuthStore((state) => state.userId);
  const jobs = useJobsStore((state) => state.jobs);

  const myJobs = jobs.filter((job) => job.customerId === userId && DONE_STATUSES.includes(job.status as (typeof DONE_STATUSES)[number]));

  return (
    <View style={[styles.container, { backgroundColor: colors.white, padding: spacing.xl }]}>
      <Text style={[styles.heading, { color: colors.textPrimary, fontFamily: typography.headingWeights.bold, fontSize: typography.size.xl }]}>
        History
      </Text>
      <FlatList
        data={myJobs}
        keyExtractor={(job) => job.id}
        contentContainerStyle={{ gap: spacing.md, marginTop: spacing.lg, flexGrow: 1 }}
        renderItem={({ item }) => {
          const daysLeft = item.status === 'paid' ? warrantyDaysLeft(item.completedAt) : null;
          return (
            <View>
              <JobCard
                title={item.description}
                status={item.status}
                price={item.agreedPrice}
                onPress={() => navigation.navigate('JobDetail', { jobId: item.id })}
              />
              {daysLeft != null && (
                <View style={[styles.warrantyRow, { backgroundColor: colors.successLight, borderRadius: radii.sm, padding: spacing.sm, marginTop: -spacing.xs }]}>
                  <ShieldCheck size={14} color={colors.success} />
                  <Text style={{ color: colors.success, fontSize: typography.size.xs }}>
                    Under warranty — {daysLeft} day{daysLeft === 1 ? '' : 's'} left to report an issue
                  </Text>
                </View>
              )}
            </View>
          );
        }}
        ListEmptyComponent={
          <EmptyState icon={History} title="No past jobs yet" description="Completed and paid jobs will show up here." />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  heading: {},
  warrantyRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
});
