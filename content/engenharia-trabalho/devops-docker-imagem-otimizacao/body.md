## Objetivos de aprendizagem

1. Entender **camadas** Docker: cada instrução pode criar uma camada imutável — e o peso acumula se a ordem for má.
2. Aplicar **multi-stage build** para separar compilação de *runtime* sem “gambiarra” de `rm -rf` solto.
3. Usar **`.dockerignore`**, bases **slim** e **utilizador não-root** como padrão de segurança, não como extra.
4. Operacionalizar otimização com **BuildKit**, **`docker buildx`** e comandos de **inspeção** (*history*, *df*, *imagetools*).
5. Explicar **porque** imagens leves importam para **custo, velocidade de entrega, segurança e confiança** — não só para “menos MB”.

---

:::didactic-figure
{
  "src": "/engenharia/devops-docker-imagem-otimizacao.svg",
  "alt": "Comparação entre imagem Docker grande e imagem multi-stage reduzida",
  "caption": "O *build* pesado fica no *stage* de compilação; o *runtime* recebe só binários e dependências mínimas."
}
:::

:::didactic-metrics
{
  "title": "O que costuma pesar numa imagem Node ou JVM",
  "columns": 4,
  "items": [
    { "label": "Base", "value": "40–70%", "sublabel": "SO + shells + certificados" },
    { "label": "Deps", "value": "node_modules", "sublabel": "*dev* incluído por engano" },
    { "label": "Layers", "value": "Cache", "sublabel": "COPY antes de instalar" },
    { "label": "Lixo", "value": ".git", "sublabel": "testes e *fixtures* na imagem" }
  ]
}
:::

:::didactic-bar-chart
{
  "title": "Impacto típico no tamanho final (ordem de grandeza, ilustrativo)",
  "unit": "redução relativa %",
  "bars": [
    { "label": "dockerignore", "value": 25 },
    { "label": "multi-stage", "value": 55 },
    { "label": "base slim", "value": 40 },
    { "label": "deps só prod", "value": 35 }
  ],
  "caption": "As percentagens não somam de forma linear — combinadas removem GB em projetos reais."
}
:::

## Porque otimizar imagens não é “vaidade técnica”

Numa empresa, o tamanho da imagem **não aparece no Excel** com o rótulo “Docker”, mas aparece como **minutos de pipeline**, **GB movidos em cada deploy**, **alertas de CVE** e **frustração** quando o *build* falha à quinta tentativa. Otimizar é alinhar **engenharia** com **resultado**: menos atrito operacional, menos custo recorrente e menos superfície para incidentes.

### O impacto real em quatro dimensões

| Dimensão | O que a organização sente |
| --- | --- |
| **Tempo até valor** | Cada `pull` maior atrasa *rolling updates*, *scale-out* e *rollbacks*. Em incidente, **minutos** são o que separa “degradado” de “fora do ar”. |
| **Custo** | *Egress* do *registry*, armazenamento de tags antigas e minutos de *runner* em CI **repetem-se todos os dias**. Pequenas diferenças × centenas de builds × meses = **linha na fatura** ou **menos capacidade** para a mesma equipa. |
| **Segurança e auditoria** | Mais pacotes na imagem final ⇒ mais CVE possíveis e mais triagem. Imagens **mínimas** e **não-root** respondem melhor a **compliance** e a due diligence de clientes enterprise. |
| **Equipa e cultura** | Onboarding lento (“ainda está a puxar 2 GB”), filas no CI e builds locais instáveis corroem confiança na *pipeline* — **produtividade real**, não só “experiência no terminal”. |

### Exemplos numéricos (ordem de grandeza — para calibrar intuição)

**Cenário A — *Deploy* no Kubernetes.** Novo release: **30 nós** precisam da mesma tag. Imagem **~1,8 GB** ⇒ ~**54 GB** de dados a mover no melhor caso (sem *layer cache* no nó). A mesma aplicação com imagem **~400 MB** ⇒ ~**12 GB**. Menos pressão na rede interna, *Pods* **Ready** mais cedo, menos *timeouts* em nós com disco fraco.

**Cenário B — CI quotidiano.** **40 *builds*/dia** × **6 min** extra porque o contexto é gigante e não há *cache* remoto estável ⇒ **4 h/dia** de *runner* que podiam ser mais testes ou mais ambientes. Em cloud isso é **custo direto**; *on-prem* é **fila** e **menos confiança** nos merges.

**Cenário C — Reunião com produto/financeiro.** Tu não vens com “vamos mudar o Dockerfile”. Vens com: **“Reduzir a imagem X% corta ~Y minutos por deploy e ~Z €/mês em CI + armazenamento, estimativa conservadora.”** — métrica **antes/depois** ancorada na ferramenta de *billing* ou nos relatórios do CI.

