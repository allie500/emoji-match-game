import type { CardId, GameCard, GameState } from "./types";
import { DEFAULT_EMOJIS, pickEmojis } from "./emojiPool";

export const MISMATCH_DELAY_MS = 750;
export const MATCH_DELAY_MS = 250;

export interface CreateGameConfig {
  numPairs: number;
  emojis?: string[];
  /**
   * Optional RNG hook for deterministic behavior (useful for tests).
   * Must return a float in [0, 1).
   */
  rng?: () => number;
}

function shuffle<T>(items: T[], rng: () => number): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function buildDeck(config: {
  numPairs: number;
  emojis: string[];
  rng?: () => number;
}): GameCard[] {
  const { numPairs, emojis, rng } = config;
  if (numPairs <= 0) return [];

  const effectiveRng = rng ?? Math.random;

  // Pick a subset of emoji pool, then shuffle the result for variety.
  const pool = pickEmojis(shuffle(emojis, effectiveRng), numPairs);
  const deckByPair = pool.flatMap((emoji, pairIndex) => {
    const pairKey = emoji;
    const aId = `card-${pairIndex}-a`;
    const bId = `card-${pairIndex}-b`;

    const first: GameCard = { id: aId, emoji, pairKey };
    const second: GameCard = { id: bId, emoji, pairKey };
    return [first, second];
  });

  return shuffle(deckByPair, effectiveRng);
}

export function createGame(config: CreateGameConfig): GameState {
  const { numPairs, emojis = DEFAULT_EMOJIS } = config;

  return {
    deck: buildDeck({ numPairs, emojis, rng: config.rng }),
    flippedIds: [],
    matchedPairKeys: new Set<string>(),
    moves: 0,
    matches: 0,
    numPairs,
    winningEmoji: null,
    lock: false,
    pendingMismatchIds: null,
    pendingMatchPairKey: null,
  };
}

export type GameAction =
  | { type: "flip"; cardId: CardId }
  | { type: "resolveMismatch" }
  | { type: "resolveMatch" }
  | { type: "reset"; next: GameState };

function findCard(deck: GameCard[], cardId: CardId): GameCard | undefined {
  return deck.find((c) => c.id === cardId);
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "reset":
      return action.next;

    case "flip": {
      if (state.lock) return state;
      if (state.flippedIds.includes(action.cardId)) return state;

      const card = findCard(state.deck, action.cardId);
      if (!card) return state;
      if (state.matchedPairKeys.has(card.pairKey)) return state;

      if (state.flippedIds.length === 0) {
        return { ...state, flippedIds: [card.id] };
      }

      if (state.flippedIds.length === 1) {
        const firstId = state.flippedIds[0];
        const firstCard = findCard(state.deck, firstId);
        if (!firstCard) return state;

        const nextMoves = state.moves + 1;

        if (firstCard.pairKey === card.pairKey) {
          return {
            ...state,
            flippedIds: [firstId, card.id],
            moves: nextMoves,
            lock: true,
            pendingMatchPairKey: card.pairKey,
          };
        }

        return {
          ...state,
          flippedIds: [firstId, card.id],
          moves: nextMoves,
          lock: true,
          pendingMismatchIds: [firstId, card.id],
          pendingMatchPairKey: null,
        };
      }

      // If something ever leaves us with >1 flipped card, ignore further flips.
      return state;
    }

    case "resolveMismatch": {
      if (!state.lock) return state;
      return {
        ...state,
        flippedIds: [],
        lock: false,
        pendingMismatchIds: null,
        pendingMatchPairKey: null,
      };
    }

    case "resolveMatch": {
      if (!state.lock || !state.pendingMatchPairKey) return state;

      const nextMatches = state.matches + 1;
      const isWin = nextMatches >= state.numPairs;
      const nextMatched = new Set(state.matchedPairKeys);
      nextMatched.add(state.pendingMatchPairKey);

      return {
        ...state,
        flippedIds: [],
        matchedPairKeys: nextMatched,
        matches: nextMatches,
        winningEmoji: isWin ? state.pendingMatchPairKey : null,
        lock: false,
        pendingMatchPairKey: null,
        pendingMismatchIds: null,
      };
    }

    /* istanbul ignore next -- exhaustive switch; all GameAction variants are handled above */
    default:
      return state;
  }
}
