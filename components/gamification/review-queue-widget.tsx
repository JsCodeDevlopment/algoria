"use client";

import { motion } from "framer-motion";
import { BookOpen, Clock, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { loadProgressBlob } from "@/lib/progress/local-progress";
import { getProblemSlugsDueForReview } from "@/lib/progress/review";

const REVIEW_INTERVALS = [
  { days: 1, label: "1d", color: "text-red-500 border-red-500/30 bg-red-500/10" },
  { days: 3, label: "3d", color: "text-orange-500 border-orange-500/30 bg-orange-500/10" },
  { days: 7, label: "7d", color: "text-yellow-500 border-yellow-500/30 bg-yellow-500/10" },
  { days: 14, label: "14d", color: "text-blue-500 border-blue-500/30 bg-blue-500/10" },
  { days: 30, label: "30d", color: "text-purple-500 border-purple-500/30 bg-purple-500/10" },
] as const;

interface ReviewItem {
  slug: string;
  daysAgo: number;
  intervalLabel: string;
  intervalColor: string;
}

interface ReviewQueueWidgetProps {
  problemTitles: Record<string, string>;
}

export function ReviewQueueWidget({ problemTitles }: ReviewQueueWidgetProps) {
  const [items, setItems] = useState<ReviewItem[]>([]);

  useEffect(() => {
    function sync() {
      const blob = loadProgressBlob();
      const now = Date.now();
      const reviewItems: ReviewItem[] = [];

      for (const interval of REVIEW_INTERVALS) {
        const slugs = getProblemSlugsDueForReview(blob, interval.days, now);
        for (const slug of slugs) {
          if (reviewItems.some((r) => r.slug === slug)) continue;

          const completedAt = blob.problems[slug]?.markedCompleteAt;
          const daysAgo = completedAt
            ? Math.round((now - Date.parse(completedAt)) / 86_400_000)
            : interval.days;

          reviewItems.push({
            slug,
            daysAgo,
            intervalLabel: interval.label,
            intervalColor: interval.color,
          });
        }
      }

      setItems(reviewItems.slice(0, 5));
    }

    sync();
    window.addEventListener("algoria-progress", sync);
    return () => window.removeEventListener("algoria-progress", sync);
  }, []);

  if (items.length === 0) {
    return null;
  }

  return (
    <section className="mb-12">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-6 w-2 bg-orange-500" />
        <h2 className="text-xl font-black uppercase tracking-widest">
          Fila de Revisão
        </h2>
        <Badge
          variant="outline"
          className="rounded-none border-orange-500/30 bg-orange-500/10 px-1.5 py-0 text-[9px] font-black uppercase text-orange-500"
        >
          <RefreshCw className="mr-0.5 h-3 w-3" />
          Repetição Espaçada
        </Badge>
      </div>

      <p className="mb-4 text-sm text-muted-foreground max-w-2xl">
        Problemas que já estudaste e que estão no momento ideal para revisão.
        Rever consolida o conhecimento e protege a tua streak.
      </p>

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item, idx) => (
          <motion.div
            key={item.slug}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.08, duration: 0.3 }}
          >
            <Link
              href={`/problems/${item.slug}`}
              className="group flex items-center gap-4 border-2 border-border bg-background p-4 transition-all hover:border-orange-500/40 hover:bg-orange-500/[0.03]"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-border bg-muted/30 transition-colors group-hover:border-orange-500/30 group-hover:bg-orange-500/10">
                <BookOpen className="h-4 w-4 text-muted-foreground group-hover:text-orange-500 transition-colors" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold uppercase tracking-tight truncate group-hover:text-primary transition-colors">
                  {problemTitles[item.slug] ?? item.slug}
                </p>
                <div className="mt-1 flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className={`rounded-none px-1 py-0 text-[8px] font-black uppercase ${item.intervalColor}`}
                  >
                    {item.intervalLabel}
                  </Badge>
                  <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    Há {item.daysAgo} dia{item.daysAgo !== 1 ? "s" : ""}
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {items.length >= 5 && (
        <div className="mt-4 text-center">
          <Button
            asChild
            variant="outline"
            className="rounded-none text-[10px] font-black uppercase tracking-widest"
          >
            <Link href="/problems">Ver todos os problemas</Link>
          </Button>
        </div>
      )}
    </section>
  );
}
