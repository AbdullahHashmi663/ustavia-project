import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Briefcase, RefreshCw } from 'lucide-react-native';

import { EmptyState } from '../../components/EmptyState';
import { IconButton } from '../../components/IconButton';
import { JobCard } from '../../components/JobCard';
import type { AppStackParamList } from '../../navigation/types';
import { useAuthStore } from '../../store/auth';
import { useJobsStore } from '../../store/jobs';
import { useTheme } from '../../theme/ThemeProvider';
import { estimateDistanceKm } from '../../utils/geo';

export function DashboardScreen() {
  const { colors, spacing, typography } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  const userId = useAuthStore((state) => state.userId);
  const jobs = useJobsStore((state) => state.jobs);
  const mazdoors = useJobsStore((state) => state.mazdoors);
  const startNegotiation = useJobsStore((state) => state.startNegotiation);

  const me = mazdoors.find((m) => m.id === userId);
  const postedJobs = jobs.filter((job) => job.status === 'posted');

  const handleOpen = (jobId: string) => {
    const job = postedJobs.find((j) => j.id === jobId);
    if (job && userId) startNegotiation(jobId, userId);
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
        <IconButton icon={RefreshCw} onPress={() => {}} variant="filled" accessibilityLabel="Refresh job list" />
      </View>

      <FlatList
        data={postedJobs}
        keyExtractor={(job) => job.id}
        contentContainerStyle={{ gap: spacing.md, marginTop: spacing.lg, flexGrow: 1 }}
        renderItem={({ item }) => {
          const distance = me ? estimateDistanceKm(me.workshopLocation ?? item.location, item.location) : 0;
          return (
            <JobCard
              title={item.description}
              meta={`~${distance.toFixed(1)} km away`}
              onPress={() => handleOpen(item.id)}
            />
          );
        }}
        ListEmptyComponent={
          <EmptyState
            icon={Briefcase}
            title="No jobs posted nearby"
            description="New jobs from customers in your area will show up here as soon as they're posted."
          />
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
