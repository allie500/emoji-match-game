import { act, fireEvent, render, screen } from "@testing-library/react";
import WinOverlay, { CONFETTI_FADE_START_MS, WIN_ZOOM_MS } from "./WinOverlay";

describe("WinOverlay", () => {
  it("fades the confetti layer after CONFETTI_FADE_START_MS", () => {
    vi.useFakeTimers();
    render(<WinOverlay emoji="🎉" onPlayAgain={vi.fn()} />);

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
    const { unmount } = render(<WinOverlay emoji="🎉" onPlayAgain={vi.fn()} />);
    unmount();
    act(() => {
      vi.advanceTimersByTime(CONFETTI_FADE_START_MS);
    });
    vi.useRealTimers();
  });

  it("calls onPlayAgain after the zoom delay", () => {
    vi.useFakeTimers();
    const onPlayAgain = vi.fn();
    render(<WinOverlay emoji="🍕" onPlayAgain={onPlayAgain} />);

    act(() => {
      vi.advanceTimersByTime(WIN_ZOOM_MS);
    });
    fireEvent.click(screen.getByRole("button", { name: "Play Again" }));
    expect(onPlayAgain).toHaveBeenCalledTimes(1);
    vi.useRealTimers();
  });
});
