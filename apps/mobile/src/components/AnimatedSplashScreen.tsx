import { useEffect, useRef } from 'react';
import { Animated, Dimensions, Easing, Image, StyleSheet, Text, View } from 'react-native';
import Svg, { Defs, LinearGradient, Path, Stop } from 'react-native-svg';
import { colors } from '@ustavia/shared';

const { width: SCREEN_W } = Dimensions.get('window');

/**
 * Same organic path data as assets/blob-haikei.svg (the file is the design
 * source of truth for this shape — kept in sync by eye when that file
 * changes), reconstructed here as JSX so react-native-svg's primitives can
 * be driven by an Animated.Value directly, which a static <Image> of the
 * SVG or react-native-svg's <SvgXml> can't do.
 */
const BLOB_PATH =
  'M214 -263.7C274.4 -250.7 318.4 -184.2 397.7 -93.1C477 -2 591.6 113.7 561 174.5C530.5 235.2 354.9 241 237.2 321.2C119.5 401.5 59.8 556.3 -4.4 562.3C-68.6 568.4 -137.1 425.8 -237.2 339.8C-337.2 253.8 -468.7 224.4 -541.4 142.4C-614.1 60.5 -628 -74.1 -546.2 -131.6C-464.3 -189.1 -286.7 -169.7 -179.7 -167.6C-72.7 -165.5 -36.4 -180.7 20.2 -208.6C76.8 -236.4 153.6 -276.8 214 -263.7';

const MIN_DISPLAY_MS = 2200;
const EXIT_FADE_MS = 450;

interface AnimatedSplashScreenProps {
  /** Called once the intro has played its minimum duration and the exit fade has finished. */
  onFinish: () => void;
  /** True once the real app (fonts, etc.) is actually ready — the exit only starts after both this and the minimum duration are satisfied, so a slow device never cuts the animation short. */
  ready: boolean;
}

/**
 * The first thing anyone sees — replaces expo-splash-screen's static native
 * splash the instant JS takes over (App.tsx calls SplashScreen.hideAsync()
 * as soon as this mounts) with a slow-breathing brand-orange blob (recolored
 * from assets/blob-haikei.svg), soft sonar rings, and the logo/wordmark
 * settling into place — "elegant" meaning restrained, slow easing and a
 * handful of soft motions rather than anything bouncy or busy.
 */
