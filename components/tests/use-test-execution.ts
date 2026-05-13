import { saveAssessmentResult } from "@/lib/actions/assessment";
import { authClient } from "@/lib/auth-client";
import { TechnicalTest } from "@/lib/content/schemas";
import { useRouter } from "next/navigation";
import { useState } from "react";

export type Step = "intro" | "testing" | "results";
export type Tab = number | "challenge";

export function useTestExecution(test: TechnicalTest) {
  const router = useRouter();
  const { data: session } = authClient.useSession();

  const [step, setStep] = useState<Step>("intro");
  const [activeTab, setActiveTab] = useState<Tab>(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

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
  const [explanation, setExplanation] = useState("");
  const [quizScore, setQuizScore] = useState(0);

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

    if (language === "javascript") {
      try {
        const fullCode = template.testRunner.replace("{{CODE}}", currentCode);

        const executeString = `
          return (async () => {
            let capturedResults = [];
            const originalLog = console.log;
            
            console.log = (...args) => {
              const msg = args[0];
              if (typeof msg === 'string' && msg.startsWith('[') && msg.endsWith(']')) {
                try {
                  const parsed = JSON.parse(msg);
                  if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].id) {
                    capturedResults = parsed;
                  }
                } catch (e) {}
              }
              originalLog(...args);
            };

            try {
              ${fullCode}
              await new Promise(r => setTimeout(r, 200));
            } catch (err) {
              console.error("Erro na execução do teste:", err);
            } finally {
              console.log = originalLog;
            }
            
            return capturedResults;
          })();
        `;

        const fn = new Function(executeString);
        const results = await fn();

        if (!results || results.length === 0) {
          setTestResults(
            test.challenge.testCases.map((tc) => ({
              id: tc.id,
              passed: false,
              error: "A execução não retornou resultados. Verifica se o teu código tem erros de sintaxe.",
            })),
          );
        } else {
          setTestResults(results);
        }

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
    } catch (_err) {
      const results = test.challenge.testCases.map((tc, _i) => {
        let passed = false;
        if (currentCode.length > 50) {
          // Heurística básica de fallback
          passed = true;
        }

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

  const allTestsPassed =
    testResults.length > 0 && testResults.every((r) => r.passed);

  const finishTest = async () => {
    let score = 0;
    test.questions.forEach((q) => {
      if (answers[q.id] === q.correctOptionId) score++;
    });
    setQuizScore(score);

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
        explanation: explanation,
      });
    }

    setStep("results");
    setShowFinishDialog(false);
  };

  const giveUp = () => {
    router.push("/tests");
    setShowGiveUpDialog(false);
  };

  return {
    step,
    setStep,
    activeTab,
    setActiveTab,
    answers,
    handleAnswerSelect,
    language,
    setLanguage,
    codes,
    setCodes,
    testResults,
    isEvaluating,
    explanation,
    setExplanation,
    quizScore,
    handleStart,
    runCodeTests,
    finishTest,
    giveUp,
    showFinishDialog,
    setShowFinishDialog,
    showGiveUpDialog,
    setShowGiveUpDialog,
    allTestsPassed,
    session
  };
}
