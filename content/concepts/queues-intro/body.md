# Fila (Queue) — A Estrutura da "Ordem e Justiça"

A **Fila** é uma estrutura de dados linear que segue um princípio muito simples e democrático: quem chega primeiro, é atendido primeiro. No mundo da computação, chamamos isso de **FIFO** (*First-In, First-Out*).

---

## 1. O Modelo Mental: A Fila do Pão

Imagine uma fila em uma padaria:
1.  Se você chega agora, você entra no **final** da fila.
2.  A pessoa que está no **início** da fila é a próxima a ser servida e sair.
3.  Ninguém (em condições normais) fura a fila ou sai pelo meio.

### Terminologia Chave:
-   **Front (Frente):** Onde os elementos saem (o "caixa").
-   **Rear/Back (Retaguarda):** Onde os novos elementos entram.
-   **Enqueue (Enfileirar):** O ato de adicionar alguém ao fim.
-   **Dequeue (Desenfileirar):** O ato de remover quem está na frente.

---

## 2. Operações e Complexidade

Diferente de um Array comum, onde você pode acessar qualquer índice instantaneamente, em uma Fila "pura" você só interage com as extremidades.

| Operação | Descrição | Complexidade (Ideal) |
| :--- | :--- | :--- |
| `enqueue` | Adiciona um item ao final | **O(1)** |
| `dequeue` | Remove o item da frente | **O(1)** |
| `peek/front` | Retorna o item da frente sem remover | **O(1)** |
| `isEmpty` | Verifica se a fila está vazia | **O(1)** |

> **⚠️ A Armadilha do Array:** Em muitas linguagens (como JavaScript ou Python), fazer um `array.shift()` para remover o primeiro elemento é uma operação **O(n)**, pois o computador precisa deslocar todos os outros elementos uma posição para o lado. Em implementações profissionais, usamos Listas Ligadas ou ponteiros para manter tudo em **O(1)**.

---

## 3. Implementação Prática (TypeScript)

Aqui está como construir uma fila performática que evita o custo de realocação de memória:

```typescript
class Queue<T> {
  private items: Record<number, T> = {};
  private frontIndex: number = 0;
  private backIndex: number = 0;

  // Adiciona ao final - O(1)
  enqueue(item: T): void {
    this.items[this.backIndex] = item;
    this.backIndex++;
  }

  // Remove da frente - O(1)
  dequeue(): T | undefined {
    if (this.isEmpty()) return undefined;

    const item = this.items[this.frontIndex];
    delete this.items[this.frontIndex];
    this.frontIndex++;
    return item;
  }

  // Apenas espia o próximo da fila - O(1)
  peek(): T | undefined {
    return this.items[this.frontIndex];
  }

  isEmpty(): boolean {
    return this.backIndex - this.frontIndex === 0;
  }

  size(): number {
    return this.backIndex - this.frontIndex;
  }
}
```

---

## 4. Quando usar uma Fila? (Casos de Uso)

As filas são essenciais sempre que a **ordem cronológica** precisa ser preservada ou quando o processamento é **assíncrono**.

1.  **Algoritmo BFS (Breadth-First Search):** Para explorar grafos ou árvores nível por nível (explorar todos os vizinhos antes de ir para o próximo nível).
2.  **Sistemas de Mensageria:** Como RabbitMQ ou AWS SQS, onde milhares de pedidos chegam e precisam ser processados por ordem de chegada.
3.  **Escalonamento de CPU/Impressora:** O sistema operacional organiza quais processos ou documentos serão executados primeiro.
4.  **Buffers de Rede:** Pacotes de dados que chegam no roteador e esperam para ser encaminhados.

---

## 5. Fila vs. Pilha (Stack)

É muito comum confundir as duas no início. Guarde esta tabela:

| Característica | Fila (Queue) | Pilha (Stack) |
| :--- | :--- | :--- |
| **Princípio** | **FIFO** (Primeiro a entrar, primeiro a sair) | **LIFO** (Último a entrar, primeiro a sair) |
| **Metáfora** | Fila de Banco | Pilha de Pratos |
| **Operação Principal** | Enqueue / Dequeue | Push / Pop |
| **Foco** | Ordem de chegada / Justiça | Reverter ordem / Histórico |

---

## 6. Variações Avançadas

*   **Priority Queue (Fila de Prioridade):** Os elementos têm um "VIP". Alguém com prioridade alta passa na frente, mesmo tendo chegado depois.
*   **Deque (Double-Ended Queue):** Uma fila "rebelde" onde você pode adicionar ou remover de ambos os lados (início e fim).
*   **Circular Queue:** Usada em sistemas de baixo nível para economizar memória, onde o "fim" da fila se conecta com o "início" vago.

---

## 7. Dica para Entrevistas

Se o problema pedir para **"processar elementos em camadas"** ou **"achar a distância mais curta em um mapa não ponderado"**, seu cérebro deve gritar: **FILA!**

Lembre-se também de perguntar ao entrevistador: *"Devo me preocupar com a performance do `shift()` se eu usar um array simples?"*. Isso mostra que você entende a diferença entre teoria e implementação real.


