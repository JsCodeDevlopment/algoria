## O que é Big O — numa linguagem que qualquer um percebe

Imagina um **elevador**:

- Às 9h há **50 pessoas** na fila. O elevador faz **uma viagem por andar**.
- Às 10h há **100 pessoas** (o dobro). Se o trabalho também **duplica**, dizemos que o tempo cresce de forma parecida com o tamanho da fila: isso parece comportamento "**linear**".
- Se quando duplicas as pessoas o trabalho **quádruplica** (cada novo convidado fala com *todos* os outros na sala…), esse crescimento chama-se "**quadrático**".

**Big O** não conta milissegundos no cronómetro da tua máquina. Conta apenas **o quanto o número de operações fundamentais cresce** quando o input cresce. É uma forma inteligente de comparar "*ideias*" de código sem depender de um computador rápido ou lento.

### Três analogias rápidas

1. **`O(1)` — tempo constante**  
   Ligaste a luz. Não importa se a cidade tem 50 ou 50000 casas — o teu quarto ficou iluminado igual. São **vários fixos passes**, não dependem do \(n\) global.

2. **`O(n)` — linear**  
   Tens uma gaveta com \(n\) meias sórdidas e queres encontrar uma meia específica ao tato — no **pior caso** vais até ao fundo. Se duplicares o número de meias, o **pior caso** duplica (ordem de grandeza).

3. **`O(n²)` — quadratic**  
   No recreio, cada uma das \(n\) crianças aperta mão **a todas** as outras. O número de apertões de mão explode — é da ordem \(n\) vezes \(n\).

Na prática, \(n\) costuma representar "**quantos elementos**" tem um array/lista/strings.

---

## Uma mesa só com os sabores mais úteis

| Notação (leia "ó-grandé de…") | Nome amigável | Ideia intuitiva |
| --- | --- | --- |
| `O(1)` | Instantâneo (em termos de \(n\)) | "Não aumenta porque o problema cresceu." |
| `O(log n)` | Dividir pelo meio repetidamente | Cada decisão corta Metade das opções → muito eficiente. |
| `O(n)` | Uma volta completa pelo input | Um "for" simples quando o trabalho *dentro* é barato. |
| `O(n log n)` | Ordenações boas típicas | Aparece muito quando ordenas primeiro e depois fazes algo linear. |
| `O(n²)` | Ajuntar cada elemento com outros | Nested loops quando **ambos** andam até \(n\) — primeiro sinal que talvez precise de técnica melhor (hash, two pointers, etc.). |

Há comportamentos péssimos (`O(2^n)`, `O(n!)`) — aparecem em recursões que explodem combinações. No Algoria vamos evitar esse caminho sempre que aparecer algo melhor na app.

---

## A regra de ouro dos matemáticos pragmáticos

Se o programa faz `100n + 1000`, quando \(n\) é enorme os `+1000` são nada comparado aos `100n`. Por isso escrevemos **`O(n)`** — **chutamos coeficientes e termos mais pequenos**. O importante é **qual poder domina quando \(n\) cresce**.

Exemplos:

- `50n² + 30n + 999` é **`O(n²)`**.
- `7n log n + 3n` é **`O(n log n)`** (para \(n\) grande, \(n log n\) "ganha" a \(n\)).

---

## Tempo não é tudo — memória também

Por vezes gastas **memória extra** para sermos **rápidos**:

- **`O(1)` espaço** — poucas caixinhas temporárias, independentes do tamanho grande do input (isso não inclui uma cópia gigante obrigatória do input se o problema assim o pedisse).
- **`O(n)` espaço** — um map auxiliar grande como o próprio número de elementos.

No **Two Sum**, o hash map troca espaço \(O(n)\) por tempo \(O(n)\) versus o duplo ciclo quadrático.

---

## "Pior caso" vs média

Anunciamos muitas vezes Big O do **pior caso** porque é o garantido.  
As **hash tables** aparecem em média rápidas; em cenários malignos onde *todas* as chaves colidem teoricamente ficam lentas — na vida real são raras com entradas boas.

---

## Checklist rápido ao olhar para código (sem memorizar teorias grandes)

Percorres mentalmente o programa e perguntas:

1. Quantos níveis aninhados de loops que vão até ~\(n\)?  
   → **Um** nível ⇒ normalmente **`O(n)`** se trabalho dentro for fixo por passo.  
   → **Dois níveis ⇒ `O(n²)`**
2. Há ordenação típica? ⇒ muitas vezes **`O(n log n)`** entra ao menos uma vez.
3. Há busca repetida rápida (map/set)? ⇒ lookup amortizado tratado logo como contribuição \(\approx O(1)\) por uso no loop.
4. A função chama-se a si própria e explora dois caminhos a cada nível?  
   → Possível comportamento expoencial (`O(2^n)`) até haver cortes inteligentes (memoização, poda).

### Exemplo concreto (Two Sum).

- Versão dois loops ⇒ cada par possível ⇒ **`O(n²)`** tempo e **`O(1)`** espaço extra além dos dados originais.
- Versão map guardando já visto ⇒ **`O(n)`** tempo e **`O(n)`** espaço.

---

## Como usar isto quando estudas no Algoria

Quando aparecerem dois painéis (brute-force vs melhor técnica), pergunta **porque** cada um faz sentido primeiro e **onde** aparece uma curva menos inclinada. Big O não é snobisme académico — é **prevenir surpresas** quando o problema passa de 100 elementos a 100 000 elementos.
