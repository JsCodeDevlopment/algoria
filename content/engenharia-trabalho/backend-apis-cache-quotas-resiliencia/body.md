## Objetivos de aprendizagem

1. Posicionar **cache** em camadas sem mentir sobre frescura de dados.
2. Desenhar **quotas** que protejam utilizadores leais sem cinismo contra bots úteis.
3. Aplicar **timeouts**, **retries** e **circuit breaker** sem criar tempestades de retry.

---

## Cache como contrato social com o cliente

Cache não é “ligar mais rápido”. É **guardar uma resposta anterior** para não repetir trabalho caro — à custa de potencial **staleness** (dados desatualizados).

Perguntas antes de cachear:

1. Quem pode ver dados em cache sem risco de **vazamento entre utilizadores**?
2. Quanto tempo um utilizador aceita ler valor velho?
3. Como invalidamos quando origem muda?

Erro grave: cache Redis partilhado sem chave incluir **tenant + utilizador + versão do recurso**.

---

## Passo a passo — camadas úteis

### 1. Cache no browser (`Cache-Control`)

Define políticas claras para assets estáticos vs APIs dinâmicas. APIs com dados pessoais raramente devem ser cacheadas em proxies públicos (`private`).

### 2. CDN / reverse proxy

Ótimo para GET idempotentes públicos. Confirma headers e vary corretos quando há negociação de conteúdo.

### 3. Cache de aplicação

Memoização em memória ou Redis para agregações pesadas — sempre com limite de TTL e métrica de hit rate.

---

## Rate limiting e quotas (humanidade primeiro)

Objetivo duplo: proteger infraestrutura **e** dar mensagens que desenvolvedores externos consigam agir.

Boas práticas didáticas:

- Headers `Retry-After` quando bloqueias temporariamente.
- Identidade da quota: IP só é proxy fraco — melhora com API key ou utilizador autenticado.
- **Burst allowance**: mundo real tem picos legítimos.

Anti-pattern: retorno genérico `429` sem doc nem cabeçalhos — gera posts infelizes no fórum da tua API.

---

## Resiliência — timeouts primeiro

Antes de circuit breaker sofisticado:

1. Todo pedido a montante tem **timeout** explícito (socket + leitura).
2. Timeouts encadeados — cliente não deve esperar soma de todos os internos.

### Retries

- Seguros apenas para operações **idempotentes** ou com **token de idempotência**.
- **Backoff exponencial** com jitter — sincroniza retries entre clientes e amplifica falhas se ignorares jitter.

### Circuit breaker

Abre circuito quando taxa de falhas passa limiar → falhas rápidas sem martelar dependência doente. Fecha com gradual ramp ou half-open probing.

---

## Erros comuns

| Erro | Consequência |
| --- | --- |
| Cache sem isolamento multi-tenant | leakage entre clientes |
| Retry infinito em POST não idempotente | duplica cobranças ou registos |
| Falta de métrica de saturação | só descobres limite em Black Friday |

---

## Checklist de API exposta

- [ ] Documentei TTL ou política de frescura por recurso crítico?
- [ ] Rate limit por chave clara + mensagem útil?
- [ ] Timeouts e cancelamento propagados (context cancel)?
- [ ] Dashboard simples: latência p95 montante, taxa 5xx, cache hit?

---

## Glossário

- **Idempotência**: repetir operação não altera estado final além da primeira vez bem-sucedida.
- **Stale-while-revalidate**: servir valor velho enquanto atualiza em fundo — UX melhor, complexidade maior.
- **Thundering herd**: muitos clientes pedem regeneração simultânea quando cache expira — mitiga com locks ou jitter de TTL.

---

## Fecho

Num papel, desenha teu endpoint mais chamado com caixas: cliente → gateway → serviço → BD → integração externa. Marca **onde** um timeout ausente vira fila infinita. Esse mapa vale mais que comprar mais CPU.
