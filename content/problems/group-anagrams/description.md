## O problema contado como história

Tens uma lista de palavras (por exemplo nomes de pratos num menu caótico).

Duas palavras são **“da mesma família”** se usam **exactamente as mesmas letras as mesmas vezes** — só mudando a ordem. Na linguagem clássica chamam-lhe **anagramas entre si**.

O teu trabalho é **agrupar** todas as palavras que são anagramas umas das outras **no mesmo saco**. Palavras que não se misturam com ninguém ficam sozinhas num saco com elas próprias.

---

## Sem formalismo: o que estás literalmente a fazer

Imagina que cada palavra é um conjunto de cartas de Scrabble.

- `eat` e `tea` usam as mesmas cartas ⇒ **mesmo grupo**.
- `tan` e `nat` idem.
- `bat` não troca com nenhum dos outros exemplos ⇒ **grupo único**.

---

## Porque isto é um salto de dificuldade “médio”

A ideia é fácil de dizer em voz alta; o truque é **não comparar cada palavra com todas as outras para sempre** quando a lista cresce.

Uma solução mais directa **procura um representante** de cada grupo abrindo os sacos um a um.

Outra cria uma **etiqueta canónica** (uma “impressão digital” da palavra) e usa uma agenda rápida para saber em que saco ela cai — muito parecido com contar letras ou ordenar letras só para obter essa etiqueta.
