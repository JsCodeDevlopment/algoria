"use server";

import { fetchGithubRepos } from "@/lib/github";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function getGithubProjectsAction(githubUrl: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) throw new Error("Não autenticado");

  const username = githubUrl.split("/").pop();
  if (!username) throw new Error("URL do GitHub inválido");

  try {
    const repos = await fetchGithubRepos(username);
    return repos.map(repo => ({
      title: repo.name,
      description: repo.description || "",
      deployUrl: repo.homepage || "",
      githubUrl: repo.html_url,
      technologies: Array.from(new Set([
        ...(repo.language ? [repo.language] : []),
        ...(repo.topics || [])
      ])),
      imageUrl: "",
    }));
  } catch (err) {
    const error = err as Error;
    throw new Error(error.message || "Erro ao importar do GitHub");
  }
}
