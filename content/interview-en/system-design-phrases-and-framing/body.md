## What this teaches (B1 engineer friendly)

System design rounds reward **structuring unknowns**:

- clarify **scope** (**users**, **traffic**, latency vs cost posture)  
- describe **flows** before picking buzzword databases  
- name **trade-offs** explicitly (**consistency**, **delivery semantics**, caching staleness)

If English is tiring: speak **slow + short clauses**. Complexity beats accent.

Simple opener template:

“What should be **fast**, what can be **eventual**, and what must stay **consistent**?”

---

## Opening moves (negotiate framing first)

Goals early:

1. Understand **functional** requirements (reads/writes/workflows)  

2. Pin **non-functional** priorities (**latency SLA**, durability, budgets)  

Starter questions (easy):

- “Roughly how many users / requests per second?”  
- “Is strong consistency mandatory or eventual OK sometimes?”  

Deeper probes:

“Typical **read-heavy** asymmetry versus write spikes shaping architecture?”  

If clueless politely:

“If numbers unavailable I'll assume **`X`** as placeholder—tell me revise.” (**Shows methodological discipline**)

Assume & label (say it out loud):

“I’ll assume **`p99`** read latency matters most unless you want to optimise for cost first.”

Shows leadership—not avoidance.

---

## Scoping negotiation (signals senior poise even at B2 English)

Deferrals (examples):

- “I’ll treat multi-region failover **later** and start with a stable single-region path.”  
- “I’ll postpone deep sharding math until we justify it with volume.”

Interviewers admire **explicit deferral**.

---

## Label dimensions (non-functional grid)

Anchor explicitly:

 Latency tiers · Availability posture · Durability (**data loss unacceptable window**) · Consistency spectrum · Cost envelopes · Operational complexity (**operating another datastore**)  

Sentence glue tying dimensions:

“If eventual staleness tolerated we fan-out asynchronously loosening tight write coupling.”

---

## Narration while sketching (~ speak every fifteen seconds silently drawing)

 Parallel tracks:

Boxes + arrows verbally annotated:

“A writes durable log asynchronously consumers hydrate projections (**CQRS flavour optional mention only if interviewer accelerates**)”  

Avoid silent scribbling—they may think you stalled.

English minimal:

“This box caches reads—might be stale up to TTL.”  

Polished:

“Serving layer trades freshness for offload—bounded staleness SLA explicit.”  

---

## Data modeling checkpoints

Speak classification cleanly:

relational normalized vs aggregate denormalized tables · append-only logs · hot vs cold storage tiering  

Shard wording:

Sharding keys influence locality—skewed keys create hotspots undoing parallelism.

Conflict patterns:

 Duplicate events due at-least-once delivery ⇒ idempotent downstream handlers.

Keep idempotency pronunciation slow: eye-DEM-potent.

---

## Caching stratified language

browser cache  

CDN  

reverse proxy caching  

application in-memory (**local vs replicated**)  

distributed cache (**eviction TTL stampede avoidance topics advanced**)  

Short safe:

“If reads repeat we peel load via cache—accept stale bounded window.”  

---

## Scaling shorthand table

 Scenario | Typical phrase skeleton |
 --- | --- |
 read heavy | “Cache + possibly read replicas offload primary writer.” |
 write spikes | “Queue buffers bursts smoothing persistence.” |
 fan-out heavy | “Selective subscriptions vs polling trade freshness.” |
 geographical spread | “Edge caching + regionalized data minimizes RTT—but complicates coherence.” |

Always tie mitigation back **constraint**:

“Fan-out useless if uniqueness guarantee immediate.” (**Shows you avoid cargo-cult scaling**).

---

## Reliability vocabulary (moderate pacing)

Graceful degradation · bulkhead (**isolate failure domains**) · timeouts + jittered backoff · circuit breaker intuition · chaos exercise mindset (**validate assumptions**)  

Operational sentence sample:

“When taxonomy subsystem degrades we serve cached classifications flagging uncertainty—prefer partial metadata than blackout.” (**Business-flavoured pragmatic trade**)

---

## Summaries with forward collaboration hook

Triple-layer recap (**components / flows**)

1. dominant risks / bottlenecks  
2. next exploratory step if you had more time  

Closer example:

“If we had phase two I'd load‑test **`this dimension`** before committing to the storage swap.” (**Collaborative hook** — invites interviewer steering.)

---

## Danger phrases & upgrades

| Weak | Improvement |
| --- | --- |
| “just scale horizontally” | Preconditions: **stateless** tiers + partition strategy |
| “microservices solve it” | Bounded contexts + **operational readiness** |
| vague “eventually consistent everywhere” | Name **domains** where strong consistency stays mandatory |

Demonstrate precondition listing—they trust structured caution.

---

## B1 rehearsal drill (seven-minute timer)

| Slice | Drill |
| --- | --- |
| 0–1 min | Verbal clarifying questions (two minimum) |
| 2–3 min | Name five boxes with one sentence each (**client → CDN → LB → API → DB**) plus one queue optional |
| 4–5 min | Failure scenario + mitigation (**timeout / retry / degraded read**) |
| 6–7 min | Wrap + “next step if we had phase two…” |

Iterate weekly—you will tighten clause chunking without memorising jargon lists.
