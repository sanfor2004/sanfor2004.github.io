---
title: "Flyweight (Structural Pattern)"
description: "Share repeated intrinsic state while keeping context-specific state outside the shared object."
image: "/images/writing/patterns/flyweight.webp"
imageAlt: "Shared book information connects to separate borrowing records."
imageWidth: 1600
imageHeight: 900
pubDate: 2026-09-11
updatedDate: 2026-09-14
category: "Design Patterns"
tags: ["Design Patterns", "Structural Patterns", "Python", "C++", "Software Engineering"]
draft: false
---

[Start with the design patterns overview](/blog/design-patterns-overview/) · Part 11 of 23 · Structural patterns

Share repeated intrinsic state while keeping context-specific state outside the shared object. This article follows the example in my [23 Design Patterns repository](https://github.com/sanfor2004/23-Design-Patterns/blob/main/structural/flyweight/README.md), connecting the problem, participating classes, Python and C++20 implementations, and the trade-offs that decide whether to use it.

## The Problem

A document has many repeated glyphs; storing a full outline for each position wastes memory.

## Naive Solution

```cpp
std::string shape1 = "A";
std::string shape2 = "A"; // repeated immutable data per placement
```

## Why It Becomes a Problem

Duplicating the same shape for each occurrence scales memory with the number of placements rather than distinct shapes.

## The Idea

Pool Glyph objects by character. PlacedGlyph shares a const Glyph and keeps its own x position.

## Reading the illustration

A library keeps one book edition on the shelf while each loan record stores who borrowed it and when. The shared book data is not copied per borrower.

In the repository example, the same design idea addresses this software problem: A document has many repeated glyphs; storing a full outline for each position wastes memory.

## Structure

[Diagram](https://github.com/sanfor2004/23-Design-Patterns/blob/main/structural/flyweight/diagram.md) · [Python source](https://github.com/sanfor2004/23-Design-Patterns/blob/main/structural/flyweight/python/main.py) · [C++20 source](https://github.com/sanfor2004/23-Design-Patterns/blob/main/structural/flyweight/cpp/main.cpp)

<figure>
  <img src="/images/writing/patterns/diagrams/flyweight.svg" alt="Flyweight sketch map: PlacedGlyph(x) leads through GlyphPool::get to shared const Glyph." loading="lazy" decoding="async" />
  <figcaption>Flyweight: trace the example from caller through the pattern boundary to its collaborator or result. The arrows show flow, not ownership. <a href="/images/writing/patterns/diagrams/flyweight.svg">Open the full-size diagram</a>.</figcaption>
</figure>

```text
PlacedGlyph(x)  -->  GlyphPool::get  -->  shared const Glyph
```

## Participants

Glyph holds shared intrinsic shape; GlyphPool interns it; PlacedGlyph stores extrinsic position and shared [`ownership`](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md#ownership) (Responsibility for keeping a resource alive and eventually releasing it).

Canonical roles in this example:

- [`intrinsic state`](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md#intrinsic-state) — Data independent of an occurrence's context that a Flyweight can share. Here: `Glyph::shape`.
- [`extrinsic state`](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md#extrinsic-state) — Per-occurrence data kept outside a shared Flyweight. Here: `PlacedGlyph::x`.
- [`Flyweight Factory`](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md#flyweight-factory) — A lookup service that returns a shared Flyweight for a key. Here: `GlyphPool`.

## Python Example

The complete [Python source](https://github.com/sanfor2004/23-Design-Patterns/blob/main/structural/flyweight/python/main.py) is shown first.

```python
from dataclasses import dataclass


@dataclass(frozen=True)
class Glyph:
    shape: str


class GlyphPool:
    def __init__(self):
        self.glyphs = {}

    def get(self, symbol):
        if symbol not in self.glyphs:
            self.glyphs[symbol] = Glyph(symbol)
        return self.glyphs[symbol]


class PlacedGlyph:
    def __init__(self, glyph, x):
        self.glyph = glyph
        self.x = x

    def draw(self):
        print(self.glyph.shape, "at", self.x)


if __name__ == "__main__":
    pool = GlyphPool()
    first = PlacedGlyph(pool.get("A"), 0)
    second = PlacedGlyph(pool.get("A"), 10)
    first.draw()
    second.draw()
    print("Shared shape:", first.glyph is second.glyph)
    print("Different shape:", first.glyph is pool.get("B"))
```

## Python Output

```text
A at 0
A at 10
Shared shape: True
Different shape: False
```

## Code Walkthrough

Glyph holds shared intrinsic shape; GlyphPool interns it; PlacedGlyph stores extrinsic position and shared [`ownership`](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md#ownership).

Start at the final call in the Python example. Follow the middle role in the diagram and compare how the C++20 version handles the same responsibility.

## C++20 Example

```cpp
#include <iostream>
#include <map>
#include <memory>
#include <string>
#include <utility>

struct Glyph {
    const std::string shape;
    explicit Glyph(std::string value) : shape(std::move(value)) {}
};
class GlyphPool {
    std::map<char, std::shared_ptr<const Glyph>> glyphs_;
public:
    std::shared_ptr<const Glyph> get(char symbol) {
        auto& glyph = glyphs_[symbol];
        if (!glyph) glyph = std::make_shared<const Glyph>(std::string(1, symbol));
        return glyph;
    }
};
struct PlacedGlyph {
    std::shared_ptr<const Glyph> glyph;
    int x;
    void draw() const { std::cout << glyph->shape << " at " << x << '\n'; }
};
int main() {
    GlyphPool pool;
    const PlacedGlyph first{pool.get('A'), 0};
    const PlacedGlyph second{pool.get('A'), 10};
    first.draw();
    second.draw();
    std::cout << "Shared shape: " << std::boolalpha << (first.glyph == second.glyph) << '\n';
}
```

## C++20 Output

```text
A at 0
A at 10
Shared shape: true
```

## When to Use

Use it after measuring significant duplication of immutable data across many objects.

### Use cases

Glyph outlines, terrain tile definitions and interned identifiers are suitable candidates when profiling supports sharing.

## When NOT to Use

Avoid it for tiny datasets, mutable per-instance data, or when lookup overhead outweighs savings.

## Advantages

Repeated placements reuse the same shape object while positions remain independent.

## Trade-offs

The pool retains entries, map lookup costs time, and [`std::shared_ptr`](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md#stdshared_ptr) (A smart pointer sharing ownership; the managed object is released when the last owning reference disappears) adds bookkeeping. This toy string is small; no memory-saving benchmark is claimed. Pool access is not synchronized.

## Related Patterns

[Composite](/blog/design-pattern-composite/) · [Prototype](/blog/design-pattern-prototype/)

## Common Confusion

Prototype copies configured state to a new object. Flyweight deliberately shares intrinsic state across occurrences.

## Terms to Remember

- `Flyweight` — Share immutable intrinsic data while keeping each occurrence's context separate.
- `intrinsic state` — Data independent of an occurrence's context that a Flyweight can share. Example: `Glyph::shape`.
- `extrinsic state` — Per-occurrence data kept outside a shared Flyweight. Example: `PlacedGlyph::x`.
- `Flyweight Factory` — A lookup service that returns a shared Flyweight for a key. Example: `GlyphPool`.

## Interview Vocabulary

- [`interning`](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md#interning) — Reusing one representation for equivalent values through a lookup pool.
- [`ownership`](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md#ownership) — Responsibility for keeping a resource alive and eventually releasing it.
- [`memory allocation`](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md#memory-allocation) — Obtaining storage for data; its cost and failure behavior depend on the mechanism.

## Interview Question

Which fields belong in the pool key if font family and size affect the shape?

## Mini Challenge

Extend the key with a font identifier. Verify same keys share and different fonts do not.

## Compare the two versions

A small frozen dataclass makes the shared Python Glyph immutable through normal attribute assignment. C++ uses `shared_ptr<const Glyph>`. Both pools keep entries alive. This demonstrates sharing, not measured memory savings; the pool itself has a cost. The two examples express the same pattern responsibility; compare their setup and output before changing an input.

## Check yourself

1. Which data must stay outside the shared Glyph, and why?
2. When would the naive solution on this page be easier to maintain? Give a concrete example.
3. Change one input in the Python example. Predict the output and explain which responsibility handles the change.

## Run and explore the example

The Python code comes from [python/main.py](https://github.com/sanfor2004/23-Design-Patterns/blob/main/structural/flyweight/python/main.py), with [expected output](https://github.com/sanfor2004/23-Design-Patterns/blob/main/structural/flyweight/python/expected.txt). The C++20 code comes from [structural/flyweight/cpp/main.cpp](https://github.com/sanfor2004/23-Design-Patterns/blob/main/structural/flyweight/cpp/main.cpp). Follow the repository's [C++20 build instructions](https://github.com/sanfor2004/23-Design-Patterns/blob/main/CPP_EXAMPLES.md) to compile it and compare the result with [expected.txt](https://github.com/sanfor2004/23-Design-Patterns/blob/main/structural/flyweight/cpp/expected.txt). The output demonstrates this example's behavior; it does not cover every input or the challenge above.

The source example and adapted explanation are © 2026 Sanfor2004, provided under the [MIT license](/images/writing/patterns/SOURCE-LICENSE.txt). The sketchbook cover is an illustration preserved from this site's original pattern lessons.

## Continue the series

- [Overview: all 23 patterns, their categories, and how to choose](/blog/design-patterns-overview/)
- Previous: [Facade (Structural Pattern)](/blog/design-pattern-facade/)
- Next: [Proxy (Structural Pattern)](/blog/design-pattern-proxy/)
