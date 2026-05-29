export const REQUIRED_SECONDS = 180; // 3 minutes
export const SESSION_KEY_PREFIX = 'algoria:daily-challenge-time:';

export interface ActiveChallenge {
  slug: string;
  dateKey: string;
}

/**
 * Lê o desafio diário activo do sessionStorage (definido pelo banner).
 */
export function getActiveDailyChallenge(): ActiveChallenge | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem('algoria:daily-challenge-active');
    if (!raw) return null;
    return JSON.parse(raw) as ActiveChallenge;
  } catch {
    return null;
  }
}

/**
 * Lê o tempo acumulado do sessionStorage para o slug actual.
 */
export function getAccumulatedTime(slug: string): number {
  if (typeof window === 'undefined') return 0;
  try {
    const raw = sessionStorage.getItem(`${SESSION_KEY_PREFIX}${slug}`);
    return raw ? parseInt(raw, 10) : 0;
  } catch {
    return 0;
  }
}

/**
 * Salva o tempo acumulado no sessionStorage.
 */
export function saveAccumulatedTime(slug: string, seconds: number): void {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(`${SESSION_KEY_PREFIX}${slug}`, String(seconds));
}

export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function formatDigitalTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const centiseconds = Math.floor((ms % 1000) / 10);

  const hh = hours.toString().padStart(2, '0');
  const mm = minutes.toString().padStart(2, '0');
  const ss = seconds.toString().padStart(2, '0');
  const cc = centiseconds.toString().padStart(2, '0');

  return `${hh}:${mm}:${ss}:${cc}`;
}
