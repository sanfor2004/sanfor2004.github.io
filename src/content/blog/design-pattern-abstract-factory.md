---
title: "Abstract Factory (Creational Pattern)"
description: "Create compatible families of objects without coupling the client to concrete classes."
image: "/images/writing/patterns/abstract-factory.webp"
imageAlt: "A furniture workshop assembles matching chairs, tables, and cabinets as one coordinated family."
imageWidth: 1600
imageHeight: 900
pubDate: 2026-09-11
updatedDate: 2026-09-12
category: "Design Patterns"
tags: ["Design Patterns", "Creational Patterns", "C++", "Software Engineering"]
draft: false
---

[Start with the design patterns overview](/blog/design-patterns-overview/) · Part 01 of 23 · Creational patterns

Create compatible families of objects without coupling the client to concrete classes. This article follows the example in my [23 Design Patterns repository](https://github.com/sanfor2004/23-Design-Patterns/blob/main/creational/abstract-factory/README.md), connecting the problem, participating classes, C++20 implementation, and the trade-offs that decide whether to use it.

## The Problem

A settings screen needs buttons and panels that belong to the same theme.

## Naive Solution

```cpp
auto button = DarkButton{};
auto panel = LightPanel{}; // mixed theme
```

## Why It Becomes a Problem

Constructing each widget directly lets a dark button accidentally sit inside a light panel. Every client must remember the matching rules.

## The Idea

Pass one Theme to render. The chosen factory supplies both products, so the client never names concrete widget classes.

## Reading the illustration

Think of ordering a matching furniture set. You choose the style once, then the workshop supplies a chair, table, and cabinet designed to belong together.

In the repository example, the same design idea addresses this software problem: A settings screen needs buttons and panels that belong to the same theme.

## Structure

[Diagram](https://github.com/sanfor2004/23-Design-Patterns/blob/main/creational/abstract-factory/diagram.md) · [Run the example](https://github.com/sanfor2004/23-Design-Patterns/blob/main/creational/abstract-factory/cpp/README.md)

<figure>
  <img src="/images/writing/patterns/diagrams/abstract-factory.svg" alt="Abstract Factory diagram showing the participants and their relationships in the C++ example below." loading="lazy" decoding="async" />
  <figcaption>Abstract Factory: the code structure. Read the participant roles below alongside the arrows. <a href="/images/writing/patterns/diagrams/abstract-factory.svg">Open the full-size diagram</a>.</figcaption>
</figure>

```text
render()  -->  Theme  -->  Button + Panel
```

## Participants

Theme defines the family; DarkTheme and LightTheme create it. Button and Panel define product interfaces. render consumes those interfaces.

Canonical roles in this example:

- [`Product`](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md#product) — The contract of an object returned by creation code. Here: `Button, Panel`.
- [`Concrete Product`](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md#concrete-product) — A particular implementation of a Product contract. Here: `DarkButton, LightButton, DarkPanel, LightPanel`.
- [`Concrete Factory`](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md#concrete-factory) — An implementation that creates one matching Product family. Here: `DarkTheme, LightTheme`.

## Modern C++20 Example

```cpp
#include <iostream>
#include <memory>
#include <string_view>

struct Button {
    virtual ~Button() = default;
    virtual std::string_view paint() const = 0;
};
struct Panel {
    virtual ~Panel() = default;
    virtual std::string_view paint() const = 0;
};
struct DarkButton final : Button {
    std::string_view paint() const override { return "dark button"; }
};
struct DarkPanel final : Panel {
    std::string_view paint() const override { return "dark panel"; }
};
struct LightButton final : Button {
    std::string_view paint() const override { return "light button"; }
};
struct LightPanel final : Panel {
    std::string_view paint() const override { return "light panel"; }
};
struct Theme {
    virtual ~Theme() = default;
    virtual std::unique_ptr<Button> button() const = 0;
    virtual std::unique_ptr<Panel> panel() const = 0;
};
struct DarkTheme final : Theme {
    std::unique_ptr<Button> button() const override { return std::make_unique<DarkButton>(); }
    std::unique_ptr<Panel> panel() const override { return std::make_unique<DarkPanel>(); }
};
struct LightTheme final : Theme {
    std::unique_ptr<Button> button() const override { return std::make_unique<LightButton>(); }
    std::unique_ptr<Panel> panel() const override { return std::make_unique<LightPanel>(); }
};
void render(const Theme& theme) {
    const auto button = theme.button();
    const auto panel = theme.panel();
    std::cout << button->paint() << " + " << panel->paint() << '\n';
}
int main() {
    render(DarkTheme{});
    render(LightTheme{});
}
```

## Example Output

```text
dark button + dark panel
light button + light panel
```

## When to Use

Use it when several product types must vary together and clients should not choose concrete classes.

### Use cases

Theme kits and interchangeable database driver families are useful design contexts; this example only renders names.

## When NOT to Use

Avoid it for one stable product type or when independent choices are actually desirable.

## Advantages

The client can switch whole families without changing its rendering workflow.

## Trade-offs

Adding a new product type, such as Slider, requires changing every factory. The interface cannot alone prove that an [`implementation`](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md#implementation) (The concrete code that fulfills an interface or performs an operation) returns a visually consistent family.

## Related Patterns

[Factory Method](/blog/design-pattern-factory-method/) · [Builder](/blog/design-pattern-builder/)

## Common Confusion

Factory Method varies a creation step. Abstract Factory coordinates multiple related product types; a concrete factory can implement its operations with factory methods.

## Terms to Remember

- `Abstract Factory` — Create related objects through one family interface.
- `Product` — The contract of an object returned by creation code. Example: `Button, Panel`.
- `Concrete Product` — A particular implementation of a Product contract. Example: `DarkButton, LightButton, DarkPanel, LightPanel`.
- `Concrete Factory` — An implementation that creates one matching Product family. Example: `DarkTheme, LightTheme`.

## Interview Vocabulary

- [`object creation`](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md#object-creation) — Choosing a concrete type and establishing an object's initial values and lifetime.
- [`program to an interface, not an implementation`](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md#program-to-an-interface-not-an-implementation) — Depend on the promised contract instead of a particular concrete implementation.
- [`encapsulate what varies`](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md#encapsulate-what-varies) — Put a changing design decision behind a stable boundary.

## Interview Question

What changes when you add a new theme versus a new widget type? Trace every interface affected.

## Mini Challenge

Add a high-contrast family. Then add a Slider product and compare the number of files or classes affected.

## Run and explore the example

The complete code above comes from [creational/abstract-factory/cpp/main.cpp](https://github.com/sanfor2004/23-Design-Patterns/blob/main/creational/abstract-factory/cpp/main.cpp). Follow the repository's [C++20 build instructions](https://github.com/sanfor2004/23-Design-Patterns/blob/main/CPP_EXAMPLES.md) to compile it and compare the result with [expected.txt](https://github.com/sanfor2004/23-Design-Patterns/blob/main/creational/abstract-factory/cpp/expected.txt). The output demonstrates this example's behavior; it does not cover every input or the challenge above.

The source example and adapted explanation are © 2026 Sanfor2004, provided under the [MIT license](/images/writing/patterns/SOURCE-LICENSE.txt). The sketchbook cover is an illustration preserved from this site's original pattern lessons.

## Continue the series

- [Overview: all 23 patterns, their categories, and how to choose](/blog/design-patterns-overview/)
- Next: [Builder (Creational Pattern)](/blog/design-pattern-builder/)
