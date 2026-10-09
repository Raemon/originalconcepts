<!-- Final report from the brainstorm subagent "Brainstorm: deep-structure transplants", reproduced verbatim. It ran 20:56 to 21:43 UTC on 2026-10-08 and made 7 web searches. -->

## Twelve deep-structure transplant concepts: top 3, the other nine, and a recommended pair

This was ideation only. I wrote no files. For the top 3 I searched for game precedents and found none (sources at the end).

## Top 3

### 1. Earned Selfhood
- **Source practice and the tacit principle:** Actuarial credibility theory (Whitney, Bühlmann). The rate charged is a blend: Z × the individual's own record + (1−Z) × the class record, where Z = n/(n+k) grows with how much evidence exists on the individual. Underwriters know something outsiders miss. An individual with a thin file *is* priced as its class. The class figure is just the pooled record of whichever members happened to be observed. So choosing who gets observed changes everyone's price.
- **The general concept:** An individual is its kind until it has a record of its own. Selfhood is an amount, built up by being observed. A kind's nature is whatever its observed members have shown so far.
- **New mental operation:** The player reasons about the world's *evidence* about a thing, not the thing itself. They decide which tests happen to which objects. Selection bias becomes a tool, and "the first use is free."
- **Precedents (honestly about 55% known):**
  - Stein shrinkage and hierarchical Bayes.
  - "Stereotypical reputation" in multi-agent trust research, and hierarchical-Bayes models of stereotypes in cognitive science.
  - Sheldrake's morphic resonance (nature forms habits); Pratchett uses it.
  - Peirce's idea that laws of nature are habits.
  - Loosely, PKD's *Ubik*.

  Searches found no game that uses this as physics. The new part is the split between individual and kind, weighted by credibility, which turns managing evidence into the gameplay.
- **Example puzzles:**
  - A rotten plank behaves as a generic, sturdy "plank" on its first crossing. Every crossing counts as a test, so the second one fails. The player must find a route that needs it only once.
  - Stack the deck: load-test only the strong ropes until "rope" has an excellent record. Then hang the anvil from the frayed rope nobody ever tested.
  - Tar a kind: arrange for the one lazy sentry to be seen asleep three times. Every untested sentry starts dozing.
  - Rebrand: paint the plank red. It now belongs to a kind with a different record, and its own file is clean.
- **Visual:** Untested objects are drawn as Isotype pictograms, literally the class icon. As their record grows they sharpen into etched, individual figures with visible flaws, each carrying a tally ledger. The world becomes more specific as you play.

### 2. Legible Lies (distinction conservation)
- **Source practice and the tacit principle:** Cartographic generalization: dropping, merging, simplifying, enlarging and shifting features as a map's scale shrinks. A map at a given scale is not the world shrunk down. It is redrawn so that every distinction that matters stays readable, and the price is false geometry. A road gets pushed off the river it runs beside, and 47 houses get drawn as 12 in the same pattern.
- **The general concept:** The world keeps everything distinguishable at the viewer's resolution. Counts, positions and widths are what give way, so how many things exist, and where they are, depends on scale.
- **New mental operation:** Treat a change of scale as a lossy operation that can't be undone exactly. Plan round trips through abstraction: zoom out, edit the simplified world, zoom back in, and let it regenerate its detail by rule.
- **Precedents (about 50%):**
  - Level-of-detail rendering, coarse-graining and renormalization.
  - Banyai's picture book *Zoom* and the film *Powers of Ten*.
  - *Superliminal*, *Focus Shift* and the GMTK-2024 game *Zoom*, where scale means size.
  - *Patrick's Parabox* (recursion) and *Carto* (rearranging map tiles).

  I found no game that uses these map-simplification rules as mechanics. The main risk is that it reads as "map generalization as physics." The idea depends on the zoom-out, edit, zoom-in round trip being the core move.
- **Example puzzles:**
  - At coarse scale a lake shrinks to a point. Drag the point and zoom in: the lake regrows in the new place.
  - A creek too narrow for the boat is drawn at a minimum readable width when zoomed out, so sail it at that scale.
  - Seven houses block the road. Zoomed out they are redrawn as three, leaving gaps. Lay the road through a gap, zoom in, and the seven houses regrow around it.
  - At coarse scale the railway is pushed away from the road to keep the two readable. That opens a corridor that persists when you zoom back in.
- **Visual:** A Swiss-style relief atlas, with Imhof hill shading, hachures and contour lines, that morphs live between scales: symbols merge, labels reflow, roads widen. I have not seen this "living atlas" look in a game.

### 3. Fictive Walls (interpretive enclosure)
- **Source practice and the tacit principle:** Jewish law on carrying during Shabbat. What is regulated is carrying an object from one domain into another, not movement. Domains are defined by enclosure, and the law fills in the visible walls with rules:
  - Gaps under 3 handbreadths count as closed (*lavud*).
  - Partitions extend virtually up and down (*gud*).
  - Roof edges count as descending to the ground (*pi tikra*).
  - A doorway frame counts as a wall (*tzurat ha-petach*).
  - A wall that is mostly solid counts as solid (*omed merubeh*).

  This is why an eruv can be an enclosure made of openings.
