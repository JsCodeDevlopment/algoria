import { CoursePackParsed } from '@/lib/content/schemas';

/**
 * Pacote editorial do curso de fundamentos.
 * Cada módulo segue a progressão:
 * leitura -> exemplos guiados -> exercícios de fixação -> prova final.
 */
export const FUNDAMENTOS_FASE_1_PACK = CoursePackParsed.parse({
  slug: 'fundamentos-fase-1',
  title: 'Curso Fundamentos — Fase 1',
  subtitle:
    'Trilha sequencial com progressão didática: leitura orientada, exemplos em camadas, exercícios de reconhecimento e aplicação, e prova final integradora por módulo.',
  modules: [
    {
      id: 'big-o',
      linkedConceptSlug: 'big-o',
      certificateTitle: 'Certificado — Big O e análise assintótica',
      certificateTagline: 'Você domina crescimento de custo e evita decisões ruins de escalabilidade.',
      examples: [
        {
          title: 'Ler crescimento sem decorar fórmula',
          simple:
            'Big O descreve **como o custo cresce** quando o input cresce. Uma varredura única tende a `O(n)`; dois loops aninhados sem poda tendem a `O(n²)`.',
          deep:
            'A notação assintótica compara classes de crescimento, não tempos absolutos. Constantes importam na prática, mas para escalabilidade o termo dominante guia decisões arquiteturais.',
          code:
            'for (let i = 0; i < n; i++) {\n  for (let j = 0; j < n; j++) {\n    // O(1)\n  }\n}\n// O(n^2)',
        },
        {
          title: 'Tempo e espaço devem ser analisados juntos',
          simple:
            'Um algoritmo pode ser rápido no tempo e caro em memória. Sempre responda as duas dimensões: tempo e espaço extra.',
          deep:
            'Guardar estrutura proporcional ao input muda espaço para `O(n)` ou mais. Um acumulador simples normalmente mantém espaço auxiliar `O(1)`.',
        },
      ],
      exercises: [
        {
          id: 'big-o-e1',
          stem: 'Um loop percorre todos os elementos de um array uma única vez. Qual tempo assintótico típico?',
          choices: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
          correctIndex: 2,
          explanationSimple: 'Uma passada completa sobre `n` elementos é linear.',
          explanationDeep:
            'Se cada iteração custa constante e há `n` iterações, o custo total cresce proporcionalmente a `n`.',
        },
        {
          id: 'big-o-e2',
          stem: 'Busca binária elimina metade da faixa de busca por passo. Qual tempo típico?',
          choices: ['O(log n)', 'O(n)', 'O(n log n)', 'O(n²)'],
          correctIndex: 0,
          explanationSimple: 'Redução por metade gera crescimento logarítmico.',
          explanationDeep:
            'A sequência `n, n/2, n/4, ...` atinge 1 em aproximadamente `log2(n)` passos.',
        },
        {
          id: 'big-o-e3',
          stem: 'Duas passadas independentes em array (`sum` e `max`) resultam em qual classe de tempo?',
          choices: ['O(n)', 'O(n²)', 'O(log n)', 'O(2^n)'],
          correctIndex: 0,
          explanationSimple: 'Duas passadas lineares continuam lineares em Big O.',
          explanationDeep:
            'Big O ignora multiplicadores constantes: `O(n) + O(n) = O(2n)`, simplificado para `O(n)`.',
        },
      ],
      capstone: {
        id: 'big-o-cap',
        stem: 'Algoritmo percorre array uma vez e guarda apenas `sum` e `max`. Qual par (tempo, espaço extra) está correto?',
        choices: ['O(n), O(1)', 'O(log n), O(n)', 'O(n²), O(1)', 'O(1), O(n)'],
        correctIndex: 0,
        explanationSimple: 'Uma varredura linear com poucas variáveis auxiliares.',
        explanationDeep:
          'Sem estruturas proporcionais ao input, espaço extra permanece constante enquanto o tempo cresce linearmente.',
      },
    },
    {
      id: 'hash-tables',
      linkedConceptSlug: 'hash-tables',
      certificateTitle: 'Certificado — Hash tables e lookups',
      certificateTagline: 'Você troca buscas repetidas por consulta rápida com trade-offs explícitos.',
      examples: [
        {
          title: 'Eliminar varreduras internas com mapa',
          simple:
            'Hash table responde rápido: "já vi este valor?". Isso evita varrer coleção inteira várias vezes.',
          deep:
            'O ganho típico vem de lookups amortizados esperados próximos de `O(1)`, ao custo de memória adicional e cuidado com modelagem de chave.',
          code: 'if (seen.has(x)) return true;\nseen.set(x, true);',
        },
        {
          title: 'Chave correta é decisão de modelagem',
          simple:
            'Em agrupamento de anagramas, chaves precisam representar equivalência real (ex.: string ordenada).',
          deep:
            'A escolha da chave afeta corretude e desempenho. Chave mal desenhada pode causar colisão semântica e bugs difíceis de perceber.',
        },
      ],
      exercises: [
        {
          id: 'ht-e1',
          stem: 'Em hash table bem distribuída, qual custo médio esperado para consulta (`get`)?',
          choices: ['O(n²)', 'O(n)', 'Próximo de O(1) amortizado', 'O(log n) obrigatório'],
          correctIndex: 2,
          explanationSimple: 'Na média, hash table tende a consulta constante amortizada.',
          explanationDeep:
            'Existe pior caso linear, mas em cenário saudável a distribuição reduz colisões e mantém lookups rápidos.',
        },
        {
          id: 'ht-e2',
          stem: 'No Two Sum, por que hash map costuma superar brute force?',
          choices: [
            'Porque remove uma varredura aninhada',
            'Porque sempre usa menos memória',
            'Porque ordena entrada sem custo',
            'Porque garante pior caso O(1)',
          ],
          correctIndex: 0,
          explanationSimple: 'Lookup de complemento evita testar todos os pares.',
          explanationDeep:
            'A força bruta compara pares (`O(n²)`); com hash, cada elemento faz lookup/insert, levando a comportamento esperado linear.',
        },
        {
          id: 'ht-e3',
          stem: 'Qual trade-off mais comum ao adotar hash map para acelerar consultas?',
          choices: [
            'Mais tempo e menos memória',
            'Menos tempo médio e mais memória',
            'Sem trade-off relevante',
            'Ganho absoluto sem exceções',
          ],
          correctIndex: 1,
          explanationSimple: 'Hash geralmente troca espaço por velocidade média.',
          explanationDeep:
            'Buckets, metadados e pares chave-valor aumentam uso de memória para reduzir custo de busca.',
        },
      ],
      capstone: {
        id: 'ht-cap',
        stem: 'Você precisa detectar duplicatas com baixa latência em lista grande. Qual estratégia é mais adequada?',
        choices: [
          'Comparar cada elemento com todos os demais',
          'Usar `Set` para registrar itens já vistos',
          'Ordenar e ignorar checks de igualdade',
          'Aplicar recursão sem estrutura auxiliar',
        ],
        correctIndex: 1,
        explanationSimple: 'Set/Map permite verificar presença rapidamente durante uma única passada.',
        explanationDeep:
          'A abordagem reduz comparações redundantes e costuma atingir comportamento esperado `O(n)`.',
      },
    },
    {
      id: 'two-pointers',
      linkedConceptSlug: 'two-pointers',
      certificateTitle: 'Certificado — Dois ponteiros coordenados',
      certificateTagline: 'Você aplica invariantes de ordem para reduzir busca sem perder corretude.',
      examples: [
        {
          title: 'Mover ponteiro com justificativa, não por tentativa',
          simple:
            'Com array ordenado, cada movimento de ponteiro descarta cenários inviáveis de forma segura.',
          deep:
            'Se `arr[l] + arr[r]` excede alvo, reduzir `r` é correto porque aumentar `l` só aumentaria ou manteria a soma. A prova depende de monotonicidade.',
        },
        {
          title: 'Fronteiras e critérios de parada',
          simple:
            'Erros mais comuns são `off-by-one` e atualização incorreta de ponteiros.',
          deep:
            'A invariante útil é: "pares fora do intervalo atual já foram descartados com justificativa". Essa frase orienta implementação e debug.',
          code:
            'let l = 0;\nlet r = arr.length - 1;\nwhile (l < r) {\n  const s = arr[l] + arr[r];\n  if (s === target) break;\n  if (s < target) l++;\n  else r--;\n}',
        },
      ],
      exercises: [
        {
          id: 'tp-e1',
          stem: 'Qual pré-condição viabiliza two pointers por extremos em soma alvo?',
          choices: [
            'Estrutura com ordem/monotonicidade útil',
            'Uso obrigatório de recursão',
            'Hash map obrigatório',
            'Ausência total de laços',
          ],
          correctIndex: 0,
          explanationSimple: 'Sem ordem, não há critério seguro para descartar lado.',
          explanationDeep:
            'A técnica depende de relação monotônica entre posição e valor para manter corretude dos movimentos.',
        },
        {
          id: 'tp-e2',
          stem: 'Se em array ordenado `arr[l] + arr[r] < alvo`, qual movimento típico?',
          choices: ['Decrementar `r`', 'Incrementar `l`', 'Parar execução', 'Ordenar novamente'],
          correctIndex: 1,
          explanationSimple: 'Para aumentar soma, mova `l` para valor maior.',
          explanationDeep:
            'Diminuir `r` reduziria ainda mais a soma em array crescente, contrariando objetivo.',
        },
        {
          id: 'tp-e3',
          stem: 'Qual bug frequente nesse padrão?',
          choices: ['Erro de CSS', 'Loop infinito por ponteiro não atualizado', 'Deadlock de banco', 'Falta de import'],
          correctIndex: 1,
          explanationSimple: 'Atualizar ponteiro errado pode prender o laço.',
          explanationDeep:
            'Casos de borda pequenos (`[]`, tamanho 1, todos iguais) costumam revelar rapidamente esse tipo de erro.',
        },
      ],
      capstone: {
        id: 'tp-cap',
        stem: 'Por que two pointers em array ordenado costuma superar brute force de pares?',
        choices: [
          'Porque usa mais memória auxiliar',
          'Porque descarta combinações inviáveis sem revisitar tudo',
          'Porque evita qualquer comparação',
          'Porque elimina necessidade de ordenação',
        ],
        correctIndex: 1,
        explanationSimple: 'A técnica reduz espaço de busca com movimentos justificáveis.',
        explanationDeep:
          'No brute force há crescimento combinatório; com dois ponteiros cada iteração move um limite e evita revisitas explosivas.',
      },
    },
    {
      id: 'sliding-window',
      linkedConceptSlug: 'sliding-window',
      certificateTitle: 'Certificado — Janelas deslizantes',
      certificateTagline: 'Você mantém estado incremental e evita recomputação completa de subarrays.',
      examples: [
        {
          title: 'Atualização por delta',
          simple:
            'Quando janela anda, entra um item e sai outro. Atualize estado com essas mudanças, sem recontar tudo.',
          deep:
            'Com ponteiros monotônicos, cada índice entra/sai poucas vezes. Esse limite sustenta análise amortizada próxima de linear em vários problemas.',
          code: 'freq[in]++;\nwhile (!valid) {\n  freq[out]--;\n  left++;\n}',
        },
        {
          title: 'Defina claramente o que é "janela válida"',
          simple:
            'Em menor substring, você expande até ficar válido e contrai para tentar minimizar.',
          deep:
            'Sem predicado de validade explícito, o algoritmo vira tentativa e erro. A qualidade da formulação do estado define a qualidade da implementação.',
        },
      ],
      exercises: [
        {
          id: 'sw-e1',
          stem: 'Por que o ponteiro esquerdo normalmente não volta para trás?',
          choices: [
            'Para preservar limite de movimentação e custo amortizado',
            'Porque TypeScript proíbe',
            'Porque janela exige recursão',
            'Porque melhora visual do código',
          ],
          correctIndex: 0,
          explanationSimple: 'Ponteiros monotônicos evitam revisitas excessivas.',
          explanationDeep:
            'Voltar frequentemente pode destruir a análise amortizada e empurrar complexidade para perto de quadrática.',
        },
        {
          id: 'sw-e2',
          stem: 'Qual combinação é central em problemas de menor substring válida?',
          choices: [
            'Dois ponteiros + frequências + critério de validade',
            'Apenas busca binária',
            'Apenas heap',
            'Apenas ordenação',
          ],
          correctIndex: 0,
          explanationSimple: 'Precisamos medir validade e ajustar janela incrementalmente.',
          explanationDeep:
            'Frequências e contadores de requisito permitem saber quando expandir ou contrair sem recontagem completa.',
        },
        {
          id: 'sw-e3',
          stem: 'Qual indício de que sua solução virou brute force disfarçada?',
          choices: [
            'Recontar toda janela a cada movimento',
            'Usar duas variáveis de ponteiro',
            'Ter laço while',
            'Receber string de entrada',
          ],
          correctIndex: 0,
          explanationSimple: 'Recomputação integral elimina o ganho da técnica.',
          explanationDeep:
            'A vantagem de sliding window vem de manter estado incremental. Recalcular tudo em cada passo reintroduz custo alto.',
        },
      ],
      capstone: {
        id: 'sw-cap',
        stem: 'Qual frase resume melhor o benefício da sliding window?',
        choices: [
          'Atualiza estado por entrada/saída sem recomputar subarray inteiro',
          'Sempre dispensa estrutura auxiliar',
          'Só funciona para números inteiros',
          'Sempre depende de ordenação',
        ],
        correctIndex: 0,
        explanationSimple: 'O ganho principal é evitar trabalho repetido desnecessário.',
        explanationDeep:
          'A técnica usa deltas e movimento monotônico para reduzir complexidade em problemas de intervalos contíguos.',
      },
    },
    {
      id: 'recursion-intro',
      linkedConceptSlug: 'recursion-intro',
      certificateTitle: 'Certificado — Recursão com propósito',
      certificateTagline: 'Você define base, redução e sabe quando memoizar para controlar custo.',
      examples: [
        {
          title: 'Caso base + redução',
          simple:
            'Recursão funciona quando cada chamada aproxima de um caso simples que encerra execução.',
          deep:
            'A prova de término exige medida decrescente. Sem essa disciplina, a função pode nunca parar.',
          code: 'function fact(n: number): number {\n  if (n <= 1) return 1;\n  return n * fact(n - 1);\n}',
        },
        {
          title: 'Evitar recomputação com memoização',
          simple:
            'Se subproblemas se repetem, cache de estados reduz custo drasticamente.',
          deep:
            'Memoização converte árvore redundante em reaproveitamento de resultados. Em muitos casos, sai de exponencial para polinomial.',
        },
      ],
      exercises: [
        {
          id: 'rec-e1',
          stem: 'Qual papel do caso base em recursão?',
          choices: [
            'Garantir parada e retorno válido',
            'Aumentar profundidade da pilha',
            'Eliminar necessidade de condição',
            'Forçar complexidade logarítmica',
          ],
          correctIndex: 0,
          explanationSimple: 'Sem base, chamadas continuam indefinidamente.',
          explanationDeep:
            'O caso base ancora corretude e encerra a cadeia de chamadas recursivas.',
        },
        {
          id: 'rec-e2',
          stem: 'Subproblemas repetidos em recursão indicam qual técnica?',
          choices: ['Memoização/DP', 'Heap', 'Two pointers', 'Busca binária'],
          correctIndex: 0,
          explanationSimple: 'Guardar resultado por estado evita recomputar.',
          explanationDeep:
            'A técnica reduz redundância estrutural da árvore de chamadas e melhora escalabilidade.',
        },
        {
          id: 'rec-e3',
          stem: 'Qual cenário sinaliza risco de stack overflow?',
          choices: [
            'Profundidade muito alta proporcional ao input',
            'Uso de variável booleana',
            'Função com retorno numérico',
            'Uso de TypeScript',
          ],
          correctIndex: 0,
          explanationSimple: 'Chamadas profundas demais podem exceder limite da pilha.',
          explanationDeep:
            'Mesmo algoritmo correto pode falhar em runtime por limite de stack; versão iterativa pode ser alternativa.',
        },
      ],
      capstone: {
        id: 'rec-cap',
        stem: 'Qual conjunto mínimo caracteriza recursão saudável?',
        choices: [
          'Caso base + redução em direção ao caso base',
          'Apenas função curta',
          'Apenas cache global',
          'Apenas ausência de laços',
        ],
        correctIndex: 0,
        explanationSimple: 'Sem base e progresso, a recursão não é confiável.',
        explanationDeep:
          'Esses dois elementos sustentam término e corretude; otimizações vêm depois.',
      },
    },
    {
      id: 'stacks-intro',
      linkedConceptSlug: 'stacks-intro',
      certificateTitle: 'Certificado — Pilhas LIFO',
      certificateTagline: 'Você aplica LIFO com segurança em validação e padrões monotônicos.',
      examples: [
        {
          title: 'LIFO na validação de delimitadores',
          simple:
            'O último delimitador aberto deve ser o primeiro fechado. Pilha representa essa regra naturalmente.',
          deep:
            'A invariante é que topo guarda abertura pendente mais recente. Fechamento incompatível detecta erro imediatamente.',
          code: 'if (isOpen(ch)) stack.push(ch);\nelse if (!match(stack.pop(), ch)) return false;',
        },
        {
          title: 'Monotonic stack para consultas de vizinho',
          simple:
            'Mantemos apenas candidatos que ainda podem ser resposta futura.',
          deep:
            'Cada elemento entra/sai no máximo uma vez, o que permite custo linear amortizado em problemas como temperaturas e histogramas.',
        },
      ],
      exercises: [
        {
          id: 'st-e1',
          stem: 'Após `push(1)`, `push(2)`, `push(3)`, qual é o topo?',
          choices: ['1', '2', '3', 'vazio'],
          correctIndex: 2,
          explanationSimple: 'Pilha é LIFO: último a entrar fica no topo.',
          explanationDeep: '`peek` retorna esse topo sem remover; `pop` remove exatamente ele.',
        },
        {
          id: 'st-e2',
          stem: 'O que significa realizar `pop` em pilha vazia?',
          choices: ['Operação normal', 'Underflow/erro de protocolo', 'Auto crescimento da pilha', 'Ordenação automática'],
          correctIndex: 1,
          explanationSimple: 'Remoção sem elemento disponível viola a estrutura.',
          explanationDeep:
            'Implementações robustas tratam esse caso explicitamente para evitar comportamento indefinido.',
        },
        {
          id: 'st-e3',
          stem: 'Por que pilha funciona para parênteses balanceados?',
          choices: [
            'Compara fechamento com abertura pendente mais recente',
            'Ordena símbolos por valor',
            'Elimina laços',
            'Substitui parser completo',
          ],
          correctIndex: 0,
          explanationSimple: 'A ordem de fechamento esperada é exatamente LIFO.',
          explanationDeep:
            'Escopos internos fecham antes dos externos; pilha modela essa hierarquia com simplicidade.',
        },
      ],
      capstone: {
        id: 'st-cap',
        stem: 'Qual estratégia valida corretamente delimitadores `()[]{}`?',
        choices: [
          'Fila FIFO com todos símbolos',
          'Pilha LIFO validando fechamento com topo',
          'Somar códigos ASCII',
          'Ordenar string e comparar pares',
        ],
        correctIndex: 1,
        explanationSimple: 'Aberturas pendentes são controladas no topo da pilha.',
        explanationDeep:
          'Ao percorrer a string, cada fechamento precisa casar com o último aberto ainda não fechado.',
      },
    },
    {
      id: 'queues-intro',
      linkedConceptSlug: 'queues-intro',
      certificateTitle: 'Certificado — Filas FIFO',
      certificateTagline: 'Você entende ordem de chegada e aplicação em exploração por camadas.',
      examples: [
        {
          title: 'FIFO no processamento de tarefas',
          simple:
            'Em fila, quem entra primeiro sai primeiro. Esse modelo é comum em buffers e orquestração de trabalho.',
          deep:
            'Buffers circulares permitem operações eficientes sem deslocamento de elementos, com controle explícito de capacidade.',
        },
        {
          title: 'Fila no BFS',
          simple:
            'No BFS, fila garante exploração por níveis de distância.',
          deep:
            'A fronteira da busca avança camada por camada; isso sustenta corretude para menor caminho em grafos não ponderados.',
        },
      ],
      exercises: [
        {
          id: 'q-e1',
          stem: 'Após enfileirar A, B, C, qual elemento sai primeiro no `dequeue`?',
          choices: ['C', 'B', 'A', 'depende do hardware'],
          correctIndex: 2,
          explanationSimple: 'FIFO preserva ordem de chegada.',
          explanationDeep:
            'Fila padrão não altera prioridade; para isso usa-se fila de prioridade.',
        },
        {
          id: 'q-e2',
          stem: 'Em fila limitada, o que deve existir quando ela lota?',
          choices: [
            'Política de overflow (erro, bloqueio, descarte, retry)',
            'Somente renomear variável',
            'Trocar automaticamente para pilha',
            'Nenhuma decisão adicional',
          ],
          correctIndex: 0,
          explanationSimple: 'Capacidade finita exige decisão explícita de pressão.',
          explanationDeep:
            'Sem política clara, o sistema pode perder dados silenciosamente ou travar sem previsibilidade.',
        },
        {
          id: 'q-e3',
          stem: 'Por que BFS usa fila em grafo não ponderado?',
          choices: [
            'Porque preserva expansão por camadas',
            'Porque evita visitar nós',
            'Porque substitui arestas',
            'Porque não usa memória',
          ],
          correctIndex: 0,
          explanationSimple: 'FIFO garante processamento por distância crescente.',
          explanationDeep:
            'Nós descobertos primeiro pertencem a camadas menores e devem ser processados antes para manter corretude do BFS.',
        },
      ],
      capstone: {
        id: 'q-cap',
        stem: 'Qual estrutura sustenta corretamente a fronteira de exploração no BFS?',
        choices: ['Pilha LIFO', 'Fila FIFO', 'Hash isolado', 'Recursão sem auxiliar'],
        correctIndex: 1,
        explanationSimple: 'BFS depende da ordem FIFO para manter camadas.',
        explanationDeep:
          'Sem essa ordem, você perde a propriedade de menor número de arestas em grafos não ponderados.',
      },
    },
    {
      id: 'linked-list-intro',
      linkedConceptSlug: 'linked-list-intro',
      certificateTitle: 'Certificado — Listas ligadas',
      certificateTagline: 'Você manipula ponteiros com segurança e entende os trade-offs dessa estrutura.',
      examples: [
        {
          title: 'Acesso sequencial e custo de navegação',
          simple:
            'Lista ligada não oferece acesso aleatório eficiente por índice; é preciso caminhar nó a nó.',
          deep:
            'A estrutura favorece inserção/remoção local com referência prévia, mas perde em localidade de cache comparada a arrays.',
          code: 'let curr = head;\nfor (let i = 0; i < k && curr; i++) curr = curr.next;',
        },
        {
          title: 'Nó sentinela reduz casos de borda',
          simple:
            'Sentinela ajuda a tratar inserção/remoção no início sem lógica especial em cada operação.',
          deep:
            'A invariante de "sempre existir predecessor" simplifica manipulação de ponteiros e reduz ramificações.',
        },
      ],
      exercises: [
        {
          id: 'll-e1',
          stem: 'Em lista simplesmente ligada, acessar o i-ésimo elemento custa tipicamente:',
          choices: ['O(1)', 'O(log n)', 'O(i) por navegação sequencial', 'O(n²)'],
          correctIndex: 2,
          explanationSimple: 'É necessário seguir ponteiros até alcançar a posição.',
          explanationDeep:
            'Sem índice auxiliar, não existe salto direto para posição arbitrária como no array.',
        },
        {
          id: 'll-e2',
          stem: 'Na reversão iterativa de lista, quais referências são essenciais por passo?',
          choices: ['Apenas `current`', '`prev`, `current`, `next`', 'Apenas `head`', 'Nenhuma'],
          correctIndex: 1,
          explanationSimple: 'Sem guardar `next`, você perde o restante da lista.',
          explanationDeep:
            'A sequência segura é: salvar próximo, inverter ponteiro atual, avançar janela de ponteiros.',
        },
        {
          id: 'll-e3',
          stem: 'Qual benefício do nó sentinela na cabeça?',
          choices: [
            'Uniformizar operações no início da lista',
            'Garantir acesso O(1) ao i-ésimo',
            'Eliminar necessidade de checar null sempre',
            'Reduzir complexidade para O(log n)',
          ],
          correctIndex: 0,
          explanationSimple: 'Sentinela reduz tratamento especial em bordas.',
          explanationDeep:
            'Ao manter um predecessor estável, inserções e remoções no início ficam alinhadas ao mesmo fluxo do meio da lista.',
        },
      ],
      capstone: {
        id: 'll-cap',
        stem: 'Qual cuidado indispensável em manipulação de listas ligadas?',
        choices: [
          'Ignorar `null` para simplificar',
          'Validar referências antes de acessar `next`',
          'Converter para array em cada operação',
          'Usar recursão obrigatória',
        ],
        correctIndex: 1,
        explanationSimple: 'Checagem de ponteiros evita erros de runtime.',
        explanationDeep:
          'Fins de lista e nós ausentes precisam de invariantes claras e validação defensiva para manter corretude.',
      },
    },
  ],
});
