## Ordenação — custo, semântica e previsibilidade

Ordenar não é só "colocar em ordem crescente". Em problemas reais, a ordenação muda o que você consegue fazer depois:

- habilita busca binária;
- permite two pointers;
- simplifica remoção de duplicatas;
- organiza ranking e relatórios.

A pergunta correta não é "qual algoritmo é mais famoso?", e sim:

**qual ordenação respeita meu requisito de negócio com custo aceitável?**

---

### Quatro eixos de decisão

1. **Tempo** (médio e pior caso)
2. **Espaço extra**
3. **Estabilidade**
4. **Comportamento em dados quase ordenados**

Esses eixos explicam por que runtimes modernos usam híbridos em vez de uma técnica única.

---

### Estabilidade: detalhe que vira bug de produto

Ordenação estável preserva ordem relativa de chaves iguais.

Exemplo:

- ordena tickets por prioridade;
- para prioridades iguais, quer manter ordem de criação.

Se a ordenação for instável, usuários percebem "fila embaralhando" mesmo quando prioridade não mudou.

Esse é um caso clássico em que decisão algorítmica afeta experiência do produto.

---

### Comparação objetiva das famílias clássicas

#### Quadráticas didáticas (`O(n²)`)

- **Bubble/Selection/Insertion**
- úteis para aprender troca e invariantes de prefixo/sufixo;
- ruins para volume grande;
- insertion pode ser muito bom quando lista já está quase ordenada.

#### `O(n log n)` de uso amplo

- **Merge sort**
  - desempenho previsível;
  - estável;
  - usa memória extra.

- **Quick sort**
  - excelente média e constante prática;
  - pior caso ruim com pivô inadequado;
  - geralmente in-place.

- **Heap sort**
  - pior caso controlado em `O(n log n)`;
  - in-place;
  - costuma perder para quick em constantes.

---

### "Uso o sort da linguagem ou implemento?"

Em produção, regra geral:

- use `sort` nativo;
- entenda contrato de comparador;
- confirme estabilidade da versão/runtime;
- implemente manualmente só quando houver exigência explícita.

Em entrevista, pode dizer:
"em produção eu usaria o sort nativo; aqui explico/implemento para discutir trade-offs".

Isso mostra pragmatismo e base teórica.

---

### Erros comuns que passam despercebidos

- ordenar números como strings (`"100" < "9"`);
- comparador não determinístico (quebra ordenação);
- ignorar desempate e gerar resultado instável para usuário;
- ordenar payload gigante sem avaliar memória e custo de cópia.

Outro erro clássico: ordenar cedo demais no pipeline e pagar custo sem necessidade.

---

### Ordenação como pré-requisito de técnicas avançadas

Você vai reutilizar esse conceito em:

- busca binária por fronteira;
- greedy por "termina primeiro";
- merge de intervalos;
- varredura por eventos (sweep line);
- parte de otimizações de DP com pré-processamento.

Por isso ordenação é fundamento de arquitetura de solução, não só assunto de aula introdutória.

---

### Checklist de maturidade

- [ ] Sei explicar estabilidade com exemplo de produto?
- [ ] Sei quando prefiro previsibilidade (merge/heap) vs média rápida (quick)?
- [ ] Sei argumentar custo de memória extra?
- [ ] Meu comparador está correto para empate?
- [ ] Testei com dados já ordenados, reversos e muitos repetidos?

---

### Reflexão

Ordenação é uma decisão de modelagem: você não está apenas rearranjando dados, está definindo quais propriedades serão preservadas para os próximos passos do algoritmo e do negócio.
