import { useRouter } from 'expo-router';
import React from 'react';
import { Keyboard, Pressable, Text, View } from 'react-native';

import { AppScreen, BodyText, PetalButton, PetalInput, ScreenTop, Spacer } from '@/components/ui';
import { colors, fonts, radii, spacing } from '@/constants/theme';
import { useGame } from '@/state/game-context';

export default function PlayersScreen() {
  const router = useRouter();
  const game = useGame();
  const canContinue = game.players.length >= 2 && game.players.every((player) => player.trim().length > 0);

  return (
    <AppScreen keyboard testID="players-screen">
      <ScreenTop back title="Who's playing?" body="Add 2 to 8 people. The phone will tell you when to pass it." />
      <View style={{ gap: spacing.sm, borderWidth: 1, borderColor: colors.border, borderRadius: radii.medium, backgroundColor: colors.surface, padding: spacing.md }}>
        {game.players.map((player, index) => (
          <View key={index} style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
            <Text style={{ width: 24, color: colors.cocoaSoft, fontFamily: fonts.bodyBold, fontSize: 15 }}>{index + 1}.</Text>
            <PetalInput
              accessibilityLabel={`Player ${index + 1} name`}
              autoCapitalize="words"
              autoCorrect={false}
              maxLength={18}
              onChangeText={(value) => game.setPlayer(index, value)}
              placeholder={`Player ${index + 1}`}
              returnKeyType="next"
              value={player}
              style={{ flex: 1 }}
            />
            <Pressable
              accessibilityLabel={`Remove player ${index + 1}`}
              accessibilityRole="button"
              disabled={game.players.length <= 2}
              hitSlop={8}
              onPress={() => game.removePlayer(index)}
            >
              <Text style={{ color: game.players.length <= 2 ? colors.disabled : colors.coral, fontFamily: fonts.bodyBold, fontSize: 13 }}>Remove</Text>
            </Pressable>
          </View>
        ))}
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.md }}>
        <PetalButton compact tone="secondary" disabled={game.players.length >= 8} onPress={game.addPlayer}>Add player</PetalButton>
        <BodyText small>{game.players.length} of 8</BodyText>
      </View>
      <Spacer />
      <PetalButton disabled={!canContinue} onPress={() => { Keyboard.dismiss(); router.push('/options'); }}>
        Continue
      </PetalButton>
    </AppScreen>
  );
}

