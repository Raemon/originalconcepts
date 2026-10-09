<!-- Final report from the brainstorm subagent "Brainstorm: alien cognition concepts", reproduced verbatim. It ran 20:56 to 21:24 UTC on 2026-10-08 and made 11 web searches. -->

# Alien-cognition candidates: report

Ranked by novelty × fun × 2D-browser playability. "% known" is my honest estimate of how much of each idea already exists. All three winners came from the same place: they let you perceive, or be, something counterfactual (what something is necessary for, what you could do, what a model fails to explain). Humans have no built-in sense for counterfactuals, and I think that gap is where the real novelty is.

## TOP 3

### 1. Sine Qua Non: "only the indispensable exists"
**Concept:** A thing exists only while something would be different without it. To exist is to be a but-for cause, and redundancy destroys things.
**Mental operation:** Keeping track of what each thing is necessary for, and using redundancy as a solvent. To delete something, duplicate its job. To keep something, make it irreplaceable. This flips the most basic engineering intuition (redundancy = robustness): the world contains only single points of failure.
**Precedents (searched):** I found no game that does this. Closest games: *WhatsUnnecessary* (spot the superfluous piece, so redundancy is the puzzle, not the physics). *Object Impermanence* and *Closure* make existence depend on sight or light, which is a different rule and in excluded territory. Philosophy:
- The Eleatic principle / Alexander's dictum ("to be is to have causal powers"). Under it, redundant causes are still real.
- The overdetermination problem in counterfactual theories of causation, and tort law's cases with two sufficient causes (including Shapley-value apportionment).
- Kim's causal exclusion, Occam's razor (a method, not a physics), synaptic pruning.

About 40% known. The principle is argued over, but nobody has explored what it does as a world's dynamics.
**Puzzles:**
- (a) The wall blocking you also shades a sensor. Push a crate into the beam upstream: the wall becomes redundant, fades to a blueprint and you walk through. "To remove a wall, build a second one."
- (b) Spare parts stay invisible until needed. Pull out the main mirror and a backup you never saw appears; use its sudden appearance to seal a gap.
- (c) In a harder self-referential mode (a thing exists only if it matters *to what exists*), two mirrors that only work together can't start existing on their own. Use a crate as scaffolding to make each one necessary by itself, then remove the crate. The pair is now an "existential arch" that holds itself up.
- (d) Two blockers doing the same job flicker: each is unnecessary while the other exists and necessary while it doesn't. That makes a clock you can time a crossing by.

To be deterministic it needs a tie-break law (e.g. the upstream cause wins), which the player can learn. A softer variant: objects glow with their share of credit (Shapley values), so redundancy splits a thing's existence instead of killing it.
**Visual:** An engineer's load-path drawing come alive. Line weight shows how many outcomes depend on each object, and redundant things are faint cyan ghosts. Each frame shows why everything in it exists.

