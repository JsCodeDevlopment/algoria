## Janela deslizante — olhar apenas o que está "à vista" agora

Imagina estar nuns **óculos de campo estreito** a olhar apenas por uma zona contígua de uma frase maior. Ao avançares a fita inteira só **mudas onde a janela começa ou acaba**. Nunca precisaste de ler de novo todas as linhas porque **boa parte já contaste mentalmente dentro da zona actual**.

Este é literalmente como **vários algoritmos clássicos** funcionam quando procuramos:

- maior comprimento onde **todas letras diferentes** coexistem até certo momento;
- substrings que contêm todas as obrigações dum outro texto;
- subarrays com soma dentro de algum valor.

Palavras que vais ler: **`left`** (onde a janela abre à esquerda), **`right`** (extremo inclusivo atual à direita enquanto vais explorando), contagens rápidas de letras dentro da janela.

---

### O passo cognitivo chave para iniciantes absolutos

1. Ao **abrís a janela** (`right++`), tragas informação nova (ex.: aumentas contagem duma letra).
2. Se o que importa ficou **ilegal**, **fecha** devagar pela esquerda (`left++`), **corrigindo** contagens até voltar conformidade OU até não valer já a pena manter esse `left`.

**Analogia pastelaria:** trabalhas sempre com as fatias já na vitrine; só empurras quando cabe novo sabor desde que tirares o primeiro que ficou há muito atrás porque contraria regra de vitamina.

---

### Porque esta mentalidade pode ser só `O(n)`?

Porque tanto `left` como `right` normalmente só **avançam para a frente** ao longo do input — cada posição sai e entra da janela **no máximo um punhado constante grande de manipulações** se contagem interna atualizar em `O(1)`.

Se ao corrigires a janela precisasses de reorganizar sempre tudo dentro com custo proporcional inteiro novo à janela, deixarias de amortizar rápido.

---

### Avisos comuns mesmo com janelas

- Pensar só em `right++` mas **esqueceres de encolheres `left`** quando invariante estraga ⇒ resposta sempre demasiado larga/errada.
- Contagens parciais com erro de "**início inclusivo ou exclusivo**" — marca no papel sempre se o índice `right` entrou ou já saiu antes de aumentar contadores.
- Problemas que **na verdade** pedem elementos espalhados não contíguos — a técnica muda radicalmente.

---

### O que estudar já a seguir

Quando leres problema com **Substring / Subarray** e restrições de **contagem dentro de zona contínua**, desenha a janela numa lista pequena (5 letras só) e anda com o dedo. No Algoria, os painéis de linha ajudam a ver **momento onde left salta**.
