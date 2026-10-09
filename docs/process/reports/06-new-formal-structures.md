<!-- Final report from the brainstorm subagent "Brainstorm: new formal structures", reproduced verbatim. It ran 20:56 to 21:37 UTC on 2026-10-08 and made 6 web searches. -->

**Formal-invention report.** This was ideation only. No files were written.

## Top 3

### 1. Blind-Spot Space: "a place is nothing but its distances to the landmarks"
**Structure.** A place has no identity beyond what movable landmarks can measure. Two cells that no landmark can tell apart are the same place. *Definition:* a grid with walls and pushable landmarks L1…Lk. Each cell p gets a signature σ(p) = (d(p,L1),…,d(p,Lk)), where d is the shortest-path distance through free cells. Besides normal steps, you may *slip* from p to any free cell q with σ(q)=σ(p).

**Consequences I worked out.**
- **More landmarks means a bigger world.** With 0 landmarks the whole level is one place. With 1, you can slip anywhere at your distance from it. Each added landmark splits places apart.
- **Parity theorem.** The grid is bipartite, so d(p,L) ≡ |p|+|L| (mod 2). Every slip therefore keeps you on the same checkerboard colour, and some targets can only be reached by real steps.
- **Taxicab anomaly.** Two landmarks only tell apart the cells in the strip between them.
  - With A=(0,0) and B=(2,1), every cell with x≥2, y≥1 has σ=(s, s−3) where s=x+y. Each whole anti-diagonal is a single place.
  - In the NW quadrant d_B = d_A+1, so diagonals collapse instead.
  - Two landmarks in the same row make the strip between them a mirror across that row.
  - Nudging one landmark reshapes the whole pattern of bands.
- **Walls create wormholes.** Walls bend the paths, so distance coincidences link far, unrelated cells. Pushing one landmark around a corner rewires every such link at once. If bodies block paths, your own body changes the signature you're trying to match.

**New mental operation:** reading several distance fields at once and spotting where they coincide. You give up information to gain freedom of movement.

**Closest known:** metric dimension and resolving sets (Slater 1975; Harary–Melter 1976), twin-class quotients, trilateration, and ambiguity in robot localization. That work tries to *eliminate* indistinguishable cells. I found no use of those collisions as a landscape you live in, with landmarks you move. Honestly ~60% known structure, but new as an inhabited space.

**Puzzles:**
1. One beacon in a chasm room: slip around your distance ring to cross.
2. Line up two beacons so their row becomes a mirror, then slip through a wall to your reflection.
3. The goal is on the wrong checkerboard colour: find somewhere a real step is possible.
4. Add a third beacon to strand a pursuer that slips along with you.

**Visual:** each cell is tinted by a hash of its signature, so same colour means same place. Landmark contours read like a topographic map, and hovering lights up your whole place.

### 2. Proxemic Rigidity: "bound to what is nearest, however far"
**Structure.** Things are attached by being nearest, not by touching. *Definition:* NN(o) is the object or wall nearest to o (Euclidean distance; ties include all). Pushing o moves its whole chain {o, NN(o), NN(NN(o)),…} as one rigid piece. The push fails if the chain includes a wall or would collide with something.

**Consequences I worked out.**
- **Nothing moves alone.** A nearest-neighbour cycle of length 3 or more is impossible, because distances would strictly decrease all the way round. So every chain ends in a pair that are each other's nearest, and that pair is the smallest thing that can move.
- **Anchoring is non-local.** A crate alone in a vast hall can't move if anything along its chain has a wall as its nearest.
- **Capture inverts control.** Put X near a pair (P,Q) so that NN(X)=P while NN(P) is still Q. Pushing X moves all three, but pushing P leaves X behind. The follower leads.
- **Side effects.** Every move quietly changes the attachments of things you never touched. Deliberately created ties make chains bigger.

**New mental operation:** seeing an invisible "nearest" forest that rewires after every move, and planning by matchmaking.

**Closest known:** nearest-neighbour graphs (out-degree 1, only 2-cycles, in-degree ≤6), boids and the Vicsek flocking model, and sticky blocks (which need contact). ~55% known. Using the nearest-neighbour graph as a rigidity law appears to be new.

**Puzzles:**
1. A lone crate that can't move until you bring it a partner.
2. Free a wall-anchored crate by placing a decoy nearer to it than the wall.
3. Steer a pair from behind by attaching a trailing block.

**Visual:** hairline arrows from each object to its nearest, re-snapping after every move. Anchored objects are tinted wall-grey.

### 3. Quorum Bodies: "a thing is where most of it is"
**Structure.** A body is located wherever the most of its parts are. If no place has more than every other, it exists nowhere. *Definition:* body B has n pushable shards, and the map is divided into rooms. B's seat is the room holding strictly the most shards; on a tie, B is absent. B's effect (a bridge, a door, a light, even your avatar) appears at its seat. Shards can themselves be bodies: they count where they are seated, and absent ones count nowhere.

**Consequences I worked out.**
- **Sudden relocation.** One shard move can teleport a body across the map, while five moves may do nothing.
- **Ties erase things.** Split a door's shards 2–2 and the door stops existing.
- **Nesting concentrates power.** A body made of 3 bodies, each made of 3 shards, is seated by just 4 of its 9 base shards. A single crate can be decisive for a top-level body while most crates don't matter. This is Banzhaf-style voting power showing up as geometry.
- **Variant family.** Locating the body at the mean of its shards gives balance puzzles. The median gives a body that moves at most one cell per shard step and ignores outliers. The mode (most shards) gives jumps. That is three different physics from one idea.

