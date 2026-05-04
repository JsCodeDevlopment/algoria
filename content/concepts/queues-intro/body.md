## Fila ("queue") — primeiro a entrar, primeiro a sair

Analogia trivial: uma **fila numa pastelaria**.

- Entram clientes pela porta e formam uma linha.
- O **primeiro que chegou** é normalmente **o primeiro que é servido**.
- Esta regra tem nome: **FIFO** (*first in, first out* — "o primeiro que entra é o primeiro que sai").

No código aparece assim:

- **Entrar na fila** — `enqueue`: o novo elemento cola-se ao fim.
- **Sair da fila** — `dequeue`: tiras sempre quem está na **frente** da fila (há mais tempo à espera).

Muitas vezes implementamos isto num array usando dois marcadores (`início`, `fim`) ou usando uma estrutura com ligações.

---

### Para que isto aparece nos algoritmos?

- Pesquisas em largura (**BFS**): imagina ondas à volta de um ponto central — queres sempre tratar primeiro os vértices **descobertos mais cedo** naquele nível antes de ires "mais para longe". Uma fila encaixa nessa forma de trabalhar camada por camada.

- Escalonamento onde queres **fairness temporal** entre tarefas (quem esperou mais tempo começa primeiro).

---

### Comparar rapidamente com a pilha (“stack”)

Na **pilha** (como o botão *voltar* do navegador), o último a entrar costuma ser o primeiro a sair (**LIFO**). Na **fila**, o primeiro a entrar é o primeiro a sair (**FIFO**). Quando comparas com a pilha, são ordens de prioridade opostas.

---

### Erro comum quando estamos a começar

Confundimos **de onde estamos a retirar** — se tirarmos sempre do lado errado, já não temos FIFO e o comportamento esperado de um algorismo clássico (por exemplo uma BFS) deixa de fazer sentido.

---

### Dica quando lês enunciados

Se o texto sugere "**camadas por camadas**", "**expandir primeiro os vizinhos mais próximos**" ou ideias assim, faz a pergunta: **preciso mesmo de comportamento de fila, ou estou só a repetir código de pilha por hábito?**

---

### Modelo mental da API

- **`enqueue`** — novo elemento entra pela **retaguarda** (*back* / fim).
- **`dequeue`** — sai sempre pela **frente** (*front* — quem espera há mais tempo).
- **`front`**, **`back`**, **`is_empty`**, **`size`** — fecham o mesmo contrato minimalista que vês em materiais didáticos estruturados.

---

### Armadilha clássica de implementação

Num array Python usar `pop(0)` no início é FIFO conceptualmente, mas **deslocar elementos** pode tornar `dequeue` linear no tamanho da fila — óptimo para entender o modelo, perigoso em escala. Em produção usa-se frequentemente **índices circulares** ou **lista ligada dedicada**.

---

### Onde aparece fora dos grafos?

Pedidos a um **servidor** modelam-se naturalmente como fila: primeiro pedido aceite tende a ser o primeiro processado quando o sistema é justo por ordem de chegada.

---

### Leitura complementar

Artigo curto com uso encadeado `enqueue`/`dequeue` e notas de complexidade: [Queue Data Structure](https://www.iamtk.co/series/data-structures/queue-data-structure) (TK).

