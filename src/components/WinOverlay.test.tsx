import { act, fireEvent, render, screen } from "@testing-library/react";
import WinOverlay, { CONFETTI_FADE_START_MS, WIN_ZOOM_MS } from "./WinOverlay";

describe("WinOverlay", () => {
  it("fades the confetti layer after CONFETTI_FADE_START_MS", () => {
    vi.useFakeTimers();
    render(<WinOverlay emoji="🎉" moves={0} onPlayAgain={vi.fn()} />);

    const confetti = screen.getByTestId("win-confetti");
    expect(confetti).toHaveClass("opacity-100");

    act(() => {
      vi.advanceTimersByTime(CONFETTI_FADE_START_MS);
    });
    expect(confetti).toHaveClass("opacity-0");

    vi.useRealTimers();
  });

  it("clears timers on unmount", () => {
    vi.useFakeTimers();
    const { unmount } = render(<WinOverlay emoji="🎉" moves={0} onPlayAgain={vi.fn()} />);
    unmount();
    act(() => {
      vi.advanceTimersByTime(CONFETTI_FADE_START_MS);
    });
    vi.useRealTimers();
  });

  it("calls onPlayAgain after the zoom delay", () => {
    vi.useFakeTimers();
    const onPlayAgain = vi.fn();
    render(<WinOverlay emoji="🍕" moves={0} onPlayAgain={onPlayAgain} />);

    act(() => {
      vi.advanceTimersByTime(WIN_ZOOM_MS);
    });
    fireEvent.click(screen.getByRole("button", { name: "Play Again" }));
    expect(onPlayAgain).toHaveBeenCalledTimes(1);
    vi.useRealTimers();
  });

  it("shows move count after the zoom delay", () => {
    vi.useFakeTimers();
    render(<WinOverlay emoji="🎉" moves={7} onPlayAgain={vi.fn()} />);

    const moveCount = screen.getByText("Completed in 7 moves.");
    expect(moveCount).toHaveClass("invisible", "opacity-0");
    expect(moveCount).toHaveAttribute("aria-hidden", "true");

    act(() => {
      vi.advanceTimersByTime(WIN_ZOOM_MS);
    });
    expect(moveCount).toHaveClass("visible", "opacity-100");
    expect(moveCount).toHaveAttribute("aria-hidden", "false");

    vi.useRealTimers();
  });
});
