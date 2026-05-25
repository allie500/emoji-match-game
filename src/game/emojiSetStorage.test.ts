import {
  EMOJI_SET_STORAGE_KEY,
  getStoredEmojiSetId,
  isEmojiSetId,
  persistEmojiSetId,
  resolveInitialEmojiSetId,
} from "./emojiSetStorage";

describe("isEmojiSetId", () => {
  it.each(["default", "food", "flags", "faces"] as const)("accepts %s", (id) => {
    expect(isEmojiSetId(id)).toBe(true);
  });

  it("rejects unknown string ids", () => {
    expect(isEmojiSetId("animals")).toBe(false);
    expect(isEmojiSetId("")).toBe(false);
  });

  it("rejects non-strings", () => {
    expect(isEmojiSetId(null)).toBe(false);
    expect(isEmojiSetId(1)).toBe(false);
  });
});

describe("getStoredEmojiSetId", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("returns null when nothing is stored", () => {
    expect(getStoredEmojiSetId()).toBeNull();
  });

  it("returns null when stored value is not a valid id", () => {
    window.localStorage.setItem(EMOJI_SET_STORAGE_KEY, "nope");
    expect(getStoredEmojiSetId()).toBeNull();
  });

  it("returns the stored id when valid", () => {
    window.localStorage.setItem(EMOJI_SET_STORAGE_KEY, "flags");
    expect(getStoredEmojiSetId()).toBe("flags");
  });

  it("returns null when localStorage.getItem throws", () => {
    const spy = vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    expect(getStoredEmojiSetId()).toBeNull();
    spy.mockRestore();
  });
});

describe("resolveInitialEmojiSetId", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("returns default when nothing valid is stored", () => {
    expect(resolveInitialEmojiSetId()).toBe("default");
  });

  it("returns stored id when valid", () => {
    window.localStorage.setItem(EMOJI_SET_STORAGE_KEY, "faces");
    expect(resolveInitialEmojiSetId()).toBe("faces");
  });
});

describe("persistEmojiSetId", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("writes the id to localStorage", () => {
    persistEmojiSetId("food");
    expect(window.localStorage.getItem(EMOJI_SET_STORAGE_KEY)).toBe("food");
  });

  it("does not throw when localStorage.setItem throws", () => {
    const spy = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("quota");
    });
    expect(() => persistEmojiSetId("flags")).not.toThrow();
    spy.mockRestore();
  });
});
