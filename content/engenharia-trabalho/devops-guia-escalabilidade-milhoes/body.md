## Objetivos de aprendizagem

1. Compreender a jornada técnica do zero ao milhão, identificando o momento exato de mudar de arquitetura.
2. Dominar os conceitos de escalabilidade vertical e horizontal, além de seus limites financeiros e técnicos.
3. Implementar uma camada de persistência resiliente através de Read Replicas, Sharding e Caching.
4. Integrar estratégias de segurança e alta disponibilidade em ambientes distribuídos e Multi-cloud.
5. Gerenciar o estado e o processamento assíncrono para mitigar gargalos de I/O e contenção de recursos.

---

:::didactic-figure
{
  "src": "/engenharia/guia-escala-milhoes.png",
  "alt": "Diagrama de evolução arquitetural de 1 a milhões de usuários",
  "caption": "A jornada da escalabilidade: do servidor único à arquitetura distribuída globalmente e multi-cloud."
}
:::

## 1. O problema real e a contextualização da escala

Todo sistema de software inicia sua vida em um estado de simplicidade técnica onde o objetivo primordial é a validação da proposta de valor.
Nesta fase, a arquitetura é um meio para um fim: o Time-to-Market.
No entanto, o sucesso comercial impõe um desafio de engenharia severo: o crescimento acelerado pode colapsar a aplicação se ela não foi projetada para ser elástica.

O problema central da escala não reside apenas no volume bruto de tráfego, mas sim na gestão do estado.
Aplicações que dependem de estado local, como sessões em memória volátil do processo, arquivos em sistemas de arquivos locais ou caches não sincronizados, tornam-se impossíveis de escalar horizontalmente sem introduzir inconsistências graves.

Escalar é, em sua essência, a disciplina de desacoplar o processamento computacional dos dados persistentes.
Sem esse desacoplamento, qualquer tentativa de expansão horizontal resultará em sessões perdidas e corrupção de dados por concorrência mal gerida.
A maturidade de um sistema é medida pela sua capacidade de ser destruído e recriado sem perda de integridade.

---

## 2. Definição técnica de escalabilidade real

Escalabilidade não é meramente a capacidade de suportar mais usuários.
É a capacidade de um sistema lidar com um aumento de carga mantendo a eficiência de custos e sem degradar a experiência do usuário final.

:::didactic-metrics
{
  "title": "Os Quatro Pilares da Escala Profissional",
  "columns": 2,
  "items": [
    { "label": "Performance", "value": "Estável", "sublabel": "Latência p95 e p99 consistente sob alta carga" },
    { "label": "Disponibilidade", "value": "99.99%", "sublabel": "Redundância geográfica e mecanismos de failover automático" },
    { "label": "Eficiência", "value": "Otimizada", "sublabel": "O custo marginal por usuário deve decrescer em escala" },
    { "label": "Operação", "value": "Automatizada", "sublabel": "Infraestrutura como Código e Observabilidade total" }
  ]
}
:::

A escalabilidade real é medida pela previsibilidade.
Um sistema escalável é aquele onde sabemos exatamente qual componente falhará primeiro e qual o custo necessário para expandir sua capacidade antes que a falha ocorra.
O monitoramento deve ser proativo, utilizando métricas de saturação para antecipar a necessidade de escala.

---

## 3. Escala Vertical versus Escala Horizontal

A base fundamental da infraestrutura moderna repousa sobre a escolha entre duas direções de crescimento.

### Escala Vertical (Scale-up)

Este método consiste em adicionar mais recursos computacionais a uma instância já existente.

- Cenário de Uso: É a abordagem padrão para MVPs e bancos de dados relacionais iniciais.
- Vantagens: A complexidade de rede é mínima. Não há comunicação inter-processos entre servidores diferentes.
- Consistência: A consistência de dados é garantida de forma simplificada, sem necessidade de lidar com replicação.
- Riscos: Existe um limite físico imposto pelos provedores de nuvem e um limite financeiro agressivo.
- SPOF: A escala vertical não resolve o problema do Ponto Único de Falha. Se a máquina falha, o sistema inteiro fica offline.

