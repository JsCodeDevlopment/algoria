## Objetivos de aprendizagem

1. Entender **XSS** como confiança mal colocada em dados que viram HTML ou JS no browser.
2. Separar **sanitização** por contexto (HTML vs atributo vs URL vs CSS).
3. Negociar **SEO técnico** com critérios que engenharia pode cumprir e medir.

---

:::didactic-figure
{
  "src": "/engenharia/frontend-xss-seo-superficies-perigosas.svg",
  "alt": "Fluxo de entrada a HTML executável e camadas de defesa; bloco sobre SEO auditável",
  "caption": "CSP não substitui sanitização; SEO técnico traduz-se em requisitos que podes medir (sitemap, canonical, Vitals)."
}
:::

:::didactic-metrics
{
  "title": "Classificação rápida de dados para reviews",
  "columns": 3,
  "items": [
    { "label": "Confiável", "value": "Sistema", "sublabel": "ainda assim escapa por hábito" },
    { "label": "Semi", "value": "Moderador", "sublabel": "política própria" },
    { "label": "Não confiável", "value": "Público", "sublabel": "nunca → HTML cru sem pipeline" }
  ]
}
:::

React: dados dinâmicos no DOM sem interpretar HTML da rede:

```tsx
// ✅ texto tratado como texto
export function UserBio({ bio }: { bio: string }) {
  return <p>{bio}</p>;
}

// ⚠️ só com pipeline de sanitização explícita e auditoria
export function RichBio({ html }: { html: string }) {
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
```

---

## XSS em linguagem de equipa

Cross-site scripting não é “virus misterioso”. É quase sempre: **o servidor ou o cliente aceita texto que contém instruções de página** e coloca-o onde o browser interpreta como código.

Fluxo mental:

1. Entrada (formulário, query string, rich text guardado na BD).
2. Transformação (templates, `dangerouslySetInnerHTML`, concatenação de strings).
3. Saída num contexto executável ou reinterpretável.

Se falhas no passo 2 ou 3, um atacante envia algo como `<script>...</script>` ou handlers em atributos — e executa ações em nome da vítima **na tua origem**.

---

## Superfícies perigosas no dia-a-dia

| Superfície | Por que dói |
| --- | --- |
| **Rich text editors** | Utilizadores colam HTML de emails; limpar “à mão” falha sempre com tempo. |
| **Campos que ecoam query params** | Mensagens de erro bonitas refletem input sem escape. |
| **Markdown livre → HTML** | Extensões permitem HTML cru se não limitares parser e lista de tags. |
| **Links dinâmicos** | `javascript:` ou `data:` em `href` abrem vetores se não validares protocolo. |

---

## Passo a passo — defender sem paranoia paralisante

### 1. Classifica dados

- **Confiável**: gerado por sistema, nunca tocou em utilizador sem transformação (ainda assim escapa por hábito).
- **Semi-confiável**: moderadores internos — políticas diferentes de utilizador final.
- **Não confiável**: qualquer input público.

### 2. Escolhe estratégia por camada

- Preferência forte: **serialização segura no servidor** (framework maduro ou biblioteca com lista branca de tags).
- No cliente: renderização que **nunca** concatena strings cruas em HTML quando dados são não confiáveis.

### 3. Content Security Policy (CSP) como rede de segurança

CSP não substitui sanitização; reduz danos quando há bug. Começa restritivo em staging, observa relatórios (`report-uri` ou equivalente), afina.

---

## SEO técnico que engenharia pode assumir

Marketing pede “estar em primeiro”. Tu traduzes para **requisitos verificáveis**:

| Pedido vago | Compromisso realista |
| --- | --- |
| “Indexar tudo” | Sitemap coerente, `noindex` onde faz sentido, canonical estável |
| “Snippet bonito” | Metadados estruturados **corretos** para o tipo de página — sem dados inventados |
| “Velocidade Google” | Vitals medidos em campo + plano de regressão |

Evita prometer posição — algoritmo e concorrência fogem ao controlo. Promete **auditabilidade**: URLs estáveis, conteúdo duplicado tratado, renderização que crawlers entendem.

---

## Erros comuns

- Sanitizar só no cliente — atacante ignora browser e chama API diretamente.
- Permitir `iframe`/`svg`/`math` sem política — superfície enorme.
- Misturar mensagens de erro com HTML não escapado por conveniência.

---

## Checklist de revisão de formulário ou CMS

- [ ] Entrada categorizada (confiável / não confiável)?
- [ ] HTML de utilizador passa por pipeline com lista branca documentada?
- [ ] URLs externas validadas quanto a esquema (`https` apenas, por exemplo)?
- [ ] CSP ativa em ambientes de pré-produção com relatório de violações?

---

## Glossário

- **Escape**: transformar `<` em entidade ou texto seguro para aquele contexto.
- **Sanitize**: remover ou transformar tags/atributos não permitidos.
- **Origin**: combinação esquema + host + porta — cookies e permissões amarram aqui.

---

## Fecho didático

Na próxima feature com texto rico, faz **15 minutos** de threat modelling em duo: um dev escreve entrada maliciosa simples no staging. Se não der trabalho criar o campo de teste, a equipa não vai repetir o ritual — automatiza seed de payloads educativos (lista OWASP resumida).
