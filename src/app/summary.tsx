import { Redirect, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { View } from 'react-native';

import { AppScreen, BodyText, ChoiceChip, Mascot, PetalButton, ScreenTop, SectionLabel, Spacer } from '@/components/ui';
import { spacing } from '@/constants/theme';
import { warmSuccess } from '@/lib/haptics';
import { useGame } from '@/state/game-context';
import type { Reaction } from '@/types/game';

export default function SummaryScreen() {
  const router = useRouter();
  const game = useGame();
  const session = game.activeSession;
  const [reaction, setReaction] = useState<Reaction>('sweet');
  if (!session) return <Redirect href="/" />;

  const finish = async (destination: '/garden' | '/options') => {
    await warmSuccess(game.preferences.haptics);
    game.finishSession(reaction);
    router.replace(destination);
  };

  return (
    <AppScreen testID="summary-screen">
      <Mascot kind="flower" size={150} />
      <ScreenTop title="Your garden grew" body={`${session.roundCount} ${session.roundCount === 1 ? 'chain' : 'chains'} made by ${session.players.length} people.`} />
      <View style={{ gap: spacing.sm }}>
        <SectionLabel>How did that game feel?</SectionLabel>
        <View accessibilityRole="radiogroup" style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
          {(['sweet', 'wild', 'odd'] as Reaction[]).map((mood) => <ChoiceChip key={mood} label={mood[0].toUpperCase() + mood.slice(1)} selected={reaction === mood} onPress={() => setReaction(mood)} />)}
        </View>
      </View>
      <Spacer />
      <PetalButton onPress={() => finish('/garden')}>See your garden</PetalButton>
      <PetalButton tone="secondary" onPress={() => finish('/options')}>Play another game</PetalButton>
      <BodyText centered small>Your finished chains stay on this phone.</BodyText>
    </AppScreen>
  );
}

