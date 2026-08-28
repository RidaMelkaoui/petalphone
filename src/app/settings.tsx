import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, Linking, View } from 'react-native';

import { AppScreen, BodyText, PaperCard, PetalButton, ScreenTop, SectionLabel, Separator, SettingsRow, Spacer } from '@/components/ui';
import { spacing } from '@/constants/theme';
import { useGame } from '@/state/game-context';

const site = 'https://ridamelkaoui.github.io/petalphone';

export default function SettingsScreen() {
  const router = useRouter();
  const game = useGame();

  return (
    <AppScreen testID="settings-screen">
      <ScreenTop back title="Settings" body="Keep the game comfortable for your group." />
      <View style={{ gap: spacing.sm }}>
        <SectionLabel>Play</SectionLabel>
        <PaperCard>
          <SettingsRow label="Sound" toggle={game.preferences.sound} onPress={(value) => game.setPreference('sound', Boolean(value))} />
          <Separator />
          <SettingsRow label="Haptics" toggle={game.preferences.haptics} onPress={(value) => game.setPreference('haptics', Boolean(value))} />
        </PaperCard>
      </View>
      <View style={{ gap: spacing.sm }}>
        <SectionLabel>Purchases</SectionLabel>
        <PaperCard>
          <SettingsRow label="Full Garden" value={game.fullGardenUnlocked ? 'Unlocked' : 'Free version'} onPress={() => router.push('/full-garden')} />
          <Separator />
          <SettingsRow label="Restore purchase" onPress={game.restorePurchases} />
          {game.fullGardenUnlocked ? <><Separator /><SettingsRow label="Paper and reveals" onPress={() => router.push('/personalize')} /></> : null}
        </PaperCard>
      </View>
      <View style={{ gap: spacing.sm }}>
        <SectionLabel>About</SectionLabel>
        <PaperCard>
          <SettingsRow label="Privacy" onPress={() => Linking.openURL(`${site}/privacy/`)} />
          <Separator />
          <SettingsRow label="Terms" onPress={() => Linking.openURL(`${site}/terms/`)} />
          <Separator />
          <SettingsRow label="Support" onPress={() => Linking.openURL(`${site}/support/`)} />
        </PaperCard>
      </View>
      <View style={{ gap: spacing.sm }}>
        <SectionLabel>Local data</SectionLabel>
        <PaperCard>
          <SettingsRow
            label="Delete local game data"
            value="Delete"
            onPress={() => Alert.alert(
              'Delete local game data?',
              'This removes player names, finished games, drawings and custom decks from this phone. Your Full Garden purchase stays available.',
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Delete', style: 'destructive', onPress: game.clearLocalGameData },
              ],
            )}
          />
        </PaperCard>
      </View>
      <Spacer />
      <BodyText centered small>No ads. No account. No ad tracking. Game history stays on this phone.</BodyText>
      <PetalButton tone="ghost" onPress={() => router.back()}>Done</PetalButton>
    </AppScreen>
  );
}
