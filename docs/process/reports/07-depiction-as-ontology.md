<!-- Final report from the brainstorm subagent "Brainstorm: depiction-as-ontology concepts", reproduced verbatim. It ran 20:56 to 21:17 UTC on 2026-10-08 and made 26 web searches. -->

# Depiction-as-Ontology: 12 candidates

Web searches found **no game** that uses illusory contours, defocus/aperture, or cartographic generalization as world physics.

## TOP 3

### 1. Inferred Matter ("Kanizsa physics")
**Concept.** Matter is the most parsimonious explanation of the visible cues. Solid things are never depicted; only *evidence* is (notched discs, line-ends, junctions). The world contains exactly the occluders that evidence implies.
**New thought.** Build by implication, destroy by refutation. You never place a bridge; you arrange evidence that *forces* one, predicting what your own visual cortex (mirrored by the engine) will conclude. Habits: "what's the simplest thing that explains these gaps?" and "one line through it disproves it."
**Puzzles.**
- Rotate three pac-man stones on a cliff edge until their mouths align, and a triangle spans the chasm. Standing on an inducer hides it, so you can't rest on the bridge's own evidence.
- A wall implied by aligned line-ends (abutting-grating illusion) can't be pushed. Draw one line *through* it and the wall is refuted. But that line's new endpoint implies a ledge elsewhere, so refutations chain.
- Amodal completion: rope ends on either side of a phantom slab are one rope, so pull one end and the other moves. Misalign them and it's two ropes.
- Strength follows support ratio (Shipley & Kellman). Spread the inducers and the bridge sags, then vanishes.

**Look: "cortical rendering."** The renderer never draws the platforms; your brain does.
- A paper-white field with ink-black inducers. The surfaces you *see* glow brighter than the paper.
- Neon color spreading turns a few colored segments into glassy discs.
- Pinna's watercolor-illusion double contours (purple outside, orange inside) tint regions and decide figure/ground.
- Engine: detected illusory polygons become physics bodies that are never drawn. An optional faint Cornsweet edge helps players who don't see the illusion.

**Precedents.** The "perception is reality" family: Superliminal and Echochrome (projection), Closure (only lit things exist), Blink (2017: afterimages of lights are solid). Searches turned up only Escher-style illusion games (Kubic, Orthoiso). Overlap is about 35%; building and refuting with evidence looks new.

### 2. Circle of Confusion ("defocus is dilation")
**Concept.** Blur isn't failing to see a thing; it changes the thing. Out of focus, every point really becomes a copy of the aperture, scaled by its distance from the focal plane, and its conserved light spreads thinner.
**New thought.** Convolution/Minkowski reasoning with a kernel you choose:
- "A slit aperture closes horizontal gaps only."
- "Spread it too far and it's too dim to be solid."
- "Bokeh in front of focus are inverted copies of those behind."

**Rules.** Each light has a depth z; focus is f. Radius r = k·|z−f|, and brightness = flux/area. Wherever the additive image exceeds a threshold τ, it's solid.
**Puzzles.**
- A fence of dim lamps lets the flood through. Rack focus until their discs overlap above τ and you have a dam. Overshoot and they spread too thin, so the wall exists only between f≈3.1 and 4.6.
- One bright star sits under a chasm. A round aperture gives a dome you slide off; an anamorphic insert flattens it into a bridge.
- A mirror-lens donut aperture turns small lights into hollow rings (cages), while big ones stay filled.
- Defocus *yourself* below τ to ghost through a wall, mid-fall.
- Exposure triangle as conservation law: stopping down shrinks every disc but dims the world. Pay for it with shutter time, and moving lights smear into solid trails.

**Look.** A world built only of out-of-focus light, on velvet black.
- Architecture is additive, translucent polygon discs with soap-bubble rims, onion-ring texture and dust specks.
- Magenta and green fringes flip across the focal plane. That's real optics, and it doubles as a depth cue.
- Cat's-eye and Petzval swirl increase toward the frame edges. The focal plane holds razor-sharp filaments.
- WebGL: procedural kernel sprites into a float buffer, filmic tonemap, collision from a low-res thresholded readback.

**Precedents.** None found for depth of field or aperture as physics. Neighbours: Viewfinder and Shutter (camera = perspective), Focus Shift and GMTK's Zoom (zoom = size), Blink ("walk on light"). The real-world seed is photographers' card bokeh masks. The look exists in photos, never as architecture.

### 3. Generalization ("scale-relative topology")
**Concept.** There is no scale-free territory. At each scale the world *is* its generalized depiction, shaped by the cartographic operators: select, simplify, aggregate, collapse, exaggerate, displace. What is connected, and what exists, depends on scale.
**New thought.** Persistent-topology reasoning. Every feature has a scale where it appears and one where it disappears (a barcode), and a route is a sequence of zooms: "find the window where the lake has collapsed but the forests haven't merged."
**Rules.** The avatar is a symbol of constant screen size. Zoom is anchored on you; if a zoom would leave you inside solid ground, displacement shoves you out.
**Puzzles.**
- Zoom out until the lake collapses to a dot, step over it, zoom back in. Stay below the scale where the woods on either side merge into a wall.
- A hairline footbridge is impassable up close. Exaggeration (minimum legible width) makes it a causeway at coarse scale.
- At coarse scale, displacement pushes the road away from the river. Stand on it and get carried.
- Douglas–Peucker simplification straightens a switchback into a straight climb.
- Places you visit gain importance and survive generalization, so you choose what the world remembers.