### Escala Horizontal (Scale-out)

Consiste em adicionar mais instâncias de hardware similar ao pool de recursos e distribuir a carga entre elas.

- Cenário de Uso: Essencial para sistemas que buscam alta disponibilidade e escala massiva.
- Vantagens: Permite resiliência através da redundância. Se um nó falha, o Load Balancer redireciona o tráfego.
- Teto de Escala: Oferece um teto de escala virtualmente ilimitado, limitado apenas pelo orçamento e arquitetura.
- Desafios: Introduz latência de rede adicional e complexidade na sincronização de dados.
- Stateless: Exige que a aplicação seja estritamente stateless, o que pode exigir refatorações profundas.

---

## 4. Estágios detalhados da evolução arquitetural: Guia de Implementação

A evolução de um sistema deve ser gradual e justificada por métricas reais.

### Estágio 1: O Monolito Inicial (0 a 1.000 usuários)

Neste estágio, a simplicidade é a maior aliada. O foco está na entrega de funcionalidades.

:::didactic-figure
{
  "src": "/engenharia/escala-estagio-1.png",
  "alt": "Infraestrutura Estágio 1: API e Banco no mesmo servidor",
  "caption": "Estágio 1: Arquitetura minimalista onde todos os componentes residem no mesmo nó computacional."
}
:::

#### Como fazer (Passo a Passo):

1. Escolha de Framework:
   - Opte por linguagens que ofereçam produtividade e performance equilibrada.
   - Exemplos: TypeScript (Node.js), Go, ou Python (FastAPI).
   - Mantenha toda a lógica em um único repositório para minimizar a sobrecarga operacional.

2. Persistência Relacional:
   - Utilize o PostgreSQL.
   - Desenhe um esquema de dados normalizado (3NF) para garantir a integridade.
   - Use migrações controladas por código para garantir versionamento do esquema.

3. Deploy Inicial:
   - Utilize uma única Virtual Private Server (VPS) com CPU compartilhada.
   - Plataformas como Vercel ou Railway são excelentes para abstrair a infraestrutura inicial.
   - O banco de dados pode rodar no mesmo host via Docker Compose para simplificar a rede.

4. CI/CD e Qualidade:
   - Configure um pipeline básico (GitHub Actions) para testes unitários.
   - Realize o deploy automático no branch principal.
   - Implemente logs estruturados em formato JSON para facilitar a depuração futura.

#### Ferramentas recomendadas:
- Framework: Fastify, Express ou Django.
- Banco de Dados: PostgreSQL (versão 15+).
- Servidor: DigitalOcean Droplet ou AWS EC2 t3.micro.
- Proxy: Nginx ou Caddy para SSL automatizado.

#### Ressalvas técnicas:
- Não armazene arquivos no disco local do servidor de aplicação.
- Utilize abstrações de sistema de arquivos que facilitem a migração para S3.
- Evite o uso de threads pesadas para processamentos síncronos longos.

#### Riscos identificados:
- O principal risco é a contenção de recursos entre a API e o Banco.
- Um vazamento de memória na API pode derrubar o processo do banco de dados (OOM Killer).

---

### Estágio 2: Separação de Camadas e Caching (1k a 10.000 usuários)

O sistema começa a apresentar lentidão em horários de pico devido à contenção de I/O.

:::didactic-figure
{
  "src": "/engenharia/escala-estagio-2.png",
  "alt": "Infraestrutura Estágio 2: Banco e Cache separados da API",
  "caption": "Estágio 2: Desacoplamento do banco de dados e introdução de cache em memória (Redis)."
}
:::

#### Como fazer (Passo a Passo):

1. Desacoplamento do Banco de Dados:
   - Mova a base de dados para um serviço gerenciado (AWS RDS ou Google Cloud SQL).
   - Isso delega patches de segurança e backups automáticos para o provedor de nuvem.
   - Habilite o monitoramento de performance (Performance Insights) para identificar queries lentas.

