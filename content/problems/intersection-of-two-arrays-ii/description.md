## O que significa "interseccionar" estas duas listas

Tens dois sacos de números: **`nums1`** e **`nums2`**.

Queres montar uma **terceira lista** só com números que **existem nos dois sacos ao mesmo tempo**.

A regra importante: se o número aparece **várias vezes** em cada saco, só podes repetir no resultado **até ao mínimo das duas contagens** naquele número.

Exemplo intuitivo:

- Se `5` aparece 3 vezes num saco e 1 vez noutro ⇒ no máximo **1** cópia `5` no resultado.
- Se aparece 2 vezes em cada ⇒ podes pôr **2** cópias no resultado.

A ordem dos números na resposta pode ser qualquer — desde que as **quantidades** façam sentido conforme esta regra.

---

## Como as duas soluções dizem isto ao computador

Uma faz uma comparação "peça‑a‑peça": para cada elemento duma lista vasculha a outra retirando o correspondente sempre que aparece igual — comporta‑se literalmente como alguém a **remover fisicamente pares repetidos**.

Outra faz **primeiro estatísticas** (contar quantas vezes aparece cada valor num saco), e depois gasta esse stock sempre que aparece igual no segundo saco — é como ter **inventários** bem claros à frente.
