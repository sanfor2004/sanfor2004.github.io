---
title: "Facade (Structural Pattern)"
description: "Offer a focused entry point to a complex subsystem without removing lower-level access."
image: "/images/writing/patterns/facade.webp"
imageAlt: "A hotel reception desk coordinates services from several departments."
imageWidth: 1600
imageHeight: 900
pubDate: 2026-09-11
updatedDate: 2026-09-14
category: "Design Patterns"
tags: ["Design Patterns", "Structural Patterns", "Python", "C++", "Software Engineering"]
draft: false
---

[Start with the design patterns overview](/blog/design-patterns-overview/) · Part 10 of 23 · Structural patterns

Offer a focused entry point to a complex subsystem without removing lower-level access. This article follows the example in my [23 Design Patterns repository](https://github.com/sanfor2004/23-Design-Patterns/blob/main/structural/facade/README.md), connecting the problem, participating classes, Python and C++20 implementations, and the trade-offs that decide whether to use it.

## The Problem

Every checkout caller must check stock, charge payment and request shipping in the right order.

## Naive Solution

```cpp
payment.charge(20);
shipping.dispatch(); // caller forgot to check stock
```

## Why It Becomes a Problem

Direct calls let callers forget stock checks or duplicate orchestration inconsistently.

## The Idea

Checkout exposes buy and coordinates its internal services behind that operation.

## Reading the illustration

A hotel reception desk gives you one place to request a room, luggage help, and checkout instead of sending you through every internal department.

In the repository example, the same design idea addresses this software problem: Every checkout caller must check stock, charge payment and request shipping in the right order.

## Structure

[Diagram](https://github.com/sanfor2004/23-Design-Patterns/blob/main/structural/facade/diagram.md) · [Python source](https://github.com/sanfor2004/23-Design-Patterns/blob/main/structural/facade/python/main.py) · [C++20 source](https://github.com/sanfor2004/23-Design-Patterns/blob/main/structural/facade/cpp/main.cpp)

<figure>
  <img src="/images/writing/patterns/diagrams/facade.svg" alt="Facade sketch map: Client leads through Checkout::buy() to Stock / Payment / Shipping." loading="lazy" decoding="async" />
  <figcaption>Facade: trace the example from caller through the pattern boundary to its collaborator or result. The arrows show flow, not ownership. <a href="/images/writing/patterns/diagrams/facade.svg">Open the full-size diagram</a>.</figcaption>
</figure>

```text
Client  -->  Checkout::buy()  -->  Stock / Payment / Shipping
```

## Participants

Stock checks availability, Payment charges, Shipping dispatches, and Checkout presents the common workflow.

Canonical roles in this example:

- [`subsystem`](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md#subsystem) — A group of cooperating services or objects within a larger system. Here: `Stock, Payment, Shipping`.
- [`interface`](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md#interface) — The contract of operations and observable behavior offered to a caller. Here: `Checkout::buy`.
- [`Client`](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md#client-pattern-role) — Code that uses an interface or collaborates with a pattern's objects. Here: `main`.

## Python Example

The complete [Python source](https://github.com/sanfor2004/23-Design-Patterns/blob/main/structural/facade/python/main.py) is shown first.

```python
class Stock:
    def available(self, quantity):
        return 0 < quantity <= 3


class Payment:
    def charge(self, amount_cents):
        print("Charged", amount_cents, "cents")


class Shipping:
    def dispatch(self):
        print("Dispatched")


class Checkout:
    def __init__(self):
        self.stock = Stock()
        self.payment = Payment()
        self.shipping = Shipping()

    def buy(self, quantity):
        if not self.stock.available(quantity):
            return False
        self.payment.charge(quantity * 1000)
        self.shipping.dispatch()
        return True


if __name__ == "__main__":
    checkout = Checkout()
    checkout.buy(2)
    if not checkout.buy(4):
        print("Unavailable")
    if not checkout.buy(0):
        print("Invalid quantity")
```

## Python Output

```text
Charged 2000 cents
Dispatched
Unavailable
Invalid quantity
```

## Code Walkthrough

Stock checks availability, Payment charges, Shipping dispatches, and Checkout presents the common workflow.

Start at the final call in the Python example. Follow the middle role in the diagram and compare how the C++20 version handles the same responsibility.

## C++20 Example

```cpp
// Monetary amounts in this example are integer cents.
#include <iostream>

struct Stock {
    bool available(int quantity) const { return quantity > 0 && quantity <= 3; }
};
struct Payment {
    void charge(int amount_cents) const { std::cout << "Charged " << amount_cents << '\n'; }
};
struct Shipping {
    void dispatch() const { std::cout << "Dispatched\n"; }
};
class Checkout {
    Stock stock_;
    Payment payment_;
    Shipping shipping_;
public:
    bool buy(int quantity) const {
        if (!stock_.available(quantity)) return false;
        payment_.charge(quantity * 10);
        shipping_.dispatch();
        return true;
    }
};
int main() {
    const Checkout checkout{};
    if (!checkout.buy(2)) return 1;
    if (!checkout.buy(4)) std::cout << "Unavailable\n";
}
```

## C++20 Output

```text
Charged 20
Dispatched
Unavailable
```

## When to Use

Use it when many callers need the same useful subset of a complicated subsystem.

### Use cases

SDK entry points and application service boundaries fit; the example has no real payment integration.

## When NOT to Use

Avoid it for a trivial pass-through that adds no meaningful simplification.

## Advantages

Callers depend on a smaller interface and a shared ordering rule.

## Trade-offs

The facade can grow into a god object. This example is not transactional: real payment and shipping failures require compensation or another consistency strategy.

## Related Patterns

[Adapter](/blog/design-pattern-adapter/) · [Mediator](/blog/design-pattern-mediator/)

## Common Confusion

Adapter changes compatibility. Facade reduces the surface area of a subsystem and need not implement an existing interface.

## Terms to Remember

- `Facade` — Offer a small entry point to a subsystem's common workflow.
- `subsystem` — A group of cooperating services or objects within a larger system. Example: `Stock, Payment, Shipping`.
- `interface` — The contract of operations and observable behavior offered to a caller. Example: `Checkout::buy`.
- `Client` — Code that uses an interface or collaborates with a pattern's objects. Example: `main`.

## Interview Vocabulary

- [`separation of concerns`](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md#separation-of-concerns) — Keeping distinct kinds of responsibility apart so they can change independently.
- [`loose coupling`](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md#loose-coupling) — Parts know only the small contracts needed to cooperate, limiting change propagation.
- [`trade-off`](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md#trade-off) — A benefit gained at the cost of another desirable property.

## Interview Question

If charging succeeds but shipping fails, what guarantee can buy honestly provide?

## Mini Challenge

Add a simulated shipping failure and design an explicit refund result rather than silently returning success.

## Compare the two versions

Both versions put the same small workflow behind `buy`. C++ stores service Objects by value; Python holds references. Neither example implements a transaction: a real shipping failure after payment needs an explicit recovery policy. The two examples express the same pattern responsibility; compare their setup and output before changing an input.

## Check yourself

1. What does buy fail to guarantee if shipping fails after payment?
2. When would the naive solution on this page be easier to maintain? Give a concrete example.
3. Change one input in the Python example. Predict the output and explain which responsibility handles the change.

## Run and explore the example

The Python code comes from [python/main.py](https://github.com/sanfor2004/23-Design-Patterns/blob/main/structural/facade/python/main.py), with [expected output](https://github.com/sanfor2004/23-Design-Patterns/blob/main/structural/facade/python/expected.txt). The C++20 code comes from [structural/facade/cpp/main.cpp](https://github.com/sanfor2004/23-Design-Patterns/blob/main/structural/facade/cpp/main.cpp). Follow the repository's [C++20 build instructions](https://github.com/sanfor2004/23-Design-Patterns/blob/main/CPP_EXAMPLES.md) to compile it and compare the result with [expected.txt](https://github.com/sanfor2004/23-Design-Patterns/blob/main/structural/facade/cpp/expected.txt). The output demonstrates this example's behavior; it does not cover every input or the challenge above.

The source example and adapted explanation are © 2026 Sanfor2004, provided under the [MIT license](/images/writing/patterns/SOURCE-LICENSE.txt). The sketchbook cover is an illustration preserved from this site's original pattern lessons.

## Continue the series

- [Overview: all 23 patterns, their categories, and how to choose](/blog/design-patterns-overview/)
- Previous: [Decorator (Structural Pattern)](/blog/design-pattern-decorator/)
- Next: [Flyweight (Structural Pattern)](/blog/design-pattern-flyweight/)
