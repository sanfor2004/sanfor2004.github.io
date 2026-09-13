---
title: "Visitor (Behavioral Pattern)"
description: "Add operations across a stable set of element types without placing every operation on those elements."
image: "/images/writing/patterns/visitor.webp"
imageAlt: "Different inspectors visit the same set of buildings."
imageWidth: 1600
imageHeight: 900
pubDate: 2026-09-11
updatedDate: 2026-09-14
category: "Design Patterns"
tags: ["Design Patterns", "Behavioral Patterns", "Python", "C++", "Software Engineering"]
draft: false
---

[Start with the design patterns overview](/blog/design-patterns-overview/) · Part 23 of 23 · Behavioral patterns

Add operations across a stable set of element types without placing every operation on those elements. This article follows the example in my [23 Design Patterns repository](https://github.com/sanfor2004/23-Design-Patterns/blob/main/behavioral/visitor/README.md), connecting the problem, participating classes, Python and C++20 implementations, and the trade-offs that decide whether to use it.

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

[Diagram](https://github.com/sanfor2004/23-Design-Patterns/blob/main/behavioral/visitor/diagram.md) · [Python source](https://github.com/sanfor2004/23-Design-Patterns/blob/main/behavioral/visitor/python/main.py) · [C++20 source](https://github.com/sanfor2004/23-Design-Patterns/blob/main/behavioral/visitor/cpp/main.cpp)

<figure>
  <img src="/images/writing/patterns/diagrams/visitor.svg" alt="Visitor sketch map: Item::accept(visitor) leads through Visitor::visit(type) to Tax(Book) / Tax(Food)." loading="lazy" decoding="async" />
  <figcaption>Visitor: trace the example from caller through the pattern boundary to its collaborator or result. The arrows show flow, not ownership. <a href="/images/writing/patterns/diagrams/visitor.svg">Open the full-size diagram</a>.</figcaption>
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

## Python Example

The complete [Python source](https://github.com/sanfor2004/23-Design-Patterns/blob/main/behavioral/visitor/python/main.py) is shown first.

```python
class Book:
    def __init__(self, price_cents):
        self.price_cents = price_cents

    def accept(self, visitor):
        visitor.visit_book(self)


class Food:
    def __init__(self, price_cents):
        self.price_cents = price_cents

    def accept(self, visitor):
        visitor.visit_food(self)


class Tax:
    def __init__(self):
        self.total_cents = 0

    def visit_book(self, book):
        self.total_cents += book.price_cents // 10

    def visit_food(self, food):
        self.total_cents += food.price_cents // 5


def tax_cents(basket):
    tax = Tax()
    for item in basket:
        item.accept(tax)
    return tax.total_cents


if __name__ == "__main__":
    print("Tax:", tax_cents([Book(2000), Food(1000)]), "cents")
    print("Empty basket tax:", tax_cents([]), "cents")
```

## Python Output

```text
Tax: 400 cents
Empty basket tax: 0 cents
```

## Code Walkthrough

Item defines accept. Book and Food select their typed overload. Visitor lists supported types. Tax accumulates the result; the basket owns items.

Start at the final call in the Python example. Follow the middle role in the diagram and compare how the C++20 version handles the same responsibility.

## C++20 Example

```cpp
// Monetary amounts in this example are integer cents.
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
    int price_cents = 20;
    void accept(Visitor& visitor) const override { visitor.visit(*this); }
};
struct Food final : Item {
    int price_cents = 10;
    void accept(Visitor& visitor) const override { visitor.visit(*this); }
};
struct Tax final : Visitor {
    int total_cents = 0;
    void visit(const Book& book) override { total_cents += book.price_cents / 10; }
    void visit(const Food& food) override { total_cents += food.price_cents / 5; }
};
int main() {
    std::vector<std::unique_ptr<Item>> basket;
    basket.push_back(std::make_unique<Book>());
    basket.push_back(std::make_unique<Food>());
    Tax tax;
    for (const auto& item : basket) item->accept(tax);
    std::cout << "Tax: " << tax.total_cents << '\n';
}
```

## C++20 Output

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

## Compare the two versions

Python uses separate `visit_book` and `visit_food` methods because it does not overload methods by parameter type. C++ uses overloads plus virtual dispatch. Both keep Tax outside the element types. Integer division truncates fractional cents; these sample rates and amounts avoid fractions and are not a tax policy. The two examples express the same pattern responsibility; compare their setup and output before changing an input.

## Check yourself

1. What must change when you add a new item type rather than a new operation?
2. When would the naive solution on this page be easier to maintain? Give a concrete example.
3. Change one input in the Python example. Predict the output and explain which responsibility handles the change.

## Run and explore the example

The Python code comes from [python/main.py](https://github.com/sanfor2004/23-Design-Patterns/blob/main/behavioral/visitor/python/main.py), with [expected output](https://github.com/sanfor2004/23-Design-Patterns/blob/main/behavioral/visitor/python/expected.txt). The C++20 code comes from [behavioral/visitor/cpp/main.cpp](https://github.com/sanfor2004/23-Design-Patterns/blob/main/behavioral/visitor/cpp/main.cpp). Follow the repository's [C++20 build instructions](https://github.com/sanfor2004/23-Design-Patterns/blob/main/CPP_EXAMPLES.md) to compile it and compare the result with [expected.txt](https://github.com/sanfor2004/23-Design-Patterns/blob/main/behavioral/visitor/cpp/expected.txt). The output demonstrates this example's behavior; it does not cover every input or the challenge above.

The source example and adapted explanation are © 2026 Sanfor2004, provided under the [MIT license](/images/writing/patterns/SOURCE-LICENSE.txt). The sketchbook cover is an illustration preserved from this site's original pattern lessons.

## Continue the series

- [Overview: all 23 patterns, their categories, and how to choose](/blog/design-patterns-overview/)
- Previous: [Template Method (Behavioral Pattern)](/blog/design-pattern-template-method/)
