<!-- Final report from the brainstorm subagent "Brainstorm: new kinds of laws", reproduced verbatim. It ran 20:56 to 21:19 UTC on 2026-10-08 and made 15 web searches. -->

## Top 3 (ranked by novelty × fun × 2D-browser playability)

**Search summary:** I ran about 13 queries: each law in plain words, plus "game", "philosophy" and "concept". None turned up a game that uses any of the three. The closest precedents I found are listed under each one.

### 1. Brevity: reality has a word budget
- **Concept:** The world exists only as the decompression of its own shortest description. That description is written in a small visible language and must fit a fixed token budget. If an event pushes the description over budget, the world snaps to the nearest world (fewest changed cells) that fits and still contains your latest change. If no such world exists, your change is refused.
- **Mental operation:** The player sees the scene as the shortest program that prints it. They then predict how a compressor with limited capacity will reinterpret their edit: keep it, revert it, generalize it to every copy, or quietly delete some irregular thing elsewhere.
- **Puzzles:**
  - *Three planks:* a chasm 9 tiles wide. Lay the planks edge to edge from the near side, and "run to the far edge" is cheaper to describe than "row of 3", so the world finishes the bridge. Later, a deliberately crooked plank is the only way to stop a row of spikes from extending into your path.
  - *Edit one, edit all:* a wall of six identical window units. Removing one bar is an exception you can't afford, so the nearest world that fits removes every bar, and the room floods. Line the stray crates up first to free tokens, and the single exception sticks. Nothing links the copies except the budget.
  - *Mirror tax:* an asymmetric machine costs 14 tokens and the budget is 10. Build its mirror twin and the description becomes MIRROR(machine), about 8 tokens. Adding matter makes the world cheaper.
- **Precedents:**
  - Kolmogorov complexity and minimum description length: the measure itself is known.
  - Schmidhuber's algorithmic theories of everything: simplicity as a prior over which universes exist, not as a law of motion.
  - Wheeler (2019): laws are the algorithms in the best compression of the data. That is a claim about knowledge, not dynamics.
  - Müller, "Law without law".
  - The Bekenstein bound: it counts raw bits, not regularity, and sits next to the excluded holography idea.
  - Closest concrete case of one edit changing every copy: a PICO-8 *Bad Apple* video codec, where editing one dictionary tile changes every frame. It is a codec, not a world.
  - Townscaper and wave-function-collapse reinterpret edits by local adjacency, not description length. The caption is read-only, so this is not Baba Is You.
  - Verdict: about 40% known. The measure is old; a world that re-encodes itself lossily as its law of motion looks new.
- **Visual:** The live description is the HUD. Tiles are tinted by the clause that generates them, and exceptions shimmer. Near the budget, the art visibly coarsens and detail melts into tiling, a style of "semantic compression artifacts".

### 2. Fatefall: time is spent only on the undecided
- **Concept:** Any event that would happen in every future the player could still bring about happens immediately, along with its consequences. Only events the player could still change take time.
- **Mental operation:** Tracking possibilities across your own options. For each pending event you ask: "does any strategy of mine prevent this?" You steer time by gaining or giving up options. You get outcomes by subtraction, making them unavoidable instead of doing them.
- **Puzzles:**
  - *Slow key:* a key rides a 30-tile belt and the gate shuts in 8 ticks. Because you could knock the key off, its trip is still open and therefore slow. Drop into a one-way chute that cuts you off from the belt, and the delivery becomes inevitable: the key is already waiting at the chute's exit.
  - *Keep hope alive:* a crusher is descending on the exit corridor. The moment no strategy of yours can jam it, it slams down instantly. You cross while shoving a crate that could jam it, carrying the possibility of stopping it without ever using it.
  - *Win by renouncing:* you can't walk to the goal. Wall off every way you could fail and lock yourself into the cart. Once victory is inevitable, the level is already over.
- **Precedents:**
  - Bergson, "The Possible and the Real": under mechanism "all is given" and time is mere appearance. Fatefall is that thesis made local and mechanical.
  - Aristotle and Diodorus on whether future events are already settled.
  - Commitment devices: binding yourself is a known idea, but here it also speeds up time.
  - Superhot ties time to the player's motion; Fatefall ties it to whether the outcome is still open.
  - Chiang's fatalism stories assume a fixed, known future; this law depends on the future being open.
  - Solitaire auto-complete, where a guaranteed win plays out instantly, is the most honest precedent, but it is only a convenience feature.
  - Verdict: about 30% known.
- **Visual:** Two inks. Things whose outcome is still open are animated sketch lines; doomed things snap into woodcut. Everything beyond your reach is already finished, so the world is a completed engraving with a bubble of live time around you. Each moving object trails a fan of possible paths that narrows as your options shrink, then jumps to its end.
- **Feasibility:** The world is deterministic except for the player, so checking inevitability is a bounded search over the player's possible moves. That is cheap on small grids.

### 3. Ballot Physics: forces vote instead of adding
- **Concept:** Influences don't add together. Each source ranks an object's possible moves, and the object does whatever wins under a voting rule. Adding forces is just one way to combine influences; this world uses ranked voting instead.
- **Mental operation:** Predicting motion by counting ballots, and using voting paradoxes as tools.
- **Puzzles:**
  - *Spoiler* (Borda-count zone): right narrowly beats left. Add a weak upward fan that ranks up > left > right, and the ball goes left. You steer with decoy options that never win.
  - *Push harder, go backwards* (runoff zone): extra support for east knocks out the wrong rival first, and the crate goes west.
  - *Perpetual engine* (majority zone): three emitters with cyclic preferences leave no stable move. A crate circulates forever with zero net force, a free clock, until a fourth voter breaks the cycle.
  - Different regions run different voting rules, since Arrow's theorem guarantees none is perfect.
