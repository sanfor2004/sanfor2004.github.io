---
title: "Adapter (Structural Pattern)"
description: "Translate one interface into another interface the client already understands."
image: "/images/writing/patterns/adapter.webp"
imageAlt: "A travel plug connects an appliance to a socket with a different connection standard."
imageWidth: 1600
imageHeight: 900
pubDate: 2026-09-11
updatedDate: 2026-09-12
category: "Design Patterns"
tags: ["Design Patterns", "Structural Patterns", "C++", "Software Engineering"]
draft: false
---

[Start with the design patterns overview](/blog/design-patterns-overview/) · Part 06 of 23 · Structural patterns

Translate one interface into another interface the client already understands. This article follows the example in my [23 Design Patterns repository](https://github.com/sanfor2004/23-Design-Patterns/blob/main/structural/adapter/README.md), connecting the problem, participating classes, C++20 implementation, and the trade-offs that decide whether to use it.

## The Problem

A dashboard expects Celsius but an existing sensor exposes Fahrenheit.

## Naive Solution

```cpp
double displayed = sensor.fahrenheit(); // UI expects Celsius
```

## Why It Becomes a Problem

Passing the raw number displays the wrong unit. Scattered conversion formulas duplicate a compatibility rule.

## The Idea

Implement Temperature around a borrowed LegacyThermometer and convert Fahrenheit to Celsius at the boundary.

## Reading the illustration

A travel plug does not change the appliance or the wall. It translates the physical connection between two standards.

In the repository example, the same design idea addresses this software problem: A dashboard expects Celsius but an existing sensor exposes Fahrenheit.

## Structure

[Diagram](https://github.com/sanfor2004/23-Design-Patterns/blob/main/structural/adapter/diagram.md) · [Run the example](https://github.com/sanfor2004/23-Design-Patterns/blob/main/structural/adapter/cpp/README.md)

<figure>
  <img src="/images/writing/patterns/diagrams/adapter.svg" alt="Adapter diagram showing the participants and their relationships in the C++ example below." loading="lazy" decoding="async" />
  <figcaption>Adapter: the code structure. Read the participant roles below alongside the arrows. <a href="/images/writing/patterns/diagrams/adapter.svg">Open the full-size diagram</a>.</figcaption>
</figure>

```text
display(Temperature)  -->  CelsiusAdapter  -->  LegacyThermometer
```

## Participants

Temperature is the target interface. LegacyThermometer is the existing API. CelsiusAdapter borrows it; display uses only Temperature.

Canonical roles in this example:

- [`Target`](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md#target) — The interface expected by the Client. Here: `Temperature`.
- [`Adaptee`](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md#adaptee) — The existing object whose interface needs adaptation. Here: `LegacyThermometer`.
- [`interface`](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md#interface) — The contract of operations and observable behavior offered to a caller. Here: `Temperature`.

## Modern C++20 Example

```cpp
#include <iostream>
#include <stdexcept>

class LegacyThermometer {
public:
    double fahrenheit() const { return 77.0; }
};
struct Temperature {
    virtual ~Temperature() = default;
    virtual double celsius() const = 0;
};
class CelsiusAdapter final : public Temperature {
    const LegacyThermometer& sensor_;
public:
    explicit CelsiusAdapter(const LegacyThermometer& sensor) : sensor_(sensor) {}
    double celsius() const override { return (sensor_.fahrenheit() - 32.0) * 5.0 / 9.0; }
};
void display(const Temperature& temperature) {
    std::cout << temperature.celsius() << " C\n";
}
int main() {
    const LegacyThermometer sensor;
    const CelsiusAdapter adapter{sensor};
    display(adapter);
}
```

## Example Output

```text
25 C
```

## When to Use

Use it at a boundary to an existing API you cannot or should not change.

### Use cases

Legacy API integration and unit conversion are common contexts; conversion accuracy and error handling still need explicit contracts.

## When NOT to Use

Avoid it when you own both sides and a single consistent interface would be simpler.

## Advantages

Unit conversion lives in one place, and the display can accept other Temperature implementations.

## Trade-offs

An adapter can hide semantic mismatches if it only renames methods. The sensor must outlive the adapter because the reference does not own it.

## Related Patterns

[Facade](/blog/design-pattern-facade/) · [Bridge](/blog/design-pattern-bridge/)

## Common Confusion

Facade simplifies a subsystem. Adapter makes a specific existing interface compatible with a target contract.

## Terms to Remember

- `Adapter` — Translate an existing interface into the one a client expects.
- `Target` — The interface expected by the Client. Example: `Temperature`.
- `Adaptee` — The existing object whose interface needs adaptation. Example: `LegacyThermometer`.
- `interface` — The contract of operations and observable behavior offered to a caller. Example: `Temperature`.

## Interview Vocabulary

- [`program to an interface, not an implementation`](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md#program-to-an-interface-not-an-implementation) — Depend on the promised contract instead of a particular concrete implementation.
- [`delegation`](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md#delegation) — An object asks a collaborator to perform part of its work.
- [`lifetime`](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md#lifetime) — The interval during which an object exists and may be used according to its rules.

## Interview Question

Can an adapter always preserve behavior if the source API is asynchronous and the target is synchronous?

## Mini Challenge

Test freezing and boiling points by allowing the legacy sensor to return configurable Fahrenheit values.

## Run and explore the example

The complete code above comes from [structural/adapter/cpp/main.cpp](https://github.com/sanfor2004/23-Design-Patterns/blob/main/structural/adapter/cpp/main.cpp). Follow the repository's [C++20 build instructions](https://github.com/sanfor2004/23-Design-Patterns/blob/main/CPP_EXAMPLES.md) to compile it and compare the result with [expected.txt](https://github.com/sanfor2004/23-Design-Patterns/blob/main/structural/adapter/cpp/expected.txt). The output demonstrates this example's behavior; it does not cover every input or the challenge above.

The source example and adapted explanation are © 2026 Sanfor2004, provided under the [MIT license](/images/writing/patterns/SOURCE-LICENSE.txt). The sketchbook cover is an illustration preserved from this site's original pattern lessons.

## Continue the series

- [Overview: all 23 patterns, their categories, and how to choose](/blog/design-patterns-overview/)
- Previous: [Singleton (Creational Pattern)](/blog/design-pattern-singleton/)
- Next: [Bridge (Structural Pattern)](/blog/design-pattern-bridge/)
