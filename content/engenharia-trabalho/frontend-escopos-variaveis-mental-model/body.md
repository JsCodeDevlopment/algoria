## Objetivos de aprendizagem

1. Ver **ambiente** como gaveta de nomes em vez de “regra mágica do compilador”.
2. Entender porque **blocos** criam espaços novos sem apagar o exterior.
3. Ligar isto a **JavaScript moderno** (`let`, `const`, funções) sem sintaxe assustadora.

---

:::didactic-figure
{
  "src": "/engenharia/frontend-escopos-variaveis-mental-model.svg",
  "alt": "Caixas aninhadas representando ambiente exterior e bloco interior com shadowing",
  "caption": "Closure = função que mantém referência à ‘gaveta’ onde nasceu — útil ao debugar hooks e listeners."
}
:::

:::didactic-metrics
{
  "title": "Três movimentos para ensinar variáveis",
  "columns": 3,
  "items": [
    { "label": "Declarar", "value": "nome na gaveta", "sublabel": "let / const" },
    { "label": "Atribuir", "value": "mudar valor", "sublabel": "respeitando `const`" },
    { "label": "Consultar", "value": "ler na lookup", "sublabel": "ordem causa TDZ clássica" }
  ]
}
:::

Blocos aninhados em TypeScript (útil em revisões):

```typescript
const outer = 1;
function demo() {
  const outer = 2; // sombreia o `outer` do módulo só dentro da função
  if (true) {
    const outer = 3;
    return outer; // 3
  }
}
```

---

## Analogia central: gavetas empilhadas

Imagina um escritório:

- Cada **ambiente** é uma **gaveta** com etiquetas (`nome → valor`).
- A gaveta do topo vê o que está **abaixo** quando precisa de algo que não tem — sobe a pilha.
- Um **bloco** abre uma **gaveta temporária**. Quando terminas o bloco, fechas essa gaveta — mas o que estava nas gavetas de baixo continua igual.

Isto é exatamente a história que linguagens e motores usam por baixo dos panos: resolver um nome significa **procurar na gaveta atual**, senão **subir**.

---

## Variáveis em três movimentos pedagógicos

1. **Declarar** — reservar nome na gaveta actual (`let score = 0`).
2. **Atribuir** — mudar valor dentro das regras da linguagem (`score = 10`).
3. **Consultar** — ler valor quando uma expressão precisa (`score + 1`).

Erros clássicos de iniciantes (“cannot access before initialization”) são quase sempre **ordem de abertura das gavetas** — tentaste ler antes da linha que declarou.

---

## Blocos e sombras (shadowing)

```javascript
let mood = 'studying';
{
  let mood = 'break'; // nova etiqueta só dentro deste bloco
  console.log(mood); // break
}
console.log(mood); // studying
```

Há duas etiquetas **homónimas** em gavetas diferentes. A interior **sombreia** a exterior apenas enquanto estás lá dentro — não apaga a de fora.

---

## Da analogia às closures (sem medo)

Função interior que “lembra” variável exterior = guardar **referência à gaveta** que estava activa quando a função nasceu.

Por isso callbacks em timers ou eventos conseguem ler contadores ou estado mesmo depois de a função pai terminou — **a gaveta ainda existe** enquanto algo a referencia.

Não precisas construir interpretadores para lucrar com o modelo mental — só precisas desta imagem quando debuggas estado estranho em React hooks ou listeners.

---

## Relação com “Essentials of Interpretation”

Há cursos que ensinam linguagens construindo um interpretador passo-a-passo (variáveis, ambientes encadeados, blocos `begin`). Tu não precisas seguir o código da linguagem fictícia para beneficiar:

- **nomeia** explicitamente “ambiente pai” quando falas de bugs de escopo em review.
- pede “este estado devia ser **local ao componente** ou **global**?” — mesma pergunta que designers de linguagem fazem.

---

## Erros comuns de equipa

| Mistério aparentado | Explicação rápida |
| --- | --- |
| “Logs mostram valor velho” | closure capturou ambiente de iteração errado |
| “Import não vê variável” | módulos são ficheiros com ambiente próprio |
| “Funciona no browser console e falha no bundle” | consoles às vezes partilham ambiente global diferente do teu módulo |

---

## Checklist de ensino (para mentores)

- [ ] Desenhaste gavetas num quadro antes de falar em hoisting.
- [ ] Mostraste exemplo `let` dentro de `{ }` separando vida útil.
- [ ] Ligaste a closures a **tempo de vida da referência**, não a “magia”.

---

## Leituras de profundidade

- [Scoping: Variables, Environments, and Blocks](https://www.iamtk.co/series/essentials-of-interpretation/variables-environments-and-blocks) — construção incremental de interpretador (inglês); óptimo se quiseres ver **código** além da metáfora.

---

## Reflexão

Quando alguém diz “não percebo closures”, troca a palavra por **“função que ainda tem acesso à gaveta onde nasceu”**. Metade do nevoeiro desaparece.
