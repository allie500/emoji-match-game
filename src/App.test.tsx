import { act, fireEvent, render, screen, within } from "@testing-library/react";
import App from "./App";
import { playSfx } from "./audio/sfx";
import { getEmojisForSet } from "./game/emojiPool";
import { createGame, MATCH_DELAY_MS, MISMATCH_DELAY_MS } from "./game/game";
import { EMOJI_SET_STORAGE_KEY } from "./game/emojiSetStorage";
import { WIN_ZOOM_MS } from "./components/WinOverlay";

const { mockEmojis } = vi.hoisted(() => ({
  mockEmojis: ["🍕", "🍔", "🍟", "🌮", "🌯", "🥑", "🍣", "🍜"],
}));

function buildMockGameState(emojis: string[]) {
  const deck = emojis.flatMap((e, i) => [
    { id: `pair-${i}-a`, emoji: e, pairKey: e },
    { id: `pair-${i}-b`, emoji: e, pairKey: e },
  ]);
  return {
    deck,
    flippedIds: [],
    matchedPairKeys: new Set<string>(),
    moves: 0,
    matches: 0,
    numPairs: 8,
    winningEmoji: null,
    lock: false,
    pendingMismatchIds: null,
    pendingMatchPairKey: null,
  };
}

vi.mock("./game/game", async (importOriginal) => {
  const actual = await importOriginal<typeof import("./game/game")>();
  return {
    ...actual,
    createGame: vi.fn((config?: { numPairs?: number; emojis?: string[] }) => {
      const emojis = config?.emojis?.slice(0, 8) ?? mockEmojis;
      return buildMockGameState(emojis);
    }),
  };
});

vi.mock("./audio/sfx", () => ({
  playSfx: vi.fn(),
}));

function getCardButtons() {
  return screen.getAllByRole("button", { name: /Card hidden|Card:/ });
}

