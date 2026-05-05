## Busca binária — engenharia de fronteiras, não truque de "dividir por dois"

A maioria aprende busca binária como: "pega o meio e corta metade".  
Isso funciona para o primeiro exercício, mas falha quando o problema muda um pouco:

- "quero a **primeira** ocorrência";
- "quero a **última** posição válida";
- "não existe array explícito, só uma função que vira `false -> true`".

Para dominar de verdade, você precisa trocar o template pelo raciocínio de **invariante**.

---

### O contrato central (invariante)

Durante todo o loop, deve ser verdade que:

- a resposta ainda está dentro de uma região candidata;
- tudo fora dessa região já foi provado como inválido.

Quando você atualiza `left` ou `right`, não está "chutando".  
Está preservando esse contrato.

Se o contrato não está explícito, a implementação vira tentativa e erro com chance alta de off-by-one.

---

### Duas convenções de intervalo (escolha uma e seja fiel)

#### 1) Intervalo fechado: `[left, right]`

- ambos os extremos participam;
- costuma usar `while (left <= right)`;
- comum para busca exata.

#### 2) Intervalo semiaberto: `[left, right)`

- inclui `left`, exclui `right`;
- costuma usar `while (left < right)`;
- excelente para `lower_bound`/`upper_bound`.

As duas funcionam. O problema é misturar regras das duas no mesmo algoritmo.

---

### Três padrões que você precisa saber sem hesitar

1. **Busca exata**  
   Retorna índice de `target` se existir.

2. **Lower bound** (`primeiro i com arr[i] >= target`)  
   Base de inserção ordenada e muitas contagens.

3. **Upper bound** (`primeiro i com arr[i] > target`)  
   Útil para faixa de repetições e limites de janela.

Diferenças parecem pequenas, mas mudam:

- o predicado do `if`;
- qual fronteira move;
- o valor final retornado.

---

### Exemplo didático comparativo

Array: `[1, 2, 2, 2, 4, 7]`, alvo `2`.

- busca exata pode devolver `1`, `2` ou `3` (depende de implementação);
- lower bound deve devolver `1`;
- upper bound deve devolver `4`.

Sem clareza sobre objetivo, você pode passar nos testes "fáceis" e falhar nos de borda.

---

### Busca binária no espaço de resposta (o nível seguinte)

Você não está buscando um elemento do array; está buscando o menor valor `x` que satisfaz uma condição.

Exemplos clássicos:

- menor capacidade de envio para concluir em `d` dias;
- menor velocidade para terminar uma tarefa em tempo limite;
- menor tamanho de bloco que atende restrição.

Nesses problemas, o requisito é **monotonicidade** do predicado:

- região `false` à esquerda;
- região `true` à direita.

Isso transforma otimização em busca binária.

---

### Armadilhas que causam bug em produção

- usar `mid = (l + r) / 2` em linguagem com risco de overflow;
- não documentar se retorno é índice ou "posição de inserção";
- esquecer comportamento quando alvo é menor que todos ou maior que todos;
- não tratar duplicatas explicitamente.

Boa prática: em cada variação, escreva no comentário:
"retorna primeiro índice que satisfaz X".

---

### Complexidade (e limites)

- Tempo: `O(log n)` por iteração de corte em domínio ordenado/monotônico.
- Espaço extra: `O(1)`.

Mas cuidado: se o predicado interno custa caro (ex.: `O(n)`), a complexidade final vira `O(n log n)`.

---

### Checklist de domínio real

- [ ] Defini formalmente o que significa "resposta correta"?
- [ ] Escolhi uma convenção de intervalo e segui até o fim?
- [ ] Minha invariante está escrita em frase simples?
- [ ] Testei casos de borda: vazio, 1 elemento, repetidos, extremo fora da faixa?
- [ ] Sei explicar por que o loop termina?

---

### Reflexão

Busca binária madura não é copiar cinco linhas da memória.  
É conduzir uma prova pequena a cada iteração: "o que descartei, descartei com justificativa".
