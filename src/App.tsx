import { type ChangeEvent, useEffect, useReducer, useRef, useState } from "react";
import { playSfx } from "./audio/sfx";
import Board from "./components/Board";
import Footer from "./components/Footer";
import {
  EMOJI_SET_IDS,
  EMOJI_SET_LABELS,
  getEmojisForSet,
  type EmojiSetId,
} from "./game/emojiPool";
import { createGame, gameReducer, MATCH_DELAY_MS, MISMATCH_DELAY_MS } from "./game/game";
import { isEmojiSetId, persistEmojiSetId, resolveInitialEmojiSetId } from "./game/emojiSetStorage";
import type { CardId } from "./game/types";
import { applyTheme, persistTheme, resolveInitialTheme, type Theme } from "./theme";

const NUM_PAIRS = 8;
const COLS = 4;

function App() {
  const [theme, setTheme] = useState<Theme>(() => resolveInitialTheme());
  const [emojiSetId, setEmojiSetId] = useState<EmojiSetId>(() => resolveInitialEmojiSetId());
  const [state, dispatch] = useReducer(gameReducer, undefined, () =>
    createGame({ numPairs: NUM_PAIRS, emojis: getEmojisForSet(emojiSetId) }),
  );
  const hasPlayedWinSfxRef = useRef(false);

  useEffect(() => {
    applyTheme(theme);
    persistTheme(theme);
  }, [theme]);

  useEffect(() => {
    persistEmojiSetId(emojiSetId);
  }, [emojiSetId]);

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
    dispatch({
      type: "reset",
      next: createGame({ numPairs: NUM_PAIRS, emojis: getEmojisForSet(emojiSetId) }),
    });
  };

  const onEmojiSetChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const nextId = event.target.value;
    if (!isEmojiSetId(nextId) || nextId === emojiSetId) return;
    playSfx("resetBoard");
    setEmojiSetId(nextId);
    dispatch({
      type: "reset",
      next: createGame({ numPairs: NUM_PAIRS, emojis: getEmojisForSet(nextId) }),
    });
  };

  const onThemeToggle = () => {
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  };
  const isDarkTheme = theme === "dark";
  const nextThemeLabel = isDarkTheme ? "light mode" : "dark mode";

  return (
    <div className="min-h-[100svh] flex flex-col items-center justify-center px-4 py-8">
      <header className="w-full max-w-2xl text-center mb-6">
        <div className="flex flex-col items-center gap-2 sm:grid sm:grid-cols-[1fr_auto_1fr] sm:items-center sm:gap-4">
          <span aria-hidden="true" className="hidden sm:block" />
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight whitespace-nowrap sm:justify-self-center">
            🤔 Emoji Match 🎉
          </h1>
          <button
            type="button"
            aria-label={`Switch to ${nextThemeLabel}`}
            aria-pressed={isDarkTheme}
            onClick={onThemeToggle}
            className="mb-1 inline-flex h-8 w-16 items-center rounded-full border border-[var(--border)] bg-[var(--code-bg)] px-1 transition-colors hover:bg-[var(--social-bg)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fuchsia-500 sm:mb-0 sm:justify-self-end"
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

      <div className="w-full max-w-2xl flex flex-col gap-4 sm:items-center">
        <div className="flex w-full flex-col gap-1.5 px-2 sm:w-auto sm:flex-row sm:items-center sm:justify-start sm:gap-3">
          <label
            htmlFor="emoji-set"
            className="text-sm sm:text-base text-[var(--text-muted)] shrink-0"
          >
            Emoji set
          </label>
          <select
            id="emoji-set"
            value={emojiSetId}
            onChange={onEmojiSetChange}
            className="w-full sm:w-auto sm:max-w-[10rem] rounded-lg border border-[var(--border)] bg-[var(--code-bg)] px-3 py-2 text-sm sm:text-base text-[var(--text-h)] shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fuchsia-500"
          >
            {EMOJI_SET_IDS.map((id) => (
              <option key={id} value={id}>
                {EMOJI_SET_LABELS[id]}
              </option>
            ))}
          </select>
        </div>

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
      </div>

      <Footer />
    </div>
  );
}

export default App;
