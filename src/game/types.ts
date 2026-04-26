export type CardId = string;

export interface GameCard {
  id: CardId;
  emoji: string;
  /**
   * A stable key identifying which two cards belong to the same pair.
   * We use the emoji itself as the pair key for simplicity.
   */
  pairKey: string;
}

export interface GameState {
  deck: GameCard[];
  flippedIds: CardId[];
  matchedPairKeys: Set<string>;
  moves: number;
  matches: number;
  numPairs: number;
  winningEmoji: string | null;

  /**
   * Prevents user interaction while we wait to flip back a mismatched pair.
   */
  lock: boolean;

  /**
   * When a mismatch happens, we store the two card ids here so the UI can
   * show the pair briefly, then flip them back.
   */
  pendingMismatchIds: [CardId, CardId] | null;

  /**
   * When a match happens, we briefly keep both cards face-up before marking
   * them as solved (green).
   */
  pendingMatchPairKey: string | null;
}
