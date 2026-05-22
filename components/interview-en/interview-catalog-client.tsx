'use client';

import { useMemo, useState, useDeferredValue } from 'react';
import Link from 'next/link';
import { Clock } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DifficultyBadge } from '@/components/catalog/difficulty-badge';
import { Input } from '@/components/ui/input';
import type { Difficulty, InterviewEnglishTrack } from '@/lib/content/schemas';

export interface InterviewCatalogItem {
  slug: string;
  title: string;
  summary: string;
  track: InterviewEnglishTrack;
  estimatedMinutes: number;
  difficulty: Difficulty;
}

type SortMode = 'title_az' | 'difficulty_asc';

const SORT_LABEL: Record<SortMode, string> = {
  title_az: 'Title (A–Z)',
  difficulty_asc: 'Difficulty (easy → hard)',
};

const TRACK_BADGE: Record<InterviewEnglishTrack, string> = {
  vocabulary: 'Vocabulary',
  communication: 'Live coding talk track',
  behavioral: 'Behavioral',
  'system-design': 'System design',
};

interface Props {
  topics: InterviewCatalogItem[];
}

export function InterviewCatalogClient({ topics }: Props) {
  const [q, setQ] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<Difficulty | 'all'>('all');
  const [trackFilter, setTrackFilter] = useState<InterviewEnglishTrack | 'all'>('all');
  const [sortMode, setSortMode] = useState<SortMode>('title_az');

  const deferredQ = useDeferredValue(q);
  const deferredDifficultyFilter = useDeferredValue(difficultyFilter);
  const deferredTrackFilter = useDeferredValue(trackFilter);

  const filteredSorted = useMemo(() => {
    const query = deferredQ.trim().toLowerCase();
    const difficultyRank: Record<Difficulty, number> = { easy: 0, medium: 1, hard: 2 };

    let list = topics.filter((t) => {
      if (deferredDifficultyFilter !== 'all' && t.difficulty !== deferredDifficultyFilter) return false;
      if (deferredTrackFilter !== 'all' && t.track !== deferredTrackFilter) return false;
      if (!query) return true;
      return (
        t.title.toLowerCase().includes(query) ||
        t.summary.toLowerCase().includes(query) ||
        TRACK_BADGE[t.track].toLowerCase().includes(query)
      );
    });

    list = [...list];
    switch (sortMode) {
      case 'difficulty_asc':
        list.sort(
          (a, b) =>
            difficultyRank[a.difficulty] - difficultyRank[b.difficulty] || a.title.localeCompare(b.title),
        );
        break;
      case 'title_az':
      default:
        list.sort((a, b) => a.title.localeCompare(b.title));
        break;
    }
    return list;
  }, [topics, deferredQ, deferredDifficultyFilter, deferredTrackFilter, sortMode]);

  return (
    <>
      <div className="mb-10 flex flex-col gap-4 rounded-none border border-border bg-card/40 p-4 backdrop-blur-sm lg:flex-row lg:flex-wrap lg:items-end">
        <div className="min-w-[12rem] flex-1">
          <label htmlFor="interview-search" className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            Search
          </label>
          <Input
            id="interview-search"
            placeholder="Search topics, tracks..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            autoComplete="off"
            className="rounded-none"
          />
        </div>
        <div className="w-full min-w-[10rem] sm:w-auto">
          <label htmlFor="interview-difficulty" className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            Difficulty
          </label>
          <select
            id="interview-difficulty"
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value as Difficulty | 'all')}
            className="flex h-9 w-full min-w-[10rem] rounded-none border border-input bg-background px-3 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
          >
            {(['all', 'easy', 'medium', 'hard'] as const).map((d) => (
              <option key={d} value={d}>
                {d === 'all' ? 'All difficulties' : d.charAt(0).toUpperCase() + d.slice(1)}
              </option>
            ))}
          </select>
        </div>
        <div className="w-full min-w-[10rem] sm:w-auto">
          <label htmlFor="interview-track" className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            Track
          </label>
          <select
            id="interview-track"
            value={trackFilter}
            onChange={(e) => setTrackFilter(e.target.value as InterviewEnglishTrack | 'all')}
            className="flex h-9 w-full min-w-[10rem] rounded-none border border-input bg-background px-3 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="all">All Tracks</option>
            {(Object.keys(TRACK_BADGE) as InterviewEnglishTrack[]).map((t) => (
              <option key={t} value={t}>
                {TRACK_BADGE[t]}
              </option>
            ))}
          </select>
        </div>
        <div className="w-full min-w-[12rem] sm:w-auto lg:ml-auto">
          <label htmlFor="interview-sort" className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            Sort
          </label>
          <select
            id="interview-sort"
            value={sortMode}
            onChange={(e) => setSortMode(e.target.value as SortMode)}
            className="flex h-9 w-full min-w-[12rem] rounded-none border border-input bg-background px-3 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
          >
            {(Object.keys(SORT_LABEL) as SortMode[]).map((m) => (
              <option key={m} value={m}>
                {SORT_LABEL[m]}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filteredSorted.length === 0 ? (
        <p className="border border-dashed border-border px-6 py-12 text-center text-sm text-muted-foreground">
          No topics match your filters. Try clearing the search or changing the filters.
        </p>
      ) : (
        <div className="grid gap-0 border border-border sm:grid-cols-2">
          {filteredSorted.map((t) => (
            <Link key={t.slug} href={`/interview-en/${t.slug}`} className="group relative border border-border p-px hover:z-10">
              <Card className="h-full rounded-none border-none bg-background transition-all duration-200 group-hover:bg-muted/50">
                <CardHeader className="px-6 pt-6">
                  <div className="mb-6 flex flex-wrap items-center gap-2">
                    <DifficultyBadge difficulty={t.difficulty} />
                    <Badge variant="secondary" className="rounded-none bg-primary/10 px-1.5 py-0 font-mono text-[9px] uppercase text-primary">
                      {TRACK_BADGE[t.track]}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl font-black uppercase tracking-tight transition-colors group-hover:text-primary">
                    {t.title}
                  </CardTitle>
                  <CardDescription className="mt-2 flex items-center gap-2 font-mono text-[10px] uppercase">
                    <Clock className="h-3 w-3" aria-hidden /> {t.estimatedMinutes}m study block
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-6 pb-6">
                  <p className="text-sm leading-relaxed text-muted-foreground">{t.summary}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
