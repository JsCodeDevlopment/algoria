"use client";

import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  LogOut,
  Play,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TechnicalTest } from "@/lib/content/tests-data";
import { cn } from "@/lib/utils";

interface Props {
  test: TechnicalTest;
}

type Step = "intro" | "testing" | "results";
type Tab = number | "challenge";

export function TestClient({ test }: Props) {
  const router = useRouter();

  const [step, setStep] = useState<Step>("intro");
  const [activeTab, setActiveTab] = useState<Tab>(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  // Code Challenge State
  const [code, setCode] = useState(test.challenge.initialCode);
  const [testResults, setTestResults] = useState<
    { id: string; passed: boolean; error?: string }[]
  >([]);
  const [isEvaluating, setIsEvaluating] = useState(false);

  // Results State
  const [quizScore, setQuizScore] = useState(0);

  // Dialog States
  const [showFinishDialog, setShowFinishDialog] = useState(false);
  const [showGiveUpDialog, setShowGiveUpDialog] = useState(false);

  const handleStart = () => {
    setStep("testing");
    setActiveTab(0);
  };

  const handleAnswerSelect = (questionId: string, optionId: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  const runCodeTests = async () => {
    setIsEvaluating(true);
    const results = [];

    for (const tc of test.challenge.testCases) {
      try {
        const executeString = `
          ${code}
          return await ${tc.assertion};
        `;

        // eslint-disable-next-line no-new-func
        const fn = new Function(`return (async () => { ${executeString} })()`);
        const passed = await fn();

        results.push({ id: tc.id, passed: passed === true });
      } catch (err) {
        const error = err as Error;
        results.push({ id: tc.id, passed: false, error: error.message });
      }
    }

    setTestResults(results);
    setIsEvaluating(false);
  };

  const finishTest = () => {
    let score = 0;
    test.questions.forEach((q) => {
      if (answers[q.id] === q.correctOptionId) score++;
    });
    setQuizScore(score);
    setStep("results");
    setShowFinishDialog(false);
  };

  const giveUp = () => {
    router.push("/tests");
    setShowGiveUpDialog(false);
  };

  const allTestsPassed =
    testResults.length > 0 && testResults.every((r) => r.passed);

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 md:py-24">
      {/* HEADER INTRO & RESULTS */}
      {step !== "testing" && (
        <div className="mx-auto max-w-4xl mb-10 flex items-center justify-between border-b-4 border-primary pb-4">
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tight">
              {test.title}
            </h1>
            <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
              Track: {test.track} | Nível: {test.level}
            </p>
          </div>
          <div className="hidden text-right md:block">
            <div className="text-[10px] font-black uppercase tracking-widest text-primary">
              Tempo Limit
            </div>
            <div className="font-mono text-2xl font-bold">
              {test.timeLimitMinutes}m
            </div>
          </div>
        </div>
      )}

      {/* INTRO STEP */}
      {step === "intro" && (
        <div className="mx-auto max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-4">
          <div className="bg-muted/20 border-2 border-border p-8">
            <h2 className="mb-4 text-xl font-black uppercase tracking-widest">
              Instruções
            </h2>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              {test.description}
            </p>
            <ul className="space-y-3 text-sm font-medium">
              <li className="flex items-center gap-2">
                <ChevronRight className="h-4 w-4 text-primary" /> Parte 1:{" "}
                {test.questions.length} perguntas de escolha múltipla.
              </li>
              <li className="flex items-center gap-2">
                <ChevronRight className="h-4 w-4 text-primary" /> Parte 2:
                Desafio de código com casos de teste.
              </li>
              <li className="flex items-center gap-2">
                <ChevronRight className="h-4 w-4 text-primary" /> Podes navegar
                livremente entre as secções.
              </li>
              <li className="flex items-center gap-2 text-destructive">
                <ChevronRight className="h-4 w-4" /> Em caso de desistência, o
                teu progresso será perdido.
              </li>
            </ul>
          </div>
          <Button
            size="lg"
            onClick={handleStart}
            className="w-full rounded-none font-black uppercase cursor-pointer tracking-widest h-14"
          >
            Começar Agora <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      )}

      {/* TESTING STEP */}
      {step === "testing" && (
        <div className="flex flex-col gap-6 lg:flex-row animate-in fade-in">
          {/* SIDEBAR NAVIGATION */}
          <aside className="lg:w-72 shrink-0 flex flex-col gap-4">
            <div className="border border-border bg-card p-5 space-y-8 shadow-sm">
              <div>
                <div className="flex items-center gap-2 mb-4 pb-2 border-b border-border">
                  <div className="h-2 w-2 bg-primary" />
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground">
                    Parte 1: Teoria
                  </h3>
                </div>
                <nav className="grid grid-cols-2 gap-2">
                  {test.questions.map((q, i) => {
                    const isAnswered = !!answers[q.id];
                    const isActive = activeTab === i;
                    return (
                      <button
                        key={q.id}
                        onClick={() => setActiveTab(i)}
                        className={cn(
                          "relative flex flex-col items-start p-3 border text-left transition-all cursor-pointer",
                          isActive
                            ? "border-primary bg-primary/10 shadow-[2px_2px_0_0_rgba(var(--primary-rgb),0.3)]"
                            : isAnswered
                              ? "border-emerald-500/30 bg-emerald-500/5 hover:border-emerald-500/60"
                              : "border-border hover:border-primary/50 bg-background",
                        )}
                      >
                        <span
                          className={cn(
                            "text-[8px] font-black uppercase tracking-widest mb-1",
                            isActive ? "text-primary" : "text-muted-foreground",
                          )}
                        >
                          Pergunta {i + 1}
                        </span>
                        {isAnswered ? (
                          <span className="text-[9px] font-bold uppercase tracking-widest text-emerald-500 flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3" /> Salva
                          </span>
                        ) : (
                          <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
                            Pendente
                          </span>
                        )}
                      </button>
                    );
                  })}
                </nav>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-4 pb-2 border-b border-border">
                  <div className="h-2 w-2 bg-primary" />
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground">
                    Parte 2: Prática
                  </h3>
                </div>
                <button
                  onClick={() => setActiveTab("challenge")}
                  className={cn(
                    "w-full flex items-center justify-between p-4 border transition-all cursor-pointer",
                    activeTab === "challenge"
                      ? "border-primary bg-primary/10 shadow-[2px_2px_0_0_rgba(var(--primary-rgb),0.3)] text-primary"
                      : allTestsPassed
                        ? "border-emerald-500/30 bg-emerald-500/5 hover:border-emerald-500/60 text-foreground"
                        : "border-border hover:border-primary/50 bg-background text-muted-foreground",
                  )}
                >
                  <span className="text-xs font-black uppercase tracking-wider">
                    Desafio de Código
                  </span>
                  {allTestsPassed && (
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  )}
                </button>
              </div>
            </div>

            <div className="border border-border bg-card p-4 flex flex-col gap-3 shadow-sm mt-auto">
              <Button
                variant="default"
                onClick={() => setShowFinishDialog(true)}
                className="w-full rounded-none font-black uppercase tracking-widest text-[10px]"
              >
                Finalizar Teste
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowGiveUpDialog(true)}
                className="w-full rounded-none font-black uppercase tracking-widest text-destructive hover:bg-destructive hover:text-destructive-foreground border-destructive/30 text-[10px]"
              >
                <LogOut className="mr-2 h-3 w-3" /> Desistir
              </Button>
            </div>
          </aside>

          {/* MAIN CONTENT AREA */}
          <main className="flex-1 min-w-0">
            {typeof activeTab === "number" && (
              <div className="space-y-6">
                <div className="border-2 border-primary/20 bg-primary/5 p-6 md:p-8">
                  <div className="mb-4 text-[10px] font-black uppercase tracking-widest text-primary">
                    Pergunta {activeTab + 1} de {test.questions.length}
                  </div>
                  <h2 className="text-xl font-bold leading-relaxed">
                    {test.questions[activeTab].question}
                  </h2>
                </div>

                <div className="space-y-3">
                  {test.questions[activeTab].options.map((opt) => {
                    const isSelected =
                      answers[test.questions[activeTab].id] === opt.id;
                    return (
                      <button
                        key={opt.id}
                        onClick={() =>
                          handleAnswerSelect(
                            test.questions[activeTab].id,
                            opt.id,
                          )
                        }
                        className={`w-full text-left p-4 md:p-6 border-2 transition-all cursor-pointer ${
                          isSelected
                            ? "border-primary bg-primary/10 shadow-[4px_4px_0_0_rgba(var(--primary-rgb),0.2)]"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <div
                            className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center border-2 text-[10px] font-black uppercase ${
                              isSelected
                                ? "border-primary bg-primary text-primary-foreground"
                                : "border-muted-foreground text-muted-foreground"
                            }`}
                          >
                            {opt.id}
                          </div>
                          <span className="font-medium leading-relaxed">
                            {opt.text}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="flex justify-end pt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      if (activeTab < test.questions.length - 1) {
                        setActiveTab(activeTab + 1);
                      } else {
                        setActiveTab("challenge");
                      }
                    }}
                    className="rounded-none font-black uppercase tracking-widest"
                  >
                    Próxima Secção <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {activeTab === "challenge" && (
              <div className="space-y-6">
                <div className="bg-card border border-border p-6 shadow-sm">
                  <h2 className="mb-4 text-xl font-black uppercase tracking-widest text-primary flex items-center gap-2">
                    <div className="h-4 w-4 bg-primary" />
                    Desafio Prático: {test.challenge.title}
                  </h2>
                  <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap font-medium">
                    {test.challenge.description}
                  </p>
                </div>

                <div className="grid gap-6 xl:grid-cols-2">
                  <div className="flex flex-col border-2 border-border bg-[#1e1e1e]">
                    <div className="flex items-center justify-between border-b border-border/20 bg-[#2d2d2d] px-4 py-2">
                      <span className="text-[10px] font-mono text-muted-foreground">
                        {test.challenge.functionName}.js
                      </span>
                      <Button
                        onClick={runCodeTests}
                        disabled={isEvaluating}
                        size="sm"
                        className="h-7 rounded-none bg-emerald-600 hover:bg-emerald-700 text-[10px] font-black uppercase"
                      >
                        <Play className="mr-1.5 h-3 w-3" /> Executar Testes
                      </Button>
                    </div>
                    <textarea
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      spellCheck={false}
                      className="w-full flex-1 resize-none bg-transparent p-4 font-mono text-sm text-[#d4d4d4] focus:outline-none min-h-[400px] xl:min-h-0"
                    />
                  </div>

                  <div className="border-2 border-border bg-muted/5 p-6 flex flex-col">
                    <h3 className="mb-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                      Casos de Teste
                    </h3>

                    <div className="space-y-4 flex-1">
                      {test.challenge.testCases.map((tc) => {
                        const result = testResults.find((r) => r.id === tc.id);
                        return (
                          <div
                            key={tc.id}
                            className="border border-border bg-background p-4"
                          >
                            <div className="flex items-start justify-between gap-4">
                              <span className="text-sm font-medium">
                                {tc.description}
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
                            {result?.error && (
                              <div className="mt-3 bg-destructive/10 p-2 text-xs font-mono text-destructive border-l-2 border-destructive break-all">
                                {result.error}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      )}

      {/* RESULTS STEP */}
      {step === "results" && (
        <div className="mx-auto max-w-4xl space-y-10 animate-in zoom-in-95 duration-500">
          <div className="text-center py-12 border-4 border-primary bg-primary/5">
            <h2 className="mb-6 text-4xl font-black uppercase tracking-tighter text-primary">
              Avaliação Concluída!
            </h2>

            <div className="flex justify-center gap-12 mt-8">
              <div className="text-center">
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">
                  Teoria
                </div>
                <div className="text-5xl font-mono font-black">
                  {quizScore}/{test.questions.length}
                </div>
              </div>
              <div className="text-center">
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">
                  Prática
                </div>
                <div
                  className={cn(
                    "text-5xl font-mono font-black",
                    allTestsPassed ? "text-emerald-500" : "text-destructive",
                  )}
                >
                  {allTestsPassed ? "100%" : "Falhou"}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-black uppercase tracking-widest">
              Respostas da Teoria
            </h3>
            {test.questions.map((q, i) => {
              const userAnswer = answers[q.id];
              const isCorrect = userAnswer === q.correctOptionId;

              return (
                <div
                  key={q.id}
                  className={`border-l-4 p-6 bg-muted/20 ${
                    isCorrect ? "border-emerald-500" : "border-destructive"
                  }`}
                >
                  <h4 className="font-bold mb-4">
                    {i + 1}. {q.question}
                  </h4>
                  <div className="space-y-2 mb-4">
                    <p className="text-sm">
                      <span className="font-bold text-muted-foreground uppercase text-[10px] tracking-widest">
                        A tua resposta:{" "}
                      </span>
                      {q.options.find((o) => o.id === userAnswer)?.text ||
                        "Não respondida"}
                    </p>
                    {!isCorrect && (
                      <p className="text-sm">
                        <span className="font-bold text-muted-foreground uppercase text-[10px] tracking-widest">
                          Correta:{" "}
                        </span>
                        {
                          q.options.find((o) => o.id === q.correctOptionId)
                            ?.text
                        }
                      </p>
                    )}
                  </div>
                  <div className="bg-background p-4 border border-border text-sm italic text-muted-foreground">
                    <span className="not-italic font-bold text-foreground">
                      Explicação:{" "}
                    </span>
                    {q.explanation}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-center pt-8">
            <Button
              asChild
              className="rounded-none font-black uppercase tracking-widest h-14 px-12"
            >
              <Link href="/tests">Voltar ao Menu de Testes</Link>
            </Button>
          </div>
        </div>
      )}
      {/* DIALOGS */}
      <Dialog open={showFinishDialog} onOpenChange={setShowFinishDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Finalizar Simulado?</DialogTitle>
            <DialogDescription>
              Tens a certeza que queres finalizar o teste? Não poderás alterar
              as tuas respostas depois disto.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 gap-2">
            <Button
              variant="outline"
              className="rounded-none uppercase font-black text-xs"
              onClick={() => setShowFinishDialog(false)}
            >
              Cancelar
            </Button>
            <Button
              className="rounded-none uppercase font-black text-xs"
              onClick={finishTest}
            >
              Confirmar e Finalizar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showGiveUpDialog} onOpenChange={setShowGiveUpDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-destructive">
              Desistir do Teste?
            </DialogTitle>
            <DialogDescription>
              Tens a certeza que queres desistir? Todo o teu progresso neste
              simulado será perdido permanentemente.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 gap-2">
            <Button
              variant="outline"
              className="rounded-none uppercase font-black text-xs"
              onClick={() => setShowGiveUpDialog(false)}
            >
              Continuar Teste
            </Button>
            <Button
              variant="destructive"
              className="rounded-none uppercase font-black text-xs"
              onClick={giveUp}
            >
              Sim, Desistir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
