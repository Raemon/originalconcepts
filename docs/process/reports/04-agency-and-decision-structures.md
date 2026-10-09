<!-- Final report from the brainstorm subagent "Brainstorm: agency and decision structures", reproduced verbatim. It ran 20:56 to 21:23 UTC on 2026-10-08 and made 13 web searches. -->

I generated 12 candidates and ranked them by novelty × fun × 2D-browser playability. The percentages are my own estimates of how much of each idea is already known; none of the 12 is fully unprecedented. No files were written.

## Top 3

### 1. CLINAMEN: manufactured indifference (~50% known)
**Concept:** In a fully deterministic world, the only possible freedom is an exact tie, where an agent's reasons balance perfectly. Agency then becomes the craft of *manufacturing indifference*, rather than choosing.
**Rule sketch:** The player has no body. Each creature steps greedily toward its nearest lure (grid distance). Whenever any creature has two or more equally good moves, the world pauses and the player picks one. That is the player's only verb.
**New mental operation:** Treating symmetry as power and hunting for equalities: "to steer a mind, keep it perfectly torn."
**Non-obvious consequences:**
- On open ground with Manhattan distance, every step toward an off-axis target is a tie. So you choose *which* shortest path a creature takes, never *whether* it goes. Diagonal means freedom; axis-aligned means fate.
- Two lures placed exactly diagonally create whole 2D *regions* of indifference, because Manhattan-distance bisectors can be areas, not just lines.
- Every tie you break makes the world less symmetric. Freedom is used up, and a level can reach "heat death."
**Puzzles:**
- A plate lies outside a creature's shortest-path rectangle. First use a *different* creature's tie to knock the lure onto the diagonal.
- Only a three-way tie point (where three lures are equidistant) gives the three-way choice the exit needs, so you must build one.
- Puppetry: walk a creature along a knife-edge by moving two lures in lockstep, so it stays torn the whole way.
**Precedents:** Liberty of indifference and Buridan's ass; the Leibniz–Clarke debate on choosing among indiscernibles; Kane's "torn decisions"; Lucretius' swerve (the clinamen). In games: fixed tie-break rules (Pac-Man ghosts), rail-switch puzzles with fixed forks, tower-defense "mazing," Lemmings-style indirect control, and GMTK 2022 "you are the dice" jam games. As far as I can tell, two things are new: tie-breaking as the *only* verb, and *manufacturing* ties as the puzzle.
**Visual:** Basins of attraction. Each tile is tinted by the lure it drains toward, and the ridgelines and plateaus of indifference glow. The player exists only as light on these watersheds. Fractal "Wada basin" levels (boundaries touching three basins at once) are possible.

### 2. BITFALL: deliberation precipitate (~45% known)
**Concept:** A genuine, unpredictable choice among n options adds log₂n bits to the world. Those bits solidify as matter at the spot where the choice was made. Forced or predictable moves create nothing.
**New mental operation:** "Where am I deciding, and how much choice is in this moment?" *When* you decide becomes *where* the residue lands.
**Consequences:**
- Corridors stay clean and plazas fill up, so crossing an open room carves your own maze.
- Conservation: committing to a k-step route drops, right there, exactly the bits you would have spent along it. Deciding early or late just moves the same mass. Committing literally burns the bridge behind you. No adversary is involved, so this is not a precommitment device.
- Choice overload becomes a weapon. Random-walking guards lured into an open hall bury themselves. Deterministic guards leave nothing, so predictability means cleanliness.
**Puzzles:**
- You need a pillar at a cliff edge: stand there and commit to a route across the whole level.
- Cross a one-tile bridge without sealing your way back: make every decision before you step on.
- Wall in a guard by giving it a crossroads.
**Precedents:** Rovelli's "The thermodynamic cost of choosing" (2023) is the physics core. It argues a binary choice dissipates at least kT ln2, and only unpredictable processes count as choices. Also Landauer and Szilard, Hick's law, and Tron/Snake trails (movement makes walls). What's new is choice-information as matter that has a location and can be moved.
**Visual:** "Decision geology." Every choice leaves a faceted crystal (one facet per rejected option), with strata colored by who decided. The map becomes a fossil record of hesitation.

