import { useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { Code2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Project } from "./types";

interface GithubImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  githubUrl: string | null;
  githubRepos: Project[];
  selectedRepos: Set<number>;
  onToggleRepo: (idx: number) => void;
  onConfirm: () => void;
}

const emptySubscribe = () => () => {};

export function GithubImportModal({
  isOpen,
  onClose,
  githubUrl,
  githubRepos,
  selectedRepos,
  onToggleRepo,
  onConfirm,
}: GithubImportModalProps) {
  const isClient = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  if (!isOpen || !isClient) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-md p-4 md:p-6 overflow-y-auto">
      <div className="relative w-full max-w-2xl border-4 border-primary bg-[#0a0a0f] p-6 md:p-10 shadow-[0_0_100px_rgba(0,0,0,0.8)] my-auto overflow-hidden">
        {/* Elemento decorativo industrial */}
        <div className="absolute top-0 right-0 p-2 opacity-10 pointer-events-none">
          <Code2 className="h-40 w-40" />
        </div>

        <header className="relative mb-8 flex items-start justify-between border-b-2 border-border pb-6">
          <div>
            <h2 className="text-3xl font-black uppercase tracking-tighter leading-none text-white">
              Selecionar Repositórios
            </h2>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary mt-4 flex items-center gap-2">
              <span className="h-2 w-2 bg-primary animate-ping" />
              Source: github.com/{githubUrl?.split("/").pop()}
            </p>
          </div>
          <button
            onClick={onClose}
            className="group flex items-center gap-2 bg-white/5 px-4 py-2 hover:bg-destructive transition-colors border border-white/10"
          >
            <span className="text-[10px] font-black uppercase tracking-widest text-white">
              Fechar
            </span>
            <X className="h-4 w-4 text-white" />
          </button>
        </header>

        <div className="max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar space-y-3">
          {githubRepos.map((repo, idx) => {
            const isSelected = selectedRepos.has(idx);
            return (
              <button
                key={idx}
                type="button"
                onClick={() => onToggleRepo(idx)}
                className={`w-full flex flex-col items-start p-6 border-2 transition-all text-left group relative overflow-hidden ${
                  isSelected
                    ? "border-primary bg-primary/10"
                    : "border-white/10 hover:border-primary/40 bg-white/5"
                }`}
              >
                {isSelected && (
                  <div className="absolute top-0 right-0 h-12 w-12 overflow-hidden">
                    <div className="absolute top-0 right-0 h-full w-full bg-primary transform rotate-45 translate-x-6 -translate-y-6" />
                  </div>
                )}

                <div className="flex items-center gap-4 relative z-10">
                  <div
                    className={`h-6 w-6 border-2 flex items-center justify-center transition-colors ${isSelected ? "border-primary bg-primary" : "border-white/20 group-hover:border-primary"}`}
                  >
                    {isSelected && <div className="h-2.5 w-2.5 bg-white" />}
                  </div>
                  <div>
                    <span className="font-black uppercase tracking-tight text-lg block text-white">
                      {repo.title}
                    </span>
                    {repo.deployUrl && (
                      <span className="text-[9px] font-black uppercase text-primary tracking-widest bg-primary/20 px-2 py-0.5 mt-1 inline-block">
                        Deploy disponível
                      </span>
                    )}
                  </div>
                </div>
                {repo.description && (
                  <p className="text-xs text-white/50 mt-4 line-clamp-2 leading-relaxed font-medium">
                    {repo.description}
                  </p>
                )}
              </button>
            );
          })}
        </div>

        <footer className="relative mt-10 flex items-center justify-between border-t-2 border-border pt-8">
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-widest text-white/40">
              Repositórios
            </span>
            <span className="text-2xl font-black text-white">
              {selectedRepos.size}{" "}
              <span className="text-primary">/ {githubRepos.length}</span>
            </span>
          </div>
          <Button
            onClick={onConfirm}
            disabled={selectedRepos.size === 0}
            className="rounded-none font-black uppercase tracking-[0.2em] px-12 h-16 text-base shadow-[8px_8px_0_0_rgba(var(--primary-rgb),0.3)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
          >
            Confirmar Importação
          </Button>
        </footer>
      </div>
    </div>,
    document.body,
  );
}
