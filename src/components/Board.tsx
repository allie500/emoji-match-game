import type { CardId, GameCard } from "../game/types";
import EmojiCard from "./EmojiCard";
import WinOverlay from "./WinOverlay";

export interface BoardProps {
  cards: GameCard[];
  cols: number;
  flippedIds: CardId[];
  matchedPairKeys: Set<string>;
  lock: boolean;
  moves: number;
  matches: number;
  numPairs: number;
  winningEmoji: string | null;
  onCardClick: (cardId: CardId) => void;
  onReset: () => void;
}

export default function Board({
  cards,
  cols,
  flippedIds,
  matchedPairKeys,
  lock,
  moves,
  matches,
  numPairs,
  winningEmoji,
  onCardClick,
  onReset,
}: BoardProps) {
  const isComplete = matches >= numPairs;

  return (
    <div className="w-full max-w-2xl flex flex-col items-center gap-4">
      <div className="w-full flex items-center justify-between px-2">
        <div className="text-sm sm:text-base text-slate-500">
          Moves: <span className="text-slate-600 font-semibold">{moves}</span>
        </div>
        <div className="text-sm sm:text-base text-slate-500">
          Matches:{" "}
          <span className="text-slate-600 font-semibold">
            {matches}/{numPairs}
          </span>
        </div>
      </div>

      <div
        className="w-full grid gap-2 sm:gap-3"
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
      >
        {cards.map((card) => {
          const isMatched = matchedPairKeys.has(card.pairKey);
          const isFaceUp = isMatched || flippedIds.includes(card.id);
          const disabled = lock || isComplete || isMatched || isFaceUp;

          return (
            <EmojiCard
              key={card.id}
              cardId={card.id}
              emoji={card.emoji}
              faceUp={isFaceUp}
              matched={isMatched}
              disabled={disabled}
              onClick={onCardClick}
            />
          );
        })}
      </div>

      <div className="flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={onReset}
          className="px-4 py-2 rounded-lg bg-fuchsia-600 text-white hover:bg-fuchsia-700 disabled:opacity-50"
        >
          Reset
        </button>
      </div>
      {isComplete && winningEmoji ? (
        <WinOverlay emoji={winningEmoji} onPlayAgain={onReset} />
      ) : null}
    </div>
  );
}