### 3. SPILLWILL: remainder inheritance (~40% known)
**Concept:** Intentions are continuous, but the world is discrete. The part of a wish that can't happen this turn doesn't vanish. A fixed rule splits that leftover between you and your neighbors, and it builds up on them until it tips them into motion.
**New mental operation:** Remainder arithmetic as social physics: "where does the part of my wanting that doesn't happen go?" You learn to wish *weakly on purpose*.
**Consequences:**
- Telekinesis by under-wanting: wish below the move threshold toward a box, and the box inherits your leftover until it tips.
- Weak desire pushes away its object. A guard wanting you at 0.4 never steps, but spills 0.4 per turn onto *you*, so chasers become propellers.
- The sign flips above the threshold: over-wanting at 0.9 spills −0.1 and tugs the target back toward the one who wants it.
- Rational-fraction intentions produce rhythms. Dithering artifacts are unintended actions you can exploit or must suppress.
**Puzzles:**
- Push a box behind a wall using your ½-wishes plus a guard's spill.
- Lock a creature in step with a patrol by choosing an intention of ⅖.
- Make two objects tip onto a plate on the same turn.
**Precedents:** Floyd–Steinberg and Atkinson error diffusion (image dithering), sigma-delta modulation, Bresenham's line algorithm, and fractional "energy" carry in roguelikes. I found nothing treating unrealized intention as something neighbors inherit. Risk: it is arithmetic-heavy, so fractions should stay coarse (quarters).
**Visual:** A 1-bit halftone world. Each object's dot density *is* its inherited, pent-up will, and when its dots saturate, it jumps.

## What the web search found
- **Clinamen:** I found no game where the player's only input is breaking ties for deterministic agents. Results only showed *fixed* tie-break rules:
  - Code vs Zombies: when equidistant, target the smallest id.
  - An itch.io sheep puzzle with a scripted tie order.
  - Fieldrunners' shortest-path runners.

  Philosophy precedent is strong:
  - The liberty of indifference: "an equilibrium so finely balanced that even an immaterial mind could push the body."
  - Kane's symmetric efforts of will.
  - Poręba (2017), "Freedom, symmetry breaking and reflective judgements."

  The nearest game is *Randomness Control* (GMTK 2022: "you ARE the dice").
