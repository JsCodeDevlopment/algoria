# Notas de Release (v1.6.0)

### 🚀 Novas Funcionalidades
- **Controle de Autenticação Estrito (Full Gating & Auth Dialog)**: Implementado o bloqueio completo de qualquer conteúdo de estudo (problemas, soluções comentadas, conceitos e guias de carreira) para utilizadores não autenticados. O acesso é interceptado reativamente através do componente `RequireAuth` que ativa o `AuthDialog` global e redireciona automaticamente o utilizador para a página pretendida após o sucesso do login.
- **Exclusão de Conta com Limpeza Total (Wipe)**: Criada uma caixa de diálogo de confirmação para a exclusão de conta no perfil do utilizador. A confirmação remove definitivamente todos os registros e históricos de progresso do banco de dados (Postgres) e limpa completamente o cache local do cliente através de `localStorage.clear()`.
- **Desafio Diário Aprimorado (Checklist e Validação)**: O sistema de Desafio Diário agora exige a validação estrita de três tarefas antes de considerar o desafio completo: 1) o problema deve ser acessível ao utilizador, 2) o enunciado deve ser visitado, 3) todas as soluções disponíveis do problema devem ser lidas, e 4) o utilizador deve passar pelo menos 3 minutos (180 segundos) de tempo ativo na página.

### 🛠️ Melhorias Técnicas & UI
- **Cronómetro Digital LCD/LED (Glowing Clock)**: Adicionado um widget de cronómetro baseado no modelo digital de sete segmentos (`HH:MM:SS:CC`) com renderização em tempo real atualizada a cada 50ms para exibição fluida de centésimos de segundo. O contador usa uma caixa preta de alto contraste com fontes personalizadas e sombras de texto luminescentes (*glow*) brancas e verdes.
- **Estrutura Modular (Separação de Conceitos)**: O rastreador do desafio foi dividido em três partes organizadas: os utilitários de armazenamento e formatação (`daily-challenge-utils.ts`), o hook de controle de efeitos e tempo ativo (`use-daily-challenge.ts`) e o componente de interface pura (`daily-challenge-tracker.tsx`).
- **Alinhamento com o Design System Estrito**: Removidas todas as bordas arredondadas da interface do banner (`rounded-none` absoluto) e limpos os efeitos de pulsação ociosa (`animate-pulse` / `animate-ping`) para garantir sobriedade visual e consistência técnica.
- **Layout Inteligente Flutuante (Sticky)**: O banner agora acompanha o scroll da página de forma fixa (`sticky top-16`) mantendo exatamente a mesma largura útil do conteúdo principal (`max-w-7xl px-6`) com efeito translúcido no fundo e zero impacto na tela quando inativo.

---

# Changelog

## 2026-05-29 — Strict Auth Gating, Account Wipe, and High-Fidelity Stopwatch Tracker
Esta versão foca-se na segurança de dados, privacidade do utilizador e fidelidade visual da interface de desafios, trazendo alinhamentos estritos com o design system da plataforma (zero cantos arredondados) e melhorias na estrutura do código de gamificação.

- **Controle de Acesso Total**: Gating estrito de todo o conteúdo educativo da plataforma, exigindo autenticação via modal global integrado antes do redirecionamento ao destino.
- **Apagamento Completo de Dados**: Funcionalidade de exclusão de conta no perfil que limpa as tabelas relacionais em nuvem e esvazia o armazenamento local do navegador em um único passo.
- **Cronómetro Centesimal com Glow**: Novo design de cronómetro digital com efeito neon de 8 dígitos, medindo o tempo de engajamento do utilizador com suporte a pausas de visibilidade da aba do browser.
- **Status Dashboard Monospace**: Exibição simplificada de requisitos em formato de terminal técnico, oferecendo maior clareza visual sobre as tarefas cumpridas (acesso, leitura e soluções visitadas) sem poluição por animações.
- **Arquitetura Modular em React**: Separação de utilitários de storage e custom hooks de timer, simplificando o componente de visualização.
