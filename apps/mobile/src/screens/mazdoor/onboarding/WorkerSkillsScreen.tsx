import { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
  ArrowLeft,
  Award,
  Brush,
  Check,
  Droplets,
  Hammer,
  Plus,
  Sparkles,
  Tv,
  Wind,
  Zap,
} from 'lucide-react-native';

import { Button } from '../../../components/Button';
import { useTheme } from '../../../theme/ThemeProvider';

interface CategoryOption {
  id: string;
  name: string;
  icon: any;
  skills: string[];
}

const CATEGORIES: CategoryOption[] = [
  {
    id: 'electrician',
    name: 'Electrician',
    icon: Zap,
    skills: ['House Wiring', 'Circuit Breakers', 'Ceiling Fan Repair', 'Solar Inverter Setup', 'Short Circuit Diagnosis'],
  },
  {
    id: 'plumber',
    name: 'Plumber',
    icon: Droplets,
    skills: ['Pipe Leakage Fix', 'Sanitary Fitting', 'Water Motor Repair', 'Drain Unblocking', 'Geyser Installation'],
  },
  {
    id: 'ac',
    name: 'AC Specialist',
    icon: Wind,
    skills: ['Gas Refilling', 'Chemical Deep Wash', 'PCB Card Repair', 'AC Installation', 'Compressor Replacement'],
  },
  {
    id: 'carpenter',
    name: 'Carpenter',
    icon: Hammer,
    skills: ['Door Lock Repair', 'Cabinet Making', 'Furniture Repair', 'Wood Polishing', 'Hinges Fitting'],
  },
  {
    id: 'painter',
    name: 'Painter',
    icon: Brush,
    skills: ['Interior Emulsion', 'Exterior WeatherSheet', 'Wall Putty Prep', 'Texture Design', 'Waterproofing'],
  },
  {
    id: 'cleaning',
    name: 'Cleaner',
    icon: Sparkles,
    skills: ['Deep Home Cleaning', 'Sofa/Carpet Shampoo', 'Water Tank Cleaning', 'Floor Scrubbing', 'Kitchen Degreasing'],
  },
];

