---
title: "Strategy (Behavioral Pattern)"
description: "Package interchangeable algorithms behind one interface and choose among them by composition."
image: "/images/writing/patterns/strategy.webp"
imageAlt: "A traveler chooses between alternative routes to a destination."
imageWidth: 1600
imageHeight: 900
pubDate: 2026-09-11
updatedDate: 2026-09-14
category: "Design Patterns"
tags: ["Design Patterns", "Behavioral Patterns", "Python", "C++", "Software Engineering"]
draft: false
---

[Start with the design patterns overview](/blog/design-patterns-overview/) · Part 21 of 23 · Behavioral patterns

Package interchangeable algorithms behind one interface and choose among them by composition. This article follows the example in my [23 Design Patterns repository](https://github.com/sanfor2004/23-Design-Patterns/blob/main/behavioral/strategy/README.md), connecting the problem, participating classes, Python and C++20 implementations, and the trade-offs that decide whether to use it.

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

[Diagram](https://github.com/sanfor2004/23-Design-Patterns/blob/main/behavioral/strategy/diagram.md) · [Python source](https://github.com/sanfor2004/23-Design-Patterns/blob/main/behavioral/strategy/python/main.py) · [C++20 source](https://github.com/sanfor2004/23-Design-Patterns/blob/main/behavioral/strategy/cpp/main.cpp)

<figure>
  <img src="/images/writing/patterns/diagrams/strategy.svg" alt="Strategy sketch map: Checkout::total() leads through ShippingRule to standard / express lambda." loading="lazy" decoding="async" />
  <figcaption>Strategy: trace the example from caller through the pattern boundary to its collaborator or result. The arrows show flow, not ownership. <a href="/images/writing/patterns/diagrams/strategy.svg">Open the full-size diagram</a>.</figcaption>
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

## Python Example

The complete [Python source](https://github.com/sanfor2004/23-Design-Patterns/blob/main/behavioral/strategy/python/main.py) is shown first.

```python
class Checkout:
    def __init__(self, shipping_rule):
        self.shipping_rule = shipping_rule

    def total(self, subtotal_cents):
        if subtotal_cents < 0:
            raise ValueError("Negative subtotal")
        return subtotal_cents + self.shipping_rule(subtotal_cents)


def standard(subtotal_cents):
    return 500


def express(subtotal_cents):
    return 0 if subtotal_cents >= 10000 else 1500


def main():
    print("Standard:", Checkout(standard).total(4000))
    print("Express:", Checkout(express).total(4000))
    print("Express boundary:", Checkout(express).total(10000))
    try:
        Checkout(standard).total(-1)
    except ValueError:
        print("Negative subtotal rejected")


if __name__ == "__main__":
    main()
```

## Python Output

```text
Standard: 4500
Express: 5500
Express boundary: 10000
Negative subtotal rejected
```

## Code Walkthrough

Checkout is the context, ShippingRule the behavioral contract, and lambdas implement standard and express fees.

Start at the final call in the Python example. Follow the middle role in the diagram and compare how the C++20 version handles the same responsibility.

## C++20 Example

```cpp
// Monetary amounts in this example are integer cents.
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
    int total(int subtotal_cents) const {
        if (subtotal_cents < 0) throw std::invalid_argument("Negative subtotal");
        return subtotal_cents + shipping_(subtotal_cents);
    }
};
int main() {
    const Checkout standard{[](int) { return 5; }};
    const Checkout express{[](int subtotal_cents) { return subtotal_cents >= 100 ? 0 : 15; }};
    std::cout << "Standard: " << standard.total(40) << '\n';
    std::cout << "Express: " << express.total(40) << '\n';
    std::cout << "Express large: " << express.total(120) << '\n';
    std::cout << "Express boundary: " << express.total(100) << '\n';
    try { static_cast<void>(standard.total(-1)); }
    catch (const std::invalid_argument&) { std::cout << "Negative subtotal rejected\n"; }
    try { const Checkout missing{ShippingRule{}}; }
    catch (const std::invalid_argument&) { std::cout << "Missing rule rejected\n"; }
}
```

## C++20 Output

```text
Standard: 45
Express: 55
Express large: 120
Express boundary: 100
Negative subtotal rejected
Missing rule rejected
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

## Compare the two versions

A Python function is the Concrete Strategy. C++ stores the same kind of callable in `std::function`; a template policy can instead select it at Compile time. Both examples choose the rule when constructing Checkout. Amounts are integer cents. The two examples express the same pattern responsibility; compare their setup and output before changing an input.

## Check yourself

1. Can this Checkout change its rule after construction through its public API?
2. When would the naive solution on this page be easier to maintain? Give a concrete example.
3. Change one input in the Python example. Predict the output and explain which responsibility handles the change.

## Run and explore the example

The Python code comes from [python/main.py](https://github.com/sanfor2004/23-Design-Patterns/blob/main/behavioral/strategy/python/main.py), with [expected output](https://github.com/sanfor2004/23-Design-Patterns/blob/main/behavioral/strategy/python/expected.txt). The C++20 code comes from [behavioral/strategy/cpp/main.cpp](https://github.com/sanfor2004/23-Design-Patterns/blob/main/behavioral/strategy/cpp/main.cpp). Follow the repository's [C++20 build instructions](https://github.com/sanfor2004/23-Design-Patterns/blob/main/CPP_EXAMPLES.md) to compile it and compare the result with [expected.txt](https://github.com/sanfor2004/23-Design-Patterns/blob/main/behavioral/strategy/cpp/expected.txt). The output demonstrates this example's behavior; it does not cover every input or the challenge above.

The source example and adapted explanation are © 2026 Sanfor2004, provided under the [MIT license](/images/writing/patterns/SOURCE-LICENSE.txt). The sketchbook cover is an illustration preserved from this site's original pattern lessons.

## Continue the series

- [Overview: all 23 patterns, their categories, and how to choose](/blog/design-patterns-overview/)
- Previous: [State (Behavioral Pattern)](/blog/design-pattern-state/)
- Next: [Template Method (Behavioral Pattern)](/blog/design-pattern-template-method/)
