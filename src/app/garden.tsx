import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { ChainView } from '@/components/chain-view';
import { AppScreen, BodyText, Mascot, PaperCard, PetalButton, ScreenTop, Spacer } from '@/components/ui';
import { colors, fonts, radii, spacing } from '@/constants/theme';
import { getDeckTitle, useGame } from '@/state/game-context';

function dayLabel(value: string) {
  const date = new Date(value);
  const today = new Date();
  if (date.toDateString() === today.toDateString()) return 'Today';
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export default function GardenScreen() {
  const router = useRouter();
  const game = useGame();
  const [openSessionId, setOpenSessionId] = useState(game.lastCompletedSession?.id ?? '');
  const openSession = useMemo(() => game.history.find((session) => session.id === openSessionId), [game.history, openSessionId]);

  return (
    <AppScreen testID="garden-screen">
      <Mascot kind="flower" size={118} />
      <ScreenTop title="Your little garden" body="Finished chains live here on this phone. Nothing is uploaded." />

      {game.history.length === 0 ? (
        <PaperCard title="A quiet patch of soil">Finish a game and your first chain will grow here.</PaperCard>
      ) : (
        <View style={{ gap: spacing.sm }}>
          {game.history.map((session) => {
            const open = session.id === openSessionId;
            return (
              <Pressable
                key={session.id}
                accessibilityRole="button"
                accessibilityState={{ expanded: open }}
                onPress={() => setOpenSessionId(open ? '' : session.id)}
                style={({ pressed }) => ({
                  gap: 4,
                  borderWidth: 1,
                  borderColor: open ? colors.leaf : colors.border,
                  borderRadius: radii.medium,
                  backgroundColor: colors.surface,
                  opacity: pressed ? 0.72 : 1,
                  padding: spacing.md,
                })}
              >
                <Text style={{ color: colors.cocoa, fontFamily: fonts.displayRegular, fontSize: 19 }}>{dayLabel(session.completedAt)} · {session.players.length} players</Text>
                <BodyText small>{getDeckTitle(session.deckId, game.customDecks)} · {session.chains.length} {session.chains.length === 1 ? 'chain' : 'chains'} · {session.reaction}</BodyText>
              </Pressable>
            );
          })}
        </View>
      )}

      {openSession ? (
        <View style={{ gap: spacing.md }}>
          <Text style={{ color: colors.cocoa, fontFamily: fonts.displayRegular, fontSize: 24 }}>A closer look</Text>
          {openSession.chains.map((chain) => (
            <View key={chain.id} style={{ gap: spacing.sm }}>
              <Text style={{ color: colors.cocoaSoft, fontFamily: fonts.bodyBold, fontSize: 13 }}>Round {chain.roundNumber}</Text>
              <ChainView compact entries={chain.entries} />
            </View>
          ))}
        </View>
      ) : null}

      {!game.fullGardenUnlocked ? (
        <PaperCard title="Grow the Full Garden" onPress={() => router.push('/full-garden')}>
          Unlock 480 more prompts, custom decks and five extra paper themes.
        </PaperCard>
      ) : null}

      <Spacer />
      <PetalButton onPress={() => router.replace('/options')}>Play again</PetalButton>
      <PetalButton tone="ghost" onPress={() => router.replace('/')}>Back home</PetalButton>
    </AppScreen>
  );
}