- **Precedents:**
  - Every paradox used here is textbook: independence of irrelevant alternatives, runoff non-monotonicity, McKelvey's chaos theorem.
  - Voter-model and majority-rule cellular automata use plurality over two states, with no ranked paradoxes.
  - Zwicker's "voting with rubber bands" models voters as forces, the exact reverse of this idea.
  - MacIver (2017) proposed Condorcet cycles as a board-game scoring mechanic.
  - Verdict: about 55% known. This is the easiest of the three to dismiss as "an existing concept applied to physics".
- **Visual:** Stacked-chevron ballots on each object. Motion resolves through a visible count of elimination rounds and head-to-head duels. Cycles look like vortices with no source.

## Other candidates
Each line gives the concept, the thinking it demands, and its closest precedents with a rough "already known" share.

4. **Supervenience Law:** The blurred, majority-vote version of the world must itself be a legal state under the same rules. Fine moves that would make the coarse view illegal are blocked. You think at two resolutions, for example thinning a coarse wall below 50% to dissolve it. Precedents: renormalization, downward causation, hybrid images; about 55%. Visual: pixel art that reads at two distances.
5. **Estrangement:** Things that share a causal ancestor can't interact. Contact makes things kin, and kin pass through each other. You make a wall passable by giving it and a crate a common cause. Precedents: the inverse of Frazer's law of contagion, and game-engine collision masks. It tends to reduce to simple group tracking; about 50%.
6. **Syndrome Physics:** The world is always a valid codeword, and edits are treated as noise and corrected to the nearest codeword. Single changes revert, and the smallest lasting change is a minimum-weight codeword, so "quanta" of change emerge from the code. Change more than half the distance and the world finishes your change. Precedents: the "fate course-corrects" trope, the parity card trick, Lights Out; about 60%.
7. **Common-Knowledge Physics:** Certain events fire only when they are common knowledge among watchers in the world. Private signals give only limited depth of knowledge. You reason about nested perspectives. Precedents: muddy children, the coordinated attack problem; about 55%. Risk: it may reduce to line-of-sight puzzles.
8. **Census Independence:** Attributes must stay statistically independent across the population. Paint one circle red and the world must repaint or reshape someone else. You think in contingency tables. Precedent: demographic parity in machine-learning fairness; about 45%. Risk: heavy bookkeeping.
9. **Thue Law:** No block of events may repeat back to back, at any scale. Pendulums become impossible, and walking straight needs Thue's non-repeating gaits. Precedent: the old chess repetition rule, which Euwe defeated with the Thue–Morse sequence in 1929; about 65%.
10. **Homometric Law:** The set of pairwise distances between objects never changes. Beyond rigid motion, the world can only jump between shapes that share that set but aren't congruent. Precedents: the crystallography phase problem, the turnpike problem, Golomb rulers; about 50%. Niche.
11. **Ramsey Cap:** Forbid one tiny pattern, such as three mutual friends or three mutual enemies, and population limits follow: at most 5 beings, since R(3,3)=6. Admitting a newcomer forces a global rewiring. About 55%. Niche.
12. **Eviction Law:** Reality stores only the K most recent deviations from its default state. Each new change undoes the oldest one, and you keep things real by refreshing them. Precedents: "max N placed objects" mechanics, rooms that reset; about 65%.

## Combination: Brevity × Fatefall gives *Fated Compression*
Under Fatefall, the present is fully specified by "the causes plus whatever cannot be avoided". So anything doomed is implied and costs no description. Two laws emerge that neither concept has alone:
- **Two kinds of free matter: the orderly and the fated.** You can't afford to place an irregular 20-tile bridge directly. You can afford a 3-token contraption that *must* build it, and Fatefall makes the bridge appear at once. The core thought becomes "build fates, not things". This is not just a Rube Goldberg machine, because the doom is cheaper than what it produces.
- **Freedom is the expense.** Charge the budget for the story so far, and the only entries are choices made among alternatives. Each costs roughly log₂ of the number of options, and forced moves are free. Open fields cost, corridors don't, and giving up options both speeds time and frees memory. Time and complexity become one resource: unresolved choice. This is Shannon's measure used as a tax, not as a drive the way empowerment is.
- Slogan: *only the beautiful and the doomed are free.*

**Runner-up pairing:** Ballot × Supervenience gives "redistricting reality". Large-scale objects are elected by their parts, so moving block boundaries flips the large-scale world: you can pack and crack a wall out of existence. It's fun, but the emergent concept (gerrymandering, or the modifiable areal unit problem) is itself known.

**Risks:**
- Brevity only works if the description language is easy to read.
- Fatefall needs the fan-of-futures display, or doom will feel arbitrary.
- Ballot Physics is the most derivative of the three.

Sources: [Wheeler 2019](https://periodicos.ufsc.br/index.php/principia/article/download/1808-1711.2019v23n3p461/pdf/252743) · [Schmidhuber](https://arxiv.org/pdf/quant-ph/0011122.pdf) · [Bad Apple tile codec](https://lexaloffle.com/bbs/?pid=40009) · [Bergson on possibility](https://e-space.mmu.ac.uk/603606/2/Archiv%20Bergson%20on%20Possibility%20and%20Novelty.pdf) · [Commitment devices](https://en.wikipedia.org/wiki/Commitment_device) · [Zwicker lecture](https://talks.ox.ac.uk/talks/id/26ad7b52-d3dd-4ce1-9095-4f6cb49bebc9) · [Union College voters-as-forces simulation](https://omega.math.union.edu/research/2010-05-voting/?p=16) · [MacIver 2017](https://drmaciver.com/2017/03/an-untapped-family-of-board-game-mechanics/)
