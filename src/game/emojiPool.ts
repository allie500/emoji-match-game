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

export const FOOD_EMOJIS = [
  "🍎",
  "🍊",
  "🍋",
  "🍌",
  "🍉",
  "🍇",
  "🍓",
  "🫐",
  "🍒",
  "🍑",
  "🥭",
  "🍍",
  "🥥",
  "🥝",
  "🍅",
  "🫛",
  "🌶️",
  "🫑",
  "🥒",
  "🥬",
];

export const FLAGS_EMOJIS = [
  "🇺🇸",
  "🇬🇧",
  "🇨🇦",
  "🇯🇵",
  "🇫🇷",
  "🇩🇪",
  "🇮🇹",
  "🇪🇸",
  "🇧🇷",
  "🇲🇽",
  "🇰🇷",
  "🇮🇳",
  "🇦🇺",
  "🇸🇪",
  "🇳🇴",
  "🇫🇮",
  "🇳🇱",
  "🇵🇱",
  "🇨🇭",
  "🇦🇹",
];

export const FACES_EMOJIS = [
  "😀",
  "😃",
  "😄",
  "😁",
  "😆",
  "😅",
  "🤣",
  "😂",
  "🙂",
  "🙃",
  "😉",
  "😊",
  "😇",
  "🥰",
  "😍",
  "🤩",
  "😘",
  "😗",
  "😚",
  "😋",
];

export const EMOJI_SET_IDS = ["default", "food", "flags", "faces"] as const;
export type EmojiSetId = (typeof EMOJI_SET_IDS)[number];

export const EMOJI_SET_LABELS: Record<EmojiSetId, string> = {
  default: "Default",
  food: "Food",
  flags: "Flags",
  faces: "Faces",
};

export function getEmojisForSet(setId: EmojiSetId): string[] {
  switch (setId) {
    case "default":
      return DEFAULT_EMOJIS;
    case "food":
      return FOOD_EMOJIS;
    case "flags":
      return FLAGS_EMOJIS;
    case "faces":
      return FACES_EMOJIS;
  }
}

export function pickEmojis(pool: string[], numPairs: number): string[] {
  if (numPairs <= 0) return [];
  if (pool.length < numPairs) {
    throw new Error(`Not enough emojis in pool (${pool.length}) for ${numPairs} pairs.`);
  }
  return pool.slice(0, numPairs);
}
