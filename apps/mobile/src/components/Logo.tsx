import { Image, StyleSheet } from 'react-native';

interface LogoProps {
  size?: number;
}

/** The Ustavia mark — orange shovel/pickaxe forming a "U" over a handshake. PLANNING.md §5: "Use it as a lockup ... for splash/auth screens." */
export function Logo({ size = 64 }: LogoProps) {
  return (
    // eslint-disable-next-line @typescript-eslint/no-require-imports -- RN's static asset resolution needs a literal require()
    <Image source={require('../../assets/logo-ustavia.jpg')} style={[styles.logo, { width: size, height: size }]} resizeMode="contain" />
  );
}

const styles = StyleSheet.create({
  logo: { alignSelf: 'center', borderRadius: 12 },
});
