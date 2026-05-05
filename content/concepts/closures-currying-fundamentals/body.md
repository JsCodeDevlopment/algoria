# Closures e Currying: Funções com Memória e Especialização

Uma **Closure** é uma função que "lembra" do ambiente (escopo) onde foi criada, mesmo após esse escopo ter sido executado e finalizado. Em JavaScript, dizemos que a função mantém acesso ao seu **ambiente léxico**.

Analogia simples: Imagine que você recebe um **estojo fechado**: lá dentro há lápis com etiquetas. A função que você devolve é como uma **regra** que ainda consegue ler essas etiquetas, embora o armário onde você montou o estojo já não esteja mais aberto ou acessível.

---

## 1. Exemplos Clássicos e "Pegadinhas"

### 1.1 O Dilema do Loop (`var` vs `let`)
Este é o exemplo mais clássico de como closures podem confundir desenvolvedores em entrevistas.

**O Problema (com `var`):**
```javascript
for (var i = 1; i <= 3; i++) {
  setTimeout(function() {
    console.log('Contagem (var): ' + i);
  }, i * 1000);
}
// Resultado após 1, 2 e 3 segundos: 
// "Contagem (var): 4"
// "Contagem (var): 4"
// "Contagem (var): 4"
```
**Por que isso acontece?** A variável `i` declarada com `var` tem escopo de função. Quando o `setTimeout` executa (após 1s), o loop já terminou e a referência de `i` no escopo da função pai é 4. Todas as 3 closures apontam para a **mesma referência**.

**A Solução Moderna (com `let`):**
```javascript
for (let i = 1; i <= 3; i++) {
  setTimeout(function() {
    console.log('Contagem (let): ' + i);
  }, i * 1000);
}
// Resultado: 1, 2, 3
```
**Por que funciona?** O `let` cria um **novo escopo de bloco** a cada iteração. Cada closure captura uma versão única e "congelada" de `i` daquele momento específico.

---

### 1.2 Closures e Assincronismo (Async/Await)
Closures permitem que funções assíncronas mantenham acesso a dados que seriam perdidos de outra forma.

```javascript
async function processarPedido(id) {
  const metaData = { timestamp: Date.now() };

  // A closure gerada no .then() 'lembra' de 'id' e 'metaData'
  return await buscarNoBanco(id).then(resultado => {
    console.log(`Pedido ${id} processado. Criado em: ${metaData.timestamp}`);
    return { ...resultado, ...metaData };
  });
}
```

---

### 1.3 Estado Privado (Encapsulamento)
Antes das classes terem campos privados (`#`), closures eram a ferramenta principal para encapsulamento.

```javascript
function criarContador() {
  let contagem = 0; // Variável protegida pela closure

  return {
    incrementar: () => ++contagem,
    decrementar: () => --contagem,
    verValor: () => contagem
  };
}

const meuContador = criarContador();
meuContador.incrementar();
console.log(meuContador.verValor()); // 1
console.log(meuContador.contagem);    // undefined (privacidade garantida!)
```

---

## 2. Para que serve na prática?

Além dos exemplos acima, as closures estão em todo lugar no ecossistema moderno:

-   **Callbacks e Eventos:** Handlers que “lembram” de configurações (`id`, `limite`, `URL`) sem precisar repetir argumentos em cada chamada.
-   **Hooks em React:** O `useState` e `useEffect` dependem inteiramente de closures para capturar o estado de uma renderização específica e mantê-lo disponível em funções internas.
-   **Fábricas de Funções:** Criar funções pré-configuradas para diferentes ambientes (ex: instâncias de API para prod vs dev).

---

## 3. Currying — Multiargumentos em Fila Indiana

O **Currying** (homenagem a Haskell Curry) transforma uma função que receberia vários argumentos de uma vez em uma **cadeia** de funções, cada uma com **um** argumento.

-   **Antes:** `f(a, b, c)`
-   **Depois:** `f(a)(b)(c)`

### Exemplo 1: Log Personalizado (Especialização)
```javascript
const logger = (nivel) => (mensagem) => {
  console.log(`[${nivel.toUpperCase()}] ${new Date().toISOString()}: ${mensagem}`);
};

const logErro = logger('erro');
logErro('Falha na conexão'); // [ERRO] ...: Falha na conexão
```

### Exemplo 2: addEventListener Parcial
Um uso comum é especializar eventos: primeiro você fixa o tipo de evento (ex: `'click'`), e depois aplica o handler a vários elementos. Isso é chamado de **Partial Application**.

---

## 4. Armadilhas e Performance

-   **Elegância vs. Clareza:** Encadeamentos longos de currying (`a()(b)(c)(d)`) podem confundir a equipe se não houver um bom motivo para tal abstração.
-   **Memória:** Closures impedem que as variáveis capturadas sejam limpas pelo **Garbage Collector** enquanto a closure existir. Em caminhos críticos de performance (hot paths), tome cuidado com a criação excessiva de closures em loops de alta frequência.
-   **Relação com Estruturas de Dados:** É possível implementar uma **pilha funcional** usando apenas closures para esconder a lista interna — o princípio é sempre o de "capitular dados" atrás de operações controladas.

---

## 5. Resumo Didático

-   **Closure** responde a: *"O que esta função ainda consegue ler do passado?"*
-   **Currying** responde a: *"Posso fixar alguns argumentos agora e ganhar uma função mais específica?"*

### Leitura Complementar
- [MDN: Closures](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Closures)
- [Closures, Currying, and Cool Abstractions](https://www.iamtk.co/closure-currying-and-cool-abstractions) (TK)
- [You Don't Know JS: Scope & Closures](https://github.com/getify/You-Dont-Know-JS)
