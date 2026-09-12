---
title: "Chain of Responsibility (Behavioral Pattern)"
description: "Pass a request through an ordered chain until a handler processes it or the chain ends."
image: "/images/writing/patterns/chain-of-responsibility.webp"
imageAlt: "A support request passes through a sequence of handlers."
imageWidth: 1600
imageHeight: 900
pubDate: 2026-09-11
updatedDate: 2026-09-12
category: "Design Patterns"
tags: ["Design Patterns", "Behavioral Patterns", "C++", "Software Engineering"]
draft: false
---

[Start with the design patterns overview](/blog/design-patterns-overview/) · Part 13 of 23 · Behavioral patterns

Pass a request through an ordered chain until a handler processes it or the chain ends. This article follows the example in my [23 Design Patterns repository](https://github.com/sanfor2004/23-Design-Patterns/blob/main/behavioral/chain-of-responsibility/README.md), connecting the problem, participating classes, C++20 implementation, and the trade-offs that decide whether to use it.

## The Problem

A request must pass authentication and spending checks, and different entry points need different policies.

## Naive Solution

```cpp
bool accept(Request r) {
    return r.authenticated && r.amount > 0 && r.amount <= 100;
}
```

## Why It Becomes a Problem

One expression is fine initially; duplicating and editing it for several pipelines makes policy order and reuse difficult.

## The Idea

Each Handler runs its own check and delegates only on success; the final successful handler accepts.

## Reading the illustration

A support ticket moves from the front desk to a specialist and then a manager only when the current person cannot resolve it.

In the repository example, the same design idea addresses this software problem: A request must pass authentication and spending checks, and different entry points need different policies.

## Structure

[Diagram](https://github.com/sanfor2004/23-Design-Patterns/blob/main/behavioral/chain-of-responsibility/diagram.md) · [Run the example](https://github.com/sanfor2004/23-Design-Patterns/blob/main/behavioral/chain-of-responsibility/cpp/README.md)

<figure>
  <img src="/images/writing/patterns/diagrams/chain-of-responsibility.svg" alt="Chain of Responsibility diagram showing the participants and their relationships in the C++ example below." loading="lazy" decoding="async" />
  <figcaption>Chain of Responsibility: the code structure. Read the participant roles below alongside the arrows. <a href="/images/writing/patterns/diagrams/chain-of-responsibility.svg">Open the full-size diagram</a>.</figcaption>
</figure>

```text
Request  -->  Auth  -->  Limit
```

## Participants

Handler owns its successor. Auth checks identity, Limit checks amount. The client chooses the chain order.

Canonical roles in this example:

- [`Handler`](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md#handler) — A role that handles a request or passes it to its successor. Here: `Handler`.
- [`Concrete Handler`](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md#concrete-handler) — A Handler implementing one particular processing rule. Here: `Auth, Limit`.
- [`chain termination`](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md#chain-termination) — The rule for stopping a chain and deciding what happens after the last handler. Here: `Handler::handle`.

## Modern C++20 Example

```cpp
#include <initializer_list>
#include <iostream>
#include <memory>
#include <utility>

struct Request { bool authenticated; int amount; };
class Handler {
    std::unique_ptr<Handler> next_;
protected:
    virtual bool accepts(const Request& request) const = 0;
public:
    explicit Handler(std::unique_ptr<Handler> next = {}) : next_(std::move(next)) {}
    virtual ~Handler() = default;
    bool handle(const Request& request) const {
        if (!accepts(request)) return false;
        return next_ ? next_->handle(request) : true;
    }
};
class Auth final : public Handler {
    bool accepts(const Request& request) const override { return request.authenticated; }
public:
    using Handler::Handler;
};
class Limit final : public Handler {
    bool accepts(const Request& request) const override { return request.amount > 0 && request.amount <= 100; }
public:
    using Handler::Handler;
};
int main() {
    const Auth chain{std::make_unique<Limit>()};
    for (const auto& request : {Request{false, 20}, Request{true, 200}, Request{true, 20}})
        std::cout << (chain.handle(request) ? "Accepted" : "Rejected") << '\n';
}
```

## Example Output

```text
Rejected
Rejected
Accepted
```

## When to Use

Use it when request handling order or membership must be composed independently.

### Use cases

Validation pipelines and request middleware fit. This variant requires every handler to approve, rather than stopping at the first successful handler.

## When NOT to Use

Avoid it for two fixed checks in one place; the initial expression is then clearer.

## Advantages

Checks can be reused and reordered without a giant conditional.

## Trade-offs

Order affects behavior. A chain needs an explicit end policy; this example accepts after all checks, while other chains may reject unhandled requests.

## Related Patterns

[Decorator](/blog/design-pattern-decorator/) · [Command](/blog/design-pattern-command/)

## Common Confusion

Decorator layers behavior around a component; this chain may terminate without reaching later handlers. Command represents the request as an object.

## Terms to Remember

- `Chain of Responsibility` — Pass a request along handlers that can stop or continue processing.
- `Handler` — A role that handles a request or passes it to its successor. Example: `Handler`.
- `Concrete Handler` — A Handler implementing one particular processing rule. Example: `Auth, Limit`.
- `chain termination` — The rule for stopping a chain and deciding what happens after the last handler. Example: `Handler::handle`.

## Interview Vocabulary

- [`delegation`](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md#delegation) — An object asks a collaborator to perform part of its work.
- [`object composition`](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md#object-composition) — Connecting objects to form a larger behavior or structure.
- [`loose coupling`](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md#loose-coupling) — Parts know only the small contracts needed to cooperate, limiting change propagation.

## Interview Question

What happens to an unauthenticated request if Limit is expensive and placed first?

## Mini Challenge

Add a maintenance-mode handler and verify that rejected requests never reach later checks.

## Run and explore the example

The complete code above comes from [behavioral/chain-of-responsibility/cpp/main.cpp](https://github.com/sanfor2004/23-Design-Patterns/blob/main/behavioral/chain-of-responsibility/cpp/main.cpp). Follow the repository's [C++20 build instructions](https://github.com/sanfor2004/23-Design-Patterns/blob/main/CPP_EXAMPLES.md) to compile it and compare the result with [expected.txt](https://github.com/sanfor2004/23-Design-Patterns/blob/main/behavioral/chain-of-responsibility/cpp/expected.txt). The output demonstrates this example's behavior; it does not cover every input or the challenge above.

The source example and adapted explanation are © 2026 Sanfor2004, provided under the [MIT license](/images/writing/patterns/SOURCE-LICENSE.txt). The sketchbook cover is an illustration preserved from this site's original pattern lessons.

## Continue the series

- [Overview: all 23 patterns, their categories, and how to choose](/blog/design-patterns-overview/)
- Previous: [Proxy (Structural Pattern)](/blog/design-pattern-proxy/)
- Next: [Command (Behavioral Pattern)](/blog/design-pattern-command/)
