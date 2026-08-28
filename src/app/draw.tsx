import { Redirect, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Text, View } from 'react-native';

import { DrawingCanvas } from '@/components/drawing-canvas';
import { AppScreen, PetalButton, TurnMeta } from '@/components/ui';
import { colors, fonts, radii, spacing } from '@/constants/theme';
import { useCountdown } from '@/hooks/use-countdown';
import { useGame } from '@/state/game-context';
import type { Stroke } from '@/types/game';

export default function DrawScreen() {
  const router = useRouter();
  const game = useGame();
  const session = game.activeSession;
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [drawing, setDrawing] = useState(false);
  const timer = useCountdown(session?.pace ?? 'cozy', 'draw');
  if (!session) return <Redirect href="/" />;
  const isLastTurn = session.stepIndex >= session.players.length - 1;

  return (
    <AppScreen scrollEnabled={!drawing} testID="draw-screen" contentStyle={{ gap: spacing.sm }}>
      <TurnMeta left={`Round ${session.roundIndex + 1} of ${session.roundCount}`} right={timer.label} />
      <Text accessibilityRole="header" style={{ color: colors.cocoa, fontFamily: fonts.display, fontSize: 32, lineHeight: 37 }}>Draw what you saw</Text>
      <View style={{ borderRadius: radii.medium, backgroundColor: colors.quiet, padding: spacing.md }}>
        <Text selectable style={{ color: colors.cocoaSoft, fontFamily: fonts.bodyMedium, fontSize: 15, lineHeight: 21 }}>{game.currentClue}</Text>
      </View>
      <DrawingCanvas value={strokes} onChange={setStrokes} onDrawingChange={setDrawing} />
      <PetalButton disabled={strokes.length === 0 && !timer.expired} onPress={() => { game.submitDrawing(strokes); router.replace(isLastTurn ? '/reveal' : '/pass'); }}>
        {timer.expired ? 'Time is up · pass it on' : 'Done drawing'}
      </PetalButton>
    </AppScreen>
  );
}

