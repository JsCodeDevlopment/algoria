'use client';

import { useRef, useState, useTransition } from 'react';
import { importContent } from '@/lib/actions/admin';

interface ImportPayload {
  title: string;
  slug: string;
  type: string;
  body: string;
  publish?: boolean;
  meta: Record<string, unknown>;
}

interface ImportContentDialogProps {
  onSuccess?: () => void;
}

type ImportStep = 'idle' | 'loaded' | 'success' | 'error';

const ALLOWED_TYPES: Record<string, string> = {
  'engineering-work': 'Engenharia no Trabalho',
  'interview-en': 'Inglês Técnico',
  'concept': 'Conceito / Guia',
  'problem': 'Problema / Desafio',
  'technical-test': 'Simulado Técnico',
};

export function ImportContentDialog({ onSuccess }: ImportContentDialogProps) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<ImportStep>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [payload, setPayload] = useState<ImportPayload | null>(null);
  const [rawJson, setRawJson] = useState('');
  const [jsonParseError, setJsonParseError] = useState('');
  const [publishOnImport, setPublishOnImport] = useState(false);
  const [isPending, startTransition] = useTransition();

  const fileInputRef = useRef<HTMLInputElement>(null);

  function openDialog() {
    setOpen(true);
    setStep('idle');
    setPayload(null);
    setRawJson('');
    setJsonParseError('');
    setErrorMsg('');
    setSuccessMsg('');
    setPublishOnImport(false);
  }

  function closeDialog() {
    setOpen(false);
  }

  function parseAndSetPayload(text: string) {
    setRawJson(text);
    setJsonParseError('');
    setPayload(null);
    setStep('idle');

    if (!text.trim()) return;

    try {
      const parsed = JSON.parse(text) as ImportPayload;

      // Validate required fields
      const required = ['title', 'slug', 'type', 'body'];
      for (const field of required) {
        if (!parsed[field as keyof ImportPayload]) {
          setJsonParseError(`Campo obrigatório ausente: "${field}"`);
          return;
        }
      }

      if (!ALLOWED_TYPES[parsed.type]) {
        setJsonParseError(`Tipo inválido: "${parsed.type}". Tipos aceitos: ${Object.keys(ALLOWED_TYPES).join(', ')}`);
        return;
      }

      if (!/^[a-z0-9-_]+$/.test(parsed.slug)) {
        setJsonParseError('O campo "slug" deve conter apenas letras minúsculas, números, hifens ou underscores.');
        return;
      }

      setPayload(parsed);
      setStep('loaded');
    } catch (e: unknown) {
      const err = e instanceof Error ? e.message : 'Erro desconhecido';
      setJsonParseError(`JSON inválido: ${err}`);
    }
  }

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.json')) {
      setJsonParseError('O arquivo deve ter extensão .json');
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      parseAndSetPayload(text);
    };
    reader.readAsText(file);
  }

  function handleTextAreaChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    parseAndSetPayload(e.target.value);
  }

  function handleImport() {
    if (!payload) return;

    startTransition(async () => {
      const result = await importContent({
        title: payload.title,
        slug: payload.slug,
        type: payload.type,
        body: payload.body,
        publish: publishOnImport,
        meta: payload.meta ?? {},
      });

      if (result.error) {
        setStep('error');
        setErrorMsg(result.error);
      } else {
        const action = (result as { action?: string }).action === 'updated' ? 'atualizado' : 'criado';
        setStep('success');
        setSuccessMsg(`Conteúdo ${action} com sucesso!`);
        onSuccess?.();
      }
    });
  }

  if (!open) {
    return (
      <button
        id="import-content-btn"
        onClick={openDialog}
        className="flex h-9 items-center gap-2 rounded-lg border border-border px-4 text-sm font-medium text-foreground transition-colors hover:bg-accent"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
        </svg>
        Importar JSON
      </button>
    );
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
        onClick={closeDialog}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="import-dialog-title"
        className="fixed left-1/2 top-1/2 z-50 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-xl border border-border bg-background shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div>
            <h2 id="import-dialog-title" className="text-base font-semibold tracking-tight">
              Importar Conteúdo via JSON
            </h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Cole o JSON gerado pelo script <code className="rounded bg-muted px-1 py-0.5 text-[10px] font-mono">compilar-json.js</code> ou faça upload do arquivo.
            </p>
          </div>
          <button
            id="import-dialog-close"
            onClick={closeDialog}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
            aria-label="Fechar"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {/* Success state */}
          {step === 'success' && (
            <div className="rounded-lg bg-emerald-500/10 px-4 py-3 text-sm text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
              <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              {successMsg}
            </div>
          )}

          {/* Error state */}
          {step === 'error' && (
            <div className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive flex items-start gap-2">
              <svg className="h-4 w-4 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
              <span>{errorMsg}</span>
            </div>
          )}

          {step !== 'success' && (
            <>
              {/* File upload button */}
              <div className="flex items-center gap-3">
                <button
                  id="import-file-upload-btn"
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex h-8 items-center gap-1.5 rounded-lg border border-dashed border-border px-3 text-xs text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                >
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13" />
                  </svg>
                  Carregar arquivo .json
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json"
                  className="hidden"
                  onChange={handleFileUpload}
                  id="import-file-input"
                />
                <span className="text-xs text-muted-foreground">ou cole o conteúdo abaixo</span>
              </div>

              {/* JSON textarea */}
              <div>
                <textarea
                  id="import-json-textarea"
                  value={rawJson}
                  onChange={handleTextAreaChange}
                  placeholder={'{\n  "title": "Meu Artigo",\n  "slug": "meu-artigo",\n  "type": "engineering-work",\n  "body": "# Conteúdo...",\n  "meta": { "pillar": "frontend", "access": "free", "summary": "", "estimatedMinutes": 10 }\n}'}
                  rows={10}
                  className="w-full rounded-lg border border-border bg-secondary/30 px-3 py-2.5 font-mono text-xs text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30 resize-none"
                  spellCheck={false}
                />
                {jsonParseError && (
                  <p className="mt-1 text-[11px] text-destructive">{jsonParseError}</p>
                )}
              </div>

              {/* Preview card when payload is valid */}
              {payload && step === 'loaded' && (
                <div className="rounded-lg border border-border bg-secondary/20 px-4 py-3 space-y-2">
                  <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Prévia do conteúdo</p>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-xs">
                    <div>
                      <span className="text-muted-foreground">Título: </span>
                      <span className="font-medium">{payload.title}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Slug: </span>
                      <code className="font-mono text-primary">{payload.slug}</code>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Tipo: </span>
                      <span>{ALLOWED_TYPES[payload.type] ?? payload.type}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Acesso: </span>
                      <span className={payload.meta?.access === 'pro' ? 'text-amber-500 font-medium' : 'text-emerald-500 font-medium'}>
                        {payload.meta?.access === 'pro' ? 'Pro' : 'Gratuito'}
                      </span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-muted-foreground">Tamanho do body: </span>
                      <span>{payload.body.length.toLocaleString('pt-BR')} caracteres</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Publish toggle */}
              {payload && step === 'loaded' && (
                <label className="flex cursor-pointer items-center gap-3 text-sm" htmlFor="import-publish-toggle">
                  <div
                    className="relative"
                    onClick={() => setPublishOnImport(!publishOnImport)}
                    role="switch"
                    aria-checked={publishOnImport}
                    id="import-publish-toggle"
                  >
                    <div className={`h-5 w-9 rounded-full transition-colors ${publishOnImport ? 'bg-emerald-600' : 'bg-muted'}`} />
                    <div className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${publishOnImport ? 'translate-x-4' : 'translate-x-0.5'}`} />
                  </div>
                  <span>
                    <span className="font-medium">Publicar imediatamente</span>
                    <span className="ml-1 text-muted-foreground">(senão salva como rascunho)</span>
                  </span>
                </label>
              )}

              {/* Helper link */}
              <div className="rounded-lg border border-border/50 bg-secondary/10 px-3 py-2.5 text-xs text-muted-foreground">
                <p className="font-medium text-foreground mb-1">Precisa de ajuda para criar o JSON?</p>
                <p>
                  Baixe os materiais de apoio em{' '}
                  <code className="rounded bg-muted px-1 font-mono text-[10px]">public/creator-support/</code>.
                  O script <code className="rounded bg-muted px-1 font-mono text-[10px]">compilar-json.js</code> monta o arquivo automaticamente a partir do seu Markdown.
                  Consulte o guia <code className="rounded bg-muted px-1 font-mono text-[10px]">exemplo-conteudo.md</code> para ver os recursos disponíveis.
                </p>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-border px-6 py-4">
          {step === 'success' ? (
            <button
              id="import-dialog-done-btn"
              onClick={closeDialog}
              className="rounded-lg bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Concluir
            </button>
          ) : (
            <>
              <button
                id="import-dialog-cancel-btn"
                onClick={closeDialog}
                className="rounded-lg px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Cancelar
              </button>
              <button
                id="import-dialog-submit-btn"
                onClick={handleImport}
                disabled={!payload || step !== 'loaded' || isPending}
                className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isPending && (
                  <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                )}
                {isPending ? 'Importando...' : 'Importar Conteúdo'}
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}