2. Implementação de Cache-Aside:
   - Identifique os endpoints de leitura mais pesados e queries repetitivas.
   - A aplicação deve primeiro consultar o Redis; se falhar, consulta o banco e popula o cache.
   - Use um TTL (Time-To-Live) apropriado para cada tipo de dado.

3. Otimização de Assets e Binários:
   - Mova arquivos estáticos (fotos, documentos) para Object Storage (S3).
   - Implemente upload via Presigned URLs para reduzir a carga na sua API.
   - O navegador envia o arquivo diretamente para o S3, poupando CPU da aplicação.

4. Auditoria de Índices:
   - Utilize o comando EXPLAIN ANALYZE no PostgreSQL.
   - Identifique Sequential Scans em tabelas que cresceram rapidamente.
   - Adicione índices B-Tree ou GIN conforme a necessidade das consultas.

#### Ferramentas recomendadas:
- Banco Gerenciado: AWS RDS ou Cloud SQL.
- Cache: Redis (gerenciado, como AWS ElastiCache).
- Armazenamento: AWS S3 ou Google Cloud Storage.
- CDN: Cloudflare para cache geográfico de assets.

#### Ressalvas técnicas:
- O cache deve ser considerado uma camada opcional e volátil.
- Sua aplicação não deve quebrar se o Redis estiver offline; ela deve apenas ficar mais lenta.

#### Riscos identificados:
- Inconsistência de Cache: Dados obsoletos podem levar a erros de lógica de negócio graves.
- A invalidação do cache deve ocorrer imediatamente após qualquer atualização no banco de dados.

---

### Estágio 3: Alta Disponibilidade e Arquitetura Stateless (10k a 100.000 usuários)

O crescimento exige que o sistema suporte falhas de hardware sem interrupção de serviço.

:::didactic-figure
{
  "src": "/engenharia/escala-estagio-3.png",
  "alt": "Infraestrutura Estágio 3: Load Balancer e múltiplas APIs",
  "caption": "Estágio 3: Introdução de Load Balancer para distribuir carga entre múltiplas instâncias stateless."
}
:::

#### Como fazer (Passo a Passo):

1. Pool de Instâncias Imutáveis:
   - Crie imagens Docker imutáveis da sua aplicação.
   - Configure um grupo de auto-scaling para manter múltiplas instâncias rodando.
   - Distribua as instâncias em pelo menos duas zonas de disponibilidade (AZs).

2. Externalização Total de Estado:
   - Remova qualquer dependência de sessões locais ou cookies em memória.
   - Utilize JWT assinados ou armazene o ID da sessão em um cluster Redis compartilhado.
   - Garanta que qualquer instância possa processar qualquer requisição de qualquer usuário.

3. Load Balancing e Health Checks:
   - Configure um Application Load Balancer (ALB).
   - Defina Health Checks que testem a conectividade real com dependências (endpoint /health).
   - Se uma instância falhar no health check, o LB deve retirá-la do pool automaticamente.

4. Gestão de Deployment:
   - Configure o Load Balancer para Deregistration Delay.
   - Isso permite que requisições ativas terminem antes que o processo da aplicação seja encerrado.
   - Utilize Blue/Green ou Rolling Deployments para evitar downtime durante atualizações.

#### Ferramentas recomendadas:
- Load Balancer: AWS Application Load Balancer.
- Infraestrutura: Terraform para gerenciar a topologia de rede (VPC, Subnets).
- Configuração: Ansible ou Cloud-init para automação.

#### Ressalvas técnicas:
- Evite Sticky Sessions. Elas impedem o balanceamento de carga real.
- Garanta que seus logs sejam enviados para um agregador centralizado (CloudWatch, ELK).

#### Riscos identificados:
- Flapping de Escala: Métricas mal configuradas podem causar ciclos infinitos de escala.
- A latência entre zonas de disponibilidade deve ser monitorada constantemente.

