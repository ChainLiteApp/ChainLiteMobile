import 'react-native-gesture-handler';
import 'react-native-reanimated';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { useEffect } from 'react';

import { useColorScheme } from '@/hooks/useColorScheme';
import { initializeApiBaseUrl } from '@/src/services/blockchain';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    // Set base URL from env/secure storage/platform default
    initializeApiBaseUrl();
  }, []);

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="mining-tutorial" options={{ headerShown: false }} />
        <Stack.Screen name="network-builder" options={{ headerShown: false }} />
        <Stack.Screen name="block-explorer" options={{ headerShown: false }} />
        <Stack.Screen name="consensus-challenge" options={{ headerShown: false }} />
        <Stack.Screen name="mine" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
        <Stack.Screen name='wallet' options={ {headerShown: false} } />
        <Stack.Screen name='send-transaction' options={ {headerShown: false} } />
      </Stack>
    </ThemeProvider>
  );
}
