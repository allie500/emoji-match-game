import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Board from "./Board";
import type { GameCard } from "../game/types";

const sampleCards: GameCard[] = [
  { id: "c1", emoji: "🍕", pairKey: "🍕" },
  { id: "c2", emoji: "🍕", pairKey: "🍕" },
  { id: "c3", emoji: "🍔", pairKey: "🍔" },
  { id: "c4", emoji: "🍔", pairKey: "🍔" },
];

describe("Board", () => {
  it("shows moves and matches", () => {
    render(
      <Board
        cards={sampleCards}
        cols={2}
        flippedIds={[]}
        matchedPairKeys={new Set()}
        lock={false}
        moves={3}
        matches={1}
        numPairs={2}
        onCardClick={vi.fn()}
        onReset={vi.fn()}
      />,
    );
    expect(screen.getByText(/Moves:/)).toHaveTextContent("3");
    expect(screen.getByText(/Matches:/)).toHaveTextContent("1/2");
  });

  it("calls onReset when Reset is clicked", async () => {
    const user = userEvent.setup();
    const onReset = vi.fn();
    render(
      <Board
        cards={sampleCards}
        cols={2}
        flippedIds={[]}
        matchedPairKeys={new Set()}
        lock={false}
        moves={0}
        matches={0}
        numPairs={2}
        onCardClick={vi.fn()}
        onReset={onReset}
      />,
    );
    await user.click(screen.getByRole("button", { name: "Reset" }));
    expect(onReset).toHaveBeenCalledTimes(1);
  });

  it("shows You won! when matches reach numPairs", () => {
    render(
      <Board
        cards={sampleCards}
        cols={2}
        flippedIds={[]}
        matchedPairKeys={new Set(["🍕", "🍔"])}
        lock={false}
        moves={2}
        matches={2}
        numPairs={2}
        onCardClick={vi.fn()}
        onReset={vi.fn()}
      />,
    );
    expect(screen.getByText("You won!")).toBeInTheDocument();
  });

  it("disables card buttons when lock is true", () => {
    render(
      <Board
        cards={sampleCards}
        cols={2}
        flippedIds={["c1"]}
        matchedPairKeys={new Set()}
        lock={true}
        moves={0}
        matches={0}
        numPairs={2}
        onCardClick={vi.fn()}
        onReset={vi.fn()}
      />,
    );
    const buttons = screen.getAllByRole("button");
    const cardButtons = buttons.filter((b) => b.getAttribute("aria-label")?.startsWith("Card"));
    expect(cardButtons.every((b) => b.hasAttribute("disabled"))).toBe(true);
  });

  it("calls onCardClick with card id when clicking an enabled face-down card", async () => {
    const user = userEvent.setup();
    const onCardClick = vi.fn();
    render(
      <Board
        cards={sampleCards}
        cols={2}
        flippedIds={[]}
        matchedPairKeys={new Set()}
        lock={false}
        moves={0}
        matches={0}
        numPairs={2}
        onCardClick={onCardClick}
        onReset={vi.fn()}
      />,
    );
    await user.click(screen.getAllByRole("button", { name: "Card hidden" })[0]);
    expect(onCardClick).toHaveBeenCalledWith("c1");
  });
});
