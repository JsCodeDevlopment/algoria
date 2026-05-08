export interface GithubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  topics: string[];
  stargazers_count: number;
}

export async function fetchGithubRepos(username: string): Promise<GithubRepo[]> {
  const cleanUsername = username.replace(/.*\//, ""); // extract username from URL if needed
  const res = await fetch(`https://api.github.com/users/${cleanUsername}/repos?sort=updated&per_page=15`, {
    headers: {
      Accept: "application/vnd.github.v3+json",
    },
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    throw new Error("Não foi possível encontrar o utilizador ou repositórios no GitHub.");
  }

  const data = await res.json();
  return data as GithubRepo[];
}
