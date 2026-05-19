# Dijkstra — Caminhos Mínimos em Grafos Ponderados

## 1. O Problema Fundamental: A Rota Mais Curta com Pesos

Dado um **grafo ponderado** (arestas com pesos não negativos), um vértice de origem _s_, e um vértice de destino _t_ (ou todos os vértices), o Problema do Caminho Mínimo (SSSP — Single-Source Shortest Path) pergunta:

> Qual é a sequência de arestas que minimiza a _soma total dos pesos_ ao ir de _s_ até _t_?

**Aplicações críticas:**

- Roteamento GPS (menor tempo/distância)
- Redes de computadores (roteamento OSPF, IS-IS)
- Planejamento de rotas em logística
- Jogos (pathfinding com custos variados)
- Análise de redes sociais (grau de separação ponderado)

## 2. Por que Dijkstra? A Inadequação de BFS e Bellman-Ford

| Algoritmo        | Complexidade     | Funciona com pesos negativos?  | Ideal para                                    |
| ---------------- | ---------------- | ------------------------------ | --------------------------------------------- |
| **BFS**          | O(V + E)         | Não (assume peso unitário)     | Grafos não ponderados                         |
| **Bellman-Ford** | O(V × E)         | Sim (detecta ciclos negativos) | Grafos pequenos com pesos negativos           |
| **Dijkstra**     | O((V + E) log V) | **Não** (falha com negativos)  | Grafos esparsos a densos, pesos não negativos |

Dijkstra ocupa o **ponto ideal** de desempenho para a vasta maioria dos problemas reais (distâncias, tempos, custos — todos não negativos).

## 3. A Ideia Central: Relaxamento Guloso com Fronteira de Certeza

Dijkstra é um algoritmo **guloso** com invariante de otimalidade:

> **Invariante principal:** Quando um vértice é _extraído_ da fronteira, sua distância final é conhecida e jamais será melhorada.

O algoritmo mantém:

- `dist[v]`: melhor distância conhecida de _s_ até _v_ (inicialmente ∞, exceto `dist[s] = 0`)
- `visited[v]` (ou `settled`): vértices cuja distância mínima já foi _finalizada_
- **Priority Queue (Min-Heap)**: contém vértices _descobertos_ indexados por `dist[v]` estimada

### 3.1 O Processo Passo a Passo

```pseudo
1. dist[s] = 0; todos os outros = ∞
2. Inserir (s, 0) na PQ
3. Enquanto PQ não vazia:
4.     (u, dist_u) = PQ.extract_min()
5.     se u já foi visited: continue     # lazy deletion
6.     marcar u como visited
7.     para cada vizinho v de u com peso w(u,v):
8.         nova_dist = dist_u + w(u,v)
9.         se nova_dist < dist[v]:
10.            dist[v] = nova_dist
11.            predecessor[v] = u
12.            PQ.insert(v, nova_dist)   # ou decrease_key
```

**O relaxamento (linhas 8-11):** Se encontrarmos um caminho para _v_ via _u_ que seja melhor que o melhor conhecido, atualizamos `dist[v]` e inserimos _v_ na PQ com a nova prioridade.

## 4. Prova de Corretude: Por que a Estratégia Gulosa Funciona?

**Teorema:** Quando um vértice _u_ é extraído da PQ com distância `d`, `d` é a verdadeira distância mínima de _s_ até _u_.

**Prova por contradição:**

1. Suponha que exista um caminho _P_ mais curto de _s_ a _u_ com distância `d' < d`.
2. Seja _x_ o primeiro vértice neste caminho que ainda _não_ foi extraído (não está em `visited`).
3. Até _x_, o caminho usa apenas vértices já extraídos (que têm distâncias finais).
4. Como os pesos são **não negativos**, o subcaminho até _x_ tem distância `dist[x] ≤ d' < d`.
5. Mas então _x_ teria uma distância menor que _d_ e ainda estaria na PQ.
6. Isso contradiz o fato de que _u_ foi extraído como o mínimo da PQ.
7. Portanto, `d` é necessariamente a distância mínima.

