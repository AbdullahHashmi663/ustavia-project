import { useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  AlertTriangle,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  Filter,
  MapPin,
  RotateCcw,
  XCircle,
} from 'lucide-react-native';

import { useJobsList } from '../../api/hooks';
import type { ApiJob } from '../../api/jobs';
import { EmptyState } from '../../components/EmptyState';
import { StatusBadge } from '../../components/StatusBadge';
import type { AppStackParamList } from '../../navigation/types';
import { useTheme } from '../../theme/ThemeProvider';

type FilterTab = 'active' | 'completed' | 'cancelled';

export function CustomerBookingsScreen() {
  const { colors, radii, spacing, typography, shadows } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  const [activeTab, setActiveTab] = useState<FilterTab>('active');

  const { data: jobs = [], refetch } = useJobsList({ mine: true });

  // Filter jobs based on the selected tab
  const filteredJobs = (jobs ?? []).filter((job: ApiJob) => {
    if (activeTab === 'active') {
      return (
        job.status === 'posted' ||
        job.status === 'negotiating' ||
        job.status === 'confirmed' ||
        job.status === 'in_progress'
      );
    }
    if (activeTab === 'completed') {
      return job.status === 'completed' || job.status === 'paid';
    }
    if (activeTab === 'cancelled') {
      return job.status === 'disputed';
    }
    return true;
  });

  return (
    <View style={[styles.container, { backgroundColor: colors.canvas ?? colors.white }]}>
      {/* Top Bar */}
      <View
        style={[
          styles.topBar,
          {
            backgroundColor: colors.white,
            borderBottomColor: colors.borderSubtle,
            paddingHorizontal: spacing.lg,
            paddingTop: spacing.xl,
            paddingBottom: spacing.md,
          },
          shadows.sm,
        ]}
      >
        <Text
          style={[
            styles.title,
            { color: colors.textPrimary, fontFamily: typography.headingWeights.bold },
          ]}
        >
          My Bookings
        </Text>
        <Pressable
          style={[styles.filterButton, { backgroundColor: colors.surfaceSubtle, borderRadius: radii.full }]}
          onPress={() => refetch()}
          accessibilityLabel="Refresh bookings"
        >
          <Filter size={18} color={colors.textPrimary} />
        </Pressable>
      </View>

      {/* Tabs Row (§12.1: Active, Completed, Cancelled) */}
      <View style={[styles.tabsRow, { backgroundColor: colors.white, paddingHorizontal: spacing.lg }]}>
        {(['active', 'completed', 'cancelled'] as const).map((tab) => {
          const isSelected = activeTab === tab;
          const label = tab === 'active' ? 'Active' : tab === 'completed' ? 'Completed' : 'Cancelled';
          return (
            <Pressable
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={[
                styles.tabButton,
                isSelected && {
                  borderBottomColor: colors.brandBlue,
                  borderBottomWidth: 2.5,
                },
              ]}
            >
              <Text
                style={[
                  styles.tabText,
                  {
                    color: isSelected ? colors.brandBlue : colors.textMuted,
                    fontFamily: isSelected ? typography.headingWeights.bold : typography.headingWeights.semibold,
                  },
                ]}
              >
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Bookings List */}
      <ScrollView
        contentContainerStyle={{ padding: spacing.lg, paddingBottom: 80 }}
        showsVerticalScrollIndicator={false}
      >
        {filteredJobs.length === 0 ? (
          <EmptyState
            icon={Calendar}
            title={
              activeTab === 'active'
                ? 'No active bookings'
                : activeTab === 'completed'
                ? 'No completed bookings yet'
                : 'No cancelled bookings'
            }
            description={
              activeTab === 'active'
                ? 'Need something fixed around your home or office? Post a job now to get quotes from verified workers.'
                : 'Your booking history will appear here once jobs are concluded.'
            }
            actionLabel={activeTab === 'active' ? 'Post a Job' : undefined}
            onAction={activeTab === 'active' ? () => (navigation as any).navigate('Tabs', { screen: 'PostJob' }) : undefined}
          />
        ) : (
          filteredJobs.map((job: ApiJob) => (
            <Pressable
              key={job.id}
              onPress={() => navigation.navigate('JobDetail', { jobId: job.id })}
              style={({ pressed }) => [
                styles.bookingCard,
                {
                  backgroundColor: colors.white,
                  borderColor: colors.borderSubtle,
                  borderRadius: radii.xl,
                  padding: spacing.md,
                  marginBottom: spacing.md,
                  opacity: pressed ? 0.9 : 1,
                },
                shadows.sm,
              ]}
            >
              <View style={styles.cardHeader}>
                <View style={styles.serviceRow}>
                  <View
                    style={[
                      styles.serviceBadge,
                      { backgroundColor: 'rgba(0, 97, 153, 0.1)', borderRadius: radii.full },
                    ]}
                  >
                    <Clock size={14} color={colors.brandBlue} />
                  </View>
                  <Text
                    style={[
                      styles.serviceTitle,
                      { color: colors.textPrimary, fontFamily: typography.headingWeights.bold },
                    ]}
                    numberOfLines={1}
                  >
                    {job.description}
                  </Text>
                </View>
                <StatusBadge status={job.status} />
              </View>

              {/* Date & Location */}
              <View style={styles.metaRow}>
                <View style={styles.metaItem}>
                  <Calendar size={13} color={colors.textMuted} />
                  <Text style={[styles.metaText, { color: colors.textSecondary }]}>
                    {new Date(job.createdAt).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </Text>
                </View>

                <View style={styles.metaItem}>
                  <MapPin size={13} color={colors.textMuted} />
                  <Text style={[styles.metaText, { color: colors.textSecondary }]}>
                    Lahore, Pakistan
                  </Text>
                </View>
              </View>

              {/* Price & Action Row */}
              <View style={[styles.cardFooter, { borderTopColor: colors.borderSubtle, borderTopWidth: 1, paddingTop: 10, marginTop: 10 }]}>
                <View>
                  <Text style={{ color: colors.textMuted, fontSize: 11 }}>Estimated Total</Text>
                  <Text
                    style={[
                      styles.priceText,
                      { color: colors.textPrimary, fontFamily: typography.headingWeights.bold },
                    ]}
                  >
                    {job.agreedPrice ? `Rs. ${job.agreedPrice.toLocaleString()}` : 'Negotiating'}
                  </Text>
                </View>

                <View style={styles.actionLinkRow}>
                  <Text style={[styles.viewDetailsText, { color: colors.brandBlue, fontFamily: typography.headingWeights.semibold }]}>
                    View Details
                  </Text>
                  <ChevronRight size={16} color={colors.brandBlue} />
                </View>
              </View>
            </Pressable>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 20,
  },
  filterButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabsRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabText: {
    fontSize: 13,
  },
  bookingCard: {
    borderWidth: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    gap: 8,
  },
  serviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  serviceBadge: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  serviceTitle: {
    fontSize: 14,
    flex: 1,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginVertical: 4,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  metaText: {
    fontSize: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceText: {
    fontSize: 15,
  },
  actionLinkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  viewDetailsText: {
    fontSize: 13,
  },
});
