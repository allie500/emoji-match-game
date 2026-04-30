import { useEffect, useReducer, useRef, useState } from "react";
import { playSfx } from "./audio/sfx";
import Board from "./components/Board";
import Footer from "./components/Footer";
import { createGame, gameReducer, MATCH_DELAY_MS, MISMATCH_DELAY_MS } from "./game/game";
import type { CardId } from "./game/types";
import { applyTheme, persistTheme, resolveInitialTheme, type Theme } from "./theme";

const NUM_PAIRS = 8;
const COLS = 4;

function App() {
  const [theme, setTheme] = useState<Theme>(() => resolveInitialTheme());
  const [state, dispatch] = useReducer(gameReducer, undefined, () =>
    createGame({ numPairs: NUM_PAIRS }),
  );
  const hasPlayedWinSfxRef = useRef(false);

  useEffect(() => {
    applyTheme(theme);
    persistTheme(theme);
  }, [theme]);

  useEffect(() => {
    if (!state.lock) return;

    const isMatch = Boolean(state.pendingMatchPairKey);
    const delayMs = isMatch ? MATCH_DELAY_MS : MISMATCH_DELAY_MS;
    const actionType = isMatch ? "resolveMatch" : "resolveMismatch";

    const t = window.setTimeout(() => {
      dispatch({ type: actionType });
      playSfx(isMatch ? "successfulMatch" : "mismatchFlipDown");
    }, delayMs);

    return () => window.clearTimeout(t);
  }, [state.lock, state.pendingMatchPairKey]);

  useEffect(() => {
    const hasWon = state.matches >= state.numPairs && state.numPairs > 0;
    if (!hasWon) {
      hasPlayedWinSfxRef.current = false;
      return;
    }

    if (hasPlayedWinSfxRef.current) return;
    hasPlayedWinSfxRef.current = true;
    playSfx("youWon");
  }, [state.matches, state.numPairs]);

  const onCardClick = (cardId: CardId) => {
    playSfx("cardFlipUp");
    dispatch({ type: "flip", cardId });
  };

  const onReset = () => {
    playSfx("resetBoard");
    dispatch({ type: "reset", next: createGame({ numPairs: NUM_PAIRS }) });
  };

  const onThemeToggle = () => {
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  };
  const isDarkTheme = theme === "dark";
  const nextThemeLabel = isDarkTheme ? "light mode" : "dark mode";

  return (
    <div className="min-h-[100svh] flex flex-col items-center justify-center px-4 py-8">
      <header className="w-full max-w-2xl text-center mb-6">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
          <span aria-hidden="true" />
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight justify-self-center">
            🤔 Emoji Match 🎉
          </h1>
          <button
            type="button"
            aria-label={`Switch to ${nextThemeLabel}`}
            aria-pressed={isDarkTheme}
            onClick={onThemeToggle}
            className="justify-self-end inline-flex h-8 w-16 items-center rounded-full border border-[var(--border)] bg-[var(--code-bg)] px-1 transition-colors hover:bg-[var(--social-bg)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fuchsia-500"
          >
            <span className="sr-only">
              {isDarkTheme ? "Dark mode enabled" : "Light mode enabled"}
            </span>
            <span
              className={`flex h-6 w-6 items-center justify-center rounded-full bg-[var(--bg)] text-[var(--text-h)] shadow-sm transition-transform ${
                isDarkTheme ? "translate-x-8" : "translate-x-0"
              }`}
              aria-hidden="true"
            >
              {isDarkTheme ? "☾" : "☀"}
            </span>
          </button>
        </div>
        <p className="mt-2 text-sm sm:text-base text-[var(--text-muted)]">
          Flip two cards to find matching emojis.
        </p>
      </header>

      <Board
        cards={state.deck}
        cols={COLS}
        flippedIds={state.flippedIds}
        matchedPairKeys={state.matchedPairKeys}
        lock={state.lock}
        moves={state.moves}
        matches={state.matches}
        numPairs={state.numPairs}
        winningEmoji={state.winningEmoji}
        onCardClick={onCardClick}
        onReset={onReset}
      />

      <Footer />
    </div>
  );
}

export default App;
