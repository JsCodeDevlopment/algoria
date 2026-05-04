import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Props {
  /** "O(n)", "O(n²)" etc. */
  label: string;
  kind: 'time' | 'space';
  className?: string;
}

/**
 * Visual hint of how good a complexity is. We compare the order of
 * growth in the label using a tiny lookup table — anything not in it
 * defaults to "neutral".
 */
const SCORE: Record<string, 'good' | 'ok' | 'bad'> = {
  'O(1)': 'good',
  'O(log n)': 'good',
  'O(n)': 'ok',
  'O(n log n)': 'ok',
  'O(n^2)': 'bad',
  'O(n²)': 'bad',
  'O(2^n)': 'bad',
  'O(n!)': 'bad',
};

const SCORE_CLASS: Record<'good' | 'ok' | 'bad' | 'neutral', string> = {
  good: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  ok: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  bad: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
  neutral: 'bg-zinc-500/10 text-zinc-600 dark:text-zinc-400',
};

export function ComplexityBadge({ label, kind, className }: Props) {
  const normalized = label.replace(/\s+/g, '');
  const score = SCORE[normalized] ?? 'neutral';
  return (
    <Badge variant="outline" className={cn('font-mono', SCORE_CLASS[score], className)}>
      <span className="text-[10px] uppercase tracking-wide opacity-70">
        {kind === 'time' ? 'tempo' : 'espaço'}
      </span>
      <span>{label}</span>
    </Badge>
  );
}
