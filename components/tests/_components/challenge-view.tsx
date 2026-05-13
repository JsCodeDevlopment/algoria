import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TechnicalTest } from "@/lib/content/schemas";
import { cn } from "@/lib/utils";
import Editor from "@monaco-editor/react";
import { CheckCircle2, Lightbulb, Play, XCircle } from "lucide-react";

interface Props {
  test: TechnicalTest;
  language: string;
  setLanguage: (lang: string) => void;
  codes: Record<string, string>;
  setCodes: (codes: Record<string, string>) => void;
  explanation: string;
  setExplanation: (exp: string) => void;
  isEvaluating: boolean;
  onRunTests: () => void;
  testResults: { id: string; passed: boolean; error?: string }[];
}

export function ChallengeView({
  test,
  language,
  setLanguage,
  codes,
  setCodes,
  explanation,
  setExplanation,
  isEvaluating,
  onRunTests,
  testResults,
}: Props) {
  return (
    <div className="flex flex-col gap-10">
      <div className="bg-card border-l-8 border-primary p-8 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-6">
          <div className="flex items-center gap-3">
            <div className="h-1.5 w-6 bg-primary" />
            <h2 className="text-sm font-black uppercase tracking-[0.3em] text-primary">
              Desafio Prático
            </h2>
          </div>
        </div>

        <h1 className="mb-6 text-3xl font-black uppercase tracking-tighter">
          {test.challenge.title}
        </h1>
        <p className="text-base leading-relaxed text-muted-foreground whitespace-pre-wrap font-medium max-w-5xl">
          {test.challenge.description}
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-4 w-4 bg-primary" />
          <h3 className="text-xs font-black uppercase tracking-[0.2em]">
            Explicação da Resolução
            <span className="text-muted-foreground ml-2 text-xs">
              (Opcional)
            </span>
          </h3>
        </div>
        <textarea
          value={explanation}
          onChange={(e) => setExplanation(e.target.value)}
          placeholder="Descreve brevemente o teu raciocínio..."
          className="w-full min-h-[120px] p-4 bg-background border-2 border-border focus:border-primary outline-none transition-all text-sm leading-relaxed font-medium resize-y"
        />
      </div>

      <div className="flex flex-col border-4 border-border bg-[#1e1e1e] shadow-xl">
        <div className="flex items-center justify-between border-b-2 border-border/20 bg-[#2d2d2d] px-6 py-3">
          <div className="flex items-center gap-6">
            <div className="hidden md:flex gap-1.5">
              <div className="h-3 w-3 rounded-full bg-red-500/20 border border-red-500/40" />
              <div className="h-3 w-3 rounded-full bg-amber-500/20 border border-amber-500/40" />
              <div className="h-3 w-3 rounded-full bg-emerald-500/20 border border-emerald-500/40" />
            </div>
            
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                  Linguagem:
                </span>
                <select
                  value={language}
                  onChange={(e) => {
                    const lang = e.target.value;
                    setLanguage(lang);
                    if (!codes[lang]) {
                      setCodes({
                        ...codes,
                        [lang]: test.challenge.templates[lang].initialCode,
                      });
                    }
                  }}
                  className="bg-transparent border-none text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest outline-none transition-all cursor-pointer hover:text-foreground"
                >
                  {Object.keys(test.challenge.templates).map((lang) => (
                    <option
                      key={lang}
                      value={lang}
                      className="bg-[#2d2d2d] text-white"
                    >
                      {lang.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>

              {test.solutions && test.solutions.length > 0 && (
                <Dialog>
                  <DialogTrigger asChild>
                    <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-amber-400 hover:text-amber-300 transition-colors">
                      <Lightbulb className="h-3.5 w-3.5" />
                      Consultar Solução
                    </button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto bg-background rounded-none border-4 border-primary p-0">
                    <DialogHeader className="p-8 bg-primary/5 border-b-2 border-primary/10">
                      <DialogTitle className="text-2xl font-black uppercase tracking-tighter">
                        Resoluções Sugeridas
                      </DialogTitle>
                      <DialogDescription className="font-bold text-primary/70">
                        Estuda a abordagem técnica recomendada para este desafio.
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="p-8 space-y-10">
                      {test.solutions.map((sol) => (
                        <div key={sol.id} className="space-y-6">
                          <div className="border-l-4 border-primary pl-6 py-1">
                            <h4 className="text-lg font-black uppercase tracking-tight mb-3">
                              {sol.title}
                            </h4>
                            <p className="text-sm leading-relaxed text-muted-foreground">
                              {sol.explanation}
                            </p>
                          </div>

                          <div className="space-y-6">
                            {Object.entries(sol.code).map(([lang, code]) => (
                              <div key={lang} className="space-y-3">
                                <div className="flex items-center gap-2">
                                  <div className="h-1.5 w-4 bg-primary" />
                                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                    {lang}
                                  </span>
                                </div>
                                <pre className="p-5 bg-muted/30 border-2 border-border text-xs font-mono overflow-x-auto leading-relaxed shadow-inner">
                                  <code>{code}</code>
                                </pre>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>
          
          <Button
            onClick={onRunTests}
            disabled={isEvaluating}
            size="sm"
            className="h-9 rounded-none bg-emerald-600 hover:bg-emerald-700 text-[10px] font-black uppercase tracking-widest px-6 shadow-[3px_3px_0_0_rgba(0,0,0,0.3)]"
          >
            {isEvaluating ? (
              "A avaliar..."
            ) : (
              <>
                <Play className="mr-2 h-3.5 w-3.5" /> Executar Testes
              </>
            )}
          </Button>
        </div>
        <div className="h-[500px] lg:h-[600px]">
          <Editor
            key={language}
            height="100%"
            language={
              language === "python"
                ? "python"
                : language === "csharp"
                  ? "csharp"
                  : language === "javascript"
                    ? "javascript"
                    : language
            }
            theme="vs-dark"
            value={codes[language]}
            onChange={(value) =>
              setCodes({
                ...codes,
                [language]: value || "",
              })
            }
            options={{
              minimap: { enabled: false },
              fontSize: 16,
              lineNumbers: "on",
              scrollBeyondLastLine: false,
              automaticLayout: true,
              padding: { top: 24, bottom: 24 },
              fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
              cursorSmoothCaretAnimation: "on",
              smoothScrolling: true,
            }}
          />
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="h-4 w-4 bg-primary" />
          <h3 className="text-xs font-black uppercase tracking-[0.2em]">
            Resultados da Validação
          </h3>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {test.challenge.testCases.map((tc, index) => {
            const result = testResults.find((r) => r.id === tc.id);
            return (
              <div
                key={tc.id}
                className={cn(
                  "border-2 p-6 transition-all",
                  result
                    ? result.passed
                      ? "border-emerald-500/30 bg-emerald-500/5 shadow-[4px_4px_0_0_rgba(16,185,129,0.1)]"
                      : "border-destructive/30 bg-destructive/5 shadow-[4px_4px_0_0_rgba(239,68,68,0.1)]"
                    : "border-border bg-background",
                )}
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    Caso #{index + 1}
                  </span>
                  {result ? (
                    result.passed ? (
                      <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />
                    ) : (
                      <XCircle className="h-5 w-5 shrink-0 text-destructive" />
                    )
                  ) : (
                    <div className="h-5 w-5 shrink-0 rounded-full border-2 border-muted" />
                  )}
                </div>
                <p className="text-sm font-bold leading-snug">
                  {tc.description}
                </p>
                {result?.error && (
                  <div className="mt-4 bg-destructive/10 p-3 text-[10px] font-mono text-destructive border-l-2 border-destructive break-all overflow-hidden">
                    {result.error}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