- **The general concept:** Whether a space is enclosed depends on how the visible walls are completed by rule, not on whether anything physically blocks you. The world regulates crossing those implied boundaries, not movement itself.
- **New mental operation:** See the closed shape that a set of fragments implies, and build partial structures that imply the shape you need. Keep "can I pass?" separate from "which domain am I in?"
- **Precedents (about 60%):** Gestalt and Kanizsa closure, magic circles, *Portal*'s emancipation grill (you can't carry objects through it), the enclosure puzzle enclose.horse, and the eruv itself. I found no game built on implied enclosure.
- **Example puzzles:**
  - You can walk through a 2-unit gap, but the lantern you carry cannot.
  - Raise three doorway frames so the plaza and the house become one domain. Now you can carry between them.
  - A short partition hanging from the ceiling extends virtually to the floor. It splits a domain without blocking anyone.
  - A thrown key counts as "resting" in any domain it passes low over, so lob it high.
- **Visual:** An architect's plan drawing, with implied wall extensions as faint dashed lines and domains shown as tinted washes.

## The other nine
4. **Opposition-Priced Effects** (from the second-price, or Vickrey, auction). The strongest cause sets the direction, but the *strongest losing* cause sets the size of the effect. A cause with no opposition does nothing. The player learns to recruit a strong rival that loses, or to plant fake "shill" forces. It is a new idea about causation, but it is "Vickrey as physics," and the puzzles risk becoming arithmetic. This is the strongest runner-up.
5. **Day-in-Court Facts** (from res judicata, privity and due process). A settled fact binds exactly those who were notified and could have contested it. Witnesses are not bound, and anyone who later takes over a bound thing inherits its bindings. The player manages who is present when facts are settled and uses absence as a tool. About 65% like relational quantum mechanics and existing observer-dependent mechanics.
6. **Would-Have Physics** (from cricket's leg-before-wicket rule and the DRS review system). When something that isn't a legitimate blocker stops a cause, the world projects where the cause would have gone. It uses its own simple model, with an "umpire's call" margin for close cases, and applies that effect anyway. The player exploits the world's counterfactual model. Close to the preemption cases in philosophy of causation.
7. **Common-Fate Individuation** (from counterpoint's ban on parallel fifths). Two voices moving together in a perfect interval fuse into one, so keeping things separate requires keeping their motions independent. About 65% Gestalt "common fate" plus 2048-style merging.
8. **Precedent Physics** (from the common-law idea of the *ratio decidendi*, the binding core of a ruling). Later cases decide which features of an earlier event mattered. The player is the court and is bound by their own rulings. About 70% known: Borges' "Kafka and His Precursors," Smolin's principle of precedence, Egan's "Luminous."
9. **Inevitability License** (from *pesik reisha* in Jewish law and the doctrine of double effect). You may cause a forbidden effect only if your act didn't make it inevitable. So you route it through chance or through another agent's free act, which in law breaks the causal chain (*novus actus*). The player engineers deniability. Overlaps the staged "accidents" in Hitman.
10. **Perpetuity Horizon** (from the Rule Against Perpetuities). A trigger is void the moment it is created if, in *any* possible world, it could fire after the last currently living entity dies plus 21 ticks. The player has to check the worst possible future (the law's "fertile octogenarian"). Novel but niche; a relative of bounded-liveness model checking.
11. **Located Doubt** (from the Jewish-law distinction between *kavua* and *rov*). An item of uncertain identity counts as 50/50 while it is at its source. Once separated, it takes on the identity of the majority. Novel, but it feels arbitrary.
12. **Matter-as-Delay** (from siteswap juggling notation, where the number of balls equals the average throw height). The number of things that exist equals the average delay of your commitments, so creating something means lengthening a delay. About 70% Little's law.

## Recommended pair and the emergent third concept
**Earned Selfhood + Legible Lies → "history has a resolution" (anonymity through abstraction).** Suppose evidence attaches to whatever is distinguishable at the scale where a test is *witnessed*. Then:
- **You choose the reference class by choosing your zoom.** A failure watched zoomed out, where seven planks are drawn as three symbols, counts against the whole *kind*. Watched up close, it counts only against that one plank.
- **Abstraction wipes records.** If an object is merged into a symbol at some scale, it comes back regenerated as a stranger with no record, which means it behaves as its kind. To launder a rotten plank, zoom out, nudge it, and zoom back in.
- **Distinctness carries memory.** A proven hero keeps its record only if, at every scale you pass through, it is shifted aside rather than merged.

The emergent concept: the reference class that evidence applies to is set by the observer's resolution. You are only yourself at scales where you are distinguishable. Neither concept has this alone, because one has no scale and the other has no evidence. It also gives a single visual language: pictogram for an anonymous kind, etched detail for a proven individual, and zoom as the thing that moves objects between the two.

A weaker alternative pair is Earned Selfhood + Inevitability License, which gives "ignorance licenses action": nothing the world hasn't established can be inevitable. Wile E. Coyote not falling until he looks down is a known precedent for that.

**Sources:** [Stereotypical trust (CMU)](https://www.ri.cmu.edu/?p=17134); [Bayesian reputation, PLOS Comp Bio](https://pmc.ncbi.nlm.nih.gov/articles/PMC11045068); [Morphic resonance, L-Space wiki](https://wiki.lspace.org/Morphic_resonance); [Sester, typification (ICA 2004)](https://kartographie.geo.tu-dresden.de/downloads/ica-gen/workshop2004/Sester-v1-ICAWorkshop.pdf); [Cartographic generalization](https://ltb.itc.utwente.nl/659/concept/174062); [Focus Shift](https://krispp2000.itch.io/focus-shift); [GMTK 2024 Zoom](https://itch.io/jam/gmtk-2024/rate/2911668?after=0); [Eruv](https://en.wikipedia.org/wiki/Eruv); [enclose.horse](https://www.alternativeto.net/software/enclose-horse/about/); [Kanizsa closure](https://isle.hanover.edu/Ch05Object/Ch05Kanizsa.html)