**Intuição visual:** Dijkstra expande uma _fronteira de certeza_ como uma onda a partir da origem. Cada vértice é "queimado" (finalizado) no momento em que a onda o alcança pela primeira vez — e, com pesos não negativos, nunca haverá um caminho mais curto posterior.

## 5. Complexidade Detalhada: O Papel da Priority Queue

| Implementação da PQ | Tempo por operação                                              | Complexidade total |
| ------------------- | --------------------------------------------------------------- | ------------------ |
| **Array linear**    | extract_min: O(V), insert: O(1)                                 | O(V² + E) = O(V²)  |
| **Binary Heap**     | extract_min: O(log V), insert: O(log V)                         | O((V + E) log V)   |
| **Fibonacci Heap**  | extract_min: O(log V) amortizado, decrease_key: O(1) amortizado | O(V log V + E)     |

**Para grafos esparsos** (E ≈ V): `O(V log V)` com Fibonacci Heap é ótimo teórico.

**Para grafos densos** (E ≈ V²): a implementação com array (O(V²)) pode ser mais rápida devido à baixa constante.

### 5.1 Lazy Deletion vs. Decrease Key

**Lazy deletion** (inserir nova entrada sem remover a antiga):

```pseudo
# Ao extrair
if current_dist > dist[vertex]: continue
```

**Vantagem:** Simples, não precisa de operação `decrease_key`.
**Desvantagem:** A PQ pode crescer até O(E) entradas (cada aresta pode gerar uma inserção).

**Decrease key explícita** (atualizar prioridade in-place):

**Vantagem:** PQ mantém tamanho O(V).
**Desvantagem:** Requer mapeamento vértice → posição no heap.

## 6. Exemplo Concreto: Do Caos à Solução

**Grafo:**

```
        (4)
    A ------ B
    | \      |
  2 |  \3    | 1
    |   \    |
    C    \   D
    |     \  |
  5 |      \ | 2
    |       \|
    E ------ F
        (1)
```

**Execução com origem A:**

| Passo | Extraído | Distâncias (A,B,C,D,E,F) | Observação                     |
| ----- | -------- | ------------------------ | ------------------------------ |
| 0     | —        | (0, ∞, ∞, ∞, ∞, ∞)       | Inicial                        |
| 1     | A        | (0, 4, 2, 3, ∞, ∞)       | Relaxa A→B, A→C, A→D           |
| 2     | C        | (0, 4, 2, 3, 7, ∞)       | Relaxa C→E (2+5=7)             |
| 3     | D        | (0, 4, 2, 3, 7, 5)       | Relaxa D→F (3+2=5)             |
| 4     | B        | (0, 4, 2, 3, 7, 5)       | Relaxa B→D (4+1=5 > 3, ignora) |
| 5     | F        | (0, 4, 2, 3, 7, 5)       | F→E? (5+1=6 > 7, ignora)       |
| 6     | E        | finalizado               |                                |

**Caminho mínimo A→E:** A → C → E (custo 7)

## 7. Dijkstra em Diferentes Domínios: Adaptações Essenciais

### 7.1 Dijkstra com Pontos de Interesse (A\*)

**Problema:** Dijkstra explora em todas as direções igualmente.
**Solução A\*:** Adiciona heurística `h(v)` (distância estimada ao destino) → `f(v) = dist[v] + h(v)`.

- Heurística **admissível** (nunca superestima) garante otimalidade.
- Exemplo: distância euclidiana em mapas.

### 7.2 Dijkstra em Grade (Grid Pathfinding)

Para grades com movimento 4-direções ou 8-direções:

- Cada célula é um vértice.
- Arestas para vizinhos com peso = 1 (ou √2 para diagonais).
- Dijkstra se comporta como BFS com custos uniformes.
- **Substituível por BFS** se pesos forem unitários.

### 7.3 Caminho Mínimo com Restrições de Recursos

**Exemplo:** Menor tempo de viagem com limite de custo monetário.

- Torna-se um problema **bi-critério** (não resolvível com Dijkstra puro).
- Solução: Dijkstra em grafo de estados (vértice original × recurso consumido).

