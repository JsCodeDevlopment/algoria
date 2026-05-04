## A pergunta em linguagem direta

Tens uma lista de números inteiros (positivos, negativos e zero).

Precisas encontrar **todas as combinações de três números diferentes** (em posições diferentes da lista) cuja **soma dá zero** — tipo `(-2) + 1 + 1 = 0`.

Regras típicas deste desafio:

- Não podes repetir o **mesmo trio** de valores mais do que uma vez (mesmo que apareça por caminhos diferentes de índices).
- A ordem dentro de cada trio pode ser qualquer uma, e a ordem da lista final também costuma não ser fixa.

---

## Intuição rápida sem jargão financeiro

Imagina equilibrar uma balança em três pesos: valores negativos "puxam" para um lado, positivos para o outro, e queres **três marcas** cuja soma neta fique no meio neutro (zero).

---

## O que vês nas duas soluções

**Primeira:** experimenta **todas** combinações possíveis com três níveis de repetição (`i`, `j`, `k`) — traduz a definição quase palavra‑a‑palavra, mas fica lenta quando a lista cresce.

**Segunda:** **ordena primeiro** e, para cada escolha fixa do primeiro número, resolve o resto com **dois ponteiros** (começando nos extremos disponíveis da sublista), aproveitando que a ordem ajuda a saber se precisas aumentar ou diminuir a soma.
