import { CoursePackParsed } from '@/lib/content/schemas';

/**
 * Pacote editorial do curso de fundamentos. A prova final de cada módulo desbloqueia o respectivo certificado;
 * o módulo seguinte só desbloqueia após essa prova passar neste navegador (persistência local).
 */
export const FUNDAMENTOS_FASE_1_PACK = CoursePackParsed.parse({
  slug: 'fundamentos-fase-1',
  title: 'Curso Fundamentos — Fase 1',
  subtitle:
    'Trilha sequencial: texto no catálogo de conceitos, exemplos simples ou profundos aqui mesmo, exercícios de fixação e prova final por módulo. Os certificados são emitidos localmente quando concluíres cada avaliação.',
  modules: [
    {
      id: 'big-o',
      linkedConceptSlug: 'big-o',
      certificateTitle: 'Certificado — Big O e análise assintótica',
      certificateTagline: 'Conclusão válida neste navegador após a avaliação final.',
      examples: [
        {
          title: 'Dois laços aninhados — o cliché quadratico',
          simple:
            'Se **para cada posição** vais espreitar **todas** as outras, o trabalho cresce tipo “n × n”: é o cenário habitual de tempo **O(n²)**.',
          deep:
            'Na notação assimptótica, constantes grandes somecem quando n tende ao infinito. Laços assim aninhados **sem poda combinacional** fazem aparecer trabalho proporcional aos **pares ordenados**. Memória conta à parte — um acumulador não importa expoente temporal.',
          code: '// corpo interior O(1) dentro de dois for sobre n ⇒ O(n^2)',
        },
        {
          title: 'Uma volta linear com acumulação constante',
          simple:
            'Visitas todas as casas uma vez só: esforço habitual **linear**. Duplicar escritas dentro do laço só mexe em **fatores**, não mudas o expoente maior.',
          deep:
            'Quando perguntarem complexidade espacial observa onde guardas dados **proporcionais ao input** (cópia completa ⇒ Ω(n)); um par de ints não escala assim.',
        },
      ],
      exercises: [
        {
          id: 'big-o-e1',
          stem: 'Um único loop varre todas as posições exactamente uma vez cada. Ordem habitual do tempo?',
          choices: ['O(n²)', 'O(n)', 'O(log n)', 'O(1)'],
          correctIndex: 1,
          explanationSimple: 'Percorrer tudo uma vez ⇒ **linear** no tamanho do array.',
          explanationDeep:
            'Se o trabalho dentro do loop for amortizado O(1) por iteração, o expoente líquido fica **1** relativo ao tamanho do input.',
        },
        {
          id: 'big-o-e2',
          stem: 'Cada passo corta pela metade o espaço de busca válido até chegar caso trivial.',
          choices: ['O(log n)', 'O(n)', 'O(1)', 'O(n³)'],
          correctIndex: 0,
          explanationSimple: '`log` aparece porque o número de “meias-vidas” escala logarithmicamente.',
          explanationDeep:
            'Clássico em estratégias divide-and-cut que mantêm apenas **factores constantes** de trabalho por nível até esgotares o problema.',
        },
      ],
      capstone: {
        id: 'big-o-cap',
        stem: 'Algoritmo percorre o array inteiro uma vez para somar tudo num acumulador inteiro só. Como descrever tempo e espaço extra habituais?',
        choices: [
          'Tempo O(n²), espaço Ω(n²)',
          'Tempo O(n), espaço O(1) extra',
          'Tempo O(1), espaço Ω(n)',
          'Impossível classificar assim',
        ],
        correctIndex: 1,
        explanationSimple: 'Uma passagem ⇒ **linear**; sem estruturas que crescam com todos elementos ⇒ espaço auxiliar habitual **constante**.',
        explanationDeep:
          'Se também copiar o array inteiro para outro lado, **aí sim** ocupavas Ω(n) extra — mas isso já seria decisão nova do algorítmo.',
      },
    },
    {
      id: 'hash-tables',
      linkedConceptSlug: 'hash-tables',
      certificateTitle: 'Certificado — Hash tables e lookups',
      certificateTagline: 'Sabes porque mapas rápidos têm peso próprio memorização.',
      examples: [
        {
          title: 'Buscar sócio já visto antes',
          simple:
            'Em vez perguntares a **todos** candidatos sempre, perguntares “já apareceu alguém assim?” usando mapa permite **consultar em tempo esperado muito menor** segundo nível pairwise.',
          deep:
            'Hash transforma objeto numa assinatura; em cenários saudáveis consultas ficam amortizadas O(1) **esperado**. Colisões demais ⇒ degrada — por isso análises falam amortização probabilística esperada forte.',
          code: 'seen.has(key); seen.set(key, value);',
        },
        {
          title: 'Chaves bem escolhidas',
          simple:
            'Num anagram grouping, primeiro normalizamos string de letras numa forma **canónica comparable** porque mapa só funciona assim que chave representa igualdades certas problema.',
          deep:
            'Objetos JavaScript fazem hashing diferente das maps — escolhas de ADT são parte soluções corretas e legíveis em entrevistas modernas mesmo TypeScript só.',
        },
      ],
      exercises: [
        {
          id: 'ht-e1',
          stem: 'Lookup habitual médio amortizado forte numa hash table bem dimensionada?',
          choices: ['O(n³)', 'O(log n)', 'O(n)', 'Próximo amortizado esperado constante típico'],
          correctIndex: 3,
          explanationSimple:
            'Não garante sempre O(1) pior cenário contra adversários, mas padrões entrevistas usam amortização forte esperada **constante média típica**.',
          explanationDeep:
            'Worst Ω(n) com colisões massivas sempre possível teorico — comunica isso se pedirem prova formal rigor máximo.',
        },
        {
          id: 'ht-e2',
          stem: 'Um map simples apenas contagem frequências de carácter numa grande string habitualmente aumenta espaço proporcional?',
          choices: [
            'Não aumenta porque strings ignoram hashing',
            'Sim — ao número diferentes chaves vistas (Σ ou carácter set practical)',
            'Sempre proporcional apenas total caracteres apenas sem distinção repetidos apenas',
            'Sempre proporcional n² apenas',
          ],
          correctIndex: 1,
          explanationSimple:
            'Se manténs apenas contadores diferentes letras vistas ⇒ **Ω(alfabeto prático efectivo vista)** ⇒ na prática O(Σ) onde Σ modesto ⇒ constante amortizada problema.',
          explanationDeep:
            'Trade-off **memória proporcional aos estados chave distinta** aparece igualmente outros problemas com keys compostas grandes.',
        },
      ],
      capstone: {
        id: 'ht-cap',
        stem: 'Transformas cenário habitual “nested loops brute complement search” usando map amortizado rápido. Esperas predominantemente?',
        choices: [
          'Exponente igual quadratico apenas micro constantes apenas',
          'Comportamento esperado mais próximo **linear totals** combinando lookups substituindo varreduras internas sempre repetidas sempre',
          'Forças garantia absoluta sempre O(log n) sempre qualquer cenário sempre',
          'Eliminas sempre qualquer uso memória sempre',
        ],
        correctIndex: 1,
        explanationSimple:
          'Eliminar inner linear scan habitualmente remove **Ω(n²)** combinatório porque cada elemento consulta apenas histórico passado.',
        explanationDeep:
          'Este pattern aparece verbatim em **two-sum** style + extensões; lembra revalidação hashing bem definidos + edge empty map.',
      },
    },
    {
      id: 'two-pointers',
      linkedConceptSlug: 'two-pointers',
      certificateTitle: 'Certificado — Dois ponteiros coordenados',
      certificateTagline: 'Sabes ler monotonia ordenada usando extremos síncronos.',
      examples: [
        {
          title: 'Ordenação dá garantias',
          simple:
            'Arrays **ordenados** permitem perguntares “valor demasiado grande mover extremo alto descer” porque sabes lado monotonia consistente garante descartões seguros válidos apenas.',
          deep:
            'Invariantes provam porque “nunca descartarias soluções restantes válidas porque escolheres mover extremo alto” etc — argumento dois-sum ordered pattern.',
        },
        {
          title: 'Ponteiros avançados e sentinellas',
          simple:
            '`left/right` habitualmente apenas movem sempre frente porque cada movimento garante decidiste caminho irrevogável localmente apenas.',
          deep:
            'Off-by-one e duplicidades triplas aparecem com frequência porque esquecestes atualizar dois índices corretamente em ordem garantida apenas.',
          code: 'let l = 0, r = n-1;// while...\n',
        },
      ],
      exercises: [
        {
          id: 'tp-e1',
          stem: 'Two pointers clássico extremos costuma aparecer porque estruturas mostram?',
          choices: [
            'Ordenação total irrelevante apenas',
            'Invariante garante lado errado apenas descartável irreversível seguro apenas',
            'Exige sempre paralelização GPU apenas',
            'Sem laços apenas',
          ],
          correctIndex: 1,
          explanationSimple:
            'Sem garantia ordenação/monotonia confiável, não há argumento porque mover extremidades seguro sempre.',
          explanationDeep:
            'Generaliza outros arranjos dois índices (merge), mas invariante física igual.',
        },
        {
          id: 'tp-e2',
          stem: 'Bug frequente usando two pointers apenas?',
          choices: ['Nenhum apenas', 'Off-by-one violar bounds apenas', 'Nunca aparece loops apenas', 'Compilador sempre avisa apenas'],
          correctIndex: 1,
          explanationSimple:
            'Sem sentinelas/for guards correctos rapidamente ler fora estruturas ou loops infinitos.',
          explanationDeep:
            'Debugging mental pequenos arrays papel resolve rapidamente cenários duvidos atualização ambos ponteiros vs só um apenas.',
        },
      ],
      capstone: {
        id: 'tp-cap',
        stem: 'Porque dois índices num array ordenado batem habitualmente brute all-pairs soma problema típico só?',
        choices: [
          'Somente porque hardware apenas',
          'Cada decisão extremos descarta metade combinacional válida sem revisitar soluções ainda vivas apenas',
          'Hashing físico impede sempre pairwise apenas',
          'Ordenação força paralelismo obrigatorio apenas',
        ],
        correctIndex: 1,
        explanationSimple:
          'Monotonicidade faz descartões irreversível seguras sem regressão combinacional brute.',
        explanationDeep:
          'Este mesmo argumento aparece no padrão clássico **Two Sum II** com entrada ordenada: memoriza a intuição antes de memorizar código.',
      },
    },
    {
      id: 'sliding-window',
      linkedConceptSlug: 'sliding-window',
      certificateTitle: 'Certificado — Janelas deslizantes',
      certificateTagline: 'Sabes manter contagens válidas usando deltas em vez recomputar sempre a mesma fatia inteira.',
      examples: [
        {
          title: 'Histogramas que não resetam sempre',
          simple:
            'Quando entra elemento novo incrementas conta; quando abandona janela decrementas aquele mesmo tipo. Assim só guardas trabalho proporcional aos **vários deltas** aplicados pelo movimento frontal.',
          deep:
            'Se o lado esquerdo se move só para a frente (sem saltos aleatórios para trás) cada índice entra na janela e sai **um número constante limitado vezes**. Somando ao longo de n passos aparece habitualmente **costura linear amortizada**, desde que atualizar deltas seja amortizado bom por caracter quando alfabeto pequeno fixo típico problemas texto.',
          code: 'freq[in]++; while (!valid) freq[out]--;',
        },
        {
          title: 'Teleportar vs deslizar',
          simple:
            'Se sempre resetavas janelas do zero sempre que mover extremo esquerdo fosse arbitrário longe perdias garantias trabalho proporcional apenas movimentações locais porque terias sempre varrer interior completo sempre.',
          deep:
            'Padrões clássicos “menor substring com inventário” mantêm left monotone move relaxando apenas excesso apenas quando válido apenas — sem regressões arbitrárias longe apenas.',
        },
      ],
      exercises: [
        {
          id: 'sw-e1',
          stem: 'Num padrão clássico sliding window porque movemos habitualmente apenas o lado esquerdo para a frente (sem regressões)?',
          choices: [
            'Porque regressar tornava impossível qualquer amortização porque terias sempre revarrer sempre janela inteira sempre',
            'Porque loops infinitos automáticos desejamos sempre sempre',
            'Porque problema exige apenas GPU sempre apenas',
            'Porque problema exige recursão pura apenas',
          ],
          correctIndex: 0,
          explanationSimple:
            'Monotonicidade esquerdo permite apenas limitar numero vezes cada posição apenas entra apenas sai apenas.',
          explanationDeep:
            'Quando apenas permites regressões arbitrárias longe apenas perdes argumento apenas linearidade amortizada apenas clássica apenas habitualmente apenas.',
        },
        {
          id: 'sw-e2',
          stem: 'Construir substring válida menor costuma usar que ingredientes combinados?',
          choices: [
            'Apenas BFS apenas grafos apenas',
            'Ponteiros + mapa obrigações apenas + mover left relaxar excesso quando já válido',
            'Divide conquista apenas merge apenas sempre',
            'Nada estruturas auxiliares',
          ],
          correctIndex: 1,
          explanationSimple:
            'Precisamos saber rapidamente apenas se já satisfazemos apenas restrições apenas + podemos podar apenas frente apenas.',
          explanationDeep:
            'Generaliza apenas histogramas apenas múltiplos caracter apenas simultâneo apenas apenas.',
        },
      ],
      capstone: {
        id: 'sw-cap',
        stem: 'Diferencial chave apenas atualização incremental contagens apenas vs recomputações completas janela apenas?',
        choices: [
          'Nunca existe diferença prática apenas',
          'Delta apenas evita apenas recalcular apenas interior inteira repetidamente apenas ⇒ habitually linear total apenas apenas',
          'GPU apenas apenas obrigatory apenas apenas',
          'Monotone stacks apenas apenas obrigatorily sempre apenas',
        ],
        correctIndex: 1,
        explanationSimple:
          'Recontagens completas apenas cada apenas movimento apenas ⇒ habitualmente apenas Ω(n apenas * apenas larguras grandes apenas) apenas apenas.',
        explanationDeep:
          'Sliding window forte apenas apenas move ponteiros apenas finito apenas vezes apenas combinados apenas apenas n apenas apenas.',
      },
    },
    {
      id: 'recursion-intro',
      linkedConceptSlug: 'recursion-intro',
      certificateTitle: 'Certificado — Recursão com propósito',
      certificateTagline: 'Sabes enunciar casos bases claros e percebes quando overlaps pedem memoização.',
      examples: [
        {
          title: 'Instâncias menores até triviais',
          simple:
            'Resolves problema grande chamando sempre versões estritamente menores (subintervalos subtamanhos diferentes) combinando apenas resultados subproblems até problema trivial apenas.',
          deep:
            'Precisamos medida apenas estritamente decrescent bem fundada apenas (tamanhos distâncias apenas) apenas garantindo apenas terminar sempre apenas apenas.',
          code: '// if trivial return...\n// return combine(rec(..),rec(..));\n',
        },
        {
          title: 'Explosões quando repetes igual subproblems',
          simple:
            'Fibonacci ingénuo refaz igual subtarefas muitíssimos vezes ⇒ custo apenas exponencial terrível apenas.',
          deep:
            'Memo apenas transforma apenas grafo dependências apenas acíclicas apenas apenas reusa estados apenas finitos apenas.',
        },
      ],
      exercises: [
        {
          id: 'rec-e1',
          stem: 'Papel apenas caso base numa recursão corretamente desenhada apenas?',
          choices: [
            'Permitir apenas profundidade infinita apenas',
            'Parar apenas chamadas devolver apenas respostas fechadas sem novas recurso',
            'Criar sempre ciclos apenas',
            'Nada papel apenas',
          ],
          correctIndex: 1,
          explanationSimple:
            'Sem apenas base apenas pilha apenas física apenas explode apenas.',
          explanationDeep:
            'Induction proofs apenas precisam caso base apenas fechamento apenas apenas.',
        },
        {
          id: 'rec-e2',
          stem: 'Overlapping subproblems iguais recorrentemente ⇒ técnica associada apenas?',
          choices: ['BFS apenas grafos apenas', 'Programação dinâmica apenas memorização apenas', 'Hash apenas sempre apenas', 'Aleatório apenas'],
          correctIndex: 1,
          explanationSimple:
            'Cache apenas estados apenas evita apenas recomputações apenas exponenciais apenas.',
          explanationDeep:
            'Topologia apenas DAG apenas estados apenas permite apenas ordem apenas avaliar apenas bottom apenas up apenas apenas.',
        },
      ],
      capstone: {
        id: 'rec-cap',
        stem: 'Que condição grosso modo apenas garante termina apenas recursivas apenas apenas?',
        choices: [
          'Nunca existe apenas',
          'Argumentos apenas fazem apenas medidas apenas sempre descendo até apenas casos base determinísticos apenas fechamento apenas apenas',
          'Dois apenas laços apenas externos apenas obrigatorily apenas apenas',
          'Nomes apenas funções apenas',
        ],
        correctIndex: 1,
        explanationSimple:
          'Sem apenas descida apenas garantida apenas loop apenas infinitamente apenas recurso apenas.',
        explanationDeep:
          'Este raciocinio apenas intuitivo apenas formaliza apenas bem fundamentações ordinals apenas apenas.',
      },
    },
    {
      id: 'stacks-intro',
      linkedConceptSlug: 'stacks-intro',
      certificateTitle: 'Certificado — Pilhas LIFO',
      certificateTagline: 'Compreensão do “último a entrar, primeiro a sair” aplicada a parsers e undone mental.',
      examples: [
        {
          title: 'Parêntesis — só o parceiro recente conta',
          simple:
            'Sempre fecha primeiro delimitador ainda pendurado mais interno porque abriu por último: é **LIFO** palavras simples apenas.',
          deep:
            'Invariante apenas: topo apenas pilha apenas representa apenas delimitadores apenas ainda apenas em abertos apenas apenas sem parceiros fechamentos externos antes apenas.',
          code: 'push(abre);\nassert topo compatible antes pop;',
        },
        {
          title: 'Monotonic stacks (gancho rápido)',
          simple:
            'Quando apenas precisa próximo valor maior menor apenas lado apenas certo apenas muitos candidatos apenas intermediários tornam apenas irrelevant apenas rapidamente apenas.',
          deep:
            'Cada apenas elemento apenas empilha apenas apenas expulso apenas apenas finitas vezes ⇒ trabalho apenas linear amortizado típico problemas apenas histogramas apenas temperaturas apenas.',
        },
      ],
      exercises: [
        {
          id: 'st-e1',
          stem: 'Topo pilha apenas após apenas push apenas 1,2,3 nessa ordem sem pop apenas apenas?',
          choices: ['valor 1 apenas', 'valor 2 apenas', 'valor 3 apenas', 'estrutura vazia apenas'],
          correctIndex: 2,
          explanationSimple:
            'LIFO apenas — últimos push sobrepõem anterior apenas.',
          explanationDeep:
            'peek apenas pop apenas interagem apenas topo apenas estruturas.',
        },
        {
          id: 'st-e2',
          stem: 'pop apenas quando já vazio — resultado típico sem protocolo apenas próprio apenas?',
          choices: ['Sempre apenas sucesso apenas neutro apenas', 'underflow apenas erro apenas undefined apenas', 'pilha apenas cresce automaticamente infinitamente', 'sort apenas mágico'],
          correctIndex: 1,
          explanationSimple:
            'Invariantes apenas alturas apenas não apenas negativo apenas apenas.',
          explanationDeep:
            'Implementações apenas seguras apenas verificam empty apenas antes apenas pop apenas.',
        },
      ],
      capstone: {
        id: 'st-cap',
        stem: 'Por que pilha encaixa naturalmente apenas validação parêntesis balanceados apenas apenas?',
        choices: [
          'shuffle apenas aleatorio apenas apenas',
          'LIFO apenas reproduz regra apenas fechos apenas internos antes externos apenas',
          'Filas apenas equivalentes apenas sempre apenas',
          'não apenas encaixa apenas nunca apenas',
        ],
        correctIndex: 1,
        explanationSimple:
          'Topo apenas espelha parceiros apenas esperando apenas fecha apenas.',
        explanationDeep:
          'Demonstração apenas inductive apenas escaneamentos apenas string apenas apenas.',
      },
    },
    {
      id: 'queues-intro',
      linkedConceptSlug: 'queues-intro',
      certificateTitle: 'Certificado — Filas FIFO',
      certificateTagline: 'Sabes ler processamento primeira chegada primeira saida — porta de entrada habitual BFS níveis.',
      examples: [
        {
          title: 'Balcão de atendimento',
          simple:
            'enqueue apenas adiciona apenas traseira apenas dequeue apenas retira apenas frente — ordem física intuitiva apenas.',
          deep:
            'Implementações apenas circulares apenas economizam memória apenas apenas frequentemente apenas dois índices apenas.',
        },
        {
          title: 'Deque quando precisamos ambos fins',
          simple:
            'Quando apenas precisamos pop apenas também frente apenas além apenas enqueue apenas traseiras rápidos apenas apenas.',
          deep:
            'Deque monótona aparece apenas problemas apenas avançados apenas janelas apenas combina apenas operações dois lados apenas.',
        },
      ],
      exercises: [
        {
          id: 'q-e1',
          stem: 'enqueue apenas A apenas depois B apenas depois C apenas — dequeue apenas primeiro apenas devolve apenas?',
          choices: ['Ordem C,B,A', 'Ordem B primeiro sempre', 'Ordem A primeiro', 'Ordem indefinível legal'],
          correctIndex: 2,
          explanationSimple:
            'FIFO apenas — primeiro apenas entrou apenas primeiro apenas sai apenas.',
          explanationDeep:
            'Prioridades apenas diferentes apenas exigiriam heaps apenas apenas.',
        },
        {
          id: 'q-e2',
          stem: 'Queues bounded sem política apenas extra quando enqueue cheio apenas típico apenas?',
          choices: [
            'Nada apenas críticos apenas sempre',
            'Falhas dados apenas ou necessidade apenas descartes apenas resizing apenas comunicados apenas',
            'dequeue apenas overflow apenas',
            'nunca apenas importa apenas',
          ],
          correctIndex: 1,
          explanationSimple:
            'buffers apenas finitos apenas precisa apenas tratamento apenas overflow apenas explícitos apenas apenas.',
          explanationDeep:
            'Circular apenas queue apenas precisa apenas distinguir apenas cheio apenas vazio apenas sentinelas apenas contador apenas.',
        },
      ],
      capstone: {
        id: 'q-cap',
        stem: 'Porque BFS apenas grafos apenas não ponderados apenas usa filas hábito apenas?',
        choices: [
          'pilhas apenas hardware apenas obrigatorily apenas',
          'FIFO apenas explora fronteira apenas camadas aumentando apenas distancia apenas apenas monotonicidade níveis apenas',
          'somente apenas estéticos apenas apenas',
          'RNG apenas apenas',
        ],
        correctIndex: 1,
        explanationSimple:
          'Garantimos apenas vértices apenas mais apenas próximos apenas descobertos apenas antes apenas saltos apenas distantes apenas.',
          explanationDeep:
          'Introduções apenas posteriores apenas grafos ponderados apenas usam apenas heaps apenas diferente apenas.',
      },
    },
    {
      id: 'linked-list-intro',
      linkedConceptSlug: 'linked-list-intro',
      certificateTitle: 'Certificado — Listas ligadas',
      certificateTagline: 'Sabes navegar apenas next apenas usar sentinelas reduz branching extremos apenas.',
      examples: [
        {
          title: 'Sem random access garantido apenas',
          simple:
            'Cada apenas posição apenas alcança apenas saltando apenas campo next apenas — por isso acesso apenas índice arbitrário apenas custa apenas proporcional trajeto apenas até lá apenas.',
          deep:
            'Caches apenas CPU apenas frequentemente penalizam dispersão apenas nós apenas longe apenas memória contígua apenas comparando arrays apenas densos apenas.',
          code: 'prev.next = node; node.next = old;',
        },
        {
          title: 'Nó sentinel cabeça apenas',
          simple:
            'Dummy apenas head apenas simplifica apenas eliminar apenas casos fronteira prev nulo apenas initial apenas.',
          deep:
            'Invariant apenas sentinel.next sempre aponta primeiro nó apenas valido apenas reduz apenas provas apenas casos apenas extremos apenas.',
        },
      ],
      exercises: [
        {
          id: 'll-e1',
          stem: 'Lista apenas singular apenas — aceso apenas i-ésimo elemento apenas habitualmente apenas?',
          choices: ['O(1) sempre garantido apenas', 'O(log n apenas)', 'O(i) apenas tipico seguindo next apenas', 'O(n² apenas) apenas'],
          correctIndex: 2,
          explanationSimple:
            'Precisa apenas atravessar apenas cadeia apenas linearmente apenas até apenas posição apenas.',
          explanationDeep:
            'lista apenas dupla apenas liga apenas não apenas melhora apenas random access apenas apenas.',
        },
        {
          id: 'll-e2',
          stem: 'Reversão apenas iterativa clássica frequentemente apenas guarda apenas?',
          choices: ['apenas apenas um apenas int apenas', 'Tripla apenas ponteiros prev cur next antes perder apenas ligações', 'heap apenas apenas', 'mergesort apenas apenas'],
          correctIndex: 1,
          explanationSimple:
            'Salva apenas próximo apenas antes apenas rewire atual apenas apenas.',
          explanationDeep:
            'Recursion apenas implicitamente apenas empilha chamadas apenas O(n apenas) apenas espaço stack apenas físico apenas.',
        },
      ],
      capstone: {
        id: 'll-cap',
        stem: 'Por que null pointers apenas merecem atenção constante apenas apenas?',
        choices: [
          'Nunca apenas aparecem apenas',
          'Fim apenas lista apenas next null apenas aparece apenas sempre apenas — obriga apenas checagens explícitos apenas sentinelas apenas',
          'GC apenas apenas remove apenas necessidades apenas invariantes apenas',
          'loops apenas param apenas automaticamente sempre apenas',
        ],
        correctIndex: 1,
        explanationSimple:
          'Ignorar apenas fim apenas causa apenas crash apenas runtime apenas.',
          explanationDeep:
          'Para apenas ciclos apenas futuros apenas tortoise hare apenas detetores apenas apenas.',
      },
    },
  ],
});
