## O que já estamos a perguntar (sem fugir aos detalhes do enunciado)

Tens um texto **`s`** (letras maiúsculas ou pequenas, números, eventualmente espaços ou outros símbolos).

Um **palíndromo** aqui só significa: se leres apenas os caracteres “importantes”, da esquerda para a direita e também da direita para a esquerda, **a sequência coincide**.

Neste problema clássico:

- Os espaços extra não contam para a comparação.
- Símbolos que não são **letras** nem **algarismos** podem aparecer mas são tratados como se não existissem para o teste palíndromo.
- As letras comparam‑se ignorando maiúsculas/minúsculas.

Se ficar igual de frente‑para‑trás e vice‑versa, devolve **`true`**.

---

## Intuição rápida (com uma frase já “limpinha”)

Coloca dois dedos: um na primeira letra ou algarismo válido à esquerda e **outro** na primeira à direita.

Compara sempre o par. Os dedos caminham uns para dentro, outros também, até decidires.

---

## O que vês nas duas implementações aqui no Algoria

Uma faz **explicitamente esse caminho dois‑a‑dois desde as pontas até ao meio** — é só a analogia física aplicada ao código.

Outra faz uma limpeza (fica apenas com letras e números no formato que queres comparar), depois compara contra uma cópia **invertida** — muito “óbvia aos olhos” humanos, porque vês duas linhas lado a lado e perguntas se são iguais.
