## O problema contado só com palavras

Tens as temperaturas de vários dias **por ordem** (da esquerda para a direita).

Para cada dia (`i`), pergunta:

> **Quantos dias tenho de esperar** — olhando **só para a frente na lista** até aparecer pela primeira vez um dia mais quente?

Se já não houver futuro maior, para esse índice a resposta é **`0`** (mantém‑se esse significado típico do exercício clássico).

---

## Duas histórias de resolução (ambas intuitivas à sua maneira)

**Primeira (“varredura frontal”)**: para cada dia, vais ler o papel à frente devagar até aparecer valores mais alto — comporta‑se como fazemos quando percorrer manualmente quando não tens memória especial.

**Segunda (“pilha monótona”)**: aos poucos vais adiando dias que ainda esperam aquecimento até que um novo dia **mais alto** aparece como “mensageiro”; então esse dia fecha a espera retroactivamente porque é um padrão muito habitual com **pilhas**.