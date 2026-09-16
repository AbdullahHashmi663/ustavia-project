import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Svg, {
  Circle,
  Defs,
  LinearGradient,
  RadialGradient,
  Rect,
  Stop,
} from 'react-native-svg';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

// Color Palette requested: Blue, Orange, White
const PALETTE = {
  white: '#FFFFFF',
  blueDeep: '#006199',
  blueBright: '#0A84FF',
  blueGlow: '#8ACFF8',
  blueSoft: 'rgba(0, 97, 153, 0.08)',
  orangeVibrant: '#FF6701',
  orangeWarm: '#FEA82F',
  orangeGlow: 'rgba(255, 103, 1, 0.25)',
  orangeSoft: 'rgba(255, 103, 1, 0.08)',
  slateDark: '#0F172A',
  slateMuted: '#64748B',
  trackBg: '#EEF4F8',
  trackBorder: '#D8E5F0',
};

const MIN_DISPLAY_MS = 2400;
const EXIT_FADE_MS = 400;

interface AnimatedSplashScreenProps {
  onFinish: () => void;
  ready: boolean;
}

export function AnimatedSplashScreen({ onFinish, ready }: AnimatedSplashScreenProps) {
  // GSAP-style timeline animation drivers
  const masterOpacity = useRef(new Animated.Value(1)).current;
  const masterScale = useRef(new Animated.Value(1)).current;

  // Track & orbital values
  const trackEnterScale = useRef(new Animated.Value(0.7)).current;
  const trackEnterOpacity = useRef(new Animated.Value(0)).current;
  const outerOrbitRotate = useRef(new Animated.Value(0)).current;
  const midOrbitRotate = useRef(new Animated.Value(0)).current;
  const innerOrbitRotate = useRef(new Animated.Value(0)).current;
  const radarPulse = useRef(new Animated.Value(0)).current;

  // Core logo reveal
  const logoScale = useRef(new Animated.Value(0.6)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoFloat = useRef(new Animated.Value(0)).current;
  const logoHaloPulse = useRef(new Animated.Value(0.85)).current;

  // Wordmark & text reveal
  const wordmarkOpacity = useRef(new Animated.Value(0)).current;
  const wordmarkTranslateY = useRef(new Animated.Value(18)).current;
  const badgeOpacity = useRef(new Animated.Value(0)).current;
  const badgeTranslateY = useRef(new Animated.Value(12)).current;

  // Bottom linear track progress loader
  const progressBarWidth = useRef(new Animated.Value(0)).current;
  const progressGlowOpacity = useRef(new Animated.Value(0)).current;
  const [progressLabel, setProgressLabel] = useState('INITIALIZING...');

  useEffect(() => {
    // 1. GSAP-Style Track Ignition: scale and fade in orbital geometry
    Animated.parallel([
      Animated.timing(trackEnterOpacity, {
        toValue: 1,
        duration: 550,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.spring(trackEnterScale, {
        toValue: 1,
        friction: 6.5,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    // 2. High-speed synchronized Track Runners (Outer Blue clockwise, Mid Orange counter-clockwise)
    Animated.loop(
      Animated.timing(outerOrbitRotate, {
        toValue: 1,
        duration: 3400,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();

    Animated.loop(
      Animated.timing(midOrbitRotate, {
        toValue: 1,
        duration: 2600,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();

    Animated.loop(
      Animated.timing(innerOrbitRotate, {
        toValue: 1,
        duration: 4800,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();

    // Radar / sonar wave expanding from the track
    Animated.loop(
      Animated.sequence([
        Animated.timing(radarPulse, {
          toValue: 1,
          duration: 2200,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(radarPulse, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ]),
    ).start();

    // Logo gentle halo breathing
    Animated.loop(
      Animated.sequence([
        Animated.timing(logoHaloPulse, {
          toValue: 1.15,
          duration: 1800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(logoHaloPulse, {
          toValue: 0.95,
          duration: 1800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    ).start();

    // 3. Logo Zoom with elastic settle
    Animated.sequence([
      Animated.delay(200),
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 600,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.spring(logoScale, {
          toValue: 1,
          friction: 6,
          tension: 45,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      // Gentle floating after arrival
      Animated.loop(
        Animated.sequence([
          Animated.timing(logoFloat, {
            toValue: -6,
            duration: 1600,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(logoFloat, {
            toValue: 0,
            duration: 1600,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ]),
      ).start();
    });

    // 4. Staggered Wordmark & Tagline reveal
    Animated.sequence([
      Animated.delay(450),
      Animated.parallel([
        Animated.timing(wordmarkOpacity, {
          toValue: 1,
          duration: 500,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(wordmarkTranslateY, {
          toValue: 0,
          duration: 500,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(badgeOpacity, {
          toValue: 1,
          duration: 450,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(badgeTranslateY, {
          toValue: 0,
          duration: 450,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // 5. GSAP-Style Linear Track Progress Bar fill
    Animated.sequence([
      Animated.delay(300),
      Animated.parallel([
        Animated.timing(progressGlowOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(progressBarWidth, {
          toValue: 1,
          duration: 1850,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
          useNativeDriver: false,
        }),
      ]),
    ]).start();

    // Text status ticker
    const timer1 = setTimeout(() => setProgressLabel('CONNECTING SPECIALISTS...'), 800);
    const timer2 = setTimeout(() => setProgressLabel('READY'), 1800);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  // Exit trigger once app is ready & minimum duration met
  useEffect(() => {
    let cancelled = false;
    const minTimer = setTimeout(() => {
      if (cancelled) return;
      if (ready) executeExitTransition();
    }, MIN_DISPLAY_MS);

    function executeExitTransition() {
      Animated.parallel([
        Animated.timing(masterOpacity, {
          toValue: 0,
          duration: EXIT_FADE_MS,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(masterScale, {
          toValue: 1.05,
          duration: EXIT_FADE_MS,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ]).start(({ finished }) => {
        if (finished && !cancelled) onFinish();
      });
    }

    return () => {
      cancelled = true;
      clearTimeout(minTimer);
    };
  }, [ready]);

  // Interpolated Rotations
  const spinOuter = outerOrbitRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const spinMid = midOrbitRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['360deg', '0deg'],
  });

  const spinInner = innerOrbitRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const radarScale = radarPulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.8, 1.8],
  });

  const radarOpacity = radarPulse.interpolate({
    inputRange: [0, 0.4, 1],
    outputRange: [0.6, 0.2, 0],
  });

  const progressPercent = progressBarWidth.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <Animated.View
      style={[
        StyleSheet.absoluteFill,
        styles.canvas,
        {
          opacity: masterOpacity,
          transform: [{ scale: masterScale }],
        },
      ]}
    >
      {/* Dynamic Ambient Background Illumination (Blue & Orange Gradients) */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <Svg width={SCREEN_W} height={SCREEN_H} style={StyleSheet.absoluteFill}>
          <Defs>
            <RadialGradient id="topBlueGlow" cx="20%" cy="15%" r="65%">
              <Stop offset="0%" stopColor={PALETTE.blueGlow} stopOpacity="0.45" />
              <Stop offset="50%" stopColor={PALETTE.blueDeep} stopOpacity="0.12" />
              <Stop offset="100%" stopColor={PALETTE.white} stopOpacity="0" />
            </RadialGradient>
            <RadialGradient id="bottomOrangeGlow" cx="85%" cy="80%" r="60%">
              <Stop offset="0%" stopColor={PALETTE.orangeWarm} stopOpacity="0.35" />
              <Stop offset="45%" stopColor={PALETTE.orangeVibrant} stopOpacity="0.10" />
              <Stop offset="100%" stopColor={PALETTE.white} stopOpacity="0" />
            </RadialGradient>
            <RadialGradient id="centerTrackGlow" cx="50%" cy="45%" r="45%">
              <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
              <Stop offset="60%" stopColor="#F0F8FF" stopOpacity="0.6" />
              <Stop offset="100%" stopColor={PALETTE.white} stopOpacity="0" />
            </RadialGradient>
          </Defs>
          <Rect x="0" y="0" width={SCREEN_W} height={SCREEN_H} fill={PALETTE.white} />
          <Rect x="0" y="0" width={SCREEN_W} height={SCREEN_H} fill="url(#topBlueGlow)" />
          <Rect x="0" y="0" width={SCREEN_W} height={SCREEN_H} fill="url(#bottomOrangeGlow)" />
          <Rect x="0" y="0" width={SCREEN_W} height={SCREEN_H} fill="url(#centerTrackGlow)" />
        </Svg>
      </View>

      {/* Main Center Stage */}
      <View style={styles.centerStage}>
        {/* Animated GSAP Geometric Track Assembly */}
        <Animated.View
          style={[
            styles.trackContainer,
            {
              opacity: trackEnterOpacity,
              transform: [{ scale: trackEnterScale }],
            },
          ]}
        >
          {/* Sonar Radar Wave */}
          <Animated.View
            style={[
              styles.radarRing,
              {
                opacity: radarOpacity,
                transform: [{ scale: radarScale }],
              },
            ]}
          />

          {/* Static Reference Tracks (Precision SVG Rings) */}
          <Svg width={280} height={280} viewBox="0 0 280 280" style={styles.svgTracks}>
            <Defs>
              <LinearGradient id="trackArcGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor={PALETTE.blueDeep} stopOpacity="0.8" />
                <Stop offset="50%" stopColor={PALETTE.blueGlow} stopOpacity="0.3" />
                <Stop offset="100%" stopColor={PALETTE.orangeVibrant} stopOpacity="0.8" />
              </LinearGradient>
            </Defs>

            {/* Outer Track Line */}
            <Circle
              cx="140"
              cy="140"
              r="126"
              stroke="#DDEAF4"
              strokeWidth="1.5"
              fill="none"
              strokeDasharray="3 6"
            />

            {/* Mid Track Line */}
            <Circle
              cx="140"
              cy="140"
              r="96"
              stroke="#E8EDF3"
              strokeWidth="1.5"
              fill="none"
            />

            {/* Decorative Active Arc */}
            <Circle
              cx="140"
              cy="140"
              r="96"
              stroke="url(#trackArcGrad)"
              strokeWidth="2.5"
              strokeDasharray="50 140"
              strokeLinecap="round"
              fill="none"
            />

            {/* Inner Track Ring */}
            <Circle
              cx="140"
              cy="140"
              r="70"
              stroke="#E2EBF2"
              strokeWidth="1.5"
              fill="none"
              strokeDasharray="2 4"
            />
          </Svg>

          {/* TRACK 1: Outer Orbit Runner (Vibrant Brand Blue #006199) */}
          <Animated.View
            style={[
              styles.orbitRingOuter,
              { transform: [{ rotate: spinOuter }] },
            ]}
          >
            {/* Primary Blue Runner Beacon */}
            <View style={styles.blueRunner}>
              <View style={styles.runnerCoreBlue} />
              <View style={styles.runnerGlowBlue} />
            </View>
            {/* Micro Satellite Trailing Dot */}
            <View style={styles.blueTrailingDot} />
          </Animated.View>

          {/* TRACK 2: Mid Orbit Runner (Vibrant Brand Orange #FF6701, Counter-Rotating) */}
          <Animated.View
            style={[
              styles.orbitRingMid,
              { transform: [{ rotate: spinMid }] },
            ]}
          >
            {/* Primary Orange Runner Beacon */}
            <View style={styles.orangeRunner}>
              <View style={styles.runnerCoreOrange} />
              <View style={styles.runnerGlowOrange} />
            </View>
            {/* Trailing Amber Satellite */}
            <View style={styles.orangeTrailingDot} />
          </Animated.View>

          {/* TRACK 3: Inner Orbital Pulse Ring */}
          <Animated.View
            style={[
              styles.orbitRingInner,
              {
                transform: [
                  { rotate: spinInner },
                  { scale: logoHaloPulse },
                ],
              },
            ]}
          >
            <View style={styles.innerTickDotBlue} />
            <View style={styles.innerTickDotOrange} />
          </Animated.View>

          {/* Central Elevated White Emblem Hub */}
          <Animated.View
            style={[
              styles.logoHub,
              {
                opacity: logoOpacity,
                transform: [{ scale: logoScale }, { translateY: logoFloat }],
              },
            ]}
          >
            <View style={styles.logoDisc}>
              <Image
                // eslint-disable-next-line @typescript-eslint/no-require-imports
                source={require('../../assets/logo-ustavia-removebg-preview.png')}
                style={styles.logoImage}
                resizeMode="contain"
              />
            </View>
          </Animated.View>
        </Animated.View>

        {/* Wordmark & Brand Typography */}
        <Animated.View
          style={[
            styles.brandBlock,
            {
              opacity: wordmarkOpacity,
              transform: [{ translateY: wordmarkTranslateY }],
            },
          ]}
        >
          <View style={styles.wordmarkRow}>
            <Text style={styles.wordmarkPrefix}>USTAVIA</Text>
            {/* Orange Power Accent Dot */}
            <View style={styles.brandAccentDot} />
          </View>

          {/* Cinematic Tagline / Pill */}
          <Animated.View
            style={[
              styles.taglinePill,
              {
                opacity: badgeOpacity,
                transform: [{ translateY: badgeTranslateY }],
              },
            ]}
          >
            <View style={styles.taglineAccentBar} />
            <Text style={styles.taglineText}>SKILLED WORKFORCE • ON DEMAND</Text>
            <View style={styles.taglineAccentBarOrange} />
          </Animated.View>
        </Animated.View>
      </View>

      {/* Bottom High-Tech GSAP Progress Track Bar */}
      <View style={styles.bottomSection}>
        <Animated.View
          style={[
            styles.loaderWrapper,
            { opacity: progressGlowOpacity },
          ]}
        >
          <View style={styles.trackLabelRow}>
            <View style={styles.statusIndicatorRow}>
              <View style={styles.statusPulseDot} />
              <Text style={styles.progressStatusText}>{progressLabel}</Text>
            </View>
            <Text style={styles.techVersionText}>v1.0.0 • PK</Text>
          </View>

          {/* Precision Track Tube */}
          <View style={styles.progressTube}>
            <Animated.View
              style={[
                styles.progressBarFill,
                { width: progressPercent },
              ]}
            >
              {/* Gradient Shimmer on fill */}
              <Svg width="100%" height={5} style={StyleSheet.absoluteFill}>
                <Defs>
                  <LinearGradient id="fillGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <Stop offset="0%" stopColor={PALETTE.blueDeep} />
                    <Stop offset="55%" stopColor={PALETTE.blueBright} />
                    <Stop offset="100%" stopColor={PALETTE.orangeVibrant} />
                  </LinearGradient>
                </Defs>
                <Rect x="0" y="0" width="100%" height="5" fill="url(#fillGrad)" rx="2.5" />
              </Svg>

              {/* Leading Energy Spark Head */}
              <View style={styles.leadingSpark} />
            </Animated.View>
          </View>
        </Animated.View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  canvas: {
    backgroundColor: PALETTE.white,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  centerStage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 40,
  },
  trackContainer: {
    width: 280,
    height: 280,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  svgTracks: {
    position: 'absolute',
  },
  radarRing: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 1.5,
    borderColor: PALETTE.blueGlow,
  },
  // Orbit Ring Outer (Radius 126 => Width 252)
  orbitRingOuter: {
    position: 'absolute',
    width: 252,
    height: 252,
    borderRadius: 126,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  blueRunner: {
    width: 14,
    height: 14,
    marginTop: -7,
    justifyContent: 'center',
    alignItems: 'center',
  },
  runnerCoreBlue: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: PALETTE.blueDeep,
    borderWidth: 1.5,
    borderColor: PALETTE.white,
  },
  runnerGlowBlue: {
    position: 'absolute',
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: 'rgba(10, 132, 255, 0.35)',
  },
  blueTrailingDot: {
    position: 'absolute',
    top: 14,
    right: 28,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: PALETTE.blueGlow,
    opacity: 0.8,
  },
  // Orbit Ring Mid (Radius 96 => Width 192)
  orbitRingMid: {
    position: 'absolute',
    width: 192,
    height: 192,
    borderRadius: 96,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  orangeRunner: {
    width: 14,
    height: 14,
    marginBottom: -7,
    justifyContent: 'center',
    alignItems: 'center',
  },
  runnerCoreOrange: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: PALETTE.orangeVibrant,
    borderWidth: 1.5,
    borderColor: PALETTE.white,
  },
  runnerGlowOrange: {
    position: 'absolute',
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: PALETTE.orangeGlow,
  },
  orangeTrailingDot: {
    position: 'absolute',
    bottom: 12,
    left: 20,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: PALETTE.orangeWarm,
    opacity: 0.8,
  },
  // Orbit Ring Inner (Radius 70 => Width 140)
  orbitRingInner: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 1,
    borderColor: 'rgba(0, 97, 153, 0.12)',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 2,
  },
  innerTickDotBlue: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: PALETTE.blueDeep,
  },
  innerTickDotOrange: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: PALETTE.orangeVibrant,
  },
  // Central Logo Hub
  logoHub: {
    width: 108,
    height: 108,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoDisc: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: PALETTE.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(0, 97, 153, 0.14)',
    shadowColor: PALETTE.blueDeep,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 10,
  },
  logoImage: {
    width: 72,
    height: 72,
  },
  brandBlock: {
    marginTop: 28,
    alignItems: 'center',
  },
  wordmarkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  wordmarkPrefix: {
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: 6,
    color: PALETTE.blueDeep,
    fontFamily: 'System',
  },
  brandAccentDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: PALETTE.orangeVibrant,
    marginLeft: 3,
    marginTop: -8,
  },
  taglinePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 10,
    backgroundColor: '#F3F8FC',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#D8E8F5',
  },
  taglineAccentBar: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: PALETTE.blueDeep,
  },
  taglineAccentBarOrange: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: PALETTE.orangeVibrant,
  },
  taglineText: {
    fontSize: 10.5,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: PALETTE.slateDark,
  },
  bottomSection: {
    width: '100%',
    paddingHorizontal: 36,
    paddingBottom: 48,
    alignItems: 'center',
  },
  loaderWrapper: {
    width: '100%',
    maxWidth: 320,
  },
  trackLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusIndicatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusPulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: PALETTE.orangeVibrant,
  },
  progressStatusText: {
    fontSize: 10.5,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: PALETTE.blueDeep,
  },
  techVersionText: {
    fontSize: 10,
    fontWeight: '600',
    color: PALETTE.slateMuted,
    letterSpacing: 0.5,
  },
  progressTube: {
    width: '100%',
    height: 5,
    borderRadius: 3,
    backgroundColor: '#E4EFF7',
    overflow: 'visible',
    position: 'relative',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
    position: 'relative',
  },
  leadingSpark: {
    position: 'absolute',
    right: -3,
    top: -2.5,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: PALETTE.orangeVibrant,
    borderWidth: 1.5,
    borderColor: PALETTE.white,
    shadowColor: PALETTE.orangeVibrant,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 4,
  },
});
