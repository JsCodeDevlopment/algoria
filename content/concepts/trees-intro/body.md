## Árvores — quando a linha recta já não chega

Arrays, pilhas, filas e listas ligadas são frequentemente chamadas **estruturas lineares**: há uma ideia intuitiva de **começo** e **fim**, mesmo que implementações internas mudem.

Uma **árvore** organiza dados **em hierarquia**: um nó superior relaciona-se com vários abaixo, sem obrigar tudo a estar numa única sequência da esquerda para a direita.

---

### Exemplos que já viste sem dar o nome

- **Árvore genealógica** — avós → pais → filhos.
- **Organograma** — direção → equipas → pessoas.
- **DOM HTML** — `<html>` contém `<head>` e `<body>`; dentro destes há mais etiquetas em ramos.

Todos são **árvores na vida real** porque o significado depende de **quem está acima de quem**.

---

### Vocabulário essencial

| Termo | Ideia numa frase |
| --- | --- |
| **Nó** | Caixa que guarda valor (e referências a vizinhos conforme o tipo de árvore). |
| **Raiz** | Nó no topo; não tem pai dentro desta árvore. |
| **Pai / filho** | Ligação descendente direta (aresta de hierarquia). |
| **Folha** | Nó sem filhos — “último nível útil” neste ramo. |
| **Aresta** | Ligação entre dois nós. |
| **Profundidade** (de um nó) | Quantos passos sobes até à raiz. |
| **Altura** (da árvore) | Maior número de passos da raiz até alguma folha. |

Desenhar um exemplo minúsculo (raiz + dois filhos + uma folha extra) e etiquetar **profundidade** de cada nó fixa isto mais depressa que decorar.

---

### Árvore binária

Definição típica em entrevistas e livros: cada nó tem **no máximo dois** filhos, chamados **esquerda** e **direita** (podem ser ausentes, `null`).

Modelo mental do registo:

- valor no nó
- referência para subárvore esquerda
- referência para subárvore direita

Muitos algoritmos clássicos (percurso em ordem, BST...) assumem esta forma **binária**.

---

### Ligação com grafos

Uma árvore é um **grafo conexo acíclico** com escolha clara de raiz — não precisas dominar grafos para estudar árvores primeiro, mas quando chegares a grafos vais reconhecer: “era só generalizar arestas”.

---

### Erro comum

Confundir **altura de um nó** com **altura da árvore** ou misturar **profundidade** com **nível** sem convencer quem lê o teu desenho — escreve sempre uma legenda ao lado do primeiro diagrama num problema.

---

### Leitura complementar

Tutorial com mais exemplos visuais e código em Python para árvore binária simples: [Tree Data Structure](https://www.iamtk.co/series/data-structures/tree-data-structure) (TK).

---

### O que estudar já no Algoria

Quando um problema falar em **ancestrais**, **subárvore**, **caminho raiz–folha** ou **BST**, volta a este vocabulário antes de escrever código — poupa horas de debugging conceptual.
