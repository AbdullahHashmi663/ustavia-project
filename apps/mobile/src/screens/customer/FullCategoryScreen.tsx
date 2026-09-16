import { useState } from 'react';
import {
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
  ArrowLeft,
  Briefcase,
  Brush,
  Car,
  Droplets,
  Hammer,
  Package,
  Search,
  Scissors,
  Shield,
  Sparkles,
  Tv,
  Wind,
  Wrench,
  Zap,
} from 'lucide-react-native';

import type { AppStackParamList } from '../../navigation/types';
import { useTheme } from '../../theme/ThemeProvider';

interface CategoryItem {
  id: string;
  name: string;
  icon: any;
  color: string;
  popular?: boolean;
}

interface CategoryGroup {
  title: string;
  items: CategoryItem[];
}

const CATEGORY_GROUPS: CategoryGroup[] = [
  {
    title: 'Home Repairs & Maintenance',
    items: [
      { id: 'plumbing', name: 'Plumber', icon: Droplets, color: '#006199', popular: true },
      { id: 'electrician', name: 'Electrician', icon: Zap, color: '#FF6701', popular: true },
      { id: 'carpenter', name: 'Carpenter', icon: Hammer, color: '#8B5A2B' },
      { id: 'mason', name: 'Mason / Welder', icon: Wrench, color: '#475569' },
    ],
  },
  {
    title: 'Cooling & Appliances',
    items: [
      { id: 'ac', name: 'AC Repair', icon: Wind, color: '#0284C7', popular: true },
      { id: 'appliance', name: 'Appliance Repair', icon: Tv, color: '#7C3AED' },
      { id: 'geyser', name: 'Geyser Service', icon: Droplets, color: '#D97706' },
      { id: 'washing_machine', name: 'Washing Machine', icon: Wrench, color: '#059669' },
    ],
  },
  {
    title: 'Painting & Renovation',
    items: [
      { id: 'painter', name: 'Painter', icon: Brush, color: '#E11D48', popular: true },
      { id: 'ceiling', name: 'False Ceiling', icon: Sparkles, color: '#EA580C' },
      { id: 'polishing', name: 'Wood Polishing', icon: Hammer, color: '#78350F' },
    ],
  },
  {
    title: 'Cleaning, Personal & Moving',
    items: [
      { id: 'cleaning', name: 'Deep Cleaning', icon: Sparkles, color: '#0D9488', popular: true },
      { id: 'mover', name: 'Mover & Packer', icon: Package, color: '#2563EB' },
      { id: 'driver', name: 'Driver', icon: Car, color: '#4B5563' },
      { id: 'beautician', name: 'Beautician', icon: Scissors, color: '#DB2777' },
      { id: 'security', name: 'Security Guard', icon: Shield, color: '#0F172A' },
      { id: 'domestic', name: 'Domestic Help', icon: Briefcase, color: '#0284C7' },
    ],
  },
];

export function FullCategoryScreen() {
  const { colors, radii, spacing, typography, shadows } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSelect = (categoryName: string) => {
    // Navigate to post a job pre-selecting this category
    navigation.navigate('Tabs', {
      screen: 'PostJob',
    } as any);
  };

  const filteredGroups = CATEGORY_GROUPS.map((group) => ({
    ...group,
    items: group.items.filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()),
    ),
  })).filter((group) => group.items.length > 0);

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
          style={[styles.iconButton, { backgroundColor: colors.surfaceSubtle, borderRadius: radii.full }]}
          accessibilityLabel="Go back"
        >
          <ArrowLeft size={20} color={colors.textPrimary} />
        </Pressable>
        <Text
          style={[
            styles.headerTitle,
            { color: colors.textPrimary, fontFamily: typography.headingWeights.bold },
          ]}
        >
          All Service Categories
        </Text>
        <View style={{ width: 36 }} />
      </View>

      {/* Search Input */}
      <View style={{ paddingHorizontal: spacing.lg, paddingTop: spacing.md, paddingBottom: spacing.sm }}>
        <View
          style={[
            styles.searchBar,
            {
              backgroundColor: colors.surfaceSubtle,
              borderColor: colors.borderSubtle,
              borderRadius: radii.full,
              paddingHorizontal: spacing.md,
            },
          ]}
        >
          <Search size={18} color={colors.textMuted} />
          <TextInput
            style={[styles.searchInput, { color: colors.textPrimary }]}
            placeholder="Search category (e.g. Plumber, AC, Painter)"
            placeholderTextColor={colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Grouped Category Grids */}
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: spacing.lg, paddingBottom: spacing.xxxl }}
        showsVerticalScrollIndicator={false}
      >
        {filteredGroups.map((group) => (
          <View key={group.title} style={{ marginTop: spacing.lg }}>
            <Text
              style={[
                styles.groupTitle,
                { color: colors.textPrimary, fontFamily: typography.headingWeights.bold },
              ]}
            >
              {group.title}
            </Text>

            <View style={styles.grid}>
              {group.items.map((item) => {
                const IconComponent = item.icon;
                return (
                  <Pressable
                    key={item.id}
                    onPress={() => handleSelect(item.name)}
                    style={({ pressed }) => [
                      styles.categoryCard,
                      {
                        backgroundColor: colors.white,
                        borderColor: colors.borderSubtle,
                        borderRadius: radii.lg,
                        padding: spacing.md,
                        opacity: pressed ? 0.85 : 1,
                      },
                      shadows.sm,
                    ]}
                  >
                    {item.popular && (
                      <View
                        style={[
                          styles.popularBadge,
                          {
                            backgroundColor: colors.brandOrange,
                            borderRadius: radii.sm,
                          },
                        ]}
                      >
                        <Text style={styles.popularText}>POPULAR</Text>
                      </View>
                    )}

                    <View
                      style={[
                        styles.iconCircle,
                        {
                          backgroundColor: `${item.color}15`,
                          borderRadius: radii.full,
                        },
                      ]}
                    >
                      <IconComponent size={24} color={item.color} strokeWidth={2.2} />
                    </View>

                    <Text
                      style={[
                        styles.categoryName,
                        {
                          color: colors.textPrimary,
                          fontFamily: typography.headingWeights.semibold,
                        },
                      ]}
                    >
                      {item.name}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        ))}
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
  iconButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 17,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
    borderWidth: 1,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
  },
  groupTitle: {
    fontSize: 15,
    marginBottom: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryCard: {
    width: '48%',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    position: 'relative',
  },
  popularBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  popularText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
  iconCircle: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  categoryName: {
    fontSize: 13,
    textAlign: 'center',
  },
});
