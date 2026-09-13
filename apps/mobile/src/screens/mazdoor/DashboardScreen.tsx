import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Briefcase, RefreshCw } from 'lucide-react-native';

import { useJobsList, useNegotiateJob } from '../../api/hooks';
import { EmptyState } from '../../components/EmptyState';
import { IconButton } from '../../components/IconButton';
import { JobCard } from '../../components/JobCard';
import type { AppStackParamList } from '../../navigation/types';
import { useTheme } from '../../theme/ThemeProvider';

export function DashboardScreen() {
  const { colors, spacing, typography } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  const { data: postedJobs = [], isLoading, refetch, isRefetching } = useJobsList({ status: 'posted' });
  const negotiate = useNegotiateJob();

  const handleOpen = async (jobId: string) => {
    // Opening a posted job claims it — apps/api's POST /jobs/:id/negotiate
    // sets mazdoorId to the caller and moves it to "negotiating", same as
    // the mock store did. Awaited so JobDetailScreen never fetches a job
    // that's still mid-transition.
    try {
      await negotiate.mutateAsync(jobId);
    } catch {
      // Someone else may have already claimed it between the list load and
      // this tap — fall through to JobDetail regardless, it'll show the
      // job's real current state.
    }
    navigation.navigate('JobDetail', { jobId });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.white, padding: spacing.xl }]}>
      <View style={styles.headerRow}>
        <View>
          <Text style={[styles.heading, { color: colors.textPrimary, fontFamily: typography.headingWeights.bold, fontSize: typography.size.xl }]}>
            Available jobs
          </Text>
          <Text style={{ color: colors.textSecondary, marginTop: 2 }}>
            {postedJobs.length} job{postedJobs.length === 1 ? '' : 's'} nearby
          </Text>
        </View>
        <IconButton
          icon={RefreshCw}
          onPress={() => refetch()}
          variant="filled"
          accessibilityLabel="Refresh job list"
        />
      </View>

      <FlatList
        data={postedJobs}
        keyExtractor={(job) => job.id}
        refreshing={isRefetching}
        onRefresh={refetch}
        contentContainerStyle={{ gap: spacing.md, marginTop: spacing.lg, flexGrow: 1 }}
        renderItem={({ item }) => (
          // No "~X km away" here anymore — that needs the Mazdoor's own
          // workshopLocation (GET /users/me, not fetched on this screen)
          // compared against apps/api's near-query distanceKm, neither of
          // which is wired up yet. Area-only visibility (no pinpoint
          // address) still holds — ARCHITECTURE.md §5.
          <JobCard title={item.description} meta="Posted nearby" onPress={() => handleOpen(item.id)} />
        )}
        ListEmptyComponent={
          isLoading ? null : (
            <EmptyState
              icon={Briefcase}
              title="No jobs posted nearby"
              description="New jobs from customers in your area will show up here as soon as they're posted."
            />
          )
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  heading: {},
});
