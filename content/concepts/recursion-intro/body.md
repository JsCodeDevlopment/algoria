## Recursão — "delegar trabalho menor até estar trivial"

Imagina ordenar fichas dentro de casa:

- Para arrumar todos os placards podes primeiro acertar apenas **um canto menor** igual mas com menos caos.
- Quando ficar tão óbvio tipo "só há uma pasta" ⇒ **resolver directamente** (**caso base**).
- Voltas mentalmente niveis atrás combinando trabalho já bem feito.

Em código: uma **função chama-se a si própria** sempre com problema **estruturalmente mais pequeno** (menos elementos, profundidade menor, etc.) até tocar num **return** que não chama outra vez.

---

### Três metáforas que resolvem 80% da confusão inicial

1. **Escadas russa de tarefas** — cada degrau desce metade do terreno restante.
2. **Matrioska** — abres boneca até o núcleo vazio — o núcleo é o caso base.
3. **Receita de bolo** — um passo diz "repete a receita com metade da massa" até ser só mexer uma colher.

---

### O que *sempre* precisas identificar

- **Caso base** — há um momento em que o problema é tão simples que respondes já (sem nova chamada recursiva).
- **Progresso garantido** — cada chamada aproxima esse caso base (**nunca** ficar eternamente igual, senão a pilha rebenta).
- **Combinar resultado** ao voltar aos níveis de cima — às vezes somar dois números, às vezes montar uma lista maior.

---

### Pilha mental de execução (sem ficar geek)

Computador quando entra dentro de nova chamada "**empilha mentalmente onde estava antes**"; quando retorna, desempilha. Profundidade enorme sem base adequada ⇒ **estouro de pilha** (stack overflow) — sinal de base errada ou progresso falso.

---

### Recursão vs laço `for`

São **equivalentes teóricas** muitas vezes: o que fazes recursivo podes reescrever iterativo com explicitamente **stack manual** tua. Recursão brilha quando **árvore de decisões** ou **divide & conquer** fica sintaxe horrível imperativa.

---

### Armadilha clássica

Repetires **exactamente igual** subproblema (Fibonacci ingénuo) mil vezes ⇒ tempo explode. Memorização / programação dinâmica aparece quando notas esse padrão (não obrigatório neste momento se estás iniciante).

---

### Como ler soluções no Algoria

Quando aparecer código recursivo, **anota papel** primeira chamada ⇒ primeira bifurcação ⇒ onde volta. Pergunta: "O que *menor* cada chamada promete?" Se não consegues responder claramente, algoritmo está mal fechado.
