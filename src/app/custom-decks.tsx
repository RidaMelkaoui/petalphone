import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, View } from 'react-native';

import { AppScreen, BodyText, PaperCard, PetalButton, ScreenTop, Spacer } from '@/components/ui';
import { spacing } from '@/constants/theme';
import { useGame } from '@/state/game-context';

export default function CustomDecksScreen() {
  const router = useRouter();
  const game = useGame();

  return (
    <AppScreen testID="custom-decks-screen">
      <ScreenTop back title="Your prompt decks" body="Make a deck for your group. Everything stays on this phone." />
      <View style={{ gap: spacing.sm }}>
        {game.customDecks.length === 0 ? <PaperCard title="No decks yet">Start with five prompts. You can add more whenever you like.</PaperCard> : null}
        {game.customDecks.map((deck) => (
          <PaperCard key={deck.id} title={deck.title} selected={game.selectedDeckId === deck.id}>
            <View style={{ gap: spacing.sm }}>
              <BodyText small>{deck.prompts.length} prompts.</BodyText>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs }}>
                <PetalButton
                  compact
                  tone="secondary"
                  disabled={game.selectedDeckId === deck.id}
                  onPress={() => game.setSelectedDeckId(deck.id)}
                >
                  {game.selectedDeckId === deck.id ? 'Selected' : 'Use this deck'}
                </PetalButton>
                <PetalButton compact tone="ghost" onPress={() => Alert.alert('Delete this deck?', 'This removes the deck from this phone.', [
                  { text: 'Keep it', style: 'cancel' },
                  { text: 'Delete', style: 'destructive', onPress: () => game.deleteCustomDeck(deck.id) },
                ])}>Delete</PetalButton>
              </View>
            </View>
          </PaperCard>
        ))}
      </View>
      <Spacer />
      <PetalButton onPress={() => router.push('/custom-deck-editor')}>Make a new deck</PetalButton>
    </AppScreen>
  );
}
