import { pickEmojis } from "./emojiPool";

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
