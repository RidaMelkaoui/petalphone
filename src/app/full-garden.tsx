import { useRouter } from 'expo-router';
import React from 'react';
import { Text, View } from 'react-native';

import { AppScreen, BodyText, Mascot, PaperCard, PetalButton, ScreenTop, Spacer } from '@/components/ui';
import { colors, fonts, spacing } from '@/constants/theme';
import { paidPromptCount } from '@/data/decks';
import { useGame } from '@/state/game-context';

const benefits = [
  ['Eight more prompt decks', `${paidPromptCount} extra prompts for cozy, silly and surprising games.`],
  ['Your own decks', 'Write private jokes, family memories or prompts for a special night.'],
  ['Five extra paper moods', 'Change the whole room from soft sage to firefly night.'],
  ['More Bloomlings', 'Grow a few extra handmade garden friends as you finish games.'],
  ['Extra reveal styles', 'Choose gentle paper flips, petal pops and quiet fireflies.'],
] as const;

export default function FullGardenScreen() {
  const router = useRouter();
  const game = useGame();

  if (game.fullGardenUnlocked) {
    return (
      <AppScreen testID="full-garden-screen">
        <Mascot kind="flower" size={145} />
        <ScreenTop back title="Full Garden unlocked" body="Everything below is ready on this phone." />
        <PaperCard title="Make a prompt deck" onPress={() => router.push('/custom-decks')}>Turn your own ideas and private jokes into a deck.</PaperCard>
        <PaperCard title="Choose your paper mood" onPress={() => router.push('/personalize')}>Pick a paper theme and a reveal style.</PaperCard>
        <Spacer />
        <PetalButton onPress={() => router.back()}>Back to game</PetalButton>
      </AppScreen>
    );
  }

  return (
    <AppScreen testID="full-garden-screen">
      <Mascot kind="flower" size={135} />
      <ScreenTop back title="Grow the Full Garden" body="A one-time purchase for more prompts and more ways to make the game yours." />
      <View style={{ gap: spacing.sm }}>
        {benefits.map(([title, body]) => (
          <PaperCard key={title} title={title}><BodyText small>{body}</BodyText></PaperCard>
        ))}
      </View>
      <Spacer />
      <PetalButton busy={game.purchaseBusy} onPress={game.purchaseFullGarden}>Unlock for {game.fullGardenPrice}</PetalButton>
      <PetalButton busy={game.purchaseBusy} tone="ghost" onPress={game.restorePurchases}>Restore purchase</PetalButton>
      {game.purchaseMessage ? (
        <Text accessibilityLiveRegion="polite" selectable style={{ color: colors.cocoaSoft, fontFamily: fonts.bodyMedium, fontSize: 14, lineHeight: 20, textAlign: 'center' }}>{game.purchaseMessage}</Text>
      ) : null}
      <BodyText centered small>One purchase. Yours to keep. Price may vary by region.</BodyText>
    </AppScreen>
  );
}

