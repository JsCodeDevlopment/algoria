## Objetivos de aprendizagem

1. Nomear **race conditions** em linguagem de produto (“dois pedidos ao mesmo tempo”).
2. Decidir quando **transação** ou **chave de idempotência** resolve ou apenas mascara sintomas.
3. Saber que **escalar réplicas** multiplica concorrência — não a elimina.

---

## O que é concorrência neste guia?

**Concorrência** aqui significa: **várias operações em progresso ao mesmo tempo** sobre os mesmos dados ou invariantes de negócio — várias threads num processo, várias corrotinas, ou **várias instâncias** por detrás de um load balancer.

O utilizador vê um único botão “confirmar”; por baixo podem estar **dois** pedidos HTTP legítimos duplicados (retry de rede, duplo clique, webhook repetido).

---

## Race condition em uma frase

Dois fluxos **leem** um estado, **decidem** com base nele e **escrevem** como se fossem os únicos — o último write ganha sem ambos saberem que havia outro.

Exemplo didático clássico:

- Saldo = 100.
- Pedido A lê 100, quer debitar 80 → prevê 20.
- Pedido B lê 100 (antes de A gravar), quer debitar 70 → prevê 30.
- Ambos gravam; um dos débitos **some** ou o saldo fica **incoerente** com a soma das operações.

Sem disciplina de dados, isto sobrevive até ao primeiro fiscal ou primeiro relatório financeiro estranho.

---

## Ferramentas mentais (do mais simples ao mais pesado)

### 1. Operações idempotentes onde dói

Mesmo pedido repetido **não deve** duplicar efeito colateral (cobrança dupla, stock duplo).

Ferramentas:

- **Chave de idempotência** no cabeçalho ou corpo — servidor guarda resultado da primeira execução e devolve o mesmo para repetidos.
- **Natural idempotency** — “define estado final como X” em vez de “incrementa contador” quando negócio permite.

Liga ao guia de **APIs, cache e quotas** quando pensas em retries automáticos.

### 2. Transações de base de dados (ACID)

Para invariantes que cabem **numa única BD relacional**: envolver leituras+escritas críticas na mesma transação com isolamento adequado.

Limitações honestas:

- transações **longas** bloqueiam concorrência útil;
- serviços distribuídos atravessam BDs diferentes — uma única transação global raramente é gratuita.

### 3. Locks (optimista vs pessimista)

- **Pessimista**: “antes de mexer, trinco esta linha”. Simples conceptualmente; mal dimensionado vira fila e timeouts.
- **Optimista**: guardas **versão** do registo; ao gravar, falhas se outro já incrementou versão — retries controlados.

Escolha depende da taxa de conflito real — medir antes de drama operacional.

### 4. Filas e sequenciamento

Para domínios onde só pode haver **uma** decisão por vez por agregado (ex.: conta): publicar comandos numa fila **partition key** = id da conta garante ordem relativa sem locks globais em HTTP.

---

## Concorrência ≠ paralelismo (para alinhar equipa)

**Paralelismo**: duas coisas CPU-bound ao mesmo tempo em núcleos diferentes.

**Concorrência**: intercalamento — uma thread espera I/O enquanto outra avança.

APIs típicas são **I/O bound**; ganhos vêm de modelo mental de dados e limites de pool, não só “mais threads”.

---

## Armadilhas em código async

- Duplo `await` em sequência quando poderiam ser independentes — latência somada sem necessidade.
- Partilhar estado mutável entre handlers sem política — volta ao exemplo do saldo.
- Assumir que **uma instância única** resolve consistência — quando escalar horizontalmente, cache em memória local mente sobre “única verdade”.

---

## Checklist antes de lançar feature financeira ou de stock

- [ ] Descreveste cenário “dois pedidos iguais em 200 ms” num doc curto?
- [ ] Há **idempotência** ou **unique constraint** que impeça duplicado semântico?
- [ ] Escalas de retry do cliente podem gerar duplicados — servidor está preparado?

---

## Ligações no hub Algoria

- Autenticação vs autorização — quem pode mexer é camada diferente de **quantas vezes** pode repetir com segurança.
- APIs com cache — caching agressivo pode expor dados velhos sob writes concurrentes se TTL e invalidação não forem pensados.

---

## Reflexão

Concorrência não pede buzzwords distribuídos no dia um — pede **uma invariante escrita** (“saldo nunca negativo”, “uma subscrição activa por conta”) e evidência de que o código **preserva** essa invariante sob repetição e paralelismo modesto.
