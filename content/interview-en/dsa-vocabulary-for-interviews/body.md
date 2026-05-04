## Learning goals (especially if you are B1 / intermediate)

By the end of this page you should:

1. **Name patterns in short English sentences** (“I’ll keep a sliding window…” / “I'll use memoization…”).
2. Understand **complexity phrases** recruiters expect—without memorizing proofs.
3. Have a **minimal “say it simply” phrase** plus a **polished variant** per idea.

Interview English rewards **accuracy + pacing**, not rare words. If grammar is tiring, prioritize **chunks** (multi-word phrases said as one rhythm).

---

## How to practise (10 minutes/day)

Pick **five** phrases from below and repeat them aloud **ten times**:

- Whisper → normal volume → louder (like you are explaining to a teammate on a call).

Then record **sixty seconds** explaining one LeetCode problem you already solved—but **English only**:

- Aim for seven to ten **chunks**, not fluent storytelling.

---

## “Say it simply” vs “Interview polish” (pattern cheatsheet)

Same idea—two depths. Practice both; use **simple English under stress**.

| Idea | Simple (B1-friendly) | Polished interviewer English |
| --- | --- | --- |
| I need to check membership fast | “I’ll store visited values in a set.” | “Membership tests must be amortized **`O(1)` expected**, so I’ll back the lookup with hash-based structure.” |
| I walk the structure once | “I’ll loop through the array one time.” | “I maintain a linear scan preserving an invariant enforced at each step.” |
| Wrong answer wastes time | “I might explore bad paths first—need pruning.” | “Search space explodes unless we prune branches violating constraints.” |
| I reuse earlier work | “I’ll save results so I don’t repeat work.” | “Overlapping subproblems justify memoizing state transitions.” |

---

## Arrays & strings

### Core verbs you will actually say

traverse / scan · iterate · index into · mutate in place · copy into auxiliary buffer · concatenate · split tokens · coerce types · reconcile lengths · saturate bounds

### Terms & when they appear

| You might say | Meaning / interview moment |
| --- | --- |
| contiguous subarray / substring | contiguous = no gaps in original order |
| prefix sum | precompute cumulative sums → range queries cheap |
| difference array | update ranges **`O(1)`**, finalize with prefix scan |
| sliding window (`left`, `right`) | invariant about current window contents |
| in-place reversal / rotation | **`O(1)`** extra beyond input (maybe a temp variable only) |
| two pointers converging | from both ends → middle |
| two pointers chasing | slow/fast runners (detect cycles mentally) |

### Narration snippets (copy rhythm more than wording)

- “I’ll traverse once and **keep counters / indices** stable while the window slides.”  
- “If substring uniqueness matters I’ll anchor uniqueness with **`O(alphabet)`** frequency vector or map.”  
- “Before optimizing I’ll articulate **constraints on mutation** — read-only forbids reshuffling.”  

---

## Hashing & frequency

| Concept | Simple | Polished gloss |
| --- | --- | --- |
| map / dictionary | “key → value table” | “associative container supporting expected constant lookup under general hashing assumptions” |
| multiset behaviour | “I count duplicates, not uniqueness only.” | “Values share keys but multiplicity carries signal.” |
| canonical key | “Messy tuples become stable identifiers.” | “Normalize inputs via canonical encoding to stabilize collision surfaces.” |

Phrases that sound senior without fancy grammar:

- “The expensive part dominated comparisons—hashing reshapes bottleneck.”  
- “We trade **`O(n)`** memory against **`O(n²)`** time.”  

Watch-out phrase (explains interviewer doubt):

- “If equality semantics are nuanced I’ll clarify hashability assumptions before proposing map.”

---

## Linked lists / pointers (even if typed “reference” mentally)

Say:

- sentinel / dummy head (**avoids branching on empty head**)  
- break links vs relink (**careful reorder under constraint**)  
- advance pointer **`k` steps safely** (**guard null**)  

Sentence:

> “I'll keep a **`prev`** / **`curr`** pairing so rewiring doesn't orphan the remainder.”  

---

## Stacks & queues / monotonic ideas

| Phrase cluster | Signals |
| --- | --- |
| monotonic stack | values strictly increasing/decreasing invariant before push tolerance |
| next greater element archetype | delayed resolution until hotter neighbor appears |
| deque for window minima | amortized linear because each element enqueued/dequeued once |
| breadth-first layering | frontier expansion—depth counted in waves |

Explain monotonic casually:

> “Whenever ordering breaks I'll pop until property restored—classic **`O(n)`** amortization story.”  

---

## Heaps / priority queues

| Word | Typical usage |
| --- | --- |
| min-heap / max-heap | pick extremum **`O(log n)`** |
| lazy deletion | postpone cleanup / rely on versioning |
| relaxed ordering | tolerate stale entries if tie-break handled |

Starter:

> “I only care about extremes each step—natural heap cue.”  

---

## Trees & graphs

### Tree shorthand

 subtree · LCAs (lowest common ancestor) · height vs depth · balanced vs skewed  

### DFS vs BFS (must be automatic speech)

Simple:

> “DFS goes deep—stack flavour. BFS goes wide—queue flavour.”

Polished:

> “DFS suits exhaustive structural exploration earlier; BFS yields shortest hops in **unweighted** graphs.”  

### Graph qualifiers

Directed vs undirected · weighted edges · cyclic vs acyclic (**DAG precondition for topo**)  

Strongly connected vs weak · adjacency **list/matrix trade-off** (**memory vs **`O(1)`** lookup**)  

Topo sort trigger sentence:

> “If dependencies exist we need ordering respecting edges—implies DAG else contradiction.”  

---

## Union-Find / DSU wording

 Disjoint sets · unify operation · amortized **`α(n)`** inverse Ackermann—only mention if interviewer invites depth (“path compression + union by rank”).

Otherwise simple:

> “I'll merge components whenever edge connects disjoint groups.”  

---

## Trie / prefix structures

 Trie / prefix tree · branching on character · early termination when unmatched prefix exhausted.

Simple:

> “Shared prefixes collapse branching—helps autocomplete style checks.”  

---

## Binary search (array + “search on answer”)

Key phrases:

- monotonic predicate · feasibility check mid · shrink search space halves  

Separate array BS from BS on answer:

> “Classic binary search on sorted array contrasts with **`parametric search`** on minimal feasible capacity.”  

---

## Greedy & proof language (lightweight)

Greedy disclaimers recruiters love:

 “Local optimum won’t doom global iff **exchange argument**…” (only advanced).  

B1 version:

 > “Greedy risky unless we verify—I'll try counterexample mentally before trusting.”  

---

## Dynamic programming wording

 overlapping subproblems · optimal substructure · state (**tuple of constrained dimensions**)  

 transition / recurrence  

 top-down (**memo DFS**)  

 bottom-up (**tabulation**)  

Rolling array nuance:

> “Dimension collapses because recurrence only cares previous row reducing space from **`O(n·m)` → `O(min)`.”  

---

## Complexity talk (minimal safe templates)

Blend **facts + WHY**:

1. “Each pointer advances at most **`n`** times → **`O(n)`** aggregated.”  
2. “Heap operations multiply by **`log n`** pushes—not hidden if loop factor explicit.”  
3. “Worst hash degenerates—not default assumption unless interviewer probes.”  

Cautious hedging (shows maturity):

 “Under reasonably random hashing…” · “Ignoring log factors from coordinate compression…”  

---

## Sounding robotic? Fix with structure

Interviewers tolerate accent; they penalize **vagueness**.

Winning micro-pattern:

 **`Invariant`** + **`data structure`** + **`traversal`** + **`complexity`**.

Example fifteen seconds:

> “Invariant says window unique—map counts keys—right pointer expands until violation—cleanup from left—“  

---

## Drill homework (tiered)

**Tier A (five minutes)**

List five problems you solved; speak only **purpose of each DS** aloud.

**Tier B (twelve minutes)**

Explain one medium problem aloud:

- minute one constraints  
- minute two brute idea  
- minute three optimised idea + complexity  

**Tier C**

Strip filler words (**“actually”**, **“literally”**, **“like”**) from recording—silence substitutes filler.

Weekly repetition beats isolated glossaries—the phrases become **motor memory**.
