import {
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { CheckCircle2, ShieldCheck, Sparkles, TrendingUp, Zap } from 'lucide-react-native';

import { Button } from '../../../components/Button';
import { useTheme } from '../../../theme/ThemeProvider';

export function WorkerWelcomeScreen() {
  const { colors, radii, spacing, typography, shadows } = useTheme();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const category = route.params?.category || 'Electrician';
  const hourlyRate = route.params?.hourlyRate || '500';
  const callOutFee = route.params?.callOutFee || '300';
  const fullName = route.params?.fullName || 'Professional Mazdoor';

  const handleStartEarning = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Tabs', params: { screen: 'Dashboard' } }],
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.canvas ?? colors.white }]}>
      <View style={[styles.content, { padding: spacing.xl }]}>
        {/* Celebration Emblem */}
        <View
          style={[
            styles.celebrationCircle,
            {
              backgroundColor: 'rgba(255, 103, 1, 0.1)',
              borderColor: 'rgba(255, 103, 1, 0.25)',
              borderRadius: radii.full,
            },
            shadows.md,
          ]}
        >
          <View
            style={[
              styles.innerCircle,
              { backgroundColor: colors.brandOrange, borderRadius: radii.full },
            ]}
          >
            <Sparkles size={36} color={colors.white} />
          </View>
        </View>

        <Text
          style={[
            styles.title,
            { color: colors.textPrimary, fontFamily: typography.headingWeights.bold },
          ]}
        >
          Welcome to Ustavia!
        </Text>

        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Congratulations, {fullName}. Your profile is active and ready to receive customer leads.
        </Text>

        {/* Profile Summary Card */}
        <View
          style={[
            styles.summaryCard,
            {
              backgroundColor: colors.white,
              borderColor: colors.borderSubtle,
              borderRadius: radii.xl,
              padding: spacing.lg,
            },
            shadows.sm,
          ]}
        >
          <View style={styles.summaryHeader}>
            <ShieldCheck size={20} color={colors.brandBlue} />
            <Text
              style={[
                styles.summaryHeading,
                { color: colors.brandBlue, fontFamily: typography.headingWeights.bold },
              ]}
            >
              Account Verification Pending Review
            </Text>
          </View>
          <Text style={{ color: colors.textMuted, fontSize: 12, marginTop: 4, marginBottom: 12 }}>
            NADRA cross-check is underway. You can browse all available jobs immediately.
          </Text>

          <View style={styles.divider} />

          <View style={styles.statRow}>
            <Text style={{ color: colors.textSecondary, fontSize: 13 }}>Trade Category:</Text>
            <Text style={[styles.statValue, { color: colors.textPrimary, fontFamily: typography.headingWeights.bold }]}>
              {category}
            </Text>
          </View>

          <View style={styles.statRow}>
            <Text style={{ color: colors.textSecondary, fontSize: 13 }}>Hourly Rate:</Text>
            <Text style={[styles.statValue, { color: colors.brandOrange, fontFamily: typography.headingWeights.bold }]}>
              Rs. {hourlyRate}/hr
            </Text>
          </View>

          <View style={styles.statRow}>
            <Text style={{ color: colors.textSecondary, fontSize: 13 }}>Call-Out Fee:</Text>
            <Text style={[styles.statValue, { color: colors.textPrimary, fontFamily: typography.headingWeights.bold }]}>
              Rs. {callOutFee}
            </Text>
          </View>
        </View>

        {/* Earning Boost Perk */}
        <View
          style={[
            styles.perkCard,
            {
              backgroundColor: 'rgba(0, 97, 153, 0.06)',
              borderColor: 'rgba(0, 97, 153, 0.15)',
              borderRadius: radii.lg,
              padding: spacing.md,
            },
          ]}
        >
          <TrendingUp size={20} color={colors.brandBlue} />
          <Text style={{ color: colors.textSecondary, fontSize: 12, flex: 1, lineHeight: 16 }}>
            Complete 10 jobs daily to reduce platform commission from 10% to 8% and boost your ranking to Silver Tier.
          </Text>
        </View>
      </View>

      {/* Start Earning CTA */}
      <View style={[styles.footer, { padding: spacing.xl }]}>
        <Button
          label="Start Earning Now"
          onPress={handleStartEarning}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  content: {
    alignItems: 'center',
    paddingTop: 40,
  },
  celebrationCircle: {
    width: 90,
    height: 90,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  innerCircle: {
    width: 66,
    height: 66,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13.5,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 24,
    lineHeight: 18,
    maxWidth: 320,
  },
  summaryCard: {
    width: '100%',
    borderWidth: 1,
    marginBottom: 16,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  summaryHeading: {
    fontSize: 13,
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 10,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  statValue: {
    fontSize: 13.5,
  },
  perkCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    width: '100%',
  },
  footer: {},
});