**New mental operation:** treating objects as coalitions, working out which shard is decisive, and reasoning about where a spread-out thing *is*.

**Closest known:** weighted voting and the Banzhaf index, centre of mass, and area-majority board games like El Grande (which score regions but never *locate objects*). ~60% known.

**Puzzles:**
1. A bridge with shards in three rooms is absent. Push one shard into a neighbouring room and the bridge appears there.
2. Erase a door by engineering a tie.
3. Your avatar is a nested body, so pushing one decisive crate relocates *you*.

**Visual:** cracked shards with threads running to a ghostly seat. A tie shows as a shimmering empty outline.

## Other candidates (compact)
4. **Corollary Blocks.** Any three corners of an axis-aligned rectangle make the fourth corner solid. Theorem: link rows and columns through the blocks; each connected group of rows and columns fills every cell where they cross. A cell is free exactly when its row and column are in different groups. One block can join {1,2}×{1,2} with {5}×{7,8} into 12 solid cells. Removing a block that joins two groups shatters the region; other blocks are redundant. ~70% known (bipartite graph components, rank-one matrix completion).
5. **Loneliness Shells.** Each object's solid body is a taxicab circle whose radius is the distance to its nearest neighbour. Every shell passes through that neighbour, and no object ever sits strictly inside a shell. Push the neighbour inward and the ring shrinks; pull it away and the ring grows until it snaps to a new partner. ~60% known (sphere-of-influence graphs).
6. **Displacement Kinship.** All objects shifted the same amount from their starting positions form one rigid, scattered body. Objects that haven't moved are bonded to the walls. Matching two groups' shifts fuses them forever. You navigate real space (where things block) and shift space (where things fuse) at the same time. ~50% known (quotient by translation; Baba Is You's multiple YOU objects).
7. **Leibniz Patches.** Cells whose surroundings within radius r are identical are the same place. Build a replica of a distant spot to "be there." Repeating decor collapses rooms into tori. Your arrival changes the pattern and breaks the match. ~65% known (de Bruijn graphs, tiling theory's collared tiles). It inverts Colossal Cave's "maze of twisty little passages, all alike," where you drop items to tell the rooms apart.
8. **Democratic Rest.** After each move, subtract the median displacement of all bodies. Push a majority and the walls move instead, and the median body never moves. ~55% known (Mach's principle, centre-of-mass frames).
9. **Sightline Lattice.** No object may cross the line through any two others, so the arrangement's combinatorial picture never changes. By Mnëv's theorem the set of reachable layouts can be disconnected: the same picture, yet unreachable. ~75% known (oriented matroids).
10. **Reflow Space.** The world behaves like word-wrapped text. Removing an object shifts everything after it in reading order, and cells are vertical neighbours when their reading-order distance is a multiple of the line width. ~60% known; programmers already think this way.

## Precedent search (top 3, plus Leibniz)
- **Blind-Spot:** I found no game that uses landmark-indistinguishability for travel. The maths is metric dimension; quotients by twin classes appear only as algorithm shortcuts. The nearest mechanics are offset teleports (Anchor-Point on Playdate) and wormhole grids.
- **Proxemic:** I found no linking by nearest neighbour. The closest are *Linking Feedback Loop* (crates move together when lined up, so not adjacent, but by alignment), *Interconnection* (move one, move all), *Solipsiblocks* (touching same-colour blocks) and *Boogie Woogie*.
- **Quorum:** nothing I found places an object by plurality or deletes it on a tie. The nearest is *Splinter*, where the largest fragment survives and the player picks on a tie.
- **Leibniz:** the only hits were philosophy.

## Best pair and the emergent third concept
**Blind-Spot Space + Quorum Bodies → "Ontological Resolution."** Count shards by *places* (cells with the same signature), not by cells. Then:
- **Remove a landmark and places merge.** A scattered body suddenly has all its shards in one place. Because a place is a set of cells, the body appears in *every* cell of it: one thing, many locations.
- **Add a landmark and places split.** A 2-of-3 majority breaks into 1-1-1 and the body vanishes, even though no shard moved.

So the number of distinguishable places trades off against how many things exist and how many times each one appears. The player tunes how finely the world tells places apart, and existence follows from that. Neither parent concept contains this. Redistricting is the nearest human idea, but here it decides whether, and how many times, a thing exists, not an election.

Example puzzles: "the bridge must exist in two rooms at once," so make the rooms indistinguishable; "delete the guard without touching it," so add a beacon that splits its majority. Slipping (thread 1) and seating (thread 2) use the same notion of "same place," so every landmark move is both a travel move and an existence move.

Sources: [arXiv 1804.10670](https://arxiv.org/pdf/1804.10670), [arXiv 1910.04103](https://arxiv.org/pdf/1910.04103), [Anchor-Point](https://devforum.play.date/t/anchor-point-a-small-game-i-whipped-up-this-week/14443), [Linking Feedback Loop](https://stingby12.itch.io/linking-feedback-loop), [Interconnection](https://rosden.itch.io/interconnection), [Solipsiblocks](https://scribblin-code.itch.io/solipsiblocks), [Boogie Woogie](https://jackkutilek.itch.io/boogie-woogie), [Splinter](https://boardgamematcher.com/game/splinter), [SEP: Identity of Indiscernibles](https://plato.stanford.edu/archives/fall2006/entries/identity-indiscernible/)
