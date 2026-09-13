import { useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { QueryClientProvider } from '@tanstack/react-query';

import { queryClient } from './src/api/queryClient';
import { AnimatedSplashScreen } from './src/components/AnimatedSplashScreen';
import { RootNavigator } from './src/navigation/RootNavigator';
import { ThemeProvider } from './src/theme/ThemeProvider';
import { useLoadFonts } from './src/theme/useLoadFonts';

void SplashScreen.preventAutoHideAsync();

export default function App() {
  const fontsLoaded = useLoadFonts();
  const [showIntro, setShowIntro] = useState(true);
  const nativeSplashHidden = useRef(false);

  useEffect(() => {
    // Hand off from expo-splash-screen's static native splash to our own
    // animated one the instant we can render — not once fonts are ready —
    // so there's a single swap, not a swap-then-swap-again.
    if (!nativeSplashHidden.current) {
      nativeSplashHidden.current = true;
      void SplashScreen.hideAsync();
    }
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <View style={{ flex: 1 }}>
              {fontsLoaded && (
                <>
                  <RootNavigator />
                  <StatusBar style="dark" />
                </>
              )}
              {showIntro && <AnimatedSplashScreen ready={fontsLoaded} onFinish={() => setShowIntro(false)} />}
            </View>
          </ThemeProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
