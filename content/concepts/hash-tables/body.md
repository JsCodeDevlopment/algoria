## O problema que resolver — sem ficar perdido na fila

Imagina esta cena mundana:

- Tens uma **lista enorme com nomes** de pessoas que entraram num concerto à porta.
- Alguém pergun-te de repente: "**O João já entrou?**"

Duas estratégias:

1. **Sem ajuda especial** — lês desde o topo da lista até ao fim até encontrares "João" ou ficares convencido que não aparece.
   Se a lista é curta, funciona bem. Se há milhares de nomes **e** alguém repete a pergunta muitas vezes, vais ficar sempre a varrer tudo: no pior caso percorres **tudo** sempre.

2. **Com um marcador rápido** — à medida que lês a lista na entrada, quando alguém entras anotas no teu carnet digital: **`João ✓`** num sítio onde **não precisas de reler todas as páginas** quando queres só confirmar. Esse sistema — no código chama-se muitas vezes **hash map** ou **dicionário** — trata perguntas "já aparece?" de forma **muito rápida** mesmo com muitos nomes.

Este mini-carnet onde **entrada liga diretamente ao que queres saber** (em termos de crescimento: ver conceito **Big O**) é a ideia de **tabela hash**.

---

### Palavras que vais ver no código

- **Chave (key)** — o que perguntamos ("este número já passou?", "esta palavra já contamos?").
- **Valor (value)** — o que guardamos: às vezes só "sim/não"; outras vezes **onde** apareceu (índice), como no Two Sum.

Em JavaScript/TypeScript aparece sobretudo como `Map`. Em outros ecossistemas: `dict` em Python, `HashMap` em Java. O **conceito** é o mesmo em todo o lado.

---

## Porque parece mágico? (bem simples por dentro)

Por baixo há uma forma de pegar uma chave e calcular onde ela deve "morar" numa coleção grande. Às vezes duas chaves querem o mesmo lugar — **colisão**. Implementações tratam disso reorganizando gavetas. Por isso lês **`O(1)` amortizado**: na prática quase sempre constante quando as chaves se distribuem bem.

---

### Quatro padrões que vais repetir sempre

1. **Já apareceu?** — existência rápida (muitas vezes com um `Set`).
2. **Quantas vezes?** — contar por chave (`map[chave] += 1` mentalmente).
3. **Onde apareceu?** — lembrar o índice original.
4. **Agrupar iguais** — várias strings que são "iguais depois de reordenadas" ficam todas na mesma gaveta (anagramas).

---

### Quando *não* é a primeira escolha?

- Lista **mesmo pequena** — demasiada parafernália não compensa.
- Precisas de **ordenação garantida pela chave** sempre explícita — outras estruturas resolvem isto melhor.
- Comparar igualdade de **objetos complexos em profundidade** — pode ser preciso primeiro transformá-los numa chave simples.

---

### Exemplo minimal (mental)

Contar quantas vezes aparece cada letra numa palavra: associas cada letra a um número e vais aumentando esse número.

```
map['a'] = map['a'] + 1
```

(conceito; a sintaxe exata na tua língua podes ignorar até abrires o CodePlayer.)

---

## Resumo antes de continuares para os problemas

Um **hash map** guarda associações **chave valor** para **responder rápido** a perguntas repetidas, muitas vezes trocando **memória extra** por **tempo** — o oposto literal de ficar dois loops cara a cara sempre.
