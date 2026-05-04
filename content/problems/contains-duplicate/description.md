## O problema como pergunta de sala de aula

Imagina números escritos numa só linha bem comprida ao longo de uma folha (**array `nums`**).

Precisamos de responder **simplesmente sim ou não**:

> Algum número aparece **mais do que uma vez** em posições diferentes?

Ou seja, qualquer repetido **não conta** apenas como "estar escrito igual" — conta como **estar duplicado** na sequência inteira mesmo que os caracteres escritos num papel pareçam o mesmo dígito.

---

## Como visualizar rápido

Sê honesto quando simulas só com papel:

Percorreres sempre do início até ao actual é cansativo porque **voltas sempre atrás** para comparar aquele elemento com cada um dos anteriores.

Mais intuitivo quando aprendes **hash ou conjunto**: assim que aparece um número novo perguntas “**já guardei este mesmo valor antes** na coleção rápida?”.

---

## O que vais tirar ao comparar as duas soluções aqui

A primeira faz sentido porque **literalmente faz o que diz o enunciado** — verifica todas equipas histórias possíveis (pode ficar cara).

A segunda mostra uma **lista de visitados em memória** para evitar sempre voltar atrás cara a cara.