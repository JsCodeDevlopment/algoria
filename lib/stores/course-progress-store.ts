'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { StoredModuleSlice } from '@/lib/courses/unlock';
import { defaultModuleSlice } from '@/lib/courses/unlock';

interface CourseProgressState {
  learnerName: string;
  packages: Record<string, Record<string, StoredModuleSlice>>;
  setLearnerName: (name: string) => void;
  getModuleSlice: (courseSlug: string, moduleId: string) => StoredModuleSlice;
  setLessonRead: (courseSlug: string, moduleId: string, read: boolean) => void;
  setExercisePassed: (courseSlug: string, moduleId: string, exerciseId: string, ok: boolean) => void;
  passCapstone: (courseSlug: string, moduleId: string) => void;
}

const KEY = 'algoria-course-progress-v1';

export const useCourseProgressStore = create<CourseProgressState>()(
  persist(
    (set, get) => ({
      learnerName: '',
      packages: {},

      setLearnerName: (name: string) => set({ learnerName: name.trim() }),

      getModuleSlice: (courseSlug, moduleId) => {
        const p = get().packages[courseSlug]?.[moduleId];
        return p ? { ...defaultModuleSlice(), ...p, solvedExerciseIds: { ...p.solvedExerciseIds } } : defaultModuleSlice();
      },

      setLessonRead: (courseSlug, moduleId, read) =>
        set((st) => {
          const pk = st.packages[courseSlug] ?? {};
          const cur = pk[moduleId] ?? defaultModuleSlice();
          const nextSlice: StoredModuleSlice = {
            ...cur,
            lessonReadAt: read ? Date.now() : null,
          };
          return { packages: { ...st.packages, [courseSlug]: { ...pk, [moduleId]: nextSlice } } };
        }),

      setExercisePassed: (courseSlug, moduleId, exerciseId, ok) =>
        set((st) => {
          const pk = st.packages[courseSlug] ?? {};
          const cur = pk[moduleId] ?? defaultModuleSlice();
          const solved = { ...cur.solvedExerciseIds, [exerciseId]: ok };
          const nextSlice: StoredModuleSlice = { ...cur, solvedExerciseIds: solved };
          return { packages: { ...st.packages, [courseSlug]: { ...pk, [moduleId]: nextSlice } } };
        }),

      passCapstone: (courseSlug, moduleId) =>
        set((st) => {
          const pk = st.packages[courseSlug] ?? {};
          const cur = pk[moduleId] ?? defaultModuleSlice();
          const nextSlice: StoredModuleSlice = {
            ...cur,
            capstonePassedAt: Date.now(),
          };
          return { packages: { ...st.packages, [courseSlug]: { ...pk, [moduleId]: nextSlice } } };
        }),
    }),
    {
      name: KEY,
      partialize: (s) => ({ learnerName: s.learnerName, packages: s.packages }),
    },
  ),
);
