---
title: "Composite (Structural Pattern)"
description: "Treat individual objects and nested groups through the same component interface."
image: "/images/writing/patterns/composite.webp"
imageAlt: "Shipping boxes contain smaller boxes and individual items in a nested structure."
imageWidth: 1600
imageHeight: 900
pubDate: 2026-09-11
updatedDate: 2026-09-12
category: "Design Patterns"
tags: ["Design Patterns", "Structural Patterns", "C++", "Software Engineering"]
draft: false
---

[Start with the design patterns overview](/blog/design-patterns-overview/) · Part 08 of 23 · Structural patterns

Treat individual objects and nested groups through the same component interface. This article follows the example in my [23 Design Patterns repository](https://github.com/sanfor2004/23-Design-Patterns/blob/main/structural/composite/README.md), connecting the problem, participating classes, C++20 implementation, and the trade-offs that decide whether to use it.

## The Problem

A file browser must compute bytes for a file or a folder containing nested folders.

## Naive Solution

```cpp
int total = file_size;
for (int size : folder_sizes) total += size; // only one nesting level
```

## Why It Becomes a Problem

Special loops for each depth break as nesting grows and repeat file-versus-folder checks.

## The Idea

Give File and Folder the Entry [`interface`](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md#interface) (The contract of operations and observable behavior offered to a caller). A folder recursively asks its children for bytes.

## Reading the illustration

A shipping box can contain products or smaller boxes. Asking any box for its weight recursively gives the weight of everything inside.

In the repository example, the same design idea addresses this software problem: A file browser must compute bytes for a file or a folder containing nested folders.

## Structure

[Diagram](https://github.com/sanfor2004/23-Design-Patterns/blob/main/structural/composite/diagram.md) · [Run the example](https://github.com/sanfor2004/23-Design-Patterns/blob/main/structural/composite/cpp/README.md)

<figure>
  <img src="/images/writing/patterns/diagrams/composite.svg" alt="Composite diagram showing the participants and their relationships in the C++ example below." loading="lazy" decoding="async" />
  <figcaption>Composite: the code structure. Read the participant roles below alongside the arrows. <a href="/images/writing/patterns/diagrams/composite.svg">Open the full-size diagram</a>.</figcaption>
</figure>

```text
Client::bytes()  -->  Entry  -->  File / Folder[Entry]
```

## Participants

Entry defines bytes. File returns its size; Folder owns children with [`std::unique_ptr`](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md#stdunique_ptr) (A smart pointer with exclusive ownership that releases its object when the owner is destroyed) and aggregates their results.

Canonical roles in this example:

- [`Component`](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md#component) — The common contract exposed by leaves, groups, or wrappers. Here: `Entry`.
- [`Leaf`](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md#leaf) — A Component with no child Components. Here: `File`.
- [`ownership`](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md#ownership) — Responsibility for keeping a resource alive and eventually releasing it. Here: `Folder::children_`.

## Modern C++20 Example

```cpp
#include <iostream>
#include <memory>
#include <stdexcept>
#include <utility>
#include <vector>

struct Entry {
    virtual ~Entry() = default;
    virtual int bytes() const = 0;
};
class File final : public Entry {
    int size_;
public:
    explicit File(int size) : size_(size) {
        if (size < 0) throw std::invalid_argument("Negative size");
    }
    int bytes() const override { return size_; }
};
class Folder final : public Entry {
    std::vector<std::unique_ptr<Entry>> children_;
public:
    void add(std::unique_ptr<Entry> child) {
        if (!child) throw std::invalid_argument("Null child");
        children_.push_back(std::move(child));
    }
    int bytes() const override {
        int total = 0;
        for (const auto& child : children_) total += child->bytes();
        return total;
    }
};
int main() {
    auto images = std::make_unique<Folder>();
    images->add(std::make_unique<File>(20));
    Folder root;
    root.add(std::make_unique<File>(10));
    root.add(std::move(images));
    std::cout << "Total: " << root.bytes() << " bytes\n";
}
```

## Example Output

```text
Total: 30 bytes
```

## When to Use

Use it for genuine part-whole trees where a useful operation applies to both leaves and groups.

### Use cases

File trees, scene graphs without sharing, and menu hierarchies are suitable contexts.

## When NOT to Use

Avoid it for a flat list or a graph with shared parents and cycles; tree ownership would misrepresent the domain.

## Advantages

Clients calculate a subtree total without knowing its depth or concrete shape.

## Trade-offs

Very deep trees can overflow the call stack, integer sums can overflow, and group-only operations should not be forced onto leaves.

## Related Patterns

[Decorator](/blog/design-pattern-decorator/) · [Iterator](/blog/design-pattern-iterator/)

## Common Confusion

Decorator wraps one object to add behavior. Composite normally owns multiple children to represent a whole; both can recurse through an interface.

## Terms to Remember

- `Composite` — Treat a leaf and a tree of objects through the same operation.
- `Component` — The common contract exposed by leaves, groups, or wrappers. Example: `Entry`.
- `Leaf` — A Component with no child Components. Example: `File`.
- `ownership` — Responsibility for keeping a resource alive and eventually releasing it. Example: `Folder::children_`.

## Interview Vocabulary

- [`part-whole hierarchy`](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md#part-whole-hierarchy) — A recursive structure in which groups contain leaves or smaller groups.
- [`recursive composition`](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md#recursive-composition) — Building a structure from parts that expose the same contract as the whole.
- [`polymorphism`](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md#polymorphism) — Using one interface with different implementations; C++ supports runtime and compile-time forms.

## Interview Question

Why is add available on Folder rather than Entry? What would a File.add mean?

## Mini Challenge

Add an empty folder and a second nesting level; verify both totals and consider a wider size type.

## Run and explore the example

The complete code above comes from [structural/composite/cpp/main.cpp](https://github.com/sanfor2004/23-Design-Patterns/blob/main/structural/composite/cpp/main.cpp). Follow the repository's [C++20 build instructions](https://github.com/sanfor2004/23-Design-Patterns/blob/main/CPP_EXAMPLES.md) to compile it and compare the result with [expected.txt](https://github.com/sanfor2004/23-Design-Patterns/blob/main/structural/composite/cpp/expected.txt). The output demonstrates this example's behavior; it does not cover every input or the challenge above.

The source example and adapted explanation are © 2026 Sanfor2004, provided under the [MIT license](/images/writing/patterns/SOURCE-LICENSE.txt). The sketchbook cover is an illustration preserved from this site's original pattern lessons.

## Continue the series

- [Overview: all 23 patterns, their categories, and how to choose](/blog/design-patterns-overview/)
- Previous: [Bridge (Structural Pattern)](/blog/design-pattern-bridge/)
- Next: [Decorator (Structural Pattern)](/blog/design-pattern-decorator/)
