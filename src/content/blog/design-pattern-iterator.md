---
title: "Iterator (Behavioral Pattern)"
description: "Traverse a collection without exposing how that collection stores its elements."
image: "/images/writing/patterns/iterator.webp"
imageAlt: "A marked museum route guides a visitor through exhibits."
imageWidth: 1600
imageHeight: 900
pubDate: 2026-09-11
updatedDate: 2026-09-12
category: "Design Patterns"
tags: ["Design Patterns", "Behavioral Patterns", "C++", "Software Engineering"]
draft: false
---

[Start with the design patterns overview](/blog/design-patterns-overview/) · Part 16 of 23 · Behavioral patterns

Traverse a collection without exposing how that collection stores its elements. This article follows the example in my [23 Design Patterns repository](https://github.com/sanfor2004/23-Design-Patterns/blob/main/behavioral/iterator/README.md), connecting the problem, participating classes, C++20 implementation, and the trade-offs that decide whether to use it.

## The Problem

Clients need to read playlist entries without reaching into its private storage.

## Naive Solution

```cpp
for (std::size_t i = 0; i < tracks.size(); ++i) {
    std::cout << tracks[i];
}
```

## Why It Becomes a Problem

Index-based code tied to a public std::vector exposes representation and spreads boundary handling.

## The Idea

Provide begin and end plus an iterator supporting dereference, increment and equality.

## Reading the illustration

A museum route guides visitors from exhibit to exhibit without giving them the building’s maintenance plans.

In the repository example, the same design idea addresses this software problem: Clients need to read playlist entries without reaching into its private storage.

## Structure

[Diagram](https://github.com/sanfor2004/23-Design-Patterns/blob/main/behavioral/iterator/diagram.md) · [Run the example](https://github.com/sanfor2004/23-Design-Patterns/blob/main/behavioral/iterator/cpp/README.md)

<figure>
  <img src="/images/writing/patterns/diagrams/iterator.svg" alt="Iterator diagram showing the participants and their relationships in the C++ example below." loading="lazy" decoding="async" />
  <figcaption>Iterator: the code structure. Read the participant roles below alongside the arrows. <a href="/images/writing/patterns/diagrams/iterator.svg">Open the full-size diagram</a>.</figcaption>
</figure>

```text
range-for client  -->  Playlist::Iterator  -->  private tracks
```

## Participants

Playlist owns tracks; Iterator borrows the std::vector and stores a position. Range-for is the client. A static_assert checks the C++20 forward_iterator concept.

Canonical roles in this example:

- [`Aggregate`](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md#aggregate) — The collection that provides access to iterators. Here: `Playlist`.
- [`Concrete Iterator`](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md#concrete-iterator) — An implementation that stores a traversal position for a particular Aggregate. Here: `Playlist::Iterator`.
- [`forward iterator`](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md#forward-iterator) — An iterator supporting forward traversal and the multipass guarantee, allowing independent copies to traverse the same range. Here: `std::forward_iterator`.

## Modern C++20 Example

```cpp
#include <cstddef>
#include <iostream>
#include <iterator>
#include <utility>
#include <vector>

class Playlist {
    std::vector<int> tracks_;
public:
    explicit Playlist(std::vector<int> tracks) : tracks_(std::move(tracks)) {}
    class Iterator {
        const std::vector<int>* tracks_ = nullptr;
        std::size_t index_ = 0;
    public:
        using value_type = int;
        using difference_type = std::ptrdiff_t;
        using iterator_concept = std::forward_iterator_tag;
        Iterator() = default;
        Iterator(const std::vector<int>& tracks, std::size_t index) : tracks_(&tracks), index_(index) {}
        const int& operator*() const { return (*tracks_)[index_]; }
        Iterator& operator++() { ++index_; return *this; }
        Iterator operator++(int) { auto old = *this; ++*this; return old; }
        bool operator==(const Iterator&) const = default;
    };
    Iterator begin() const { return Iterator{tracks_, 0}; }
    Iterator end() const { return Iterator{tracks_, tracks_.size()}; }
};
static_assert(std::forward_iterator<Playlist::Iterator>);
int main() {
    const Playlist playlist{{7, 12, 18}};
    for (int track : playlist) std::cout << "Track " << track << '\n';
}
```

## Example Output

```text
Track 7
Track 12
Track 18
```

## When to Use

Use standard iterators or ranges to expose traversal without exposing storage details.

### Use cases

Container traversal and tree walks fit; choose iterator category according to actual operations and complexity.

## When NOT to Use

Avoid a custom iterator when returning existing const iterators or a standard range is sufficient; this custom [`implementation`](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md#implementation) (The concrete code that fulfills an interface or performs an operation) is educational.

## Advantages

Algorithms can use a common protocol, and multiple iterators maintain independent positions.

## Trade-offs

Iterators do not extend the collection [`lifetime`](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md#lifetime) (The interval during which an object exists and may be used according to its rules). Moving or destroying this Playlist invalidates assumptions; dereferencing end is invalid, just as with standard iterators.

## Related Patterns

[Composite](/blog/design-pattern-composite/) · [Visitor](/blog/design-pattern-visitor/)

## Common Confusion

Visitor chooses operations by element type. Iterator controls traversal and need not know what the client does with an element.

## Terms to Remember

- `Iterator` — Traverse a collection through a stable access protocol.
- `Aggregate` — The collection that provides access to iterators. Example: `Playlist`.
- `Concrete Iterator` — An implementation that stores a traversal position for a particular Aggregate. Example: `Playlist::Iterator`.
- `forward iterator` — An iterator supporting forward traversal and the multipass guarantee, allowing independent copies to traverse the same range. Example: `std::forward_iterator`.

## Interview Vocabulary

- [`encapsulation`](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md#encapsulation) — Keeping representation and invariants behind controlled operations.
- [`iterator invalidation`](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md#iterator-invalidation) — An operation makes an iterator no longer valid for its intended use.
- [`generic programming`](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md#generic-programming) — Writing algorithms against requirements on types rather than one concrete type.

## Interview Question

Why does the equality check include the std::vector pointer as well as the index?

## Mini Challenge

Test an empty playlist and two independent iterators; verify advancing one does not advance the other.

## Run and explore the example

The complete code above comes from [behavioral/iterator/cpp/main.cpp](https://github.com/sanfor2004/23-Design-Patterns/blob/main/behavioral/iterator/cpp/main.cpp). Follow the repository's [C++20 build instructions](https://github.com/sanfor2004/23-Design-Patterns/blob/main/CPP_EXAMPLES.md) to compile it and compare the result with [expected.txt](https://github.com/sanfor2004/23-Design-Patterns/blob/main/behavioral/iterator/cpp/expected.txt). The output demonstrates this example's behavior; it does not cover every input or the challenge above.

The source example and adapted explanation are © 2026 Sanfor2004, provided under the [MIT license](/images/writing/patterns/SOURCE-LICENSE.txt). The sketchbook cover is an illustration preserved from this site's original pattern lessons.

## Continue the series

- [Overview: all 23 patterns, their categories, and how to choose](/blog/design-patterns-overview/)
- Previous: [Interpreter (Behavioral Pattern)](/blog/design-pattern-interpreter/)
- Next: [Mediator (Behavioral Pattern)](/blog/design-pattern-mediator/)
