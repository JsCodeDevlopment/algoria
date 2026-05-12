"use client";

import { getTechnicalTestTopics } from "@/lib/actions/admin";
import { TechnicalTest, QuizQuestion, TestSolution, CodeChallenge } from "@/lib/content/schemas";
import { useEffect, useState } from "react";
import { FormProps } from "../types";
import { ChallengeSection } from "./technical-test/challenge-section";
import { GeneralInfoSection } from "./technical-test/general-info-section";
import { QuizSection } from "./technical-test/quiz-section";
import { SolutionsSection } from "./technical-test/solutions-section";

const DEFAULT_JS_RUNNER = `
function runTests() {
  const results = [];
  try {
    // Exemplo de teste:
    // const out = suafuncao(input);
    // results.push({ id: 'tc1', passed: out === expected });
  } catch (e) { 
    results.push({ id: 'tc1', passed: false, error: e.message }); 
  }
  console.log(JSON.stringify(results));
}
runTests();
`;

function getDefaultState(jsRunner: string) {
  return {
    questions: [],
    challenge: {
      title: "",
      description: "",
      functionName: "",
      templates: {
        javascript: {
          initialCode: "// Escreve o teu código aqui",
          testRunner: jsRunner,
        },
      },
      testCases: [],
    },
    solutions: [],
  };
}

export function TechnicalTestForm({
  slug,
  setSlug,
  title,
  setTitle,
  body,
  setBody,
  meta,
  setMeta,
  mode,
}: FormProps) {
  // Estado local estruturado do simulado
  const [testData, setTestData] = useState<Partial<TechnicalTest>>(() => {
    try {
      const parsed = JSON.parse(body);
      return parsed && typeof parsed === "object"
        ? parsed
        : getDefaultState(DEFAULT_JS_RUNNER);
    } catch {
      return getDefaultState(DEFAULT_JS_RUNNER);
    }
  });

  const [existingTopics, setExistingTopics] = useState<string[]>([]);

  useEffect(() => {
    async function loadTopics() {
      const topics = await getTechnicalTestTopics();
      setExistingTopics(topics);
    }
    loadTopics();
  }, []);

  // Sincronizar estado local com o estado global do editor
  useEffect(() => {
    const updatedBody = JSON.stringify({
      ...testData,
      title,
      slug,
      track: meta.track,
      level: meta.level,
      difficulty: meta.difficulty,
      topic: meta.topic,
    }, null, 2);
    
    if (updatedBody !== body) {
      setBody(updatedBody);
    }
  }, [testData, title, slug, meta, setBody]);

  // --- HANDLERS ---
  
  const handleAddQuestion = () => {
    const newQuestion: QuizQuestion = {
      id: `q${(testData.questions?.length || 0) + 1}`,
      question: "",
      options: [
        { id: "a", text: "" },
        { id: "b", text: "" },
        { id: "c", text: "" },
        { id: "d", text: "" },
      ],
      correctOptionId: "a",
      explanation: "",
    };
    setTestData({ ...testData, questions: [...(testData.questions || []), newQuestion] });
  };

  const handleUpdateQuestion = (index: number, updates: Partial<QuizQuestion>) => {
    const questions = [...(testData.questions || [])];
    questions[index] = { ...questions[index], ...updates };
    setTestData({ ...testData, questions });
  };

  const handleRemoveQuestion = (index: number) => {
    const questions = [...(testData.questions || [])];
    questions.splice(index, 1);
    setTestData({ ...testData, questions });
  };

  const handleUpdateChallenge = (updates: Partial<CodeChallenge>) => {
    setTestData({
      ...testData,
      challenge: { ...testData.challenge!, ...updates }
    });
  };

  const handleAddSolution = () => {
    const newSol: TestSolution = {
      id: `sol${(testData.solutions?.length || 0) + 1}`,
      title: "",
      explanation: "",
      code: { javascript: "" }
    };
    setTestData({ ...testData, solutions: [...(testData.solutions || []), newSol] });
  };

  const handleUpdateSolution = (index: number, updates: Partial<TestSolution>) => {
    const sols = [...(testData.solutions || [])];
    sols[index] = { ...sols[index], ...updates };
    setTestData({ ...testData, solutions: sols });
  };

  const handleRemoveSolution = (index: number) => {
    const sols = [...(testData.solutions || [])];
    sols.splice(index, 1);
    setTestData({ ...testData, solutions: sols });
  };

  return (
    <div className="space-y-12 pb-24">
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 text-xs font-bold text-primary flex items-center gap-3">
        <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
        Modo de Edição Estruturada: Os campos abaixo são sincronizados automaticamente com o JSON do simulado.
      </div>

      <GeneralInfoSection
        title={title}
        setTitle={setTitle}
        slug={slug}
        setSlug={setSlug}
        meta={meta}
        setMeta={setMeta}
        timeLimitMinutes={testData.timeLimitMinutes || 30}
        setTimeLimitMinutes={(v) => setTestData({ ...testData, timeLimitMinutes: v })}
        description={testData.description || ""}
        setDescription={(v) => setTestData({ ...testData, description: v })}
        mode={mode}
        existingTopics={existingTopics}
      />

      <QuizSection
        questions={testData.questions || []}
        onAddQuestion={handleAddQuestion}
        onRemoveQuestion={handleRemoveQuestion}
        onUpdateQuestion={handleUpdateQuestion}
      />

      <ChallengeSection
        challenge={testData.challenge as CodeChallenge}
        onChange={handleUpdateChallenge}
      />

      <SolutionsSection
        solutions={testData.solutions || []}
        onAddSolution={handleAddSolution}
        onRemoveSolution={handleRemoveSolution}
        onUpdateSolution={handleUpdateSolution}
        enabledLanguages={Object.keys(testData.challenge?.templates || {})}
      />
    </div>
  );
}
