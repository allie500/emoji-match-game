import { act, fireEvent, render, screen, within } from "@testing-library/react";
import App from "./App";
import { playSfx } from "./audio/sfx";
import { MATCH_DELAY_MS, MISMATCH_DELAY_MS } from "./game/game";

const { mockEmojis } = vi.hoisted(() => ({
  mockEmojis: ["🍕", "🍔", "🍟", "🌮", "🌯", "🥑", "🍣", "🍜"],
}));

vi.mock("./game/game", async (importOriginal) => {
  const actual = await importOriginal<typeof import("./game/game")>();
  const deck = mockEmojis.flatMap((e, i) => [
    { id: `pair-${i}-a`, emoji: e, pairKey: e },
    { id: `pair-${i}-b`, emoji: e, pairKey: e },
  ]);
  return {
    ...actual,
    createGame: vi.fn(() => ({
      deck,
      flippedIds: [],
      matchedPairKeys: new Set<string>(),
      moves: 0,
      matches: 0,
      numPairs: 8,
      lock: false,
      pendingMismatchIds: null,
      pendingMatchPairKey: null,
    })),
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
    vi.useFakeTimers();
    vi.mocked(playSfx).mockClear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders title and instructions", () => {
    render(<App />);
    expect(screen.getByRole("heading", { name: "Emoji Match" })).toBeInTheDocument();
    expect(screen.getByText(/Flip two cards to find matching emojis/)).toBeInTheDocument();
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
});
