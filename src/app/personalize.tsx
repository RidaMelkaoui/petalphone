import { useRouter } from 'expo-router';
import React from 'react';
import { View } from 'react-native';

import { AppScreen, ChoiceChip, PetalButton, ScreenTop, SectionLabel, Spacer } from '@/components/ui';
import { paperThemes, spacing } from '@/constants/theme';
import { useGame } from '@/state/game-context';
import type { PaperThemeId, RevealStyle } from '@/types/game';

const revealNames: Record<RevealStyle, string> = {
  gentle: 'Gentle',
  'petal-pop': 'Petal pop',
  'paper-flip': 'Paper flip',
  bloom: 'Bloom',
  fireflies: 'Fireflies',
};

export default function PersonalizeScreen() {
  const router = useRouter();
  const game = useGame();

  return (
    <AppScreen testID="personalize-screen">
      <ScreenTop back title="Paper and reveals" body="Choose a quiet mood for the next game." />
      <View style={{ gap: spacing.sm }}>
        <SectionLabel>Paper</SectionLabel>
        <View accessibilityRole="radiogroup" style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
          {(Object.keys(paperThemes) as PaperThemeId[]).map((themeId) => (
            <ChoiceChip key={themeId} label={paperThemes[themeId].name} selected={game.preferences.paperTheme === themeId} onPress={() => game.setPreference('paperTheme', themeId)} />
          ))}
        </View>
      </View>
      <View style={{ gap: spacing.sm }}>
        <SectionLabel>Reveal</SectionLabel>
        <View accessibilityRole="radiogroup" style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
          {(Object.keys(revealNames) as RevealStyle[]).map((style) => (
            <ChoiceChip key={style} label={revealNames[style]} selected={game.preferences.revealStyle === style} onPress={() => game.setPreference('revealStyle', style)} />
          ))}
        </View>
      </View>
      <Spacer />
      <PetalButton onPress={() => router.back()}>Done</PetalButton>
    </AppScreen>
  );
}

