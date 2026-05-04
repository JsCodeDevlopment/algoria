## Opening moves

Goal first minutes: align **scope**, **scale assumptions**, and **success metrics**.

Strong openers:

- “Before sketching components—could we clarify approximate daily active users and typical read/write asymmetry?”  
- “I'll assume `<latency SLA>` matters more than `<cost minimization>` unless you want to invert priorities.”  
- “I'll iterate high‑level data flow first, then deepen hotspots—tell me if you'd rather jump to storage modeling.”  

Shows structured facilitation—not hesitation.

---

## Scoping language

Negotiate depth politely:

- “For timeboxing I'll treat `<feature>` as post‑MVP unless you elevate it.”  
- “I'll postpone multi‑region failover nuances until baseline single‑region stable path exists.”  

Signals awareness of **progressive disclosure**.

---

## Functional vs non‑functional anchoring

Explicitly label dimensions:

| Dimension | Example probe phrase |
| --- | --- |
| Latency | interactive vs batch tolerant expectations |
| Durability | acceptable loss window during outage |
| Consistency | strong vs eventual acceptable |
| Availability | CAP tension acknowledgment |

Sentence glue:

- “If eventual consistency is acceptable here, we can offload `<hot path>` via asynchronous fan‑out.”  

Demonstrates trade‑off literacy.

---

## Drawing while speaking

Parallel verbal tracker:

- “Box A streams events into durable log—consumers rebuild projections asynchronously.”  
- “Read path bypasses writer contention via replicated cache—but staleness bounded by `<TTL / versioning>`.”  

Avoid silent sketching longer than ~twenty seconds—micro‑summaries keep interviewer synced.

---

## Data modeling checkpoints

Use classification words:

- hot vs cold storage tiers  
- relational normalized vs denormalized aggregates  
- shard key implications  
- idempotent writes vs at‑least‑once delivery duplicates  

Example:

- “Order history append‑only suits event log; analytics aggregates land in column store refreshed hourly.”

---

## Scaling prompts you can reuse

| Scenario | Phrase |
| --- | --- |
| Read heavy | “Introduce caching layer + CDN offload static assets.” |
| Write spikes | “Buffer writes via queue absorbing bursts—workers smooth persistence.” |
| Fan‑out growth | “Consider selective fan‑out versus pull models depending freshness SLA.” |

Always tie back to **constraint**: cheap fan‑out worthless if subscribers demand instant uniqueness guarantees.

---

## Failure & resilience vocabulary

Sound proactive—not catastrophic:

- graceful degradation  
- bulkhead isolation  
- timeouts + jittered retries  
- idempotent handlers  
- chaos validation mindset  

Example sentence:

- “If downstream taxonomy service degrades we serve cached classification labels marking uncertainty flag—better stale metadata than total outage.”

---

## Closing structure summary

Three-layer recap:

1. core components & flows  
2. dominant bottlenecks / risks  
3. next investigations if timeline expanded  

Say:

- “Phase two I'd prototype load tests focusing on `<dimension>` before committing storage engine swap.”

Leaves collaborative forward hook.

---

## Trap phrases to avoid

| Weak | Stronger |
| --- | --- |
| “We can just scale horizontally.” | Preconditions: stateless tiers, shard strategy, data locality costs |
| “Microservices solve it.” | articulate bounded contexts + operational overhead |
| “We'll use blockchain.” | *(almost never spontaneous joke—stay serious unless prompted)* |

Interview credibility correlates with explicit **precondition listing**.

---

## Micro drills

1. Pick familiar product feature—two‑minute verbal architecture walk capturing openings above.  
2. Replay trimming hedging words (“maybe”, “probably”) → swap with conditional framing (“If assumption X holds, path Y; violating X shifts toward Z”).  
3. Sketch blank page boxes naming **only five components**—forces prioritization discipline mirroring interview clocks.

Repeat until pacing feels conversational—not recited.
