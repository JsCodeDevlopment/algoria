Histórico editorial e técnico da Algoria. Actualizado quando há novas rotas, conteúdo ou melhorias visíveis para quem estuda.

## 2026-05-04

- **Execution trace (MVP)** — Painel «Estado da execução» sincronizado com o player em soluções que tenham `trace.json` (arrays, mapas, escalares).
- **Trilhos curados** — Rotas `/tracks` com listas como *Fundamentos — ordem recomendada* e *Arrays & hashing*.
- **Progresso** — Última linha guardada por solução; exportar/importar JSON no catálogo.
- **Qualidade** — Testes Vitest em filtros do catálogo, trace e schema de progresso; workflow CI com validação de conteúdo, lint, testes e build.
- **Changelog público** — Esta página e entradas no rodapé para acompanhar mudanças.

## Próximas áreas

- Mais `trace.json` por problema / solução óptima.

## 2026-05-05 — Freemium e infraestrutura comercial

- **Pacotes Free / Pro** — Campo `access` nos problemas (`free`: 10 exercícios hero; restantes `pro`).
- **Conta** — Better Auth + Postgres (Drizzle): registo, sessão, merge de progresso local para servidor.
- **Pagamentos** — Stripe Checkout + webhook para tabela `subscription`.
- **Preços e legal** — `/pricing`, termos, privacidade, cookies e reembolsos.
- **Analytics de funil** — Eventos PostHog `pricing_view`, `checkout_start`, `paywall_hit`, `subscription_active`.

---

## Rol seguinte (implementação)

- Secção **Modo revisão** no catálogo (`/problems`): lista problemas marcados como concluídos há ≥ 7 / 14 / 30 dias.
- Novos **execution traces** em Contains Duplicate (hash-set), Valid Anagram (frequency), Merge Sorted Array (merge-from-tail), Move Zeroes (copy-nonzero-fill), Intersection II (hash-frequency).
- Guia **`docs/contributing-code-player.md`** para idiomas do player e `trace.json`.
- **Lightbox** de artigos de engenharia: imagens focáveis com Enter/Espaço e foco inicial no botão Fechar.
