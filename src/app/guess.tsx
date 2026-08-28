import { Redirect, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Keyboard, Text, View } from 'react-native';

import { StrokeDrawing } from '@/components/drawing-canvas';
import { AppScreen, BodyText, PetalButton, PetalInput, TurnMeta } from '@/components/ui';
import { colors, fonts, radii, spacing } from '@/constants/theme';
import { useCountdown } from '@/hooks/use-countdown';
import { useGame } from '@/state/game-context';

export default function GuessScreen() {
  const router = useRouter();
  const game = useGame();
  const session = game.activeSession;
  const [guess, setGuess] = useState('');
  const timer = useCountdown(session?.pace ?? 'cozy', 'guess');
  const drawing = useMemo(() => [...(session?.entries ?? [])].reverse().find((entry) => entry.kind === 'drawing'), [session]);
  if (!session) return <Redirect href="/" />;
  const isLastTurn = session.stepIndex >= session.players.length - 1;
  const saveGuess = () => {
    if (!guess.trim() && !timer.expired) return;
    Keyboard.dismiss();
    game.submitGuess(guess);
    router.replace(isLastTurn ? '/reveal' : '/pass');
  };

  return (
    <AppScreen keyboard testID="guess-screen" contentStyle={{ gap: spacing.sm }}>
      <TurnMeta left={`Round ${session.roundIndex + 1} of ${session.roundCount}`} right={timer.label} />
      <Text accessibilityRole="header" style={{ color: colors.cocoa, fontFamily: fonts.display, fontSize: 32, lineHeight: 37 }}>What do you think it is?</Text>
      <BodyText>Write the first guess that comes to mind.</BodyText>
      <View style={{ height: 280, overflow: 'hidden', borderWidth: 1, borderColor: colors.border, borderRadius: radii.medium, backgroundColor: colors.surface }}>
        {drawing?.kind === 'drawing' ? <StrokeDrawing strokes={drawing.strokes} /> : null}
      </View>
      <PetalInput
        accessibilityLabel="Your guess"
        autoCapitalize="sentences"
        autoCorrect
        editable={!timer.expired}
        maxLength={80}
        onChangeText={setGuess}
        onSubmitEditing={saveGuess}
        placeholder="Your guess"
        returnKeyType="done"
        value={guess}
      />
      <BodyText centered small>Everyone else should look away.</BodyText>
      <PetalButton disabled={!guess.trim() && !timer.expired} onPress={saveGuess}>
        {timer.expired ? 'Time is up · save no guess' : 'Save guess'}
      </PetalButton>
    </AppScreen>
  );
}