- **Bitfall:** I found no matching game. Choice-stacking toys (CarbonStack, Make Your Choice) add one block per choice, not scaled by the number of options and not placed where the choice happened. Rovelli 2023 is the closest conceptual precedent.
- **Spillwill:** I found neither a game nor a named concept. Dithering shows up only as an art style. A 2026 paper's "side-effect spillover" is about harmful byproducts, not unspent intention.
- **Omega Moves** (runner-up, #4 below): I found no supertask video game.

## Other candidates (compressed)
4. **Omega Moves.** You can act "forever," then act again (ω+1), and the states at the limit are physics: objects that diverge leave to infinity, and oscillating ones become undefined.
   - *New thinking:* "What is true after forever?" Identity matters at the limit. In the Ross–Littlewood setup (add 2, remove 1 each step), the room ends empty or infinite depending on *which* item you remove.
   - *Puzzles:* Delete a blocker by pushing it forever. A room opens only if it is empty at ω.
   - *Precedent:* supertasks (~75% known).
   - *Visual:* Zeno spirals converging on glowing limit points.
5. **Hinge Law.** You can't affect a person in a way that *newly makes your goal reachable*; the game checks this in real time.
   - *New thinking:* Build an absurd backup route first, which then "licenses" the shortcut through someone. Shove people only while your goal is hopeless.
   - *Precedent:* Kant's "never merely as a means," the doctrine of double effect, Thomson's loop case, Pascal on casuistry (~65%).
   - *Visual:* Halos harden when a person is load-bearing for your plan.
6. **Entropy Clock.** Time passes only when you do something irreversible, and irreversibility depends on the whole level: unlocking a distant door makes local moves timeless.
   - *Precedent:* Superhot, Sokoban deadlocks; close to undo and empowerment (~60%).
7. **Cui Bono Physics.** Every event is charged to whoever benefits most from it.
   - *New thinking:* Route benefits so others pay, and stop processes by leaving them without a beneficiary.
   - *Precedent:* the benefit principle and Lindahl pricing (~60%).
8. **Palsgraf Physics.** An action has only the consequences you could have foreseen when you took it.
   - *New thinking:* Manage your own foresight: don't scout the minefield, but inspect every domino.
   - *Precedent:* tort-law foreseeability, Outer Wilds; close to observer effects (~65%).
9. **Pareto Lock.** Nothing changes if any agent, including you, prefers the old state.
   - *New thinking:* Efficient states are dead ends, and you adopt new desires in order to take detours.
   - *Precedent:* Wicksell's unanimity rule, the liberum veto (~60%).
10. **Ghost Necessity.** An action has force only if the agent could have done otherwise; forced moves pass through things.
    - *New thinking:* Add alternatives to make your actions count, and remove them to become harmless.
    - *Precedent:* the principle of alternative possibilities and Frankfurt cases; close to empowerment (~60%).
11. **Unison.** Identical simultaneous actions by different agents fuse into one action with a plural author.
    - *New thinking:* Hide your lever-pull inside a guard's permitted one.
    - *Precedent:* act-individuation debates, crowd-blending stealth (~60%).
12. **Stare Decisis.** The first decision anyone makes in a given local situation binds everyone who later faces it. You regain freedom only by *distinguishing* your case, i.e. adding one relevant feature.
    - *Precedent:* common law, Kant; close to policy selection (~65%).

Rejected as already known:
- Every true description of an act fires its own effect (Magic: The Gathering triggers, Anscombe).
- Having more options makes you heavier (empowerment).
- Others must do the options you didn't take (booster draft).
- Using a verb passes it to its target (tag, curse-passing).

## Recommended pair: CLINAMEN + BITFALL → "self-sculpting liberty"
Rovelli's criterion joins them:
1. In a deterministic world only unpredictable choices carry bits, and the only unpredictable choices are the player's tie-breaks.
2. So every act of freedom drops a crystal exactly where a creature was torn.
3. The crystal changes path distances, which moves the watersheds, which creates or destroys ties elsewhere.

The cycle is symmetry → choice → bits → structure → new symmetry.

The emergent idea: **freedom is spent as matter, and that matter is the only thing that can create future freedom.** The new thought is second-order. The question is not "what should I choose?" but "what will this choice's sediment do to where I'm next free?" Players would design:
- **Freedom gliders:** a tie whose crystal creates the next tie one tile over.
- **Freedom springs:** setups where ties keep regenerating.
- **Avoiding heat death:** once every symmetry is broken, you can only watch the deterministic rest play out.

The two visual styles fuse into a living topographic map built out of decisions. One caveat: it superficially echoes empowerment, but what you work with is engineered indeterminacy, not a count of reachable states.

*Alternative pair:* Clinamen + Omega gives "agency lives exactly where the laws underdetermine": finite ties plus infinite limits. A lamp switched forever (Thomson's lamp) has a logically undetermined state at ω, so that choice is yours. This pair is more mind-bending, but leans on known supertask philosophy.

Sources:
- [Rovelli 2023](https://arxiv.org/pdf/2309.08557)
- [Liberty of Indifference](https://www.informationphilosopher.com/freedom/indifference.13.en.html)
- [Poręba 2017](https://eidos.uw.edu.pl/freedom-symmetry-breaking-and-reflective-judgements-an-attempt-at-an-incompatibilist-account-of-freedom)
- [Campbell 2024 on Kane](https://pfk.qom.ac.ir/article_2832.html?lang=en)
- [Randomness Control](https://michaelepica.itch.io/randomness-control)
- [Code vs Zombies tie rule](https://forum.codingame.com/t/code-vs-zombies-questions/1083)
- [Make Your Choice](https://vika98z.itch.io/make-your-choice)
- [CarbonStack](https://shairagavi.itch.io/carbonstack)
- [Atkinson dithering](https://en.wikipedia.org/wiki/Atkinson_dithering)
- [Spillover paper](https://arxiv.org/pdf/2609.03394)
