---
title: "Prototype (Creational Pattern)"
description: "Create new objects by copying an existing configured prototype."
image: "/images/writing/patterns/prototype.webp"
imageAlt: "A robot design on a drawing board is copied into separate sheets with customized robots."
imageWidth: 1600
imageHeight: 900
pubDate: 2026-09-11
updatedDate: 2026-09-12
category: "Design Patterns"
tags: ["Design Patterns", "Creational Patterns", "C++", "Software Engineering"]
draft: false
---

[Start with the design patterns overview](/blog/design-patterns-overview/) · Part 04 of 23 · Creational patterns

Create new objects by copying an existing configured prototype. This article follows the example in my [23 Design Patterns repository](https://github.com/sanfor2004/23-Design-Patterns/blob/main/creational/prototype/README.md), connecting the problem, participating classes, C++20 implementation, and the trade-offs that decide whether to use it.

## The Problem

A game needs several enemies based on a configured template whose concrete type the spawning code does not know.

## Naive Solution

```cpp
Guard another;
another.rename("gate guard"); // must repeat any custom setup
```

## Why It Becomes a Problem

Reconstructing a default Guard repeats setup and loses any custom equipment on the template.

## The Idea

Expose clone on Enemy. Guard copies its value members and returns a [`std::unique_ptr`](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md#stdunique_ptr) (A smart pointer with exclusive ownership that releases its object when the owner is destroyed) to an independent object.

## Reading the illustration

Instead of drawing a form from scratch, photocopy a prepared master and then change only the fields you need.

In the repository example, the same design idea addresses this software problem: A game needs several enemies based on a configured template whose concrete type the spawning code does not know.

## Structure

[Diagram](https://github.com/sanfor2004/23-Design-Patterns/blob/main/creational/prototype/diagram.md) · [Run the example](https://github.com/sanfor2004/23-Design-Patterns/blob/main/creational/prototype/cpp/README.md)

<figure>
  <img src="/images/writing/patterns/diagrams/prototype.svg" alt="Prototype diagram showing the participants and their relationships in the C++ example below." loading="lazy" decoding="async" />
  <figcaption>Prototype: the code structure. Read the participant roles below alongside the arrows. <a href="/images/writing/patterns/diagrams/prototype.svg">Open the full-size diagram</a>.</figcaption>
</figure>

```text
Client  -->  Enemy::clone()  -->  independent Guard
```

## Participants

Enemy defines polymorphic cloning; Guard implements the copy; the client owns the clone and changes its name.

Canonical roles in this example:

- [`Concrete Prototype`](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md#concrete-prototype) — An object whose clone operation produces another object from its configured values. Here: `Guard`.
- [`deep copy`](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md#deep-copy) — Copying owned nested data so the new object does not share that mutable data with the original. Here: `Guard::clone`.
- [`value semantics`](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md#value-semantics) — Copies behave as independent values according to the type's contract. Here: `name_, equipment_`.

## Modern C++20 Example

```cpp
#include <iostream>
#include <memory>
#include <string>
#include <utility>
#include <vector>

struct Enemy {
    virtual ~Enemy() = default;
    virtual std::unique_ptr<Enemy> clone() const = 0;
    virtual void rename(std::string name) = 0;
    virtual void describe() const = 0;
};
class Guard final : public Enemy {
    std::string name_ = "template";
    std::vector<std::string> equipment_{"shield", "spear"};
public:
    std::unique_ptr<Enemy> clone() const override { return std::make_unique<Guard>(*this); }
    void rename(std::string name) override { name_ = std::move(name); }
    void describe() const override {
        std::cout << name_ << ": " << equipment_.size() << " items\n";
    }
};
int main() {
    const Guard prototype;
    auto copy = prototype.clone();
    copy->rename("gate guard");
    prototype.describe();
    copy->describe();
}
```

## Example Output

```text
template: 2 items
gate guard: 2 items
```

## When to Use

Use it when [`runtime`](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md#runtime) (The period when a compiled program is executing) objects carry useful configuration and clients should not reconstruct their concrete types.

### Use cases

Game entity templates and editable document presets fit; this example copies a string and std::vector with value semantics.

## When NOT to Use

Avoid it when ordinary value copying already expresses the requirement clearly.

## Advantages

Configured state can be reused without exposing each construction step to the client.

## Trade-offs

Pointers require a deliberate deep-versus-shared-copy policy. Copying live sockets or unique external resources may be impossible or misleading.

## Related Patterns

[Abstract Factory](/blog/design-pattern-abstract-factory/) · [Memento](/blog/design-pattern-memento/)

## Common Confusion

Memento restores a previous state of an object. Prototype creates another object; a copy constructor alone does not provide polymorphic cloning.

## Terms to Remember

- `Prototype` — Create an independent object by cloning an existing configured object.
- `Concrete Prototype` — An object whose clone operation produces another object from its configured values. Example: `Guard`.
- `deep copy` — Copying owned nested data so the new object does not share that mutable data with the original. Example: `Guard::clone`.
- `value semantics` — Copies behave as independent values according to the type's contract. Example: `name_, equipment_`.

## Interview Vocabulary

- [`object creation`](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md#object-creation) — Choosing a concrete type and establishing an object's initial values and lifetime.
- [`polymorphism`](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md#polymorphism) — Using one interface with different implementations; C++ supports runtime and compile-time forms.
- [`ownership`](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md#ownership) — Responsibility for keeping a resource alive and eventually releasing it.

## Interview Question

If equipment becomes `std::vector<std::shared_ptr<Item>>`, will clone still be independent? Explain the aliasing.

## Mini Challenge

Add editable equipment and verify that changing the clone's equipment leaves the prototype unchanged.

## Run and explore the example

The complete code above comes from [creational/prototype/cpp/main.cpp](https://github.com/sanfor2004/23-Design-Patterns/blob/main/creational/prototype/cpp/main.cpp). Follow the repository's [C++20 build instructions](https://github.com/sanfor2004/23-Design-Patterns/blob/main/CPP_EXAMPLES.md) to compile it and compare the result with [expected.txt](https://github.com/sanfor2004/23-Design-Patterns/blob/main/creational/prototype/cpp/expected.txt). The output demonstrates this example's behavior; it does not cover every input or the challenge above.

The source example and adapted explanation are © 2026 Sanfor2004, provided under the [MIT license](/images/writing/patterns/SOURCE-LICENSE.txt). The sketchbook cover is an illustration preserved from this site's original pattern lessons.

## Continue the series

- [Overview: all 23 patterns, their categories, and how to choose](/blog/design-patterns-overview/)
- Previous: [Factory Method (Creational Pattern)](/blog/design-pattern-factory-method/)
- Next: [Singleton (Creational Pattern)](/blog/design-pattern-singleton/)
