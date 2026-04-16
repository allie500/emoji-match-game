import { useEffect, useReducer } from "react";
import Board from "./components/Board";
import { createGame, gameReducer, MATCH_DELAY_MS, MISMATCH_DELAY_MS } from "./game/game";
import type { CardId } from "./game/types";

const NUM_PAIRS = 8;
const COLS = 4;

function App() {
  const [state, dispatch] = useReducer(gameReducer, undefined, () =>
    createGame({ numPairs: NUM_PAIRS }),
  );

  useEffect(() => {
    if (!state.lock) return;

    const delayMs = state.pendingMatchPairKey ? MATCH_DELAY_MS : MISMATCH_DELAY_MS;
    const actionType = state.pendingMatchPairKey ? "resolveMatch" : "resolveMismatch";

    const t = window.setTimeout(() => dispatch({ type: actionType }), delayMs);

    return () => window.clearTimeout(t);
  }, [state.lock, state.pendingMatchPairKey]);

  const onCardClick = (cardId: CardId) => {
    dispatch({ type: "flip", cardId });
  };

  const onReset = () => {
    dispatch({ type: "reset", next: createGame({ numPairs: NUM_PAIRS }) });
  };

  return (
    <div className="min-h-[100svh] flex flex-col items-center justify-center px-4 py-8">
      <header className="w-full max-w-2xl text-center mb-6">
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">Emoji Match</h1>
        <p className="mt-2 text-sm sm:text-base text-slate-400">
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
        onCardClick={onCardClick}
        onReset={onReset}
      />
    </div>
  );
}

export default App;
