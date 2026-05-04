## O que estás a calcular visualmente

Tens várias barras verticais (como muralhas vistas de lado). O número `height[i]` é a altura da barra nesse sítio.

Quando chove sobre esta silhueta, a água acumula-se nas zonas mais baixas **desde que** existam barras suficientemente altas **à esquerda** e **à direita** que impeçam a água de escorregar para os lados. O exercício quer **somar** quantas **unidades inteiras** de água ficariam realmente aprisionadas.

---

## Como pensar em cada “casa interior” sem misturar fórmulas

Para uma posição `i` (tipicamente **não** as pontas inicial/final porque não há dois lados fechados), imagina dois “tectos relativos”:

- o maior valor que já apareceu **à esquerda** antes de chegares ao `i`;
- o maior valor que existe **à direita** depois do `i`.

A água que essa casa consegue reter até é limitada pelo **menor desses dois tectos** (é o menor que faz de “tampe real”), e ainda tens de tirar o espaço que a própria barra já ocupa.

---

## O que encontrar nos dois fluxos aqui dentro

**Primeira abordagem:** para cada casa interior, fazemos buscas brutas aos máximos esquerdo/direito. É óbvia e alinhada com a geometria anterior, mas faz trabalho repetido — por isso fica cara em listas muito grandes.

**Segunda abordagem:** usamos dois ponteiros externos e vamos decidindo sempre qual lado mover, mantendo “muros máximos vistos” à esquerda e à direita. É menos imediato se nunca trabalhaste o padrão, mas faz **uma passagem eficiente** — e as linhas foram desenhadas aqui como um exercício forte de dois ponteiros.
