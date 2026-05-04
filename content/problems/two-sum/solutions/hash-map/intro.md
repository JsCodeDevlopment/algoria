## A grande ideia: o complemento

Reescreve a equação na tua cabeça:

```
nums[i] + nums[j] === target
```

Reorganiza para isolar o segundo termo:

```
nums[j] === target - nums[i]
```

A `target - nums[i]` chamamos o **complemento** de `nums[i]`. Em vez
de procurar pares, procuramos: *"existe no array um número que seja
exactamente o complemento do que estou a olhar agora?"*

## Porquê hash map

Se uses um array para responder à pergunta "este número existe?",
demoras `O(n)` (tens de varrer). Um **hash map** responde em `O(1)`
amortizado — o trade-off é que ocupa memória extra (até `O(n)`).

Para Two Sum, a memória extra paga-se: o tempo cai de `O(n²)` para
`O(n)`. Para `n = 10000` (o constraint máximo do problema), isso é a
diferença entre **100 milhões de operações** e **10 mil**. Quatro
ordens de grandeza.

## A truque-chave: registar **depois** de procurar

Na ordem do loop, primeiro **procuramos** o complemento, e só depois
**registamos** o número actual. Esta ordem é crucial e está
explicada na linha-a-linha — fica atento.
