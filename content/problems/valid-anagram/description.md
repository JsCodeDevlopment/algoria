## O problema falado até quem odeia código

Tens duas linhas de texto, **`s`** e **`t`** (imagina nomes próprios, palavras curtas ou frases curtas só para pintar cenário mental).

Precisamos de responder: **podemos obter `t` apenas trocando a ordem das letras de `s`?**

Em termos de contagem: se `s` tem três vezes a letra `a`, então `t` também tem de ter **exactamente** três `a`. O mesmo vale para todas as letras que aparecem.

Se tudo bater certo nas contagens, devolvemos **verdadeiro — são anagramas**. Se alguma letra aparecer números diferentes, é **falso**.

---

## Atalhos mentais (sem ordenador físico nas mãos)

Imagina dois tabuleiros com peças de LEGO com etiquetas repetidas permitidas porque tens stock duplicável.

Depois de contar bem, se ficaste com **exactamente os mesmos “miúdos repetidos por tipo”**, só falta permutar onde estão colocados para os dois ficarem gramaticalmente diferentes por ordem apenas.

---

## O que vês nas duas soluções aqui

Uma abordagem muito **óbvia aos olhos**: ordenas cópias dos dois textos caracter a caracter até ficarem dois “fantasmas” lado a lado e comparas igualdade elemento a elemento — se bater sempre, eras anagrama.

Outra **soma** contagens vindas de `s` **e diminui** com o que aparece em `t` para as mesmas letras — se todas as contas ficam em zero ao fim, é anagrama.