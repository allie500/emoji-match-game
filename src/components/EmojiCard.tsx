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
  return (
    <button
      type="button"
      onClick={() => onClick(cardId)}
      disabled={disabled}
      aria-label={faceUp ? `Card: ${emoji}` : "Card hidden"}
      className={[
        "relative w-full aspect-square rounded-xl border-2 transition-transform duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-500/70 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
        matched
          ? "border-emerald-400/80 bg-emerald-400/10 text-3xl"
          : faceUp
            ? "border-white/20 bg-white/90 text-3xl dark:bg-white/5"
            : "card-face-down border-slate-400/70 bg-slate-700/25 text-transparent shadow-inner shadow-slate-950/40",
        disabled ? "cursor-not-allowed opacity-80" : "hover:scale-[1.03] active:scale-[0.98]",
      ].join(" ")}
    >
      <span
        className={[
          "absolute inset-0 flex items-center justify-center select-none",
          faceUp ? "opacity-100" : "opacity-60",
          "text-4xl sm:text-5xl",
        ].join(" ")}
      >
        {faceUp ? emoji : "❓"}
      </span>
    </button>
  );
}
