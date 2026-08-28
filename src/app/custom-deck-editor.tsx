import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Keyboard } from 'react-native';

import { AppScreen, BodyText, PetalButton, PetalInput, ScreenTop, Spacer } from '@/components/ui';
import { useGame } from '@/state/game-context';

export default function CustomDeckEditorScreen() {
  const router = useRouter();
  const game = useGame();
  const [title, setTitle] = useState('');
  const [promptText, setPromptText] = useState('');
  const prompts = useMemo(() => promptText.split(/\r?\n/).map((prompt) => prompt.trim()).filter(Boolean), [promptText]);
  const canSave = title.trim().length >= 2 && prompts.length >= 5;

  return (
    <AppScreen keyboard testID="custom-deck-editor-screen">
      <ScreenTop title="Make a prompt deck" body="Give it a name, then write one prompt on each line." />
      <PetalInput accessibilityLabel="Deck name" maxLength={32} onChangeText={setTitle} placeholder="Deck name" value={title} />
      <PetalInput
        accessibilityLabel="Deck prompts"
        multiline
        onChangeText={setPromptText}
        placeholder={'A sleepy moon watering flowers\nA frog baking tiny pies\nA sock waiting for the bus'}
        textAlignVertical="top"
        value={promptText}
        style={{ minHeight: 260 }}
      />
      <BodyText small>{prompts.length} prompts. Add at least five.</BodyText>
      <Spacer />
      <PetalButton disabled={!canSave} onPress={() => { Keyboard.dismiss(); const deck = game.addCustomDeck(title, prompts); game.setSelectedDeckId(deck.id); router.back(); }}>
        Save deck
      </PetalButton>
      <PetalButton tone="ghost" onPress={() => router.back()}>Cancel</PetalButton>
    </AppScreen>
  );
}

