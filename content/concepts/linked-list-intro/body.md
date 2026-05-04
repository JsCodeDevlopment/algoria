## Lista ligada — comboio onde cada vagão só sabe o seguinte

Em muitos cursos aparece primeiro o **vetor/array**: uma linha fixa de "gavetas" numeradas. Saltar diretamente para a gaveta `k` — desde que tenhamos o número — torna‑se intuitivo porque as posições estão **umas ao lado das outras** na forma como normalmente imaginamos dados em sequência na memória da máquina.

Numa **lista ligada**, cada vagão (**nó**) guarda tipicamente duas coisas:

1. **O que estamos a transportar** (por exemplo um número, um texto, …).
2. **O endereço do próximo vagão** (às vezes chamado `next` — "qual é o próximo?").

Se partires a ligação no meio, quem estava **mais à frente** pode ficar *inacessível* se ninguém mais apontar para essa parte do comboio.

---

### Metáfora concreta

É como uma **caça ao tesouro em bilhetes**: cada bilhete diz onde está o próximo. Se perderes um bilhete no meio da cadeia, o resto **pode ser impossível de alcançar** a menos que guardes cópias noutros sítios.

---

### Quando faz sentido pensar em lista ligada em vez de array?

- Imagina que frequentemente **precisamos de remover ou inserir no meio** da sequência apenas **mudando ponteiros** em vez de deslocar muitos elementos de um array físico lado a lado. Em teoria esse "encaixar" pode ser rápido **se já estás a segurar nas mãos o nó certo** onde vais trabalhar… mas primeiro **encontrá‑lo** ainda pode exigir percorrer o comboio.

- Problemas de entrevistas usam sobre tudo dois ponteiros **rápidos e lentos** — um dá dois passos e o outro um — para coisas como **detetar ciclos** sem guardar todas as posições num mapa grande.

---

### Errinho típico dos primeiros dias

Alteras onde o vagão atual aponta (`next`) **antes** de teres guardado noutra variável o endereço que ainda ia precisar — assim **partes silenciosamente** o comboio. Por isso o código habitual guarda algo como `próximo = atual.next` **antes** de mudar ponteiros.

---

### Como estudares isto no Algoria

Quando aparecerem dois dedos diferentes a andar ao longo da mesma cadeia, **desenha no papel**. Anota sempre: "quem está **aqui**?", "para onde **esta seta** aponta quando mudo esta linha de código?".

---

### Operações que os cursos costumam nomear

- **`prepend`** — novo nó torna-se cabeça; aponta para a cabeça antiga (**muito** rápido se já tens referência à cabeça).
- **`append`** — caminhar até ao último nó (sem ponteiro de cauda) custa **linear** no tamanho.
- **`remove`** — remover pelo valor pede percorrer até encontrar **predecessor** para religar `next` ao `next.next`.

Daí a frase que ouves em entrevistas: "lista ligada não é mágica — **encontrar** o sítio certo ainda pode ser O(n)".

---

### Leitura complementar

Tutorial com `Node`, `LinkedList` em Python e remove no meio (*skip* do nó seguinte): [Linked List Data Structure](https://www.iamtk.co/series/data-structures/linked-list-data-structure) (TK).