---

### Estágio 4: Desacoplamento Assíncrono e Réplicas de Leitura (100k a 1 Milhão de usuários)

O volume de requisições satura a capacidade de escrita e processamento síncrono.

:::didactic-figure
{
  "src": "/engenharia/escala-estagio-4.png",
  "alt": "Infraestrutura Estágio 4: Filas, Microserviços e Réplicas de Leitura",
  "caption": "Estágio 4: Escala de leitura via réplicas e processamento assíncrono via mensageria."
}
:::

#### Como fazer (Passo a Passo):

1. Implementação de Read Replicas:
   - Habilite réplicas de leitura no seu provedor de banco de dados.
   - No código, separe as conexões: SELECT vai para Réplica, INSERT/UPDATE vai para o Master.
   - Isso escala o poder de consulta sem onerar o banco transacional principal.

2. Processamento em Segundo Plano:
   - Identifique tarefas que não precisam ser imediatas (e-mails, geração de relatórios).
   - Envie essas tarefas para uma fila (SQS ou RabbitMQ).
   - Workers independentes processam as mensagens fora do ciclo de vida da requisição HTTP.

3. Arquitetura Orientada a Eventos:
   - Comece a extrair serviços com vetores de escala distintos.
   - Use o padrão Outbox para garantir que eventos sejam disparados após commits no banco.
   - Implemente Dead Letter Queues (DLQ) para tratar mensagens que falham repetidamente.

4. Connection Pooling Avançado:
   - Implemente o PgBouncer entre sua aplicação e o banco de dados.
   - O proxy gerencia milhares de conexões clientes usando um pool fixo com o servidor.
   - Isso evita o overhead de handshake TCP e autenticação excessiva.

#### Ferramentas recomendadas:
- Mensageria: AWS SQS ou RabbitMQ.
- Workers: BullMQ (Node.js) ou Sidekiq (Ruby).
- Proxy de Banco: PgBouncer.
- Observabilidade: Prometheus e Grafana.

#### Ressalvas técnicas:
- Replica Lag: Existe um atraso milimétrico entre o Master e a Réplica.
- Não leia da réplica em fluxos críticos de escrita (ex: leitura logo após criação).

#### Riscos identificados:
- Perda de Mensagens: Filas sem persistência podem causar perda de dados de processo.
- Explosão de Conexões: Sem pooling, a API pode travar o banco de dados por excesso de processos.

---

### Estágio 5: Escala Massiva e Sharding (1M+ usuários)

O sistema atinge o limite tecnológico de um único banco Master centralizado.

:::didactic-figure
{
  "src": "/engenharia/escala-estagio-5.png",
  "alt": "Infraestrutura Estágio 5: Sharding Global e Multi-region",
  "caption": "Estágio 5: Arquitetura globalmente distribuída com particionamento horizontal de banco (Sharding)."
}
:::

#### Como fazer (Passo a Passo):

1. Database Sharding Horizontal:
   - Divida seu banco de dados em múltiplos clusters independentes (shards).
   - Escolha uma chave de sharding robusta (ex: Organization ID ou User Hash).
   - Cada shard contém apenas uma fatia do dataset total.

2. Roteamento de Tráfego Global:
   - Utilize Route53 Geolocation Routing.
   - Direcione usuários para o data center mais próximo geograficamente para reduzir latência.
   - Implemente latência de rede sub-100ms para o usuário final.

3. Service Mesh e Governança:
   - Implemente Istio ou Linkerd para gerenciar a malha de microserviços.
   - Habilite mTLS automático para segurança em trânsito entre pods.
   - Utilize Distributed Tracing para mapear gargalos em chamadas entre serviços.

4. Edge Computing:
   - Mova lógicas simples (autenticação, rate limiting) para Edge Functions.
   - Reduza a carga nos servidores de origem processando na borda da rede.
   - Utilize CDNs avançadas para caching dinâmico de respostas de API.

