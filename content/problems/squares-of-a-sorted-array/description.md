## O problema em linguagem direta

Tens uma lista de números **já ordenada** do menor para o maior.

Queres **outra lista** com os **quadrados** desses números (cada número multiplicado por si próprio), mas **também ordenada** do menor para o maior.

Porque não basta só “squarear nesta ordem”? Porque valores **negativos** à esquerda, ao ficarem ao quadrado, podem disparar valores grandes positivos que **misturam** com os quadrados vindos dos positivos grandes à direita. A ordem “óbvia” salta assim que tens negativos no meio.

---

## Imagina três cenários rápidos

1. Lista só positivos ⇒ ao quadrado ficam sempre **maior à medida que o original era maior** — o resultado já vem na ordem certa se fores de esquerda para a direita.
2. Lista só negativos ⇒ ao quadrado os **menores (mais negativos)** viram os **maiores quadrados** — então o maior quadrado normalmente nasce do **extremo esquerdo**.
3. Lista mista ⇒ muitas vezes o **maior quadrado** vem de um extremo (o negativo mais “forte” ou o positivo mais “forte”) — por isso comparar **os dois lados** ajuda.

---

## As duas soluções que vais abrir

Uma é “**pragmática**”: calcula todos os quadrados e deixa o algoritmo de ordenação genérico arrumar tudo. É fácil de explicar, mas ignora que **já tinhas muita informação** sobre a forma do input.

Outra **usa a ordenação original** inteligentemente para ir preenchendo o resultado desde o **fim**, comparando sempre os dois candidatos fortes vindos das **duas pontas**. Normalmente faz **uma volta só**.
