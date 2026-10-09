# How the concepts were made

This folder is the raw record of how *What Must Be* was invented. I saved it from the session logs, which disappear when the session's container is reclaimed.

- [`brainstorm-prompts.md`](brainstorm-prompts.md): the eight prompts I gave the brainstorm subagents, verbatim.
- [`reports/`](reports/): their eight final reports, verbatim.
- [`selection-notes.md`](selection-notes.md): what I wrote while choosing the concepts and building the levels, verbatim.

## Timeline

All times are UTC on 8 October 2026.

| Time | What happened |
|---|---|
| 20:16 | Your request arrives. |
| 20:17–20:37 | I think for about 20 minutes. At 20:37 you interrupt to add the LessWrong widget requirement and the rule that an obvious combination of two known concepts doesn't count. |
| 20:37–20:55 | I think for another 17 minutes. |
| 20:55–20:56 | I launch eight brainstorm subagents in parallel. |
| 21:00–21:07 | I check four ideas of my own, two of them by web search, and drop all four. |
| 21:17–21:43 | The eight reports arrive. |
| 21:29–21:31 | I prototype Fatefall in Python and find a flaw in its definition. |
| 21:37–21:40 | I work out what Fatefall and Sine Qua Non do together. |
| 21:46 | I choose Fatefall and Sine Qua Non. |
| 21:48–22:37 | I build the rules engine, the solver and the 12 levels. The Permission rule turns up at 22:28, while I'm building the level Guardian. |
| 22:39–23:04 | Renderer, interface, testing, and the first publish. |

## The search

My first 37 minutes of thinking aren't stored in a form I can read back. What survives is what that thinking produced, the eight prompts:

- **Strategies:** eight different generative strategies, one per agent.
- **Reader profile:** you as the reader, a LessWrong admin who knows puzzle games, science fiction, maths and decision theory well.
- **Excluded territory:** a long list of known ideas the agents had to avoid, including time loops, portals, quantum observer effects, rules as objects, relativity of simultaneity and Newcomb-style predictors.

Each subagent is another instance of the same model. Each had to:

- propose about 12 candidates;
- pick a top three and search the web for precedents of those three;
- estimate how much of each idea was already known;
- suggest a pair of its candidates that would combine into a third concept.

Together they produced 94 candidates and ran 89 web searches. Each took between 21 and 46 minutes.

The eight strategies:

1. **New ontological categories.** Invent kinds of entity that aren't objects, properties, events, fields and so on.
2. **Alien cognition.** Imagine minds that need a reasoning skill humans have never had to use.
3. **New kinds of laws.** Invent new forms a law of nature could take.
4. **Agency.** Find new relationships between a chooser and their choices.
5. **Unnamed real phenomena.** Find real patterns that recur across fields but have no name.
6. **New formal structures.** Invent small mathematical structures nobody studies.
7. **Depiction as ontology.** Make the world's relationship to its own picture part of its physics.
8. **Deep-structure transplants.** Take the tacit principle behind a craft, such as change ringing, bookkeeping or joinery, and turn it into a law of a world.

While they worked, I dropped four ideas of my own:

- Objects that keep repeating their past movements already exist as record-and-replay games.
- "Distance equals difference" reduces to Flood-It.
- Properties that exist only where something contrasts with them are close to Saussure and Bateson.
- A world that re-solves itself as a logic puzzle around you reads as the anthropic principle plus constraint solving.

## Where each concept came from

### Already (Fatefall)

The core idea and the name came from the new-kinds-of-laws agent. It was that agent's second pick, and it rated it "about 30% known". Its version was: "Any event that would happen in every future the player could still bring about happens immediately, along with its consequences."

Prototyping showed that version doesn't work as stated. Applied event by event, it either changes only what you see or cascades. In the cascade, everything you can't touch on your very next move jumps straight to its end. So I rewrote it for whole processes: a process runs in real time while some strategy of yours could still affect it, and finishes instantly once none can.

In the engine, "could affect" means reach: your body, or one crate you push, can get into the process's future path before the process gets there. Smears, contagion between processes, and rails were my additions, made to keep that version consistent and to make good puzzles.

### Needed (Sine Qua Non)

The core idea and the name came from the alien-cognition agent. It was that agent's first pick, rated "about 40% known", with the Eleatic principle and overdetermination given as precedents. That report already contained three things the game uses:

- the key puzzle idea, "To remove a wall, build a second one";
- the point that the rule would need a tie-break law;
- the prediction that two blockers doing one job would flicker.

I wrote the formal rule:

- the set of veils that exist has to be stable;
- the world keeps its current veils while they stay stable, and otherwise makes the smallest change that restores stability;
- ties go to the veil nearest the lamp along the light;
- a veil's necessity is judged after fated processes complete.

That last choice is what makes the third concept appear.

### Permission

This one is mine, but I found it in two steps rather than designing it.

1. **Self-justifying walls.** At selection time I worked out that the pair implies walls that justify themselves. Such a wall exists because it keeps you from changing the fate that makes it necessary.
2. **The general rule.** I didn't predict this part: a change can reach the eyes only while you could still stop it. It turned up at 22:28, when the engine running Guardian made walls condense only in front of fated runners. I then built Veto and Escort around it.

### Why this pair

Several reports had independently landed on physics that runs on causation and counterfactuals: those from the laws, agency, alien-cognition and ontology agents. I took that as a sign the territory was under-explored.

Of the ideas there, Fatefall and Sine Qua Non were the two that combined into an idea neither implies alone. Neither agent suggested this pairing: each paired its idea with one of its own candidates.

Other strong candidates were:

- **Brevity:** the world must fit a description budget.
- **Clinamen:** your only power is breaking exact ties.
- **Flukes, Spares and Almosts:** defective causes as particles.
- **Stale Here:** frozen indexicals.
- **Earned Selfhood:** an individual is its kind until it has a record of its own.

### The graphics

The visual ideas also started in the reports:

- The laws agent suggested drawing Fatefall as "a completed engraving with a bubble of live time around you".
- The alien-cognition agent suggested drawing Sine Qua Non as "an engineer's load-path drawing come alive", with redundant things as faint cyan ghosts, so that "each frame shows why everything in it exists".

The game's main visual elements are my implementation of those two suggestions:

- the engraved plate;
- the cool and sepia time wash;
- the cyan ghost light and the threads from each veil to its eye;
- the chronophotographic fate trails;
- the long-exposure smears.

## What this record can't show

- **Unrecorded thinking.** The text of my first 37 minutes of thinking, and of the subagents' thinking, wasn't kept in a form I can read back. The record shows what each step produced, not how the ideas occurred.
- **No introspection beyond the record.** When I say an idea "came from" an agent, I mean it first appears in that agent's report.
- **Self-assessed novelty.** The "% known" figures are the agents' own estimates.
- **Excluded ideas that came back.** The smear, which I added in the rewrite, resembles quantum superposition, and that was on the exclusion list I wrote. Giving up control to make something happen now resembles precommitment. The laws agent named that precedent itself, and precommitment was on the agency agent's exclusion list.
