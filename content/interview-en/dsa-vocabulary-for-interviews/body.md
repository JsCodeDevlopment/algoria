## Why this page exists

Interview English is not “fancy words”. It is **precise, short terminology** you can produce **under stress** while your brain is busy reasoning.

Below: bundles you can **shadow-drill** (read aloud) until they sound boring—which means automatic.

---

## Arrays & strings

| You might say | Meaning / when |
| --- | --- |
| contiguous subarray / substring | elements adjacent in memory/order |
| prefix sum | cumulative sums to answer range queries fast |
| sliding window | maintain metadata about a moving `[left..right]` range |
| in-place | mutate the input array instead of allocating a big extra structure |
| two pointers / opposing pointers | walk from both ends toward the middle |
| read-only input | you cannot sort or reorganize if constraint says so |
| amortized cost | occasional expensive steps averaged over many cheap steps |

**Tiny narration snippets**

- “I’ll scan once left‑to‑right and **maintain an invariant** that…”  
- “If duplicates matter, I’ll treat indices as **first-class state**, not just values.”

---

## Hashing & counts

| You might say | Meaning / when |
| --- | --- |
| frequency map | counts occurrences keyed by element |
| complement lookup | store seen values to test `-target-x` style identities |
| collision handling | tie‑break keys carefully when grouping equivalent objects |
| trade memory for time | `O(n)` extra space to reduce time complexity |

Phrases:

- “Hash map lets me **test membership** and pull **`O(1)` expected**, so outer loops dominate.”  
- “Canonical representation means mapping messy inputs into stable keys.”

---

## Stacks & queues

| You might say | Meaning / when |
| --- | --- |
| monotonic stack | pop while violating ordering rule |
| deferred processing | delay resolving elements until the triggering condition occurs |
| queue-level parallelism | ordering of independent producers/consumers (design chats later) |

---

## Trees & graphs

| Tree | Graph generalizations |
| --- | --- |
| subtree rooted at `node` | connected component touching cycles differently |
| parent pointer climb | implicit edge reversal tricks |
| height vs depth | height measured downward from perspective |

Verbal anchors:

- “DFS explores aggressively deep before widening.”  
- “BFS expands layer‑by‑layer—perfect when shortest‑hop counts matter.”

Directed graphs introduce additional wording:

- topological ordering feasible **only if** DAG  
- strongly connected components vs weak connectivity  

---

## Recursion & DP vocabulary

| Term | Interview‑friendly gloss |
| --- | --- |
| overlapping subproblems | same recursion subtree repeats waste |
| optimal substructure | best overall builds from best smaller prefixes |
| state definition | tuple capturing decisions (`idx`, `sumLeft`, mask…) |
| transition | recurrence linking neighboring states |
| memoization | top‑down cache guard |
| tabulation | bottom‑up filling |

Say plainly:

- “My recurrence respects constraints **because leaving dimension X implicit blew boundaries.**”

---

## Complexity language that lands well

Pair facts + rationale instead of dumping formulas.

Templates:

1. **Time**: “Each element enters/leaves the window at most once → **`O(n)` single pass**.”  
2. **Space**: “Apart from output requirements, auxiliary structures hold **`O(k)` keys**, bounded by alphabet uniqueness.”  
3. **Worst vs amortized**: “Worst case degenerates when hash collisions spike—but interviewer-grade reasoning sticks with **`O(n)` expected** unless prompted deeper.”

Use cautious qualifiers:

- “Under reasonable hashing assumptions…”  
- “If sorting dominates comparisons…”  

---

## Polishing pitfalls

Avoid robotic jargon stacking (“optimize synergy leveraged stakeholder hashing”—never).

Prefer crisp combos:

- **Invariant + data structure + traversal shape**.

Practice aloud replacing fillers (**“basically”, “kind of”, “you know”**) with **micro‑pauses**—signals deliberation.

---

## Drill homework

1. Pick three catalogue problems you solved silently—redo explanations aloud clocked ≤ ninety seconds each hitting invariant + complexity.  
2. Record thirty seconds describing brute upgrade paths (“nested loops feasible baseline”) **without naming syntax quirks**.

Repeat weekly—the vocabulary compounds faster than memorizing isolated glossaries.