describe("App", () => {
  beforeEach(() => {
    window.localStorage.clear();
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: query === "(prefers-color-scheme: dark)",
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
    vi.useFakeTimers();
    vi.mocked(playSfx).mockClear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders title and instructions", () => {
    render(<App />);
    expect(screen.getByRole("heading", { name: "🤔 Emoji Match 🎉" })).toBeInTheDocument();
    expect(screen.getByText(/Flip two cards to find matching emojis/)).toBeInTheDocument();
  });

  it("uses system dark theme by default and toggles to light mode", () => {
    render(<App />);

    const themeToggle = screen.getByRole("button", { name: "Switch to light mode" });
    expect(themeToggle).toHaveAttribute("aria-pressed", "true");
    expect(themeToggle).toHaveTextContent("☾");
    expect(document.documentElement.dataset.theme).toBe("dark");
    expect(window.localStorage.getItem("emoji-match-theme")).toBe("dark");

    fireEvent.click(themeToggle);

    expect(themeToggle).toHaveAttribute("aria-pressed", "false");
    expect(themeToggle).toHaveAccessibleName("Switch to dark mode");
    expect(themeToggle).toHaveTextContent("☀");
    expect(document.documentElement.dataset.theme).toBe("light");
    expect(window.localStorage.getItem("emoji-match-theme")).toBe("light");
  });

  it("restores saved theme preference from localStorage", () => {
    window.localStorage.setItem("emoji-match-theme", "light");
    render(<App />);

    const themeToggle = screen.getByRole("button", { name: "Switch to dark mode" });
    expect(themeToggle).toHaveAttribute("aria-pressed", "false");
    expect(themeToggle).toHaveTextContent("☀");
    expect(document.documentElement.dataset.theme).toBe("light");
  });

  it("renders footer content with legal links", () => {
    render(<App />);
    expect(screen.getByText(/Copyright \d{4} Emoji Match Game\./)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Credits" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Terms of Use" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Privacy Policy" })).toBeInTheDocument();
  });

  it("after a matching pair, increments matches only after MATCH_DELAY_MS", () => {
    render(<App />);

    const cards = getCardButtons();
    fireEvent.click(cards[0]);
    fireEvent.click(cards[1]);

    const stats = screen.getByText(/Matches:/).closest("div");
    expect(stats).not.toBeNull();
    expect(within(stats!).getByText("0/8", { exact: false })).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(MATCH_DELAY_MS);
    });

    expect(within(stats!).getByText("1/8", { exact: false })).toBeInTheDocument();
    expect(playSfx).toHaveBeenCalledWith("successfulMatch");
  });

  it("after a mismatch, flips cards back after MISMATCH_DELAY_MS", () => {
    render(<App />);

    const cards = getCardButtons();
    fireEvent.click(cards[0]);
    fireEvent.click(cards[2]);

    expect(screen.getAllByRole("button", { name: /Card: 🍕|Card: 🍔/ })).toHaveLength(2);

    act(() => {
      vi.advanceTimersByTime(MISMATCH_DELAY_MS);
    });

    expect(screen.getAllByRole("button", { name: "Card hidden" })).toHaveLength(16);
    expect(playSfx).toHaveBeenCalledWith("mismatchFlipDown");
  });

  it("plays card flip sound when clicking a card", () => {
    render(<App />);

    fireEvent.click(getCardButtons()[0]);

    expect(playSfx).toHaveBeenCalledWith("cardFlipUp");
  });

  it("plays reset board sound when reset is clicked", () => {
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: "Reset" }));

    expect(playSfx).toHaveBeenCalledWith("resetBoard");
  });

  it("plays win sound once when the board is completed", () => {
    render(<App />);

    const cards = getCardButtons();
    for (let i = 0; i < mockEmojis.length; i++) {
      fireEvent.click(cards[i * 2]);
      fireEvent.click(cards[i * 2 + 1]);
      act(() => {
        vi.advanceTimersByTime(MATCH_DELAY_MS);
      });
    }

    const winCalls = vi.mocked(playSfx).mock.calls.filter(([effect]) => effect === "youWon");
    expect(winCalls).toHaveLength(1);
  });

  it("shows win overlay content after final match animation and play again resets game", () => {
    render(<App />);

    const cards = getCardButtons();
    for (let i = 0; i < mockEmojis.length; i++) {
      fireEvent.click(cards[i * 2]);
      fireEvent.click(cards[i * 2 + 1]);
      act(() => {
        vi.advanceTimersByTime(MATCH_DELAY_MS);
      });
    }

    expect(screen.queryByText("YOU WON")).not.toBeInTheDocument();
    act(() => {
      vi.advanceTimersByTime(WIN_ZOOM_MS);
    });
    expect(screen.getByText("YOU WON")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Play Again" }));
    expect(screen.getByText(/Matches:/).closest("div")).toHaveTextContent("0/8");
  });

  it("renders emoji set combobox with four options and default selected", () => {
    render(<App />);

    const combo = screen.getByRole("combobox", { name: /^emoji set$/i });
    expect(combo).toHaveValue("default");
    expect(combo).toHaveDisplayValue("Default");
    const options = within(combo as HTMLElement).getAllByRole("option");
    expect(options).toHaveLength(4);
    expect(options.map((o) => (o as HTMLOptionElement).value)).toEqual([
      "default",
      "food",
      "flags",
      "faces",
    ]);
  });

  it("persists emoji set to localStorage when the selection changes", () => {
    render(<App />);

    fireEvent.change(screen.getByRole("combobox", { name: /^emoji set$/i }), {
      target: { value: "food" },
    });

    expect(window.localStorage.getItem(EMOJI_SET_STORAGE_KEY)).toBe("food");
  });

  it("restores saved emoji set from localStorage on mount", () => {
    window.localStorage.setItem(EMOJI_SET_STORAGE_KEY, "flags");
    render(<App />);

    expect(screen.getByRole("combobox", { name: /^emoji set$/i })).toHaveValue("flags");
  });

  it("plays resetBoard when the emoji set changes", () => {
    render(<App />);
    vi.mocked(playSfx).mockClear();

    fireEvent.change(screen.getByRole("combobox", { name: /^emoji set$/i }), {
      target: { value: "food" },
    });

    expect(playSfx).toHaveBeenCalledWith("resetBoard");
  });

  it("passes the current emoji pool to createGame on reset after changing the set", () => {
    render(<App />);

    fireEvent.change(screen.getByRole("combobox", { name: /^emoji set$/i }), {
      target: { value: "food" },
    });
    vi.mocked(createGame).mockClear();

    fireEvent.click(screen.getByRole("button", { name: "Reset" }));

    expect(createGame).toHaveBeenCalledTimes(1);
    expect(createGame).toHaveBeenCalledWith({
      numPairs: 8,
      emojis: getEmojisForSet("food"),
    });
  });
});
