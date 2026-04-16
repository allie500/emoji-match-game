import { buildDeck, createGame, gameReducer, MATCH_DELAY_MS, MISMATCH_DELAY_MS } from "./game";
import type { GameState } from "./types";

const fixedRng = () => 0.42;

describe("buildDeck", () => {
  const emojis = ["a", "b", "c"];

  it("returns an empty array when numPairs is 0 or negative", () => {
    expect(buildDeck({ numPairs: 0, emojis })).toEqual([]);
    expect(buildDeck({ numPairs: -1, emojis })).toEqual([]);
  });

  it("produces a deck of length 2 * numPairs", () => {
    const deck = buildDeck({ numPairs: 2, emojis, rng: fixedRng });
    expect(deck).toHaveLength(4);
  });

  it("works without an explicit rng by falling back to Math.random", () => {
    const deck = buildDeck({ numPairs: 2, emojis });
    expect(deck).toHaveLength(4);
  });

  it("has exactly two cards per pairKey", () => {
    const deck = buildDeck({ numPairs: 2, emojis, rng: fixedRng });
    const byKey = new Map<string, number>();
    for (const c of deck) {
      byKey.set(c.pairKey, (byKey.get(c.pairKey) ?? 0) + 1);
    }
    expect(byKey.size).toBe(2);
    for (const count of byKey.values()) {
      expect(count).toBe(2);
    }
  });

  it("uses deterministic ids card-{index}-a and card-{index}-b before shuffle", () => {
    const deck = buildDeck({ numPairs: 1, emojis: ["x"], rng: () => 0 });
    expect(deck.map((c) => c.id).sort()).toEqual(["card-0-a", "card-0-b"]);
  });
});

describe("createGame", () => {
  it("initializes empty flipped state and zero scores", () => {
    const state = createGame({ numPairs: 2, emojis: ["a", "b", "c"], rng: fixedRng });
    expect(state.flippedIds).toEqual([]);
    expect(state.moves).toBe(0);
    expect(state.matches).toBe(0);
    expect(state.numPairs).toBe(2);
    expect(state.lock).toBe(false);
    expect(state.pendingMismatchIds).toBeNull();
    expect(state.pendingMatchPairKey).toBeNull();
    expect(state.matchedPairKeys.size).toBe(0);
  });
});

function minimalState(overrides: Partial<GameState> = {}): GameState {
  return {
    deck: [
      { id: "c1", emoji: "a", pairKey: "a" },
      { id: "c2", emoji: "a", pairKey: "a" },
      { id: "c3", emoji: "b", pairKey: "b" },
      { id: "c4", emoji: "b", pairKey: "b" },
    ],
    flippedIds: [],
    matchedPairKeys: new Set(),
    moves: 0,
    matches: 0,
    numPairs: 2,
    lock: false,
    pendingMismatchIds: null,
    pendingMatchPairKey: null,
    ...overrides,
  };
}

describe("gameReducer", () => {
  describe("flip", () => {
    it("records the first flip", () => {
      const s = minimalState();
      const next = gameReducer(s, { type: "flip", cardId: "c1" });
      expect(next.flippedIds).toEqual(["c1"]);
      expect(next.moves).toBe(0);
    });

    it("does nothing when locked", () => {
      const s = minimalState({ lock: true, flippedIds: ["c1", "c2"] });
      const next = gameReducer(s, { type: "flip", cardId: "c3" });
      expect(next).toBe(s);
    });

    it("does nothing when flipping an already flipped card", () => {
      const s = minimalState({ flippedIds: ["c1"] });
      const next = gameReducer(s, { type: "flip", cardId: "c1" });
      expect(next).toBe(s);
    });

    it("does nothing when the pair is already matched", () => {
      const s = minimalState({ matchedPairKeys: new Set(["a"]) });
      const next = gameReducer(s, { type: "flip", cardId: "c1" });
      expect(next).toBe(s);
    });

    it("does nothing when the card id does not exist in deck", () => {
      const s = minimalState();
      const next = gameReducer(s, { type: "flip", cardId: "missing-id" });
      expect(next).toBe(s);
    });

    it("on match, sets pending match and lock without incrementing matches yet", () => {
      const s = minimalState({ flippedIds: ["c1"] });
      const next = gameReducer(s, { type: "flip", cardId: "c2" });
      expect(next.moves).toBe(1);
      expect(next.matches).toBe(0);
      expect(next.lock).toBe(true);
      expect(next.pendingMatchPairKey).toBe("a");
      expect(next.flippedIds).toEqual(["c1", "c2"]);
    });

    it("on mismatch, sets pending mismatch and lock", () => {
      const s = minimalState({ flippedIds: ["c1"] });
      const next = gameReducer(s, { type: "flip", cardId: "c3" });
      expect(next.moves).toBe(1);
      expect(next.lock).toBe(true);
      expect(next.pendingMismatchIds).toEqual(["c1", "c3"]);
      expect(next.pendingMatchPairKey).toBeNull();
    });

    it("does nothing when first flipped id is missing from deck (defensive)", () => {
      const s = minimalState({ flippedIds: ["missing-id"] });
      const next = gameReducer(s, { type: "flip", cardId: "c3" });
      expect(next).toBe(s);
    });

    it("ignores further flips when flippedIds already has more than one card (defensive)", () => {
      const s = minimalState({ flippedIds: ["c1", "c2"], lock: false });
      const next = gameReducer(s, { type: "flip", cardId: "c3" });
      expect(next).toBe(s);
    });
  });

  describe("resolveMatch", () => {
    it("no-ops without lock or pending match", () => {
      const s = minimalState();
      expect(gameReducer(s, { type: "resolveMatch" })).toBe(s);
      const lockedNoMatch = minimalState({ lock: true, pendingMatchPairKey: null });
      expect(gameReducer(lockedNoMatch, { type: "resolveMatch" })).toBe(lockedNoMatch);
    });

    it("marks pair matched and increments matches", () => {
      const s = minimalState({
        lock: true,
        flippedIds: ["c1", "c2"],
        pendingMatchPairKey: "a",
        moves: 1,
      });
      const next = gameReducer(s, { type: "resolveMatch" });
      expect(next.matches).toBe(1);
      expect(next.matchedPairKeys.has("a")).toBe(true);
      expect(next.flippedIds).toEqual([]);
      expect(next.lock).toBe(false);
      expect(next.pendingMatchPairKey).toBeNull();
    });
  });

  describe("resolveMismatch", () => {
    it("clears flipped cards and unlocks", () => {
      const s = minimalState({
        lock: true,
        flippedIds: ["c1", "c3"],
        pendingMismatchIds: ["c1", "c3"],
      });
      const next = gameReducer(s, { type: "resolveMismatch" });
      expect(next.flippedIds).toEqual([]);
      expect(next.lock).toBe(false);
      expect(next.pendingMismatchIds).toBeNull();
    });

    it("no-ops when not locked", () => {
      const s = minimalState();
      expect(gameReducer(s, { type: "resolveMismatch" })).toBe(s);
    });
  });

  describe("reset", () => {
    it("returns the provided next state", () => {
      const s = minimalState();
      const next = minimalState({ moves: 99 });
      expect(gameReducer(s, { type: "reset", next })).toBe(next);
    });
  });
});

describe("delay constants", () => {
  it("exports expected delays for App timer wiring", () => {
    expect(MATCH_DELAY_MS).toBe(250);
    expect(MISMATCH_DELAY_MS).toBe(750);
  });
});
