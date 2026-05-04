import Link from 'next/link';
import type { Metadata } from 'next';

import { buildPublicMetadata } from '@/lib/seo/build-metadata';
import {
  ArrowRight,
  BookOpen,
  Briefcase,
  ChevronDown,
  CloudCog,
  Code,
  GitBranch,
  GraduationCap,
  Layers,
  LineChart,
  MonitorSmartphone,
  Search,
  Server,
  Shield,
  Sparkles,
  Target,
  Terminal,
  Trophy,
  TrendingUp,
  Users,
  Gauge,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DifficultyBadge } from '@/components/catalog/difficulty-badge';
import { sortCatalogProblems } from '@/lib/catalog/problem-filters';
import { getAllConcepts, getAllProblems } from '@/lib/content/loader';
import { Spotlight } from '@/components/ui/spotlight';
import { BackgroundBeams } from '@/components/ui/background-beams';
import { SparklesCore } from '@/components/ui/sparkles';
import { FlipWords } from '@/components/ui/flip-words';

export const metadata: Metadata = buildPublicMetadata({
  titleAbsolute:
    'Algoria — catálogo interativo, code player linha-a-linha e curso guiado para algoritmos e entrevistas',
  description:
    'Entende problemas clássicos ao ler código linha-a-linha, prepara-te para testes técnicos de vagas com o mesmo método de leitura e regista roadmap de engenharia aplicada à produção — front-end, backend e DevOps.',
  pathname: '/',
  keywords: [
    'Algoria',
    'algoritmos',
    'estruturas de dados',
    'LeetCode',
    'preparação entrevistas tech',
    'code review educativo',
    'big O',
    'curso algoritmos',
    'fundamentos programação',
    'live coding',
    'system design',
    'engenharia de software',
  ],
});

