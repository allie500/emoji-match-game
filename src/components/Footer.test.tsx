import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Footer from "./Footer";

describe("Footer", () => {
  it("shows copyright notice with current year", () => {
    render(<Footer />);
    const year = new Date().getFullYear();
    expect(screen.getByText(`Copyright ${year} Emoji Match Game.`)).toBeInTheDocument();
  });

  it("renders Github link with required title and placeholder URL", () => {
    render(<Footer />);
    const githubLink = screen.getByRole("link", { name: "View source on Github" });

    expect(githubLink).toHaveAttribute(
      "title",
      "This project is open source. View the code on Github.",
    );
    expect(githubLink).toHaveAttribute("href", "https://github.com/allie500/emoji-match-game");
  });

  it("renders all legal links", () => {
    render(<Footer />);
    expect(screen.getByRole("button", { name: "Credits" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Terms of Use" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Privacy Policy" })).toBeInTheDocument();
  });

  it("opens the matching modal for each legal link", async () => {
    const user = userEvent.setup();
    render(<Footer />);

    await user.click(screen.getByRole("button", { name: "Credits" }));
    expect(screen.getByRole("dialog", { name: "Credits" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Close modal" }));

    await user.click(screen.getByRole("button", { name: "Terms of Use" }));
    expect(screen.getByRole("dialog", { name: "Terms of Use" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Close modal" }));

    await user.click(screen.getByRole("button", { name: "Privacy Policy" }));
    expect(screen.getByRole("dialog", { name: "Privacy Policy" })).toBeInTheDocument();
  });
});