:::didactic-metrics
{
  "title": "Mapa rápido: sintoma técnico vs dor na empresa",
  "columns": 4,
  "items": [
    { "label": "Build CI", "value": "Lento", "sublabel": "menos merges úteis por dia" },
    { "label": "Pull no cluster", "value": "GB/nó", "sublabel": "deploy e escala mais lentos" },
    { "label": "Scan de CVE", "value": "Alertas", "sublabel": "horas de triagem em segurança" },
    { "label": "Incidente", "value": "Rollback", "sublabel": "SLA e confiança do cliente" }
  ]
}
:::

### Como contar esta história numa *review* ou *OKR*

1. Escolhe **uma** métrica simples: tempo médio de *build*, tamanho da última tag no *registry*, ou tempo de `pull` medido no pipeline.
2. Liga ao objetivo de negócio: **mais entregas na mesma janela**, **menos custo variável**, ou **menos risco** num contrato que exige duras práticas de segurança.
3. Mostra **antes/depois** num único gráfico ou tabela — mesmo que o “depois” seja uma *branch* experimental.

---

## Analogia: mudança em folhas de papel

Cada `RUN`, `COPY` ou `ADD` empilha uma folha. **Não consegues rasgar o meio** sem reconstruir o topo — por isso **a ordem importa**: primeiro instala dependências que mudam pouco; **depois** copia código que muda a cada *commit*. Assim o *cache* do *registry* e do *daemon* trabalha a teu favor.

---

## Anti-padrões que incham a imagem

| Padrão | Porque magoa |
| --- | --- |
| `COPY . .` sem `.dockerignore` | Leva `.git`, `node_modules` local, testes e centenas de MB inúteis |
| `npm install` sem `NODE_ENV=production` | Instala Vitest, TypeScript e histórias na imagem final |
| `RUN apt-get update && apt-get install` sem limpar `/var/lib/apt/lists` | Camada extra com *cache* de pacotes |
| Uma única *stage* `FROM ubuntu` | Trás compiladores e *shells* para sempre |

---

## Passo a passo — Dockerfile enxuto (Node ilustrativo)

### 1. `.dockerignore` alinhado ao `.gitignore` + extras

Exclui: `.git`, `coverage`, `*.md`, `docker-compose.yml`, ficheiros de IDE. **Objetivo**: contexto de *build* pequeno e determinístico.

### 2. *Stage* `deps` ou `builder`

```dockerfile
FROM node:22-bookworm-slim AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build
```

`npm ci` respeita o *lockfile* — reprodutível.

### 3. *Stage* `runner` minimalista

```dockerfile
FROM gcr.io/distroless/nodejs22-debian12 AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
USER nonroot
CMD ["dist/server.js"]
```

Ajusta caminhos ao teu *bundler*. **Distroless** remove *shell* — menos superfície; **Alpine** é alternativa com `apk`, mas atenção a *musl* vs *glibc*.

### 4. Utilizador não-root

Mesmo que o *cluster* force política, **não correr como root** dentro da imagem reduz o impacto de CVE de *escape*.

---

## *Cache* de camadas: regra prática

1. **Primeiro** ficheiros de *lock* + instalação de dependências.
2. **Depois** código-fonte e *build*.
3. **Evita** `COPY . .` no topo do Dockerfile — invalida tudo a cada edição.

---

## BuildKit e `docker buildx` — comandos que aceleram o *build* de verdade

O motor moderno de *build* chama-se **BuildKit** (sintaxe estendida no Dockerfile, *cache* mais inteligente, *mount* de segredos). O plugin **`docker buildx`** usa BuildKit por defeito e acrescenta **exportação para várias arquiteturas**, **push directo** e **cache remoto** — indispensável em CI e em equipas que publicam para um *registry*.

### BuildKit ativo

- Docker Desktop recente já usa BuildKit; em Linux podes forçar `export DOCKER_BUILDKIT=1` ou definir em `daemon.json`.
- Sem BuildKit, instruções como `RUN --mount=type=cache` **falham** — valida no CI.

### Criar e usar um *builder* Buildx

Útil quando precisas de imagens **multi-arquitetura** ou de um *builder* isolado com opções próprias:

```bash
docker buildx create --name algoria-builder --driver docker-container --use
docker buildx inspect --bootstrap
```

`--driver docker-container` corre o motor num contentor — típico para *cache* avançado e *builds* reprodutíveis entre máquinas.

### `docker buildx build` — flags que mais impactam o dia-a-dia

| Flag / padrão | Para que serve |
| --- | --- |
| `--platform linux/amd64,linux/arm64` | Uma imagem *manifest* para AMD e ARM (Kubernetes misto, Apple Silicon → prod x86). |
| `--push` | Envia para o *registry* sem passar por `docker load` local (combinado com multi-stage produz o artefacto final “nu”). |
| `--load` | Carrega **uma** plataforma no *daemon* local (útil para testar; incompatível com *multi-platform* no mesmo comando). |
| `--cache-to type=registry,ref=...,mode=max` | Exporta **cache de build** para o *registry* — o CI seguinte reaproveita camadas sem reconstruir tudo. |
| `--cache-from type=registry,ref=...` | Diz ao BuildKit de onde **ler** esse *cache* antes do *build*. |

Exemplo mínimo de *cache* remoto (substitui pelo teu *registry* e nome de imagem):

