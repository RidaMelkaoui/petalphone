import React from 'react';
import { Text, View } from 'react-native';
import Animated, { BounceIn, FadeIn, FadeInUp, FlipInEasyY, ZoomIn } from 'react-native-reanimated';

import { StrokeDrawing } from '@/components/drawing-canvas';
import { colors, fonts, radii, spacing } from '@/constants/theme';
import type { ChainEntry, RevealStyle } from '@/types/game';

function entryMotion(style: RevealStyle, index: number) {
  const delay = Math.min(index * 85, 420);
  if (style === 'petal-pop') return ZoomIn.duration(240).delay(delay);
  if (style === 'paper-flip') return FlipInEasyY.duration(260).delay(delay);
  if (style === 'bloom') return BounceIn.duration(260).delay(delay);
  if (style === 'fireflies') return FadeIn.duration(280).delay(delay + 100);
  return FadeInUp.duration(240).delay(delay);
}

export function ChainView({ entries, compact = false, revealStyle = 'gentle' }: { entries: ChainEntry[]; compact?: boolean; revealStyle?: RevealStyle }) {
  return (
    <View style={{ gap: spacing.sm }}>
      {entries.map((entry, index) => {
        const label = entry.kind === 'prompt' ? `${entry.player} read` : entry.kind === 'drawing' ? `${entry.player} drew` : `${entry.player} guessed`;
        return (
          <Animated.View
            key={entry.id}
            entering={compact ? undefined : entryMotion(revealStyle, index)}
            style={{
              gap: spacing.sm,
              borderWidth: 1,
              borderColor: index === entries.length - 1 ? colors.coral : colors.border,
              borderRadius: radii.medium,
              backgroundColor: colors.surface,
              padding: compact ? 12 : spacing.md,
            }}
          >
            <Text style={{ color: colors.cocoaSoft, fontFamily: fonts.bodyBold, fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.8 }}>{label}</Text>
            {entry.kind === 'drawing' ? (
              <View style={{ height: compact ? 145 : 210 }}>
                <StrokeDrawing strokes={entry.strokes} />
              </View>
            ) : (
              <Text selectable style={{ color: colors.cocoa, fontFamily: entry.kind === 'prompt' ? fonts.displayRegular : fonts.bodyMedium, fontSize: entry.kind === 'prompt' ? 20 : 17, lineHeight: 25 }}>
                {entry.text}
              </Text>
            )}
          </Animated.View>
        );
      })}
    </View>
  );
}
