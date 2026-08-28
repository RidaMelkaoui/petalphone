export type Pace = 'cozy' | 'classic' | 'quick';

export type DrawingTool = 'pen' | 'erase';

export type Point = {
  x: number;
  y: number;
};

export type Stroke = {
  id: string;
  points: Point[];
  tool: DrawingTool;
  width: number;
};

export type PromptEntry = {
  id: string;
  kind: 'prompt';
  player: string;
  text: string;
};

export type DrawingEntry = {
  id: string;
  kind: 'drawing';
  player: string;
  strokes: Stroke[];
};

export type GuessEntry = {
  id: string;
  kind: 'guess';
  player: string;
  text: string;
};

export type ChainEntry = PromptEntry | DrawingEntry | GuessEntry;

export type Reaction = 'sweet' | 'wild' | 'odd';

export type CompletedChain = {
  id: string;
  roundNumber: number;
  entries: ChainEntry[];
};

export type GamePhase = 'prompt' | 'draw' | 'guess' | 'reveal';

export type ActiveSession = {
  id: string;
  createdAt: string;
  players: string[];
  pace: Pace;
  roundCount: 1 | 3 | 5;
  deckId: string;
  roundIndex: number;
  startPlayerIndex: number;
  stepIndex: number;
  phase: GamePhase;
  entries: ChainEntry[];
  completedChains: CompletedChain[];
  reaction?: Reaction;
};

export type SavedSession = {
  id: string;
  completedAt: string;
  players: string[];
  pace: Pace;
  deckId: string;
  reaction: Reaction;
  chains: CompletedChain[];
};

export type CustomDeck = {
  id: string;
  title: string;
  prompts: string[];
  createdAt: string;
};

export type PaperThemeId = 'cream' | 'sage' | 'rose' | 'sky' | 'lavender' | 'night';

export type RevealStyle = 'gentle' | 'petal-pop' | 'paper-flip' | 'bloom' | 'fireflies';

export type AppPreferences = {
  sound: boolean;
  haptics: boolean;
  paperTheme: PaperThemeId;
  revealStyle: RevealStyle;
};
