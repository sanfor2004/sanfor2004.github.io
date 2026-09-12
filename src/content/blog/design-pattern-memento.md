---
title: "Memento (Behavioral Pattern)"
description: "Capture and restore an object’s state without exposing its internal representation."
image: "/images/writing/patterns/memento.webp"
imageAlt: "A hand places a glowing crystal into a row of save slots beside two versions of a game scene."
imageWidth: 1600
imageHeight: 900
pubDate: 2026-09-11
updatedDate: 2026-09-12
category: "Design Patterns"
tags: ["Design Patterns", "Behavioral Patterns", "C++", "Software Engineering"]
draft: false
---

[Start with the design patterns overview](/blog/design-patterns-overview/) · Part 18 of 23 · Behavioral patterns

Capture and restore an object’s state without exposing its internal representation. This article follows the example in my [23 Design Patterns repository](https://github.com/sanfor2004/23-Design-Patterns/blob/main/behavioral/memento/README.md), connecting the problem, participating classes, C++20 implementation, and the trade-offs that decide whether to use it.

## The Problem

An editor needs a checkpoint before an experimental edit.

## Naive Solution

```cpp
std::string old_text = editor.text(); // caretaker knows what state to copy
```

## Why It Becomes a Problem

If the undo manager copies public fields itself, every new internal field requires changes in the manager.

## The Idea

Editor creates a Snapshot with private text and later reads it to restore itself.

## Reading the illustration

A game save records enough private state to return later. The save-slot manager stores it but does not edit what is inside.

In the repository example, the same design idea addresses this software problem: An editor needs a checkpoint before an experimental edit.

## Structure

[Diagram](https://github.com/sanfor2004/23-Design-Patterns/blob/main/behavioral/memento/diagram.md) · [Run the example](https://github.com/sanfor2004/23-Design-Patterns/blob/main/behavioral/memento/cpp/README.md)

<figure>
  <img src="/images/writing/patterns/diagrams/memento.svg" alt="Memento diagram showing the participants and their relationships in the C++ example below." loading="lazy" decoding="async" />
  <figcaption>Memento: the code structure. Read the participant roles below alongside the arrows. <a href="/images/writing/patterns/diagrams/memento.svg">Open the full-size diagram</a>.</figcaption>
</figure>

```text
Caretaker  -->  Editor::Snapshot  -->  Editor::restore()
```

## Participants

Editor is the originator. Snapshot is the memento with private state. main is the caretaker holding it without inspecting its contents.

Canonical roles in this example:

- [`Originator`](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md#originator) — The object that knows how to capture and restore its own state. Here: `Editor`.
- [`Caretaker`](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md#caretaker) — The role that keeps a Memento without inspecting its private representation. Here: `main`.
- [`snapshot`](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md#snapshot) — A captured representation of selected state at a point in time. Here: `Editor::Snapshot`.

## Modern C++20 Example

```cpp
#include <iostream>
#include <string>
#include <utility>

class Editor {
    std::string text_;
public:
    class Snapshot {
        friend class Editor;
        std::string text_;
        explicit Snapshot(std::string text) : text_(std::move(text)) {}
    };
    void write(std::string text) { text_ = std::move(text); }
    Snapshot save() const { return Snapshot{text_}; }
    void restore(const Snapshot& snapshot) { text_ = snapshot.text_; }
    const std::string& text() const { return text_; }
};
int main() {
    Editor editor;
    editor.write("Draft");
    const auto checkpoint = editor.save();
    editor.write("Broken edit");
    std::cout << editor.text() << '\n';
    editor.restore(checkpoint);
    std::cout << editor.text() << '\n';
}
```

## Example Output

```text
Broken edit
Draft
```

## When to Use

Use it for checkpoints where the originator can define a consistent state snapshot.

### Use cases

Editor checkpoints and simulation snapshots fit when the saved state is complete and consistent.

## When NOT to Use

Avoid it when state is huge, resources cannot be restored, or recording inverse operations is cheaper.

## Advantages

Snapshot representation stays private to the originator, so the caretaker does not copy fields manually.

## Trade-offs

Full snapshots cost memory and copying time. External effects such as files or network calls are not undone by restoring this string.

## Related Patterns

[Command](/blog/design-pattern-command/) · [Prototype](/blog/design-pattern-prototype/)

## Common Confusion

Command records an action; Memento records state. Prototype makes a separate object rather than restoring this one.

## Terms to Remember

- `Memento` — Save and restore an object's state without exposing snapshot internals.
- `Originator` — The object that knows how to capture and restore its own state. Example: `Editor`.
- `Caretaker` — The role that keeps a Memento without inspecting its private representation. Example: `main`.
- `snapshot` — A captured representation of selected state at a point in time. Example: `Editor::Snapshot`.

## Interview Vocabulary

- [`encapsulation`](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md#encapsulation) — Keeping representation and invariants behind controlled operations.
- [`undo`](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md#undo) — Restoring an earlier logical result, using saved state or an inverse operation when possible.
- [`ownership`](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md#ownership) — Responsibility for keeping a resource alive and eventually releasing it.

## Interview Question

If Editor later stores cursor position, who must change so restoration stays correct?

## Mini Challenge

Include a cursor position in Snapshot and test that both text and cursor return together.

## Run and explore the example

The complete code above comes from [behavioral/memento/cpp/main.cpp](https://github.com/sanfor2004/23-Design-Patterns/blob/main/behavioral/memento/cpp/main.cpp). Follow the repository's [C++20 build instructions](https://github.com/sanfor2004/23-Design-Patterns/blob/main/CPP_EXAMPLES.md) to compile it and compare the result with [expected.txt](https://github.com/sanfor2004/23-Design-Patterns/blob/main/behavioral/memento/cpp/expected.txt). The output demonstrates this example's behavior; it does not cover every input or the challenge above.

The source example and adapted explanation are © 2026 Sanfor2004, provided under the [MIT license](/images/writing/patterns/SOURCE-LICENSE.txt). The sketchbook cover is an illustration preserved from this site's original pattern lessons.

## Continue the series

- [Overview: all 23 patterns, their categories, and how to choose](/blog/design-patterns-overview/)
- Previous: [Mediator (Behavioral Pattern)](/blog/design-pattern-mediator/)
- Next: [Observer (Behavioral Pattern)](/blog/design-pattern-observer/)
