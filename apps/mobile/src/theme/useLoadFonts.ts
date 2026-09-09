import { Poppins_400Regular, Poppins_600SemiBold, Poppins_700Bold, useFonts } from '@expo-google-fonts/poppins';

/** Headings use Poppins; body text stays on the system font for low-end Android perf. */
export function useLoadFonts(): boolean {
  const [loaded] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });
  return loaded;
}
