import { useRouter } from 'expo-router';
import React from 'react';
import { Text, View } from 'react-native';

import { AppScreen, BodyText, ChoiceChip, PaperCard, PetalButton, ScreenTop, SectionLabel, Spacer } from '@/components/ui';
import { colors, fonts, spacing } from '@/constants/theme';
import { promptDecks } from '@/data/decks';
import { useGame } from '@/state/game-context';
import type { Pace } from '@/types/game';

export default function OptionsScreen() {
  const router = useRouter();
  const game = useGame();

  return (
    <AppScreen testID="options-screen">
      <ScreenTop back title="Set the mood" body="Choose how long you want to play. You can change this next time." />
      <View style={{ gap: spacing.sm }}>
        <SectionLabel>Rounds</SectionLabel>
        <View accessibilityRole="radiogroup" style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
          {([1, 3, 5] as const).map((count) => <ChoiceChip key={count} label={String(count)} selected={game.roundCount === count} onPress={() => game.setRoundCount(count)} />)}
        </View>
      </View>
      <View style={{ gap: spacing.sm }}>
        <SectionLabel>Pace</SectionLabel>
        <View accessibilityRole="radiogroup" style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
          {(['cozy', 'classic', 'quick'] as Pace[]).map((pace) => (
            <ChoiceChip key={pace} label={pace[0].toUpperCase() + pace.slice(1)} selected={game.pace === pace} onPress={() => game.setPace(pace)} />
          ))}
        </View>
        <BodyText small>
          {game.pace === 'cozy' ? 'No timer. Take the time your group needs.' : game.pace === 'classic' ? '60 seconds to draw and 30 seconds to guess.' : '30 seconds to draw and 15 seconds to guess.'}
        </BodyText>
      </View>
      <View style={{ gap: spacing.sm }}>
        <SectionLabel>Prompt deck</SectionLabel>
        {promptDecks.map((deck) => {
          const locked = deck.paid && !game.fullGardenUnlocked;
          return (
            <PaperCard key={deck.id} title={deck.title} selected={game.selectedDeckId === deck.id} onPress={() => locked ? router.push('/full-garden') : game.setSelectedDeckId(deck.id)}>
              <View style={{ gap: 6 }}>
                <BodyText small>{deck.description} {deck.prompts.length} prompts.</BodyText>
                {locked ? <Text style={{ color: colors.coral, fontFamily: fonts.bodyBold, fontSize: 12 }}>Full Garden</Text> : null}
              </View>
            </PaperCard>
          );
        })}
        {game.fullGardenUnlocked ? game.customDecks.map((deck) => (
          <PaperCard key={deck.id} title={deck.title} selected={game.selectedDeckId === deck.id} onPress={() => game.setSelectedDeckId(deck.id)}>
            <BodyText small>Your deck · {deck.prompts.length} prompts.</BodyText>
          </PaperCard>
        )) : null}
      </View>
      <Spacer />
      <PetalButton onPress={() => { game.startSession(); router.replace('/pass'); }}>Start game</PetalButton>
    </AppScreen>
  );
}

