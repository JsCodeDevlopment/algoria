'use client';

import { useEffect } from 'react';

import { usePlayerStore } from './use-player-store';

/**
 * Registers global keyboard shortcuts for the player. Mounted once
 * inside the page; renders nothing.
 *
 * - ←/→  : previous/next line
 * - Space: toggle autoplay
 * - 1/2/3: switch explanation level
 *
 * We ignore key events when the user is typing in an input/textarea
 * so we don't hijack form fields. Likewise when modifier keys are
 * pressed (Ctrl/Cmd combos belong to the OS or browser).
 */
export function KeyboardShortcuts() {
  const { prev, next, togglePlaying, setLevel } = usePlayerStore();

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null;
      if (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return;
      if (e.ctrlKey || e.metaKey || e.altKey) return;

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          prev();
          break;
        case 'ArrowRight':
          e.preventDefault();
          next();
          break;
        case ' ':
          e.preventDefault();
          togglePlaying();
          break;
        case '1':
          setLevel(1);
          break;
        case '2':
          setLevel(2);
          break;
        case '3':
          setLevel(3);
          break;
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [prev, next, togglePlaying, setLevel]);

  return null;
}
