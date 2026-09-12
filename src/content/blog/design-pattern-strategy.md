---
title: "Strategy (Behavioral Pattern)"
description: "Package interchangeable algorithms behind one interface and choose among them by composition."
image: "/images/writing/patterns/strategy.webp"
imageAlt: "A traveler chooses between alternative routes to a destination."
imageWidth: 1600
imageHeight: 900
pubDate: 2026-09-11
updatedDate: 2026-09-12
category: "Design Patterns"
tags: ["Design Patterns", "Behavioral Patterns", "C++", "Software Engineering"]
draft: false
---

[Start with the design patterns overview](/blog/design-patterns-overview/) · Part 21 of 23 · Behavioral patterns

Package interchangeable algorithms behind one interface and choose among them by composition. This article follows the example in my [23 Design Patterns repository](https://github.com/sanfor2004/23-Design-Patterns/blob/main/behavioral/strategy/README.md), connecting the problem, participating classes, C++20 implementation, and the trade-offs that decide whether to use it.

## The Problem

Checkout totals need different shipping policies without mixing every policy into checkout logic.

## Naive Solution

```cpp
int fee = express ? (subtotal >= 100 ? 0 : 15) : 5;
```

## Why It Becomes a Problem

One conditional is readable; repeated policy branches across checkout paths make adding and testing rules harder.

## The Idea

Checkout owns a ShippingRule callable and asks it for the fee. The caller selects the rule at construction.

## Reading the illustration

The destination stays the same, but you can choose walking, cycling, or driving based on the situation. The trip planner delegates the route calculation.

In the repository example, the same design idea addresses this software problem: Checkout totals need different shipping policies without mixing every policy into checkout logic.

## Structure

[Diagram](https://github.com/sanfor2004/23-Design-Patterns/blob/main/behavioral/strategy/diagram.md) · [Run the example](https://github.com/sanfor2004/23-Design-Patterns/blob/main/behavioral/strategy/cpp/README.md)

<figure>
  <img src="/images/writing/patterns/diagrams/strategy.svg" alt="Strategy diagram showing the participants and their relationships in the C++ example below." loading="lazy" decoding="async" />
  <figcaption>Strategy: the code structure. Read the participant roles below alongside the arrows. <a href="/images/writing/patterns/diagrams/strategy.svg">Open the full-size diagram</a>.</figcaption>
</figure>

```text
Checkout::total()  -->  ShippingRule  -->  standard / express lambda
```

## Participants

Checkout is the context, ShippingRule the behavioral contract, and lambdas implement standard and express fees.

Canonical roles in this example:

- [`Context`](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md#context) — The object that uses a Strategy or delegates behavior to its current State. Here: `Checkout`.
- [`Strategy interface`](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md#strategy-interface) — The contract for interchangeable algorithms used by a Context. Here: `ShippingRule`.
- [`Concrete Strategy`](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md#concrete-strategy) — A particular implementation of a Strategy interface, possibly a callable rather than a class. Here: `standard / express lambdas`.

## Modern C++20 Example

```cpp
#include <functional>
#include <iostream>
#include <stdexcept>
#include <utility>

using ShippingRule = std::function<int(int)>;
class Checkout {
    ShippingRule shipping_;
public:
    explicit Checkout(ShippingRule shipping) : shipping_(std::move(shipping)) {
        if (!shipping_) throw std::invalid_argument("Missing shipping rule");
    }
    int total(int subtotal) const {
        if (subtotal < 0) throw std::invalid_argument("Negative subtotal");
        return subtotal + shipping_(subtotal);
    }
};
int main() {
    const Checkout standard{[](int) { return 5; }};
    const Checkout express{[](int subtotal) { return subtotal >= 100 ? 0 : 15; }};
    std::cout << "Standard: " << standard.total(40) << '\n';
    std::cout << "Express: " << express.total(40) << '\n';
    std::cout << "Express large: " << express.total(120) << '\n';
}
```

## Example Output

```text
Standard: 45
Express: 55
Express large: 120
```

## When to Use

Use it when algorithms vary independently and callers need to select a policy.

### Use cases

Pricing rules, ranking functions and retry policies are appropriate design contexts.

## When NOT to Use

Avoid it for one stable algorithm or a single readable conditional that has no real extension pressure.

## Advantages

Each policy can be tested independently while total calculation stays shared.

## Trade-offs

[`std::function`](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md#stdfunction) (A type-erased wrapper that stores a callable with a chosen signature) adds [`type erasure`](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md#type-erasure) (Hiding a concrete type behind a uniform runtime interface, as std::function does for callables) and may allocate; templates or a function pointer can be better with different constraints. Validate policy results if external code can return invalid fees.

## Related Patterns

[State](/blog/design-pattern-state/) · [Template Method](/blog/design-pattern-template-method/)

## Common Confusion

State represents [`lifecycle`](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md#lifecycle) (The modeled stages and transitions of a domain entity, distinct from a C++ object's lifetime) and transitions; Strategy chooses an algorithm. Template Method customizes inherited steps rather than an injected callable.

## Terms to Remember

- `Strategy` — Supply an interchangeable algorithm to the object that needs it.
- `Context` — The object that uses a Strategy or delegates behavior to its current State. Example: `Checkout`.
- `Strategy interface` — The contract for interchangeable algorithms used by a Context. Example: `ShippingRule`.
- `Concrete Strategy` — A particular implementation of a Strategy interface, possibly a callable rather than a class. Example: `standard / express lambdas`.

## Interview Vocabulary

- [`interchangeable behavior`](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md#interchangeable-behavior) — Different behaviors that can be supplied through the same contract.
- [`encapsulate an algorithm`](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md#encapsulate-an-algorithm) — Put an algorithm behind an operation that hides its internal steps.
- [`composition over inheritance`](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md#composition-over-inheritance) — Prefer collaborating objects when they express variation more clearly than extending a class hierarchy.
- [`runtime selection`](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md#runtime-selection) — Choosing an implementation while the program is executing.
- [`loose coupling`](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md#loose-coupling) — Parts know only the small contracts needed to cooperate, limiting change propagation.

## Interview Question

How would replacing std::function with a template parameter affect [`runtime`](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md#runtime) (The period when a compiled program is executing) selection and compilation?

## Mini Challenge

Add free shipping for subtotals of at least 80 and test 79, 80 and 81.

## Run and explore the example

The complete code above comes from [behavioral/strategy/cpp/main.cpp](https://github.com/sanfor2004/23-Design-Patterns/blob/main/behavioral/strategy/cpp/main.cpp). Follow the repository's [C++20 build instructions](https://github.com/sanfor2004/23-Design-Patterns/blob/main/CPP_EXAMPLES.md) to compile it and compare the result with [expected.txt](https://github.com/sanfor2004/23-Design-Patterns/blob/main/behavioral/strategy/cpp/expected.txt). The output demonstrates this example's behavior; it does not cover every input or the challenge above.

The source example and adapted explanation are © 2026 Sanfor2004, provided under the [MIT license](/images/writing/patterns/SOURCE-LICENSE.txt). The sketchbook cover is an illustration preserved from this site's original pattern lessons.

## Continue the series

- [Overview: all 23 patterns, their categories, and how to choose](/blog/design-patterns-overview/)
- Previous: [State (Behavioral Pattern)](/blog/design-pattern-state/)
- Next: [Template Method (Behavioral Pattern)](/blog/design-pattern-template-method/)
