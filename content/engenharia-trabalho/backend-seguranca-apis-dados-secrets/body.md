## Objetivos de aprendizagem

1. Separar **autenticação** de **reduzir superfície de ataque** em APIs e bases de dados.
2. Listar classes de bugs que CI pode apanhar **antes** de produção.
3. Ter conversa honesta sobre **segredos** rotação e **TLS** sem checklist infinito.

Este guia complementa o texto sobre **autenticação vs autorização** no mesmo hub — aqui o foco é **integridade**, **confidencialidade** e **disponibilidade** no backend quotidiano.

---

## Três estados dos dados

| Estado | Perguntas |
| --- | --- |
| **Em repouso** | Discos, backups, snapshots — estão cifrados? Quem restaura vê PII? |
| **Em trânsito** | TLS entre cliente↔API e API↔base? Certificados renovados como? |
| **Em uso** | Logs, traces e dumps de debug fogem para Slack ou tickets com passwords? |

Segurança falha com mais frequência no terceiro — humanos e ferramentas de observabilidade.

---

## Injeção e parsing mal-trapado

### SQL injection

Concatenar strings de utilizador em queries é um filme já visto — usar **parâmetros bind** ou query builders que não misturam valor cru em texto SQL.

### Command injection

Wrappers em torno de CLI (`exec`) com input utilizador — extremamente frágil.

### Deserialização insegura

Aceitar blobs que viram objetos arbitrários no servidor — superfície gigante. Preferir **schemas estritos** (JSON schema, protobuf, tipos verificados) e versões de protocolo.

---

## Segredos que não são “só variáveis”

- **Nunca** commits com `.env` real — histórico git não é cofre.
- Rotação quando alguém sai da equipa ou token vaza — **tempo de vida curto** melhora que drama raro.
- Em runtime: injectados por orchestrator / vault; apps leem **referência**, não texto plano estático em imagem Docker mal construída.

---

## Cabeçalhos HTTP úteis (camada barata)

Quando framework permite **sem custo cognitivo alto**:

- orientações de **Content Security Policy** mais relevantes ao browser — mas APIs JSON beneficiam de políticas de CORS explícitas e **menos reflexão de origem wildcard** sem critério.
- limitar tamanho de corpo (`413`) antes de parser tentar materializar **JSON gigante** em RAM — liga ao guia de **streams** quando uploads são ficheiros.

---

## Modelagem que reduz danos

- **Princípio do menor privilégio** para credenciais de BD e IAM — serviço que só lê relatórios não recebe `DROP TABLE`.
- **Segmentação** — falha num microserviço não implique credenciais master da empresa inteira no mesmo config map.

---

## Dependências e supply chain

- Lockfiles (`pnpm-lock.yaml`) + revisão de bumps grandes.
- Ferramentas de auditoria (`pnpm audit` ou equivalente) como **gate** em CI — falhas conhecidas não são “opcionais para sprint seguinte” quando CVE é explorável na tua pilha.

---

## Segurança em revisões de código (humano)

Perguntas rápidas em PR:

- Novos endpoints expõem mais dados do que o cliente precisa (**over-fetching** vira leak)?
- Erros devolvem **stack traces** ou mensagens internas ao público?
- Nova integração **desliga** verificação TLS por conveniência?

---

## Relação com autorização

Mesmo com OAuth impecável, um utilizador **autenticado** pode explorar **ID enumeration** ou falta de checagem de **tenant** — segurança completa exige **políticas por recurso**, não só login bonito.

---

## Checklist mínimo antes de go-live

- [ ] TLS extremo a extremo nos hops que controlas.
- [ ] Segredos fora do repo + rotação documentada.
- [ ] Inputs validados por schema — não só “tipos TypeScript” no cliente.
- [ ] Logs sem passwords/tokens — mascarar ou hash onde necessário para debug.

---

## Reflexão

Segurança sustentável não é um PDF de compliance guardado — é **hábitos repetidos** em CI e em reviews que tornam o caminho mais seguro **mais fácil** que o caminho perigoso.
