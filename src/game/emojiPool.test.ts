import {
  DEFAULT_EMOJIS,
  FACES_EMOJIS,
  FLAGS_EMOJIS,
  FOOD_EMOJIS,
  getEmojisForSet,
  pickEmojis,
} from "./emojiPool";

describe("emoji pools", () => {
  it("includes at least 20 entries in each set", () => {
    expect(DEFAULT_EMOJIS.length).toBeGreaterThanOrEqual(20);
    expect(FOOD_EMOJIS.length).toBeGreaterThanOrEqual(20);
    expect(FLAGS_EMOJIS.length).toBeGreaterThanOrEqual(20);
    expect(FACES_EMOJIS.length).toBeGreaterThanOrEqual(20);
  });
});

describe("getEmojisForSet", () => {
  it("returns default pool for default", () => {
    expect(getEmojisForSet("default")).toBe(DEFAULT_EMOJIS);
  });

  it("returns food pool containing a known food emoji", () => {
    expect(getEmojisForSet("food")).toContain("🍎");
  });

  it("returns flags pool containing a known flag", () => {
    expect(getEmojisForSet("flags")).toContain("🇺🇸");
  });

  it("returns faces pool containing a known face", () => {
    expect(getEmojisForSet("faces")).toContain("😀");
  });
});

describe("pickEmojis", () => {
  const pool = ["a", "b", "c", "d", "e"];

  it("returns the first numPairs emojis from the pool", () => {
    expect(pickEmojis(pool, 3)).toEqual(["a", "b", "c"]);
  });

  it("returns an empty array when numPairs is 0", () => {
    expect(pickEmojis(pool, 0)).toEqual([]);
  });

  it("returns an empty array when numPairs is negative", () => {
    expect(pickEmojis(pool, -1)).toEqual([]);
  });

  it("throws when the pool is smaller than numPairs", () => {
    expect(() => pickEmojis(["a", "b"], 3)).toThrow(/Not enough emojis/);
  });
});
