"use client";

import { getTechnicalTestTopics } from "@/lib/actions/admin";
import { TechnicalTest, QuizQuestion, TestSolution, CodeChallenge } from "@/lib/content/schemas";
import { useEffect, useState } from "react";
import { FormProps } from "../types";
import { ChallengeSection } from "./technical-test/challenge-section";
import { GeneralInfoSection } from "./technical-test/general-info-section";
import { QuizSection } from "./technical-test/quiz-section";
import { SolutionsSection } from "./technical-test/solutions-section";
import { FileJson, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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
  const [importJson, setImportJson] = useState("");
  const [isImportOpen, setIsImportOpen] = useState(false);

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

  const handleImportJson = () => {
    try {
      const parsed = JSON.parse(importJson);
      if (typeof parsed !== 'object' || parsed === null) throw new Error();

      // Atualizar metadados globais (o useEffect cuidará do setBody)
      if (parsed.title) setTitle(parsed.title);
      if (parsed.slug) setSlug(parsed.slug);
      
      setMeta({
        ...meta,
        track: parsed.track || meta.track,
        level: parsed.level || meta.level,
        difficulty: parsed.difficulty || meta.difficulty,
        topic: parsed.topic || meta.topic,
      });

      // Atualizar dados estruturados
      setTestData({
        ...testData,
        ...parsed,
        // Garantir que não sobrescrevemos campos que o editor controla separadamente se quisermos
      });

      setIsImportOpen(false);
      setImportJson("");
    } catch (err) {
      alert("Erro ao importar JSON. Verifica se o formato é válido.");
      console.error(err);
    }
  };

  const handleExportJson = () => {
    const dataStr = JSON.stringify(testData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `${slug || 'technical-test'}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };
  
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
      <div className="flex items-center justify-between">
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 text-xs font-bold text-primary flex items-center gap-3 flex-1">
          <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
          Modo de Edição Estruturada: Os campos abaixo são sincronizados automaticamente com o JSON do simulado.
        </div>
        
        <Dialog open={isImportOpen} onOpenChange={setIsImportOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="ml-4 rounded-none gap-2 text-xs font-black uppercase border-2 h-12">
              <FileJson className="h-4 w-4" /> Importar JSON
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl bg-background border-2 border-border rounded-none">
            <DialogHeader>
              <DialogTitle className="text-xl font-black uppercase tracking-tighter">Importar Definição JSON</DialogTitle>
              <DialogDescription className="text-xs uppercase font-bold tracking-widest text-muted-foreground">
                Cola o JSON completo do teste abaixo para preencher os campos automaticamente.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <textarea
                value={importJson}
                onChange={(e) => setImportJson(e.target.value)}
                placeholder='{"title": "Novo Teste", ...}'
                rows={12}
                className="w-full bg-[#080808] text-emerald-400 p-4 font-mono text-xs rounded-none border-2 border-border focus:border-primary outline-none"
              />
            </div>
            <DialogFooter>
              <Button 
                onClick={handleImportJson}
                className="rounded-none font-black uppercase tracking-widest w-full h-12"
              >
                Confirmar Importação e Sincronizar
              </Button>
            </DialogFooter>
            </DialogContent>
          </Dialog>

          <Button 
            variant="outline" 
            onClick={handleExportJson}
            className="rounded-none gap-2 text-xs font-black uppercase border-2 h-12"
          >
            <Download className="h-4 w-4" /> Exportar JSON
          </Button>
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
