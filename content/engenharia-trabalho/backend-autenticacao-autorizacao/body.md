## Objetivos de aprendizagem

1. Explicar **autenticação** (“quem és”) **sem** misturar com **autorização** (“o que podes fazer”).
2. Comparar **sessões servidor** e **tokens portáteis** com trade-offs honestos.
3. Desenhar um controlo RBAC mínimo que não quebre no primeiro microserviço novo.

---

## Duas portas no mesmo edifício

**Porta A — Autenticação:** verifica identidade (password, SSO, WebAuthn, magic link). Saída típica: identificador estável de utilizador + contexto de sessão ou token assinado.

**Porta B — Autorização:** dado um pedido (`DELETE /invoices/42`), verifica políticas: és dono? és admin? tens papel `billing.write`?

Bug clássico: backend confia num campo `role` enviado pelo cliente ou assume “se está autenticado, pode tudo neste recurso”.

---

## Passo a passo — modelar bem à primeira

### 1. Lista verbos de negócio

Exemplos: `invoice.read`, `invoice.refund`, `user.impersonate`. Sem lista enches código de `if` esparsos.

### 2. Decide onde vive a verdade

Papel e permissões devem residir **no servidor** (ou serviço dedicado), atualizados por fluxos controlados — não por edição livre em JWT sem rotacionar segredos quando há incidente.

### 3. Separação clara em cada handler

Ordem mental obrigatória:

1. Validar token ou sessão (**authn**).
2. Carregar recurso ou referência.
3. Avaliar política (**authz**) em função do recurso + utilizador + tenant.

Saltar passos ou inverter 2 e 3 abre buracos de ID enumeration.

---

## Sessões vs tokens (didática comparativa)

| Aspeto | Sessão servidor | Token opaco / JWT |
| --- | --- | --- |
| Revogação imediata | Simples apagar sessão | Mais trabalho (lista de revogação, TTL curto + refresh) |
| Mobilidade entre domínios | Cookies precisam políticas rigorosas | Útil entre APIs e SPAs — mas segredo e armazenamento importam |
| Carga | Estado no servidor ou store partilhado | Menos estado — mais validação criptográfica |

Frase para stakeholders: “JWT não é mais seguro por defeito — é mais **stateless**, com implicações próprias.”

---

## RBAC sem labirinto infinito

1. **Papéis pequenos** alinhados a equipas ou funções reais (suporte nível 2 ≠ engenharia).
2. **Herança explícita** documentada — evita “papéis mágicos” que só uma pessoa entende.
3. **Auditoria**: quem concedeu `admin` a quem e quando?

---

## Erros comuns

| Erro | Sintoma |
| --- | --- |
| Authz só no frontend | Chamadas diretas à API ignoram UI bonita |
| ID em URL sem verificar posse | Utilizador A vê dados de B mudando `id` |
| Misturar scopes OAuth com permissões internas | Tokens válidos mas políticas erradas |

---

## Checklist de endpoint novo

- [ ] Documentei qual papel ou política é necessária?
- [ ] Teste cobre utilizador autenticado **sem** permissão (deve falhar 403, não 404 opaco confuso)?
- [ ] Logs não gravam segredos nem tokens completos?

---

## Glossário

- **403 Forbidden**: autenticaste-te mas política nega.
- **401 Unauthorized**: identidade ausente ou token inválido (nome histórico infeliz).
- **Tenant**: isolamento por organização em SaaS — falhas aqui são dados cruzados catastróficos.

---

## Exercício mental de cinco minutos

Escolhe um endpoint real. Escreve numa folha: **“Que evidência prova que este utilizador pode este recurso?”** Se a resposta for “porque fez login”, falta camada de autorização.
