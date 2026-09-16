import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Easing,
  Linking,
  PanResponder,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  AlertOctagon,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  MapPin,
  Phone,
  PhoneCall,
  ShieldAlert,
  ShieldCheck,
  Siren,
  XCircle,
} from 'lucide-react-native';

import { Button } from '../../components/Button';
import type { AppStackParamList } from '../../navigation/types';
import { useJobsStore } from '../../store/jobs';
import { useTheme } from '../../theme/ThemeProvider';

type Props = NativeStackScreenProps<AppStackParamList, 'Sos'>;

const STATUS_STEPS = [
  'Live GPS coordinates transmitted to Ustavia Safety Command Desk',
  'Automated SOS SMS with location link sent to your registered contacts',
  'Ustavia Rapid Emergency Officer dispatched to monitor in real-time',
];

const EMERGENCY_CONTACTS = [
  { name: 'Police Assistance', number: '15', desc: 'National Police Emergency Desk' },
  { name: 'Rescue & Ambulance', number: '1122', desc: 'Pakistan Emergency Medical Service' },
  { name: 'Ustavia Safety Hotline', number: '05111187828', desc: '24/7 Rapid Response Desk' },
];

export function SosScreen({ route, navigation }: Props) {
  const { jobId } = route.params;
  const { colors, radii, spacing, typography, shadows } = useTheme();

  const sosActiveJobIds = useJobsStore((state) => state.sosActiveJobIds);
  const toggleSos = useJobsStore((state) => state.toggleSos);

  const isActive = sosActiveJobIds.includes(jobId);

  // Pulse animation for active alert beacon
  const pulse = useRef(new Animated.Value(1)).current;
  const ringScale = useRef(new Animated.Value(1)).current;
  const ringOpacity = useRef(new Animated.Value(0.7)).current;

  // Slider state & gesture
  const [sliderWidth, setSliderWidth] = useState(0);
  const panX = useRef(new Animated.Value(0)).current;
  const thumbSize = 54;
  const padding = 6;

  useEffect(() => {
    if (!isActive) return;

    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.15, duration: 700, easing: Easing.ease, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 700, easing: Easing.ease, useNativeDriver: true }),
      ]),
    );
    const ringLoop = Animated.loop(
      Animated.parallel([
        Animated.timing(ringScale, { toValue: 1.6, duration: 1400, easing: Easing.out(Easing.ease), useNativeDriver: true }),
        Animated.timing(ringOpacity, { toValue: 0, duration: 1400, easing: Easing.out(Easing.ease), useNativeDriver: true }),
      ]),
    );

    pulseLoop.start();
    ringLoop.start();

    return () => {
      pulseLoop.stop();
      ringLoop.stop();
    };
  }, [isActive, pulse, ringScale, ringOpacity]);

  const maxSlide = Math.max(0, sliderWidth - thumbSize - padding * 2);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dx > 0) {
          panX.setValue(Math.min(gestureState.dx, maxSlide || 200));
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        const threshold = (maxSlide || 200) * 0.72;
        if (gestureState.dx >= threshold) {
          // Slide completed!
          Animated.timing(panX, {
            toValue: maxSlide || 200,
            duration: 150,
            useNativeDriver: false,
          }).start(() => {
            if (!isActive) {
              toggleSos(jobId);
            }
          });
        } else {
          // Reset slider back to start
          Animated.spring(panX, {
            toValue: 0,
            useNativeDriver: false,
            bounciness: 6,
          }).start();
        }
      },
    }),
  ).current;

  const handleCall = (number: string) => {
    Linking.openURL(`tel:${number}`).catch(() => {
      Alert.alert('Unable to place call', `Please dial ${number} manually.`);
    });
  };

  const handleCancelAlert = () => {
    Alert.alert(
      'Confirm Safety Status',
      'Are you safe now? Deactivating will notify Ustavia Emergency Desk and close this incident alert.',
      [
        { text: 'Keep Alert Active', style: 'cancel' },
        {
          text: "Yes, I'm Safe",
          style: 'destructive',
          onPress: () => {
            if (isActive) {
              toggleSos(jobId);
            }
            panX.setValue(0);
            navigation.goBack();
          },
        },
      ],
    );
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: isActive ? '#FEF2F2' : colors.white }}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.centerBox}>
        {isActive ? (
          // ================= ACTIVE EMERGENCY VIEW =================
          <>
            <View style={styles.beaconWrapper}>
              <Animated.View
                style={[
                  styles.pulseRing,
                  {
                    backgroundColor: 'rgba(239, 68, 68, 0.25)',
                    transform: [{ scale: ringScale }],
                    opacity: ringOpacity,
                  },
                ]}
              />
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
                <Siren size={52} color={colors.white} strokeWidth={2.4} />
              </Animated.View>
            </View>

            <View style={styles.badgeDanger}>
              <Text style={styles.badgeDangerText}>EMERGENCY PROTOCOL ACTIVE</Text>
            </View>

            <Text
              style={[
                styles.heading,
                {
                  color: colors.textPrimary,
                  fontFamily: typography.headingWeights.bold,
                  fontSize: 24,
                  marginTop: spacing.md,
                },
              ]}
            >
              Emergency SOS Triggered
            </Text>

            <Text
              style={[
                styles.subheading,
                {
                  color: colors.textSecondary,
                  marginTop: spacing.xs,
                  lineHeight: 20,
                  textAlign: 'center',
                },
              ]}
            >
              Your incident broadcast has been dispatched to Ustavia Safety Officers and national emergency lines.
            </Text>

            {/* Live GPS Coordinates Card */}
            <View
              style={[
                styles.gpsCard,
                {
                  backgroundColor: colors.white,
                  borderColor: 'rgba(239, 68, 68, 0.25)',
                  borderRadius: radii.lg,
                  padding: spacing.md,
                  marginTop: spacing.lg,
                },
                shadows.sm,
              ]}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <MapPin size={22} color={colors.danger} />
                <View style={{ flex: 1 }}>
                  <Text style={{ color: colors.textPrimary, fontWeight: '700', fontSize: 13 }}>
                    Live Coordinates Transmitted
                  </Text>
                  <Text style={{ color: colors.textSecondary, fontSize: 12, marginTop: 2 }}>
                    33.7215° N, 73.0565° E (Islamabad) • Accurate within 5m
                  </Text>
                </View>
              </View>
            </View>

            {/* Live Status Checklist */}
            <View
              style={[
                styles.statusCard,
                {
                  backgroundColor: colors.white,
                  borderColor: 'rgba(239, 68, 68, 0.2)',
                  borderRadius: radii.lg,
                  padding: spacing.lg,
                  marginTop: spacing.md,
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

            {/* Direct Quick Dial Numbers */}
            <View style={{ width: '100%', marginTop: spacing.xl, gap: spacing.sm }}>
              <Text style={{ color: colors.textPrimary, fontWeight: '700', fontSize: 14, marginBottom: 4 }}>
                Direct Emergency Call Lines
              </Text>
              {EMERGENCY_CONTACTS.map((c) => (
                <Pressable
                  key={c.number}
                  onPress={() => handleCall(c.number)}
                  style={[
                    styles.contactCard,
                    {
                      backgroundColor: colors.white,
                      borderColor: colors.border,
                      borderRadius: radii.md,
                      padding: spacing.md,
                    },
                    shadows.sm,
                  ]}
                >
                  <View style={[styles.phoneIconWrap, { backgroundColor: '#FEE2E2', borderRadius: radii.full }]}>
                    <PhoneCall size={18} color={colors.danger} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: colors.textPrimary, fontWeight: '700', fontSize: 14 }}>{c.name}</Text>
                    <Text style={{ color: colors.textSecondary, fontSize: 12 }}>{c.desc}</Text>
                  </View>
                  <View style={[styles.dialBadge, { backgroundColor: colors.danger, borderRadius: radii.full }]}>
                    <Text style={{ color: colors.white, fontWeight: '700', fontSize: 12 }}>Dial {c.number}</Text>
                  </View>
                </Pressable>
              ))}
            </View>

            {/* Cancel Alert / I am Safe */}
            <View style={{ marginTop: spacing.xl, width: '100%', marginBottom: spacing.xl }}>
              <Button
                label="I'm Safe Now — Disarm Emergency"
                variant="danger"
                onPress={handleCancelAlert}
              />
            </View>
          </>
        ) : (
          // ================= STANDBY / SLIDE TO ALERT VIEW =================
          <>
            <View
              style={[
                styles.standbyIconWrap,
                {
                  backgroundColor: '#FEF2F2',
                  borderRadius: radii.full,
                  borderColor: '#FCA5A5',
                  borderWidth: 2,
                },
              ]}
            >
              <AlertOctagon size={58} color={colors.danger} strokeWidth={2.2} />
            </View>

            <Text
              style={[
                styles.heading,
                {
                  color: colors.textPrimary,
                  fontFamily: typography.headingWeights.bold,
                  fontSize: 26,
                  marginTop: spacing.lg,
                  textAlign: 'center',
                },
              ]}
            >
              Emergency Safety Hub
            </Text>

            <Text
              style={[
                styles.subheading,
                {
                  color: colors.textSecondary,
                  marginTop: spacing.xs,
                  lineHeight: 20,
                  textAlign: 'center',
                  paddingHorizontal: spacing.md,
                },
              ]}
            >
              If you feel unsafe or require instant police/medical intervention, slide the emergency bar below.
            </Text>

            {/* SLIDE TO ALERT BAR (customer.pdf §13.2 & Workers.pdf §10.2) */}
            <View style={{ width: '100%', marginTop: spacing.xl }}>
              <View
                style={[
                  styles.sliderTrack,
                  {
                    backgroundColor: '#FEE2E2',
                    borderColor: colors.danger,
                    borderRadius: radii.full,
                    padding,
                  },
                ]}
                onLayout={(e) => setSliderWidth(e.nativeEvent.layout.width)}
              >
                <Animated.View
                  style={[
                    styles.sliderFill,
                    {
                      width: Animated.add(panX, new Animated.Value(thumbSize + padding * 2)),
                      backgroundColor: colors.danger,
                      borderRadius: radii.full,
                    },
                  ]}
                />

                <Text
                  style={[
                    styles.sliderTrackText,
                    {
                      color: colors.danger,
                      fontFamily: typography.headingWeights.bold,
                    },
                  ]}
                >
                  SLIDE TO TRIGGER SOS  »»
                </Text>

                <Animated.View
                  {...panResponder.panHandlers}
                  style={[
                    styles.sliderThumb,
                    {
                      width: thumbSize,
                      height: thumbSize,
                      borderRadius: thumbSize / 2,
                      backgroundColor: colors.white,
                      transform: [{ translateX: panX }],
                    },
                    shadows.md,
                  ]}
                >
                  <AlertTriangle size={24} color={colors.danger} strokeWidth={2.5} />
                </Animated.View>
              </View>

              <Text style={{ textAlign: 'center', color: colors.textSecondary, fontSize: 12, marginTop: 8 }}>
                Slide completely to right to prevent accidental activation
              </Text>
            </View>

            {/* Direct Dial numbers without sliding */}
            <View style={{ width: '100%', marginTop: spacing.xl, gap: spacing.sm }}>
              <Text style={{ color: colors.textPrimary, fontWeight: '700', fontSize: 14, marginBottom: 4 }}>
                Instant Emergency Helplines
              </Text>
              {EMERGENCY_CONTACTS.map((c) => (
                <Pressable
                  key={c.number}
                  onPress={() => handleCall(c.number)}
                  style={[
                    styles.contactCard,
                    {
                      backgroundColor: colors.white,
                      borderColor: colors.border,
                      borderRadius: radii.md,
                      padding: spacing.md,
                    },
                    shadows.sm,
                  ]}
                >
                  <View style={[styles.phoneIconWrap, { backgroundColor: '#F3F4F6', borderRadius: radii.full }]}>
                    <Phone size={18} color={colors.textPrimary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: colors.textPrimary, fontWeight: '700', fontSize: 14 }}>{c.name}</Text>
                    <Text style={{ color: colors.textSecondary, fontSize: 12 }}>{c.desc}</Text>
                  </View>
                  <View style={[styles.dialBadge, { backgroundColor: colors.brandBlueLight, borderRadius: radii.full }]}>
                    <Text style={{ color: colors.brandBlueDark, fontWeight: '700', fontSize: 12 }}>Dial {c.number}</Text>
                  </View>
                </Pressable>
              ))}
            </View>

            {/* Return back safely */}
            <View style={{ marginTop: spacing.xl, width: '100%', marginBottom: spacing.xl }}>
              <Button
                label="Return to Booking"
                variant="outline"
                onPress={() => navigation.goBack()}
              />
            </View>
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 24,
    paddingTop: Platform.OS === 'ios' ? 48 : 24,
  },
  centerBox: {
    width: '100%',
    maxWidth: 480,
    alignItems: 'center',
  },
  beaconWrapper: {
    width: 140,
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  pulseRing: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
  },
  pulse: {
    width: 110,
    height: 110,
    alignItems: 'center',
    justifyContent: 'center',
  },
  standbyIconWrap: {
    width: 110,
    height: 110,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  badgeDanger: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeDangerText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 11,
    letterSpacing: 0.8,
  },
  heading: {
    textAlign: 'center',
  },
  subheading: {
    fontSize: 14,
  },
  gpsCard: {
    width: '100%',
    borderWidth: 1,
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
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
  },
  phoneIconWrap: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dialBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  sliderTrack: {
    height: 66,
    borderWidth: 1.5,
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  sliderFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    opacity: 0.3,
  },
  sliderTrackText: {
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 14,
    letterSpacing: 1,
  },
  sliderThumb: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
});
