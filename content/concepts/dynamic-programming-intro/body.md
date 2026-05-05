## Programação dinâmica — transformar explosão combinatória em processo controlado

Programação dinâmica (DP) é, no fundo, uma disciplina para não recalcular as mesmas coisas.

Ela aparece quando:

- recursão ingênua repete subproblemas;
- árvore de decisões cresce muito rápido;
- brute force fica inviável.

DP não é "fórmula mágica". É modelagem de estado + reutilização.

---

### Diagnóstico: quando DP é candidata forte

Procure estes sinais:

- objetivo é "máximo", "mínimo", "número de formas", "custo ótimo";
- decisões locais afetam decisões futuras;
- há subproblemas sobrepostos;
- você consegue escrever uma recorrência.

Sem recorrência clara, ainda não é hora de codar DP.

---

### Três perguntas que definem a solução

1. **Estado:** qual informação mínima identifica um subproblema?
2. **Transição:** como sair de estados menores para o atual?
3. **Base:** onde o problema para e retorna valor conhecido?

Se uma dessas partes estiver vaga, o código fica frágil.

---

### Top-down vs bottom-up (com critério real)

#### Top-down (memoização)

- começa pela definição recursiva natural;
- adiciona cache para evitar repetição;
- ótimo para validar modelo rápido.

#### Bottom-up (tabulação)

- define ordem explícita de preenchimento;
- evita custo de stack recursiva;
- facilita otimizar memória com janelas/linhas.

Use top-down para descobrir, bottom-up para endurecer performance.

---

### Exemplo mental recorrente

Problema tipo "máximo valor até índice `i`":

- escolher item atual;
- ou pular item atual;
- combinar com resultado ótimo de estado anterior.

Esse esqueleto reaparece em:

- house robber;
- subset variants;
- knapsack simplificados;
- sequências com escolhas locais.

Aprender o padrão de estado vale mais que decorar 20 exercícios.

---

### Complexidade: como ler de forma madura

Sem DP:

- comum ver `O(2^n)` (árvore de escolhas).

Com DP:

- tempo tende a `O(numero_de_estados * custo_da_transição)`;
- espaço tende a `O(numero_de_estados)` (ou menos, com compressão).

Essa fórmula geral é mais útil do que decorar apenas `O(n)` ou `O(n²)`.

---

### Erros clássicos (e por que acontecem)

- estado grande demais -> memória explode;
- estado pequeno demais -> perde informação e erra recorrência;
- base incorreta -> tabela toda contaminada;
- ordem de preenchimento errada -> usa valor ainda não calculado;
- cache mal indexado -> colisão de estados diferentes.

Quase todo bug de DP vem de modelagem, não de sintaxe.

---

### DP x Greedy (comparação honesta)

- **Greedy**
  - decide localmente;
  - simples e rápido;
  - precisa prova de escolha gulosa.

- **DP**
  - considera múltiplas opções por estado;
  - mais robusta quando greedy falha;
  - custo de implementação e memória maior.

Fluxo comum:

1. tenta greedy e procura contraexemplo;
2. se quebrar, formaliza DP.

---

### Checklist de construção

- [ ] Estado é mínimo e suficiente?
- [ ] Transição cobre todas as decisões válidas?
- [ ] Casos base estão matematicamente corretos?
- [ ] Ordem de preenchimento respeita dependências?
- [ ] Complexidade foi derivada por número de estados?
- [ ] Casos pequenos batem com simulação manual?

---

### Reflexão

DP é menos sobre "ser bom em matemática" e mais sobre saber modelar informação ao longo do tempo. Quem domina estado e transição consegue resolver famílias inteiras de problemas com confiança.