#### Ferramentas recomendadas:
- Orquestração: Kubernetes (EKS, GKE).
- Sharding: Vitess ou Citus.
- Service Mesh: Istio.
- Tracing: OpenTelemetry + Jaeger.

#### Ressalvas técnicas:
- Sharding impossibilita joins entre dados de shards diferentes nativamente.
- Toda query complexa que atravessa shards será lenta e deve ser evitada.

#### Riscos identificados:
- Complexidade Operacional Extrema: O sistema torna-se difícil de gerenciar manualmente.
- O uso de GitOps e automação total de infraestrutura torna-se obrigatório para sobrevivência.

---

## 5. Estratégias de Persistência e Otimização de Dados

O banco de dados é o componente mais sensível da arquitetura.

### Particionamento de Tabelas
- Antes do sharding, use o particionamento nativo do PostgreSQL.
- Divida tabelas históricas por data para melhorar performance de vácuo e deleção.

### CQRS (Command Query Responsibility Segregation)
- Separe os modelos de leitura e escrita.
- Use bancos transacionais para escrita e Elasticsearch para buscas textuais complexas.

### Pool de Conexões
- Gerencie conexões na aplicação (HikariCP) e no servidor (PgBouncer).
- Reduza o overhead de autenticação e memória por conexão no servidor.

---

## 6. Segurança em Escala e Resiliência Distribuída

### mTLS e Identidade de Serviço
- Não use IPs para segurança interna.
- Utilize certificados SPIFFE para identificar cada serviço na rede Kubernetes.

### Gestão de Segredos Dinâmicos
- Use HashiCorp Vault para gerar credenciais temporárias para o banco.
- Revogue acessos automaticamente se uma instância for comprometida.

### Segurança Multi-cloud
- Distribua a infraestrutura entre AWS e GCP para evitar vendor lock-in total.
- Use camadas de rede abstratas para interconexão segura entre nuvens.

---

## 7. Gargalos Técnicos e Fenômenos de Colapso

Existem fenômenos específicos de alta escala:

1. Connection Exhaustion: Excesso de conexões derruba o banco instantaneamente.
2. Thundering Herd: Expiração massiva de cache sobrecarrega o banco de dados.
3. Cold Starts: Novos containers iniciam lentos por falta de cache local aquecido.

---

## 8. Stack Tecnológica Recomendada para Alta Escala

| Camada | Tecnologia | Racional Técnico |
| :--- | :--- | :--- |
| Infraestrutura | Kubernetes | Orquestração robusta e escalabilidade de containers. |
| IaC | Terraform | Infraestrutura versionada e reprodutível. |
| Mensageria | Apache Kafka | Alta vazão para eventos persistentes. |
| Banco de Dados | PostgreSQL | Confiabilidade e extensibilidade para escala. |
| Observabilidade | OpenTelemetry | Telemetria padronizada sem lock-in. |
| API Gateway | Kong | Autenticação e rate limiting na borda. |

---

## 9. Considerações Finais sobre a Engenharia de Escala

Escalar um sistema é um processo contínuo de evolução e ajuste.
A solução de hoje será o gargalo de amanhã.
A maturidade da engenharia está em projetar sistemas que permitam mudanças sem reescritas totais.
A automação e a observabilidade são os únicos caminhos para manter a sanidade em alta escala.

---

## Ligações no hub Algoria

- [Pipelines e Deploy](/engineering-work/devops-pipelines-deploy-rollbacks)
- [Observabilidade Mínima Viável](/engineering-work/devops-observabilidade-minima-viavel)
- [Estratégias de Cache e Resiliência](/engineering-work/backend-apis-cache-quotas-resiliencia)
- [Autenticação e Autorização em Microserviços](/engineering-work/backend-autenticacao-autorizacao)
- [Streams e Backpressure em HTTP](/engineering-work/backend-streams-backpressure-http)
- [Docker e Otimização de Imagens](/engineering-work/devops-docker-imagem-otimizacao)
