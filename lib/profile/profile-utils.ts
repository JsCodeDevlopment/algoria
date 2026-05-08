import type { Experience } from "@/components/profile/profile-sections";
import { ProgressBlobSchema } from "@/lib/progress/local-progress-schema";

export function calculateTotalExperienceMonths(experiences: Experience[]) {
  let totalMonths = 0;
  for (const exp of experiences) {
    let minDate: Date | null = null;
    let maxDate: Date | null = null;
    let hasCurrent = false;

    for (const role of exp.roles) {
      if (role.startDate) {
        const d = new Date(role.startDate);
        if (!minDate || d < minDate) minDate = d;
      }
      if (role.current) {
        hasCurrent = true;
      } else if (role.endDate) {
        const d = new Date(role.endDate);
        if (!maxDate || d > maxDate) maxDate = d;
      }
    }

    if (minDate) {
      const finalMaxDate = hasCurrent ? new Date() : maxDate || new Date();
      let m = (finalMaxDate.getFullYear() - minDate.getFullYear()) * 12;
      m += finalMaxDate.getMonth() - minDate.getMonth();
      m += 1; // Contagem inclusiva
      if (m > 0) totalMonths += m;
    }
  }
  return totalMonths;
}

export function formatExperienceString(totalMonths: number) {
  const totalYears = Math.floor(totalMonths / 12);
  if (totalYears > 0) {
    return `+${totalYears} ${totalYears === 1 ? "ano" : "anos"} de exp.`;
  }
  return `${totalMonths} ${totalMonths === 1 ? "mês" : "meses"} de exp.`;
}

export function processUserProgress(progressData: string | null) {
  let completedProblems = 0;
  let solutionsOpened = 0;

  if (progressData) {
    try {
      const data = JSON.parse(progressData);
      const blob = ProgressBlobSchema.parse(data);
      const problems = Object.values(blob.problems);

      completedProblems = problems.filter((p) => !!p.markedCompleteAt).length;
      solutionsOpened = problems.reduce(
        (acc, p) => acc + (p.openedSolutions?.length || 0),
        0,
      );
    } catch {
      // ignore
    }
  }

  return { completedProblems, solutionsOpened };
}
