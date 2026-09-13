import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CheckCircle2, Siren } from 'lucide-react-native';

import { Button } from '../../components/Button';
import type { AppStackParamList } from '../../navigation/types';
import { useJobsStore } from '../../store/jobs';
import { useTheme } from '../../theme/ThemeProvider';

type Props = NativeStackScreenProps<AppStackParamList, 'Sos'>;

const STATUS_STEPS = ['Location shared with Ustavia support', 'Other party on this job notified', 'Support team reviewing'];

/** SOS + live status visible to both sides during in_progress — ARCHITECTURE.md §5. Matches both UX specs' "SOS Active Screen" (siren icon, sequential status checklist, prominent safe-now button). */
export function SosScreen({ route, navigation }: Props) {
  const { jobId } = route.params;
  const { colors, radii, spacing, typography } = useTheme();
  const toggleSos = useJobsStore((state) => state.toggleSos);
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.15, duration: 900, easing: Easing.ease, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 900, easing: Easing.ease, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  return (
    <View style={[styles.container, { backgroundColor: colors.dangerLight, padding: spacing.xl }]}>
      <Animated.View style={[styles.pulse, { backgroundColor: colors.danger, borderRadius: radii.full, transform: [{ scale: pulse }] }]}>
        <Siren size={56} color={colors.white} />
      </Animated.View>

      <Text style={[styles.heading, { color: colors.textPrimary, fontFamily: typography.headingWeights.bold, fontSize: typography.size.xl }]}>
        Help is on the way
      </Text>
      <Text style={[styles.subheading, { color: colors.textSecondary, marginTop: spacing.xs }]}>
        Alerting your emergency contacts and Ustavia support...
      </Text>

      <View style={{ marginTop: spacing.xl, width: '100%', gap: spacing.sm }}>
        {STATUS_STEPS.map((step) => (
          <View key={step} style={styles.statusRow}>
            <CheckCircle2 size={18} color={colors.success} />
            <Text style={{ color: colors.textPrimary, flex: 1 }}>{step}</Text>
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
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  pulse: { width: 140, height: 140, alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
  heading: { textAlign: 'center' },
  subheading: { fontSize: 14, textAlign: 'center' },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
});
