import { useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  Bell,
  ChevronDown,
  Droplets,
  Grid,
  Hammer,
  MapPin,
  Mic,
  Plus,
  Search,
  Sparkles,
  Star,
  Tv,
  Wallet,
  Wind,
  Wrench,
  Zap,
} from 'lucide-react-native';
import Svg, { Circle, Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

import { AddressSwitcherModal, type SavedAddress } from '../../components/AddressSwitcherModal';
import type { AppStackParamList } from '../../navigation/types';
import { useTheme } from '../../theme/ThemeProvider';

const { width: SCREEN_W } = Dimensions.get('window');

// Quick categories with bespoke brand styling
const HOME_CATEGORIES = [
  { id: 'plumbing', name: 'Plumber', icon: Droplets, color: '#006199' },
  { id: 'electrician', name: 'Electrician', icon: Zap, color: '#FF6701' },
  { id: 'ac', name: 'AC Repair', icon: Wind, color: '#0284C7' },
  { id: 'cleaning', name: 'Cleaning', icon: Sparkles, color: '#0D9488' },
  { id: 'painter', name: 'Painter', icon: Wrench, color: '#E11D48' },
  { id: 'carpenter', name: 'Carpenter', icon: Hammer, color: '#8B5A2B' },
  { id: 'appliance', name: 'Appliances', icon: Tv, color: '#7C3AED' },
  { id: 'more', name: 'More', icon: Grid, color: '#0F172A', isMore: true },
];

const PROMO_SLIDES = [
  {
    id: 'promo-1',
    title: 'Pre-Summer AC Service',
    tag: 'FLAT 20% OFF',
    desc: 'Deep chemical wash & gas check by verified technicians',
    colorA: '#006199',
    colorB: '#007BC3',
    cta: 'Book Now',
  },
  {
    id: 'promo-2',
    title: 'Emergency Plumbing Help',
    tag: '15 MIN DISPATCH',
    desc: 'Rapid water leak & pipe burst response in your area',
    colorA: '#FF6701',
    colorB: '#FEA82F',
    cta: 'Hire Plumber',
  },
  {
    id: 'promo-3',
    title: 'Ustavia Guaranteed Safety',
    tag: 'NADRA VERIFIED',
    desc: 'Every worker CNIC-verified with biometric background checks',
    colorA: '#0F172A',
    colorB: '#1E293B',
    cta: 'Learn More',
  },
];

const TOP_WORKERS = [
  {
    id: 'worker-1',
    name: 'Muhammad Tariq',
    category: 'Master Electrician',
    rating: 4.9,
    reviewsCount: 142,
    hourlyRate: 600,
    distance: '1.2 km away',
    availableNow: true,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
  },
  {
    id: 'worker-2',
    name: 'Rashid Ali',
    category: 'Expert Plumber',
    rating: 4.85,
    reviewsCount: 98,
    hourlyRate: 500,
    distance: '2.0 km away',
    availableNow: true,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
  },
  {
    id: 'worker-3',
    name: 'Imran Shah',
    category: 'AC & Inverter Specialist',
    rating: 4.95,
    reviewsCount: 210,
    hourlyRate: 800,
    distance: '2.8 km away',
    availableNow: true,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
  },
];

export function CustomerHomeScreen() {
  const { colors, radii, spacing, typography, shadows } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();

  const [selectedAddress, setSelectedAddress] = useState<SavedAddress>({
    id: 'addr-1',
    label: 'Home',
    address: 'DHA Phase 5, Lahore',
    city: 'Lahore',
  });
  const [addressModalVisible, setAddressModalVisible] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [hasUnreadNotifications] = useState(true);
  const [walletBalance] = useState('Rs. 500');

  // Carousel auto-scroller
  const carouselRef = useRef<ScrollView>(null);
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => {
        const next = (prev + 1) % PROMO_SLIDES.length;
        carouselRef.current?.scrollTo({ x: next * (SCREEN_W - 40), animated: true });
        return next;
      });
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const handleCategoryPress = (category: typeof HOME_CATEGORIES[0]) => {
    if (category.isMore) {
      (navigation as any).navigate('FullCategory');
    } else {
      (navigation as any).navigate('Tabs', { screen: 'PostJob' });
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.canvas ?? colors.white }]}>
      {/* 1. Fixed Top Bar (Location Switcher, Notifications, Wallet) */}
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
        {/* Left: Location Pin & Address */}
        <Pressable
          style={styles.locationSelector}
          onPress={() => setAddressModalVisible(true)}
          accessibilityLabel="Change location"
        >
          <View
            style={[
              styles.locationPinBadge,
              { backgroundColor: 'rgba(0, 97, 153, 0.1)', borderRadius: radii.full },
            ]}
          >
            <MapPin size={16} color={colors.brandBlue} />
          </View>
          <View>
            <Text style={[styles.locationSubhead, { color: colors.textMuted }]}>
              Current Location
            </Text>
            <View style={styles.locationTitleRow}>
              <Text
                style={[
                  styles.locationTitle,
                  { color: colors.textPrimary, fontFamily: typography.headingWeights.bold },
                ]}
                numberOfLines={1}
              >
                {selectedAddress.address}
              </Text>
              <ChevronDown size={14} color={colors.textSecondary} />
            </View>
          </View>
        </Pressable>

        {/* Right: Notifications & Wallet Badge */}
        <View style={styles.topBarRight}>
          <Pressable
            style={[
              styles.walletBadge,
              {
                backgroundColor: 'rgba(255, 103, 1, 0.1)',
                borderColor: 'rgba(255, 103, 1, 0.3)',
                borderRadius: radii.full,
              },
            ]}
            onPress={() => (navigation as any).navigate('Tabs', { screen: 'Wallet' })}
            accessibilityLabel="View wallet balance"
          >
            <Wallet size={14} color={colors.brandOrange} />
            <Text
              style={[
                styles.walletBalanceText,
                { color: colors.brandOrange, fontFamily: typography.headingWeights.bold },
              ]}
            >
              {walletBalance}
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.notificationButton,
              { backgroundColor: colors.surfaceSubtle, borderRadius: radii.full },
            ]}
            onPress={() => (navigation as any).navigate('Tabs', { screen: 'Messages' })}
            accessibilityLabel="Notifications"
          >
            <Bell size={18} color={colors.textPrimary} />
            {hasUnreadNotifications && (
              <View style={[styles.notificationDot, { backgroundColor: colors.danger }]} />
            )}
          </Pressable>
        </View>
      </View>

      {/* Main Scrollable Content */}
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 90 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* 2. Interactive Search Bar with Voice Mic */}
        <View style={{ paddingHorizontal: spacing.lg, marginTop: spacing.md }}>
          <Pressable
            style={[
              styles.searchBar,
              {
                backgroundColor: colors.white,
                borderColor: colors.border,
                borderRadius: radii.full,
                paddingHorizontal: spacing.md,
              },
              shadows.sm,
            ]}
            onPress={() => (navigation as any).navigate('Tabs', { screen: 'PostJob' })}
          >
            <Search size={18} color={colors.brandBlue} />
            <Text style={[styles.searchPlaceholder, { color: colors.textMuted }]}>
              What do you need help with?
            </Text>
            <Pressable
              style={[
                styles.micBadge,
                { backgroundColor: 'rgba(0, 97, 153, 0.08)', borderRadius: radii.full },
              ]}
            >
              <Mic size={15} color={colors.brandBlue} />
            </Pressable>
          </Pressable>
        </View>

        {/* 3. Horizontal Category Row */}
        <View style={{ marginTop: spacing.lg }}>
          <View style={[styles.sectionHeaderRow, { paddingHorizontal: spacing.lg }]}>
            <Text
              style={[
                styles.sectionHeading,
                { color: colors.textPrimary, fontFamily: typography.headingWeights.bold },
              ]}
            >
              Services
            </Text>
            <Pressable onPress={() => (navigation as any).navigate('FullCategory')}>
              <Text
                style={[
                  styles.viewAllLink,
                  { color: colors.brandBlue, fontFamily: typography.headingWeights.semibold },
                ]}
              >
                See All →
              </Text>
            </Pressable>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={[styles.categoryStrip, { paddingHorizontal: spacing.lg }]}
          >
            {HOME_CATEGORIES.map((cat) => {
              const IconComp = cat.icon;
              return (
                <Pressable
                  key={cat.id}
                  onPress={() => handleCategoryPress(cat)}
                  style={({ pressed }) => [
                    styles.categoryTile,
                    { opacity: pressed ? 0.8 : 1 },
                  ]}
                >
                  <View
                    style={[
                      styles.categoryCircle,
                      {
                        backgroundColor: `${cat.color}15`,
                        borderColor: `${cat.color}30`,
                        borderRadius: radii.xl,
                      },
                      shadows.sm,
                    ]}
                  >
                    <IconComp size={24} color={cat.color} strokeWidth={2.2} />
                  </View>
                  <Text
                    style={[
                      styles.categoryLabel,
                      { color: colors.textPrimary, fontFamily: typography.headingWeights.semibold },
                    ]}
                    numberOfLines={1}
                  >
                    {cat.name}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* 4. Promotional Banner Carousel (4s auto-scroll) */}
        <View style={{ marginTop: spacing.xl }}>
          <ScrollView
            ref={carouselRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(e) => {
              const page = Math.round(e.nativeEvent.contentOffset.x / (SCREEN_W - 40));
              setActiveSlide(page);
            }}
            contentContainerStyle={{ paddingHorizontal: spacing.lg, gap: 12 }}
          >
            {PROMO_SLIDES.map((slide) => (
              <View
                key={slide.id}
                style={[
                  styles.promoCard,
                  {
                    width: SCREEN_W - 40,
                    borderRadius: radii.xl,
                  },
                  shadows.md,
                ]}
              >
                <Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>
                  <Defs>
                    <LinearGradient id={`grad-${slide.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                      <Stop offset="0%" stopColor={slide.colorA} />
                      <Stop offset="100%" stopColor={slide.colorB} />
                    </LinearGradient>
                  </Defs>
                  <Rect width="100%" height="100%" fill={`url(#grad-${slide.id})`} rx={radii.xl} />
                </Svg>

                <View style={styles.promoContent}>
                  <View style={[styles.promoTag, { backgroundColor: 'rgba(255, 255, 255, 0.25)', borderRadius: radii.full }]}>
                    <Text style={styles.promoTagText}>{slide.tag}</Text>
                  </View>
                  <Text style={styles.promoTitle}>{slide.title}</Text>
                  <Text style={styles.promoDesc}>{slide.desc}</Text>

                  <Pressable
                    style={[styles.promoButton, { backgroundColor: colors.white, borderRadius: radii.full }]}
                    onPress={() => (navigation as any).navigate('Tabs', { screen: 'PostJob' })}
                  >
                    <Text style={[styles.promoButtonText, { color: slide.colorA }]}>{slide.cta}</Text>
                  </Pressable>
                </View>
              </View>
            ))}
          </ScrollView>

          {/* Dots Indicator */}
          <View style={styles.dotsRow}>
            {PROMO_SLIDES.map((_, i) => (
              <View
                key={i}
                style={[
                  styles.dot,
                  {
                    backgroundColor: i === activeSlide ? colors.brandBlue : colors.border,
                    width: i === activeSlide ? 18 : 6,
                    borderRadius: radii.full,
                  },
                ]}
              />
            ))}
          </View>
        </View>

        {/* 5. "Near You" Mini-Map Preview Card (§4.1 #5) */}
        <View style={{ marginTop: spacing.xl, paddingHorizontal: spacing.lg }}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionHeaderLeft}>
              <MapPin size={16} color={colors.brandOrange} />
              <Text
                style={[
                  styles.sectionHeading,
                  { color: colors.textPrimary, fontFamily: typography.headingWeights.bold },
                ]}
              >
                Workers Near You
              </Text>
            </View>
            <Pressable onPress={() => (navigation as any).navigate('Tabs', { screen: 'PostJob' })}>
              <Text
                style={[
                  styles.viewAllLink,
                  { color: colors.brandBlue, fontFamily: typography.headingWeights.semibold },
                ]}
              >
                View Map →
              </Text>
            </Pressable>
          </View>

          {/* Mini Interactive Map Preview Card (~180px height) */}
          <Pressable
            style={[
              styles.miniMapCard,
              {
                backgroundColor: '#EBF4FA',
                borderRadius: radii.xl,
                borderColor: colors.borderSubtle,
              },
              shadows.sm,
            ]}
            onPress={() => (navigation as any).navigate('Tabs', { screen: 'PostJob' })}
          >
            {/* Background SVG Grid simulating map coordinates */}
            <Svg width="100%" height={170} style={StyleSheet.absoluteFill}>
              <Defs>
                <LinearGradient id="mapBg" x1="0%" y1="0%" x2="100%" y2="100%">
                  <Stop offset="0%" stopColor="#E2EEF8" />
                  <Stop offset="100%" stopColor="#D5E6F5" />
                </LinearGradient>
              </Defs>
              <Rect width="100%" height={170} fill="url(#mapBg)" rx={radii.xl} />
              {/* Fake roads */}
              <Rect x="0" y="70" width="100%" height="8" fill="#FFFFFF" opacity={0.6} />
              <Rect x="140" y="0" width="8" height="170" fill="#FFFFFF" opacity={0.6} />
              <Circle cx="80" cy="50" r="18" fill="rgba(0, 97, 153, 0.15)" />
              <Circle cx="240" cy="110" r="22" fill="rgba(255, 103, 1, 0.15)" />
            </Svg>

            {/* Pins on the preview map */}
            <View style={[styles.mapPinContainer, { left: 70, top: 40 }]}>
              <View style={[styles.workerMapPin, { backgroundColor: colors.brandBlue }]}>
                <Droplets size={12} color={colors.white} />
              </View>
            </View>

            <View style={[styles.mapPinContainer, { left: 230, top: 95 }]}>
              <View style={[styles.workerMapPin, { backgroundColor: colors.brandOrange }]}>
                <Zap size={12} color={colors.white} />
              </View>
            </View>

            <View style={[styles.mapPinContainer, { left: 160, top: 60 }]}>
              <View style={[styles.workerMapPin, { backgroundColor: '#0284C7' }]}>
                <Wind size={12} color={colors.white} />
              </View>
            </View>

            {/* Overlay pill tag */}
            <View style={[styles.mapFloatingPill, { backgroundColor: colors.white, borderRadius: radii.full }, shadows.sm]}>
              <View style={[styles.liveDot, { backgroundColor: colors.success }]} />
              <Text style={{ color: colors.textPrimary, fontSize: 11, fontWeight: '700' }}>
                14 Verified Pros Online in DHA
              </Text>
            </View>
          </Pressable>
        </View>

        {/* 6. "Top Rated Near You" Horizontal Cards (§4.1 #6) */}
        <View style={{ marginTop: spacing.xl }}>
          <View style={[styles.sectionHeaderRow, { paddingHorizontal: spacing.lg }]}>
            <Text
              style={[
                styles.sectionHeading,
                { color: colors.textPrimary, fontFamily: typography.headingWeights.bold },
              ]}
            >
              Top Rated Near You
            </Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={[styles.workersStrip, { paddingHorizontal: spacing.lg }]}
          >
            {TOP_WORKERS.map((worker) => (
              <Pressable
                key={worker.id}
                onPress={() => (navigation as any).navigate('Tabs', { screen: 'PostJob' })}
                style={({ pressed }) => [
                  styles.workerCard,
                  {
                    backgroundColor: colors.white,
                    borderColor: colors.borderSubtle,
                    borderRadius: radii.xl,
                    padding: spacing.md,
                    opacity: pressed ? 0.9 : 1,
                  },
                  shadows.md,
                ]}
              >
                {/* Available Badge */}
                {worker.availableNow && (
                  <View
                    style={[
                      styles.availBadge,
                      { backgroundColor: 'rgba(16, 185, 129, 0.12)', borderRadius: radii.full },
                    ]}
                  >
                    <View style={[styles.liveDot, { backgroundColor: colors.success }]} />
                    <Text style={{ color: colors.success, fontSize: 10, fontWeight: '700' }}>
                      Available Now
                    </Text>
                  </View>
                )}

                {/* Worker Avatar & Info */}
                <Image source={{ uri: worker.avatar }} style={styles.workerAvatar} />
                <Text
                  style={[
                    styles.workerName,
                    { color: colors.textPrimary, fontFamily: typography.headingWeights.bold },
                  ]}
                  numberOfLines={1}
                >
                  {worker.name}
                </Text>
                <Text style={[styles.workerCategory, { color: colors.textSecondary }]}>
                  {worker.category}
                </Text>

                {/* Rating & Distance */}
                <View style={styles.ratingRow}>
                  <Star size={13} color="#F59E0B" fill="#F59E0B" />
                  <Text style={[styles.ratingText, { color: colors.textPrimary }]}>
                    {worker.rating}
                  </Text>
                  <Text style={[styles.reviewsCount, { color: colors.textMuted }]}>
                    ({worker.reviewsCount})
                  </Text>
                </View>

                {/* Price Pill */}
                <View
                  style={[
                    styles.pricePill,
                    {
                      backgroundColor: 'rgba(0, 97, 153, 0.08)',
                      borderRadius: radii.md,
                    },
                  ]}
                >
                  <Text style={[styles.priceText, { color: colors.brandBlue }]}>
                    Rs. {worker.hourlyRate}/hr
                  </Text>
                </View>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      </ScrollView>

      {/* 7. Floating Action Button ("+ Post a Job" §4.1 FAB) */}
      <Pressable
        style={[
          styles.fab,
          {
            backgroundColor: colors.brandOrange,
            borderRadius: radii.full,
          },
          shadows.lg,
        ]}
        onPress={() => (navigation as any).navigate('Tabs', { screen: 'PostJob' })}
        accessibilityLabel="Post a Job"
      >
        <Plus size={24} color={colors.white} strokeWidth={2.5} />
        <Text style={styles.fabText}>Post Job</Text>
      </Pressable>

      {/* Address Switcher Bottom Sheet Modal */}
      <AddressSwitcherModal
        visible={addressModalVisible}
        onClose={() => setAddressModalVisible(false)}
        selectedId={selectedAddress.id}
        onSelectAddress={(addr) => setSelectedAddress(addr)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
  },
  locationSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    maxWidth: '65%',
  },
  locationPinBadge: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationSubhead: {
    fontSize: 10.5,
    fontWeight: '600',
  },
  locationTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationTitle: {
    fontSize: 13,
  },
  topBarRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  walletBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
  },
  walletBalanceText: {
    fontSize: 12,
  },
  notificationButton: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  notificationDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  scrollContent: {},
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderWidth: 1,
    gap: 10,
  },
  searchPlaceholder: {
    flex: 1,
    fontSize: 13.5,
  },
  micBadge: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sectionHeading: {
    fontSize: 16,
  },
  viewAllLink: {
    fontSize: 13,
  },
  categoryStrip: {
    gap: 14,
  },
  categoryTile: {
    alignItems: 'center',
    width: 68,
  },
  categoryCircle: {
    width: 58,
    height: 58,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    marginBottom: 6,
  },
  categoryLabel: {
    fontSize: 11.5,
    textAlign: 'center',
  },
  promoCard: {
    height: 140,
    overflow: 'hidden',
    position: 'relative',
  },
  promoContent: {
    padding: 16,
    height: '100%',
    justifyContent: 'space-between',
  },
  promoTag: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  promoTagText: {
    color: '#FFFFFF',
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  promoTitle: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
    marginTop: 2,
  },
  promoDesc: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 11.5,
    maxWidth: '75%',
    lineHeight: 15,
  },
  promoButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  promoButtonText: {
    fontSize: 11.5,
    fontWeight: '800',
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
  },
  dot: {
    height: 5,
  },
  miniMapCard: {
    height: 170,
    borderWidth: 1,
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'flex-end',
    padding: 12,
  },
  mapPinContainer: {
    position: 'absolute',
  },
  workerMapPin: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  mapFloatingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  liveDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  workersStrip: {
    gap: 14,
  },
  workerCard: {
    width: 170,
    borderWidth: 1,
    alignItems: 'center',
    position: 'relative',
  },
  availBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  workerAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginTop: 10,
    marginBottom: 8,
  },
  workerName: {
    fontSize: 13.5,
    textAlign: 'center',
  },
  workerCategory: {
    fontSize: 11,
    marginTop: 2,
    textAlign: 'center',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '700',
  },
  reviewsCount: {
    fontSize: 11,
  },
  pricePill: {
    marginTop: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    width: '100%',
    alignItems: 'center',
  },
  priceText: {
    fontSize: 11.5,
    fontWeight: '700',
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 18,
    paddingVertical: 12,
    zIndex: 99,
  },
  fabText: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '800',
  },
});
