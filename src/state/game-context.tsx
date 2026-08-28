import React, { createContext, use, useEffect, useState } from 'react';
import type { PurchasesPackage } from 'react-native-purchases';

import { findDeck, pickPrompt } from '@/data/decks';
import { buyFullGarden, loadFullGardenOffer, readFullGardenEntitlement, restoreFullGarden } from '@/lib/purchases';
import { storage } from '@/lib/storage';
import type {
  ActiveSession,
  AppPreferences,
  CompletedChain,
  CustomDeck,
  Pace,
  Reaction,
  SavedSession,
  Stroke,
} from '@/types/game';

type RoundCount = 1 | 3 | 5;

type PersistedGameState = {
  players: string[];
  pace: Pace;
  roundCount: RoundCount;
  selectedDeckId: string;
  history: SavedSession[];
  customDecks: CustomDeck[];
  preferences: AppPreferences;
  gamesPlayed: number;
};

type GameContextValue = PersistedGameState & {
  ready: boolean;
  activeSession: ActiveSession | null;
  lastCompletedSession: SavedSession | null;
  fullGardenUnlocked: boolean;
  fullGardenPrice: string;
  purchaseBusy: boolean;
  purchaseMessage: string;
  currentPlayer: string;
  currentClue: string;
  setPlayer: (index: number, value: string) => void;
  addPlayer: () => void;
  removePlayer: (index: number) => void;
  setPace: (pace: Pace) => void;
  setRoundCount: (roundCount: RoundCount) => void;
  setSelectedDeckId: (deckId: string) => void;
  setPreference: <K extends keyof AppPreferences>(key: K, value: AppPreferences[K]) => void;
  startSession: () => void;
  showDrawingTurn: () => void;
  submitDrawing: (strokes: Stroke[]) => void;
  submitGuess: (text: string) => void;
  beginNextRound: () => boolean;
  finishSession: (reaction: Reaction) => SavedSession | null;
  abandonSession: () => void;
  addCustomDeck: (title: string, prompts: string[]) => CustomDeck;
  deleteCustomDeck: (deckId: string) => void;
  clearLocalGameData: () => void;
  purchaseFullGarden: () => Promise<boolean>;
  restorePurchases: () => Promise<boolean>;
};

const defaultPreferences: AppPreferences = {
  sound: true,
  haptics: true,
  paperTheme: 'cream',
  revealStyle: 'gentle',
};

const initialPersistedState: PersistedGameState = {
  players: ['', '', '', ''],
  pace: 'cozy',
  roundCount: 3,
  selectedDeckId: 'little-things',
  history: [],
  customDecks: [],
  preferences: defaultPreferences,
  gamesPlayed: 0,
};

const GameContext = createContext<GameContextValue | null>(null);
const debugFullGardenUnlocked = __DEV__ && process.env.EXPO_PUBLIC_FULL_GARDEN_DEBUG_UNLOCK === '1';

function makeId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function actorFor(session: ActiveSession) {
  return session.players[(session.startPlayerIndex + session.stepIndex) % session.players.length];
}

function currentTextClue(session: ActiveSession) {
  const textEntry = [...session.entries].reverse().find((entry) => entry.kind === 'prompt' || entry.kind === 'guess');
  return textEntry && 'text' in textEntry ? textEntry.text : '';
}

function promptForRound(deckId: string, customDecks: CustomDeck[], seed: number) {
  const customDeck = customDecks.find((deck) => deck.id === deckId);
  if (customDeck?.prompts.length) return customDeck.prompts[Math.abs(seed) % customDeck.prompts.length];
  return pickPrompt(deckId, seed);
}

function makeRound(
  session: Pick<ActiveSession, 'id' | 'players' | 'deckId'>,
  customDecks: CustomDeck[],
  roundIndex: number,
): Pick<ActiveSession, 'roundIndex' | 'startPlayerIndex' | 'stepIndex' | 'phase' | 'entries'> {
  const startPlayerIndex = roundIndex % session.players.length;
  const prompt = promptForRound(session.deckId, customDecks, Date.now() + roundIndex * 37);
  return {
    roundIndex,
    startPlayerIndex,
    stepIndex: 0,
    phase: 'prompt',
    entries: [
      {
        id: makeId('prompt'),
        kind: 'prompt',
        player: session.players[startPlayerIndex],
        text: prompt,
      },
    ],
  };
}

