## O problema (sem saberes programar… ainda)

Tens uma **lista de números** chamada `nums` e um número alvo chamado `target`.

Queres responder: **existem dois números nesta lista, em posições diferentes, que somados dão exactamente `target`?**

Se existirem, devolves **os dois "números de lugar"** (chamamos **índices**) onde eles aparecem. Por exemplo índices `1` e `3` porque esses dois lugares diferentes somam bem com o valor pedido.

O enunciado clássico garante-te que **existe sempre** um par válido quando o programa corre.

---

## Analogia rápida

É como encontrares na lista de gastos **duas despesas** cujo valor somado fecha exactamente um objectivo definido antes — usando só a ordem onde apareceram escritas à mão ao longo do bloquinho das compras sem teres de perguntar bocado a bocado infinitamente.

---

## O que estas duas versões aqui na app querem que sintas

Na versão "**força bruta**" vasculhas conscientemente todas as equipas **duas‑a‑duas**.

Na segunda, aprendes a **lembrares no caminho números que já apareceram**, para perguntares instantaneamente: "**já existe o número parceiro disto atrás?**" — ideia repetida mundo fora mesmo em backends enormes quando se indexa eventos repetidos rapidamente sem varrer sempre tudo sempre.
