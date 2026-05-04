## Dois dedos sobre a mesma fita — a técnica "two pointers"

Um **array** ou **lista** é como uma linha ordenada de gavetas numeradas desde `0`. Em vez de recomeçares sempre do zero quando algo no meio já foi resolvido, podes usar **dois marcadores simultâneos** (na cabeça, `left` e `right`; ou `slow` e `fast`) como se tivesses dois dedos a sincronizar música.

Não há truques de sintaxe obrigatórios: é **mentalizar duas posições** dentro da mesma sequência para **eliminar trabalho já impossível** ou para **fundir dois pedaços** que já vieram bem arrumados.

---

### Imagens intuitivas rápidas

1. **Convergentes (um no início, outro no fim)**  
   Estás a ler uma palavra de trás pra frente e pra frente ao mesmo tempo até os dedos encontrarem zona de acordo ("palíndromo válido dentro do que importa?").  
   Cada decisão fecha espaço pela esquerda *ou* pela direita — típico `O(n)` em **uma** passagem se cada passo anda pelo menos uma casa.

2. **Mesmo sentido mas ritmos diferentes (`slow`, `fast`)**  
   O dedo rápido explora sempre à frente; o lento confirma se a propriedade ainda faz sentido. Aparece em listas ligadas quando queres encontrar ciclo ou ponto médio sem copiar estruturas novas grandes.

---

### Quando dois ponteiros brilham

- Os dados já estão **ordenados** ou podes ordenar uma vez só e depois trabalhar assim.
- Precisas de **testar todos os pares** numa zona sem voltar sempre ao início cegamente.
- O problema sugere "**encolher** espaço válido quando uma ponta ficou forte demais e a outra fraca".

---

### O triunfo habitual de complexidade

Se cada movimento de `left` ou `right` avança a travessia sem voltar atrás toda sempre, típico **tempo linear** `O(n)` em relação ao tamanho do trajecto combinado dos dois ponteiros.

---

### Quando dois ponteiros *não* chegam?

- Precisas de **saltar atrás no tempo** livremente a qualquer elemento que já apareceu, não apenas decidir nas pontas ⇒ mapas aparecem à frente.
- O problema exige estruturas de tentativa-e-erro onde **voltas grandes** são obrigatórias (tipo backtracking brutal completo sobre tudo sempre).

---

### Mini-receita de estudo aqui na app

Ao veres uma solução com `left++` ou `right--`, desenha no papel **onde** são os dedos antes e **porque é seguro avançar** só desse lado. Quando consegues explicar isso a alguém sem código, dominaste a técnica.
