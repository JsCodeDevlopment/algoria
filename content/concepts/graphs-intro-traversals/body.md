## Grafos — do "caos de conexões" para método

Quando relações deixam de ser lineares ou hierárquicas, quase sempre você está em um problema de grafo:

- dependências entre serviços;
- malha de transporte;
- rede social;
- links entre páginas.

A boa notícia: quase todo problema inicial de grafo se resolve com o mesmo tripé:

1. representação;
2. percurso;
3. controle de visitados.

---

### Árvore x grafo (distinção crucial)

Toda árvore é um grafo, mas nem todo grafo é árvore.

Árvore tem:

- uma raiz (quando orientada);
- sem ciclos;
- caminho único entre nós.

Grafo geral pode ter:

- ciclos;
- múltiplos caminhos;
- componentes desconectadas.

Essa diferença muda completamente o algoritmo. Código de árvore sem `visited` costuma quebrar em grafo com ciclo.

---

### Vocabulário que precisa virar automático

- **vértice (nó)**: entidade.
- **aresta**: ligação.
- **grafo direcionado**: `u -> v` não implica `v -> u`.
- **grafo não direcionado**: ligação simétrica.
- **peso**: custo de aresta.
- **componente conectada**: subconjunto alcançável internamente.
- **grau**: número de arestas incidentes.

Com esse vocabulário claro, enunciados assustam menos.

---

### Representações: quando usar cada uma

#### Lista de adjacência

- memória `O(V + E)`;
- ótima para grafos esparsos;
- percorrer vizinhos é natural.

#### Matriz de adjacência

- memória `O(V²)`;
- consulta de aresta em `O(1)`;
- útil quando grafo é denso e `V` pequeno/moderado.

Regra prática: comece com lista de adjacência; mude só se houver motivo forte.

---

### BFS (largura): pensa em "ondas"

BFS usa fila e visita por camadas:

- primeiro distância 0;
- depois distância 1;
- depois distância 2...

Por isso, em grafo não ponderado, BFS encontra menor número de arestas.

Exemplo mental: sair de uma estação e expandir vizinhos por níveis.

---

### DFS (profundidade): pensa em "exploração de trilha"

DFS segue um caminho até onde der e depois retrocede.

É muito útil para:

- detectar ciclos;
- contar componentes;
- explorar estrutura de dependência;
- preparar ordenação topológica (em DAG).

Pode ser recursiva (simples) ou iterativa com pilha (mais controle de stack).

---

### BFS x DFS com critério de escolha

- use **BFS** quando objetivo é menor caminho por aresta (sem peso);
- use **DFS** quando objetivo é estrutura (ciclos, componentes, ordenação topológica).

Pergunta prática:
"quero distância mínima ou quero entender estrutura?"

Ela quase sempre decide a técnica inicial.

---

### Armadilhas que geram bug silencioso

- marcar `visited` tarde e enfileirar nó várias vezes;
- esquecer de iniciar BFS/DFS para todos os nós (grafo desconectado);
- tratar grafo dirigido como não dirigido;
- usar recursão profunda sem considerar limite de pilha.

Outra armadilha comum: "parece árvore" no sample, mas casos ocultos têm ciclos.

---

### Mini playbook de resolução

1. Classifique o grafo (dirigido? ponderado? desconectado?).
2. Escolha representação.
3. Defina objetivo (distância, ciclo, conectividade, ordem).
4. Escolha BFS/DFS inicial.
5. Defina política de `visited`.
6. Valide com caso mínimo e caso com ciclo.

---

### Checklist

- [ ] Sei justificar lista vs matriz?
- [ ] Sei dizer quando BFS garante menor caminho?
- [ ] Sei dizer por que DFS não garante menor caminho?
- [ ] Tratei componentes desconectadas?
- [ ] Testei ciclo explícito?

---

### Reflexão

Grafos ficam simples quando você para de pensar em desenho bonito e passa a pensar em protocolo de exploração. Representação certa + percurso certo + invariantes de visitados resolvem a maior parte dos casos iniciais.
