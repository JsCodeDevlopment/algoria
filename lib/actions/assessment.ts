"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { technicalAssessmentResults } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export async function saveAssessmentResult(data: {
  testSlug: string;
  testTitle: string;
  track: string;
  level: string;
  language: string;
  quizScore: number;
  totalQuestions: number;
  codePassed: boolean;
  resolutionCode: string;
}) {

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return { error: "Não autenticado" };
  }

  try {
    // Verificar se já existe um resultado para este teste e usuário
    // Podemos optar por atualizar ou criar um novo. O usuário quer ver o progresso, 
    // talvez salvar múltiplos seja melhor, mas por agora vamos manter o mais recente ou permitir múltiplos.
    // Para simplificar e evitar duplicatas visuais chatas, vamos atualizar se já existir o mesmo slug.

    const existing = await db
      .select()
      .from(technicalAssessmentResults)
      .where(
        and(
          eq(technicalAssessmentResults.userId, session.user.id),
          eq(technicalAssessmentResults.testSlug, data.testSlug)
        )
      )
      .limit(1);

    if (existing.length > 0) {
      await db
        .update(technicalAssessmentResults)
        .set({
          ...data,
          completedAt: new Date(),
        })
        .where(eq(technicalAssessmentResults.id, existing[0].id));
    } else {
      await db.insert(technicalAssessmentResults).values({
        id: crypto.randomUUID(),
        userId: session.user.id,
        ...data,
        completedAt: new Date(),
      });
    }

    revalidatePath("/profile");
    return { success: true };
  } catch (error) {
    console.error("Erro ao salvar resultado do assessment:", error);
    return { error: "Erro interno ao salvar resultado" };
  }
}

export async function toggleAssessmentPublicVisibility(testSlug: string, isPublic: boolean) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return { error: "Não autenticado" };
  }

  try {
    await db
      .update(technicalAssessmentResults)
      .set({ isPublic })
      .where(
        and(
          eq(technicalAssessmentResults.userId, session.user.id),
          eq(technicalAssessmentResults.testSlug, testSlug)
        )
      );

    revalidatePath("/profile");
    return { success: true };
  } catch (error) {
    console.error("Erro ao alterar visibilidade do assessment:", error);
    return { error: "Erro interno" };
  }
}

export async function getUserAssessmentResults(userId: string, onlyPublic: boolean = false) {
  try {
    const query = db
      .select()
      .from(technicalAssessmentResults)
      .where(
        onlyPublic
          ? and(
            eq(technicalAssessmentResults.userId, userId),
            eq(technicalAssessmentResults.isPublic, true)
          )
          : eq(technicalAssessmentResults.userId, userId)
      );

    return await query;
  } catch (error) {
    console.error("Erro ao buscar resultados do assessment:", error);
    return [];
  }
}