export default async function HomePage() {
  const [problems, concepts] = await Promise.all([getAllProblems(), getAllConcepts()]);
  const indexed = problems.map((p) => ({
    problem: p,
    title: p.meta.title,
    difficulty: p.meta.difficulty,
    recommendedOrder: p.meta.recommendedOrder,
  }));
  const featured = sortCatalogProblems(indexed, 'recommended').slice(0, 3).map((x) => x.problem);
  const totalSolutions = problems.reduce((acc, p) => acc + p.solutions.length, 0);

  return (
    <div className="relative">
      <div className="relative overflow-hidden border-b border-border">
        {/* ── Background Effects (Hero Only) ── */}
        <div className="absolute top-0 left-0 h-full w-full pointer-events-none -z-10 bg-grid-pattern opacity-10 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_70%)]" />
        <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="white" />
        <BackgroundBeams className="-z-10" />
        <SparklesCore
          background="transparent"
          minSize={0.4}
          maxSize={1.2}
          particleDensity={40}
          className="w-full h-full -z-10"
          particleColor="#4f46e5"
        />

        <div className="pointer-events-none absolute top-0 left-1/2 z-0 w-full max-w-[1400px] -translate-x-1/2 overflow-hidden opacity-25 md:opacity-30">
          <div className="absolute top-[-140px] left-[-40px] h-[460px] w-[460px] rotate-45 border border-primary/25" />
          <div className="absolute top-[80px] right-[-80px] h-[380px] w-[380px] -rotate-6 border border-primary/15" />
        </div>

        {/* ── Hero ── */}
        <section className="relative z-10 mx-auto max-w-7xl px-6 pt-20 pb-16 md:pt-28 md:pb-24">
          <div className="animate-in flex max-w-4xl flex-col items-start gap-8">
            <div className="flex flex-wrap items-center gap-3">
              <Badge
                variant="outline"
                className="rounded-none border-primary/35 bg-primary/5 px-3 py-1 font-mono text-[10px] text-primary"
              >
                Plataforma de estudo técnico
              </Badge>
              <span className="text-[11px] font-bold uppercase tracking-[0.35em] text-muted-foreground">
                Problemas · Code player · Curso modular
              </span>
            </div>
            <h1 className="text-5xl font-black uppercase leading-[0.92] tracking-tighter md:text-8xl md:leading-[0.9]">
              Lê código com intenção. <br className="hidden sm:block" />
              Entende o <FlipWords words={['algoritmo', 'padrão', 'sistema', 'desafio']} />
            </h1>
            <p className="border-l-[3px] border-primary/35 pl-6 text-lg leading-relaxed text-muted-foreground md:text-xl md:leading-relaxed">
              A Algoria é um ambiente só para estudar decisões algorítmicas: mesmo exercício pode ter brute-force ao lado da
              versão melhor, todas as linhas comentadas em <strong className="text-foreground font-semibold">três níveis</strong>{' '}
              (resumo, detalhado, deep dive) e um{' '}
              <strong className="text-foreground font-semibold">curso de fundamentos guiado</strong> com avaliações e um
              certificado por capítulo gravado só no teu browser.
            </p>
            <div className="flex w-full flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
              <Button asChild size="xl" className="rounded-none px-10 font-bold uppercase tracking-wider">
                <Link href="/problems">
                  Abrir catálogo completo <ArrowRight className="ml-2 h-5 w-5" aria-hidden />
                </Link>
              </Button>
              <Button asChild variant="outline" size="xl" className="rounded-none border-2 px-8 font-bold uppercase tracking-wider">
                <Link href="/course/fundamentos-fase-1">Curso de fundamentos guiado</Link>
              </Button>
              <Button asChild variant="ghost" size="xl" className="rounded-none font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground">
                <Link href="/concepts">
                  Conceitos rápidos
                  <Sparkles className="ml-2 h-4 w-4 opacity-70" aria-hidden />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* ── Métricas reais ── */}
        <section aria-label="Escala do catálogo" className="relative z-10 border-t border-border bg-muted/40">
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-0 md:grid-cols-4">
            <Metric label="Problem sets" value={String(problems.length)} hint="Temas típicos de entrevista" />
            <Metric label="Soluções lado a lado" value={String(totalSolutions)} hint="Por problema: compare abordagens" />
            <Metric label="Mini-aulas" value={String(concepts.length)} hint="Concepts + texto longo reusável pelo player e curso" />
            <Metric label="Certificados modular" value="8" hint="No curso fundamentos • local" />
          </div>
        </section>
      </div>

      {/* ── O que é ── */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 py-20 md:py-28">
        <SectionHeading
          kicker="O que faz a plataforma"
          title="Três lugares diferentes, um mesmo objetivo: clareza"
          subtitle="Escolhes o formato conforme estado de espírito — catálogo aberto para mergulhos profundos ou curso com ordem e provas."
        />
        <div className="mt-14 grid gap-0 border border-border md:grid-cols-3">
          <PlatformArm
            icon={<Layers className="h-8 w-8" />}
            title="Catálogo de problemas"
            bullets={[
              'Cada problema com enunciado, tags e duração orientativa.',
              'Várias soluções (brute-force, óptima, alternativa) quando existir.',
              'Entrada directa nas soluções e no modo leitura do código.',
            ]}
            ctaHref="/problems"
            ctaLabel="Ver problemas"
          />
          <PlatformArm
            icon={<Terminal className="h-8 w-8" />}
            title="Code player linha-a-linha"
            bullets={[
              'Destaque por linha com explicação em markdown.',
              'Três abas por linha: resumo rápido, passo-a-paso, trade-offs.',
              'Ligação directa aos conceitos (Big O, two pointers...) quando faz sentido.',
            ]}
            ctaHref="/problems/two-sum"
            ctaLabel="Exemplo rápido: Two Sum"
          />
          <PlatformArm
            icon={<GraduationCap className="h-8 w-8" />}
            title="Curso + fundamentos"
            bullets={[
              'Trilho ordenado com desbloqueio progressivo.',
              'Exemplos com separador simples vs profundo e perguntas de fixação.',
              'Certificado por capítulo só no teu navegador após a prova.',
            ]}
            ctaHref="/course/fundamentos-fase-1"
            ctaLabel="Abrir programa do curso"
          />
        </div>
      </section>

      {/* ── Como funciona ── */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 pb-20 md:pb-28">
        <SectionHeading
          kicker="Processo típico"
          title="Como usar em quatro movimentos"
          subtitle="Não há lição secreta atrás da paywall técnico: primeiro lê bem o problema, só depois vês o código já resolvido e comentado."
        />
        <div className="mt-14 grid gap-px border border-border bg-border md:grid-cols-2 lg:grid-cols-4">
          <Step n={1} title="Escolhe o problema" text="Filtra por dificuldade ou segue ordem recomendada no catálogo." />
          <Step n={2} title="Lê a solução comentada" text="Percorre o player: cada linha explica porque existe e onde encaixa no algoritmo global." />
          <Step n={3} title="Compara quando houver várias versões" text="Saltar brutal para óptima mostra onde a complexidade tempo/espaço muda mesmo." />
          <Step n={4} title="Ou segue o curso guiado" text="Mesmos temas estruturados com provas e reconhecimento local por capítulo." />
        </div>
      </section>

      {/* ── Para quem ── */}
      <section className="relative z-10 border-t border-border bg-muted/25 py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeading
            kicker="Público"
            title="Feito pensando nestas pessoas"
            subtitle="Se estás cansado de acumular submits sem entender a ideia estrutural, isto mantém o foco na leitura crítica do código."
          />
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            <AudienceCard
              icon={<Users className="h-6 w-6" />}
              title="Preparação a entrevistas"
              text="Dominar o raciocínio verbal da solução (não só entregar um ficheiro): ideal para repetir cenários até fixar."
            />
            <AudienceCard
              icon={<LineChart className="h-6 w-6" />}
              title="Autodidata que já fez listas"
              text="Já tens a brute e queres ver exactamente porque a segunda abordagem deixa de repetir trabalho quadrático onde já não faz falta."
            />
            <AudienceCard
              icon={<Target className="h-6 w-6" />}
              title="Professor ou mentor rápido"
              text="Partilhar os mesmos excertos comentados poupa tempo em pormenores de sintaxe e liberta tempo para invariantes e complexidade."
            />
          </div>
        </div>
      </section>

      {/* ── Pilares (grid clássica) ── */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 py-20 md:py-28">
        <SectionHeading
          kicker="Diferenciação"
          title="Pilares pedagógicos explícitos"
          subtitle="Isto não é substituto de escreveres código sozinho no editor — complementa esse treino com narrações profundamente técnicas do que já funcionou bem."
        />
        <div className="mt-14 grid gap-0 border border-border md:grid-cols-3">
          <Feature
            icon={<GitBranch className="h-6 w-6" />}
            title="Confrontar soluções"
            description="Vê lado a lado força bruta e versão ótima sempre que disponível: percebes onde aparece hashing, ponteiros ou janela deslizante."
          />
          <Feature
            icon={<BookOpen className="h-6 w-6" />}
            title="Três níveis por linha"
            description="Resumo para navegar rápido, detalhado para segurar o modelo mental, deep dive quando queres invariantes ou complexidade amortizada honesta."
          />
          <Feature
            icon={<Code className="h-6 w-6" />}
            title="Código canónico"
            description="Sobretudo TypeScript legível: a ideia vem sempre antes dos pormenores de sintaxe de uma língua em particular."
          />
          <Feature
            icon={<Trophy className="h-6 w-6" />}
            title="Curso modular local"
            description="Mesmos fundamentos ordenados por capítulo, exercícios, provas e certificado apenas no teu dispositivo após avaliações."
          />
          <Feature
            icon={<Sparkles className="h-6 w-6" />}
            title="Ligações contextuais"
            description='As explicações puxam fichas tipo "big-o" só quando esse trecho mesmo depende aquela ferramenta — menos dispersão irrelevante.'
          />
          <Feature
            icon={<Terminal className="h-6 w-6" />}
            title="Leitura first-class"
            description="Fluxo inteiro centrado ler e seguir código real com highlight — não apenas pseudocódigo estático perdido página HTML."
          />
        </div>
      </section>

      {/* ── Testes técnicos / vagas ── */}
      <section id="technical-job-tests" className="relative z-10 scroll-mt-28 border-y border-primary/20 bg-muted/30">
        <div className="mx-auto max-w-7xl px-6 py-20 md:py-28">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:items-start lg:gap-16">
            <div className="space-y-8">
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="outline" className="rounded-none border-primary/40 px-3 py-1 font-mono text-[10px] text-primary">
                  Em expansão editorial
                </Badge>
                <span className="text-[11px] font-black uppercase tracking-[0.38em] text-muted-foreground">
                  Vagas & entrevistas
                </span>
              </div>
              <div className="flex items-start gap-5">
                <div className="mt-1 flex h-14 w-14 shrink-0 items-center justify-center border-2 border-primary bg-background text-primary">
                  <Briefcase className="h-7 w-7" aria-hidden />
                </div>
                <div className="space-y-4">
                  <h2 className="text-3xl font-black uppercase leading-tight tracking-tighter md:text-5xl md:leading-[1]">
                    Resoluções no ritmo dos testes técnicos
                  </h2>
                  <p className="border-l-[3px] border-primary/35 pl-6 text-muted-foreground md:text-lg md:leading-relaxed">
                    A mesma filosofia da Algoria — ler implementações bem comentadas antes de cair só em memorização — aplica-se aos desafios
                    típicos de processos seleção: encontrar invariantes rápido, explicar complexidade verbalmente e escolher a abordagem certa quando o
                    enunciado ecoa vagas clássicas (arrays e hashing, duas pontas, grafos quando encaixa, simulações com limites bem definidos...).
                  </p>
                  <div className="flex flex-wrap gap-3 pt-2">
                    <Button asChild variant="outline" size="xl" className="rounded-none border-2 px-8 font-black uppercase tracking-wider">
                      <Link href="/problems">Treinar já no catálogo</Link>
                    </Button>
                    <Button asChild variant="outline" size="xl" className="rounded-none border-2 px-8 font-black uppercase tracking-wider">
                      <Link href="/interview-en">Inglês técnico · hub EN</Link>
                    </Button>
                    <Link
                      href="/course/fundamentos-fase-1"
                      className="inline-flex items-center gap-2 self-center px-2 text-[11px] font-bold uppercase tracking-[0.2em] text-primary hover:underline"
                    >
                      Revisar fundamentos guiados <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-0 border border-border bg-background">
              <div className="border-b border-border bg-primary/[0.06] px-8 py-5">
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.35em] text-primary">Linha editorial</p>
                <p className="mt-2 text-sm font-semibold uppercase tracking-wide text-foreground">O que vais usar na prática</p>
              </div>
              <ul className="divide-y divide-border px-8 py-2">
                {[
                  'Bundles problema + solução mapeados a padrões de entrevista (ordenar, hashing, greedy prudente, janelas).',
                  'Guia de raciocínio antes do compilador — o que dirias numa videochamada, não só o fluxo dos submits.',
                  'Confrontos “passa só os exemplinhos públicos errados típicos” vs solução mínima defensável em entrevistas.',
                ].map((line, i) => (
                  <li key={i} className="flex gap-4 py-5 text-sm leading-relaxed text-muted-foreground">
                    <TrendingUp className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
              <div className="border-t border-dashed border-border bg-muted/20 px-8 py-4 text-[11px] leading-relaxed text-muted-foreground">
                Trilhos dedicados apenas a vagas aparecem gradualmente dentro do formato de problemas já existente —
                esta secção marca a intenção editorial enquanto o catálogo crescer nesse eixo.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Engenharia no trabalho ── */}
      <section id="engineering-pro" className="relative z-10 scroll-mt-28 border-t border-border bg-background">
        <div className="mx-auto max-w-7xl px-6 py-20 md:py-28">
          <SectionHeading
            kicker="Para além das listas clássicas"
            title="Conhecimento para sprint, infra e produto"
            subtitle="Temas onde muitos aprendem sob pressão antes de outages ou revisões SEO: segurança, custo em frontend e métricas de confiança nos deploys.
              Queremos tratar estas competências no mesmo modo de leitura exigente aplicável dia-a-dia em três frentes de trabalho."
          />
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Badge variant="outline" className="rounded-none border-muted-foreground/40 font-mono text-[10px] uppercase">
              Conceitos aplicados · guias longos
            </Badge>
            <Button asChild variant="outline" size="sm" className="rounded-none border-2 border-primary font-black uppercase tracking-wider">
              <Link href="/engineering-work">
                Abrir guias · Front, Back, DevOps <ArrowRight className="ml-1 h-4 w-4" aria-hidden />
              </Link>
            </Button>
          </div>
          <div className="mt-14 grid gap-0 border border-border md:grid-cols-3">
            <WorkPracticeColumn
              icon={<MonitorSmartphone className="h-7 w-7" />}
              title="Frontend & produto"
              tag="Web"
              bullets={[
                'Otimização sob medida Vitals — carregar menos, hidratar com critério, dividir bundles onde o utilizador estrangula primeiro.',
                'SEO técnico honesto — indexação, canonical, hreflang, dados estruturados e migrações em cenários reais (guia longo dedicado no hub).',
                'Superfícies perigosas bem explicadas — XSS em formulários, rich editors e payloads que regressam em silêncio.',
              ]}
            />
            <WorkPracticeColumn
              icon={<Server className="h-7 w-7" />}
              title="Backend & APIs"
              tag="Serviços"
              bullets={[
                'Autorização distinta da autenticação — rituais curtos úteis no backlog de hardening.',
                'Caching e quotas no limiar entre clientes legítimos e automação não controlada sobre as tuas APIs.',
                'Schemas e migrações que não pedem refactor dramático sempre que produto quer pivotar modelo.',
              ]}
            />
            <WorkPracticeColumn
              icon={<CloudCog className="h-7 w-7" />}
              title="DevOps & sistema"
              tag="Pipeline"
              bullets={[
                'Mudança contínua com rollback que não diz “rezemos só desta vez”.',
                'Observabilidade mínima viável antes do primeiro spike de custo inexplicável à terça-feira.',
                'Segredos, RBAC e políticas quando equipas clicam rápido em consolas cloud públicas.',
              ]}
            />
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <div className="border border-border bg-muted/15 p-6">
              <div className="mb-4 flex items-center gap-3 text-primary">
                <Gauge className="h-5 w-5 shrink-0" aria-hidden />
                <span className="font-mono text-[10px] font-bold uppercase tracking-[0.3em]">Performance custo-real</span>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Trade-offs quando ancorados em número — p95 na rede, bytes transferidos — em vez de frases vagas tipo “rápido o suficiente”.
              </p>
            </div>
            <div className="border border-border bg-muted/15 p-6">
              <div className="mb-4 flex items-center gap-3 text-primary">
                <Shield className="h-5 w-5 shrink-0" aria-hidden />
                <span className="font-mono text-[10px] font-bold uppercase tracking-[0.3em]">Segurança aplicada</span>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Listas funcionam quando ligamos cada item a regressões já vistas em projeto real ou quase infração de compliance.
              </p>
            </div>
            <div className="border border-border bg-muted/15 p-6">
              <div className="mb-4 flex items-center gap-3 text-primary">
                <Search className="h-5 w-5 shrink-0" aria-hidden />
                <span className="font-mono text-[10px] font-bold uppercase tracking-[0.3em]">SEO & indexação</span>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Crawlers, frescura editorial controlada e conteúdo que engenharia pode defender em review — lado a lado, sem magia só de marketing.
              </p>
              <p className="mt-4 text-sm leading-relaxed">
                <Link
                  href="/engineering-work/frontend-seo-tecnico-cenarios-producao"
                  className="font-semibold text-primary underline-offset-4 hover:underline"
                >
                  Guia extensivo: SEO técnico — cenários de produção (SPA, e-commerce, multi-idioma, staging…)
                </Link>
              </p>
            </div>
          </div>
          <p className="mt-14 max-w-3xl border-l-[3px] border-primary/30 pl-6 text-sm leading-relaxed text-muted-foreground">
            Esta secção continua a funcionar como âncora na página inicial; os textos completos — por capítulo, com exercícios de reflexão e
            checklists — vivem no hub{' '}
            <Link href="/engineering-work" className="font-semibold text-foreground underline-offset-4 hover:underline">
              Engenharia no trabalho
            </Link>
            . Novos temas entram no mesmo formato quando estiverem editorialmente maduros.
          </p>
        </div>
      </section>

      {/* ── Destaques do catálogo ── */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 pb-20 md:pb-28">
        <div className="flex flex-col gap-8 border-t border-border pt-14 md:flex-row md:items-end md:justify-between">
          <SectionHeading kicker="" title="Desafios em destaque" subtitle="Pontos recomendados para começar agora mesmo." compact />
          <Link
            href="/problems"
            className="inline-flex shrink-0 items-center gap-2 text-sm font-bold uppercase tracking-widest text-primary hover:underline"
          >
            Catálogo completo <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((p) => (
            <Link key={p.meta.slug} href={`/problems/${p.meta.slug}`} className="group relative">
              <Card className="h-full border-border/60 bg-card/70 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/55 hover:shadow-xl hover:shadow-primary/10">
                <CardHeader>
                  <div className="mb-4 flex flex-wrap items-center gap-2">
                    <DifficultyBadge difficulty={p.meta.difficulty} />
                    {p.meta.categories.slice(0, 1).map((c) => (
                      <Badge key={c} variant="secondary" className="truncate py-0 text-[10px] capitalize">
                        {c.replace('-', ' ')}
                      </Badge>
                    ))}
                  </div>
                  <CardTitle className="text-xl transition-colors group-hover:text-primary">{p.meta.title}</CardTitle>
                  <CardDescription className="mt-2 flex flex-wrap items-center gap-2 gap-y-1 text-xs">
                    <span>
                      {p.solutions.length} {p.solutions.length === 1 ? 'solução' : 'soluções'}
                    </span>
                    <span className="opacity-40" aria-hidden>
                      •
                    </span>
                    <span className="whitespace-nowrap">~{p.meta.estimatedMinutes} min estimados</span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">{firstParagraph(p.descriptionHtml)}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="relative z-10 border-t border-border py-16 md:py-24">
        <div className="mx-auto max-w-3xl px-6">
          <SectionHeading
            kicker="Dúvidas"
            title="Perguntas frequentes"
            subtitle="Antes de mergulhares, isto diz o que a plataforma garante neste momento."
            compact
          />
          <div className="mt-12 space-y-0 border border-border divide-y divide-border rounded-none bg-background">
            <FaqItem
              question="Posso apenas ler sem submeter código?"
              answer="Sim — o centro da experiência é o code player ao abrir cada solução: percorrer linhas, abrir níveis diferentes de explicação e saltar aos conceitos referenciados quando existirem."
            />
            <FaqItem
              question="O certificado do curso tem validação legal ou só local?"
              answer="É emitido apenas no browser após responderes bem à última avaliação de cada capítulo. Serve como marco pedagógico pessoal; não substitui exames externos formais institucionais."
            />
            <FaqItem
              question="Todos os exercícios têm mais do que uma solução?"
              answer="Preferimos sempre publicar pelo menos dois ângulos (por exemplo brute vs óptima) quando faz sentido. Se existir apenas uma edição forte no catálogo, ela ficará assim até aparecer segunda variante válida editorialmente."
            />
            <FaqItem
              question="Funciona bem no telemóvel?"
              answer="O site é responsivo; códigos longos em ecrãs pequenos costumam pedir zoom confortável de qualquer forma."
            />
          </div>
        </div>
      </section>

      {/* ── CTA final ── */}
      <section className="relative z-10 border-t border-primary/30 bg-gradient-to-br from-primary/10 via-muted/35 to-transparent py-16 md:py-24">
        <div className="mx-auto flex max-w-7xl flex-col items-start gap-6 px-6 md:flex-row md:items-center md:justify-between md:gap-10">
          <div className="max-w-xl space-y-4">
            <p className="text-[11px] font-black uppercase tracking-[0.38em] text-primary">Começar agora</p>
            <h2 className="text-3xl font-black uppercase leading-tight tracking-tighter md:text-5xl md:leading-none">
              Claro até demais porque isto existe
            </h2>
            <p className="text-muted-foreground md:text-lg">
              Ler implementações bem comentadas ao lado da teoria certa faz com que as tuas próprias soluções futuras
              tenham menos regressões — porque reconhecer padrões passa a ser quase automático.
            </p>
          </div>
          <div className="flex w-full flex-col gap-4 sm:flex-row md:w-auto">
            <Button asChild size="xl" className="rounded-none px-10 font-black uppercase tracking-wider">
              <Link href="/problems">Entrar catálogo</Link>
            </Button>
            <Button asChild variant="outline" size="xl" className="rounded-none border-2 border-foreground px-8 font-black uppercase tracking-wider">
              <Link href="/course/fundamentos-fase-1">Curso primeiro</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

function WorkPracticeColumn({
  icon,
  title,
  tag,
  bullets,
}: {
  icon: React.ReactNode;
  title: string;
  tag: string;
  bullets: string[];
}) {
  return (
    <div className="group border-border bg-background px-8 py-10 transition-colors hover:bg-muted/35 border-b border-border last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3 border-b border-dashed border-border/80 pb-5">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center border-2 border-primary text-primary transition-all duration-500 group-hover:bg-primary group-hover:text-primary-foreground">
            {icon}
          </div>
          <h3 className="max-w-[12rem] text-lg font-black uppercase leading-tight tracking-tight">{title}</h3>
        </div>
        <Badge variant="secondary" className="rounded-none font-mono text-[9px] uppercase tracking-[0.25em]">
          {tag}
        </Badge>
      </div>
      <ul className="space-y-4 text-sm font-medium leading-relaxed text-muted-foreground">
        {bullets.map((b, i) => (
          <li key={i} className="flex gap-3">
            <span className="mt-2 inline-block h-1 w-4 shrink-0 bg-primary opacity-75" aria-hidden />
            <span>{b}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SectionHeading(props: {
  kicker?: string;
  title: string;
  subtitle?: string;
  compact?: boolean;
}) {
  const { kicker, title, subtitle, compact } = props;
  return (
    <div className={`max-w-3xl space-y-4 ${compact ? '' : ''}`}>
      {kicker ? (
        <p className="text-[10px] font-black uppercase tracking-[0.38em] text-primary">{kicker}</p>
      ) : null}
      <h2 className="text-3xl font-black uppercase leading-tight tracking-tighter md:text-5xl md:leading-[1]">{title}</h2>
      {subtitle ? <p className="text-base leading-relaxed text-muted-foreground md:text-lg">{subtitle}</p> : null}
    </div>
  );
}

function Metric({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="border-b border-border bg-background px-6 py-7 text-left last:border-b-0 max-md:border-r max-md:border-border max-md:last:border-r-0 md:border-b-0 md:border-r md:last:border-r-0">
      <p className="font-mono text-[10px] font-bold uppercase tracking-[0.28em] text-muted-foreground">{label}</p>
      <p className="mt-3 text-4xl font-black tracking-tighter text-foreground">{value}</p>
      <p className="mt-2 max-w-[14rem] text-xs leading-snug text-muted-foreground">{hint}</p>
    </div>
  );
}

function PlatformArm(props: {
  icon: React.ReactNode;
  title: string;
  bullets: string[];
  ctaHref: string;
  ctaLabel: string;
}) {
  const { icon, title, bullets, ctaHref, ctaLabel } = props;
  return (
    <div className="group border-border bg-background px-8 py-10 transition-colors hover:bg-muted/35 md:border-r md:border-b-0 md:last:border-r-0 border-b last:border-b-0 md:border-b-0 md:border-t-0 md:border-border">
      <div className="mb-8 flex h-14 w-14 items-center justify-center border-2 border-primary text-primary transition-all duration-500 group-hover:bg-primary group-hover:text-primary-foreground">
        {icon}
      </div>
      <h3 className="mb-6 text-xl font-black uppercase tracking-tight">{title}</h3>
      <ul className="mb-8 space-y-3 text-sm font-medium leading-relaxed text-muted-foreground">
        {bullets.map((b, i) => (
          <li key={i} className="flex gap-3">
            <span className="mt-2 inline-block h-1.5 w-1.5 shrink-0 bg-primary opacity-70" aria-hidden />
            <span>{b}</span>
          </li>
        ))}
      </ul>
      <Link
        href={ctaHref}
        className="inline-flex items-center gap-2 border-b-2 border-primary pb-0.5 text-xs font-bold uppercase tracking-[0.2em] text-primary hover:text-foreground hover:border-foreground transition-colors"
      >
        {ctaLabel} <ArrowRight className="h-3 w-3" aria-hidden />
      </Link>
    </div>
  );
}

function Step({ n, title, text }: { n: number; title: string; text: string }) {
  return (
    <div className="bg-background p-8">
      <span className="font-mono text-[11px] font-bold uppercase tracking-[0.35em] text-primary">Passo {n}</span>
      <p className="mt-6 text-xl font-black uppercase tracking-tight">{title}</p>
      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{text}</p>
    </div>
  );
}

function AudienceCard({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="border border-border bg-background p-8 transition-colors hover:border-primary/50">
      <div className="mb-6 flex text-primary">{icon}</div>
      <h3 className="mb-4 text-lg font-black uppercase tracking-tight">{title}</h3>
      <p className="text-sm leading-relaxed text-muted-foreground">{text}</p>
    </div>
  );
}

function Feature({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="group relative border border-border border-b bg-background bg-grid-pattern p-10 hover:bg-muted/30 max-md:border-r-0 [&:last-child]:border-b-0 md:border-r md:[&:nth-child(3n)]:border-r-0 md:[&:nth-child(n+4)]:border-b-0">
      {/* Unificar bordagem em grids 3 cols: todas células têm direita excepto última cada linha */}
      <div className="h-14 w-14 mb-8 flex items-center justify-center border-2 border-primary text-primary transition-all duration-500 group-hover:bg-primary group-hover:text-primary-foreground">
        {icon}
      </div>
      <h3 className="mb-4 text-xl font-black uppercase tracking-tight">{title}</h3>
      <p className="text-sm font-medium leading-relaxed text-muted-foreground">{description}</p>
    </div>
  );
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  return (
    <details className="group border-none open:bg-muted/35">
      <summary className="flex cursor-pointer list-none items-start justify-between gap-4 px-5 py-4 text-left font-semibold uppercase tracking-tight [&::-webkit-details-marker]:hidden">
        <span className="pt-1 pr-6">{question}</span>
        <ChevronDown className="mt-1 h-4 w-4 shrink-0 text-primary transition-transform group-open:rotate-180" aria-hidden />
      </summary>
      <div className="border-t border-border/60 px-5 pb-5 pt-4 text-sm leading-relaxed text-muted-foreground">{answer}</div>
    </details>
  );
}

function firstParagraph(html: string): string {
  const plain = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  return plain.length > 200 ? `${plain.slice(0, 200)}…` : plain;
}
