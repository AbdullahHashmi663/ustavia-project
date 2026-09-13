import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View, type ViewStyle } from 'react-native';

import { useTheme } from '../theme/ThemeProvider';

interface SkeletonProps {
  width?: number | `${number}%`;
  height?: number;
  style?: ViewStyle;
  radius?: number;
}

/** Pulsing placeholder block for loading states — used in place of a spinner wherever the eventual content's shape (a card, a line of text) is already known. */
export function Skeleton({ width = '100%', height = 16, style, radius }: SkeletonProps) {
  const { colors, radii } = useTheme();
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 700, easing: Easing.ease, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.4, duration: 700, easing: Easing.ease, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        styles.block,
        { width, height, borderRadius: radius ?? radii.sm, backgroundColor: colors.border, opacity },
        style,
      ]}
    />
  );
}

/** Stacked skeleton lines standing in for a JobCard/list-row while data loads. */
export function SkeletonCard() {
  const { spacing } = useTheme();
  return (
    <View style={{ gap: spacing.sm, padding: spacing.lg }}>
      <Skeleton width="60%" height={14} />
      <Skeleton width="90%" height={12} />
      <Skeleton width="40%" height={12} />
    </View>
  );
}

const styles = StyleSheet.create({
  block: {},
});
