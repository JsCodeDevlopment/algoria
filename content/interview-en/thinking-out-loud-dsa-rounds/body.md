## Narration roadmap

Stable skeleton beats improvised rambling:

1. **Restate & clarify** (constraints + ambiguity probes).  
2. **Tiny brute sanity check** (even inefficient baseline earns credibility).  
3. **Optimize** (explain leveraged insight—often structure exploitation).  
4. **Implement** (incrementally verbalized milestones).  
5. **Dry‑walk examples / corner checks**.  
6. **Complexity & introspection** (trade-offs + alternate avenues).

Keep interviewer tethered—explicit checkpoints beat surprises mid‑compile.

---

## Phase A — Clarify without sounding blocked

Polished probes:

- “May we mutate input or allocate proportional auxiliary structures?”  
- “Should algorithm prioritize minimizing latency upfront throughput assuming…” *(substitute concrete nouns)*  
- “Duplicates stable ordering tie‑break rules unspecified—I'll assume standard equivalence unless you prefer…”  

Transition cue:

- “Assuming constraints remain `<insert>` I'll sketch brute baseline next.”

---

## Phase B — Brute sketch (fast credibility)

Templates:

- “Naively I'd enumerate **all `<pairs | subsequences | partitions>`** yielding **`O(n²)` or worse**—fine mental anchor.”  
- “Primary downside is `<redundant recomputation | scanning entire tail repeatedly>`.”  

Explicitness sells honesty:

- “This won't pass large limits but proves correctness intuition.”

---

## Phase C — Optimize pivot phrases

Signal structural reasoning:

- “If lookup dominates comparisons, hash map collapses inner linear scans.”  
- “Ordering constraint hints monotonic behavior → candidate **two-pointer / stack / deque** pattern.”  
- “Recursive overlap exposes memoizable dimensions `<state tuple>`.”  

Risk acknowledgment:

- “Space climbs because we snapshot `<dimension>`—acceptable given `<constraint>`.”

---

## Phase D — Implementation narration

Micro‑steps instead of narrating every keystroke:

1. “I'll scaffold `<helper>` capturing invariant `<phrase>`.”  
2. “Loop advances `<pointer>` while invariant preserved—violations trigger `<mutation>`.”  
3. “Early exit when `<goal>` satisfied reduces redundant churn.”  

When stuck briefly:

- “Pausing—checking boundary `<zero-length | negative | overflow>`.”  

Shows discipline—not panic.

---

## Phase E — Testing aloud

Preferred sequence:

1. **Happy minimal** example interviewer supplied (sync mentally).  
2. **Degenerate**: empty / singleton / all identical elements.  
3. **Stress shaping**: maximum limits touching overflow / equality collisions.

Say:

- “Sanity on degenerate ensures loop guards don't skip initialization paths.”

---

## Phase F — Complexity wrap‑up

Closing triple:

- Time dominance sentence  
- Space justification referencing auxiliary structures  
- Potential alternate approach **one sentence** (“Divide & conquer possible but recursion overhead heavier here.”)

---

## Anti‑patterns to prune

| Weak habit | Strong replacement |
| --- | --- |
| silent typing bursts | micro‑summaries every logical chunk |
| apology spiral (“sorry”) | neutral correction language (“adjusting earlier assumption”) |
| jargon spray without anchors | invariant sentence anchoring abstract term |
| skipping brute entirely | micro brute framing before leap |

---

## Micro drills

Set five‑minute timer:

1. Explain yesterday's solved problem aloud **without IDE**.  
2. Re‑explain emphasizing **only complexity justification** alternate angle.  
3. Repeat stripping fillers—target calm pacing **≈130 spoken words/min**.

Iteration beats passive reading—voice fatigue mirrors interview stamina.
