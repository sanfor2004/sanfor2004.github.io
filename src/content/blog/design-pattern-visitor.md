---
title: "Visitor (Behavioral Pattern)"
description: "Add operations across a stable set of element types without placing every operation on those elements."
image: "/images/writing/patterns/visitor.webp"
imageAlt: "Different inspectors visit the same set of buildings."
imageWidth: 1600
imageHeight: 900
pubDate: 2026-09-11
updatedDate: 2026-09-12
category: "Design Patterns"
tags: ["Design Patterns", "Behavioral Patterns", "C++", "Software Engineering"]
draft: false
---

[Start with the design patterns overview](/blog/design-patterns-overview/) · Part 23 of 23 · Behavioral patterns

Add operations across a stable set of element types without placing every operation on those elements. This article follows the example in my [23 Design Patterns repository](https://github.com/sanfor2004/23-Design-Patterns/blob/main/behavioral/visitor/README.md), connecting the problem, participating classes, C++20 implementation, and the trade-offs that decide whether to use it.

## The Problem

A basket contains books and food, and new operations such as tax or export should not fill every item class.

## Naive Solution

```cpp
// For each new operation, add another virtual method to every Item.
// tax(), export_json(), print_label(), ...
```

## Why It Becomes a Problem

Adding every operation as another virtual Item method requires editing all item classes for each new task.

## The Idea

Each concrete Item calls the matching Visitor::visit overload from accept; Tax implements the operation for each type.

## Reading the illustration

Different inspectors visit the same buildings. A safety inspector and tax assessor perform different work based on the building type without rebuilding it.

In the repository example, the same design idea addresses this software problem: A basket contains books and food, and new operations such as tax or export should not fill every item class.

## Structure

[Diagram](https://github.com/sanfor2004/23-Design-Patterns/blob/main/behavioral/visitor/diagram.md) · [Run the example](https://github.com/sanfor2004/23-Design-Patterns/blob/main/behavioral/visitor/cpp/README.md)

<figure>
  <img src="/images/writing/patterns/diagrams/visitor.svg" alt="Visitor diagram showing the participants and their relationships in the C++ example below." loading="lazy" decoding="async" />
  <figcaption>Visitor: the code structure. Read the participant roles below alongside the arrows. <a href="/images/writing/patterns/diagrams/visitor.svg">Open the full-size diagram</a>.</figcaption>
</figure>

```text
Item::accept(visitor)  -->  Visitor::visit(type)  -->  Tax(Book) / Tax(Food)
```

## Participants

Item defines accept. Book and Food select their typed overload. Visitor lists supported types. Tax accumulates the result; the basket owns items.

Canonical roles in this example:

- [`Element`](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md#element) — The contract for objects that accept a Visitor. Here: `Item`.
- [`Concrete Element`](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md#concrete-element) — An Element implementation that selects its matching Visitor overload. Here: `Book, Food`.
- [`Concrete Visitor`](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md#concrete-visitor) — A Visitor implementation containing one operation for every supported Element type. Here: `Tax`.

## Modern C++20 Example

```cpp
#include <iostream>
#include <memory>
#include <vector>

struct Book;
struct Food;
struct Visitor {
    virtual ~Visitor() = default;
    virtual void visit(const Book& book) = 0;
    virtual void visit(const Food& food) = 0;
};
struct Item {
    virtual ~Item() = default;
    virtual void accept(Visitor& visitor) const = 0;
};
struct Book final : Item {
    int price = 20;
    void accept(Visitor& visitor) const override { visitor.visit(*this); }
};
struct Food final : Item {
    int price = 10;
    void accept(Visitor& visitor) const override { visitor.visit(*this); }
};
struct Tax final : Visitor {
    int total = 0;
    void visit(const Book& book) override { total += book.price / 10; }
    void visit(const Food& food) override { total += food.price / 5; }
};
int main() {
    std::vector<std::unique_ptr<Item>> basket;
    basket.push_back(std::make_unique<Book>());
    basket.push_back(std::make_unique<Food>());
    Tax tax;
    for (const auto& item : basket) item->accept(tax);
    std::cout << "Tax: " << tax.total << '\n';
}
```

## Example Output

```text
Tax: 4
```

## When to Use

Use it when element types are stable but new operations are frequent.

### Use cases

AST analyses and document exports fit a stable node family; std::variant with std::visit is another option for closed type sets.

## When NOT to Use

Avoid it when new element types are frequent or exposing their details would break [`encapsulation`](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md#encapsulation) (Keeping representation and invariants behind controlled operations).

## Advantages

A new operation can be added in a visitor without changing existing element classes.

## Trade-offs

Adding an element type requires updating the Visitor [`interface`](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md#interface) (The contract of operations and observable behavior offered to a caller) and all visitors. Integer tax rates here are illustrative, not real tax rules; rounding needs a domain policy.

## Related Patterns

[Composite](/blog/design-pattern-composite/) · [Iterator](/blog/design-pattern-iterator/)

## Common Confusion

Iterator traverses a collection; Visitor dispatches an operation by element type. Composite can supply the tree on which visitors work.

## Terms to Remember

- `Visitor` — Add operations across a stable set of element types using a separate visitor.
- `Element` — The contract for objects that accept a Visitor. Example: `Item`.
- `Concrete Element` — An Element implementation that selects its matching Visitor overload. Example: `Book, Food`.
- `Concrete Visitor` — A Visitor implementation containing one operation for every supported Element type. Example: `Tax`.

## Interview Vocabulary

- [`double dispatch`](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md#double-dispatch) — Selecting behavior using two runtime types; classic Visitor combines two virtual calls with overload resolution.
- [`overload resolution`](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md#overload-resolution) — Compile-time selection among functions with the same name using the argument types.
- [`Open/Closed Principle`](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md#openclosed-principle) — Aim for open for extension, closed for modification at a useful, chosen boundary.

## Interview Question

Why does visitor.visit(*this) inside Book select the Book overload, while an Item reference alone would not?

## Mini Challenge

Add a Label visitor without modifying Book or Food, then add a third item type and count the changes.

## Run and explore the example

The complete code above comes from [behavioral/visitor/cpp/main.cpp](https://github.com/sanfor2004/23-Design-Patterns/blob/main/behavioral/visitor/cpp/main.cpp). Follow the repository's [C++20 build instructions](https://github.com/sanfor2004/23-Design-Patterns/blob/main/CPP_EXAMPLES.md) to compile it and compare the result with [expected.txt](https://github.com/sanfor2004/23-Design-Patterns/blob/main/behavioral/visitor/cpp/expected.txt). The output demonstrates this example's behavior; it does not cover every input or the challenge above.

The source example and adapted explanation are © 2026 Sanfor2004, provided under the [MIT license](/images/writing/patterns/SOURCE-LICENSE.txt). The sketchbook cover is an illustration preserved from this site's original pattern lessons.

## Continue the series

- [Overview: all 23 patterns, their categories, and how to choose](/blog/design-patterns-overview/)
- Previous: [Template Method (Behavioral Pattern)](/blog/design-pattern-template-method/)