```bash
docker buildx build \
  --cache-to type=registry,ref=registry.example.com/meuprojeto/cache:buildkit,mode=max \
  --cache-from type=registry,ref=registry.example.com/meuprojeto/cache:buildkit \
  -t registry.example.com/meuprojeto/app:1.4.0 \
  --push .
```

`mode=max` guarda mais camadas intermédias (melhor *hit-rate*; ocupa mais espaço no *registry* de *cache*).

### Inspecionar o que foi publicado — `docker buildx imagetools`

Para **manifest lists** (*multi-arch*), `docker images` no portátil pode mostrar só uma arquitetura. O plugin esclarece:

```bash
docker buildx imagetools inspect registry.example.com/meuprojeto/app:1.4.0
```

Vês quais plataformas existem, *digests* e tamanhos por variant — essencial quando alguém diz “a imagem não corre no *cluster*”.

---

## Cache de *dependências* dentro do Dockerfile (`RUN --mount`)

Com BuildKit, podes persistir *cache* de pacotes **entre builds** sem contaminar a camada final (menos *download* repetido, *build* mais rápido no CI):

```dockerfile
# npm (Node)
RUN --mount=type=cache,target=/root/.npm \
    npm ci

# apt (Debian/Ubuntu) — reduz re-downloads entre builds
RUN --mount=type=cache,target=/var/cache/apt,sharing=locked \
    --mount=type=cache,target=/var/lib/apt,sharing=locked \
    apt-get update && apt-get install -y --no-install-recommends \
    gcc && rm -rf /var/lib/apt/lists/*
```

O `target` é o caminho onde a ferramenta guarda *cache*; o BuildKit reutiliza esse volume entre execuções do mesmo *builder*.

---

## Outros comandos úteis para “ver” o peso e o lixo

| Comando | O que ganhas |
| --- | --- |
| `docker history <imagem:tag>` | Lista camadas com tamanho **aparente** — bom para achar qual `RUN` ou `COPY` inchou. |
| `docker image inspect <imagem:tag>` | Metadados completos (arquitectura, variáveis, *digest*). |
| `docker system df` | Disco usado por imagens, contentores e *build cache* local — antes de um *prune* informado. |
| `docker builder prune` | Limpa *cache* de BuildKit antigo (liberta GB em máquinas de dev). |
| `dive` (*CLI* externo) | Explora árvore de ficheiros por camada — didático em *reviews*. |

**Nota:** `docker history` mostra tamanhos **não comprimidos** por camada; o *registry* comprime *layers* — comparações “MB no `docker images`” vs “MB no *pull*” podem diferir.

---

## Erros comuns

- Medir tamanho só com `docker images` local — comprime diferente do *registry*; usa `dive` ou análise no CI para camadas.
- **Secrets** em `ARG` usados em `RUN` podem ficar em camadas antigas — preferir *mount* de segredos (*BuildKit*) ou injeção em *runtime*.
- Imagem “oficial” com tag `:latest` sem *pin* — reprodutibilidade partida.

---

## Checklist antes de merge do Dockerfile

- [ ] Existe `.dockerignore` e foi revisto no PR.
- [ ] *Build* multi-stage; *runtime* sem compiladores nem git.
- [ ] `NODE_ENV=production` (ou equivalente) na imagem final.
- [ ] Utilizador não-root testado (serviço arranca e liga às portas permitidas).
- [ ] *Scan* de vulnerabilidades no CI (`trivy`, `grype`) com política acordada.
- [ ] CI usa **BuildKit** / `docker buildx build` com `--cache-to` / `--cache-from` para o *registry* (quando *build* é lento).

---

## Glossário

- **Layer**: *filesystem* diferencial guardado pelo Docker; o somatório das camadas é a imagem.
- **Multi-stage**: vários `FROM` no mesmo Dockerfile; `COPY --from` transporta artefactos entre *stages*.
- **Distroless**: imagens Google mínimas sem *shell*, focadas por linguagem.
- **BuildKit**: motor de *build* moderno (instruções extendidas, *cache*, *mount* de segredos e de *cache* de pacotes).
- **Buildx**: plugin `docker buildx` sobre BuildKit — *multi-platform*, *cache* remoto no *registry*, *push* directo.
- ***Manifest list***: imagem que aponta para variantes por `GOARCH`/`GOOS`; `imagetools inspect` mostra o mapa completo.

---

## Exercício de equipa (25 minutos)

1. Abre o Dockerfile atual do serviço principal. Conta quantas instruções `RUN`/`COPY` existem e ordena por **frequência de mudança** (o que muda menos vem primeiro).
2. Regista **três números** (mesmo que estimados): tamanho actual da imagem no *registry*, tempo médio de *build* no CI, tempo de `pull` ou de deploy até *healthy*.
3. Desenha num *slide* o plano multi-stage + `.dockerignore` e prevê **antes/depois** em MB e minutos.
4. **Uma frase para não-técnicos**: “Se fizermos isto, ganhamos ______ porque ______ (custo / velocidade / risco).” — é o que fecha a ligação à empresa.
