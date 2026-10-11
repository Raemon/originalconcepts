# Task: invent two new concepts and build a game around them

This is the second attempt at this task. The first attempt (this repo: the game in `game/`, the record in `docs/process/`) produced a well-made puzzle game whose concepts were mostly strange premises rather than new concepts. These notes say what the task is, what counts, and what went wrong last time.

## The challenge (from the requester, verbatim)

> Make an original videogame with at least two novel concepts never thought about by humans before. Note, not merely "new mechanics." It should be two concepts never before used by humans, in a game or otherwise. The concept should inspire mechanics but the important thing is that humans need to think in a way that they've never thought before as far as you can tell. Each concept should be interesting enough to inspire one major thread of the game that is fun and interesting in isolation, and they should combine together in a way that feels like an emergent 3rd concept. Take as long as you need to figure out how to find novel concepts. Also make sure it has innovative, beautiful graphics of a type never seen before.
>
> Combining two existing concepts in a relatively obvious way doesn't count as a new concept.

The requester is a LessWrong admin and an experienced game designer. They know puzzle games, science fiction, decision theory and rationality concepts well, and they will search for precedents.

## What counts as a concept

A concept is a reusable unit of thought: a way of carving up situations that lets you see new cases as instances of it and draw inferences you couldn't before. Before you build anything around a candidate, test it against these four questions:

1. **Transfer.** Does it explain at least three real cases outside games, from different fields? Write them down. If every example is hypothetical, it's a premise, not a concept.
2. **New moves.** Does having it change what you'd do next in a real situation, not just what you know?
3. **Surplus.** Does working it through produce consequences you didn't put into the definition?
4. **Not already named.** Would an expert in the nearest field (philosophy of causation, economics, biology, law, mathematics, whatever is closest) say "we have no name or theory for this"? Search that field's literature and vocabulary, not just "X game".

Also not enough:
- **A mechanic** is a rule inside one system that changes nothing outside it.
- **A premise** ("imagine a world where Z") only counts if Z gives you a lens you keep using in the real world.
- **The converse or inversion of a known principle** counts only if the result passes all four tests on its own.
- **A combination** of two known concepts ("X, but with Y").

Dramatic success looks like this: months later, the requester uses the concept's name in an unrelated LessWrong argument because it's the clearest way to say something.

## Process

### 1. Ask one question first

Before searching, ask the requester: "Do you want a lens that transfers to the real world, or a strange premise that is fun to inhabit, or both?" Their answer overrides anything in this file.

### 2. Search for concepts, not mechanics

Don't mention games, fun or playability at this stage. The first attempt ranked ideas by "novelty × fun × playability in a 2D browser game", and that steered everything toward weird physics.

The richest sources last time were the ones grounded in the real world:
- real patterns that recur across fields but have no name;
- the tacit principles behind crafts and institutions;
- law, insurance, mapmaking and similar practices, which produced the strongest leftovers ("Earned Selfhood": an individual is treated as its kind until it has a record of its own; "Stale Here": labels like "New College" that outlive the frame they were coined in).

Spend most of the search there. Invented physics, minds and mathematical structures are allowed, but they must pass the transfer test like everything else.

If you use parallel helpers, remember they share your biases. When several of them converge on the same territory, treat that as a possible shared attractor of the model, not as independent evidence the territory is unexplored.

### 3. Vet harder, in this order

1. Transfer test: three real cases from different fields.
2. Expert-field search: is it already named? Search that field's terms, not game terms.
3. Write down the best case against its novelty, as the requester would put it.

"No game does this" is weak evidence and doesn't count as vetting.

### 4. Choose deliberately

- Wait until all candidates are in before choosing.
- Prototype the top three or four briefly before committing. Last time the first idea to be prototyped won partly through momentum.
- Rank by the strength of each concept on its own first. That two ideas combine into a third is a requirement, but a weak concept that combines well should not beat a strong one.
- The emergent third concept must also pass the four tests. Check this; don't assume it.

### 5. Then design the game

- Each concept gets its own thread of puzzles that are fun alone, then a thread where both interact.
- The puzzles should be unsolvable without thinking in the new concept. Use a solver to check that each level is solvable, and check that it is *not* solvable under ordinary rules.
- The graphics should express the concepts, so the picture itself shows the new way of seeing. Rendering technique alone isn't novelty.

### 6. Keep a readable log

Write short notes to `docs/process-v2/` as you go: the candidates, why each was kept or dropped, the searches and what they found, and the decision. Last time the most important reasoning happened privately and left no trace.

## Deliverables

- **The game:** one self-contained HTML file that works as a LessWrong post widget.
  - It runs in a sandboxed iframe (`sandbox="allow-scripts"`, no same-origin), so storage may throw.
  - It must be responsive from 340 to 700 px wide.
  - Height comes from `document.body.offsetHeight`.
  - No scroll trapping: on touch screens, swipes over the board should scroll the page until the reader taps the game.
  - See `game/` and `dist/what-must-be.html` from the first attempt for a working pattern, and `https://www.lesswrong.com/api/SKILL.md` for the widget API.
- **A short write-up** for each concept:
  - the concept in one sentence;
  - its three real-world cases;
  - the moves it licenses;
  - the nearest known ideas and why it isn't them;
  - your honest estimate of whether the requester will judge it novel.
- **The process log** in `docs/process-v2/`.

## Known pitfalls from the first attempt

- **Exclusion lists anchor.** A long "don't propose these" list pushes toward finding gaps in it rather than toward true, useful ideas, and banned ideas crept back in anyway: the first attempt's smear mechanic resembled quantum superposition, which was on its own list.
- **Self-estimates aren't vetting.** The agents' "% already known" figures were guesses.
- **Momentum decides by default.** Time pressure and early prototyping decided more than the merits did.
- **The game can hide a weak concept.** A polished game can make a weak concept look stronger. Judge the concept before the build.
