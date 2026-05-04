## Em palavras simples

Tens **duas listas de números**, e **cada lista já vem ordenada** do menor para o maior.

A lista maior chama-se **`nums1`**. No fim dela já existem “lugares ocupados só por placeholder” (`0`), pensados desde o início só para conseguires **meter a segunda lista lá dentro**.

A segunda lista (**`nums2`**) só tem números “a sério”. O problema diz-te quantos números reais já existiam em cada uma, para saberes que há espaço combinado suficiente.

**O que tens de fazer:** misturar tudo dentro de **`nums1`**, no fim, **ainda ordenado** do menor para o maior — **sem** criar uma terceira lista enorme paralela só para fugir ao exercício.

---

## Uma analogia rápida

É como teres **dois jogos de cartas já ordenados** na mão — um maço maior já com espaço vazio atrás onde vais meter o maço menor — e queres ficar **com um só maço bem ordenado** usando só esse espaço.

---

## Como vais ler as duas soluções no Algoria

Uma abordagem é **mentalmente permissiva**: junta só a zona que interessa à fusão e deixa uma função genérica ordenar esse pedaço. É simples de explicar, mas ignora parte da informação útil (“já estava ordenado em dois blocos”) e torna‑se cara quando os arrays ficam grandes.

A outra aproveita a ordenação já existente: **começa pelo fim**, onde já sabes onde vão ficar temporariamente os maiores números, e vai **decidindo sempre qual dos dois valores “da ponta atual” vai ocupar cada posição atrás**.