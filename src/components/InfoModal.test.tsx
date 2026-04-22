import { fireEvent, render, screen } from "@testing-library/react";
import InfoModal from "./InfoModal";

describe("InfoModal", () => {
  it("renders dialog content when open", () => {
    render(<InfoModal title="Credits" body="Some credits text" isOpen={true} onClose={vi.fn()} />);

    expect(screen.getByRole("dialog", { name: "Credits" })).toBeInTheDocument();
    expect(screen.getByText("Some credits text")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Close modal" })).toBeInTheDocument();
  });

  it("does not render when closed", () => {
    render(<InfoModal title="Credits" body="Some credits text" isOpen={false} onClose={vi.fn()} />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("calls onClose when pressing Escape", () => {
    const onClose = vi.fn();
    render(<InfoModal title="Credits" body="Some credits text" isOpen={true} onClose={onClose} />);

    fireEvent.keyDown(window, { key: "Escape" });

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("does not call onClose when pressing other keys", () => {
    const onClose = vi.fn();
    render(<InfoModal title="Credits" body="Some credits text" isOpen={true} onClose={onClose} />);

    fireEvent.keyDown(window, { key: "Enter" });

    expect(onClose).not.toHaveBeenCalled();
  });

  it("calls onClose when clicking overlay", () => {
    const onClose = vi.fn();
    render(<InfoModal title="Credits" body="Some credits text" isOpen={true} onClose={onClose} />);

    fireEvent.click(screen.getByTestId("info-modal-overlay"));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("does not call onClose when clicking inside the panel", () => {
    const onClose = vi.fn();
    render(<InfoModal title="Credits" body="Some credits text" isOpen={true} onClose={onClose} />);

    fireEvent.click(screen.getByRole("dialog", { name: "Credits" }));

    expect(onClose).not.toHaveBeenCalled();
  });
});
