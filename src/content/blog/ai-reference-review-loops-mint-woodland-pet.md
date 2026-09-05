---
title: "How I Used AI, References, and Review Loops to Build Mint Woodland Pet"
description: "A first-person case study on turning a visual reference into an original Windows desktop companion through AI-assisted asset generation, deterministic sprite preparation, UI matching, and repeatable visual review."
image: "/images/writing/ai-reference-review-loop-mint-woodland-pet.png"
imageAlt: "Editorial illustration of an original woodland desktop pet moving through a reference, AI generation, sprite-sheet, QA, and UI review loop."
pubDate: 2026-09-05
category: "AI Engineering"
tags: ["AI-Assisted Development", "Generative AI", "Prompt Engineering", "Reference-Based Design", "Visual QA", "Iteration", "Pixel Art", "Sprite Animation", "Windows Development", "C++", "Win32", "Desktop Companion", "UI Design", "Software Engineering", "Mint Woodland Pet"]
---

I built [Mint Woodland Pet](https://github.com/sanfor2004/Mint-Woodland-Pet) as a small native Windows companion: a pixel-art creature that sits near the edge of the desktop, reacts to petting, holds short local conversations, and moves through different moods. It is written in C++ with Win32 and GDI+, but the part I want to explain here is the process that made the visual result possible.

I did not treat AI as a button that produces a finished product. I treated it as one step inside a controlled engineering loop:

> reference → generate → inspect → package → run → compare → revise

That loop mattered more than any individual image. It gave me a way to turn a rough visual direction into a repeatable asset pipeline, a stable UI, and a result I could actually test.

## Start with a reference, then define what must stay true

The first job was not writing prompts. It was deciding what made the character recognisable. I selected an original woodland-creature reference and wrote down its visual invariants: mint-green body, leaf ears, a peach flower on the viewer's left, a cream belly, plum eyes, a fern tail on the viewer's right, and a crisp pixel-art silhouette.

Those details became a contract. Every generated mood had to preserve them, even when the pose changed.

I used the same approach for the desktop interface. A saved UI reference specified the speech bubble, stacked answers, settings button, spacing, palette, and rounded corners. This removed ambiguity. Instead of asking AI to "make a cute app," I could compare each implementation decision against a concrete target.

The lesson was simple: a reference is most useful when it becomes a checklist. It tells me what to preserve, what can change, and what I need to reject.

## Generate for a pipeline, not for a gallery

The pet needed eleven moods: idle, look, wave, happy, sad, angry, sleep, eat, drink, thirsty, and thunder. Each mood had to be a real four-frame loop, rather than one still image copied four times.

I asked for each mood as a four-cell pixel-art sheet, read from left to right and top to bottom. The brief locked the character features, baseline, scale, margins, pixel style, and action. It also required the final pose to return naturally toward the first one so the animation could loop.

That is an important difference. A prompt that only asks for "a happy pixel-art pet" can produce a nice picture. A prompt that specifies a four-frame sheet, fixed scale, consistent silhouette, action beats, and loop continuity produces material that can enter a runtime pipeline.

The generation prompts and raw candidates stay beside the project assets. That gives me a record of what I asked for and makes a future revision more specific than starting again from memory.

## Let deterministic tools handle the parts that should not be creative

AI generation was useful for the visual source material, but I did not use it to decide runtime geometry. I used a preparation tool to turn selected 2×2 sheets into the exact format the application needs.

The tool extracts four cells, removes a uniform staging background where needed, finds clean separators, checks bounds, registers frames without stretching them, and writes four transparent 96×96 PNG files plus one 384×96 horizontal sprite strip. It also produces GIF loops and contact sheets for review.

At runtime, the animation rule is intentionally boring:

```cpp
const int frame = int(elapsed / moodDuration(mood)) % 4;
```

The application picks frames 0, 1, 2, 3, then returns to 0. Nearest-neighbour rendering keeps the pixels sharp at the available pet sizes.

This separation made the project easier to reason about. AI created candidate art; deterministic code made the asset contract reliable; C++ rendered the approved result.

## The review loop found the problems that generation alone could not

The first output was not the final output. I found two useful failures early.

The first idle sheet used a painted checkerboard that looked like transparency but was actually baked into the image. It also had cramped spacing. I rejected it and used a source with a uniform magenta staging background, which the preparation tool could remove predictably.

The first happy and thunder sheets had a different problem: the body became noticeably smaller in the jumping frames. That made the character appear to shrink instead of move. I regenerated those moods with a constant torso scale and kept the small hop as a packaging and runtime effect.

These were not cosmetic details. A fake transparent background can create visible artifacts in a desktop window. Inconsistent body scale breaks the illusion of animation. The fixes came from naming a concrete defect, changing only the relevant part of the brief, then checking the result again.

I reviewed raw sources, ordered frame sheets, loop GIFs, a contact sheet, a reference comparison, and a native rendered scene. The automated checks validated 44 nonempty RGBA frames, eleven sprite strips, infinite GIF metadata, frame distinctness, and dialogue-to-mood links. The visual review checked the things numbers cannot: silhouette, pose readability, feature placement, and whether the final frame flows back into the first.

## Matching the UI meant measuring it, not approximating it

I used the saved UI reference to shape the runtime window. The final composition uses a compact question bubble, two vertically stacked dark-teal choices, and a small settings control beside the pet.

One issue surfaced after the first implementation: a long dialogue question escaped the fixed bubble. I kept the visual dimensions, measured the actual text, wrapped it to no more than two lines, and selected the largest font size that still fit. That is a good example of where a visual target and a real runtime constraint meet. The UI can look faithful in a screenshot and still fail with live content.

There was another platform-specific detail. The window uses a magenta colour key for transparency. Rounded controls initially blended their edges against that colour, producing a pink fringe on light desktop backgrounds. I changed the control edges to solid pixels while keeping text and icon strokes smooth. The result matched the reference more closely in the real Windows desktop environment.

## What AI changed in my workflow

AI shortened the time between an idea and a visual candidate. It helped me explore animation poses, establish a consistent pixel-art direction, and produce material I could test. It did not remove the work of art direction, product decisions, implementation, packaging, or quality assurance.

The useful part was the feedback loop. Each pass gave me evidence: an image, a failed extraction, a frame comparison, a runtime preview, or a validation result. That evidence made the next instruction more precise.

For this project, the workflow looked like this:

1. Choose an original reference and record the visual invariants.
2. Convert the desired animation into clear frame-by-frame actions.
3. Generate source sheets with constraints that match the runtime format.
4. Preserve the raw sources and prompts.
5. Extract and package frames with deterministic tooling.
6. Validate geometry, alpha, loop structure, and runtime paths.
7. Inspect the loop and native UI against the reference.
8. Revise the specific mood or layout that failed the review.

I would use this approach again for game sprites, product illustrations, onboarding visuals, or any UI where the output has to be more than an attractive mockup. The goal is not to ask AI for perfection. The goal is to build a system that makes improvement repeatable.

## What remains open

Mint Woodland Pet is a prototype, and I keep its limits visible. The sprite loops use four poses, so there is room for more in-between animation. Long-session performance, mixed-DPI behavior, accessibility, tray recovery, and full-screen behavior still need deeper hands-on testing.

The character artwork is original project artwork with its own rights notice. The source code, tools, dialogue data, and project documentation are released under the MIT License, while the visual assets remain protected as part of Mint Woodland Pet. That boundary matters when publishing a project that combines open-source software with original creative work.

If you are building with AI, my advice is to keep the loop visible. Save the reference. Save the prompt. Test the generated result inside the product. Write down why a candidate failed. Then make the next revision narrower and smarter than the last one.

You can explore the source, asset pipeline, validation notes, and project documentation in the [Mint Woodland Pet repository](https://github.com/sanfor2004/Mint-Woodland-Pet).

For more engineering notes and project case studies, [browse all my writing](/blog/).
