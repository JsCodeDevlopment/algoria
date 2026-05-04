'use client';

import { create } from 'zustand';

export type ExplanationLevel = 1 | 2 | 3;

interface PlayerState {
  /** All line numbers that have annotations (subset of all lines). */
  annotatedLines: number[];
  /** Currently focused line. Always one of `annotatedLines`. */
  currentLine: number;
  /** Detail level the user wants to see. */
  level: ExplanationLevel;
  /** Whether autoplay is running. */
  isPlaying: boolean;
  /** Milliseconds between autoplay steps. */
  speedMs: number;

  initialize: (annotatedLines: number[], initial?: number) => void;
  setCurrentLine: (line: number) => void;
  next: () => void;
  prev: () => void;
  setLevel: (level: ExplanationLevel) => void;
  setSpeed: (speedMs: number) => void;
  setPlaying: (playing: boolean) => void;
  togglePlaying: () => void;
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  annotatedLines: [],
  currentLine: 1,
  level: 1,
  isPlaying: false,
  speedMs: 2500,

  initialize: (annotatedLines, initial) =>
    set({
      annotatedLines,
      currentLine: initial ?? annotatedLines[0] ?? 1,
      isPlaying: false,
    }),

  setCurrentLine: (line) => set({ currentLine: line }),

  next: () => {
    const { annotatedLines, currentLine } = get();
    const idx = annotatedLines.indexOf(currentLine);
    if (idx === -1) return;
    if (idx === annotatedLines.length - 1) {
      // Reached the end — stop autoplay.
      set({ isPlaying: false });
      return;
    }
    set({ currentLine: annotatedLines[idx + 1] });
  },

  prev: () => {
    const { annotatedLines, currentLine } = get();
    const idx = annotatedLines.indexOf(currentLine);
    if (idx <= 0) return;
    set({ currentLine: annotatedLines[idx - 1] });
  },

  setLevel: (level) => set({ level }),
  setSpeed: (speedMs) => set({ speedMs }),
  setPlaying: (playing) => set({ isPlaying: playing }),
  togglePlaying: () => set((s) => ({ isPlaying: !s.isPlaying })),
}));
