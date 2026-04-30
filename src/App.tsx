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

  return (
    <div className="min-h-[100svh] flex flex-col items-center justify-center px-4 py-8">
      <header className="w-full max-w-2xl text-center mb-6">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">🤔 Emoji Match 🎉</h1>
          <button
            type="button"
            aria-label="Toggle dark mode"
            aria-pressed={isDarkTheme}
            onClick={onThemeToggle}
            className="rounded-lg border border-[var(--border)] bg-[var(--code-bg)] px-3 py-1.5 text-sm font-medium text-[var(--text-h)] transition-colors hover:bg-[var(--social-bg)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fuchsia-500"
          >
            {isDarkTheme ? "Dark" : "Light"}
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
