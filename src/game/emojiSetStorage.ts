import { EMOJI_SET_IDS, type EmojiSetId } from "./emojiPool";

export const EMOJI_SET_STORAGE_KEY = "emoji-match-emoji-set";

export function isEmojiSetId(value: unknown): value is EmojiSetId {
  return typeof value === "string" && (EMOJI_SET_IDS as readonly string[]).includes(value);
}

export function getStoredEmojiSetId(): EmojiSetId | null {
  try {
    const stored = window.localStorage.getItem(EMOJI_SET_STORAGE_KEY);
    return isEmojiSetId(stored) ? stored : null;
  } catch {
    return null;
  }
}

export function resolveInitialEmojiSetId(): EmojiSetId {
  return getStoredEmojiSetId() ?? "default";
}

export function persistEmojiSetId(id: EmojiSetId) {
  try {
    window.localStorage.setItem(EMOJI_SET_STORAGE_KEY, id);
  } catch {
    // Ignore write failures (private mode/storage restrictions).
  }
}
