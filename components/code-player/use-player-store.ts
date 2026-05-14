'use client';

import { create } from 'zustand';
import type { ExecutionTraceStep } from '@/lib/content/schemas';

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

  /** Dynamic execution steps (if available). */
  traceSteps: ExecutionTraceStep[];
  /** Current index in traceSteps. */
  currentStepIndex: number;

  initialize: (annotatedLines: number[], initial?: number, traceSteps?: ExecutionTraceStep[], autoPlay?: boolean) => void;
  setCurrentLine: (line: number) => void;
  setCurrentStepIndex: (index: number) => void;
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
  traceSteps: [],
  currentStepIndex: -1,

  initialize: (annotatedLines, initial, traceSteps = [], autoPlay = false) =>
    set({
      annotatedLines,
      traceSteps,
      currentStepIndex: traceSteps.length > 0 ? 0 : -1,
      currentLine: traceSteps.length > 0 
        ? traceSteps[0].line 
        : (initial ?? annotatedLines[0] ?? 1),
      isPlaying: autoPlay,
    }),

  setCurrentLine: (line) => set({ currentLine: line }),

  setCurrentStepIndex: (index) => {
    const { traceSteps } = get();
    if (index >= 0 && index < traceSteps.length) {
      set({ 
        currentStepIndex: index,
        currentLine: traceSteps[index].line 
      });
    }
  },

  next: () => {
    const { annotatedLines, currentLine, traceSteps, currentStepIndex } = get();

    // Se temos um trace ativo, navegamos pelos passos do trace
    if (traceSteps.length > 0 && currentStepIndex !== -1) {
      if (currentStepIndex === traceSteps.length - 1) {
        set({ isPlaying: false });
        return;
      }
      const nextIdx = currentStepIndex + 1;
      set({ 
        currentStepIndex: nextIdx,
        currentLine: traceSteps[nextIdx].line
      });
      return;
    }

    // Caso contrário, navegamos pelas linhas anotadas estáticas
    const idx = annotatedLines.indexOf(currentLine);
    if (idx === -1) return;
    if (idx === annotatedLines.length - 1) {
      set({ isPlaying: false });
      return;
    }
    set({ currentLine: annotatedLines[idx + 1] });
  },

  prev: () => {
    const { annotatedLines, currentLine, traceSteps, currentStepIndex } = get();

    if (traceSteps.length > 0 && currentStepIndex !== -1) {
      if (currentStepIndex <= 0) return;
      const prevIdx = currentStepIndex - 1;
      set({ 
        currentStepIndex: prevIdx,
        currentLine: traceSteps[prevIdx].line
      });
      return;
    }

    const idx = annotatedLines.indexOf(currentLine);
    if (idx <= 0) return;
    set({ currentLine: annotatedLines[idx - 1] });
  },

  setLevel: (level) => set({ level }),
  setSpeed: (speedMs) => set({ speedMs }),
  setPlaying: (playing) => set({ isPlaying: playing }),
  togglePlaying: () => set((s) => ({ isPlaying: !s.isPlaying })),
}));
