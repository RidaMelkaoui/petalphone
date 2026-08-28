import { Redirect, useRouter } from 'expo-router';
import React from 'react';

import { ChainView } from '@/components/chain-view';
import { AppScreen, BodyText, Mascot, PetalButton, ScreenTop } from '@/components/ui';
import { useGame } from '@/state/game-context';

export default function RevealScreen() {
  const router = useRouter();
  const game = useGame();
  const session = game.activeSession;
  if (!session) return <Redirect href="/" />;
  const hasMoreRounds = session.roundIndex + 1 < session.roundCount;

  return (
    <AppScreen testID="reveal-screen">
      <Mascot kind="flower" size={112} />
      <ScreenTop title="Here's how it grew" body="Read from the top. No one saw the full chain until now." />
      <ChainView entries={session.entries} revealStyle={game.preferences.revealStyle} />
      <PetalButton onPress={() => { if (hasMoreRounds) { game.beginNextRound(); router.replace('/pass'); } else { router.replace('/summary'); } }}>
        {hasMoreRounds ? 'Next chain' : 'Finish game'}
      </PetalButton>
      <BodyText centered small>Round {session.roundIndex + 1} of {session.roundCount}</BodyText>
    </AppScreen>
  );
}
