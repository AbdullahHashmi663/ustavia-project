import { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ArrowLeft, Clock, DollarSign, MapPin } from 'lucide-react-native';

import { Button } from '../../../components/Button';
import { TextField } from '../../../components/TextField';
import { useTheme } from '../../../theme/ThemeProvider';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export function WorkerRatesAvailabilityScreen() {
  const { colors, radii, spacing, typography, shadows } = useTheme();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const [hourlyRate, setHourlyRate] = useState('500');
  const [callOutFee, setCallOutFee] = useState('300');
  const [availableNow, setAvailableNow] = useState(true);
  const [radiusKm, setRadiusKm] = useState(15);
  const [activeDays, setActiveDays] = useState<Record<string, boolean>>({
    Mon: true,
    Tue: true,
    Wed: true,
    Thu: true,
    Fri: true,
    Sat: true,
    Sun: false,
  });

  const toggleDay = (day: string) => {
    setActiveDays((prev) => ({ ...prev, [day]: !prev[day] }));
  };

  const handleComplete = () => {
    navigation.navigate('WorkerWelcome', {
      ...route.params,
      hourlyRate,
      callOutFee,
      availableNow,
      radiusKm,
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
          Step 4 of 5
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
          Set Your Rates & Radius
        </Text>
        <Text style={{ color: colors.textSecondary, marginTop: 4, marginBottom: spacing.xl }}>
          Establish your fair service charges and how far you are willing to travel.
        </Text>

        {/* Pricing Inputs */}
        <View style={styles.pricingSection}>
          <TextField
            label="Hourly Rate (PKR)"
            placeholder="500"
            keyboardType="numeric"
            value={hourlyRate}
            onChangeText={setHourlyRate}
            helperText="Standard hourly rate charged for ongoing repair work"
          />

          <View style={{ marginTop: spacing.md }}>
            <TextField
              label="Minimum Call-Out Charge (PKR)"
              placeholder="300"
              keyboardType="numeric"
              value={callOutFee}
              onChangeText={setCallOutFee}
              helperText="Guaranteed visit fee covering your commute and initial inspection"
            />
          </View>
        </View>

        {/* Working Hours & Active Days */}
        <View style={{ marginTop: spacing.xl }}>
          <View style={styles.sectionHeader}>
            <Clock size={18} color={colors.brandOrange} />
            <Text
              style={[
                styles.sectionTitle,
                { color: colors.textPrimary, fontFamily: typography.headingWeights.bold },
              ]}
            >
              Working Days & Hours
            </Text>
          </View>

          <View style={styles.daysRow}>
            {DAYS.map((day) => {
              const active = activeDays[day];
              return (
                <Pressable
                  key={day}
                  onPress={() => toggleDay(day)}
                  style={[
                    styles.dayPill,
                    {
                      backgroundColor: active ? colors.brandOrange : colors.white,
                      borderColor: active ? colors.brandOrange : colors.borderSubtle,
                      borderRadius: radii.md,
                    },
                    active && shadows.sm,
                  ]}
                >
                  <Text
                    style={{
                      color: active ? colors.white : colors.textPrimary,
                      fontSize: 12,
                      fontFamily: active ? typography.headingWeights.bold : typography.headingWeights.semibold,
                    }}
                  >
                    {day}
                  </Text>
                </Pressable>
              );
            })}
          </View>
          <Text style={[styles.hoursHint, { color: colors.textMuted }]}>
            Standard Schedule: 09:00 AM – 06:00 PM on active days
          </Text>
        </View>

        {/* Service Radius */}
        <View style={{ marginTop: spacing.xl }}>
          <View style={styles.sectionHeader}>
            <MapPin size={18} color={colors.brandBlue} />
            <Text
              style={[
                styles.sectionTitle,
                { color: colors.textPrimary, fontFamily: typography.headingWeights.bold },
              ]}
            >
              Service Radius
            </Text>
          </View>

          <View
            style={[
              styles.radiusCard,
              {
                backgroundColor: colors.white,
                borderColor: colors.borderSubtle,
                borderRadius: radii.lg,
                padding: spacing.md,
              },
              shadows.sm,
            ]}
          >
            <View style={styles.radiusTopRow}>
              <Text style={{ color: colors.textSecondary, fontSize: 13 }}>Accept jobs within:</Text>
              <View style={[styles.radiusPill, { backgroundColor: 'rgba(0, 97, 153, 0.1)', borderRadius: radii.full }]}>
                <Text style={{ color: colors.brandBlue, fontWeight: '800', fontSize: 13 }}>
                  {radiusKm} km
                </Text>
              </View>
            </View>

            {/* Quick Radius Selection Chips */}
            <View style={styles.radiusChips}>
              {[5, 10, 15, 25, 40].map((km) => (
                <Pressable
                  key={km}
                  onPress={() => setRadiusKm(km)}
                  style={[
                    styles.kmChip,
                    {
                      backgroundColor: radiusKm === km ? colors.brandBlue : colors.surfaceSubtle,
                      borderRadius: radii.full,
                    },
                  ]}
                >
                  <Text
                    style={{
                      color: radiusKm === km ? colors.white : colors.textSecondary,
                      fontSize: 12,
                      fontWeight: '700',
                    }}
                  >
                    {km} km
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        </View>

        {/* Live Availability Master Switch */}
        <View
          style={[
            styles.switchCard,
            {
              backgroundColor: 'rgba(16, 185, 129, 0.08)',
              borderColor: 'rgba(16, 185, 129, 0.3)',
              borderRadius: radii.lg,
              padding: spacing.md,
              marginTop: spacing.xl,
            },
          ]}
        >
          <View style={{ flex: 1, paddingRight: 10 }}>
            <Text
              style={[
                styles.switchTitle,
                { color: colors.textPrimary, fontFamily: typography.headingWeights.bold },
              ]}
            >
              Available to Work Now
            </Text>
            <Text style={{ color: colors.textSecondary, fontSize: 11.5, marginTop: 2 }}>
              Receive instant booking alerts in your vicinity as soon as you finish registration.
            </Text>
          </View>
          <Switch
            value={availableNow}
            onValueChange={setAvailableNow}
            trackColor={{ false: colors.border, true: colors.success }}
          />
        </View>

        {/* Complete Profile CTA */}
        <View style={{ marginTop: spacing.xxl }}>
          <Button
            label="Complete Profile & Start"
            onPress={handleComplete}
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
  pricingSection: {
    gap: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 15,
  },
  daysRow: {
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'space-between',
  },
  dayPill: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  hoursHint: {
    fontSize: 11.5,
    marginTop: 8,
  },
  radiusCard: {
    borderWidth: 1,
    gap: 12,
  },
  radiusTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  radiusPill: {
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  radiusChips: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'space-between',
  },
  kmChip: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 6,
  },
  switchCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
  },
  switchTitle: {
    fontSize: 14,
  },
});
