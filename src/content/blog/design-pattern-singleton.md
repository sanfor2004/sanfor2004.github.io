---
title: "Singleton (Creational Pattern)"
description: "Provide one controlled instance and a global access point—while understanding the coupling it creates."
image: "/images/writing/patterns/singleton.webp"
imageAlt: "One central fire-alarm panel receives reports from across a building."
imageWidth: 1600
imageHeight: 900
pubDate: 2026-09-11
updatedDate: 2026-09-12
category: "Design Patterns"
tags: ["Design Patterns", "Creational Patterns", "C++", "Software Engineering"]
draft: false
---

[Start with the design patterns overview](/blog/design-patterns-overview/) · Part 05 of 23 · Creational patterns

Provide one controlled instance and a global access point—while understanding the coupling it creates. This article follows the example in my [23 Design Patterns repository](https://github.com/sanfor2004/23-Design-Patterns/blob/main/creational/singleton/README.md), connecting the problem, participating classes, C++20 implementation, and the trade-offs that decide whether to use it.

## The Problem

Two independently created metrics counters split a process-wide total.

## Naive Solution

```cpp
Metrics first;
Metrics second; // separate counters; assumes a public constructor
```

## Why It Becomes a Problem

Making the constructor public gives each caller its own counter; the intended shared total is no longer shared.

## The Idea

Hide construction, delete copying, and return a function-local static instance.

## Reading the illustration

A building has one official fire-alarm control panel. Everyone may report to it, but adding a second independent panel would split the truth.

In the repository example, the same design idea addresses this software problem: Two independently created metrics counters split a process-wide total.

## Structure

[Diagram](https://github.com/sanfor2004/23-Design-Patterns/blob/main/creational/singleton/diagram.md) · [Run the example](https://github.com/sanfor2004/23-Design-Patterns/blob/main/creational/singleton/cpp/README.md)

<figure>
  <img src="/images/writing/patterns/diagrams/singleton.svg" alt="Singleton diagram showing the participants and their relationships in the C++ example below." loading="lazy" decoding="async" />
  <figcaption>Singleton: the code structure. Read the participant roles below alongside the arrows. <a href="/images/writing/patterns/diagrams/singleton.svg">Open the full-size diagram</a>.</figcaption>
</figure>

```text
Client A + B  -->  Metrics::instance()  -->  one Metrics
```

## Participants

Metrics controls its [`lifetime`](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md#lifetime) (The interval during which an object exists and may be used according to its rules) and stores the count. instance returns a non-owning reference; callers must never delete it.

Canonical roles in this example:

- [`instance`](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md#instance) — A particular object of a type. Here: `Metrics::instance()`.
- [`global state`](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md#global-state) — Data reachable broadly across a program whose changes can affect distant code. Here: `Metrics::requests_`.
- [`thread-safe initialization`](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md#thread-safe-initialization) — Initialization protected against concurrent construction; it does not make later operations thread-safe. Here: `static Metrics metrics`.

## Modern C++20 Example

```cpp
#include <iostream>

class Metrics {
    int requests_ = 0;
    Metrics() = default;
public:
    Metrics(const Metrics&) = delete;
    Metrics& operator=(const Metrics&) = delete;
    static Metrics& instance() {
        static Metrics metrics;
        return metrics;
    }
    void record() { ++requests_; }
    int requests() const { return requests_; }
};
int main() {
    auto& first = Metrics::instance();
    auto& second = Metrics::instance();
    first.record();
    second.record();
    std::cout << "Same instance: " << std::boolalpha << (&first == &second) << '\n';
    std::cout << "Requests: " << first.requests() << '\n';
}
```

## Example Output

```text
Same instance: true
Requests: 2
```

## When to Use

Consider it only when one instance really is a process-level invariant and its lifetime is appropriate.

### Use cases

A tiny single-threaded diagnostic counter demonstrates the mechanism, not a recommendation for production metrics architecture.

## When NOT to Use

Avoid it for convenient access to ordinary dependencies. Pass a Metrics reference explicitly when tests need isolation.

## Advantages

There is one well-defined initialization point and callers reach the same object.

## Trade-offs

Global access hides dependencies and contaminates tests. Local-static initialization is thread-safe, but record is not; concurrent calls need synchronization. Shutdown order can also matter.

## Related Patterns

[Abstract Factory](/blog/design-pattern-abstract-factory/) · [Facade](/blog/design-pattern-facade/)

## Common Confusion

One object managed by [`dependency injection`](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md#dependency-injection) (Supplying a dependency from outside instead of choosing or constructing it inside the consumer) is not necessarily a Singleton: uniqueness need not be enforced by the type.

## Terms to Remember

- `Singleton` — Restrict a type to one accessible instance, accepting the cost of shared global state.
- `instance` — A particular object of a type. Example: `Metrics::instance()`.
- `global state` — Data reachable broadly across a program whose changes can affect distant code. Example: `Metrics::requests_`.
- `thread-safe initialization` — Initialization protected against concurrent construction; it does not make later operations thread-safe. Example: `static Metrics metrics`.

## Interview Vocabulary

- [`dependency injection`](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md#dependency-injection) — Supplying a dependency from outside instead of choosing or constructing it inside the consumer.
- [`testability`](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md#testability) — How readily behavior can be isolated, exercised, and checked.
- [`lifetime`](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md#lifetime) — The interval during which an object exists and may be used according to its rules.

## Interview Question

Does thread-safe initialization make requests_ thread-safe? Identify the separate operations involved.

## Mini Challenge

Refactor the example to inject a Metrics-like counter into two jobs, then test two isolated counters.

## Run and explore the example

The complete code above comes from [creational/singleton/cpp/main.cpp](https://github.com/sanfor2004/23-Design-Patterns/blob/main/creational/singleton/cpp/main.cpp). Follow the repository's [C++20 build instructions](https://github.com/sanfor2004/23-Design-Patterns/blob/main/CPP_EXAMPLES.md) to compile it and compare the result with [expected.txt](https://github.com/sanfor2004/23-Design-Patterns/blob/main/creational/singleton/cpp/expected.txt). The output demonstrates this example's behavior; it does not cover every input or the challenge above.

The source example and adapted explanation are © 2026 Sanfor2004, provided under the [MIT license](/images/writing/patterns/SOURCE-LICENSE.txt). The sketchbook cover is an illustration preserved from this site's original pattern lessons.

## Continue the series

- [Overview: all 23 patterns, their categories, and how to choose](/blog/design-patterns-overview/)
- Previous: [Prototype (Creational Pattern)](/blog/design-pattern-prototype/)
- Next: [Adapter (Structural Pattern)](/blog/design-pattern-adapter/)
