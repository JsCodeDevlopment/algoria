## O que estás mesmo a pedir ao computador

Há dois textos:

- `s`: o texto maior onde vamos “caçar” um pedaço contínuo.
- `t`: o modelo com as letras obrigatórias (contando quantidade — se aparece `@` dois `x`, precisas de pelo menos dois `x` no pedaço final).

Precisamos devolver:

- **a menor substring possível de `s` (contínua, sem saltos)** que ainda contenha tudo o que `t` exige  
  **ou**
- `""` (string vazia) quando isso não se consegue (por exemplo, não há símbolo suficiente em `s`).

---

## O truque visual “janela deslizante”

Imagina um retângulo transparente sobre a linha das letras. Expande até cobrires todas obrigações; depois vai **encerando pela esquerda** contanto continues válido porque tentas menor largura.

---

## Como as duas soluções aparecem

A primeira faz **literalmente todas** combinações começo‑fim (muito intuitiva porque testa sempre definições, mas cara em textos longos).

A segunda mantém dois ponteiros e contagens rápidas de letras porque **nem sequer volta ao princípio sempre** porque mapa apenas guia caminhadas — método profissional clássico.
