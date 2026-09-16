import { useEffect, useRef } from 'react';
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
  Defs,
  LinearGradient,
  Path,
  Rect,
  Stop,
} from 'react-native-svg';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

// Color scheme: #006199 (Brand Blue), #8ACFF8 (Sky Blue), #FF6701 (Vibrant Orange), #FEA82F (Warm Amber), and White
const COLORS = {
  blueDark: '#003E62',
  blueDeep: '#004F7D',
  blueBrand: '#006199',
  blueBright: '#007BC3',
  blueSky: '#8ACFF8',
  orangeBrand: '#FF6701',
  orangeWarm: '#FEA82F',
  white: '#FFFFFF',
};

const MIN_DISPLAY_MS = 2200;
const EXIT_FADE_MS = 400;

interface AnimatedSplashScreenProps {
  onFinish: () => void;
  ready: boolean;
}

export function AnimatedSplashScreen({ onFinish, ready }: AnimatedSplashScreenProps) {
  // Master container exit fade
  const containerOpacity = useRef(new Animated.Value(1)).current;

  // Middle sweeping arc entrance
  const arcTranslateY = useRef(new Animated.Value(120)).current;
  const arcScale = useRef(new Animated.Value(0.92)).current;
  const arcOpacity = useRef(new Animated.Value(0)).current;

  // Bottom energetic wave entrance & float
  const waveTranslateX = useRef(new Animated.Value(-60)).current;
  const waveTranslateY = useRef(new Animated.Value(70)).current;
  const waveOpacity = useRef(new Animated.Value(0)).current;
  const waveFloat = useRef(new Animated.Value(0)).current;

  // Center logo & wordmark reveal
  const logoScale = useRef(new Animated.Value(0.78)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoFloat = useRef(new Animated.Value(0)).current;
  const wordmarkOpacity = useRef(new Animated.Value(0)).current;
  const wordmarkTranslateY = useRef(new Animated.Value(16)).current;

  useEffect(() => {
    // 1. Middle blue sweeping arc animates in
    Animated.parallel([
      Animated.timing(arcOpacity, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(arcTranslateY, {
        toValue: 0,
        duration: 700,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.spring(arcScale, {
        toValue: 1,
        friction: 7,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    // 2. Bottom orange wave swoops in from bottom-left
    Animated.sequence([
      Animated.delay(150),
      Animated.parallel([
        Animated.timing(waveOpacity, {
          toValue: 1,
          duration: 550,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.spring(waveTranslateX, {
          toValue: 0,
          friction: 6.5,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.spring(waveTranslateY, {
          toValue: 0,
          friction: 6.5,
          tension: 40,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      // Gentle living breathing loop for the wave
      Animated.loop(
        Animated.sequence([
          Animated.timing(waveFloat, {
            toValue: -5,
            duration: 2200,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(waveFloat, {
            toValue: 3,
            duration: 2200,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ]),
      ).start();
    });

    // 3. Central logo pops in with smooth spring
    Animated.sequence([
      Animated.delay(280),
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 550,
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
      Animated.loop(
        Animated.sequence([
          Animated.timing(logoFloat, {
            toValue: -4,
            duration: 1800,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(logoFloat, {
            toValue: 0,
            duration: 1800,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ]),
      ).start();
    });

    // 4. "USTAVIA" wordmark and tagline reveal
    Animated.sequence([
      Animated.delay(480),
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
    ]).start();
  }, []);

  // Exit trigger once app fonts/state are ready
  useEffect(() => {
    let cancelled = false;
    const minTimer = setTimeout(() => {
      if (cancelled) return;
      if (ready) executeExit();
    }, MIN_DISPLAY_MS);

    function executeExit() {
      Animated.timing(containerOpacity, {
        toValue: 0,
        duration: EXIT_FADE_MS,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished && !cancelled) onFinish();
      });
    }

    return () => {
      cancelled = true;
      clearTimeout(minTimer);
    };
  }, [ready]);

  return (
    <Animated.View
      style={[
        StyleSheet.absoluteFill,
        styles.container,
        { opacity: containerOpacity },
      ]}
    >
      {/* 1. Base Deep Blue Background (Matches top deep field in Lloyds design) */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <Svg width={SCREEN_W} height={SCREEN_H} style={StyleSheet.absoluteFill}>
          <Defs>
            <LinearGradient id="baseBlueGrad" x1="0%" y1="0%" x2="50%" y2="100%">
              <Stop offset="0%" stopColor={COLORS.blueDark} />
              <Stop offset="100%" stopColor={COLORS.blueDeep} />
            </LinearGradient>
          </Defs>
          <Rect x="0" y="0" width={SCREEN_W} height={SCREEN_H} fill="url(#baseBlueGrad)" />
        </Svg>
      </View>

      {/* 2. Middle Sweeping Curved Arc (Matches middle green field in Lloyds design) */}
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          {
            opacity: arcOpacity,
            transform: [
              { translateY: arcTranslateY },
              { scale: arcScale },
            ],
          },
        ]}
        pointerEvents="none"
      >
        <Svg
          width={SCREEN_W}
          height={SCREEN_H}
          viewBox="0 0 400 800"
          preserveAspectRatio="none"
          style={StyleSheet.absoluteFill}
        >
          <Defs>
            <LinearGradient id="middleArcGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor={COLORS.blueBrand} />
              <Stop offset="60%" stopColor={COLORS.blueBright} />
              <Stop offset="100%" stopColor={COLORS.blueBrand} />
            </LinearGradient>
            <LinearGradient id="arcRimHighlight" x1="0%" y1="0%" x2="100%" y2="0%">
              <Stop offset="0%" stopColor={COLORS.blueSky} stopOpacity="0.6" />
              <Stop offset="60%" stopColor={COLORS.white} stopOpacity="0.3" />
              <Stop offset="100%" stopColor={COLORS.blueSky} stopOpacity="0.1" />
            </LinearGradient>
          </Defs>

          {/* Sweeping dome arc path */}
          <Path
            d="M 0 275 C 120 195, 260 172, 400 195 L 400 800 L 0 800 Z"
            fill="url(#middleArcGrad)"
          />

          {/* Thin subtle rim accent tracing the top edge of the dome */}
          <Path
            d="M 0 275 C 120 195, 260 172, 400 195"
            stroke="url(#arcRimHighlight)"
            strokeWidth="2"
            fill="none"
          />
        </Svg>
      </Animated.View>

      {/* 3. Bottom Sweeping Wave / Crest (Matches bottom-left bright lime wave in Lloyds design) */}
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          {
            opacity: waveOpacity,
            transform: [
              { translateX: waveTranslateX },
              { translateY: waveTranslateY },
              { translateY: waveFloat },
            ],
          },
        ]}
        pointerEvents="none"
      >
        <Svg
          width={SCREEN_W}
          height={SCREEN_H}
          viewBox="0 0 400 800"
          preserveAspectRatio="none"
          style={StyleSheet.absoluteFill}
        >
          <Defs>
            <LinearGradient id="orangeWaveGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor={COLORS.orangeBrand} />
              <Stop offset="55%" stopColor={COLORS.orangeWarm} />
              <Stop offset="100%" stopColor={COLORS.orangeBrand} />
            </LinearGradient>
            <LinearGradient id="waveRimGlow" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor={COLORS.white} stopOpacity="0.5" />
              <Stop offset="40%" stopColor={COLORS.orangeWarm} stopOpacity="0.8" />
              <Stop offset="100%" stopColor={COLORS.orangeBrand} stopOpacity="0.2" />
            </LinearGradient>
          </Defs>

          {/* Secondary subtle shadow layer behind the wave */}
          <Path
            d="M 0 522 C 38 512, 85 492, 114 502 C 86 567, 98 632, 122 642 C 162 642, 192 572, 242 572 C 292 572, 312 692, 324 792 L 0 792 Z"
            fill="rgba(0, 35, 60, 0.25)"
          />

          {/* Iconic organic wave shape (tip + trough + billowed dome) */}
          <Path
            d="M 0 530 C 35 520, 80 500, 108 510 C 80 575, 92 640, 115 650 C 155 650, 185 580, 235 580 C 285 580, 305 700, 316 800 L 0 800 Z"
            fill="url(#orangeWaveGrad)"
          />

          {/* Crisp highlight ridge along the wave crest */}
          <Path
            d="M 0 530 C 35 520, 80 500, 108 510 C 80 575, 92 640, 115 650 C 155 650, 185 580, 235 580 C 285 580, 305 700, 316 800"
            stroke="url(#waveRimGlow)"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
        </Svg>
      </Animated.View>

      {/* 4. Center Brand Lockup (Logo + "USTAVIA" wordmark, exactly centered like Lloyds) */}
      <View style={styles.centerContainer}>
        {/* Emblem */}
        <Animated.View
          style={[
            styles.logoWrapper,
            {
              opacity: logoOpacity,
              transform: [
                { scale: logoScale },
                { translateY: logoFloat },
              ],
            },
          ]}
        >
          <Image
            // eslint-disable-next-line @typescript-eslint/no-require-imports
            source={require('../../assets/logo-ustavia-removebg-preview.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </Animated.View>

        {/* Wordmark */}
        <Animated.View
          style={[
            styles.wordmarkWrapper,
            {
              opacity: wordmarkOpacity,
              transform: [{ translateY: wordmarkTranslateY }],
            },
          ]}
        >
          <Text style={styles.wordmark}>USTAVIA</Text>
          <Text style={styles.tagline}>TRUSTED HELP • ON DEMAND</Text>
        </Animated.View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.blueDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerContainer: {
    position: 'absolute',
    top: '36%',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  logoWrapper: {
    width: 110,
    height: 110,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImage: {
    width: 100,
    height: 100,
    // Add clean drop shadow for elevation
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },
  wordmarkWrapper: {
    marginTop: 14,
    alignItems: 'center',
  },
  wordmark: {
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: 5,
    color: COLORS.white,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.35)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  tagline: {
    marginTop: 6,
    fontSize: 11.5,
    fontWeight: '700',
    letterSpacing: 2,
    color: COLORS.blueSky,
    textAlign: 'center',
    opacity: 0.95,
  },
});
