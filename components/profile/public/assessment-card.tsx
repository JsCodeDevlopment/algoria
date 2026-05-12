"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Editor from "@monaco-editor/react";
import { Code } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";

interface Props {
  testSlug: string;
  testTitle: string;
  track: string;
  level: string;
  language: string;
  quizScore: number;
  totalQuestions: number;
  codePassed: boolean;
  resolutionCode: string | null;
  explanation: string | null;
  completedAt: string;
  challengeDescription?: string;
}

export function AssessmentCard({
  testSlug,
  testTitle,
  track,
  level,
  language,
  quizScore,
  totalQuestions,
  codePassed,
  resolutionCode,
  explanation,
  completedAt,
  challengeDescription,
}: Props) {
  const [showResolution, setShowResolution] = useState(false);

  return (
    <>
      <div className="border-2 border-border bg-background p-8 relative group overflow-hidden shadow-[8px_8px_0_0_rgba(0,0,0,0.03)]">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="font-black uppercase tracking-tight text-xl leading-tight">
              {testTitle}
            </h3>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground mt-2">
              {track} • {level} •{" "}
              {new Date(completedAt).toLocaleDateString("pt-PT")}
            </p>
          </div>
          <div className="flex flex-col items-end">
            <div className="text-3xl font-black tabular-nums text-primary">
              {quizScore}/{totalQuestions}
            </div>
            <div className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground">
              Teoria
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-6 border-t border-border/50">
          <div className="flex items-center gap-2">
            <div
              className={
                codePassed
                  ? "h-2 w-2 rounded-full bg-emerald-500"
                  : "h-2 w-2 rounded-full bg-destructive"
              }
            />
            <span className="text-xs font-black uppercase tracking-widest">
              Resolução Prática: {codePassed ? "Aprovada" : "Reprovada"}
            </span>
          </div>

          {resolutionCode && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowResolution(true)}
              className="h-7 rounded-none px-2 text-[9px] font-black uppercase tracking-widest gap-1.5 hover:bg-primary/10 hover:text-primary"
            >
              <Code className="h-3 w-3" /> Ver Resolução
            </Button>
          )}
        </div>
      </div>

      <Dialog open={showResolution} onOpenChange={setShowResolution}>
        <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-0 gap-0 overflow-hidden rounded-none border-4 border-primary">
          <DialogHeader className="p-6 border-b-2 border-primary bg-primary/5 flex-row items-center justify-between space-y-0">
            <div>
              <DialogTitle className="text-xl font-black uppercase tracking-tighter">
                Resolução: {testTitle}
              </DialogTitle>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-1">
                Linguagem: {language.toUpperCase()} • Nível: {level}
              </p>
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto">
            {/* Challenge Description */}
            <div className="p-6 border-b border-border bg-muted/5">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-3">
                Enunciado do Desafio
              </h3>
              <p className="text-sm leading-relaxed font-medium text-foreground/80 whitespace-pre-wrap">
                {challengeDescription || "Descrição não disponível."}
              </p>
            </div>

            {/* User Explanation (if present) */}
            {explanation && (
              <div className="p-6 border-b border-border bg-primary/5">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-3">
                  Explicação da Resolução
                </h3>
                <p className="text-sm leading-relaxed font-medium text-foreground whitespace-pre-wrap italic">
                  &ldquo;{explanation}&rdquo;
                </p>
              </div>
            )}

            {/* Code Editor */}
            <div className="p-6">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-3">
                Código Implementado
              </h3>
              <div className="bg-[#1e1e1e] border-2 border-border shadow-inner">
                <Editor
                  height={Math.max(200, Math.min(((resolutionCode?.split("\n").length || 0) * 24) + 80, 500)) + "px"}
                  defaultLanguage={language === "csharp" ? "csharp" : language === "javascript" ? "javascript" : language}
                  language={language === "csharp" ? "csharp" : language === "javascript" ? "javascript" : language}
                  theme="vs-dark"
                  value={resolutionCode || ""}
                  options={{
                    readOnly: true,
                    minimap: { enabled: false },
                    fontSize: 13,
                    lineNumbers: "on",
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    padding: { top: 16, bottom: 16 },
                    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                    cursorSmoothCaretAnimation: "on",
                  }}
                />
              </div>
            </div>
          </div>


        </DialogContent>
      </Dialog>
    </>
  );
}
