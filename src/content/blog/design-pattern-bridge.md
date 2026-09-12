---
title: "Bridge (Structural Pattern)"
description: "Separate an abstraction from its implementation so both dimensions can vary independently."
image: "/images/writing/patterns/bridge.webp"
imageAlt: "A remote control connects to several device implementations."
imageWidth: 1600
imageHeight: 900
pubDate: 2026-09-11
updatedDate: 2026-09-12
category: "Design Patterns"
tags: ["Design Patterns", "Structural Patterns", "C++", "Software Engineering"]
draft: false
---

[Start with the design patterns overview](/blog/design-patterns-overview/) · Part 07 of 23 · Structural patterns

Separate an abstraction from its implementation so both dimensions can vary independently. This article follows the example in my [23 Design Patterns repository](https://github.com/sanfor2004/23-Design-Patterns/blob/main/structural/bridge/README.md), connecting the problem, participating classes, C++20 implementation, and the trade-offs that decide whether to use it.

## The Problem

Notices vary by urgency and by delivery channel; both dimensions need independent extensions.

## Naive Solution

```cpp
struct UrgentEmailNotice {};
struct UrgentSmsNotice {};
struct NormalEmailNotice {};
struct NormalSmsNotice {};
```

## Why It Becomes a Problem

A class for every urgency-channel pair multiplies combinations and repeats delivery logic.

## The Idea

Notice delegates delivery to a Channel. UrgentNotice changes message behavior without choosing a transport.

## Reading the illustration

A universal remote and a television can evolve separately as long as both agree on the control connection between them.

In the repository example, the same design idea addresses this software problem: Notices vary by urgency and by delivery channel; both dimensions need independent extensions.

## Structure

[Diagram](https://github.com/sanfor2004/23-Design-Patterns/blob/main/structural/bridge/diagram.md) · [Run the example](https://github.com/sanfor2004/23-Design-Patterns/blob/main/structural/bridge/cpp/README.md)

<figure>
  <img src="/images/writing/patterns/diagrams/bridge.svg" alt="Bridge diagram showing the participants and their relationships in the C++ example below." loading="lazy" decoding="async" />
  <figcaption>Bridge: the code structure. Read the participant roles below alongside the arrows. <a href="/images/writing/patterns/diagrams/bridge.svg">Open the full-size diagram</a>.</figcaption>
</figure>

```text
Notice / UrgentNotice  -->  Channel  -->  Email / Sms
```

## Participants

Notice is the [`abstraction`](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md#abstraction) (A view that exposes the operations a caller needs while hiding irrelevant details), UrgentNotice refines it, Channel is the [`implementation`](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md#implementation) (The concrete code that fulfills an interface or performs an operation) contract, Email and Sms implement delivery.

Canonical roles in this example:

- [`Abstraction`](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md#abstraction-bridge-role) — The high-level side of Bridge that delegates implementation work. Here: `Notice`.
- [`Refined Abstraction`](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md#refined-abstraction) — A specialization of Abstraction independent of the implementation side. Here: `UrgentNotice`.
- [`Implementor`](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md#implementor) — The contract used by a Bridge Abstraction for lower-level work. Here: `Channel`.
- [`Concrete Implementor`](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md#concrete-implementor) — A particular implementation of the Implementor contract. Here: `Email, Sms`.

## Modern C++20 Example

```cpp
#include <iostream>
#include <string_view>

struct Channel {
    virtual ~Channel() = default;
    virtual void deliver(std::string_view text) const = 0;
};
struct Email final : Channel {
    void deliver(std::string_view text) const override { std::cout << "Email: " << text << '\n'; }
};
struct Sms final : Channel {
    void deliver(std::string_view text) const override { std::cout << "SMS: " << text << '\n'; }
};
class Notice {
protected:
    const Channel& channel_;
public:
    explicit Notice(const Channel& channel) : channel_(channel) {}
    virtual ~Notice() = default;
    virtual void send() const { channel_.deliver("status normal"); }
};
class UrgentNotice final : public Notice {
public:
    using Notice::Notice;
    void send() const override { channel_.deliver("URGENT: disk full"); }
};
int main() {
    const Email email;
    const Sms sms;
    Notice{email}.send();
    UrgentNotice{email}.send();
    UrgentNotice{sms}.send();
}
```

## Example Output

```text
Email: status normal
Email: URGENT: disk full
SMS: URGENT: disk full
```

## When to Use

Use it when two axes of variation would otherwise produce a cross-product of subclasses.

### Use cases

Rendering APIs with independent shapes and backends, or notification types with channels, fit this structure.

## When NOT to Use

Avoid it when only one small dimension changes and a function parameter already handles it.

## Advantages

A new channel serves existing notice types without adding every possible pair.

## Trade-offs

The extra indirection requires a clear boundary; borrowed channels must outlive their notices.

## Related Patterns

[Adapter](/blog/design-pattern-adapter/) · [Strategy](/blog/design-pattern-strategy/)

## Common Confusion

Adapter reconciles an existing mismatch. Bridge is usually an intentional separation of independently evolving dimensions; Strategy focuses on interchangeable behavior.

## Terms to Remember

- `Bridge` — Separate two changing dimensions and connect them through composition.
- `Abstraction` — The high-level side of Bridge that delegates implementation work. Example: `Notice`.
- `Refined Abstraction` — A specialization of Abstraction independent of the implementation side. Example: `UrgentNotice`.
- `Implementor` — The contract used by a Bridge Abstraction for lower-level work. Example: `Channel`.
- `Concrete Implementor` — A particular implementation of the Implementor contract. Example: `Email, Sms`.

## Interview Vocabulary

- [`object composition`](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md#object-composition) — Connecting objects to form a larger behavior or structure.
- [`composition over inheritance`](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md#composition-over-inheritance) — Prefer collaborating objects when they express variation more clearly than extending a class hierarchy.
- [`encapsulate what varies`](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md#encapsulate-what-varies) — Put a changing design decision behind a stable boundary.

## Interview Question

If you add Push and ScheduledNotice, how many classes are needed with and without the bridge?

## Mini Challenge

Add a Push channel and reuse both notice classes without changing them.

## Run and explore the example

The complete code above comes from [structural/bridge/cpp/main.cpp](https://github.com/sanfor2004/23-Design-Patterns/blob/main/structural/bridge/cpp/main.cpp). Follow the repository's [C++20 build instructions](https://github.com/sanfor2004/23-Design-Patterns/blob/main/CPP_EXAMPLES.md) to compile it and compare the result with [expected.txt](https://github.com/sanfor2004/23-Design-Patterns/blob/main/structural/bridge/cpp/expected.txt). The output demonstrates this example's behavior; it does not cover every input or the challenge above.

The source example and adapted explanation are © 2026 Sanfor2004, provided under the [MIT license](/images/writing/patterns/SOURCE-LICENSE.txt). The sketchbook cover is an illustration preserved from this site's original pattern lessons.

## Continue the series

- [Overview: all 23 patterns, their categories, and how to choose](/blog/design-patterns-overview/)
- Previous: [Adapter (Structural Pattern)](/blog/design-pattern-adapter/)
- Next: [Composite (Structural Pattern)](/blog/design-pattern-composite/)
