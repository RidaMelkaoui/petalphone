import { Redirect, useRouter } from 'expo-router';
import React from 'react';
import { Text, View } from 'react-native';

import { AppScreen, BodyText, PetalButton, Spacer } from '@/components/ui';
import { colors, fonts, radii, spacing } from '@/constants/theme';
import { useGame } from '@/state/game-context';

export default function PassScreen() {
  const router = useRouter();
  const game = useGame();
  const session = game.activeSession;
  if (!session) return <Redirect href="/" />;
  const nextRoute = session.phase === 'prompt' ? '/prompt' : session.phase === 'draw' ? '/draw' : session.phase === 'guess' ? '/guess' : '/reveal';

  return (
    <AppScreen testID="pass-screen" contentStyle={{ justifyContent: 'center' }}>
      <Spacer />
      <View style={{ alignItems: 'center', gap: spacing.md, borderWidth: 1, borderColor: colors.border, borderRadius: radii.large, backgroundColor: colors.surface, padding: spacing.xl }}>
        <Text style={{ color: colors.cocoaSoft, fontFamily: fonts.bodyBold, fontSize: 12, letterSpacing: 1.2, textTransform: 'uppercase' }}>Pass the phone</Text>
        <Text accessibilityRole="header" style={{ color: colors.cocoa, fontFamily: fonts.display, fontSize: 42, textAlign: 'center' }}>{game.currentPlayer}</Text>
        <BodyText centered>Only {game.currentPlayer} should look at the next screen.</BodyText>
        <BodyText centered small>Keep the screen turned away until {game.currentPlayer} taps ready.</BodyText>
        <PetalButton onPress={() => router.replace(nextRoute)}>I&apos;m ready</PetalButton>
      </View>
      <Spacer />
      <BodyText centered small>Round {session.roundIndex + 1} of {session.roundCount}</BodyText>
    </AppScreen>
  );
}
