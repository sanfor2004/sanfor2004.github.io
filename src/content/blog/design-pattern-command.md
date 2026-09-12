---
title: "Command (Behavioral Pattern)"
description: "Represent a request as an object so it can be queued, logged, retried, or undone."
image: "/images/writing/patterns/command.webp"
imageAlt: "A restaurant order slip carries a request from the waiter to the kitchen."
imageWidth: 1600
imageHeight: 900
pubDate: 2026-09-11
updatedDate: 2026-09-12
category: "Design Patterns"
tags: ["Design Patterns", "Behavioral Patterns", "C++", "Software Engineering"]
draft: false
---

[Start with the design patterns overview](/blog/design-patterns-overview/) · Part 14 of 23 · Behavioral patterns

Represent a request as an object so it can be queued, logged, retried, or undone. This article follows the example in my [23 Design Patterns repository](https://github.com/sanfor2004/23-Design-Patterns/blob/main/behavioral/command/README.md), connecting the problem, participating classes, C++20 implementation, and the trade-offs that decide whether to use it.

## The Problem

An editor must apply changes and undo the last action without teaching the toolbar every document operation.

## Naive Solution

```cpp
document.text += " world"; // no object records how to undo
```

## Why It Becomes a Problem

Direct mutation performs the edit but leaves no record of the action or its prior state.

## The Idea

Append captures a receiver and argument; execute stores the old text, and undo restores it. History owns executed commands.

## Reading the illustration

A restaurant order slip records a request independently of the waiter and chef. It can wait in a queue, be audited, or be cancelled.

In the repository example, the same design idea addresses this software problem: An editor must apply changes and undo the last action without teaching the toolbar every document operation.

## Structure

[Diagram](https://github.com/sanfor2004/23-Design-Patterns/blob/main/behavioral/command/diagram.md) · [Run the example](https://github.com/sanfor2004/23-Design-Patterns/blob/main/behavioral/command/cpp/README.md)

<figure>
  <img src="/images/writing/patterns/diagrams/command.svg" alt="Command diagram showing the participants and their relationships in the C++ example below." loading="lazy" decoding="async" />
  <figcaption>Command: the code structure. Read the participant roles below alongside the arrows. <a href="/images/writing/patterns/diagrams/command.svg">Open the full-size diagram</a>.</figcaption>
</figure>

```text
History  -->  Command  -->  Append → Document
```

## Participants

Command defines execute and undo. Append changes a borrowed Document. History invokes and retains commands in stack order.

Canonical roles in this example:

- [`Receiver`](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md#receiver) — The object that performs the work requested by a Command. Here: `Document`.
- [`Invoker`](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md#invoker) — The role that starts or stores Commands without knowing each operation's details. Here: `History`.
- [`Concrete Command`](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md#concrete-command) — A Command implementation that binds a Receiver and an action. Here: `Append`.

## Modern C++20 Example

```cpp
#include <iostream>
#include <memory>
#include <stdexcept>
#include <string>
#include <utility>
#include <vector>

struct Document { std::string text; };
struct Command {
    virtual ~Command() = default;
    virtual void execute() = 0;
    virtual void undo() = 0;
};
class Append final : public Command {
    Document& document_;
    std::string suffix_;
    std::string before_;
public:
    Append(Document& document, std::string suffix) : document_(document), suffix_(std::move(suffix)) {}
    void execute() override { before_ = document_.text; document_.text += suffix_; }
    void undo() override { document_.text = before_; }
};
class History {
    std::vector<std::unique_ptr<Command>> commands_;
public:
    void run(std::unique_ptr<Command> command) {
        if (!command) throw std::invalid_argument("Missing command");
        commands_.push_back(std::move(command));
        try { commands_.back()->execute(); }
        catch (...) { commands_.pop_back(); throw; }
    }
    void undo() {
        if (commands_.empty()) return;
        commands_.back()->undo();
        commands_.pop_back();
    }
};
int main() {
    Document document{"Hello"};
    History history;
    history.run(std::make_unique<Append>(document, " world"));
    std::cout << document.text << '\n';
    history.undo();
    std::cout << document.text << '\n';
}
```

## Example Output

```text
Hello world
Hello
```

## When to Use

Use it for deferred actions, queues, macros or undo histories.

### Use cases

Editor actions and job queues fit, but durable queues need serialization and idempotency beyond this example.

## When NOT to Use

Avoid it for a one-off function call with no need to store or schedule intent.

## Advantages

The invoker does not depend on concrete operations and can retain their execution history.

## Trade-offs

Saving whole text costs memory. This single-threaded demo assumes edits go through History and Document outlives it; external edits would invalidate undo expectations.

## Related Patterns

[Memento](/blog/design-pattern-memento/) · [Chain of Responsibility](/blog/design-pattern-chain-of-responsibility/)

## Common Confusion

Memento stores state; Command stores an action and may use a snapshot to undo it. Not every command is reversible.

## Terms to Remember

- `Command` — Turn an action into an object that can be stored and invoked later.
- `Receiver` — The object that performs the work requested by a Command. Example: `Document`.
- `Invoker` — The role that starts or stores Commands without knowing each operation's details. Example: `History`.
- `Concrete Command` — A Command implementation that binds a Receiver and an action. Example: `Append`.

## Interview Vocabulary

- [`undo`](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md#undo) — Restoring an earlier logical result, using saved state or an inverse operation when possible.
- [`encapsulation`](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md#encapsulation) — Keeping representation and invariants behind controlled operations.
- [`exception safety`](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md#exception-safety) — The guarantees an operation preserves if it fails by throwing an exception.

## Interview Question

Can sending an email be undone in the same sense as restoring a string? Define compensation versus reversal.

## Mini Challenge

Add a second append, undo twice, and verify the empty-history call is harmless.

## Run and explore the example

The complete code above comes from [behavioral/command/cpp/main.cpp](https://github.com/sanfor2004/23-Design-Patterns/blob/main/behavioral/command/cpp/main.cpp). Follow the repository's [C++20 build instructions](https://github.com/sanfor2004/23-Design-Patterns/blob/main/CPP_EXAMPLES.md) to compile it and compare the result with [expected.txt](https://github.com/sanfor2004/23-Design-Patterns/blob/main/behavioral/command/cpp/expected.txt). The output demonstrates this example's behavior; it does not cover every input or the challenge above.

The source example and adapted explanation are © 2026 Sanfor2004, provided under the [MIT license](/images/writing/patterns/SOURCE-LICENSE.txt). The sketchbook cover is an illustration preserved from this site's original pattern lessons.

## Continue the series

- [Overview: all 23 patterns, their categories, and how to choose](/blog/design-patterns-overview/)
- Previous: [Chain of Responsibility (Behavioral Pattern)](/blog/design-pattern-chain-of-responsibility/)
- Next: [Interpreter (Behavioral Pattern)](/blog/design-pattern-interpreter/)
