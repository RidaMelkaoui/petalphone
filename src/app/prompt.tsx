import { Redirect, useRouter } from 'expo-router';
import React from 'react';

import { AppScreen, BodyText, Mascot, PaperCard, PetalButton, ScreenTop, Spacer } from '@/components/ui';
import { useGame } from '@/state/game-context';

export default function PromptScreen() {
  const router = useRouter();
  const game = useGame();
  const session = game.activeSession;
  if (!session) return <Redirect href="/" />;

  return (
    <AppScreen testID="prompt-screen">
      <ScreenTop eyebrow={`${game.currentPlayer}'s turn`} title="Remember this" body="You will pass it on as a drawing. Keep the words to yourself." />
      <Mascot size={130} />
      <PaperCard title="Your prompt">{game.currentClue}</PaperCard>
      <Spacer />
      <BodyText centered small>Only {game.currentPlayer} should see this.</BodyText>
      <PetalButton onPress={() => { game.showDrawingTurn(); router.replace('/draw'); }}>I remember it</PetalButton>
    </AppScreen>
  );
}

