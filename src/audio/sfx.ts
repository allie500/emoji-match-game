import cardFlipUpUrl from "../assets/audio/card-flip-up.mp3";
import mismatchFlipDownUrl from "../assets/audio/mismatch-flip-down.mp3";
import resetBoardUrl from "../assets/audio/reset-board.mp3";
import successfulMatchUrl from "../assets/audio/successful-match.mp3";
import youWonUrl from "../assets/audio/you-won.mp3";

export type SoundEffect =
  | "cardFlipUp"
  | "mismatchFlipDown"
  | "resetBoard"
  | "successfulMatch"
  | "youWon";

const soundUrls: Record<SoundEffect, string> = {
  cardFlipUp: cardFlipUpUrl,
  mismatchFlipDown: mismatchFlipDownUrl,
  resetBoard: resetBoardUrl,
  successfulMatch: successfulMatchUrl,
  youWon: youWonUrl,
};

const audioByEffect = new Map<SoundEffect, HTMLAudioElement>();

function getAudio(effect: SoundEffect): HTMLAudioElement | null {
  if (typeof Audio === "undefined") return null;

  const existing = audioByEffect.get(effect);
  if (existing) return existing;

  const created = new Audio(soundUrls[effect]);
  created.preload = "auto";
  audioByEffect.set(effect, created);
  return created;
}

export function playSfx(effect: SoundEffect): void {
  const audio = getAudio(effect);
  if (!audio) return;

  audio.currentTime = 0;
  const playback = audio.play();
  if (playback && typeof playback.catch === "function") {
    void playback.catch(() => {
      // Swallow browser autoplay/load errors to avoid impacting gameplay.
    });
  }
}