export function WorkerSkillsScreen() {
  const { colors, radii, spacing, typography, shadows } = useTheme();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const [selectedCategory, setSelectedCategory] = useState<string>('electrician');
  const [selectedSkills, setSelectedSkills] = useState<string[]>(['House Wiring', 'Circuit Breakers']);
  const [certifications, setCertifications] = useState<string[]>(['TEVTA Certified Electrician']);

  const activeCategory = CATEGORIES.find((c) => c.id === selectedCategory) || CATEGORIES[0];

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill],
    );
  };

  const handleContinue = () => {
    navigation.navigate('WorkerRates', {
      ...route.params,
      category: activeCategory.name,
      skills: selectedSkills,
      certifications,
    });
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
        <Text
          style={[
            styles.stepIndicator,
            { color: colors.brandOrange, fontFamily: typography.headingWeights.bold },
          ]}
        >
          Step 3 of 5
        </Text>
        <View style={{ width: 34 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: spacing.xl, paddingBottom: 60 }} showsVerticalScrollIndicator={false}>
        <Text
          style={[
            styles.heading,
            { color: colors.textPrimary, fontFamily: typography.headingWeights.bold },
          ]}
        >
          Services & Skills
        </Text>
        <Text style={{ color: colors.textSecondary, marginTop: 4, marginBottom: spacing.lg }}>
          Select your primary trade and check all the specific jobs you are qualified to perform.
        </Text>

        {/* Categories Grid */}
        <Text
          style={[
            styles.sectionTitle,
            { color: colors.textPrimary, fontFamily: typography.headingWeights.bold },
          ]}
        >
          Primary Trade
        </Text>

        <View style={styles.catGrid}>
          {CATEGORIES.map((cat) => {
            const IconComp = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <Pressable
                key={cat.id}
                onPress={() => {
                  setSelectedCategory(cat.id);
                  setSelectedSkills([cat.skills[0], cat.skills[1]]);
                }}
                style={[
                  styles.catCard,
                  {
                    backgroundColor: isSelected ? 'rgba(255, 103, 1, 0.08)' : colors.white,
                    borderColor: isSelected ? colors.brandOrange : colors.borderSubtle,
                    borderRadius: radii.lg,
                    padding: spacing.md,
                  },
                  isSelected && shadows.sm,
                ]}
              >
                <View
                  style={[
                    styles.catIconCircle,
                    {
                      backgroundColor: isSelected ? colors.brandOrange : colors.surfaceSubtle,
                      borderRadius: radii.full,
                    },
                  ]}
                >
                  <IconComp size={20} color={isSelected ? colors.white : colors.textPrimary} />
                </View>
                <Text
                  style={[
                    styles.catText,
                    {
                      color: isSelected ? colors.brandOrange : colors.textPrimary,
                      fontFamily: isSelected ? typography.headingWeights.bold : typography.headingWeights.semibold,
                    },
                  ]}
                >
                  {cat.name}
                </Text>
                {isSelected && (
                  <View style={[styles.miniCheck, { backgroundColor: colors.brandOrange }]}>
                    <Check size={10} color={colors.white} strokeWidth={3} />
                  </View>
                )}
              </Pressable>
            );
          })}
        </View>

        {/* Skills Tag Chips */}
        <Text
          style={[
            styles.sectionTitle,
            { color: colors.textPrimary, fontFamily: typography.headingWeights.bold, marginTop: spacing.xl },
          ]}
        >
          Skills in {activeCategory.name}
        </Text>
        <Text style={{ color: colors.textMuted, fontSize: 12, marginBottom: spacing.md }}>
          Tap to select all jobs you are comfortable handling independently.
        </Text>

        <View style={styles.skillsWrap}>
          {activeCategory.skills.map((skill) => {
            const isTicked = selectedSkills.includes(skill);
            return (
              <Pressable
                key={skill}
                onPress={() => toggleSkill(skill)}
                style={[
                  styles.skillChip,
                  {
                    backgroundColor: isTicked ? colors.brandBlue : colors.white,
                    borderColor: isTicked ? colors.brandBlue : colors.borderSubtle,
                    borderRadius: radii.full,
                    paddingHorizontal: 14,
                    paddingVertical: 8,
                  },
                  isTicked && shadows.sm,
                ]}
              >
                {isTicked && <Check size={13} color={colors.white} strokeWidth={2.5} />}
                <Text
                  style={{
                    color: isTicked ? colors.white : colors.textPrimary,
                    fontSize: 12.5,
                    fontFamily: isTicked ? typography.headingWeights.bold : typography.headingWeights.semibold,
                  }}
                >
                  {skill}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Certifications Box */}
        <Text
          style={[
            styles.sectionTitle,
            { color: colors.textPrimary, fontFamily: typography.headingWeights.bold, marginTop: spacing.xl },
          ]}
        >
          Diplomas & Certifications (Optional)
        </Text>

        <View style={styles.certList}>
          {certifications.map((cert) => (
            <View
              key={cert}
              style={[
                styles.certCard,
                {
                  backgroundColor: 'rgba(0, 97, 153, 0.06)',
                  borderColor: 'rgba(0, 97, 153, 0.2)',
                  borderRadius: radii.md,
                  padding: spacing.md,
                },
              ]}
            >
              <Award size={18} color={colors.brandBlue} />
              <Text
                style={[
                  styles.certText,
                  { color: colors.textPrimary, fontFamily: typography.headingWeights.semibold },
                ]}
              >
                {cert}
              </Text>
            </View>
          ))}

          <Pressable
            style={[
              styles.addCertBtn,
              {
                borderColor: colors.brandBlue,
                backgroundColor: colors.white,
                borderRadius: radii.md,
                padding: spacing.md,
              },
            ]}
            onPress={() => setCertifications((prev) => [...prev, 'Technical Training Diploma'])}
          >
            <Plus size={16} color={colors.brandBlue} strokeWidth={2.5} />
            <Text style={[styles.addCertText, { color: colors.brandBlue, fontFamily: typography.headingWeights.bold }]}>
              Add Another Certificate
            </Text>
          </Pressable>
        </View>

        {/* Continue Button */}
        <View style={{ marginTop: spacing.xxl }}>
          <Button
            label="Continue to Rates & Availability"
            disabled={selectedSkills.length === 0}
            onPress={handleContinue}
          />
        </View>
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
  backBtn: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepIndicator: {
    fontSize: 13,
  },
  heading: {
    fontSize: 22,
  },
  sectionTitle: {
    fontSize: 15,
    marginBottom: 10,
  },
  catGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  catCard: {
    width: '31%',
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    position: 'relative',
  },
  catIconCircle: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  catText: {
    fontSize: 11.5,
    textAlign: 'center',
  },
  miniCheck: {
    position: 'absolute',
    top: 5,
    right: 5,
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  skillsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
  },
  certList: {
    gap: 10,
    marginTop: 6,
  },
  certCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
  },
  certText: {
    fontSize: 13,
  },
  addCertBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1.5,
    borderStyle: 'dashed',
  },
  addCertText: {
    fontSize: 13,
  },
});
