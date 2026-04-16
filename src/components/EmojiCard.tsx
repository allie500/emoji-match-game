import type { CardId } from "../game/types";

export interface EmojiCardProps {
  cardId: CardId;
  emoji: string;
  faceUp: boolean;
  matched: boolean;
  disabled: boolean;
  onClick: (cardId: CardId) => void;
}

export default function EmojiCard({
  cardId,
  emoji,
  faceUp,
  matched,
  disabled,
  onClick,
}: EmojiCardProps) {
  const cardStateClass = matched ? "is-matched" : faceUp ? "is-face-up" : "is-face-down";

  return (
    <button
      type="button"
      onClick={() => onClick(cardId)}
      disabled={disabled}
      aria-label={faceUp ? `Card: ${emoji}` : "Card hidden"}
      className={[
        "emoji-card relative w-full aspect-square rounded-xl transition-transform duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-500/70 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
        cardStateClass,
        disabled ? "cursor-not-allowed opacity-80" : "hover:scale-[1.03] active:scale-[0.98]",
      ].join(" ")}
    >
      <span className="card-flip-inner">
        <span className="card-face card-back text-4xl sm:text-5xl">❓</span>
        <span className="card-face card-front text-4xl sm:text-5xl">{emoji}</span>
      </span>
    </button>
  );
}
