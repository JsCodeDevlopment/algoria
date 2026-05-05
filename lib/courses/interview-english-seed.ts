import { CoursePackParsed } from '@/lib/content/schemas';

export const INTERVIEW_ENGLISH_INTERVIEWS_PACK = CoursePackParsed.parse({
  slug: 'interview-english-track',
  title: 'Interview English — Curso para entrevistas',
  subtitle:
    'Trilha completa cobrindo todo o hub interview-en: recruiter screen, vocabulário DSA, thinking out loud, STAR, system design, passado profissional, follow-up assíncrono e survival kit B1.',
  modules: [
    {
      id: 'phone-screen',
      linkedConceptSlug: 'recruiter-phone-screen-professional-english',
      linkedResourceKind: 'interview-en',
      certificateTitle: 'Certificado — Recruiter & Phone Screen English',
      certificateTagline: 'Você conduz abertura, contexto de carreira e fechamento com clareza profissional.',
      examples: [
        {
          title: 'Abertura profissional sem soar robótico',
          simple:
            'Comece com identidade, stack principal e foco atual em 2-3 frases. Objetivo: clareza e confiança, não discurso decorado.',
          deep:
            'Use uma estrutura estável: **who you are** -> **what you do now** -> **what you are targeting**. Isso reduz ansiedade e melhora consistência em calls curtas.',
        },
        {
          title: 'Perguntas sensíveis: salário, notice period e logística',
          simple:
            'Não fuja da pergunta. Responda com transparência profissional e margem de negociação.',
          deep:
            'Para compensação, prefira faixas e contexto de senioridade. Para disponibilidade, informe restrições reais sem parecer rígido. O tom é colaborativo, não defensivo.',
        },
      ],
      exercises: [
        {
          id: 'ps-e1',
          stem: 'Qual abertura é mais profissional para início de phone screen?',
          choices: [
            '“I can do everything. Just test me.”',
            '“I am a backend engineer focused on Node.js APIs, and recently I have been improving reliability and observability in production systems.”',
            '“I do many things, it depends.”',
            '“Can you explain the company first?”',
          ],
          correctIndex: 1,
          explanationSimple: 'A resposta traz identidade, foco técnico e contexto recente de forma objetiva.',
          explanationDeep:
            'Boa abertura combina especificidade e síntese. Evita exagero, vaguidão e inversão de papel logo no início da conversa.',
        },
        {
          id: 'ps-e2',
          stem: 'Em pergunta sobre pretensão salarial, qual abordagem tende a funcionar melhor?',
          choices: [
            'Recusar qualquer resposta',
            'Dar um valor único inflexível sem contexto',
            'Oferecer faixa coerente com senioridade e escopo da vaga',
            'Responder “whatever is fine”',
          ],
          correctIndex: 2,
          explanationSimple: 'Faixa com contexto mostra maturidade e abertura para alinhamento.',
          explanationDeep:
            'Faixa reduz risco de ancoragem inadequada e mantém poder de negociação. Contextualizar por escopo e mercado melhora precisão.',
        },
      ],
      capstone: {
        id: 'ps-cap',
        stem: 'Qual resposta melhor fecha a call mantendo interesse e profissionalismo?',
        choices: [
          '“I think that is all. Bye.”',
          '“Before we close, could you share the next steps and timeline? I am very interested in the role and happy to provide any additional details.”',
          '“I need an answer today.”',
          '“Can you skip the technical rounds?”',
        ],
        correctIndex: 1,
        explanationSimple: 'Fecha com cordialidade, interesse e solicitação objetiva de próximos passos.',
        explanationDeep:
          'Encerramento forte reforça alinhamento e facilita continuidade do processo sem parecer pressão indevida.',
      },
    },
    {
      id: 'dsa-vocabulary',
      linkedConceptSlug: 'dsa-vocabulary-for-interviews',
      linkedResourceKind: 'interview-en',
      certificateTitle: 'Certificado — DSA Vocabulary in Real Interviews',
      certificateTagline: 'Você comunica decisões algorítmicas com termos naturais e precisos.',
      examples: [
        {
          title: 'Frases de precisão em vez de tradução literal',
          simple:
            'Troque frases vagas por estruturas frequentes em entrevista: “time complexity is linear”, “I can optimize space by...”, “the trade-off is...”.',
          deep:
            'Vocabulário técnico não é lista decorada: é ferramenta para explicar decisão. Treine blocos reutilizáveis para complexidade, edge cases e justificativa de escolha.',
        },
        {
          title: 'Conectores para raciocínio técnico fluido',
          simple:
            'Conectores como “first”, “then”, “however”, “therefore” tornam seu pensamento rastreável para o entrevistador.',
          deep:
            'A clareza discursiva reduz ruído cognitivo. Mesmo com gramática simples, boa estrutura argumentativa melhora percepção de senioridade.',
        },
      ],
      exercises: [
        {
          id: 'dv-e1',
          stem: 'Qual frase comunica melhor trade-off técnico?',
          choices: [
            '“This is better because yes.”',
            '“This approach reduces time complexity to O(n), but it uses extra memory for the hash map.”',
            '“I like this one more.”',
            '“This is the fastest always.”',
          ],
          correctIndex: 1,
          explanationSimple: 'A frase explicita ganho e custo da decisão.',
          explanationDeep:
            'Entrevista técnica valoriza justificativa explícita de trade-off. Falar só “é melhor” não demonstra critério.',
        },
        {
          id: 'dv-e2',
          stem: 'Qual conector melhora sequência lógica ao explicar algoritmo?',
          choices: ['“whatever”', '“anyway”', '“therefore”', '“you know”'],
          correctIndex: 2,
          explanationSimple: '“Therefore” sinaliza conclusão derivada de argumento anterior.',
          explanationDeep:
            'Conectores de causa e consequência ajudam o avaliador a acompanhar seu raciocínio sem esforço extra.',
        },
      ],
      capstone: {
        id: 'dv-cap',
        stem: 'Escolha a melhor explicação curta de complexidade para solução com hash map.',
        choices: [
          '“It is good and should pass.”',
          '“The algorithm runs in O(n) time on average because each lookup in the hash map is expected O(1), with O(n) extra space.”',
          '“It is O(1) always.”',
          '“I do not know complexity but code works.”',
        ],
        correctIndex: 1,
        explanationSimple: 'Resposta correta descreve tempo, hipótese e espaço com precisão.',
        explanationDeep:
          'A formulação reconhece natureza amortizada esperada do hash e evita afirmação absoluta incorreta.',
      },
    },
    {
      id: 'thinking-out-loud',
      linkedConceptSlug: 'thinking-out-loud-dsa-rounds',
      linkedResourceKind: 'interview-en',
      certificateTitle: 'Certificado — Thinking Out Loud for Coding Rounds',
      certificateTagline: 'Você narra hipótese, validação e decisão sem se perder durante live coding.',
      examples: [
        {
          title: 'Narrar antes de codar',
          simple:
            'Explique abordagem, complexidade esperada e edge cases antes de implementar. Isso mostra controle da solução.',
          deep:
            'Um roteiro útil: esclarecer input/output -> propor abordagem inicial -> analisar custo -> confirmar direção -> codar incrementalmente.',
        },
        {
          title: 'Quando você trava: como recuperar sem silêncio',
          simple:
            'Se travar, verbalize hipótese e próximo experimento em vez de ficar em silêncio.',
          deep:
            'Silêncio prolongado parece perda de controle. Comunicação de diagnóstico (“I think my pointer update is wrong; I will test a small case”) demonstra maturidade técnica.',
        },
      ],
      exercises: [
        {
          id: 'tol-e1',
          stem: 'Qual comportamento fortalece sua avaliação em live coding?',
          choices: [
            'Codar imediatamente sem alinhar abordagem',
            'Explicar plano e complexidade antes da implementação',
            'Esperar dica sem falar nada',
            'Focar apenas em sintaxe',
          ],
          correctIndex: 1,
          explanationSimple: 'Alinhar abordagem reduz retrabalho e mostra pensamento estruturado.',
          explanationDeep:
            'Entrevistador avalia processo, não só resposta final. Narrativa técnica coerente evidencia capacidade de colaboração.',
        },
        {
          id: 'tol-e2',
          stem: 'Você detectou bug durante teste manual. Qual fala é mais adequada?',
          choices: [
            '“This is broken.”',
            '“I will restart from scratch.”',
            '“I see an edge case failing when the array is empty; I will add an early return to handle it.”',
            '“Can we skip this?”',
          ],
          correctIndex: 2,
          explanationSimple: 'A fala identifica causa e ação corretiva objetiva.',
          explanationDeep:
            'Comunicar diagnóstico + próximo passo reduz incerteza e transmite raciocínio depurativo.',
        },
      ],
      capstone: {
        id: 'tol-cap',
        stem: 'Qual sequência representa melhor thinking out loud maduro?',
        choices: [
          'Escrever código completo e explicar no final',
          'Clarificar problema -> propor abordagem -> discutir complexidade -> implementar -> validar com casos',
          'Pedir solução ao entrevistador',
          'Falar apenas quando perguntado',
        ],
        correctIndex: 1,
        explanationSimple: 'Sequência mostra método completo de resolução em tempo real.',
        explanationDeep:
          'Esse fluxo evidencia entendimento, critério de escolha e capacidade de auto-verificação sob pressão.',
      },
    },
    {
      id: 'behavioral-star',
      linkedConceptSlug: 'behavioral-star-templates',
      linkedResourceKind: 'interview-en',
      certificateTitle: 'Certificado — Behavioral STAR in English',
      certificateTagline: 'Você constrói respostas comportamentais com estrutura, impacto e linguagem natural.',
      examples: [
        {
          title: 'STAR com foco em impacto mensurável',
          simple:
            'Use Situation, Task, Action, Result. O diferencial está em resultado concreto: tempo, custo, qualidade, risco.',
          deep:
            'Evite histórias longas sem fechamento. Em entrevista técnica, STAR forte é específico, breve e orientado a decisão sob restrição real.',
        },
        {
          title: 'Ação autoral vs ação do time',
          simple:
            'Mostre colaboração, mas deixe claro o que você fez diretamente.',
          deep:
            'Quando tudo fica em “we did”, o entrevistador não consegue avaliar sua contribuição individual.',
        },
      ],
      exercises: [
        {
          id: 'star-e1',
          stem: 'Qual resposta está mais alinhada ao método STAR?',
          choices: [
            '“It was a hard project and we worked a lot.”',
            '“In a release with high incident rate (Situation), I was responsible for reducing rollback frequency (Task). I introduced deploy checklists and health gates (Action), which reduced rollbacks by 40% in two months (Result).”',
            '“I always do my best.”',
            '“The project ended well.”',
          ],
          correctIndex: 1,
          explanationSimple: 'A resposta contém os quatro elementos com resultado específico.',
          explanationDeep:
            'Resultado quantificado fecha a narrativa e comprova impacto, diferencial importante em avaliação comportamental.',
        },
        {
          id: 'star-e2',
          stem: 'Em perguntas comportamentais, qual erro comum enfraquece a resposta?',
          choices: [
            'Usar contexto real',
            'Descrever ação concreta',
            'Não explicitar resultado',
            'Conectar com aprendizado',
          ],
          correctIndex: 2,
          explanationSimple: 'Sem resultado, história perde poder de evidência.',
          explanationDeep:
            'Resultado não precisa ser perfeito, mas deve mostrar efeito e reflexão sobre decisão tomada.',
        },
      ],
      capstone: {
        id: 'star-cap',
        stem: 'Qual frase melhora a seção Result sem soar exagerada?',
        choices: [
          '“Everything was perfect because of me.”',
          '“After the change, average response time dropped from 900ms to 420ms, and incident volume decreased in the following release.”',
          '“People liked it.”',
          '“No idea about the result.”',
        ],
        correctIndex: 1,
        explanationSimple: 'Resultado específico e verificável fortalece credibilidade.',
        explanationDeep:
          'Métrica + contexto temporal + efeito operacional compõem fechamento robusto de STAR.',
      },
    },
    {
      id: 'system-design-framing',
      linkedConceptSlug: 'system-design-phrases-and-framing',
      linkedResourceKind: 'interview-en',
      certificateTitle: 'Certificado — System Design Interview Framing',
      certificateTagline: 'Você conduz conversa de arquitetura com trade-offs explícitos e linguagem executável.',
      examples: [
        {
          title: 'Conduzir escopo antes de desenhar componentes',
          simple:
            'Comece alinhando requisitos funcionais e não funcionais. Sem escopo, desenho vira chute.',
          deep:
            'Perguntas iniciais de volume, latência, consistência e tolerância a falha guiam as decisões de arquitetura e evitam overengineering.',
        },
        {
          title: 'Falar trade-offs com estrutura',
          simple:
            'Para cada decisão, diga benefício, custo e quando escolher alternativa.',
          deep:
            'Frases como “If we prioritize consistency, we may sacrifice availability during partitions” mostram maturidade de design sob restrições.',
        },
      ],
      exercises: [
        {
          id: 'sd-e1',
          stem: 'Qual passo deve vir no início de uma resposta de system design?',
          choices: [
            'Escolher banco imediatamente',
            'Clarificar requisitos e restrições',
            'Desenhar cache em primeiro lugar',
            'Falar apenas de microservices',
          ],
          correctIndex: 1,
          explanationSimple: 'Decisão de arquitetura depende de requisitos claros.',
          explanationDeep:
            'Sem critérios de sucesso e carga esperada, escolhas técnicas ficam arbitrárias e difíceis de defender.',
        },
        {
          id: 'sd-e2',
          stem: 'Qual formulação comunica trade-off de forma mais profissional?',
          choices: [
            '“This is the best architecture.”',
            '“Given the write-heavy workload, I prefer partitioning by tenant; the trade-off is more complex rebalancing later.”',
            '“I would do anything.”',
            '“It depends, next question.”',
          ],
          correctIndex: 1,
          explanationSimple: 'A frase explicita contexto, decisão e custo associado.',
          explanationDeep:
            'Boa comunicação em design conecta hipótese de carga com impacto operacional futuro.',
        },
      ],
      capstone: {
        id: 'sd-cap',
        stem: 'Qual sequência representa framing sólido em system design interview?',
        choices: [
          'Componentes aleatórios -> banco -> API',
          'Requisitos -> estimativas -> arquitetura de alto nível -> trade-offs -> riscos e evolução',
          'Só banco relacional',
          'Só diagrama sem explicação',
        ],
        correctIndex: 1,
        explanationSimple: 'A sequência cria narrativa técnica completa e defensável.',
        explanationDeep:
          'Esse fluxo mostra capacidade de priorização, desenho inicial e pensamento evolutivo diante de limitações reais.',
      },
    },
    {
      id: 'past-tense-power',
      linkedConceptSlug: 'past-tense-phrase-bank-technical-interviews',
      linkedResourceKind: 'interview-en',
      certificateTitle: 'Certificado — Past Tense for Technical Stories',
      certificateTagline: 'Você descreve experiência passada com clareza temporal e impacto profissional.',
      examples: [
        {
          title: 'Simple past vs present perfect na entrevista',
          simple:
            'Use simple past para ações concluídas em contexto fechado e present perfect para experiências conectadas ao presente.',
          deep:
            'Erro de tempo verbal pode confundir cronologia da sua história. Em respostas comportamentais, tempo correto aumenta credibilidade e clareza.',
        },
        {
          title: 'Frases de alto retorno para histórias de entrega',
          simple:
            'Use verbos de ação concretos: “led”, “implemented”, “reduced”, “improved”, “coordinated”.',
          deep:
            'Estruture em blocos: ação executada + contexto + resultado mensurável. Isso evita respostas vagas e genéricas.',
        },
      ],
      exercises: [
        {
          id: 'pt-e1',
          stem: 'Qual frase usa tempo verbal mais adequado para projeto concluído no ano passado?',
          choices: [
            '“I have led the migration last year.”',
            '“I led the migration last year.”',
            '“I am leading the migration last year.”',
            '“I had lead the migration last year.”',
          ],
          correctIndex: 1,
          explanationSimple: 'Com marcador temporal fechado (“last year”), simple past é o mais adequado.',
          explanationDeep:
            'Present perfect normalmente não combina com tempo concluído explícito; ele liga experiência ao presente sem marco fechado.',
        },
        {
          id: 'pt-e2',
          stem: 'Qual resposta comunica melhor impacto em história comportamental?',
          choices: [
            '“I worked on many things.”',
            '“I improved performance.”',
            '“I refactored the query layer and reduced average response time from 1.2s to 500ms.”',
            '“The team did it.”',
          ],
          correctIndex: 2,
          explanationSimple: 'A frase traz ação específica + resultado mensurável.',
          explanationDeep:
            'Entrevistadores valorizam evidência concreta. Métrica e contexto tornam sua contribuição verificável.',
        },
      ],
      capstone: {
        id: 'pt-cap',
        stem: 'Qual abertura de história técnica está melhor estruturada em inglês?',
        choices: [
          '“I have fixed many bugs yesterday in production.”',
          '“Last quarter, I owned a reliability initiative, redesigned retry logic, and reduced incident recurrence by 35%.”',
          '“I do bug fixes and stuff.”',
          '“Many things were done by team.”',
        ],
        correctIndex: 1,
        explanationSimple: 'A frase organiza tempo, responsabilidade, ação e resultado.',
        explanationDeep:
          'Boa história técnica combina temporalidade correta, autoria clara e impacto objetivo em uma única sentença inicial.',
      },
    },
    {
      id: 'async-follow-up-emails',
      linkedConceptSlug: 'async-take-home-follow-up-email-english',
      linkedResourceKind: 'interview-en',
      certificateTitle: 'Certificado — Take-home & Follow-up Email English',
      certificateTagline: 'Você escreve emails profissionais curtos, claros e orientados a ação.',
      examples: [
        {
          title: 'Email de submissão de take-home com contexto certo',
          simple:
            'Inclua: agradecimento, link do repositório, instruções de execução e breve nota de trade-offs.',
          deep:
            'Email técnico eficaz é objetivo e verificável. O avaliador deve conseguir executar seu projeto sem fricção e entender decisões principais.',
        },
        {
          title: 'Follow-up sem soar ansioso',
          simple:
            'Pergunte por próximos passos com tom cordial e prazo razoável.',
          deep:
            'Follow-up profissional reforça interesse sem pressão. Evite mensagens diárias e linguagem de urgência desproporcional.',
        },
      ],
      exercises: [
        {
          id: 'ae-e1',
          stem: 'Qual elemento não pode faltar em email de entrega de take-home?',
          choices: [
            'Memes para quebrar gelo',
            'Link do repositório e instruções de execução',
            'Pedido de resposta imediata',
            'Discussão de salário detalhada',
          ],
          correctIndex: 1,
          explanationSimple: 'Sem acesso e instruções, o avaliador pode nem conseguir revisar seu trabalho.',
          explanationDeep:
            'A melhor entrega reduz carga do revisor: execução simples, contexto técnico e comunicação concisa.',
        },
        {
          id: 'ae-e2',
          stem: 'Qual follow-up mantém profissionalismo após alguns dias sem retorno?',
          choices: [
            '“Are you ignoring me?”',
            '“Just checking if there are any updates.”',
            '“Please answer today.”',
            '“I will withdraw now.”',
          ],
          correctIndex: 1,
          explanationSimple: 'Tom neutro e respeitoso preserva relacionamento.',
          explanationDeep:
            'Follow-up eficaz mantém interesse visível e evita criar fricção desnecessária com o processo seletivo.',
        },
      ],
      capstone: {
        id: 'ae-cap',
        stem: 'Qual mensagem está mais alinhada com entrega profissional de take-home?',
        choices: [
          '“Done. Let me know.”',
          '“Thanks for the opportunity. Here is the repository link, setup steps, and a short note about performance and testing trade-offs.”',
          '“I think it works, maybe.”',
          '“Can you skip review and move to offer?”',
        ],
        correctIndex: 1,
        explanationSimple: 'A mensagem cobre cortesia, artefato, execução e raciocínio técnico.',
        explanationDeep:
          'Esse formato demonstra comunicação assíncrona madura, essencial para processos remotos e times distribuídos.',
      },
    },
    {
      id: 'b1-survival-kit',
      linkedConceptSlug: 'b1-survival-kit-stalls-and-clarifications',
      linkedResourceKind: 'interview-en',
      certificateTitle: 'Certificado — B1 Survival Kit for Interviews',
      certificateTagline: 'Você mantém a conversa fluindo mesmo sob pressão linguística.',
      examples: [
        {
          title: 'Pedir esclarecimento sem perder autoridade',
          simple:
            'Frases como “Could you please rephrase that?” e “Let me confirm I understood correctly...” mantêm controle da conversa.',
          deep:
            'Pedir clarificação não é fraqueza; é habilidade de comunicação profissional. O risco real é responder algo que não entendeu.',
        },
        {
          title: 'Ganhar tempo com pausas produtivas',
          simple:
            'Use pausas curtas e explícitas: “Let me think for a few seconds.”',
          deep:
            'Pausa nomeada evita silêncio desconfortável e mostra organização mental. Melhor do que fillers excessivos ou respostas apressadas.',
        },
      ],
      exercises: [
        {
          id: 'b1-e1',
          stem: 'Qual frase pede repetição de forma profissional?',
          choices: [
            '“What?”',
            '“Can you say that again, please?”',
            '“I do not understand anything.”',
            '“Skip this question.”',
          ],
          correctIndex: 1,
          explanationSimple: 'Pedido curto, educado e direto.',
          explanationDeep:
            'Em entrevista internacional, clareza e cordialidade são mais importantes que tentar adivinhar pergunta mal compreendida.',
        },
        {
          id: 'b1-e2',
          stem: 'Qual estratégia é melhor quando você trava no meio da resposta?',
          choices: [
            'Ficar em silêncio total',
            'Mudar de assunto',
            'Sinalizar pausa curta e retomar com frase-ponte',
            'Encerrar a entrevista',
          ],
          correctIndex: 2,
          explanationSimple: 'Pausa guiada mantém fluidez e reduz ansiedade.',
          explanationDeep:
            'Frases-ponte como “Let me rephrase that” permitem recuperar estrutura sem parecer desorganizado.',
        },
      ],
      capstone: {
        id: 'b1-cap',
        stem: 'Qual resposta demonstra boa recuperação quando faltou vocabulário?',
        choices: [
          '“I cannot continue.”',
          '“I am missing the exact word, but the idea is that we reduce repeated scans by storing previous values in a map.”',
          '“My English is bad.”',
          '“Next question.”',
        ],
        correctIndex: 1,
        explanationSimple: 'Você mantém comunicação de conteúdo mesmo sem palavra perfeita.',
        explanationDeep:
          'Capacidade de contornar lacuna lexical com paráfrase é competência-chave para níveis intermediários em entrevista técnica.',
      },
    },
  ],
});