**Look.** A living atlas that redraws itself, with almost no text.
- Imhof Swiss relief: violet shadows, warm slopes. Hachures thicken into hillshade.
- 19th-century water-lining ripples off the coasts. Tree glyphs stipple, then flood into flat tint.
- Coastlines relax via vertex morphs (vario-scale/tGAP structures; SDF offsets for aggregation).

**Precedents.** Carto, Parabox, Focus Shift. Smooth-zoom generalization exists only in cartography research. Risk: the user files it under map-is-territory (about 45% overlap).

## OTHER CANDIDATES
4. **Gist & Detail.** Two causal worlds share the same pixels: the low spatial frequencies (gist) and the high ones (detail). A mote shuffles ink grains; a giant walks their blurred density. *Thought:* bandpass/halftone reasoning, since shuffles within the blur radius are invisible to the giant. *Look:* a hybrid-image world you squint or lean back to read. *Precedent:* Dalí's Lincoln, Oliva–Torralba–Schyns hybrid images, Chuck Close; no game found. Risk: the dither look is close to Obra Dinn.
5. **Gaze Rank.** Hierarchical proportion as physics: a figure's size is its eigenvector centrality in the graph of who looks at whom. *Thought:* PageRank and status flow. Redirect a peasant's gaze and the giant guard shrinks; lovers gazing at each other swell into a rank sink. *Look:* illuminated manuscript with gold sightlines (a known style). No precedent found.
6. **Phase Motion.** Nothing moves; palette rotation carries state through fixed pixels (Ferrari-style color cycling as physics). *Thought:* phase velocity. The index gradient sets speed and direction, and a flat index flashes everywhere at once. *Precedent:* Hue, Hall of Palettes (palette swaps), marquee chaser lights. About 40% overlap.
7. **Relief Prior.** The light-from-above prior is law. Rotate the sun glyph and every dome becomes a dimple (crater illusion), so a ball parked in a pit launches. *Thought:* perceptual priors as levers. *Look:* repoussé brass under raking light. *Precedent:* Thanks, Light (light reshapes geometry), Echochrome. About 55% overlap.
8. **Detail Budget.** The world has a fixed total of Fourier epicycles, so detail is conserved. Sharpen a key's teeth by taking harmonics from a jagged peak, which smooths into a climbable hill. *Thought:* spectral budgeting, since corners are expensive. *Look:* everything traced live by brass orrery chains. *Precedent:* Glow Trace Tune (curve-matching only).
9. **Where/What Split.** Luminance carries position and collision; hue carries identity (Livingstone). Objects of equal luminance pass through each other. *Thought:* grayscale for physics, color for meaning. *Look:* Dufy-style washes floating off crisp lines. About 50% overlap with Hue.
10. **Axis Transform.** Rescale the world's axes (log, reciprocal, sqrt). An exponential cliff becomes a walkable ramp, zero becomes infinitely far, negatives vanish. *Thought:* linearization as navigation. *Look:* Tufte-style chart landscape. *Precedent:* ZquiXy (linear axis squish).
11. **Datamosh.** Appearance and motion are separate substances. Drop a keyframe and the old scene's matter rides the new scene's motion vectors; a waterfall's vectors melt a wall. *Thought:* separate "what" from "how it moves." *Look:* macroblock smear (glitch art is a known look). No game found.
12. **Saliency Clock.** Events happen in the order a modelled viewer's eye visits them, shown as a visible saccade path. Dim the thief and gild the lantern so the guard looks there first. *Thought:* compose for attention. *Precedent:* Framed (panel order). Risk: saliency is hard to predict.

## BEST PAIR → EMERGENT THIRD
**Inferred Matter + Circle of Confusion → "Precision" (the prior tide).** Inference = evidence × prior, and focus sets how reliable the evidence is.
- **Optics manufacture evidence.** A pac-man aperture mask turns every defocused light into an inducer. Bokeh in front of focus are inverted relative to those behind (verified optics). So a Kanizsa bridge between two lamps exists only when the focal plane passes *between* them, and far enough from both to make big discs (support ratio). Racking focus makes phantoms bloom and fail in sequence.
- **Blur lets expectation win.** In sharp focus, the gap in a broken rail is evidence of a break. Blurred, that evidence is too weak, and good continuation completes the rail. You cross by *deliberately not seeing clearly*. Heavier blur hands control to stronger priors: convexity, light-from-above, faces (three dim knots become a face that wakes and looks).
- **The new thought:** how much you trust your own eyes becomes a construction tool. It makes predictive processing's "precision weighting" physical.
- **Look:** reverse-contrast Kanizsa. Blacker-than-black voids float between glowing bokeh, seen but never drawn.

*Alternate pair:* Inferred Matter + Generalization → "Real Patterns." An entity exists at the scale where positing it gives the shortest explanation (Dennett), so a grove arranged correctly becomes a bridge only at forest scale.

**Sources:** [Blink](https://www.mobygames.com/game/150862/blink/) · [Thanks, Light](https://www.jestr.gg/games/thanks-light) · [Focus Shift](https://krispp2000.itch.io/focus-shift) · [Shutter](https://www.gamedeveloper.com/business/shutter-solves-puzzles-by-shifting-the-worlds-perspective) · [Glow Trace Tune](https://mwm.ai/apps/glow-trace-tune/6779635253) · [ZquiXy](https://veramasc.itch.io/zquixy) · [Hall of Palettes](https://wer8888.itch.io/hall-of-palettes) · [Shaped-bokeh orientation](https://www.diyphotography.net/?p=1216) · [Smooth-zoom generalization](https://research.tudelft.nl/en/publications/paralleling-generalization-operations-to-support-smooth-zooming-c) · [Hybrid images](https://history.siggraph.org/?p=113537)
