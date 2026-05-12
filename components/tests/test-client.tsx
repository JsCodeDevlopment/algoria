"use client";

import { TechnicalTest } from "@/lib/content/schemas";
import { ChallengeView } from "./_components/challenge-view";
import { IntroStep } from "./_components/intro-step";
import { TestNavigation } from "./_components/navigation";
import { QuestionView } from "./_components/question-view";
import { ResultsStep } from "./_components/results-step";
import { TestDialogs } from "./_components/test-dialogs";
import { useTestExecution } from "./use-test-execution";

interface Props {
  test: TechnicalTest;
}

export function TestClient({ test }: Props) {
  const {
    step,
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
    session,
  } = useTestExecution(test);

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 md:py-24">
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

      {step === "intro" && (
        <IntroStep test={test} onStart={handleStart} session={session} />
      )}

      {step === "testing" && (
        <div className="flex flex-col gap-8 animate-in fade-in">
          <TestNavigation
            questions={test.questions}
            answers={answers}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            allTestsPassed={allTestsPassed}
            onGiveUp={() => setShowGiveUpDialog(true)}
            onFinish={() => setShowFinishDialog(true)}
          />

          <main className="flex-1 min-w-0">
            {typeof activeTab === "number" ? (
              <QuestionView
                question={test.questions[activeTab]}
                index={activeTab}
                total={test.questions.length}
                selectedOptionId={answers[test.questions[activeTab].id]}
                onSelect={(optId) =>
                  handleAnswerSelect(test.questions[activeTab].id, optId)
                }
                onNext={() => {
                  if (activeTab < test.questions.length - 1) {
                    setActiveTab(activeTab + 1);
                  } else {
                    setActiveTab("challenge");
                  }
                }}
              />
            ) : (
              <ChallengeView
                test={test}
                language={language}
                setLanguage={setLanguage}
                codes={codes}
                setCodes={setCodes}
                explanation={explanation}
                setExplanation={setExplanation}
                isEvaluating={isEvaluating}
                onRunTests={runCodeTests}
                testResults={testResults}
              />
            )}
          </main>
        </div>
      )}

      {step === "results" && (
        <ResultsStep
          test={test}
          quizScore={quizScore}
          allTestsPassed={allTestsPassed}
          answers={answers}
          session={session}
        />
      )}

      {/* MODALS */}
      <TestDialogs
        showFinishDialog={showFinishDialog}
        setShowFinishDialog={setShowFinishDialog}
        showGiveUpDialog={showGiveUpDialog}
        setShowGiveUpDialog={setShowGiveUpDialog}
        onFinish={finishTest}
        onGiveUp={giveUp}
      />
    </div>
  );
}
