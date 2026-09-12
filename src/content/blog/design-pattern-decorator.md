---
title: "Decorator (Structural Pattern)"
description: "Add responsibilities by wrapping an object with components that share its interface."
image: "/images/writing/patterns/decorator.webp"
imageAlt: "Successive paper, ribbon, and card layers wrap the same gift."
imageWidth: 1600
imageHeight: 900
pubDate: 2026-09-11
updatedDate: 2026-09-12
category: "Design Patterns"
tags: ["Design Patterns", "Structural Patterns", "C++", "Software Engineering"]
draft: false
---

[Start with the design patterns overview](/blog/design-patterns-overview/) · Part 09 of 23 · Structural patterns

Add responsibilities by wrapping an object with components that share its interface. This article follows the example in my [23 Design Patterns repository](https://github.com/sanfor2004/23-Design-Patterns/blob/main/structural/decorator/README.md), connecting the problem, participating classes, C++20 implementation, and the trade-offs that decide whether to use it.

## The Problem

A coffee order can add milk once or several times without inventing a drink class for every combination.

## Naive Solution

```cpp
struct CoffeeWithMilk {};
struct CoffeeWithDoubleMilk {}; // another combination
```

## Why It Becomes a Problem

Separate combination classes duplicate base pricing and expand with every add-on.

## The Idea

Milk owns a Drink and delegates before adding its own description and price.

## Reading the illustration

You can wrap a plain gift with paper, then ribbon, then a card. Each layer adds something without changing the gift inside.

In the repository example, the same design idea addresses this software problem: A coffee order can add milk once or several times without inventing a drink class for every combination.

## Structure

[Diagram](https://github.com/sanfor2004/23-Design-Patterns/blob/main/structural/decorator/diagram.md) · [Run the example](https://github.com/sanfor2004/23-Design-Patterns/blob/main/structural/decorator/cpp/README.md)

<figure>
  <img src="/images/writing/patterns/diagrams/decorator.svg" alt="Decorator diagram showing the participants and their relationships in the C++ example below." loading="lazy" decoding="async" />
  <figcaption>Decorator: the code structure. Read the participant roles below alongside the arrows. <a href="/images/writing/patterns/diagrams/decorator.svg">Open the full-size diagram</a>.</figcaption>
</figure>

```text
Client  -->  Milk(Drink)  -->  Coffee or Milk
```

## Participants

Drink is the shared contract. Coffee supplies the base behavior. Milk wraps exactly one Drink. The client owns the outermost wrapper.

Canonical roles in this example:

- [`Component`](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md#component) — The common contract exposed by leaves, groups, or wrappers. Here: `Drink`.
- [`Concrete Component`](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md#concrete-component) — The basic implementation before optional wrappers are added. Here: `Coffee`.
- [`Concrete Decorator`](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md#concrete-decorator) — A wrapper that keeps the Component contract and adds a specific responsibility. Here: `Milk`.

## Modern C++20 Example

```cpp
#include <iostream>
#include <memory>
#include <stdexcept>
#include <string>
#include <utility>

struct Drink {
    virtual ~Drink() = default;
    virtual std::string description() const = 0;
    virtual int price() const = 0;
};
struct Coffee final : Drink {
    std::string description() const override { return "coffee"; }
    int price() const override { return 10; }
};
class Milk final : public Drink {
    std::unique_ptr<Drink> inner_;
public:
    explicit Milk(std::unique_ptr<Drink> inner) : inner_(std::move(inner)) {
        if (!inner_) throw std::invalid_argument("Missing drink");
    }
    std::string description() const override { return inner_->description() + " + milk"; }
    int price() const override { return inner_->price() + 2; }
};
int main() {
    std::unique_ptr<Drink> drink = std::make_unique<Coffee>();
    drink = std::make_unique<Milk>(std::move(drink));
    drink = std::make_unique<Milk>(std::move(drink));
    std::cout << drink->description() << ": " << drink->price() << '\n';
}
```

## Example Output

```text
coffee + milk + milk: 14
```

## When to Use

Use it for optional, composable behavior that preserves the wrapped contract.

### Use cases

Streams with compression or encryption layers are a technical context; order and failure handling matter.

## When NOT to Use

Avoid it when a simple list of ingredients and a sum express the entire requirement; this example intentionally illustrates the structure.

## Advantages

Add-ons combine at [`runtime`](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md#runtime) (The period when a compiled program is executing), and the base [`implementation`](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md#implementation) (The concrete code that fulfills an interface or performs an operation) stays small.

## Trade-offs

Wrapper order can change behavior. Many tiny objects complicate debugging, and preserving the interface does not automatically preserve every semantic promise.

## Related Patterns

[Proxy](/blog/design-pattern-proxy/) · [Composite](/blog/design-pattern-composite/)

## Common Confusion

Proxy controls access to an object. Decorator adds responsibilities. A wrapper's shape alone does not tell you its intent.

## Terms to Remember

- `Decorator` — Add behavior by wrapping an object in another object with the same interface.
- `Component` — The common contract exposed by leaves, groups, or wrappers. Example: `Drink`.
- `Concrete Component` — The basic implementation before optional wrappers are added. Example: `Coffee`.
- `Concrete Decorator` — A wrapper that keeps the Component contract and adds a specific responsibility. Example: `Milk`.

## Interview Vocabulary

- [`composition over inheritance`](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md#composition-over-inheritance) — Prefer collaborating objects when they express variation more clearly than extending a class hierarchy.
- [`recursive composition`](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md#recursive-composition) — Building a structure from parts that expose the same contract as the whole.
- [`single responsibility`](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md#single-responsibility) — Keep a module focused on one coherent reason to change.

## Interview Question

Would logging before encryption observe the same data as logging after encryption?

## Mini Challenge

Add a Syrup decorator costing 3, wrap it in two different orders, and explain the resulting descriptions.

## Run and explore the example

The complete code above comes from [structural/decorator/cpp/main.cpp](https://github.com/sanfor2004/23-Design-Patterns/blob/main/structural/decorator/cpp/main.cpp). Follow the repository's [C++20 build instructions](https://github.com/sanfor2004/23-Design-Patterns/blob/main/CPP_EXAMPLES.md) to compile it and compare the result with [expected.txt](https://github.com/sanfor2004/23-Design-Patterns/blob/main/structural/decorator/cpp/expected.txt). The output demonstrates this example's behavior; it does not cover every input or the challenge above.

The source example and adapted explanation are © 2026 Sanfor2004, provided under the [MIT license](/images/writing/patterns/SOURCE-LICENSE.txt). The sketchbook cover is an illustration preserved from this site's original pattern lessons.

## Continue the series

- [Overview: all 23 patterns, their categories, and how to choose](/blog/design-patterns-overview/)
- Previous: [Composite (Structural Pattern)](/blog/design-pattern-composite/)
- Next: [Facade (Structural Pattern)](/blog/design-pattern-facade/)
