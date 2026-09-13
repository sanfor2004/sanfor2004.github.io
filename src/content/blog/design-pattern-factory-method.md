---
title: "Factory Method (Creational Pattern)"
description: "Let subclasses or specialized creators decide which concrete product to instantiate."
image: "/images/writing/patterns/factory-method.webp"
imageAlt: "A delivery office coordinates different vehicles for a shared delivery workflow."
imageWidth: 1600
imageHeight: 900
pubDate: 2026-09-11
updatedDate: 2026-09-14
category: "Design Patterns"
tags: ["Design Patterns", "Creational Patterns", "Python", "C++", "Software Engineering"]
draft: false
---

[Start with the design patterns overview](/blog/design-patterns-overview/) · Part 03 of 23 · Creational patterns

Let subclasses or specialized creators decide which concrete product to instantiate. This article follows the example in my [23 Design Patterns repository](https://github.com/sanfor2004/23-Design-Patterns/blob/main/creational/factory-method/README.md), connecting the problem, participating classes, Python and C++20 implementations, and the trade-offs that decide whether to use it.

## The Problem

An alert job always sends a completion message, but different environments need different senders.

## Naive Solution

```cpp
void run() {
    EmailSender sender;
    sender.send("build complete");
}
```

## Why It Becomes a Problem

Hardcoding EmailSender inside run couples the workflow to email; copying run for console delivery duplicates the workflow.

This is `tight coupling`: the workflow knows a concrete sender type, so changing delivery can require changing that workflow.

## The Idea

Put the workflow in AlertJob and call the overridable make_sender creation step.

## Reading the illustration

You ask a branch office to arrange transport. Every branch follows the same delivery process, but chooses the vehicle available in its region.

In the repository example, the same design idea addresses this software problem: An alert job always sends a completion message, but different environments need different senders.

## Structure

[Diagram](https://github.com/sanfor2004/23-Design-Patterns/blob/main/creational/factory-method/diagram.md) · [Python source](https://github.com/sanfor2004/23-Design-Patterns/blob/main/creational/factory-method/python/main.py) · [C++20 source](https://github.com/sanfor2004/23-Design-Patterns/blob/main/creational/factory-method/cpp/main.cpp)

<figure>
  <img src="/images/writing/patterns/diagrams/factory-method.svg" alt="Factory Method sketch map: AlertJob::run leads through make_sender() to Sender." loading="lazy" decoding="async" />
  <figcaption>Factory Method: trace the example from caller through the pattern boundary to its collaborator or result. The arrows show flow, not ownership. <a href="/images/writing/patterns/diagrams/factory-method.svg">Open the full-size diagram</a>.</figcaption>
</figure>

```text
AlertJob::run  -->  make_sender()  -->  Sender
```

## Participants

AlertJob owns the workflow. EmailJob and ConsoleJob override creation. Sender supplies the operation and the returned [`std::unique_ptr`](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md#stdunique_ptr) (A smart pointer with exclusive ownership that releases its object when the owner is destroyed) owns the product.

Canonical roles in this example:

- [`Creator`](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md#creator) — The base role that owns a workflow and declares its creation operation. Here: `AlertJob`.
- [`Concrete Creator`](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md#concrete-creator) — A Creator subclass that supplies a particular Product. Here: `EmailJob, ConsoleJob`.
- [`Product`](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md#product) — The contract of an object returned by creation code. Here: `Sender`.

## Python Example

The complete [Python source](https://github.com/sanfor2004/23-Design-Patterns/blob/main/creational/factory-method/python/main.py) is shown first.

```python
class EmailSender:
    def send(self, message):
        print("Email:", message)


class ConsoleSender:
    def send(self, message):
        print("Console:", message)


class AlertJob:
    def make_sender(self):
        raise NotImplementedError

    def run(self):
        sender = self.make_sender()
        sender.send("build complete")


class EmailJob(AlertJob):
    def make_sender(self):
        return EmailSender()


class ConsoleJob(AlertJob):
    def make_sender(self):
        return ConsoleSender()


if __name__ == "__main__":
    EmailJob().run()
    ConsoleJob().run()
```

## Python Output

```text
Email: build complete
Console: build complete
```

## Code Walkthrough

AlertJob owns the workflow. EmailJob and ConsoleJob override creation. Sender supplies the operation and the returned [`std::unique_ptr`](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md#stdunique_ptr) owns the product.

Start at the final call in the Python example. Follow the middle role in the diagram and compare how the C++20 version handles the same responsibility.

## C++20 Example

```cpp
#include <iostream>
#include <memory>
#include <string_view>

struct Sender {
    virtual ~Sender() = default;
    virtual void send(std::string_view message) const = 0;
};
struct EmailSender final : Sender {
    void send(std::string_view message) const override { std::cout << "Email: " << message << '\n'; }
};
struct ConsoleSender final : Sender {
    void send(std::string_view message) const override { std::cout << "Console: " << message << '\n'; }
};
class AlertJob {
protected:
    virtual std::unique_ptr<Sender> make_sender() const = 0;
public:
    virtual ~AlertJob() = default;
    void run() const {
        const auto sender = make_sender();
        sender->send("build complete");
    }
};
class EmailJob final : public AlertJob {
    std::unique_ptr<Sender> make_sender() const override { return std::make_unique<EmailSender>(); }
};
class ConsoleJob final : public AlertJob {
    std::unique_ptr<Sender> make_sender() const override { return std::make_unique<ConsoleSender>(); }
};
int main() {
    EmailJob{}.run();
    ConsoleJob{}.run();
}
```

## C++20 Output

```text
Email: build complete
Console: build complete
```

## When to Use

Use it when an existing [`inheritance`](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md#inheritance) (Defining a derived class from a base class to reuse or specialize its contract and implementation)-based workflow needs an extensible creation step.

### Use cases

Pluggable exporters and environment-specific job runners are plausible applications; the senders here only print text.

## When NOT to Use

Avoid it when passing a ready-made Sender into a function is sufficient; inheritance would add needless structure.

## Advantages

The workflow stays in one place while product selection varies.

## Trade-offs

Each new selection may need a subclass. Calling virtual creation from a base constructor would not dispatch to a derived override as intended.

## Related Patterns

[Abstract Factory](/blog/design-pattern-abstract-factory/) · [Template Method](/blog/design-pattern-template-method/)

## Common Confusion

A free function containing a switch is a simple factory, not this GoF subclass extension point. Abstract Factory instead coordinates a family.

## Terms to Remember

- `Factory Method` — Let a subclass choose the object used by a shared workflow.
- `Creator` — The base role that owns a workflow and declares its creation operation. Example: `AlertJob`.
- `Concrete Creator` — A Creator subclass that supplies a particular Product. Example: `EmailJob, ConsoleJob`.
- `Product` — The contract of an object returned by creation code. Example: `Sender`.

## Interview Vocabulary

- [`object creation`](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md#object-creation) — Choosing a concrete type and establishing an object's initial values and lifetime.
- [`tight coupling`](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md#tight-coupling) — Parts depend heavily on each other's concrete details, so changes tend to spread.
- [`inheritance`](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md#inheritance) — Defining a derived class from a base class to reuse or specialize its contract and implementation.
- [`Open/Closed Principle`](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md#openclosed-principle) — Aim for open for extension, closed for modification at a useful, chosen boundary.

## Interview Question

Why does run call make_sender after construction rather than from AlertJob's constructor?

## Mini Challenge

Add a FileJob with a sender that writes to a temporary file, and verify its contents.

## Compare the two versions

Both versions keep a workflow in a base Class and override its creation method. Python checks the returned Object when `send` is called; C++ declares a Sender Interface and transfers Ownership with `unique_ptr`. A standalone factory function is often enough outside an inherited workflow. The two examples express the same pattern responsibility; compare their setup and output before changing an input.

## Check yourself

1. Where does Sender selection happen, and what workflow stays shared?
2. When would the naive solution on this page be easier to maintain? Give a concrete example.
3. Change one input in the Python example. Predict the output and explain which responsibility handles the change.

## Run and explore the example

The Python code comes from [python/main.py](https://github.com/sanfor2004/23-Design-Patterns/blob/main/creational/factory-method/python/main.py), with [expected output](https://github.com/sanfor2004/23-Design-Patterns/blob/main/creational/factory-method/python/expected.txt). The C++20 code comes from [creational/factory-method/cpp/main.cpp](https://github.com/sanfor2004/23-Design-Patterns/blob/main/creational/factory-method/cpp/main.cpp). Follow the repository's [C++20 build instructions](https://github.com/sanfor2004/23-Design-Patterns/blob/main/CPP_EXAMPLES.md) to compile it and compare the result with [expected.txt](https://github.com/sanfor2004/23-Design-Patterns/blob/main/creational/factory-method/cpp/expected.txt). The output demonstrates this example's behavior; it does not cover every input or the challenge above.

The source example and adapted explanation are © 2026 Sanfor2004, provided under the [MIT license](/images/writing/patterns/SOURCE-LICENSE.txt). The sketchbook cover is an illustration preserved from this site's original pattern lessons.

## Continue the series

- [Overview: all 23 patterns, their categories, and how to choose](/blog/design-patterns-overview/)
- Previous: [Builder (Creational Pattern)](/blog/design-pattern-builder/)
- Next: [Prototype (Creational Pattern)](/blog/design-pattern-prototype/)
