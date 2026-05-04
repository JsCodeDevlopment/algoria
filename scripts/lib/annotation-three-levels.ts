/**
 * Gera Resumo (level1), Detalhado (level2) e Deep dive (level3) para o Code Player.
 * Usado por `sync-annotation-three-levels.ts`.
 */

const GENERIC_PATTERNS =
  /Trecho seguinte mantém|Interpretamos \(|\bapenas apenas\b|^Linha \d+: seguimos o passo marcado|^Linha \d+: fecha um bloco \{\.\.\. \} já aberto mais acima nesta indentação\.?$/;

export function scoring(text?: string): number {
  if (!text?.trim()) return 0;
  let s = Math.min(220, text.trim().length);
  if (GENERIC_PATTERNS.test(text)) s -= 120;
  if (/\*\*[^*]+\*\*/.test(text)) s += 15;
  if (text.includes('\n')) s += 10;
  if (/```/.test(text)) s += 20;
  return s;
}

/** Prefer texto curador existente quando não parece filler; caso contrário usa geração. */
export function chooseTier(prev: string | undefined, neu: string): string {
  const p = prev?.trim() ?? '';
  const n = neu.trim();
  if (!n) return p;
  if (!p) return n;
  if (GENERIC_PATTERNS.test(p)) return n;
  if (GENERIC_PATTERNS.test(n)) return p;
  if (scoring(p) >= scoring(n)) return p;
  return n;
}

/** Título PT legível só para contextualizar texto (opcional no deep dive). */
export function problemaLabel(slug: string): string {
  const map: Record<string, string> = {
    'two-sum': 'Two Sum',
    'contains-duplicate': 'Contains Duplicate',
    'valid-anagram': 'Valid Anagram',
    'maximum-subarray': 'Maximum Subarray',
    'best-time-to-buy-and-sell-stock': 'Melhor momento para comprar e vender ação',
    'valid-palindrome': 'Palíndromo válido',
    'merge-sorted-array': 'Mesclar arrays ordenados',
    'squares-of-a-sorted-array': 'Quadrados de array ordenado',
    'intersection-of-two-arrays-ii': 'Intersecção com repetições',
    'move-zeroes': 'Mover zeros para o fim',
    'group-anagrams': 'Agrupar anagramas',
    '3sum': '3Sum',
    'longest-substring-without-repeating': 'Maior substring sem repetidos',
    'daily-temperatures': 'Temperaturas diárias',
    'trapping-rain-water': 'Armazenar água da chuva',
    'minimum-window-substring': 'Janela mínima com inventário',
  };
  return map[slug] ?? slug.replace(/-/g, ' ');
}

/** Conteúdo base gerado só a partir da linha de código actual. */
export function buildComputedTiers(
  rawLine: string,
  lineNo: number,
  problemSlug: string,
): { level1: string; level2: string; level3: string } {
  const line = rawLine.replace(/\s+$/, '');
  const t = line.trim();
  const label = problemaLabel(problemSlug);
  const code = t.length > 140 ? `${t.slice(0, 137)}…` : t;

  if (!t || t.startsWith('//'))
    return {
      level1: `Linha ${lineNo} vazia ou só formato — faz o código respirar; não há lógica nova aqui.`,
      level2: `Em TypeScript os espaçamentos ajudam a ler blocos aninhados. No player, avança para a linha seguinte: é lá que aparece a próxima instrução com efeito.`,
      level3: `**Gancho pedagógico:** treina o olho a reconhecer que “não fazer nada” também é informação — delimita blocos e evita que o \`if\` ou o \`for\` “agarrem” mais linhas do que deviam por falta de chavetas {}.`,
    };

  // function …
  const fn = /^function\s+(\w+)\s*\(/.exec(t);
  if (fn) {
    return {
      level1: `Declara a função **${fn[1]}** — o ponto de entrada que o juiz / o player mostra como “porta oficial” para este exercício.`,
      level2: `Define o **contrato** de dados: tipos dos parâmetros e o que regressa. Quem usa esta rotina só precisa de saber isso — **não** precisa de conhecer o algoritmo interior. Em entrevistas, escrever assinatura clara evita debates confusos com o avaliador.`,
      level3: `**Trade-off:** poderias marcar arrays como somente-leitura (\`readonly\`) quando não modificas entrada. Também poderias usar tipos mais específicos (tuplos de tamanho fixo) em vez de arrays genéricos — melhora segurança, mas aumenta texto. Para LeetCode, o mínimo costuma bastar.`,
    };
  }

  // closing brace alone
  if (/^[{}]\s*(;)?$/.test(t)) {
    return {
      level1:
        /^}$/.test(t) || /^};?$/.test(t)
          ? `Fecha chavetas — volta o fluxo de execução para o nível imediatamente mais exterior.`
          : `Abre chavetas — as próximas linhas ficam dentro deste mesmo bloco lógico.`,
      level2: `Em JavaScript / TypeScript, **chavetas** transformam várias linhas numa só unidade quando ligadas a \`if\`, \`for\`, etc. Sem elas só a linha seguinte pertence ao \`if\` — causa bugs clássicos em código one-liner mal indentado.`,
      level3: `**Armadilha:** “dangling else” — um \`else\` ambíguo pode ligar-se ao \`if\` errado em cadeias longas. Usa indentação honesta e, se necessário, chavetas explícitas mesmo para um único comando. Aqui o bloco está delimitado visualmente para o player contar linhas certas.`,
    };
  }

  if (/^\bfor\s*\(/.test(t)) {
    return {
      level1: `Inicia um laço \`for\` — repete o corpo enquanto o índice percorre o intervalo definido na cabeça do \`for\`.`,
      level2: `A cabeça do \`for\` tem três zona: **inicialização**, **condição de continuação** e **passo** (ex.: \`i++\`). Juntas ditam quantas vezes o corpo corre. Se a condição falha logo na primeira vez, o corpo pode nem sequer executar.`,
      level3: `**Complexidade habitual:** cada incremento válido faz avançar o trabalho. Se dentro do corpo só fazes operações \(O(1)\), este \`for\` costuma contribuir \(O(n)\) multiplicando o tamanho do intervalo.\n\n**Alternativa elegante:** por vezes um \`while\` com dois ponteiros substitui pares de \`for\` aninhados em inputs ordenados — mas aqui obedecemos ao texto que vês.`,
    };
  }

  if (/^\bwhile\s*\(/.test(t)) {
    return {
      level1: `Começa um laço **condicional** — o corpo repete até a expressão dentro dos parêntesis se tornar falsa.`,
      level2: `Diferente de \`for\`, o \`while\` concentra a lógica de progresso dentro do próprio corpo (incrementos, avanços de ponteiros, etc.). Tens sempre de garantir que **algo muda** a cada volta, senão ficas bloqueado em ciclo infinito.`,
      level3: `**Verificação mental:** será que para qualquer entrada válida existe caminho até a condição falhar?\nEm algorítmos lineares tipo ponteiros, costuma bastar observar que os índices aproximam-se monotonicamente.`,
    };
  }

  if (/^\bif\s*\(/.test(t)) {
    return {
      level1: `Ramificação: só entram aqui determinados comandos quando a condição se avalia verdadeira.`,
      level2: `A condição é uma expressão booleana. Em TS/JS usa \`===\` / \`!==\` em vez de \`==\` quando trabalhas com números — evita conversões mágicas e surpresas com \`truthy/falsy\` no meio.`,
      level3: `**Curto‑circuito:** \`&&\` e \`||\` deixam de avaliar quando o resultado já é conhecido. Em condições com chamadas cara a lado, ordena primeiro testes mais baratos.\n\n**Extensão ao problema (${label})**: este ramo faz parte da história própria deste challenge — volta ao enunciado e pergunta “quando é que isto acontece na definição do problema?”.`,
    };
  }

  if (/^\belse\b/.test(t)) {
    return {
      level1: `Ramo **alternativo** ao \`if\` imediatamente anterior — corre quando a condição principal falhou.`,
      level2: `O \`else\` não tem condição própria: é o “caso residual” garantido só quando não entras no ramo verdadeiro. Em cadeias \`else if\` segues sempre a primeira condição verdadeira de cima para baixo.`,
      level3: `**Edge case:** múltiplas condições mutuamente exclusivas convém fazê-las explícitas; se duas fossem verdadeiras ao mesmo tempo, apenas a primeira aparecida sobrevive.`,
    };
  }

  if (/\bbreak\b/.test(t)) {
    return {
      level1: `Interrompe imediatamente o laço más interno — salta para a primeira linha depois daquele \`while\` / \`for\` / \`switch\`.`,
      level2: `Útil quando já achaste o primeiro objecto válido (“primeiro aquecimento”, “primeiro duplicado”, etc.) por isso trabalhar mais seria redundante.`,
      level3: `**Não uses** quando precisaras de libertar recurso dentro de construções grandes — mantém apenas impacto lexical no laço.`,
    };
  }

  if (/\bcontinue\b/.test(t)) {
    return {
      level1: `Salta apenas **esta volta** actual do ciclo — não mata o laço inteiro; vai directo para a seguinte iteração.`,
      level2: `Funciona bem para ignorares casos “inúteis” (ex.: carácter que não entra no inventário obrigatório da janela mínima) sem encher um \`if\` gigante.`,
      level3: `**Detalhe de leitura:** em laços etiquetados poderias saltar até um ciclo específico, mas esse padrão raramente aparece nos nossos ficheiros canónicos.`,
    };
  }

  if (/^\breturn\b/.test(t)) {
    return {
      level1: `Devolve resultado à função que nos chamou — o fluxo local termina já aqui.`,
      level2: `Todo caminho dentro da função deve eventualmente regressar algo compatível com a assinatura. Quando regressas dentro de loops aninhados, sais de todos eles ao mesmo tempo — comportamento forte para “primeira resposta suficientemente boa encontrada”.`,
      level3: `Em problemas garantidos sempre soluções, um \`return []\` final é apenas acalmador do TypeScript. Em produção, pondera usar \`never\`/excepções ou tipos \`| null\` para deixar explícito “não existe solução”.`,
    };
  }

  if (/\b(new Map|new Set)\s*[<(]/.test(t)) {
    return {
      level1: `Cria estrutura de **consulta rápida** — \`Map\` guarda pares chave→valor; \`Set\` só testa existência.`,
      level2: `Hash tables aliviam procura repetida de \(O(n)\) para \(O(1)\) amortizado em média. **Map** mantém chaves de qualquer tipo; objecto JS converte chaves numéricas em strings e gera surpresas.`,
      level3: `**Pior caso teórico:** colisões massivas degradam para \(O(n)\) — raro na prática com boas distribuições. **Memória:** armas esse \(O(k)\) extra para comprar velocidade.`,
    };
  }

  if (/\bnew Array\s*\(/.test(t)) {
    return {
      level1: `Reserva array com tamanho fixo inicial — placeholders podem ficar pré-preenchidos com \`.fill\`. `,
      level2: `Ao contrário de pushes sucessivos, saber o comprimento já evita realocações repetidas em algumas engines.`,
      level3: `Os slots começados com \`undefined\` ou valores default dependem das chamadas; confirma sempre o que vai precisares por índices antes manipulares.`,
    };
  }

  if (/\|\||&&/.test(t) && /\?/.test(t) === false) {
    return {
      level1: `Expressão booleana combinada — exige dois lados conforme curto‑circuito.`,
      level2: `\`&&\` exige verdadeiros em cadeia; \`||\` basta primeira verdade. Ordenação importa tanto para eficiência como para garantir valores definidos.`,
      level3: `**Idiom:** \`(x ?? y)\`, \`(x ??= y)\`, e operador \`?. \` aparecem noutras soluções — aqui apenas clássico boolean.`,
    };
  }

  if (/\b(Math\.max|Math\.min)\b/.test(t)) {
    return {
      level1: `Operação “mínimo” ou “máximo” elementar aplicada aos argumentos fornecidos.`,
      level2: `Em problemas físicos (${label}) aparece sempre que precisamos de dois limites que competem pela mesma invariante.`,
      level3: `Versões monótonas (pilhas ordenadas mantendo candidatos óptimos sequencialmente) substituem pares repetidos \(Math\) em cenários grandes — são extensões do mesmo pensamento.`,
    };
  }

  if (/\.(?:push|pop|set|get|has)\s*\(/.test(t)) {
    const m = /\.(push|pop|set|get|has)\s*\(/.exec(t);
    const verb = m?.[1] ?? 'estruturas';
    return {
      level1: `Manipula auxiliar clássico (\`${verb}\`) sobre array ou mapa temporário.`,
      level2: `Estas operações são \(O(1)\) amortizado nas estruturas habituais — por isso encaixam dentro de laços lineares sem rebentar complexidade global.`,
      level3: `**Erro clássico:** invocar \`get\` sem testar \`has\` — em TypeScript podes receber \`undefined\`. Usa \`??\`, \`if\` explícito ou \`!\` com consciência tranquila do contrato.`,
    };
  }

  if (/^[}\s]*else\s*\{/.test(t) || /^\s*\}\s*else\s*\{/.test(t)) {
    return {
      level1: `Transição para o ramo alternativo imediatamente depois de fechar o bloco \`if\` anterior.`,
      level2: `Lembra-te: o \`else\` liga-se ao \`if\` mais próximo **ainda aberto** sintaticamente — indentação honesta evita equívocos humanos ao ler.`,
      level3: `Em algoritmos com simetria (dois ponteiros, duas escolhas idênticas) costuma haver um “ramo espelho” — compara mentalmente os dois lados para ver o padrão repetido.`,
    };
  }

  // default: translate line by description
  return {
    level1: `Executa esta instrução dentro do problema **${label}**: \`${code}\`. `,
    level2: `Lê a linha sempre quebrando em parcelas:\n\n- **Que nomes aparecem?** são índices, acumuladores, referências aos inputs?\n- **Que dados mutam ?** aparece modificação estruturas partilhadas?\n\nSe ficares perdido desenha o estado mental dos arrays/maps **antes vs depois** desta única linha.`,
    level3: `**Exercício de mestre:** reescreveria só esta parte com nomes diferentes? Se sim mantém comportamento igual — só melhora legibilidade.\n\n**Complexidade:** pergunta se esta linha entra dentro de ciclo maior; multiplica trabalho apenas quando combinada.`,
  };
}

export function mergeThreeLevels(
  existing: { level1: string; level2?: string; level3?: string },
  computed: ReturnType<typeof buildComputedTiers>,
): { level1: string; level2: string; level3: string } {
  return {
    level1: chooseTier(existing.level1, computed.level1),
    level2: chooseTier(existing.level2, computed.level2),
    level3: chooseTier(existing.level3, computed.level3),
  };
}
