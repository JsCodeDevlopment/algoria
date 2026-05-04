## A ideia

A forma mais directa, sem pensar em truques: **testa todos os pares
possíveis** de elementos do array e devolve o primeiro par cuja soma
seja `target`.

Para um array de tamanho `n` existem `n × (n-1) / 2` pares
(combinatória básica). Vamos visitá-los todos no pior caso, daí o
custo `O(n²)`.

## Quando é "boa o suficiente"

- Quando `n` é pequeno (digamos, ≤ 1000).
- Quando precisas de uma solução **rápida de escrever** num white-
  board e não tens memória extra disponível (o `O(1)` de espaço pode
  ser exigido em entrevistas para sistemas embarcados).
- Quando a clareza do código é mais importante do que a performance —
  a leitura do brute-force é trivial.

Vais ver no player que **não há nada de errado** com este código —
ele é correcto. Só não escala.
