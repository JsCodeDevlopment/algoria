## Audience note (B1 devs interviewing in English)

If your English feels “slower than your brain”, interviews still work when you:

1. Speak in **short turns**—not perfect essays.  
2. Use **sentence starters you memorise**.  
3. Repair mistakes calmly (“Let me revise that—I meant …”).

This page keeps **sentence starters simple** plus **advanced variants** once you accelerate.

---

## Roadmap recap (sticky mental spine)

Stable skeleton beats rambling improvisation:

| Step | Goal (plain English) | Time budget (typical forty-five minute round) |
| --- | --- | --- |
| 1 Clarify | remove ambiguity · confirm edge cases · write examples | roughly two-four minutes |
| 2 Outline brute | naive baseline—even slow proves structure understanding | roughly two minutes |
| 3 Optimise | explain insight & trade-offs | roughly five-eight minutes |
| 4 Implement | narrate checkpoints—not every keystroke | remainder bulk |
| 5 Test verbally | empties · duplicates · max values | two-four minutes wrap |
| 6 Complexity closing | summarise + optional alternative | ninety seconds |

If clock panics skip poetry—**signals** matter more than accent.

---

## Phase A — Clarify sounding confident (even if English is rusty)

Simple openers:

- “Can I mutate the input?”  
- “Should I optimise for speed or minimum memory?”  
- “Could you confirm we return the index—not the value?”  

Polished extensions:

- “May we allocate auxiliary structures proportional to input size?”  
- “If duplicates repeat, what's the canonical tie‑break expectation?”  

Clarifying **buying-thinking-time** bridging:

 Simple: “Give me fifteen seconds—I want to organise my thoughts.”

 Polished: “I'll jot structure mentally before proposing algorithm class.”  

If interviewer rushes politely:

“Could you repeat the last constraint—audio lag briefly?”  

**(Headphones glitch happens—repair without apologising endlessly.)**

---

## Phase B — Brute-force credibility (tiny but mandatory)

Signals honesty + structure:

Simple:

> “Slow way: check everything—looks like quadratic time.”

Formal:

> “Naive enumeration considers each candidate pair—baseline **`O(n²)`** acknowledging impractical scalability.”  

Add safety:

> “It still clarifies correctness before micro-optimisations.”  

---

## Phase C — Optimisation pivot verbs

Structural triggers you can pronounce slowly:

Two-pointer / hashing / sorting prerequisite / greedy check / recursion + memoisation / mono stack / bitmask / DP state

Starter lines:

Simple:

> “I think a hash map fixes the inner search.”  

Polished:

> “Inner linear scan collapses via hash amortization—overall linear expected.”  

When uncertain—**expose uncertainty cleanly**:

“I’m leaning toward greedy but I’ll verify failure pattern first.” (**Better than pretending certainty**)  

---

## Phase D — Implementation narration (checkpoint style)

Prefer **milestones**:

1. “I'll define helper keeping invariant XYZ.”  
2. “Outer loop progresses index while invariant maintained.”  
3. “Breaking early when condition satisfied avoids redundant merges.”  

Stuck aloud (shows discipline—not panic):

- “Paused—checking off-by-one boundaries.”  
- “Validating invariant after hypothetical mutation…”  
- “Simulating mentally with sample array—two-pointer indexes currently …”  

Resist silent typing bursts > fifteen seconds (**interviewer guesses you stalled**).

---

## Phase E — Verbal testing (order matters)

Suggested sequence:

1. Given / happy sample  
2. Empty array / singleton  
3. All duplicates  
4. Max / min extremes  
5. Potential overflow if numeric magnitudes gigantic  

Sentence:

“Degenerate guards ensure initializer paths solid.” (**Optional polished layer**)  

Simple alt:

“This edge case catches my loop never running.”  

---

## Phase F — Complexity & reflection

Triple close:

Simple:

> “Time linear because single pass.”  
> “Extra map uses linear space.”  

Add optional alternative:

Divide & conquer possible but recursion overhead heavier here—or sorting prerequisite dominates.

Invite collaboration:

“What trade-off emphasis matters more depth-wise for your stack?” (**Signals partnership**)  

---

## Interviewer interruptions—scripts

Simple:

- “Okay—I’ll pivot.”  
- “Sure—I’ll optimise that branch.”  

Polished:

- “Good catch—I'll adjust assumption and propagate constraint.”  

If they hint wrong direction:

“I’ll incorporate that—we may discard earlier partial memo idea.”  

---

## Repairing English slips (repair > perfection)

Neutral corrections:

“Let me rephrase—“  

“I misspoke—I meant logarithmic heap operations, not linear.”  

“Tracking wrong variable—rename mentally to `slow`/`fast`…”  

Avoid spiral apologies:

 Replace “Sorry sorry…” with factual correction (**confidence preserved**).

English-not-first-language micro-line (honest calm):

“My English isn't perfect—I'll prioritise correctness and clarity.”  
*(Most hiring managers respect explicitness—then judge substance.)*

---

## Anti-pattern table—swap habits

| Weak habit | Replacement |
| --- | --- |
| long silence | verbal micro-update every ~15s logical chunk |
| filler spam (“like”, “you know”) | short pause beats noise |
| saying “easy” aloud | humble phrasing—“familiar pattern” |
| blaming language barrier constantly | acknowledge once · continue technical content |

---

## Pacing drills (timed)

Five-minute sprint:

| Minute | Drill |
| --- | --- |
| 1 | Constraints list aloud |
| 2 | Brute two sentences |
| 3 | Optimised pattern naming |
| 4 | Complexity reasoning |
| 5 | Replay removing fillers |

Record audio—replay at 1.25× to hear rushed syllables clipping.

Weekly iteration builds **speech stamina**, separate from purely coding stamina.
