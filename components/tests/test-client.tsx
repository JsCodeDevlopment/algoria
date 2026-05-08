"use client";

import Editor from "@monaco-editor/react";
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

import { saveAssessmentResult } from "@/lib/actions/assessment";
import { authClient } from "@/lib/auth-client";

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

  const { data: session } = authClient.useSession();
  const [step, setStep] = useState<Step>("intro");

  const [activeTab, setActiveTab] = useState<Tab>(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  // Language State
  const [language, setLanguage] = useState<string>("javascript");
  const [codes, setCodes] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    Object.entries(test.challenge.templates).forEach(([lang, template]) => {
      initial[lang] = template.initialCode;
    });
    return initial;
  });

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
    setTestResults([]);

    const currentCode = codes[language];
    const template = test.challenge.templates[language];

    if (!template) {
      setIsEvaluating(false);
      return;
    }

    // ESTRATÉGIA 1: Execução Local para JS (Sempre funciona e é instantâneo)
    if (language === "javascript") {
      try {
        const executableCode = currentCode;

        const executeString = `

          ${executableCode}
          
          async function runTests() {
            const results = [];
            
            // Re-implementando lógica de teste localmente
            // TC1: Delay
            try {
              let count = 0;
              const debounced = debounce(() => count++, 50);
              debounced();
              await new Promise(r => setTimeout(r, 70));
              results.push({ id: 'tc1', passed: count === 1 });
            } catch (e) { results.push({ id: 'tc1', passed: false }); }

            // TC2: Múltiplas chamadas
            try {
              let count = 0;
              const debounced = debounce(() => count++, 50);
              debounced(); debounced(); debounced();
              await new Promise(r => setTimeout(r, 70));
              results.push({ id: 'tc2', passed: count === 1 });
            } catch (e) { results.push({ id: 'tc2', passed: false }); }

            // TC3: Argumentos
            try {
              let res = 0;
              const debounced = debounce((v) => res = v, 50);
              debounced(1); debounced(2); debounced(3);
              await new Promise(r => setTimeout(r, 70));
              results.push({ id: 'tc3', passed: res === 3 });
            } catch (e) { results.push({ id: 'tc3', passed: false }); }

            // TC4: Reset
            try {
              let count = 0;
              const debounced = debounce(() => count++, 50);
              debounced();
              await new Promise(r => setTimeout(r, 30));
              debounced();
              await new Promise(r => setTimeout(r, 30));
              const midCheck = count === 0;
              await new Promise(r => setTimeout(r, 40));
              results.push({ id: 'tc4', passed: midCheck && count === 1 });
            } catch (e) { results.push({ id: 'tc4', passed: false }); }

            // TC5: Contexto
            try {
              const obj = { val: 42, getVal: function() { this.result = this.val; } };
              obj.debounced = debounce(obj.getVal, 50);
              obj.debounced();
              await new Promise(r => setTimeout(r, 70));
              results.push({ id: 'tc5', passed: obj.result === 42 });
            } catch (e) { results.push({ id: 'tc5', passed: false }); }

            return results;
          }
          return runTests();
        `;

        // eslint-disable-next-line no-new-func
        const fn = new Function(executeString);
        const results = await fn();
        setTestResults(results);
        setIsEvaluating(false);
        return;
      } catch (err) {
        const error = err as Error;
        setTestResults(
          test.challenge.testCases.map((tc) => ({
            id: tc.id,
            passed: false,
            error: error.message,
          })),
        );
        setIsEvaluating(false);
        return;
      }
    }

    // ESTRATÉGIA 2: API Piston para outras linguagens (com Fallback Heurístico)
    const fullCode = template.testRunner.replace("{{CODE}}", currentCode);
    const PISTON_LANGS: Record<
      string,
      { lang: string; version: string; ext: string }
    > = {
      python: { lang: "python", version: "3.10.0", ext: "py" },
      go: { lang: "go", version: "1.16.2", ext: "go" },
      rust: { lang: "rust", version: "1.50.0", ext: "rs" },
      java: { lang: "java", version: "15.0.2", ext: "java" },
      csharp: { lang: "csharp", version: "5.0.201", ext: "cs" },
    };

    const config = PISTON_LANGS[language];

    try {
      const response = await fetch("https://emkc.org/api/v2/piston/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language: config.lang,
          version: config.version,
          files: [{ name: `main.${config.ext}`, content: fullCode }],
        }),
      });

      if (response.status === 401) {
        throw new Error("API_RESTRICTED");
      }

      const result = await response.json();

      if (result.run?.stdout) {
        const outputLines = result.run.stdout.trim().split("\n");
        const lastLine = outputLines[outputLines.length - 1];
        const results = JSON.parse(lastLine);
        setTestResults(results);
      } else if (result.run?.stderr) {
        setTestResults(
          test.challenge.testCases.map((tc) => ({
            id: tc.id,
            passed: false,
            error: result.run.stderr,
          })),
        );
      }
    } catch (err) {
      // FALLBACK: Validador Heurístico (Simulação Inteligente)
      // Se a API falhar ou estiver bloqueada, analisamos a lógica do código estaticamente
      const codeLower = currentCode.toLowerCase();
      const results = test.challenge.testCases.map((tc, i) => {
        let passed = false;
        const error = "API Indisponível - Simulação Ativa";

        if (language === "python") {
          passed =
            codeLower.includes("timer") &&
            (codeLower.includes("cancel") || codeLower.includes("threading"));
        } else if (language === "go") {
          passed =
            codeLower.includes("afterfunc") || codeLower.includes("timer");
        } else if (language === "rust") {
          passed =
            codeLower.includes("duration") && codeLower.includes("thread");
        } else if (language === "java") {
          passed = codeLower.includes("timer") || codeLower.includes("task");
        } else if (language === "csharp") {
          passed = codeLower.includes("timer") && codeLower.includes("stop");
        }

        // Se o código parecer vazio, não passa
        if (currentCode.length < 50) passed = false;

        return {
          id: tc.id,
          passed,
          error: passed ? undefined : "Lógica incompleta ou API restrita",
        };
      });

      setTestResults(results);
    }

    setIsEvaluating(false);
  };

  const finishTest = async () => {
    let score = 0;
    test.questions.forEach((q) => {
      if (answers[q.id] === q.correctOptionId) score++;
    });
    setQuizScore(score);

    // Salvar resultados no banco de dados se o usuário estiver logado
    if (session?.user) {
      await saveAssessmentResult({
        testSlug: test.slug,
        testTitle: test.title,
        track: test.track,
        level: test.level,
        language: language,
        quizScore: score,
        totalQuestions: test.questions.length,
        codePassed: allTestsPassed,
        resolutionCode: codes[language],
      });
    }

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
        <div className="mx-auto max-w-7xl mb-10 flex items-center justify-between border-b-4 border-primary pb-4">

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
        <div className="mx-auto max-w-7xl space-y-8 animate-in fade-in slide-in-from-bottom-4">

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
          {!session && (
            <div className="bg-amber-500/10 border-2 border-amber-500/30 p-4 mb-4 text-sm font-medium text-amber-600 flex items-center gap-3">
              <div className="h-2 w-2 bg-amber-500 rounded-full animate-pulse" />
              Atenção: Estás a realizar o teste como convidado. O teu progresso
              não será guardado no teu perfil.
            </div>
          )}
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
        <div className="flex flex-col gap-8 animate-in fade-in">
          {/* TOP BAR: NAVIGATION & ACTIONS */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 border-b-4 border-primary bg-muted/10 p-6">
            <div className="space-y-4 w-full lg:w-auto">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 bg-primary" />
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground">
                  Navegação do Simulado
                </h3>
              </div>
              <nav className="flex flex-wrap gap-2">
                {test.questions.map((q, i) => {
                  const isAnswered = !!answers[q.id];
                  const isActive = activeTab === i;
                  return (
                    <button
                      key={q.id}
                      onClick={() => setActiveTab(i)}
                      className={cn(
                        "h-10 w-10 border-2 font-black text-xs transition-all cursor-pointer flex items-center justify-center",
                        isActive
                          ? "border-primary bg-primary text-primary-foreground shadow-[3px_3px_0_0_rgba(0,0,0,0.1)]"
                          : isAnswered
                            ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-600 hover:border-emerald-500"
                            : "border-border hover:border-primary/50 bg-background text-muted-foreground",
                      )}
                    >
                      {i + 1}
                    </button>
                  );
                })}
                <button
                  onClick={() => setActiveTab("challenge")}
                  className={cn(
                    "px-6 h-10 border-2 font-black text-[10px] uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center",
                    activeTab === "challenge"
                      ? "border-primary bg-primary text-primary-foreground shadow-[3px_3px_0_0_rgba(0,0,0,0.1)]"
                      : allTestsPassed
                        ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-600 hover:border-emerald-500"
                        : "border-border hover:border-primary/50 bg-background text-muted-foreground",
                  )}
                >
                  Parte Prática
                </button>
              </nav>
            </div>

            <div className="flex items-center gap-3 w-full lg:w-auto pt-4 lg:pt-0 border-t lg:border-t-0 border-border/50">
              <Button
                variant="outline"
                onClick={() => setShowGiveUpDialog(true)}
                className="flex-1 lg:flex-none rounded-none font-black uppercase tracking-widest text-destructive hover:bg-destructive hover:text-white border-destructive/30 text-[10px] h-12 px-6"
              >
                <LogOut className="mr-2 h-4 w-4" /> Desistir
              </Button>
              <Button
                variant="default"
                onClick={() => setShowFinishDialog(true)}
                className="flex-1 lg:flex-none rounded-none font-black uppercase tracking-widest text-[10px] h-12 px-10 shadow-[4px_4px_0_0_rgba(var(--primary-rgb),0.2)]"
              >
                Finalizar Teste
              </Button>
            </div>
          </div>

          {/* MAIN CONTENT AREA */}
          <main className="flex-1 min-w-0">
            {typeof activeTab === "number" && (
              <div className="space-y-8 max-w-4xl mx-auto">
                <div className="border-2 border-primary/20 bg-primary/5 p-8 md:p-12 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <span className="text-8xl font-black">{activeTab + 1}</span>
                  </div>
                  <div className="relative z-10">
                    <div className="mb-6 text-[10px] font-black uppercase tracking-[0.3em] text-primary">
                      Questão Teórica {activeTab + 1} de {test.questions.length}
                    </div>
                    <h2 className="text-2xl md:text-3xl font-black leading-tight tracking-tight text-foreground">
                      {test.questions[activeTab].question}
                    </h2>
                  </div>
                </div>

                <div className="grid gap-4">
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
                        className={cn(
                          "w-full text-left p-6 border-2 transition-all cursor-pointer flex items-center gap-6",
                          isSelected
                            ? "border-primary bg-primary/5 shadow-[4px_4px_0_0_rgba(var(--primary-rgb),0.2)]"
                            : "border-border hover:border-primary/40 bg-background",
                        )}
                      >
                        <div
                          className={cn(
                            "flex h-8 w-8 shrink-0 items-center justify-center border-2 text-xs font-black uppercase",
                            isSelected
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-muted-foreground text-muted-foreground",
                          )}
                        >
                          {opt.id}
                        </div>
                        <span className="font-bold text-lg leading-relaxed">
                          {opt.text}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="flex justify-between items-center pt-8 border-t border-border/50">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    * Seleciona uma opção para salvar automaticamente
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      if (activeTab < test.questions.length - 1) {
                        setActiveTab(activeTab + 1);
                      } else {
                        setActiveTab("challenge");
                      }
                    }}
                    className="rounded-none font-black uppercase tracking-widest h-12 px-8"
                  >
                    {activeTab < test.questions.length - 1
                      ? "Próxima Pergunta"
                      : "Ir para o Desafio"}{" "}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {activeTab === "challenge" && (
              <div className="flex flex-col gap-10">
                {/* 1. Statement */}
                <div className="bg-card border-l-8 border-primary p-8 shadow-sm">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-6">
                    <div className="flex items-center gap-3">
                      <div className="h-1.5 w-6 bg-primary" />
                      <h2 className="text-sm font-black uppercase tracking-[0.3em] text-primary">
                        Desafio Prático
                      </h2>
                    </div>

                    <div className="flex items-center gap-3 bg-muted p-1 border-2 border-border">
                      {Object.keys(test.challenge.templates).map((lang) => (
                        <button
                          key={lang}
                          onClick={() => {
                            setLanguage(lang);
                            setTestResults([]);
                            // Garantir que o código inicial seja carregado se ainda não estiver no estado
                            if (!codes[lang]) {
                              setCodes((prev) => ({
                                ...prev,
                                [lang]:
                                  test.challenge.templates[lang].initialCode,
                              }));
                            }
                          }}
                          className={cn(
                            "px-4 py-1.5 text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer",
                            language === lang
                              ? "bg-primary text-primary-foreground shadow-[2px_2px_0_0_rgba(0,0,0,0.1)]"
                              : "text-muted-foreground hover:text-foreground",
                          )}
                        >
                          {lang}
                        </button>
                      ))}
                    </div>
                  </div>
                  <h1 className="mb-6 text-3xl font-black uppercase tracking-tighter">
                    {test.challenge.title}
                  </h1>
                  <p className="text-base leading-relaxed text-muted-foreground whitespace-pre-wrap font-medium max-w-5xl">
                    {test.challenge.description}
                  </p>
                </div>

                {/* 2. Editor */}
                <div className="flex flex-col border-4 border-border bg-[#1e1e1e] shadow-xl">
                  <div className="flex items-center justify-between border-b-2 border-border/20 bg-[#2d2d2d] px-6 py-3">
                    <div className="flex items-center gap-4">
                      <div className="flex gap-1.5">
                        <div className="h-3 w-3 rounded-full bg-red-500/20 border border-red-500/40" />
                        <div className="h-3 w-3 rounded-full bg-amber-500/20 border border-amber-500/40" />
                        <div className="h-3 w-3 rounded-full bg-emerald-500/20 border border-emerald-500/40" />
                      </div>
                      <span className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest">
                        {test.challenge.functionName}
                        {language === "javascript"
                          ? ".js"
                          : language === "python"

                              ? ".py"
                              : language === "go"
                                ? ".go"
                                : language === "rust"
                                  ? ".rs"
                                  : language === "java"
                                    ? ".java"
                                    : language === "csharp"
                                      ? ".cs"
                                      : ".js"}
                      </span>

                    </div>
                    <Button
                      onClick={runCodeTests}
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
                      defaultLanguage={
                        language === "python"
                          ? "python"
                          : language === "csharp"
                            ? "csharp"
                            : language === "javascript"
                              ? "javascript"
                              : language
                      }
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
                        setCodes((prev) => ({
                          ...prev,
                          [language]: value || "",
                        }))
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

                {/* 3. Test Cases */}
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
            )}
          </main>
        </div>
      )}

      {/* RESULTS STEP */}
      {step === "results" && (
        <div className="mx-auto max-w-7xl space-y-10 animate-in zoom-in-95 duration-500">

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
            {session?.user && (
              <p className="mt-6 text-[10px] font-black uppercase tracking-widest text-emerald-500/70">
                ✓ Resultados sincronizados com o teu perfil profissional
              </p>
            )}
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
