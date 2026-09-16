import { useState } from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Briefcase, MapPin, Radio, RefreshCw, Sparkles, Zap } from 'lucide-react-native';

import { useJobsList, useNegotiateJob } from '../../api/hooks';
import { EmptyState } from '../../components/EmptyState';
import { IconButton } from '../../components/IconButton';
import { JobCard } from '../../components/JobCard';
import type { AppStackParamList } from '../../navigation/types';
import { useTheme } from '../../theme/ThemeProvider';

const CATEGORIES = ['All', 'Plumbing', 'Electrical', 'Carpentry', 'Painting', 'General'];

export function DashboardScreen() {
  const { colors, radii, spacing, typography, shadows } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  const { data: postedJobs = [], isLoading, refetch, isRefetching } = useJobsList({ status: 'posted' });
  const negotiate = useNegotiateJob();
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredJobs = selectedCategory === 'All'
    ? postedJobs
    : postedJobs.filter((j) => j.description.toLowerCase().includes(selectedCategory.toLowerCase()));

  const handleOpen = async (jobId: string) => {
    try {
      await negotiate.mutateAsync(jobId);
    } catch {
      // Proceed to JobDetail to show current state
    }
    navigation.navigate('JobDetail', { jobId });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.canvas ?? colors.white }]}>
      <View style={styles.centerWrapper}>
        {/* Header Row */}
        <View style={[styles.headerRow, { paddingHorizontal: spacing.xl, paddingTop: spacing.xl, paddingBottom: spacing.md }]}>
          <View>
            <View style={styles.titleWithLive}>
              <Text style={[styles.heading, { color: colors.textPrimary, fontFamily: typography.headingWeights.bold, fontSize: 24 }]}>
                Available Jobs
              </Text>
              <View style={[styles.liveBadge, { backgroundColor: 'rgba(255, 103, 1, 0.12)', borderRadius: radii.full }]}>
                <View style={[styles.radarDot, { backgroundColor: colors.brandOrange }]} />
                <Text style={[styles.liveText, { color: colors.brandOrange, fontFamily: typography.headingWeights.bold }]}>
                  LIVE
                </Text>
              </View>
            </View>
            <Text style={{ color: colors.textSecondary, fontSize: 13, marginTop: 2 }}>
              {postedJobs.length} active lead{postedJobs.length === 1 ? '' : 's'} in your radius
            </Text>
          </View>

          <IconButton
            icon={RefreshCw}
            onPress={() => refetch()}
            variant="filled"
            accessibilityLabel="Refresh job list"
          />
        </View>

        {/* Opportunity Bento Banner */}
        <View style={{ paddingHorizontal: spacing.xl, marginBottom: spacing.md }}>
          <View
            style={[
              styles.bentoCard,
              {
                backgroundColor: colors.white,
                borderColor: colors.borderSubtle,
                borderRadius: radii.lg,
                padding: spacing.lg,
              },
              shadows.sm,
            ]}
          >
            <View style={styles.bentoTopRow}>
              <View style={[styles.zapIconCircle, { backgroundColor: colors.brandOrangeLight, borderRadius: radii.full }]}>
                <Zap size={18} color={colors.brandOrange} />
              </View>
              <Text style={[styles.bentoTitle, { color: colors.textPrimary, fontFamily: typography.headingWeights.bold }]}>
                Fast Claim & Payout
              </Text>
            </View>
            <Text style={[styles.bentoDesc, { color: colors.textSecondary }]}>
              Tap any nearby job to start price negotiation. Payments are held in secure escrow upon customer confirmation.
            </Text>
          </View>
        </View>

        {/* Category Pills Strip */}
        <View style={{ marginBottom: spacing.sm }}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: spacing.xl, gap: 8 }}
          >
            {CATEGORIES.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <Pressable
                  key={cat}
                  onPress={() => setSelectedCategory(cat)}
                  style={[
                    styles.filterChip,
                    {
                      backgroundColor: active ? colors.brandOrange : colors.white,
                      borderColor: active ? colors.brandOrange : colors.border,
                      borderRadius: radii.full,
                      paddingHorizontal: 14,
                      paddingVertical: 7,
                    },
                    active && shadows.sm,
                  ]}
                >
                  <Text
                    style={{
                      color: active ? colors.white : colors.textSecondary,
                      fontSize: 13,
                      fontFamily: active ? typography.headingWeights.bold : typography.headingWeights.semibold,
                    }}
                  >
                    {cat}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* Jobs List */}
        <FlatList
          data={filteredJobs}
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
              meta="📍 Nearby • Tap to claim & quote"
              onPress={() => handleOpen(item.id)}
            />
          )}
          ListEmptyComponent={
            isLoading ? null : (
              <EmptyState
                icon={Briefcase}
                title="No jobs found nearby"
                description={
                  selectedCategory === 'All'
                    ? "New job posts from local customers will show up here live as soon as they're submitted."
                    : `No jobs in the "${selectedCategory}" category right now. Try selecting "All".`
                }
                actionLabel="Refresh Leads"
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
  titleWithLive: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  heading: {},
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  radarDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  liveText: {
    fontSize: 10,
    letterSpacing: 0.8,
  },
  bentoCard: {
    borderWidth: 1,
  },
  bentoTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 6,
  },
  zapIconCircle: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bentoTitle: {
    fontSize: 15,
  },
  bentoDesc: {
    fontSize: 13,
    lineHeight: 18,
  },
  filterChip: {
    borderWidth: 1,
  },
});
