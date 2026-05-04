'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import {
  LANGUAGE_LABEL_PT,
  LANGUAGE_ORDER_FOR_UI,
  isLineSyncLanguage,
} from '@/lib/content/language';
import type { Language } from '@/lib/content/schemas';

interface Props {
  available: Language[];
  value: Language;
}

/** Select de linguagem ligado a `?lang=` (persiste ao partilhar o URL). */
export function SolutionLanguageSelect({ available, value }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const sorted = LANGUAGE_ORDER_FOR_UI.filter((l) => available.includes(l));

  function onChange(nextLang: Language) {
    const next = new URLSearchParams(searchParams.toString());
    next.set('lang', nextLang);
    const q = next.toString();
    router.push(q ? `${pathname}?${q}` : pathname, { scroll: false });
  }

  return (
    <div className="inline-flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-2">
      <label htmlFor="solution-lang" className="text-xs text-zinc-500 shrink-0">
        Ver código em
      </label>
      <div className="flex items-center gap-2 flex-wrap">
        <select
          id="solution-lang"
          value={value}
          onChange={(e) => onChange(e.target.value as Language)}
          className="text-sm rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-2.5 py-1 font-mono tabular-nums"
        >
          {sorted.map((lang) => (
            <option key={lang} value={lang}>
              {LANGUAGE_LABEL_PT[lang]}
            </option>
          ))}
        </select>
        {!isLineSyncLanguage(value) ? (
          <span className="text-[11px] font-medium text-amber-700 dark:text-amber-400/90">modo leitura</span>
        ) : null}
      </div>
    </div>
  );
}
