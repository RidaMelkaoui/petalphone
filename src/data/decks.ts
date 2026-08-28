type DeckRecipe = {
  id: string;
  title: string;
  description: string;
  paid: boolean;
  subjects: string[];
  scenes: string[];
};

export type PromptDeck = {
  id: string;
  title: string;
  description: string;
  paid: boolean;
  prompts: string[];
};

const recipes: DeckRecipe[] = [
  {
    id: 'little-things',
    title: 'Little Things',
    description: 'Warm, odd prompts about everyday objects.',
    paid: false,
    subjects: ['A sleepy mug', 'A shy sock', 'A tiny lamp', 'A brave spoon', 'A lost button', 'A cheerful pencil', 'A woolly hat', 'A polite toaster', 'A curious key', 'A soft old book'],
    scenes: ['watering three flowers', 'waiting for the bus', 'building a blanket fort', 'sharing a secret with the moon', 'wearing boots in the rain', 'making breakfast for a friend'],
  },
  {
    id: 'soft-surprises',
    title: 'Soft Surprises',
    description: 'Small moments that turn a little strange.',
    paid: false,
    subjects: ['A round cloud', 'A quiet bicycle', 'A bashful umbrella', 'A warm loaf of bread', 'A pocket-sized piano', 'A dancing mailbox', 'A friendly clock', 'A striped scarf', 'A paper boat', 'A tiny green door'],
    scenes: ['finding a hidden staircase', 'hosting a tea party', 'floating over the rooftops', 'learning to whistle', 'taking care of a baby star', 'drawing a map of the kitchen'],
  },
  {
    id: 'tiny-adventures',
    title: 'Tiny Adventures',
    description: 'Little journeys with plenty of room to wander.',
    paid: true,
    subjects: ['A pocket explorer', 'A very small knight', 'A paper captain', 'A sleepy hiker', 'A brave garden snail', 'A mitten with a map', 'A mouse on holiday', 'A pebble collector', 'A candlelit camper', 'A one-boot traveler'],
    scenes: ['crossing a puddle by ferry', 'climbing a stack of pillows', 'looking for a singing cave', 'camping inside a teapot', 'following a trail of crumbs', 'finding sunrise in a jar'],
  },
  {
    id: 'cozy-creatures',
    title: 'Cozy Creatures',
    description: 'Animals with gentle plans and odd hobbies.',
    paid: true,
    subjects: ['A knitting bear', 'A bookish duck', 'A sleepy fox', 'A tidy raccoon', 'A gardening frog', 'A shy little whale', 'A musical hedgehog', 'A baking rabbit', 'A cloud-watching cat', 'A helpful moth'],
    scenes: ['making soup on a rainy day', 'mending a favorite blanket', 'opening a tiny library', 'learning a slow dance', 'packing lunch for everyone', 'painting the front door'],
  },
  {
    id: 'garden-oddities',
    title: 'Garden Oddities',
    description: 'Plants, pots and visitors doing unexpected things.',
    paid: true,
    subjects: ['A singing sunflower', 'A nervous mushroom', 'A proud tomato', 'A sleepy watering can', 'A rose in rain boots', 'A tiny garden gate', 'A dancing seed packet', 'A cactus with mittens', 'A moonlit wheelbarrow', 'A curious strawberry'],
    scenes: ['inviting the worms to dinner', 'growing a ladder overnight', 'writing a note to the rain', 'hiding from a busy bee', 'opening a flower shop', 'teaching pebbles to dance'],
  },
  {
    id: 'snack-stories',
    title: 'Snack Stories',
    description: 'Food with feelings, errands and tiny ambitions.',
    paid: true,
    subjects: ['A proud pancake', 'A nervous dumpling', 'A sleepy strawberry', 'A cheerful croissant', 'A tiny bowl of soup', 'A brave blueberry', 'A dancing noodle', 'A polite potato', 'A jam-covered toast', 'A round little peach'],
    scenes: ['running a corner shop', 'waiting for a picnic', 'playing cards after dinner', 'building a biscuit castle', 'singing to the kettle', 'taking a midnight walk'],
  },
  {
    id: 'weather-whimsy',
    title: 'Weather Whimsy',
    description: 'Clouds and seasons with minds of their own.',
    paid: true,
    subjects: ['A pocket rainstorm', 'A bashful rainbow', 'A sleepy snowflake', 'A warm winter wind', 'A tiny thundercloud', 'A sunbeam in a scarf', 'A puddle with a hat', 'A friendly fog bank', 'A very round moon', 'A breeze carrying letters'],
    scenes: ['missing the last train', 'making cocoa for the stars', 'trying on a pair of boots', 'watering a rooftop garden', 'collecting songs from windows', 'building a nest in a chimney'],
  },
  {
    id: 'sleepy-magic',
    title: 'Sleepy Magic',
    description: 'Quiet spells for the end of a long day.',
    paid: true,
    subjects: ['A drowsy wizard', 'A moon in pajamas', 'A yawning dragon', 'A candle with a wand', 'A little bedtime ghost', 'A tired shooting star', 'A pillow fortune teller', 'A rabbit in slippers', 'A slow magic carpet', 'A night-light fairy'],
    scenes: ['putting the castle to bed', 'looking for one last story', 'folding dreams into envelopes', 'making the stars dimmer', 'warming socks by the fire', 'counting sheep on the roof'],
  },
  {
    id: 'friendly-chaos',
    title: 'Friendly Chaos',
    description: 'Silly trouble that never gets too loud.',
    paid: true,
    subjects: ['A runaway armchair', 'A choir of kettles', 'A very excited broom', 'A stack of wobbling plates', 'A bicycle with six bells', 'A room full of balloons', 'A marching row of boots', 'A cupboard on holiday', 'A spoon leading a parade', 'A hat with big plans'],
    scenes: ['getting stuck in a tiny doorway', 'preparing a surprise party', 'chasing one last cookie', 'trying to stay very quiet', 'learning to work as a team', 'taking over the living room'],
  },
  {
    id: 'pocket-worlds',
    title: 'Pocket Worlds',
    description: 'Whole places hidden in very small spaces.',
    paid: true,
    subjects: ['A town inside a matchbox', 'A forest under the sofa', 'A bakery in a seashell', 'A lighthouse in a bottle', 'A train inside a pencil case', 'A tiny market in a coat pocket', 'A village on a windowsill', 'A harbor in a cereal bowl', 'A castle inside a clock', 'A garden beneath a hat'],
    scenes: ['waking up before everyone else', 'holding its yearly festival', 'waiting for a mysterious guest', 'preparing for gentle rain', 'sending a letter across the room', 'turning on all the little lights'],
  },
];

function buildPrompts(subjects: string[], scenes: string[]) {
  return subjects.flatMap((subject) => scenes.map((scene) => `${subject} ${scene}`));
}

export const promptDecks: PromptDeck[] = recipes.map((deck) => ({
  id: deck.id,
  title: deck.title,
  description: deck.description,
  paid: deck.paid,
  prompts: buildPrompts(deck.subjects, deck.scenes),
}));

export const freePromptCount = promptDecks.filter((deck) => !deck.paid).reduce((total, deck) => total + deck.prompts.length, 0);
export const paidPromptCount = promptDecks.filter((deck) => deck.paid).reduce((total, deck) => total + deck.prompts.length, 0);

export function findDeck(deckId: string) {
  return promptDecks.find((deck) => deck.id === deckId) ?? promptDecks[0];
}

export function pickPrompt(deckId: string, seed = Date.now()) {
  const deck = findDeck(deckId);
  return deck.prompts[Math.abs(seed) % deck.prompts.length];
}

