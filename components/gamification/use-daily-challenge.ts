import { useCallback, useEffect, useRef, useState } from 'react';

import { completeDailyChallenge, isDailyChallengeCompleted } from '@/lib/gamification/xp-engine';
import { loadProgressBlob, saveProgressBlob } from '@/lib/progress/local-progress';
import {
  getAccumulatedTime,
  getActiveDailyChallenge,
  REQUIRED_SECONDS,
  saveAccumulatedTime,
  SESSION_KEY_PREFIX,
} from './daily-challenge-utils';

export interface UseDailyChallengeProps {
  problemSlug: string;
  isAccessible: boolean;
  solutionSlugs: string[];
}

export function useDailyChallenge({
  problemSlug,
  isAccessible,
  solutionSlugs,
}: UseDailyChallengeProps) {
  const [isActive, setIsActive] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [isTabVisible, setIsTabVisible] = useState(true);
  const [visitedTabs, setVisitedTabs] = useState<Set<string>>(() => new Set());

  const elapsedMsRef = useRef(0);
  const completedRef = useRef(false);

  useEffect(() => {
    elapsedMsRef.current = elapsedMs;
  }, [elapsedMs]);

  useEffect(() => {
    const active = getActiveDailyChallenge();
    if (!active || active.slug !== problemSlug) {
      setIsActive(false);
      return;
    }

    const blob = loadProgressBlob();
    if (isDailyChallengeCompleted(blob)) {
      setCompleted(true);
      completedRef.current = true;
      setIsActive(true);
      return;
    }

    setIsActive(true);
    const secs = getAccumulatedTime(problemSlug);
    setElapsedMs(secs * 1000);
    elapsedMsRef.current = secs * 1000;
  }, [problemSlug]);

  useEffect(() => {
    if (!isActive || completed) return;

    const handleVisibilityChange = () => {
      setIsTabVisible(!document.hidden);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isActive, completed]);

  useEffect(() => {
    if (!isActive || completed || !isTabVisible || !isAccessible) return;

    const startTime = Date.now() - elapsedMsRef.current;

    const timer = setInterval(() => {
      const now = Date.now();
      const currentElapsed = now - startTime;
      
      setElapsedMs(currentElapsed);

      const currentSeconds = Math.floor(currentElapsed / 1000);
      saveAccumulatedTime(problemSlug, currentSeconds);
    }, 50);

    return () => {
      clearInterval(timer);
    };
  }, [isActive, completed, isTabVisible, isAccessible, problemSlug]);

  const visitedAllSolutions = solutionSlugs.every(slug => visitedTabs.has(`solution:${slug}`));
  const allTabsVisited = visitedTabs.has('statement') && visitedAllSolutions;
  const elapsedSeconds = Math.floor(elapsedMs / 1000);
  const timeReached = elapsedSeconds >= REQUIRED_SECONDS;
  const canComplete = isAccessible && allTabsVisited && timeReached;

  useEffect(() => {
    if (!canComplete || completedRef.current) return;
    completedRef.current = true;

    let blob = loadProgressBlob();
    blob = completeDailyChallenge(blob);
    saveProgressBlob(blob);
    setCompleted(true);

    sessionStorage.removeItem(`${SESSION_KEY_PREFIX}${problemSlug}`);
  }, [canComplete, problemSlug]);

  const registerTabVisit = useCallback((tab: string) => {
    setVisitedTabs((prev) => {
      const next = new Set(prev);
      next.add(tab);
      return next;
    });
  }, []);

  useEffect(() => {
    if (!isActive) return;

    const handler = (e: Event) => {
      const detail = (e as CustomEvent<string>).detail;
      if (detail) registerTabVisit(detail);
    };

    window.addEventListener('algoria-daily-tab-visit', handler);
    return () => window.removeEventListener('algoria-daily-tab-visit', handler);
  }, [isActive, registerTabVisit]);

  const remainingSeconds = Math.max(0, REQUIRED_SECONDS - elapsedSeconds);
  const progressPercent = Math.min(100, (elapsedMs / (REQUIRED_SECONDS * 1000)) * 100);
  const visitedSolutionCount = solutionSlugs.filter(slug => visitedTabs.has(`solution:${slug}`)).length;
  const totalSolutions = solutionSlugs.length;

  return {
    isActive,
    completed,
    elapsedMs,
    isTabVisible,
    visitedTabs,
    visitedAllSolutions,
    timeReached,
    remainingSeconds,
    progressPercent,
    visitedSolutionCount,
    totalSolutions,
  };
}
