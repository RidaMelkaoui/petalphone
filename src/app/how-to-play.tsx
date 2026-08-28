import { useRouter } from 'expo-router';
import React from 'react';
import { Text, View } from 'react-native';

import { AppScreen, BodyText, PetalButton, ScreenTop, Spacer } from '@/components/ui';
import { colors, fonts, radii, spacing } from '@/constants/theme';

const steps = [
  ['1', 'Read a private prompt'],
  ['2', 'Pass the phone and draw or guess'],
  ['3', 'Reveal the whole chain together'],
] as const;

export default function HowToPlayScreen() {
  const router = useRouter();
  return (
    <AppScreen testID="how-to-play-screen">
      <ScreenTop title="How to play" body="Petalphone is a drawing telephone game for people in the same room." />
      <View style={{ gap: spacing.sm }}>
        {steps.map(([number, text]) => (
          <View key={number} style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md, borderWidth: 1, borderColor: colors.border, borderRadius: radii.medium, backgroundColor: colors.surface, padding: spacing.md }}>
            <View style={{ width: 38, height: 38, alignItems: 'center', justifyContent: 'center', borderRadius: 19, backgroundColor: colors.quiet }}>
              <Text style={{ color: colors.cocoa, fontFamily: fonts.displayRegular, fontSize: 18 }}>{number}</Text>
            </View>
            <BodyText>{text}</BodyText>
          </View>
        ))}
      </View>
      <Spacer />
      <PetalButton onPress={() => router.back()}>Got it</PetalButton>
    </AppScreen>
  );
}

