
export interface FormProps {
  slug: string;
  setSlug: (v: string) => void;
  title: string;
  setTitle: (v: string) => void;
  body: string;
  setBody: (v: string) => void;
  meta: Record<string, unknown>;
  setMeta: (v: Record<string, unknown>) => void;
  mode: "create" | "edit";
}

export interface ContentEditorProps {
  mode: "create" | "edit";
  initialData?: {
    id?: string;
    slug?: string;
    type?: string;
    title?: string;
    body?: string;
    metadata?: Record<string, unknown>;
  };
}

export interface EditorSolution {
  meta: {
    slug: string;
    name: string;
    kind: string;
    language: string;
    complexity: {
      time: string;
      space: string;
      rationale: string;
    };
    entryFunction?: string;
  };
  codeByLanguage: Record<string, string>;
  introMd: string;
}

export type ContentStatus =
  | "DRAFT"
  | "PENDING_REVIEW"
  | "CHANGES_REQUESTED"
  | "APPROVED"
  | "PUBLISHED"
  | "REJECTED";

export interface ContentRow {
  id: string;
  slug: string;
  type: string;
  access: "free" | "pro";
  title: string;
  status: ContentStatus;
  version: number;
  authorId: string | null;
  authorName: string | null;
  authorImage: string | null;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export const DIFFICULTIES = [
  { value: "easy", label: "Fácil" },
  { value: "medium", label: "Médio" },
  { value: "hard", label: "Difícil" },
];

export const ACCESS_OPTIONS = [
  { value: "free", label: "Gratuito" },
  { value: "pro", label: "Pro (Assinantes)" },
];

export const INTERVIEW_TRACKS = [
  { value: "vocabulary", label: "Vocabulary" },
  { value: "communication", label: "Communication" },
  { value: "behavioral", label: "Behavioral" },
  { value: "system-design", label: "System Design" },
];

export const ENGINEERING_PILLARS = [
  { value: "frontend", label: "Frontend" },
  { value: "backend", label: "Backend" },
  { value: "devops", label: "DevOps" },
];

export const CATEGORIES = [
  { value: "arrays", label: "Arrays" },
  { value: "hash-tables", label: "Hash Tables" },
  { value: "two-pointers", label: "Two Pointers" },
  { value: "sliding-window", label: "Sliding Window" },
  { value: "binary-search", label: "Binary Search" },
  { value: "linked-list", label: "Linked List" },
  { value: "trees", label: "Trees" },
  { value: "graphs", label: "Graphs" },
  { value: "dynamic-programming", label: "Dynamic Programming" },
  { value: "greedy", label: "Greedy" },
  { value: "backtracking", label: "Backtracking" },
  { value: "bit-manipulation", label: "Bit Manipulation" },
  { value: "math", label: "Math" },
  { value: "strings", label: "Strings" },
  { value: "stacks", label: "Stacks" },
  { value: "queues", label: "Queues" },
  { value: "recursion", label: "Recursion" },
  { value: "sorting", label: "Sorting" },
];

export const DEFAULT_META: Record<string, Record<string, unknown>> = {
  "interview-en": {
    track: "vocabulary",
    difficulty: "easy",
    estimatedMinutes: 12,
    summary: "",
    access: "pro",
  },
  "engineering-work": { pillar: "frontend", estimatedMinutes: 15, summary: "", access: "pro" },
  problem: {
    difficulty: "easy",
    categories: [],
    estimatedMinutes: 15,
    access: "pro",
    recommendedOrder: 1,
    constraints: [],
  },
  concept: {
    category: "fundamentals",
    difficulty: "medium",
    estimatedMinutes: 10,
    access: "pro",
    summary: "",
    prerequisites: [],
  },
  course: { subtitle: "", moduleCount: 0, moduleIds: [] },
  changelog: {},
  "technical-test": { access: "pro" },
  "pricing-copy": {
    freePerks: [],
    proPerks: [],
    monthlyPrice: "",
    yearlyNote: "",
  },
};
