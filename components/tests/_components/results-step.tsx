import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { TechnicalTest } from "@/lib/content/schemas";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface Props {
  test: TechnicalTest;
  quizScore: number;
  allTestsPassed: boolean;
  answers: Record<string, string>;
  session: typeof authClient.$Infer.Session | null | undefined;
}

export function ResultsStep({
  test,
  quizScore,
  allTestsPassed,
  answers,
  session,
}: Props) {
  return (
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

        {test.solutions && test.solutions.length > 0 && (
          <div className="mt-10">
            <Button 
              variant="outline" 
              onClick={() => document.getElementById('resolutions-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="rounded-none border-primary text-primary font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all"
            >
              Explorar Resoluções Oficiais
            </Button>
          </div>
        )}

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
                    {q.options.find((o) => o.id === q.correctOptionId)?.text}
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

      {/* RESOLUTIONS SECTION */}
      {test.solutions && test.solutions.length > 0 && (
        <div id="resolutions-section" className="space-y-8 pt-10 border-t-2 border-border">
          <h3 className="text-xl font-black uppercase tracking-widest text-primary">
            Resoluções Sugeridas (Prática)
          </h3>
          <div className="grid gap-10">
            {test.solutions.map((sol) => (
              <div key={sol.id} className="border-2 border-primary/20 bg-background overflow-hidden">
                <div className="bg-primary/5 p-6 border-b-2 border-primary/10">
                  <h4 className="text-lg font-black uppercase tracking-tight mb-2">
                    {sol.title}
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {sol.explanation}
                  </p>
                </div>
                
                <div className="p-6 space-y-4">
                  {Object.entries(sol.code).map(([lang, code]) => (
                    <div key={lang} className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-primary" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                          {lang}
                        </span>
                      </div>
                      <pre className="p-4 bg-muted/50 border border-border text-xs font-mono overflow-x-auto leading-relaxed">
                        <code>{code}</code>
                      </pre>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-center pt-8">
        <Button
          asChild
          className="rounded-none font-black uppercase tracking-widest h-14 px-12"
        >
          <Link href="/tests">Voltar ao Menu de Testes</Link>
        </Button>
      </div>
    </div>
  );
}
