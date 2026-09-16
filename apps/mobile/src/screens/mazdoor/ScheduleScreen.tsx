import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Calendar, CalendarClock, RefreshCw } from 'lucide-react-native';

import { useJobsList } from '../../api/hooks';
import { EmptyState } from '../../components/EmptyState';
import { IconButton } from '../../components/IconButton';
import { JobCard } from '../../components/JobCard';
import type { AppStackParamList } from '../../navigation/types';
import { useTheme } from '../../theme/ThemeProvider';

const ACTIVE_STATUSES = ['negotiating', 'confirmed', 'in_progress'] as const;

export function ScheduleScreen() {
  const { colors, spacing, typography } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  const { data: jobs = [], isLoading, refetch, isRefetching } = useJobsList({ mine: true });

  const myJobs = jobs.filter((job) => ACTIVE_STATUSES.includes(job.status as (typeof ACTIVE_STATUSES)[number]));

  return (
    <View style={[styles.container, { backgroundColor: colors.canvas ?? colors.white }]}>
      <View style={styles.centerWrapper}>
        <View style={[styles.headerRow, { paddingHorizontal: spacing.xl, paddingTop: spacing.xl, paddingBottom: spacing.md }]}>
          <View>
            <Text style={[styles.heading, { color: colors.textPrimary, fontFamily: typography.headingWeights.bold, fontSize: 24 }]}>
              My Schedule
            </Text>
            <Text style={{ color: colors.textSecondary, fontSize: 13, marginTop: 2 }}>
              {myJobs.length} active booking{myJobs.length === 1 ? '' : 's'} in progress
            </Text>
          </View>

          <IconButton
            icon={RefreshCw}
            onPress={() => refetch()}
            variant="filled"
            accessibilityLabel="Refresh schedule"
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
          renderItem={({ item }) => (
            <JobCard
              title={item.description}
              status={item.status}
              price={item.agreedPrice}
              meta="Active job · Tap for detail & completion PIN"
              onPress={() => navigation.navigate('JobDetail', { jobId: item.id })}
            />
          )}
          ListEmptyComponent={
            isLoading ? null : (
              <EmptyState
                icon={CalendarClock}
                title="No scheduled jobs yet"
                description="Jobs you negotiate and accept from customers will show up here in your daily schedule."
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
});
