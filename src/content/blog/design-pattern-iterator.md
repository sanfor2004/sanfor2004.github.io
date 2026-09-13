---
title: "Iterator (Behavioral Pattern)"
description: "Traverse a collection without exposing how that collection stores its elements."
image: "/images/writing/patterns/iterator.webp"
imageAlt: "A marked museum route guides a visitor through exhibits."
imageWidth: 1600
imageHeight: 900
pubDate: 2026-09-11
updatedDate: 2026-09-14
category: "Design Patterns"
tags: ["Design Patterns", "Behavioral Patterns", "Python", "C++", "Software Engineering"]
draft: false
---

[Start with the design patterns overview](/blog/design-patterns-overview/) · Part 16 of 23 · Behavioral patterns

Traverse a collection without exposing how that collection stores its elements. This article follows the example in my [23 Design Patterns repository](https://github.com/sanfor2004/23-Design-Patterns/blob/main/behavioral/iterator/README.md), connecting the problem, participating classes, Python and C++20 implementations, and the trade-offs that decide whether to use it.

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

[Diagram](https://github.com/sanfor2004/23-Design-Patterns/blob/main/behavioral/iterator/diagram.md) · [Python source](https://github.com/sanfor2004/23-Design-Patterns/blob/main/behavioral/iterator/python/main.py) · [C++20 source](https://github.com/sanfor2004/23-Design-Patterns/blob/main/behavioral/iterator/cpp/main.cpp)

<figure>
  <img src="/images/writing/patterns/diagrams/iterator.svg" alt="Iterator sketch map: range-for client leads through Playlist::Iterator to private tracks." loading="lazy" decoding="async" />
  <figcaption>Iterator: trace the example from caller through the pattern boundary to its collaborator or result. The arrows show flow, not ownership. <a href="/images/writing/patterns/diagrams/iterator.svg">Open the full-size diagram</a>.</figcaption>
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

## Python Example

The complete [Python source](https://github.com/sanfor2004/23-Design-Patterns/blob/main/behavioral/iterator/python/main.py) is shown first.

```python
class Playlist:
    def __init__(self, tracks):
        self._tracks = list(tracks)

    def __iter__(self):
        return iter(self._tracks)


if __name__ == "__main__":
    playlist = Playlist([7, 12, 18])
    for track in playlist:
        print("Track", track)
    first = iter(playlist)
    second = iter(playlist)
    print("Independent:", next(first), next(second))
    print("Empty:", list(Playlist([])))
```

## Python Output

```text
Track 7
Track 12
Track 18
Independent: 7 7
Empty: []
```

## Code Walkthrough

Playlist owns tracks; Iterator borrows the std::vector and stores a position. Range-for is the client. A static_assert checks the C++20 forward_iterator concept.

Start at the final call in the Python example. Follow the middle role in the diagram and compare how the C++20 version handles the same responsibility.

## C++20 Example

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
    const Playlist empty{{}};
    std::cout << "Empty: " << std::boolalpha << (empty.begin() == empty.end()) << '\n';
    auto first = playlist.begin();
    const auto copy = first;
    ++first;
    std::cout << "Independent positions: " << *first << ' ' << *copy << '\n';
}
```

## C++20 Output

```text
Track 7
Track 12
Track 18
Empty: true
Independent positions: 12 7
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

## Compare the two versions

Python delegates to the built-in list Iterator through `__iter__`; exhaustion raises StopIteration, which `for` handles. C++ demonstrates a custom forward Iterator, but returning standard iterators or ranges is usually simpler. Do not modify the collection while traversing either example. The two examples express the same pattern responsibility; compare their setup and output before changing an input.

## Check yourself

1. Can two traversals keep separate positions in the same Playlist?
2. When would the naive solution on this page be easier to maintain? Give a concrete example.
3. Change one input in the Python example. Predict the output and explain which responsibility handles the change.

## Run and explore the example

The Python code comes from [python/main.py](https://github.com/sanfor2004/23-Design-Patterns/blob/main/behavioral/iterator/python/main.py), with [expected output](https://github.com/sanfor2004/23-Design-Patterns/blob/main/behavioral/iterator/python/expected.txt). The C++20 code comes from [behavioral/iterator/cpp/main.cpp](https://github.com/sanfor2004/23-Design-Patterns/blob/main/behavioral/iterator/cpp/main.cpp). Follow the repository's [C++20 build instructions](https://github.com/sanfor2004/23-Design-Patterns/blob/main/CPP_EXAMPLES.md) to compile it and compare the result with [expected.txt](https://github.com/sanfor2004/23-Design-Patterns/blob/main/behavioral/iterator/cpp/expected.txt). The output demonstrates this example's behavior; it does not cover every input or the challenge above.

The source example and adapted explanation are © 2026 Sanfor2004, provided under the [MIT license](/images/writing/patterns/SOURCE-LICENSE.txt). The sketchbook cover is an illustration preserved from this site's original pattern lessons.

## Continue the series

- [Overview: all 23 patterns, their categories, and how to choose](/blog/design-patterns-overview/)
- Previous: [Interpreter (Behavioral Pattern)](/blog/design-pattern-interpreter/)
- Next: [Mediator (Behavioral Pattern)](/blog/design-pattern-mediator/)
