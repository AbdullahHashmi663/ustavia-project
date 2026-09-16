import { useState } from 'react';
import {
  Alert,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  Clock,
  DollarSign,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
} from 'lucide-react-native';

import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import type { AppStackParamList } from '../../navigation/types';
import { useTheme } from '../../theme/ThemeProvider';

interface Bidder {
  id: string;
  workerId: string;
  name: string;
  avatar: string;
  rating: number;
  reviewsCount: number;
  bidPrice: number;
  estimatedArrival: string;
  experienceYears: number;
  isVerified: boolean;
  tier: 'Diamond' | 'Gold' | 'Silver';
}

const MOCK_BIDS: Bidder[] = [
  {
    id: 'bid-1',
    workerId: 'w-101',
    name: 'Muhammad Tariq',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    rating: 4.95,
    reviewsCount: 184,
    bidPrice: 1200,
    estimatedArrival: 'Arrival in 20 mins',
    experienceYears: 8,
    isVerified: true,
    tier: 'Diamond',
  },
  {
    id: 'bid-2',
    workerId: 'w-102',
    name: 'Rashid Ali',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    rating: 4.82,
    reviewsCount: 96,
    bidPrice: 950,
    estimatedArrival: 'Arrival in 45 mins',
    experienceYears: 5,
    isVerified: true,
    tier: 'Gold',
  },
  {
    id: 'bid-3',
    workerId: 'w-103',
    name: 'Imran Shah',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    rating: 4.7,
    reviewsCount: 42,
    bidPrice: 800,
    estimatedArrival: 'Arrival in 30 mins',
    experienceYears: 4,
    isVerified: true,
    tier: 'Silver',
  },
];

type SortFilter = 'lowest_price' | 'highest_rated' | 'fastest';

