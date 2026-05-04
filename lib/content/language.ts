import type { Language } from './schemas';
import { LANGUAGES } from './schemas';

/** Language codes to Shiki lexer ids (`codeToHtml` `lang`). */
export const SHIKI_LANG: Record<Language, string> = {
  javascript: 'javascript',
  typescript: 'typescript',
  python: 'python',
  java: 'java',
  rust: 'rust',
  go: 'go',
  csharp: 'csharp',
};

/** UI labels for the language selector (PT). */
export const LANGUAGE_LABEL_PT: Record<Language, string> = {
  javascript: 'JavaScript',
  typescript: 'TypeScript',
  java: 'Java',
  rust: 'Rust',
  go: 'Go',
  python: 'Python',
  csharp: 'C#',
};

export const LANGUAGE_ORDER_FOR_UI = [...LANGUAGES];

/**
 * Annotações (`annotations.json`) estão escritas contra a versão em
 * TypeScript deste exercício; estas linguagens foram curadas para o mesmo
 * arranjo de linhas / chaves para o passeio linha‑a‑linha fazer sentido.
 */
export const LINE_SYNC_LANGUAGES_FOR_ANNOTATIONS = new Set<Language>([
  'typescript',
  'javascript',
  'go',
  'rust',
]);

export function normalizeLanguage(raw: unknown): Language | undefined {
  if (typeof raw !== 'string') return undefined;
  const lowered = raw.toLowerCase().trim();
  const aliases: Record<string, Language> = {
    ts: 'typescript',
    js: 'javascript',
    py: 'python',
    csharp: 'csharp',
    cs: 'csharp',
    golang: 'go',
    'c#': 'csharp',
  };
  if (aliases[lowered]) return aliases[lowered];
  if ((LANGUAGES as readonly string[]).includes(lowered)) return lowered as Language;
  return undefined;
}

export function isLineSyncLanguage(lang: Language): boolean {
  return LINE_SYNC_LANGUAGES_FOR_ANNOTATIONS.has(lang);
}

/** Texto exibido quando a sintaxe escolhida não partilha a mesma numeração com as anotações (TypeScript-canónico). */
export const LANGUAGE_READ_ONLY_PANEL_MD =
  'O **passeio linha‑a‑linha** está alinhado com as versões em **TypeScript**, **JavaScript**, **Go** e **Rust** (a mesma «forma» de chaves).\n\n' +
  'Nesta sintaxe verás apenas o código completo; escolhe **TypeScript**, **JavaScript**, **Go** ou **Rust** no menu ao lado para a explicação por passos sincronizada com o código.';
