import { useEffect, useRef } from 'react';
import { Animated, Easing, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CheckCircle2, PhoneCall, Siren } from 'lucide-react-native';

import { Button } from '../../components/Button';
import type { AppStackParamList } from '../../navigation/types';
import { useJobsStore } from '../../store/jobs';
import { useTheme } from '../../theme/ThemeProvider';

type Props = NativeStackScreenProps<AppStackParamList, 'Sos'>;

const STATUS_STEPS = [
  'GPS location transmitted to Ustavia emergency desk',
  'Rapid response notification sent to counterpart',
  'Ustavia priority team monitoring incident in real-time',
];

export function SosScreen({ route, navigation }: Props) {
  const { jobId } = route.params;
  const { colors, radii, spacing, typography, shadows } = useTheme();
  const toggleSos = useJobsStore((state) => state.toggleSos);
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.12, duration: 800, easing: Easing.ease, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 800, easing: Easing.ease, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: '#FEF2F2' }}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.centerBox}>
        <Animated.View
          style={[
            styles.pulse,
            {
              backgroundColor: colors.danger,
              borderRadius: radii.full,
              transform: [{ scale: pulse }],
            },
            shadows.lg,
          ]}
        >
          <Siren size={56} color={colors.white} strokeWidth={2.2} />
        </Animated.View>

        <Text
          style={[
            styles.heading,
            {
              color: colors.textPrimary,
              fontFamily: typography.headingWeights.bold,
              fontSize: 26,
            },
          ]}
        >
          Emergency SOS Active
        </Text>

        <Text
          style={[
            styles.subheading,
            {
              color: colors.textSecondary,
              marginTop: spacing.xs,
              lineHeight: 20,
            },
          ]}
        >
          Alerting Ustavia Rapid Assistance and emergency contacts with your live location coordinates.
        </Text>

        {/* Live Status Checklist */}
        <View
          style={[
            styles.statusCard,
            {
              backgroundColor: colors.white,
              borderColor: 'rgba(239, 68, 68, 0.2)',
              borderRadius: radii.lg,
              padding: spacing.lg,
              marginTop: spacing.xl,
            },
            shadows.sm,
          ]}
        >
          {STATUS_STEPS.map((step, idx) => (
            <View key={step} style={[styles.statusRow, idx < STATUS_STEPS.length - 1 && { marginBottom: 12 }]}>
              <CheckCircle2 size={18} color={colors.success} strokeWidth={2.5} />
              <Text style={{ color: colors.textPrimary, flex: 1, fontSize: 13, lineHeight: 18 }}>{step}</Text>
            </View>
          ))}
        </View>

        <View style={{ marginTop: spacing.xxl, width: '100%' }}>
          <Button
            label="I'm Safe Now — Cancel Alert"
            variant="danger"
            onPress={() => {
              toggleSos(jobId);
              navigation.goBack();
            }}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  centerBox: {
    width: '100%',
    maxWidth: 480,
    alignItems: 'center',
  },
  pulse: {
    width: 130,
    height: 130,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  heading: {
    textAlign: 'center',
  },
  subheading: {
    fontSize: 14,
    textAlign: 'center',
  },
  statusCard: {
    width: '100%',
    borderWidth: 1,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
});