export function BidComparisonScreen() {
  const { colors, radii, spacing, typography, shadows } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  const route = useRoute<any>();

  const jobId = route.params?.jobId || 'job-mock-1';
  const jobTitle = route.params?.jobTitle || 'AC Water Leaking & Gas Top-up';

  const [activeSort, setActiveSort] = useState<SortFilter>('lowest_price');
  const [selectedBid, setSelectedBid] = useState<Bidder | null>(null);
  const [acceptedBidId, setAcceptedBidId] = useState<string | null>(null);

  // Sorting logic
  const sortedBids = [...MOCK_BIDS].sort((a, b) => {
    if (activeSort === 'lowest_price') return a.bidPrice - b.bidPrice;
    if (activeSort === 'highest_rated') return b.rating - a.rating;
    if (activeSort === 'fastest') return a.estimatedArrival.localeCompare(b.estimatedArrival);
    return 0;
  });

  const handleConfirmAccept = () => {
    if (!selectedBid) return;
    setAcceptedBidId(selectedBid.id);
    const chosen = selectedBid;
    setSelectedBid(null);

    // Proceed to Escrow / Payment Method
    navigation.navigate('PaymentMethod', { jobId });
  };

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
        <Pressable
          onPress={() => navigation.goBack()}
          style={[styles.backBtn, { backgroundColor: colors.surfaceSubtle, borderRadius: radii.full }]}
          accessibilityLabel="Go back"
        >
          <ArrowLeft size={18} color={colors.textPrimary} />
        </Pressable>
        <View style={{ flex: 1, marginHorizontal: 12 }}>
          <Text style={[styles.headerSubtitle, { color: colors.textMuted }]}>
            Bid Comparison Dashboard
          </Text>
          <Text
            style={[
              styles.headerTitle,
              { color: colors.textPrimary, fontFamily: typography.headingWeights.bold },
            ]}
            numberOfLines={1}
          >
            {jobTitle}
          </Text>
        </View>
        <View
          style={[
            styles.bidsCountBadge,
            { backgroundColor: 'rgba(0, 97, 153, 0.1)', borderRadius: radii.full },
          ]}
        >
          <Users size={12} color={colors.brandBlue} />
          <Text style={{ color: colors.brandBlue, fontSize: 11, fontWeight: '700' }}>
            {MOCK_BIDS.length} Bids
          </Text>
        </View>
      </View>

      {/* Sort / Filter Chips (§7.4.3: Lowest Price, Highest Rated, Fastest) */}
      <View style={[styles.sortRow, { backgroundColor: colors.white, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm }]}>
        <Text style={[styles.sortLabel, { color: colors.textMuted }]}>Sort by:</Text>
        {(['lowest_price', 'highest_rated', 'fastest'] as const).map((filter) => {
          const isSelected = activeSort === filter;
          const label =
            filter === 'lowest_price'
              ? 'Lowest Price'
              : filter === 'highest_rated'
              ? 'Highest Rated ★'
              : 'Fastest ETA';
          return (
            <Pressable
              key={filter}
              onPress={() => setActiveSort(filter)}
              style={[
                styles.filterChip,
                {
                  backgroundColor: isSelected ? colors.brandBlue : colors.surfaceSubtle,
                  borderRadius: radii.full,
                },
              ]}
            >
              <Text
                style={{
                  color: isSelected ? colors.white : colors.textPrimary,
                  fontSize: 11.5,
                  fontWeight: '700',
                }}
              >
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Bidders Cards List */}
      <ScrollView
        contentContainerStyle={{ padding: spacing.lg, paddingBottom: 60 }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={{ color: colors.textSecondary, fontSize: 13, marginBottom: spacing.md }}>
          Workers have reviewed your job scope and submitted their competitive quotes.
        </Text>

        {sortedBids.map((bidder) => {
          const isJobFilled = acceptedBidId !== null && acceptedBidId !== bidder.id;
          const isWinner = acceptedBidId === bidder.id;

          return (
            <Card
              key={bidder.id}
              variant="raised"
              style={{
                marginBottom: spacing.md,
                opacity: isJobFilled ? 0.45 : 1,
                borderColor: isWinner ? colors.success : colors.borderSubtle,
              }}
            >
              <View style={styles.bidderCardTop}>
                <Image source={{ uri: bidder.avatar }} style={styles.bidderAvatar} />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <View style={styles.nameRow}>
                    <Text
                      style={[
                        styles.bidderName,
                        { color: colors.textPrimary, fontFamily: typography.headingWeights.bold },
                      ]}
                    >
                      {bidder.name}
                    </Text>
                    {bidder.isVerified && <ShieldCheck size={16} color={colors.brandBlue} />}
                  </View>

                  <View style={styles.ratingRow}>
                    <Star size={13} color="#F59E0B" fill="#F59E0B" />
                    <Text style={{ color: colors.textPrimary, fontSize: 12, fontWeight: '700' }}>
                      {bidder.rating}
                    </Text>
                    <Text style={{ color: colors.textMuted, fontSize: 11 }}>
                      ({bidder.reviewsCount} jobs)
                    </Text>
                    <Text style={{ color: colors.textMuted, fontSize: 11 }}>• {bidder.tier} Tier</Text>
                  </View>

                  <View style={styles.etaRow}>
                    <Clock size={12} color={colors.brandOrange} />
                    <Text style={{ color: colors.brandOrange, fontSize: 11.5, fontWeight: '600' }}>
                      {bidder.estimatedArrival}
                    </Text>
                  </View>
                </View>

                {/* Price Display */}
                <View style={styles.priceContainer}>
                  <Text
                    style={[
                      styles.priceText,
                      { color: colors.brandBlue, fontFamily: typography.headingWeights.bold },
                    ]}
                  >
                    Rs. {bidder.bidPrice.toLocaleString()}
                  </Text>
                  <Text style={{ color: colors.textMuted, fontSize: 10, textAlign: 'right' }}>
                    Fixed Quote
                  </Text>
                </View>
              </View>

              {/* Action Buttons Row */}
              <View style={[styles.cardActionRow, { borderTopColor: colors.borderSubtle, borderTopWidth: 1, paddingTop: 10, marginTop: 10 }]}>
                <Pressable
                  onPress={() => Alert.alert(bidder.name, `${bidder.experienceYears} years experience. Verified background.`)}
                >
                  <Text style={[styles.profileLink, { color: colors.brandBlue, fontFamily: typography.headingWeights.semibold }]}>
                    View Profile & Reviews →
                  </Text>
                </Pressable>

                <Button
                  label={isWinner ? 'Bid Accepted ✓' : isJobFilled ? 'Job Filled' : 'Accept Bid'}
                  variant={isWinner ? 'primary' : 'trust'}
                  size="md"
                  disabled={isJobFilled || isWinner}
                  onPress={() => setSelectedBid(bidder)}
                />
              </View>
            </Card>
          );
        })}
      </ScrollView>

      {/* Confirmation Modal (§7.4.3 Interaction) */}
      <Modal
        visible={!!selectedBid}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedBid(null)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalDialog,
              {
                backgroundColor: colors.white,
                borderRadius: radii.xl,
                padding: spacing.xl,
              },
              shadows.lg,
            ]}
          >
            <View
              style={[
                styles.modalIconCircle,
                { backgroundColor: 'rgba(0, 97, 153, 0.1)', borderRadius: radii.full },
              ]}
            >
              <Sparkles size={28} color={colors.brandBlue} />
            </View>

            <Text
              style={[
                styles.modalTitle,
                { color: colors.textPrimary, fontFamily: typography.headingWeights.bold },
              ]}
            >
              Accept {selectedBid?.name}'s Bid?
            </Text>

            <Text style={{ color: colors.textSecondary, fontSize: 13, textAlign: 'center', marginVertical: 12, lineHeight: 18 }}>
              You are accepting a fixed quote of{' '}
              <Text style={{ fontWeight: '800', color: colors.brandBlue }}>
                Rs. {selectedBid?.bidPrice.toLocaleString()}
              </Text>
              . Funds will be placed in secure escrow and only released once you confirm completion.
            </Text>

            <View style={{ flexDirection: 'row', gap: 12, marginTop: 8 }}>
              <View style={{ flex: 1 }}>
                <Button
                  label="Cancel"
                  variant="outline"
                  onPress={() => setSelectedBid(null)}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Button
                  label="Confirm & Hire"
                  variant="trust"
                  onPress={handleConfirmAccept}
                />
              </View>
            </View>
          </View>
        </View>
      </Modal>
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
  backBtn: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerSubtitle: {
    fontSize: 11,
  },
  headerTitle: {
    fontSize: 15,
  },
  bidsCountBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  sortRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  sortLabel: {
    fontSize: 12,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  bidderCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bidderAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  bidderName: {
    fontSize: 14.5,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  etaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  priceText: {
    fontSize: 17,
  },
  cardActionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  profileLink: {
    fontSize: 12.5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalDialog: {
    width: '100%',
    maxWidth: 380,
    alignItems: 'center',
  },
  modalIconCircle: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 18,
    textAlign: 'center',
  },
});
