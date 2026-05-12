import { ContentStatus } from "../types";

export const STATUS_BADGES: Record<
  ContentStatus,
  { label: string; className: string }
> = {
  DRAFT: {
    label: "Rascunho",
    className: "bg-slate-500/10 text-slate-600 dark:text-slate-400",
  },
  PENDING_REVIEW: {
    label: "Em Revisão",
    className: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  },
  CHANGES_REQUESTED: {
    label: "Alterações",
    className: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
  },
  APPROVED: {
    label: "Aprovado",
    className: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  },
  PUBLISHED: {
    label: "Publicado",
    className: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  },
  REJECTED: {
    label: "Rejeitado",
    className: "bg-destructive/10 text-destructive",
  },
};

export const EDITORIAL_TYPES = [
  { value: "", label: "Todos os tipos" },
  { value: "problem", label: "Problemas" },
  { value: "concept", label: "Conceitos" },
  { value: "interview-en", label: "Interview EN" },
  { value: "engineering-work", label: "Engenharia" },
  { value: "track", label: "Trilhas" },
  { value: "course", label: "Cursos" },
  { value: "technical-test", label: "Simulados" },
];

export const SYSTEM_TYPE_OPTIONS = [
  { value: "", label: "Todos os tipos" },
  { value: "changelog", label: "Changelog" },
  { value: "legal-page", label: "Páginas Legais" },
  { value: "landing-section", label: "Landing" },
  { value: "pricing-copy", label: "Pricing" },
  { value: "navigation", label: "Navegação" },
  { value: "taxonomy", label: "Taxonomia" },
];

export const STATUS_FILTERS = [
  { value: "", label: "Todos os status" },
  { value: "DRAFT", label: "Rascunho" },
  { value: "PENDING_REVIEW", label: "Em Revisão" },
  { value: "CHANGES_REQUESTED", label: "Alterações Solicitadas" },
  { value: "APPROVED", label: "Aprovado" },
  { value: "PUBLISHED", label: "Publicado" },
  { value: "REJECTED", label: "Rejeitado" },
];
