import { Pagination } from "@/components/explorer/pagination";
import { SearchBar } from "@/components/explorer/search-bar";
import { TechFilter } from "@/components/explorer/tech-filter";
import { UserCard } from "@/components/explorer/user-card";
import { Badge } from "@/components/ui/badge";
import { db } from "@/lib/db";
import { user, userProfile } from "@/lib/db/schema";
import { buildPublicMetadata } from "@/lib/seo/build-metadata";
import { and, eq, ilike, or, sql } from "drizzle-orm";
import { Filter, Users } from "lucide-react";

interface ExplorerPageProps {
  searchParams: Promise<{
    q?: string;
    tech?: string;
    page?: string;
  }>;
}

export const metadata = buildPublicMetadata({
  title: "Explorar Desenvolvedores",
  description:
    "Encontra outros desenvolvedores na Acite, filtra por tecnologias e descobre perfis profissionais.",
  pathname: "/explorer",
});

const ITEMS_PER_PAGE = 12;

export default async function ExplorerPage({
  searchParams,
}: ExplorerPageProps) {
  const params = await searchParams;
  const query = params.q || "";
  const techFilters = params.tech?.split(",").filter(Boolean) || [];
  const currentPage = Number(params.page) || 1;
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  const conditions = [];
  if (query) {
    conditions.push(
      or(
        ilike(user.name, `%${query}%`),
        ilike(userProfile.headline, `%${query}%`),
      ),
    );
  }

  if (techFilters.length > 0) {
    techFilters.forEach((tech) => {
      conditions.push(
        sql`${userProfile.technologies} @> ARRAY[${tech}]::text[]`,
      );
    });
  }

  const [countResult] = await db
    .select({ count: sql<number>`cast(count(*) as int)` })
    .from(user)
    .leftJoin(userProfile, eq(user.id, userProfile.userId))
    .where(and(...conditions));

  const totalUsers = countResult?.count || 0;
  const totalPages = Math.ceil(totalUsers / ITEMS_PER_PAGE);

  const users = await db
    .select({
      id: user.id,
      name: user.name,
      image: user.image,
      headline: userProfile.headline,
      technologies: userProfile.technologies,
      experiences: userProfile.experiences,
    })
    .from(user)
    .leftJoin(userProfile, eq(user.id, userProfile.userId))
    .where(and(...conditions))
    .limit(ITEMS_PER_PAGE)
    .offset(offset)
    .orderBy(query || techFilters.length > 0 ? user.name : sql`RANDOM()`);

  return (
    <div className="relative flex-1 bg-grid-pattern pb-20">
      <div className="relative z-10 mx-auto max-w-7xl px-6 py-12 md:py-20">
        <header className="mb-16 border-l-4 border-primary pl-8">
          <Badge
            variant="secondary"
            className="mb-4 rounded-none bg-primary/10 px-1.5 py-0 font-mono text-[10px] uppercase text-primary"
          >
            Comunidade Acite
          </Badge>
          <h1 className="mb-4 text-4xl font-black uppercase tracking-tighter md:text-6xl">
            Explorar Talentos
          </h1>
          <p className="max-w-2xl text-lg leading-relaxed tracking-tight text-muted-foreground">
            Conecta-te com outros engenheiros da plataforma. Filtra por stack tecnológica,
            percurso profissional ou procura diretamente por nomes e especialidades.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          <aside className="lg:col-span-1 space-y-10">
            <div className="p-6 border-2 border-border bg-background/40 backdrop-blur-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-2 opacity-5 pointer-events-none">
                <Filter size={40} />
              </div>
              <TechFilter />
            </div>

            <div className="p-6 border-l-2 border-primary/20 bg-muted/5">
              <h5 className="text-[10px] font-black uppercase tracking-widest text-foreground mb-2">
                Estatísticas
              </h5>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-primary">
                  {totalUsers}
                </span>
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                  Utilizadores Encontrados
                </span>
              </div>
            </div>
          </aside>

          <main className="lg:col-span-3 space-y-10">
            <SearchBar />

            {users.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {users.map((u) => (
                    <UserCard key={u.id} user={u} />
                  ))}
                </div>
                <Pagination currentPage={currentPage} totalPages={totalPages} />
              </>
            ) : (
              <div className="py-20 border-2 border-dashed border-border bg-muted/5 flex flex-col items-center justify-center text-center px-6">
                <div className="h-16 w-16 border-2 border-border rounded-none flex items-center justify-center text-muted-foreground/30 mb-6">
                  <Users size={32} />
                </div>
                <h3 className="text-xl font-black uppercase tracking-tight text-foreground mb-2">
                  Nenhum utilizador encontrado
                </h3>
                <p className="text-sm text-muted-foreground max-w-xs">
                  Tenta ajustar os teus filtros ou limpar a pesquisa para ver
                  mais resultados.
                </p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