## 8. Armadilhas e Erros Comuns

### 8.1 Pesos Negativos: O Calcanhar de Aquiles

**Por que Dijkstra falha com pesos negativos?**

Considere o grafo:

```
    A --(5)--> B --(-10)--> C
     \                   /
      \---(3)-----------/
```

Dijkstra extrai A (dist 0), relaxa para B(5) e C(3). Extrai C(3) e finaliza C com dist=3. Mas o caminho A→B→C custa 5 + (-10) = -5, que é **menor** que 3. O vértice C foi finalizado precocemente porque o peso negativo permitiu um caminho mais curto _depois_ da extração.

**Solução:** Use Bellman-Ford (O(V×E)) ou SPFA para grafos com negativos.

### 8.2 Grafos com Arestas de Peso Zero

Pesos zero **são permitidos** e não quebram a prova de corretude. Dijkstra funciona normalmente.

### 8.3 Múltiplas Origens (Multi-Source Dijkstra)

**Problema:** Distâncias para o conjunto de vértices mais próximo em um conjunto de origens.

**Solução:** Inicialize `dist[origem] = 0` para **todas** as origens na PQ. O algoritmo naturalmente encontra a distância para a origem mais próxima.

Aplicação: "Qual é o posto de gasolina mais próximo?"

## 9. Aplicações Reais Avançadas

### 9.1 Roteamento em Redes (OSPF)

- **Open Shortest Path First:** Dijkstra é executado em cada roteador.
- **Grafo:** Rede de roteadores como vértices, enlaces como arestas com custos (largura de banda, delay, confiabilidade).
- **Desafio:** Convergência rápida em topologias dinâmicas.

### 9.2 Planejamento de Trajetória Robótica

- **Occupancy Grid Map:** Células livres vs. obstáculos.
- **Pesos:** 1 para células livres, ∞ (ou muito alto) para obstáculos.
- **Variante:** Dijkstra com campos potenciais para evitar mínimos locais.

### 9.3 Bioinformática: Alinhamento de Sequências

- **Grafo de edição:** Vértices = posições (i,j) em duas sequências.
- **Arestas:** match (peso 0), mismatch/substituição (peso 1), indel (peso 1).
- **Dijkstra** encontra o alinhamento de distância mínima de edição (Levenshtein).

### 9.4 Jogos e Pathfinding em Tempo Real

- **Dijkstra** é usado para pré-computar _distâncias para todos os vértices_ quando o grafo é estático.
- **Em tempo real:** A\* é preferível para um único par origem-destino.
- **Hierarchical Dijkstra:** Pré-computa caminhos entre regiões (abstração de mapa).

## 10. Otimizações e Variantes de Alto Desempenho

### 10.1 Bidirectional Dijkstra

**Ideia:** Execute Dijkstra simultaneamente da origem _e_ do destino até que as duas frentes se encontrem.

**Ganho:** Reduz a área explorada drasticamente (~fator 2 em malhas, exponencial em grafos lineares).

**Desafio:** Critério de parada correto (o ponto de encontro pode não estar na fronteira mínima).

### 10.2 Dial's Algorithm (Bucket Dijkstra)

**Quando usar:** Pesos inteiros pequenos (ex: mapa rodoviário com distâncias em km inteiros).

**Mecanismo:** Substitui a PQ por um array de _buckets_ indexado pela distância.

**Complexidade:** O(V + E + C) onde C = distância máxima.

**Vantagem:** Remove o fator logarítmico do heap.

### 10.3 Radix Heap

**Compromisso:** Aceita pesos reais (não só inteiros) com desempenho próximo a O(V + E) amortizado.

**Implementação:** Mantém vários buckets com intervalos exponenciais.

## 11. Complexidades Detalhadas (Teóricas vs. Práticas)