### 2. Orbit Sight: "you perceive only what you cannot change"
**Concept:** A mind that sees only the parts of the world its own power can't touch. Anything its actions could change looks like a smear of every state it could put that thing into. Only what is out of reach is sharp.
**Mental operation:** Seeing the world with your own abilities factored out, trading power for sight, and finding your levers by their effects on things you can't touch. "Omnipotence is blindness; a cage is a lens."
**Precedents (searched):** In the abstract this is uncomfortably close to existing ideas:
- Poincaré built the idea of space out of sensory changes you can undo with your own movement (formalized by Terekhov & O'Regan and by Laflaquière).
- Klein's Erlangen program, Heidegger's ready-to-hand (tools disappear while you use them), and efference copy (the brain cancelling sensations it expects from its own movements).
- In games, *Invisibox* has you push boxes you can't see, but without any principle behind the blindness.

About 60% known; the gameplay consequences look unexplored.
**Puzzles:**
- (a) Every pipe can be rotated, so pipes appear as symmetric rosettes, but the water is crisp. You steer by consequences.
- (b) Sokoban where each box is a streak over the cells it could reach. A box stuck for good snaps sharp, so mistakes are the only crisp things on screen.
- (c) Throw your own rotate power into a pit so you can finally read a code written in the pipe orientations. Giving up a power works as a lens.
- (d) Gaining a new verb erases the landmarks you were navigating by.

**Visual:** Each object is drawn as the average of the states you could put it in: rotatable things as rosettes, sliders as motion streaks, toggles as half-tones. The world melts as you gain power and crystallizes when you're trapped.
**Risks:** It may read as "quantum blur", and it sits next to the excluded empowerment idea. The difference is that it depends on the viewer's abilities and on what the viewer knows, and it inverts empowerment: what you can reach is exactly what you can't see.

### 3. The Residual: "you are what the world fails to explain"
**Concept:** The self isn't a body. It is whatever doesn't fit the world's best-fitting pattern, the part the world's own compression can't absorb.
**Mental operation:** Steering a whole-world pattern fit by making local edits. Conforming moves you instantly elsewhere, and changing the dominant pattern makes you grow. To move, make the place you're in fit the pattern and make somewhere else not fit it.
**Precedents (searched):** Many games make you *find* the anomaly (*Odd One*, *Exit 8*-style games). I found none where you *are* the anomaly. In philosophy: Žižek/Hegel's subject as "the crack in being", the Lacanian remainder, and glitch-protagonist stories. It is close to the excluded "seeing only surprise" (here you *are* the surprise) and inverts the excluded "you are a pattern". About 50% known.
**Puzzles:**
- (a) A checkerboard with two defects, and you are one of them. Flip yourself to fit the pattern: you vanish here and become the other defect.
- (b) Paint stripes until stripes beat the checkerboard as the best fit. The whole old region is suddenly anomalous, and you are suddenly enormous.
- (c) Make a distant exit cell not fit by shifting the phase of the global pattern.

**Visual:** A huge calm tiling where you are the only noise: a shimmering mismatch that jumps across the map whenever the world re-fits itself.

## Other candidates (compressed)

4. **Nearest-World Will.** You act only by stating facts, and reality jumps to the closest world where they're true, under a similarity measure you can learn (mass = cost of change). New operation: thinking from reality's side about the cheapest way to comply. "Key in my hand" moves *you* to the key; "row 3 empty" shoves the key into a pit. Precedents: Lewis's closest-world semantics, minimal belief revision (AGM), the monkey's paw, CAD constraint solvers. About 60% known, and close to "assertion creates reality". The most fun, but less novel.

5. **Argmax Self.** You are whatever object currently has the most of some quantity (leftmost, heaviest), or the average position of what you own. New operation: steering a statistic, with identity as a post someone holds. "Leftmost is you" turns into relay-herding; the averaging version means "the more you own, the less you can move." Precedents: the Dread Pirate Roberts, the priest-king of Nemi, Baba's X IS YOU, possession. About 65% known.

6. **Zeno Engineer.** You act in infinitely long schedules, see the state at the limit, then act again. New operation: bookkeeping over infinite processes, where the end state depends on *which* items move rather than how many (the Ross–Littlewood vase). Benardete's paradox gives a puzzle: stop an enemy with barriers that never actually rise. Precedent: the philosophy of supertasks. About 60% known, niche.

7. **Prototype Physics.** Everything behaves as the average of its kind, and kinds are clusters of similar things. New operation: gerrymandering categories. A chain of gradually heavier objects links a feather to anvils so it sinks; cut one link and properties jump. Precedents: k-means, stereotyping, Gestalt grouping (excluded neighbour). About 55% known.

8. **The Axis.** You are the world's best-fitting mirror axis, and your one verb is reflecting an object across yourself. You travel by making the world more symmetric somewhere else, passing through layouts that are symmetric about both places. New operation: finding where you are by finding the world's symmetry. About 50% known; mathy.

9. **The Interpreted.** You can't touch anything. The world is a literal-minded helper that guesses your goal from your path and acts on it. New operation: treating your own movement as evidence. Curve away from the key so the world opens the door instead; feint. Precedents: cooperative inverse RL / assistance games, Dragan's legible motion, *The Last Guardian*. About 65% known.

10. **Codeword World.** Reality error-corrects to the nearest lawful state. A single edit snaps back; only several coordinated edits, each too small to stick alone, tip it into a new stable state, sometimes changing cells you never touched. New operation: thinking in basins of attraction. Precedents: error-correcting codes, attractors, *Lights Out*. About 60% known.

11. **p-adic Wanderer.** Two things are near if they agree in fine details; big differences don't matter. New operation: reaching things by matching their smallest features first. Precedents: p-adic numbers, phylogenetic trees. About 65% known, and hard to make fun.

12. **Holonomic Self.** You are a flaw in a crystal lattice. Nothing looks wrong locally; you can only be located by counting around loops, and you can't be destroyed except by meeting your opposite flaw. Precedents: Kelvin's vortex atoms, Penrose's cohomology of impossible figures (excluded neighbour). About 60% known.

## Recommended pair: 1 + 2 → "Load-Bearing Blindness"

Put the player under both rules. Sine Qua Non decides *whether you exist*: you are solid only while something depends on you, and otherwise you're a ghost that drifts through walls. Orbit Sight decides *what you see*: whatever you can act on blurs. Neither rule alone predicts what happens next: **seeing clearly and being able to act become mutually exclusive, and what switches you between them is whether anything depends on you.**
- As a ghost you see everything sharply but can touch nothing.
- To act you must make something depend on you (step into a beam), and at that moment your levers blur.
- To see again you must make yourself redundant by building your own substitute. That is thread 1's "delete by duplicating" applied to yourself.

Players pick up a heuristic no one has needed before: within reach, **sharpness means irrelevance**. Everything real is necessary, and everything necessary that you can touch is blurred. So you navigate by the gap between crisp ghosts and crisp walls. Late levels: scout as a ghost and memorize, step into a beam, act blind, then build your replacement to get your sight back. The theme: having skin in the game literally blinds you, and only a dispensable observer can see.

Runner-up pair: 1 + 5 → **Keystone Self**. You are whatever the world can least afford to lose, and you travel by making yourself replaceable so your selfhood passes to the next bottleneck.

**Build notes:** all three are cheap enough for a browser.
- Sine Qua Non: re-trace the outcome with each object removed, which is linear in the number of objects.
- Orbit Sight: a search over reachable states for small levels, or a per-object version.
- The Residual: compare the grid against a small family of patterns.

**Sources:** [WhatsUnnecessary](https://toucharcade.com/games/whatsunnecessary) · [Object Impermanence](https://eastswedengame.se/project/object-impermanence-by-slugware/) · [Eleatic principle](https://resolve.cambridge.org/core/journals/canadian-journal-of-philosophy/article/abs/can-the-eleatic-principle-be-justified/9FCE1E9427733A4FD869BF10AC8CD8B8) · [Elder on Alexander's dictum](https://digitalcommons.lib.uconn.edu/philo_articles/1) · [Preemption/overdetermination](https://arxiv.org/abs/1710.03390v1) · [Tort but-for test](https://harvardlawreview.org/2017/06/rethinking-actual-causation-in-tort-law/) · [Terekhov & O'Regan: space from compensable changes](https://www.frontiersin.org/journals/robotics-and-ai/articles/10.3389/frobt.2016.00004/text) · [Heidegger ready-to-hand](https://that-which.com/heidegger-ready-to-hand-and-present-at-hand/) · [Invisibox](https://retrific.itch.io/invisibox) · [Odd One](https://mwm.ai/apps/odd-one/6788079535) · [Carew on Žižek's subject as gap](https://quod.lib.umich.edu/o/ohp/12763629.0001.001/1:6/--ontological-catastrophe-zizek-and-the-paradoxical?rgn=div1)