export function GameProvider({ children }: { children: React.ReactNode }) {
  const ready = true;
  const [persisted, setPersisted] = useState<PersistedGameState>(() => {
    const saved = storage.get<PersistedGameState>('game', initialPersistedState);
    return {
      ...initialPersistedState,
      ...saved,
      preferences: { ...defaultPreferences, ...saved.preferences },
    };
  });
  const [activeSession, setActiveSession] = useState<ActiveSession | null>(() => storage.get<ActiveSession | null>('active-session', null));
  const [lastCompletedSession, setLastCompletedSession] = useState<SavedSession | null>(null);
  const [fullGardenUnlocked, setFullGardenUnlockedState] = useState(() => debugFullGardenUnlocked || storage.get('full-garden', false));
  const [fullGardenPrice, setFullGardenPrice] = useState('$4.99');
  const [fullGardenPackage, setFullGardenPackage] = useState<PurchasesPackage | null>(null);
  const [purchaseBusy, setPurchaseBusy] = useState(false);
  const [purchaseMessage, setPurchaseMessage] = useState('');

  useEffect(() => {
    if (ready) storage.set('game', persisted);
  }, [persisted, ready]);

  useEffect(() => {
    if (ready) storage.set('active-session', activeSession);
  }, [activeSession, ready]);

  useEffect(() => {
    if (!ready) return;
    let active = true;
    Promise.all([readFullGardenEntitlement(), loadFullGardenOffer()])
      .then(([entitled, offer]) => {
        if (!active) return;
        if (entitled !== null && !debugFullGardenUnlocked) {
          setFullGardenUnlockedState(entitled);
          storage.set('full-garden', entitled);
        }
        if (offer) {
          setFullGardenPackage(offer.package);
          setFullGardenPrice(offer.price);
        }
      })
      .catch(() => undefined);
    return () => { active = false; };
  }, [ready]);

  const setPlayer = (index: number, value: string) => {
    setPersisted((current) => ({
      ...current,
      players: current.players.map((player, playerIndex) => (playerIndex === index ? value : player)),
    }));
  };

  const addPlayer = () => {
    setPersisted((current) =>
      current.players.length >= 8 ? current : { ...current, players: [...current.players, ''] },
    );
  };

  const removePlayer = (index: number) => {
    setPersisted((current) =>
      current.players.length <= 2
        ? current
        : { ...current, players: current.players.filter((_, playerIndex) => playerIndex !== index) },
    );
  };

  const setPace = (pace: Pace) => setPersisted((current) => ({ ...current, pace }));
  const setRoundCount = (roundCount: RoundCount) => setPersisted((current) => ({ ...current, roundCount }));
  const setSelectedDeckId = (selectedDeckId: string) => setPersisted((current) => ({ ...current, selectedDeckId }));

  const setPreference = <K extends keyof AppPreferences>(key: K, value: AppPreferences[K]) => {
    setPersisted((current) => ({
      ...current,
      preferences: { ...current.preferences, [key]: value },
    }));
  };

  const startSession = () => {
    const cleanPlayers = persisted.players.map((player, index) => player.trim() || `Player ${index + 1}`);
    const id = makeId('game');
    const base = {
      id,
      createdAt: new Date().toISOString(),
      players: cleanPlayers,
      pace: persisted.pace,
      roundCount: persisted.roundCount,
      deckId: persisted.selectedDeckId,
      completedChains: [],
    } satisfies Omit<ActiveSession, 'roundIndex' | 'startPlayerIndex' | 'stepIndex' | 'phase' | 'entries'>;
    setActiveSession({ ...base, ...makeRound(base, persisted.customDecks, 0) });
    setLastCompletedSession(null);
  };

  const showDrawingTurn = () => {
    setActiveSession((session) => (session ? { ...session, phase: 'draw' } : session));
  };

  const moveAfterEntry = (session: ActiveSession, nextPhase: 'draw' | 'guess') => {
    if (session.stepIndex >= session.players.length - 1) return { ...session, phase: 'reveal' as const };
    return { ...session, stepIndex: session.stepIndex + 1, phase: nextPhase };
  };

  const submitDrawing = (strokes: Stroke[]) => {
    setActiveSession((session) => {
      if (!session) return session;
      const next = {
        ...session,
        entries: [
          ...session.entries,
          { id: makeId('drawing'), kind: 'drawing' as const, player: actorFor(session), strokes },
        ],
      };
      return moveAfterEntry(next, 'guess');
    });
  };

  const submitGuess = (text: string) => {
    setActiveSession((session) => {
      if (!session) return session;
      const next = {
        ...session,
        entries: [
          ...session.entries,
          { id: makeId('guess'), kind: 'guess' as const, player: actorFor(session), text: text.trim() || 'No guess' },
        ],
      };
      return moveAfterEntry(next, 'draw');
    });
  };

  const beginNextRound = () => {
    if (!activeSession || activeSession.roundIndex + 1 >= activeSession.roundCount) return false;
    const completedChain: CompletedChain = {
      id: makeId('chain'),
      roundNumber: activeSession.roundIndex + 1,
      entries: activeSession.entries,
    };
    const roundIndex = activeSession.roundIndex + 1;
    setActiveSession({
      ...activeSession,
      completedChains: [...activeSession.completedChains, completedChain],
      ...makeRound(activeSession, persisted.customDecks, roundIndex),
    });
    return true;
  };

  const finishSession = (reaction: Reaction) => {
    if (!activeSession) return null;
    const finalChain: CompletedChain = {
      id: makeId('chain'),
      roundNumber: activeSession.roundIndex + 1,
      entries: activeSession.entries,
    };
    const completed: SavedSession = {
      id: activeSession.id,
      completedAt: new Date().toISOString(),
      players: activeSession.players,
      pace: activeSession.pace,
      deckId: activeSession.deckId,
      reaction,
      chains: [...activeSession.completedChains, finalChain],
    };
    setPersisted((current) => ({
      ...current,
      history: [completed, ...current.history].slice(0, 24),
      gamesPlayed: current.gamesPlayed + 1,
    }));
    setLastCompletedSession(completed);
    setActiveSession(null);
    storage.set('active-session', null);
    return completed;
  };

  const abandonSession = () => {
    setActiveSession(null);
    storage.set('active-session', null);
  };

  const addCustomDeck = (title: string, prompts: string[]) => {
    const deck: CustomDeck = {
      id: makeId('custom'),
      title: title.trim(),
      prompts: prompts.map((prompt) => prompt.trim()).filter(Boolean),
      createdAt: new Date().toISOString(),
    };
    setPersisted((current) => ({ ...current, customDecks: [deck, ...current.customDecks] }));
    return deck;
  };

  const deleteCustomDeck = (deckId: string) => {
    setPersisted((current) => ({
      ...current,
      selectedDeckId: current.selectedDeckId === deckId ? 'little-things' : current.selectedDeckId,
      customDecks: current.customDecks.filter((deck) => deck.id !== deckId),
    }));
  };

  const clearLocalGameData = () => {
    setPersisted(initialPersistedState);
    setActiveSession(null);
    setLastCompletedSession(null);
    storage.set('game', initialPersistedState);
    storage.set('active-session', null);
  };

  const purchaseFullGarden = async () => {
    setPurchaseBusy(true);
    setPurchaseMessage('');
    try {
      const offer = fullGardenPackage ? { package: fullGardenPackage, price: fullGardenPrice } : await loadFullGardenOffer();
      if (!offer) {
        setPurchaseMessage('Purchases are not ready on this build yet. Please try again later.');
        return false;
      }
      const unlocked = await buyFullGarden(offer.package);
      if (unlocked) {
        setFullGardenUnlockedState(true);
        storage.set('full-garden', true);
        setPurchaseMessage('Full Garden is ready.');
      } else {
        setPurchaseMessage('The purchase finished, but Full Garden was not found. Try Restore purchase or contact support.');
      }
      return unlocked;
    } catch (error) {
      const cancelled = Boolean((error as { userCancelled?: boolean }).userCancelled);
      if (!cancelled) setPurchaseMessage('The purchase did not finish. Nothing was charged.');
      return false;
    } finally {
      setPurchaseBusy(false);
    }
  };

  const restorePurchases = async () => {
    setPurchaseBusy(true);
    setPurchaseMessage('');
    try {
      const restored = await restoreFullGarden();
      if (restored) {
        setFullGardenUnlockedState(true);
        storage.set('full-garden', true);
        setPurchaseMessage('Full Garden has been restored.');
      } else {
        setPurchaseMessage('No Full Garden purchase was found for this store account.');
      }
      return restored;
    } catch {
      setPurchaseMessage('Restore did not finish. Please check your connection and try again.');
      return false;
    } finally {
      setPurchaseBusy(false);
    }
  };

  const value: GameContextValue = {
    ...persisted,
    ready,
    activeSession,
    lastCompletedSession,
    fullGardenUnlocked,
    fullGardenPrice,
    purchaseBusy,
    purchaseMessage,
    currentPlayer: activeSession ? actorFor(activeSession) : '',
    currentClue: activeSession ? currentTextClue(activeSession) : '',
    setPlayer,
    addPlayer,
    removePlayer,
    setPace,
    setRoundCount,
    setSelectedDeckId,
    setPreference,
    startSession,
    showDrawingTurn,
    submitDrawing,
    submitGuess,
    beginNextRound,
    finishSession,
    abandonSession,
    addCustomDeck,
    deleteCustomDeck,
    clearLocalGameData,
    purchaseFullGarden,
    restorePurchases,
  };

  return <GameContext value={value}>{children}</GameContext>;
}

export function useGame() {
  const value = use(GameContext);
  if (!value) throw new Error('useGame must be used inside GameProvider');
  return value;
}

export function getDeckTitle(deckId: string, customDecks: CustomDeck[]) {
  return customDecks.find((deck) => deck.id === deckId)?.title ?? findDeck(deckId).title;
}
