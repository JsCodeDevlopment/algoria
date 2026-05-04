## O cenário (sem misturar terminologia financeira pesada)

Tens uma lista de preços **`prices`** ao longo de dias ou instantes seguintes sempre na mesma ordem temporal.

Tu podes só:

1. Escolher **um dia para comprar** (uma vez).
2. Mais tarde, escolher **um único dia para vender**.
3. Não podes vender antes de comprar.

**Objetivo:** maximizar **`preço_venda − preço_compra`**.

Se os preços **só descem** ao longo do tempo, o melhor lucro é **zero** porque podes sempre decidir nem sequer efectuar jogada económica.

---

## Porque dois modos ajudam

Uma primeira ideia é perguntar: “Se experimentarmos todas as escolhas de **compra** e **venda** respeitando a ordem, qual dá maior diferença?” — funciona porque **testa bem a definição**, mas fica cara quando o array cresce.

Outra anda **uma volta só**, guardando **o dia de compra mais barato já visto**. Qualquer novo dia como “venda possível” compara‑se com esse melhor passado — encaixa bem se desenhares “mínimo até agora” num gráfico de preços.

---

## Dica sem código

Desenha colunas altura preço e coloca um dedo “melhor compra até agora” sempre subindo ou descendo — compara lucro potencial local quando avanças um dia venda hipotética.