export function AnimatedSplashScreen({ onFinish, ready }: AnimatedSplashScreenProps) {
  const blobScale = useRef(new Animated.Value(0.92)).current;
  const blobRotate = useRef(new Animated.Value(0)).current;
  const ring1 = useRef(new Animated.Value(0)).current;
  const ring2 = useRef(new Animated.Value(0)).current;
  const ring3 = useRef(new Animated.Value(0)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.72)).current;
  const logoFloat = useRef(new Animated.Value(0)).current;
  const wordmarkOpacity = useRef(new Animated.Value(0)).current;
  const wordmarkTranslateY = useRef(new Animated.Value(10)).current;
  const containerOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Ambient background — a slow breathing scale and a near-imperceptibly
    // slow full rotation, both infinite, both running throughout.
    Animated.loop(
      Animated.sequence([
        Animated.timing(blobScale, { toValue: 1.06, duration: 4200, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(blobScale, { toValue: 0.92, duration: 4200, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ]),
    ).start();
    Animated.loop(
      Animated.timing(blobRotate, { toValue: 1, duration: 40000, easing: Easing.linear, useNativeDriver: true }),
    ).start();

    // Soft sonar rings expanding out from behind the logo, staggered.
    const pulse = (value: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(value, { toValue: 1, duration: 2400, easing: Easing.out(Easing.quad), useNativeDriver: true }),
          Animated.timing(value, { toValue: 0, duration: 0, useNativeDriver: true }),
        ]),
      );
    pulse(ring1, 0).start();
    pulse(ring2, 800).start();
    pulse(ring3, 1600).start();

    // Logo settles in with a gentle overshoot, then floats slowly forever.
    Animated.parallel([
      Animated.spring(logoScale, { toValue: 1, friction: 7, tension: 50, useNativeDriver: true }),
      Animated.timing(logoOpacity, { toValue: 1, duration: 700, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
    ]).start(() => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(logoFloat, { toValue: -6, duration: 1900, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
          Animated.timing(logoFloat, { toValue: 0, duration: 1900, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        ]),
      ).start();
    });

    // Wordmark follows once the logo has mostly landed.
    Animated.sequence([
      Animated.delay(420),
      Animated.parallel([
        Animated.timing(wordmarkOpacity, { toValue: 1, duration: 550, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
        Animated.timing(wordmarkTranslateY, { toValue: 0, duration: 550, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      ]),
    ]).start();
  }, [blobScale, blobRotate, ring1, ring2, ring3, logoOpacity, logoScale, logoFloat, wordmarkOpacity, wordmarkTranslateY]);

  // Exit only once BOTH the minimum display time has passed AND the real
  // app says it's ready — whichever finishes last. Never cuts the intro
  // short, and never hangs past a font-load hiccup indefinitely either
  // since a real device resolves `ready` in well under a second normally.
  useEffect(() => {
    let cancelled = false;
    const minTimer = setTimeout(() => {
      if (cancelled) return;
      if (ready) fadeOutAndFinish();
    }, MIN_DISPLAY_MS);

    function fadeOutAndFinish() {
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
    // `containerOpacity`/`onFinish` intentionally excluded: this should only
    // re-run when `ready` flips, not restart the min-display timer on every
    // render (containerOpacity is a stable ref; onFinish is provided by the
    // caller as an inline setState callback).
  }, [ready]);

  const rotate = blobRotate.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  const ringStyle = (value: Animated.Value) => ({
    transform: [{ scale: value.interpolate({ inputRange: [0, 1], outputRange: [0.5, 2.4] }) }],
    opacity: value.interpolate({ inputRange: [0, 1], outputRange: [0.32, 0] }),
  });

  return (
    <Animated.View style={[StyleSheet.absoluteFill, styles.container, { opacity: containerOpacity }]}>
      <Animated.View
        style={[StyleSheet.absoluteFill, styles.blobWrap, { transform: [{ scale: blobScale }, { rotate }] }]}
      >
        <Svg
          width={SCREEN_W * 1.8}
          height={SCREEN_W * 1.8 * (960 / 540)}
          viewBox="0 0 540 960"
          style={{ opacity: 0.5 }}
        >
          <Defs>
            <LinearGradient id="splashBlobGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor={colors.brandOrangeLight} />
              <Stop offset="55%" stopColor={colors.brandOrange} />
              <Stop offset="100%" stopColor={colors.brandOrangeDark} />
            </LinearGradient>
          </Defs>
          <Path d={BLOB_PATH} fill="url(#splashBlobGrad)" transform="translate(288 332)" />
        </Svg>
      </Animated.View>

      <View style={styles.center}>
        <View style={styles.ringHost} pointerEvents="none">
          <Animated.View style={[styles.ring, ringStyle(ring1)]} />
          <Animated.View style={[styles.ring, ringStyle(ring2)]} />
          <Animated.View style={[styles.ring, ringStyle(ring3)]} />
        </View>

        <Animated.View
          style={{
            opacity: logoOpacity,
            transform: [{ scale: logoScale }, { translateY: logoFloat }],
          }}
        >
          <Image
            // eslint-disable-next-line @typescript-eslint/no-require-imports -- RN's static asset resolution needs a literal require()
            source={require('../../assets/logo-ustavia-removebg-preview.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </Animated.View>

        <Animated.View style={{ opacity: wordmarkOpacity, transform: [{ translateY: wordmarkTranslateY }] }}>
          <Text style={styles.wordmark}>USTAVIA</Text>
          <Text style={styles.tagline}>Trusted help, on demand</Text>
        </Animated.View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  blobWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringHost: {
    position: 'absolute',
    width: 168,
    height: 168,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: {
    position: 'absolute',
    width: 168,
    height: 168,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: colors.brandOrange,
  },
  logo: {
    width: 148,
    height: 148,
  },
  wordmark: {
    marginTop: 22,
    fontSize: 26,
    fontWeight: '700',
    letterSpacing: 4,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  tagline: {
    marginTop: 6,
    fontSize: 13,
    letterSpacing: 1,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
