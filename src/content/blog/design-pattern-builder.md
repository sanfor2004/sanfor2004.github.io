---
title: "Builder (Creational Pattern)"
description: "Construct a complex object step by step while allowing different final representations."
image: "/images/writing/patterns/builder.webp"
imageAlt: "A sandwich moves through successive preparation stations, with each step adding part of the finished result."
imageWidth: 1600
imageHeight: 900
pubDate: 2026-09-11
updatedDate: 2026-09-12
category: "Design Patterns"
tags: ["Design Patterns", "Creational Patterns", "C++", "Software Engineering"]
draft: false
---

[Start with the design patterns overview](/blog/design-patterns-overview/) · Part 02 of 23 · Creational patterns

Construct a complex object step by step while allowing different final representations. This article follows the example in my [23 Design Patterns repository](https://github.com/sanfor2004/23-Design-Patterns/blob/main/creational/builder/README.md), connecting the problem, participating classes, C++20 implementation, and the trade-offs that decide whether to use it.

## The Problem

A request has an endpoint, a timeout and a retry option; positional arguments become hard to read as options grow.

## Naive Solution

```cpp
Request request{"/orders", 5, true}; // what does true mean?
```

## Why It Becomes a Problem

The constructor works, but calls with several integers and booleans hide intent and make swapped arguments hard to notice.

## The Idea

Keep construction state in RequestBuilder. Named methods collect choices; build checks required values and returns a Request by value.

## Reading the illustration

A restaurant uses the same sequence—bread, filling, sauce, finish—but different cooks can produce different sandwiches from those steps.

In the repository example, the same design idea addresses this software problem: A request has an endpoint, a timeout and a retry option; positional arguments become hard to read as options grow.

## Structure

[Diagram](https://github.com/sanfor2004/23-Design-Patterns/blob/main/creational/builder/diagram.md) · [Run the example](https://github.com/sanfor2004/23-Design-Patterns/blob/main/creational/builder/cpp/README.md)

<figure>
  <img src="/images/writing/patterns/diagrams/builder.svg" alt="Builder diagram showing the participants and their relationships in the C++ example below." loading="lazy" decoding="async" />
  <figcaption>Builder: the code structure. Read the participant roles below alongside the arrows. <a href="/images/writing/patterns/diagrams/builder.svg">Open the full-size diagram</a>.</figcaption>
</figure>

```text
Client  -->  RequestBuilder  -->  Request
```

## Participants

RequestBuilder stores temporary choices and validates them. Request owns the finished values. The client chooses the order of optional steps.

Canonical roles in this example:

- [`Product`](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md#product) — The contract of an object returned by creation code. Here: `Request`.
- [`fluent interface`](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md#fluent-interface) — An interface shaped to read as a chain of calls; it does not by itself imply Builder. Here: `RequestBuilder.endpoint().timeout().retry()`.
- [`constructor`](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md#constructor) — The special operation that initializes a new class instance. Here: `Request::Request`.

## Modern C++20 Example

```cpp
#include <iostream>
#include <stdexcept>
#include <string>
#include <utility>

class Request {
    std::string endpoint_;
    int timeout_;
    bool retry_;
public:
    Request(std::string endpoint, int timeout, bool retry)
        : endpoint_(std::move(endpoint)), timeout_(timeout), retry_(retry) {}
    void describe() const {
        std::cout << endpoint_ << " timeout=" << timeout_ << " retry=" << retry_ << '\n';
    }
};
class RequestBuilder {
    std::string endpoint_;
    int timeout_ = 30;
    bool retry_ = false;
public:
    RequestBuilder& endpoint(std::string value) { endpoint_ = std::move(value); return *this; }
    RequestBuilder& timeout(int seconds) { timeout_ = seconds; return *this; }
    RequestBuilder& retry(bool enabled) { retry_ = enabled; return *this; }
    Request build() const {
        if (endpoint_.empty() || timeout_ <= 0) throw std::invalid_argument("Invalid request");
        return Request{endpoint_, timeout_, retry_};
    }
};
int main() {
    const auto request = RequestBuilder{}.endpoint("/orders").timeout(5).retry(true).build();
    request.describe();
    try { static_cast<void>(RequestBuilder{}.build()); }
    catch (const std::invalid_argument&) { std::cout << "Invalid request rejected\n"; }
}
```

## Example Output

```text
/orders timeout=5 retry=1
Invalid request rejected
```

## When to Use

Use it for objects with many independent options or a meaningful validation boundary.

### Use cases

HTTP request configuration and test fixture assembly fit; this example performs no network request.

## When NOT to Use

Avoid it for two obvious constructor arguments; a small aggregate with named fields may be clearer.

## Advantages

Call sites explain the choices, and invalid builder state can be rejected before producing a result.

## Trade-offs

There is an extra type to maintain. This Request constructor remains public, so production invariants would also need constructor validation or restricted access.

## Related Patterns

[Factory Method](/blog/design-pattern-factory-method/) · [Abstract Factory](/blog/design-pattern-abstract-factory/)

## Common Confusion

Factory Method chooses the concrete product inside an inherited workflow. Builder assembles the configuration of a result over several calls.

## Terms to Remember

- `Builder` — Assemble a configured object through named steps before producing the result.
- `Product` — The contract of an object returned by creation code. Example: `Request`.
- `fluent interface` — An interface shaped to read as a chain of calls; it does not by itself imply Builder. Example: `RequestBuilder.endpoint().timeout().retry()`.
- `constructor` — The special operation that initializes a new class instance. Example: `Request::Request`.

## Interview Vocabulary

- [`object creation`](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md#object-creation) — Choosing a concrete type and establishing an object's initial values and lifetime.
- [`separation of concerns`](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md#separation-of-concerns) — Keeping distinct kinds of responsibility apart so they can change independently.
- [`single responsibility`](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md#single-responsibility) — Keep a module focused on one coherent reason to change.

## Interview Question

Does a fluent interface automatically make something a Builder? Explain where construction ends.

## Mini Challenge

Reject timeouts above 120 and demonstrate both the boundary value and the first rejected value.

## Run and explore the example

The complete code above comes from [creational/builder/cpp/main.cpp](https://github.com/sanfor2004/23-Design-Patterns/blob/main/creational/builder/cpp/main.cpp). Follow the repository's [C++20 build instructions](https://github.com/sanfor2004/23-Design-Patterns/blob/main/CPP_EXAMPLES.md) to compile it and compare the result with [expected.txt](https://github.com/sanfor2004/23-Design-Patterns/blob/main/creational/builder/cpp/expected.txt). The output demonstrates this example's behavior; it does not cover every input or the challenge above.

The source example and adapted explanation are © 2026 Sanfor2004, provided under the [MIT license](/images/writing/patterns/SOURCE-LICENSE.txt). The sketchbook cover is an illustration preserved from this site's original pattern lessons.

## Continue the series

- [Overview: all 23 patterns, their categories, and how to choose](/blog/design-patterns-overview/)
- Previous: [Abstract Factory (Creational Pattern)](/blog/design-pattern-abstract-factory/)
- Next: [Factory Method (Creational Pattern)](/blog/design-pattern-factory-method/)
