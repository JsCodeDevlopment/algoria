"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { createContent, updateContent } from "@/lib/actions/admin";
import { SaveActions } from "./_components/form-elements";
import { InterviewEnForm } from "./_components/forms/interview-en-form";
import { EngineeringWorkForm } from "./_components/forms/engineering-work-form";
import { ProblemForm } from "./_components/forms/problem-form";
import { ConceptForm } from "./_components/forms/concept-form";
import { GenericForm } from "./_components/forms/generic-form";
import { ContentEditorProps, FormProps, DEFAULT_META } from "./_components/types";

export function ContentEditor({ mode, initialData }: ContentEditorProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    msg: string;
  } | null>(null);

  const contentType = initialData?.type ?? "problem";
  const [slug, setSlug] = useState(initialData?.slug ?? "");
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [body, setBody] = useState(initialData?.body ?? "");
  const [meta, setMeta] = useState<Record<string, any>>(
    initialData?.metadata && Object.keys(initialData.metadata).length > 0
      ? (initialData.metadata as Record<string, any>)
      : (DEFAULT_META[contentType] ?? {}),
  );

  function showFeedback(t: "success" | "error", msg: string) {
    setFeedback({ type: t, msg });
    setTimeout(() => setFeedback(null), 5000);
  }

  function handleSave(publish: boolean) {
    if (!slug.trim() || !title.trim()) {
      showFeedback("error", "Slug e título são obrigatórios");
      return;
    }

    startTransition(async () => {
      let result;
      if (mode === "edit" && initialData?.id) {
        result = await updateContent(initialData.id, {
          title: title.trim(),
          body,
          metadata: meta,
          publish,
        });
      } else {
        result = await createContent({
          slug: slug.trim(),
          type: contentType as never,
          title: title.trim(),
          body,
          metadata: meta,
          publish,
        });
      }

      if (result.error) {
        showFeedback("error", result.error);
      } else {
        showFeedback(
          "success",
          publish ? "Conteúdo publicado!" : "Rascunho salvo!",
        );
        if (mode === "create" && "id" in result && result.id) {
          router.push(`/admin/content/${result.id}/review`);
        } else {
          router.refresh();
        }
      }
    });
  }

  const formProps: FormProps = {
    slug,
    setSlug,
    title,
    setTitle,
    body,
    setBody,
    meta,
    setMeta,
    mode,
  };

  function renderForm() {
    switch (contentType) {
      case "interview-en":
        return <InterviewEnForm {...formProps} />;
      case "engineering-work":
        return <EngineeringWorkForm {...formProps} />;
      case "problem":
        return <ProblemForm {...formProps} />;
      case "concept":
        return <ConceptForm {...formProps} />;
      default:
        return <GenericForm {...formProps} contentType={contentType} />;
    }
  }

  return (
    <div className="space-y-6">
      {/* Feedback */}
      {feedback && (
        <div
          className={`rounded-lg px-4 py-3 text-sm font-medium ${
            feedback.type === "success"
              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
              : "bg-destructive/10 text-destructive"
          }`}
        >
          {feedback.msg}
        </div>
      )}

      {/* Type-specific form */}
      {renderForm()}

      {/* Actions */}
      <SaveActions
        isPending={isPending}
        onSave={handleSave}
        onCancel={() => router.push("/admin/content")}
      />
    </div>
  );
}
