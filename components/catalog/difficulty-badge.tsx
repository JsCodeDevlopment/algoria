import { Badge } from '@/components/ui/badge';
import type { Difficulty } from '@/lib/content/schemas';

const LABELS: Record<Difficulty, string> = {
  easy: 'EASY',
  medium: 'MEDIUM',
  hard: 'HARD',
};

export function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  return <Badge variant={difficulty} className="rounded-none font-mono">{LABELS[difficulty]}</Badge>;
}
