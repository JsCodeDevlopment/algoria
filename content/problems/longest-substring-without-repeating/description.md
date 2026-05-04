## O problema numa frase

Quantos caracteres consecutivos conseguimos arrumar **sem repetir uma mesma letra** dentro da mesma faixa?

Procura‑se apenas o **maior comprimento** de uma substring contínua **sem repetidos**.

---

## Duas estratégias aqui dentro

**Primeira (“intervalos todos”):** escolhemos sempre um possível início na frase maior e aumentamos sempre o fim **até** encontrar segunda ocorrência de uma mesma carta já presente dentro do segmento atual — método directo quando queres ler o comportamento apenas com papel e lápis.

**Segunda (“uma passagem”):** vamos da esquerda para a direita guardando **onde** cada carácter apareceu por último. Quando ele reaparece, puxamos o limite esquerdo do segmento válido para **logo a seguir** à ocorrência antiga — é o corte mínimo que elimina a repetição e mantém a janela válida.
