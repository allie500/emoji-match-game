import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import EmojiCard from "./EmojiCard";

describe("EmojiCard", () => {
  it("uses Card hidden aria-label when face down", () => {
    render(
      <EmojiCard
        cardId="x1"
        emoji="🍕"
        faceUp={false}
        matched={false}
        disabled={false}
        onClick={vi.fn()}
      />,
    );
    expect(screen.getByRole("button", { name: "Card hidden" })).toBeInTheDocument();
  });

  it("uses Card: emoji aria-label when face up", () => {
    render(
      <EmojiCard
        cardId="x1"
        emoji="🍕"
        faceUp={true}
        matched={false}
        disabled={false}
        onClick={vi.fn()}
      />,
    );
    expect(screen.getByRole("button", { name: "Card: 🍕" })).toBeInTheDocument();
  });

  it("calls onClick with cardId when clicked and not disabled", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <EmojiCard
        cardId="abc"
        emoji="🍔"
        faceUp={false}
        matched={false}
        disabled={false}
        onClick={onClick}
      />,
    );
    await user.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onClick).toHaveBeenCalledWith("abc");
  });

  it("does not call onClick when disabled", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <EmojiCard
        cardId="abc"
        emoji="🍔"
        faceUp={true}
        matched={false}
        disabled={true}
        onClick={onClick}
      />,
    );
    await user.click(screen.getByRole("button"));
    expect(onClick).not.toHaveBeenCalled();
  });
});
