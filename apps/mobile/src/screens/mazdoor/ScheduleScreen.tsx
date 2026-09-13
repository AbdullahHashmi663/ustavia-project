import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CalendarClock } from 'lucide-react-native';

import { EmptyState } from '../../components/EmptyState';
import { JobCard } from '../../components/JobCard';
import type { AppStackParamList } from '../../navigation/types';
import { useAuthStore } from '../../store/auth';
import { useJobsStore } from '../../store/jobs';
import { useTheme } from '../../theme/ThemeProvider';

const ACTIVE_STATUSES = ['negotiating', 'confirmed', 'in_progress'] as const;

export function ScheduleScreen() {
  const { colors, spacing, typography } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  const userId = useAuthStore((state) => state.userId);
  const jobs = useJobsStore((state) => state.jobs);

  const myJobs = jobs.filter((job) => job.mazdoorId === userId && ACTIVE_STATUSES.includes(job.status as (typeof ACTIVE_STATUSES)[number]));

  return (
    <View style={[styles.container, { backgroundColor: colors.white, padding: spacing.xl }]}>
      <Text style={[styles.heading, { color: colors.textPrimary, fontFamily: typography.headingWeights.bold, fontSize: typography.size.xl }]}>
        Schedule
      </Text>
      <FlatList
        data={myJobs}
        keyExtractor={(job) => job.id}
        contentContainerStyle={{ gap: spacing.md, marginTop: spacing.lg, flexGrow: 1 }}
        renderItem={({ item }) => (
          <JobCard
            title={item.description}
            status={item.status}
            price={item.agreedPrice}
            onPress={() => navigation.navigate('JobDetail', { jobId: item.id })}
          />
        )}
        ListEmptyComponent={
          <EmptyState icon={CalendarClock} title="No active jobs yet" description="Jobs you accept will appear here with their live status." />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  heading: {},
});
