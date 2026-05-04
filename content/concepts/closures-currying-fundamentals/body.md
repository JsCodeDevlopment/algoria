## Closure — função com memória do sítio onde nasceu

Em JavaScript (e noutras linguagens com funções de primeira classe), uma **closure** é uma função que **mantém acesso** às variáveis do sítio onde foi criada — mesmo depois desse sítio “terminar” ao olhos de quem só vê o fluxo linha-a-linha de cima para baixo.

Analogia simples: recebes um **estojo fechado**: lá dentro há lápis com etiquetas. A função que devolves é como uma **regra** que ainda consegue ler essas etiquetas embora o armário onde montaste o estojo já não esteja na pilha de chamadas activa.

---

### Para que serve na prática?

- **Estado privado sem classes**: crias uma função “fábrica” que envolve dados mutáveis por dentro e devolves apenas métodos autorizados (`push`, `pop`, …). Quem está de fora não vê o array ou lista interna — só o comportamento.

- **Callbacks e eventos**: handlers que “lembram” configuração (`id`, `limite`, `URL`) sem repetir argumentos em cada chamada.

- **Hooks em React** mentalmente encaixam neste modelo de **captura lexical** — quando estudares frameworks, lembra-te desta imagem.

---

## Currying — multiargumentos em fila indiana

**Currying** (homenagem a Haskell Curry) transforma uma função que receberia vários argumentos de uma vez numa **cadeia** de funções, cada uma com **um** argumento:

- antes: `f(a, b, c)`
- depois: recebes `f(a)` que devolve algo que aceita `b`, que devolve algo que aceita `c`.

### Porque alguém quer isto?

- **Funções especializadas**: da função genérica “somar” fixas um dos lados e ganhas `incrementarUm(x)` com semântica clara.
- **APIs fluentes legíveis**: certos DSL leem-se como frases (“obter elemento… com atributo… e valor”) — cada pedaço é uma função que devolve o próximo passo **fechado sobre** o que já escolheste.

---

### Currying parcial no dia-a-dia web

Um exemplo mental frequentemente citado: especializar **`addEventListener`** por tipo de evento — primeiro fixas `'click'`, depois aplicas `(elemento, handler)` várias vezes. É **partial application** próxima da experiência de currying sem precisares de teoria pura.

---

### Armadilhas — elegância vs equipa

- Encadeamentos longos (`a()(b)(c)(d)`) confundem quem não está dentro do paradigma funcional diário.
- Testes podem exigir mais **setup** quando estado privado esconde demasiado sem interfaces claras.
- Em código crítico de performance, mais níveis de função não são gratuitos — mede se estás em *hot path*.

---

### Relação com listas e estruturas de dados

Alguns autores mostram **pilha funcional** usando closures para esconder lista interna — é o mesmo princípio de **capular dados** atrás de operações pequenas.

---

### Leitura complementar

Artigo curto com exemplos progressivos (pilha privada, selectors encadeados, ideias de API): [Closures, Currying, and Cool Abstractions](https://www.iamtk.co/closure-currying-and-cool-abstractions) (TK).

---

### Fecho

Closure responde a **“o que esta função ainda consegue ler?”** Currying responde a **“posso fixar argumentos cedo e ganhar nomes mais claros?”** Se ambas as perguntas melhoram legibilidade **no teu contexto**, usa; se não, código simples também é maduro.
