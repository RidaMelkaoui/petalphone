import { Fraunces_600SemiBold, Fraunces_700Bold, useFonts as useFraunces } from '@expo-google-fonts/fraunces';
import { Nunito_400Regular, Nunito_600SemiBold, Nunito_700Bold, useFonts as useNunito } from '@expo-google-fonts/nunito';
import { Stack } from 'expo-router/stack';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { colors } from '@/constants/theme';
import { GameProvider } from '@/state/game-context';

SplashScreen.preventAutoHideAsync().catch(() => undefined);

export default function RootLayout() {
  const [frauncesLoaded] = useFraunces({ Fraunces_600SemiBold, Fraunces_700Bold });
  const [nunitoLoaded] = useNunito({ Nunito_400Regular, Nunito_600SemiBold, Nunito_700Bold });
  const fontsLoaded = frauncesLoaded && nunitoLoaded;

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync().catch(() => undefined);
  }, [fontsLoaded]);

  if (!fontsLoaded) return <View style={{ flex: 1, backgroundColor: colors.cream }} />;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <GameProvider>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerShown: false,
            animation: 'fade_from_bottom',
            contentStyle: { backgroundColor: colors.cream },
            gestureEnabled: false,
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="how-to-play" options={{ presentation: 'formSheet', sheetGrabberVisible: true, sheetAllowedDetents: [0.55] }} />
          <Stack.Screen name="full-garden" options={{ presentation: 'modal', gestureEnabled: true }} />
          <Stack.Screen name="custom-deck-editor" options={{ presentation: 'formSheet', sheetGrabberVisible: true, sheetAllowedDetents: [0.9] }} />
        </Stack>
      </GameProvider>
    </GestureHandlerRootView>
  );
}
