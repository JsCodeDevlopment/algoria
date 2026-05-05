import { CoursePackParsed } from '@/lib/content/schemas';

export const FUNDAMENTOS_FASE_2_PACK = CoursePackParsed.parse({
  slug: 'fundamentos-fase-2',
  title: 'Curso Fundamentos — Fase 2',
  subtitle:
    'Trilha intermediária para decisão algorítmica: busca binária por invariantes, ordenação orientada a trade-offs, grafos com BFS/DFS, programação dinâmica e greedy com prova.',
  modules: [
    {
      id: 'binary-search-invariants',
      linkedConceptSlug: 'binary-search-invariants',
      certificateTitle: 'Certificado — Busca Binária por Invariantes',
      certificateTagline: 'Você resolve fronteiras sem cair em off-by-one e sem decorar template.',
      examples: [
        {
          title: 'Intervalo fechado vs semiaberto',
          simple:
            'A escolha entre `[l, r]` e `[l, r)` muda condição de parada e atualização de fronteiras.',
          deep:
            'A implementação só é robusta quando a invariante é explícita: tudo fora da região ativa já foi provado inválido.',
          code: 'while (l < r) {\n  const m = l + Math.floor((r - l) / 2);\n  if (ok(m)) r = m;\n  else l = m + 1;\n}',
        },
        {
          title: 'Busca no espaço de resposta',
          simple:
            'Nem sempre buscamos um índice do array; muitas vezes buscamos o menor valor que satisfaz uma condição.',
          deep:
            'Quando o predicado é monotônico (`false...false,true...true`), a busca binária reduz otimização a decisão por fronteira.',
        },
      ],
      exercises: [
        {
          id: 'bs2-e1',
          stem: 'Qual condição é essencial para aplicar busca binária no espaço de resposta?',
          choices: [
            'Predicado monotônico ao longo do domínio',
            'Array obrigatoriamente sem duplicatas',
            'Uso de recursão',
            'Complexidade O(1) do predicado',
          ],
          correctIndex: 0,
          explanationSimple: 'Sem monotonicidade, não há garantia de descartar metade corretamente.',
          explanationDeep:
            'A técnica depende da propriedade de fronteira; sem ela, mover `left` ou `right` pode eliminar a resposta correta.',
        },
        {
          id: 'bs2-e2',
          stem: 'No padrão lower bound com intervalo semiaberto, quando `ok(mid)` é verdadeiro, o que fazer?',
          choices: ['`left = mid + 1`', '`right = mid`', '`right = mid - 1`', 'encerrar imediatamente'],
          correctIndex: 1,
          explanationSimple: 'Se `mid` já atende, ele ainda pode ser a primeira posição válida.',
          explanationDeep:
            'Para achar o primeiro válido, preservamos `mid` na região candidata e fechamos pela direita.',
        },
      ],
      capstone: {
        id: 'bs2-cap',
        stem: 'Qual afirmação melhor descreve implementação madura de busca binária?',
        choices: [
          'Decorar template e adaptar na hora',
          'Definir invariante, convenção de intervalo e casos de borda antes do loop',
          'Sempre usar `left <= right`',
          'Parar ao primeiro `mid` válido',
        ],
        correctIndex: 1,
        explanationSimple: 'Robustez vem de contrato lógico, não de copiar padrão.',
        explanationDeep:
          'Busca binária é uma prova iterativa de fronteira; sem contrato explícito, pequenos ajustes geram bugs difíceis.',
      },
    },
    {
      id: 'sorting-fundamentals',
      linkedConceptSlug: 'sorting-fundamentals',
      certificateTitle: 'Certificado — Ordenação e Trade-offs',
      certificateTagline: 'Você escolhe ordenação por requisito, não por hábito.',
      examples: [
        {
          title: 'Estabilidade como requisito de produto',
          simple:
            'Ordenação estável preserva ordem relativa de itens empatados.',
          deep:
            'Em rankings e filas, instabilidade pode quebrar expectativa do usuário mesmo com ordenação “correta” pela chave principal.',
        },
        {
          title: 'Comparar quick, merge e heap com critério',
          simple:
            'Cada algoritmo prioriza um eixo: média prática, pior caso ou estabilidade.',
          deep:
            'Decisão madura considera volume, memória, previsibilidade e semântica de empate; não só Big O de tabela.',
        },
      ],
      exercises: [
        {
          id: 'sort2-e1',
          stem: 'Qual cenário exige atenção explícita à estabilidade?',
          choices: [
            'Ordenar inteiros únicos',
            'Ordenar registros por prioridade mantendo ordem de criação em empate',
            'Comparar apenas tamanho de strings',
            'Ordenar array vazio',
          ],
          correctIndex: 1,
          explanationSimple: 'Empates com significado de negócio pedem estabilidade.',
          explanationDeep:
            'Sem estabilidade, itens empatados podem trocar de posição e gerar inconsistência percebida pelo usuário.',
        },
        {
          id: 'sort2-e2',
          stem: 'Qual armadilha clássica em comparadores de ordenação?',
          choices: [
            'Esquecer retorno para empate',
            'Usar arrays como entrada',
            'Ordenar em ordem crescente',
            'Testar com poucos elementos',
          ],
          correctIndex: 0,
          explanationSimple: 'Comparador incompleto pode gerar ordem não determinística.',
          explanationDeep:
            'Quando empate não é tratado corretamente, diferentes execuções podem produzir resultados distintos em dados equivalentes.',
        },
      ],
      capstone: {
        id: 'sort2-cap',
        stem: 'Qual decisão demonstra domínio de ordenação em contexto real?',
        choices: [
          'Sempre implementar quicksort manual',
          'Usar sort nativo sem verificar contrato',
          'Escolher estratégia com base em estabilidade, memória e perfil de dados',
          'Evitar ordenação por custo',
        ],
        correctIndex: 2,
        explanationSimple: 'A escolha correta depende de requisitos e restrições concretas.',
        explanationDeep:
          'Ordenar é decisão de modelagem; algoritmo e comparador precisam refletir semântica de negócio e limites de execução.',
      },
    },
    {
      id: 'graphs-intro-traversals',
      linkedConceptSlug: 'graphs-intro-traversals',
      certificateTitle: 'Certificado — Grafos com BFS e DFS',
      certificateTagline: 'Você escolhe representação e percurso com justificativa técnica.',
      examples: [
        {
          title: 'Lista de adjacência vs matriz',
          simple:
            'Lista é eficiente para grafos esparsos; matriz favorece consulta direta de aresta.',
          deep:
            'A escolha afeta memória, tempo de iteração e complexidade de operações centrais do problema.',
        },
        {
          title: 'Quando BFS vence DFS',
          simple:
            'BFS é preferível para menor caminho em grafo não ponderado.',
          deep:
            'DFS explora profundidade e estrutura; BFS preserva camadas de distância e garante menor número de arestas.',
        },
      ],
      exercises: [
        {
          id: 'graph2-e1',
          stem: 'Para menor caminho em número de arestas (grafo não ponderado), qual percurso escolher?',
          choices: ['DFS', 'BFS', 'Ordenação topológica', 'Backtracking puro'],
          correctIndex: 1,
          explanationSimple: 'BFS visita por camadas e preserva distância mínima por aresta.',
          explanationDeep:
            'Ao expandir nível a nível, o primeiro encontro do destino ocorre pelo menor número de arestas.',
        },
        {
          id: 'graph2-e2',
          stem: 'Qual erro frequentemente causa loop infinito em grafos com ciclo?',
          choices: [
            'Usar fila em vez de pilha',
            'Não manter conjunto de visitados',
            'Usar lista de adjacência',
            'Ter grafo desconectado',
          ],
          correctIndex: 1,
          explanationSimple: 'Sem visitados, o algoritmo revisita nós ciclicamente.',
          explanationDeep:
            'Grafos gerais não têm garantia de aciclicidade; marcação correta de visitados é parte do contrato de percurso.',
        },
      ],
      capstone: {
        id: 'graph2-cap',
        stem: 'Qual sequência de decisão é mais sólida ao iniciar problema de grafo?',
        choices: [
          'Escolher DFS imediatamente',
          'Classificar tipo de grafo, definir representação e só então escolher percurso',
          'Converter tudo para árvore',
          'Implementar brute force para depois otimizar',
        ],
        correctIndex: 1,
        explanationSimple: 'Escolha de percurso depende do tipo de grafo e objetivo da consulta.',
        explanationDeep:
          'Problemas de grafo são sensíveis à modelagem inicial; decisões corretas no começo evitam retrabalho estrutural.',
      },
    },
    {
      id: 'dynamic-programming-intro',
      linkedConceptSlug: 'dynamic-programming-intro',
      certificateTitle: 'Certificado — Programação Dinâmica',
      certificateTagline: 'Você modela estado, transição e base sem depender de receita pronta.',
      examples: [
        {
          title: 'Estado mínimo e suficiente',
          simple:
            'DP começa por definir qual informação realmente identifica um subproblema.',
          deep:
            'Estado grande demais explode memória; estado pequeno demais perde informação e quebra recorrência.',
        },
        {
          title: 'Top-down e bottom-up como faces da mesma relação',
          simple:
            'Memoização e tabulação resolvem a mesma recorrência por caminhos diferentes.',
          deep:
            'Top-down acelera descoberta; bottom-up costuma facilitar otimização de memória e previsibilidade de execução.',
        },
      ],
      exercises: [
        {
          id: 'dp2-e1',
          stem: 'Qual elemento não pode faltar em solução de DP?',
          choices: ['Recursão obrigatória', 'Estado e recorrência bem definidos', 'Heap', 'Ordenação prévia'],
          correctIndex: 1,
          explanationSimple: 'Sem estado e transição, não há DP válida.',
          explanationDeep:
            'DP é modelagem de dependências entre subproblemas; implementação vem depois da formulação.',
        },
        {
          id: 'dp2-e2',
          stem: 'Quando bottom-up costuma ser preferível?',
          choices: [
            'Quando queremos evitar overhead de recursão e controlar ordem de preenchimento',
            'Quando não existe recorrência',
            'Quando problema é puramente guloso',
            'Quando só há um estado',
          ],
          correctIndex: 0,
          explanationSimple: 'Bottom-up reduz dependência de stack e torna execução mais previsível.',
          explanationDeep:
            'Em entradas grandes, tabulação evita limites de recursão e pode facilitar compressão de memória por linha/coluna.',
        },
      ],
      capstone: {
        id: 'dp2-cap',
        stem: 'Qual prática melhor indica maturidade em DP?',
        choices: [
          'Decorar soluções clássicas',
          'Priorizar sintaxe antes de modelar',
          'Derivar estado, transição e base antes de implementar',
          'Sempre usar memoização global',
        ],
        correctIndex: 2,
        explanationSimple: 'Modelagem precede código em DP.',
        explanationDeep:
          'A maior parte dos erros em DP vem de formulação incorreta, não de implementação mecânica.',
      },
    },
    {
      id: 'greedy-choice-intro',
      linkedConceptSlug: 'greedy-choice-intro',
      certificateTitle: 'Certificado — Greedy com Prova',
      certificateTagline: 'Você distingue intuição gulosa de solução realmente correta.',
      examples: [
        {
          title: 'Greedy só vale com propriedade estrutural',
          simple:
            'Escolha local rápida só é válida quando há justificativa global.',
          deep:
            'Sem greedy-choice property ou exchange argument, a solução pode parecer boa e ainda assim estar errada.',
        },
        {
          title: 'Greedy vs DP na prática',
          simple:
            'Greedy é simples e rápido quando funciona; DP é fallback robusto quando greedy quebra.',
          deep:
            'Fluxo maduro: formular regra local, buscar contraexemplo e migrar para DP quando não há prova convincente.',
        },
      ],
      exercises: [
        {
          id: 'gr2-e1',
          stem: 'Qual atitude técnica é correta antes de aceitar estratégia greedy?',
          choices: [
            'Confiar na intuição',
            'Buscar argumento de corretude e tentar quebrar com contraexemplo',
            'Comparar só tempo de execução',
            'Evitar casos de borda',
          ],
          correctIndex: 1,
          explanationSimple: 'Greedy precisa de prova ou evidência estrutural, não só velocidade.',
          explanationDeep:
            'Contraexemplo pequeno é ferramenta poderosa para invalidar regra local inadequada antes de codificar solução final.',
        },
        {
          id: 'gr2-e2',
          stem: 'Em qual cenário a regra gulosa clássica “termina mais cedo” é conhecida por funcionar?',
          choices: [
            'Interval scheduling sem pesos',
            'Qualquer problema de mochila',
            'Toda variante de caminho mínimo',
            'Problemas sem ordenação',
          ],
          correctIndex: 0,
          explanationSimple: 'Na seleção de intervalos sem pesos, essa estratégia possui prova clássica.',
          explanationDeep:
            'Ordenar por término e escolher o primeiro viável maximiza espaço restante para escolhas futuras não conflitantes.',
        },
      ],
      capstone: {
        id: 'gr2-cap',
        stem: 'Qual frase representa postura profissional sobre greedy?',
        choices: [
          'Greedy sempre é melhor por ser mais rápido',
          'Se passar nos exemplos, está correto',
          'Greedy é ótimo quando há prova; sem isso, prefiro validar contraexemplo ou migrar para DP',
          'Greedy e DP são equivalentes',
        ],
        correctIndex: 2,
        explanationSimple: 'A decisão correta combina desempenho com garantia de corretude.',
        explanationDeep:
          'Engenharia algorítmica madura prioriza resultado correto e justificável, não apenas solução curta.',
      },
    },
  ],
});
