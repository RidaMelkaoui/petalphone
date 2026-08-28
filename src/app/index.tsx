import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, Pressable, Text, View } from 'react-native';

import { AppScreen, BodyText, Mascot, PaperCard, PetalButton, Spacer } from '@/components/ui';
import { colors, fonts, spacing } from '@/constants/theme';
import { useGame } from '@/state/game-context';

export default function HomeScreen() {
  const router = useRouter();
  const game = useGame();

  return (
    <AppScreen testID="home-screen" contentStyle={{ paddingTop: spacing.xl }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Text style={{ color: colors.cocoaSoft, fontFamily: fonts.bodyBold, fontSize: 12, letterSpacing: 1.4 }}>PETALPHONE</Text>
        <Pressable accessibilityRole="button" onPress={() => router.push('/settings')} hitSlop={10}>
          <Text style={{ color: colors.cocoa, fontFamily: fonts.bodyBold, fontSize: 15 }}>Settings</Text>
        </Pressable>
      </View>
      <Mascot size={168} />
      <View style={{ alignItems: 'center', gap: spacing.sm }}>
        <Text accessibilityRole="header" style={{ color: colors.cocoa, fontFamily: fonts.display, fontSize: 42, lineHeight: 46, textAlign: 'center' }}>
          Pass, draw, guess
        </Text>
        <BodyText centered>One phone. A room full of people. See where each idea ends up.</BodyText>
      </View>
      <Spacer />
      <View style={{ gap: spacing.sm }}>
        {game.activeSession ? (
          <>
            <PetalButton tone="coral" onPress={() => router.push('/pass')}>Resume your game</PetalButton>
            <PetalButton tone="secondary" onPress={() => Alert.alert('Start over?', 'The unfinished game will be removed.', [
              { text: 'Keep playing', style: 'cancel' },
              { text: 'Start over', style: 'destructive', onPress: () => { game.abandonSession(); router.push('/players'); } },
            ])}>Start over</PetalButton>
          </>
        ) : <PetalButton onPress={() => router.push('/players')}>Start a game</PetalButton>}
        {game.history.length > 0 ? (
          <PetalButton tone="secondary" onPress={() => router.push('/garden')}>
            Your garden
          </PetalButton>
        ) : null}
        <PetalButton tone="secondary" onPress={() => router.push('/how-to-play')}>How to play</PetalButton>
      </View>
      <PaperCard title={game.fullGardenUnlocked ? 'Full Garden is ready' : 'Full Garden'} onPress={() => router.push('/full-garden')}>
        {game.fullGardenUnlocked
          ? 'Choose from ten decks, make your own prompts and change the paper mood.'
          : '480 more prompts, custom decks and five extra paper themes.'}
      </PaperCard>
      <BodyText centered small>No ads. No account. Game history stays on this phone.</BodyText>
    </AppScreen>
  );
}
