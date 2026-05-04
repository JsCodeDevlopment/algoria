## O que estás a reorganizar

Tens uma lista de números. Alguns desses números são **`0`**.

Queres **reordenar a mesma lista** para que:

- Todos os **números que não são zero** fiquem **à frente**, na **mesma ordem relativa** em que já apareciam (se `7` vinha antes de `3`, isso mantém‑se assim que tirares zeros do caminho).
- Todos os **zeros** ficam **no fim** (também com uma ordem relativa consistente quando há vários zeros — se importa em problemas próximos, aqui tratamos como agrupamento simples típico do exercício).

---

## Em linguagem de “mudar lugares à mesa"

Imagina uma fila de cadeiras. Queres tirar sempre as cadeiras “vazias” (zeros) para o **fim da fila**, sem trocar a ordem de quem já estava correctamente à frente antes.

---

## As duas formas típicas de o fazer (que vês no Algoria)

Uma abordagem é **escrever primeiro todos os não‑zeros** (na ordem em que surgem) e **preencher o resto com zeros**. É muito fácil de explicar a alguém sem código.

Outra tenta fazer isso **com trocas sucessivas** ou **um “empurra para a direita”**, sem criar listas auxiliares grandes — é mais “truque de dedos”, mas economiza memória extra em contextos onde isso importa.
