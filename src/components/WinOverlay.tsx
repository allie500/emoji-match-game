import { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";

export const WIN_ZOOM_MS = 550;
export const CONFETTI_FADE_START_MS = 1800;
export const CONFETTI_FADE_MS = 1200;

interface WinOverlayProps {
  emoji: string;
  onPlayAgain: () => void;
}

export default function WinOverlay({ emoji, onPlayAgain }: WinOverlayProps) {
  const [showContent, setShowContent] = useState(false);
  const [fadeConfetti, setFadeConfetti] = useState(false);

  useEffect(() => {
    const revealContentTimer = window.setTimeout(() => {
      setShowContent(true);
    }, WIN_ZOOM_MS);
    const confettiFadeTimer = window.setTimeout(() => {
      setFadeConfetti(true);
    }, CONFETTI_FADE_START_MS);

    return () => {
      window.clearTimeout(revealContentTimer);
      window.clearTimeout(confettiFadeTimer);
    };
  }, []);

  const confettiPieces = useMemo(
    () =>
      Array.from({ length: 20 }, (_, idx) => ({
        id: idx,
        left: 4 + idx * 4.7,
        delay: (idx % 6) * 120,
        duration: 1800 + (idx % 5) * 220,
      })),
    [],
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 backdrop-blur-[1px]">
      <div
        data-testid="win-confetti"
        className={[
          "pointer-events-none absolute inset-0 overflow-hidden transition-opacity",
          fadeConfetti ? "opacity-0" : "opacity-100",
        ].join(" ")}
        style={{ transitionDuration: `${CONFETTI_FADE_MS}ms` }}
      >
        {confettiPieces.map((piece) => (
          <span
            key={piece.id}
            className="win-confetti-piece"
            style={
              {
                left: `${piece.left}%`,
                animationDelay: `${piece.delay}ms`,
                animationDuration: `${piece.duration}ms`,
              } as CSSProperties
            }
          />
        ))}
      </div>

      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="win-title"
        className="relative z-10 flex flex-col items-center gap-4 rounded-2xl border border-white/15 bg-slate-900/80 px-8 py-10 shadow-2xl"
      >
        {showContent ? (
          <h2 id="win-title" className="text-3xl sm:text-4xl font-bold tracking-wide text-white">
            YOU WON
          </h2>
        ) : (
          <div className="h-11" aria-hidden="true" />
        )}

        <div
          data-testid="winning-emoji"
          className="win-emoji-zoom text-7xl sm:text-8xl leading-none"
          style={{ animationDuration: `${WIN_ZOOM_MS}ms` }}
        >
          {emoji}
        </div>

        {showContent ? (
          <button
            type="button"
            onClick={onPlayAgain}
            className="mt-1 px-4 py-2 rounded-lg bg-fuchsia-600 text-white hover:bg-fuchsia-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-500/80 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
          >
            Play Again
          </button>
        ) : (
          <div className="h-10" aria-hidden="true" />
        )}
      </section>
    </div>
  );
}
