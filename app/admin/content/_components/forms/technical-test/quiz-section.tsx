"use client";

import { QuizQuestion } from "@/lib/content/schemas";
import { Beaker, Plus, Trash2 } from "lucide-react";
import { TextInput } from "../../form-elements";

interface QuizSectionProps {
  questions: QuizQuestion[];
  onAddQuestion: () => void;
  onRemoveQuestion: (index: number) => void;
  onUpdateQuestion: (index: number, updates: Partial<QuizQuestion>) => void;
}

export function QuizSection({
  questions,
  onAddQuestion,
  onRemoveQuestion,
  onUpdateQuestion,
}: QuizSectionProps) {
  return (
    <section className="space-y-6 rounded-2xl border border-border bg-card/30 p-8">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-black uppercase tracking-tighter flex items-center gap-2">
          <Beaker className="h-5 w-5 text-primary" /> Questões Teóricas
        </h3>
        <button
          type="button"
          onClick={onAddQuestion}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-xs font-bold rounded-lg hover:bg-primary/90 transition-all"
        >
          <Plus className="h-4 w-4" /> Adicionar Pergunta
        </button>
      </div>

      <div className="space-y-6">
        {questions.map((q, qIndex) => (
          <div
            key={q.id}
            className="p-6 border border-border bg-background rounded-xl relative group"
          >
            <button
              type="button"
              onClick={() => onRemoveQuestion(qIndex)}
              className="absolute right-4 top-4 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-all"
            >
              <Trash2 className="h-4 w-4" />
            </button>

            <div className="space-y-4">
              <TextInput
                value={q.question}
                onChange={(v) => onUpdateQuestion(qIndex, { question: v })}
                placeholder="Enunciado da questão..."
              />
              <div className="grid gap-3">
                {q.options.map((opt) => (
                  <div key={opt.id} className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        onUpdateQuestion(qIndex, { correctOptionId: opt.id })
                      }
                      className={`h-8 w-8 rounded-lg border-2 flex items-center justify-center text-xs font-black transition-all ${
                        q.correctOptionId === opt.id
                          ? "bg-emerald-500 border-emerald-500 text-white"
                          : "border-border text-muted-foreground hover:border-primary/50"
                      }`}
                    >
                      {opt.id.toUpperCase()}
                    </button>
                    <TextInput
                      value={opt.text}
                      onChange={(v) => {
                        const options = [...q.options];
                        const idx = options.findIndex((o) => o.id === opt.id);
                        options[idx] = { ...options[idx], text: v };
                        onUpdateQuestion(qIndex, { options });
                      }}
                      placeholder={`Alternativa ${opt.id.toUpperCase()}...`}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
        
        {questions.length === 0 && (
          <div className="py-12 border-2 border-dashed border-border rounded-xl text-center text-sm text-muted-foreground">
            Nenhuma questão teórica adicionada.
          </div>
        )}
      </div>
    </section>
  );
}
