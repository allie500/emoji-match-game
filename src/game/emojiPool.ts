export const DEFAULT_EMOJIS = [
  "🍕",
  "🍔",
  "🍟",
  "🌮",
  "🌯",
  "🥑",
  "🍣",
  "🍜",
  "🍩",
  "🍪",
  "🍫",
  "🧁",
  "🍦",
  "🎲",
  "🚗",
  "🚕",
  "🚙",
  "✈️",
  "🚀",
  "🧠",
];

export function pickEmojis(pool: string[], numPairs: number): string[] {
  if (numPairs <= 0) return [];
  if (pool.length < numPairs) {
    throw new Error(`Not enough emojis in pool (${pool.length}) for ${numPairs} pairs.`);
  }
  return pool.slice(0, numPairs);
}
