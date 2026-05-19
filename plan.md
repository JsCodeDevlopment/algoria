# 🚀 Propostas de Gamificação e Engajamento (Algoria)

Para criar um mecanismo dopaminérgico que faça os usuários retornarem todos os dias, precisamos focar em **hábitos (gatilho + recompensa)** e **progresso visível**.

Baseado na arquitetura atual do Algoria (que já possui a tabela `user_progress`, `technical_assessment_results`, e tipos de conteúdo como `problem`, `concept`, `technical-test`), aqui estão as melhores abordagens que podemos implementar de forma rápida e de alto impacto:

## 1. Sistema de Ofensivas (Streaks) 🔥 [Foco em Retenção Diária]

A aversão à perda (não querer perder o combo) é um dos gatilhos psicológicos mais fortes em apps de aprendizado (ex: Duolingo, LeetCode).

- **Como funciona:** Se o usuário resolve um problema, passa num teste técnico ou completa um conceito no dia, ele ganha +1 na ofensiva.
- **Implementação:**
  - Podemos usar os timestamps (`completedAt`, `updatedAt`) de `user_progress` e `technical_assessment_results` para calcular a ofensiva atual.
  - Adicionar um ícone de "Fogo 🔥" persistente na Navbar (ao lado do perfil) mostrando os dias seguidos.
  - Um **Heatmap** (estilo GitHub) no `userProfile` para mostrar a consistência visualmente.

## 2. Desafio Diário (Daily Challenge) 📅 [Foco em Rotina]

Muitas vezes o usuário entra e não sabe por onde começar. O "Paradoxo da Escolha" reduz o engajamento.

- **Como funciona:** Destacar um algoritmo ou teste específico na página inicial (ex: "Desafio de Hoje: Two Sum").
- **Recompensa:** Resolver o desafio no dia correto concede uma "Medalha" ou XP em dobro.
- **Implementação:** Podemos criar um script simples ou lógica no backend que seleciona um `content` do tipo `problem` diferente baseado na data atual (`new Date().setHours(0,0,0,0)`).

## 3. Feedback Imediato e Micro-animações 🎉 [Foco em Dopamina Pura]

A interface precisa comemorar com o usuário. Atualmente, rodar um código e ver um "Testes passaram" é funcional, mas não dopaminérgico.

- **Como funciona:** Ao passar em um `technical-test` (quando `codePassed` for true) ou finalizar a simulação ótima de um algoritmo visual:
  - Disparar **Confetes** na tela inteira (usando lib como `canvas-confetti`).
  - Exibir uma notificação flutuante animada e brilhante (ex: **"Resolução Ótima Encontrada! +50 XP"**).
  - Pequenos efeitos sonoros de sucesso (opcional, como um 'pling' satisfatório).
- **Implementação:** Alterações puramente no Frontend (React/Framer Motion) conectadas às lógicas de submissão existentes.

## 4. Pontos de Experiência (XP) e Níveis 📈 [Foco em Progressão]

Dar um senso de evolução contínua.

- **Como funciona:** Cada ação na plataforma vale XP:
  - Resolver Problema Fácil: +10 XP
  - Teste Técnico Perfeito: +50 XP
  - Assistir aula (concept): +10 XP
- **Implementação:** Podemos adicionar um campo `xp` na tabela `user_profile` ou calcular dinamicamente. Na interface, colocamos uma "Barra de Progresso" circular no avatar ou na barra superior.

## 5. Emblemas / Conquistas (Badges) 🏅 [Foco em Colecionismo]

- **Como funciona:** Recompensas desbloqueáveis por marcos específicos.
  - _Bug Catcher:_ Errou e corrigiu.
  - _Mestre dos Arrays:_ Completou todos os problemas da tag Arrays.
  - _Notívago:_ Resolveu um problema de madrugada.

---

> [!TIP]
> **Por onde começar? (Minha Sugestão)**
> A combinação de **Ofensivas (Streaks na Navbar) + Efeitos de Confetes na Resolução de Problemas** é o que traz o maior retorno de dopamina no curto prazo. É visualmente impactante, premium, e usa dados de submissão que já temos mapeados!

Qual dessas ideias (ou qual combinação delas) você gostaria de atacar primeiro? Podemos desenhar o plano de implementação técnico e visual da opção escolhida.
