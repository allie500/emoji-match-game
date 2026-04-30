import { useMemo, useState } from "react";
import InfoModal from "./InfoModal";

type ModalKey = "credits" | "terms" | "privacy";

const GITHUB_REPO_URL = "https://github.com/allie500/emoji-match-game";

const MODAL_CONTENT: Record<ModalKey, { title: string; body: string }> = {
  credits: {
    title: "Credits",
    body: "Emoji Match Game is built with React, TypeScript, and open source tools. Sound effects downloaded from Pixabay.",
  },
  terms: {
    title: "Terms of Use",
    body: "This game is provided as-is for personal and educational use.",
  },
  privacy: {
    title: "Privacy Policy",
    body: "This app does not collect personal data and runs entirely in your browser.",
  },
};

export default function Footer() {
  const year = useMemo(() => new Date().getFullYear(), []);
  const [activeModal, setActiveModal] = useState<ModalKey | null>(null);

  return (
    <>
      <footer className="mt-8 w-full max-w-2xl border-t border-[var(--border)] pt-4">
        <div className="grid gap-3 text-center text-sm text-[var(--text-muted)] sm:grid-cols-[1fr_auto_1fr] sm:items-center">
          <p className="sm:text-left">Copyright {year} Emoji Match Game.</p>
          <a
            href={GITHUB_REPO_URL}
            target="_blank"
            rel="noreferrer"
            title="This project is open source. View the code on Github."
            aria-label="View source on Github"
            className="mx-auto rounded-md p-1 text-[var(--text-muted)] hover:bg-[var(--social-bg)] hover:text-[var(--text-h)]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="h-5 w-5 fill-current"
            >
              <path d="M12 0a12 12 0 0 0-3.79 23.39c.6.11.82-.26.82-.58v-2.26c-3.34.73-4.04-1.42-4.04-1.42a3.2 3.2 0 0 0-1.33-1.77c-1.09-.74.08-.72.08-.72a2.52 2.52 0 0 1 1.84 1.23 2.58 2.58 0 0 0 3.53 1 2.58 2.58 0 0 1 .77-1.63c-2.67-.31-5.47-1.35-5.47-6a4.7 4.7 0 0 1 1.24-3.24 4.37 4.37 0 0 1 .12-3.19s1-.33 3.3 1.24a11.37 11.37 0 0 1 6 0c2.28-1.57 3.3-1.24 3.3-1.24a4.37 4.37 0 0 1 .12 3.19 4.69 4.69 0 0 1 1.24 3.24c0 4.66-2.8 5.68-5.48 6a2.88 2.88 0 0 1 .82 2.24v3.32c0 .32.22.69.83.58A12 12 0 0 0 12 0Z" />
            </svg>
          </a>
          <div className="flex items-center justify-center gap-3 sm:justify-end">
            <button
              type="button"
              className="text-[var(--text-muted)] hover:text-[var(--text-muted-strong)]"
              onClick={() => setActiveModal("credits")}
            >
              Credits
            </button>
            <button
              type="button"
              className="text-[var(--text-muted)] hover:text-[var(--text-muted-strong)]"
              onClick={() => setActiveModal("terms")}
            >
              Terms of Use
            </button>
            <button
              type="button"
              className="text-[var(--text-muted)] hover:text-[var(--text-muted-strong)]"
              onClick={() => setActiveModal("privacy")}
            >
              Privacy Policy
            </button>
          </div>
        </div>
      </footer>

      <InfoModal
        title={activeModal ? MODAL_CONTENT[activeModal].title : ""}
        body={activeModal ? MODAL_CONTENT[activeModal].body : ""}
        isOpen={activeModal !== null}
        onClose={() => setActiveModal(null)}
      />
    </>
  );
}