| Implementação        | Pior caso teórico             | Constante                    | Uso recomendado                        |
| -------------------- | ----------------------------- | ---------------------------- | -------------------------------------- |
| Binary Heap + Lazy   | O((V + E) log E) ≈ O(E log V) | Baixa                        | Grafos esparsos, implementação simples |
| Binary Heap + DecKey | O((V + E) log V)              | Média                        | Quando decrease_key é eficiente        |
| Fibonacci Heap       | O(V log V + E)                | **Alta** (na prática, lenta) | Apenas teórico                         |
| Dial (Buckets)       | O(V + E + C)                  | Muito baixa                  | Pesos inteiros pequenos                |
| Array (denso)        | O(V²)                         | Muito baixa                  | Grafos densos (E ≈ V²)                 |

**Na prática:** `Binary Heap + Lazy Deletion` é a escolha mais comum por equilíbrio entre simplicidade e desempenho.

## 12. Conclusão: O Algoritmo Guloso que Mudou o Mundo

Edsger Dijkstra publicou seu algoritmo em 1959 — e em poucas páginas, transformou o problema de caminhos mínimos de um desafio computacional em uma rotina cotidiana. A elegância está na **simplicidade da invariante**: _nunca precisamos revisitar uma decisão_.

> "Dijkstra não pergunta 'qual é o melhor caminho inteiro?'. Ele pergunta 'qual é o próximo vértice mais próximo que posso finalizar com certeza?' — e essa pergunta, respondida repetidamente com uma fila de prioridade, converge para a solução global em tempo quase linear."

**Memorize:** Dijkstra = Relaxamento guloso + Fronteira de certeza + Priority Queue.

---

## Anexo: Implementação Completa em Pseudocódigo (Binary Heap + Lazy)

```pseudo
function dijkstra(Graph, source):
    V = Graph.vertices
    dist = array[V] initialized to INFINITY
    prev = array[V] initialized to NULL
    dist[source] = 0

    PQ = MinHeap()
    PQ.insert( (source, 0) )

    while not PQ.isEmpty():
        (u, dist_u) = PQ.extract_min()

        # Lazy deletion check
        if dist_u > dist[u]:
            continue

        # Finalize u (implicitamente, visitado)
        for each edge (u, v) with weight w in Graph.adjacent(u):
            new_dist = dist_u + w

            if new_dist < dist[v]:
                dist[v] = new_dist
                prev[v] = u
                PQ.insert( (v, new_dist) )

    return (dist, prev)

function reconstruct_path(prev, source, target):
    path = []
    current = target
    while current != NULL:
        path.prepend(current)
        current = prev[current]
    return path if path[0] == source else []
```

**Caso de uso típico:**

```pseudo
dist, prev = dijkstra(road_network, "A")
print(f"Distância até Z: {dist['Z']}")
print(f"Caminho: {reconstruct_path(prev, 'A', 'Z')}")
```

---

## Bônus: Demonstração da Falha com Pesos Negativos

```pseudo
# Grafo de contraexemplo
Graph = {
    'A': [('B', 1), ('C', 4)],
    'B': [('C', -3)],   # peso negativo!
    'C': []
}

# Dijkstra ingênuo:
# 1. Extrai A (dist 0) → relaxa B(1), C(4)
# 2. Extrai B (dist 1) → relaxa C(1 + (-3) = -2)
#    Atualiza C para -2, insere C na PQ
# 3. Extrai C (dist 4? ou -2? depende da implementação)
#    Se extraiu o C antigo (4), ele finaliza C errado.
#    Se extraiu o C novo (-2), funciona para este caso,
#    mas ainda pode falhar em grafos mais complexos.
```

O exemplo mostra que a corretude depende de implementar _lazy deletion_ e extrair apenas entradas atuais — mesmo assim, Dijkstra _não_ garante otimalidade com negativos.

**Para pesos negativos, use Bellman-Ford:**

```pseudo
# Bellman-Ford: relaxa todas as arestas V-1 vezes
for i = 1 to V-1:
    for each edge (u,v) with weight w:
        if dist[u] + w < dist[v]:
            dist[v] = dist[u] + w
# Uma iteração extra detecta ciclos negativos
```

Dijkstra permanece, porém, como a ferramenta definitiva para a vasta maioria dos problemas de caminho mínimo no mundo real — onde distâncias, tempos e custos são naturalmente não negativos.
