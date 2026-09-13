import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CalendarClock } from 'lucide-react-native';

import { useJobsList } from '../../api/hooks';
import { EmptyState } from '../../components/EmptyState';
import { JobCard } from '../../components/JobCard';
import type { AppStackParamList } from '../../navigation/types';
import { useTheme } from '../../theme/ThemeProvider';

const ACTIVE_STATUSES = ['posted', 'negotiating', 'confirmed', 'in_progress'] as const;

export function ScheduledScreen() {
  const { colors, spacing, typography } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  const { data: jobs = [], isLoading, refetch, isRefetching } = useJobsList({ mine: true });

  const myJobs = jobs.filter((job) => ACTIVE_STATUSES.includes(job.status as (typeof ACTIVE_STATUSES)[number]));

  return (
    <View style={[styles.container, { backgroundColor: colors.white, padding: spacing.xl }]}>
      <Text style={[styles.heading, { color: colors.textPrimary, fontFamily: typography.headingWeights.bold, fontSize: typography.size.xl }]}>
        Scheduled
      </Text>
      <FlatList
        data={myJobs}
        keyExtractor={(job) => job.id}
        refreshing={isRefetching}
        onRefresh={refetch}
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
          isLoading ? null : (
            <EmptyState
              icon={CalendarClock}
              title="No active jobs yet"
              description="Post a job from the Post Job tab and it'll show up here once a Mazdoor picks it up."
            />
          )
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  heading: {},
});
