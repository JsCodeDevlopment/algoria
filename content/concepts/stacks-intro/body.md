## Pilha ("stack") — o último a entrar é o primeiro a sair

Pensa na **pilha de pratos lavados**:

- Pia cheia: é mais fácil tirar sempre o último que empilhaste no topo da pilha física que estás a usar.
- Esta regra (**LIFO** — *last in, first out*) modela comportamento onde **voltas onde estavas há pouco**.

Em código, as operações costumam chamar-se **`push`** (coloca no topo) e **`pop`** (retiras do topo). Não "furas" pelo meio — isso passa a outro tipo de estrutura.

---

### Para que serve uma pilha quando o problema *não* fala em pratos?

Muitos padrões tratam o caso "**abrir algo agora** e só **mais tarde** descobrir o **fecho** que lhe corresponde":

- Parentesis `(...)`, `{...}` válidos — cada símbolo de abrir espera encontrar um par quando avançamos no texto.

Também vais usar uma **pilha monótona**: guardas índices (ou valores) onde manténs invariante de maior/menor, e quando aparece algo que "quebra" a regra, desempilhas o que já não vale a pena manter guardado assim (exemplo clássico: **temperatura** — problema "Daily Temperatures").

---

### Analogia útil mesmo sem código

Um botão "**voltar**" no navegador: regressas sempre à página anterior que visitaste há pouco — o comportamento mais recente é o primeiro a ser desfeito.

---

### Stack ou fila ("queue")?

Numa **fila**, quem chegou primeiro costuma ser atendido primeiro (**FIFO**, *first-in first-out*) — tipo fila ao supermercado. Num **stack**, o último a entrar é o primeiro a sair (**LIFO**).

---

### Erro inicial clássico

Queres tratar o **fundo** da pilha como se fosse o **topo** sem ter claro o que está em cima — aparecem erros de lógica e de índice.

---

---

### Modelo mental da API

Independentemente da linguagem, pensa num contrato pequeno:

- **`push`** — coloca no **topo**.
- **`pop`** — retira do **topo** (e falha ou devolve sinal claro se estiver vazio).
- **`peek` / `top`** — espreitar o topo **sem** remover (útil para depuração).
- **`is_empty`**, **`size`** — perguntas baratas para invariantes em testes.

Isto alinha-te com artigos de referência que implementam a pilha explicitamente — ver secção no fim.

---

### Complexidade e implementação

Num array dinâmico onde o **topo** é sempre o fim da lista, `push` e `pop` amortizam bem (**tempo constante** na prática). O espaço é proporcional ao número de elementos guardados.

Se implementares com estrutura diferente, volta sempre à pergunta: **“estou sempre a acrescentar e retirar do mesmo lado?”**

---

### Mais dois exemplos do mundo real

- **Desfazer (*undo*)**: cada alteração empilha um estado; desfazer dá `pop` ao estado mais recente.
- **Inverter uma sequência**: empilhar tudo e depois desempilhar reproduz ordem inversa (útil como exercício mental antes de algoritmos mais densos).

---

### Leitura complementar

Texto em inglês com implementação passo-a-passo em Python e exemplo de inverter lista: [Stack Data Structure](https://www.iamtk.co/series/data-structures/stack-data-structure) (TK).

