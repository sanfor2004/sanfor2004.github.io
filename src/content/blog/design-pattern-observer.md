---
title: "Observer (Behavioral Pattern)"
description: "Notify a changing set of subscribers when a subject emits an event or changes state."
image: "/images/writing/patterns/observer.webp"
imageAlt: "A notification source sends updates to multiple subscribers."
imageWidth: 1600
imageHeight: 900
pubDate: 2026-09-11
updatedDate: 2026-09-14
category: "Design Patterns"
tags: ["Design Patterns", "Behavioral Patterns", "Python", "C++", "Software Engineering"]
draft: false
---

[Start with the design patterns overview](/blog/design-patterns-overview/) · Part 19 of 23 · Behavioral patterns

Notify a changing set of subscribers when a subject emits an event or changes state. This article follows the example in my [23 Design Patterns repository](https://github.com/sanfor2004/23-Design-Patterns/blob/main/behavioral/observer/README.md), connecting the problem, participating classes, Python and C++20 implementations, and the trade-offs that decide whether to use it.

## The Problem

Stock changes should update interested displays without making Stock know every concrete display type.

## Naive Solution

```cpp
display.update(quantity);
email.update(quantity); // publisher names every consumer
```

## Why It Becomes a Problem

Calling each concrete consumer directly couples the publisher to the current list and requires edits whenever consumers change.

## The Idea

Stock stores weak references to Listener objects and broadcasts updates to the live subscribers.

## Reading the illustration

A YouTube channel publishes once. Subscribers register beforehand and each decides what to do when the notification arrives.

In the repository example, the same design idea addresses this software problem: Stock changes should update interested displays without making Stock know every concrete display type.

## Structure

[Diagram](https://github.com/sanfor2004/23-Design-Patterns/blob/main/behavioral/observer/diagram.md) · [Python source](https://github.com/sanfor2004/23-Design-Patterns/blob/main/behavioral/observer/python/main.py) · [C++20 source](https://github.com/sanfor2004/23-Design-Patterns/blob/main/behavioral/observer/cpp/main.cpp)

<figure>
  <img src="/images/writing/patterns/diagrams/observer.svg" alt="Observer sketch map: Stock::set() leads through weak Listener subscriptions to Display::update()." loading="lazy" decoding="async" />
  <figcaption>Observer: trace the example from caller through the pattern boundary to its collaborator or result. The arrows show flow, not ownership. <a href="/images/writing/patterns/diagrams/observer.svg">Open the full-size diagram</a>.</figcaption>
</figure>

```text
Stock::set()  -->  weak Listener subscriptions  -->  Display::update()
```

## Participants

Stock is the subject, Listener the callback [`interface`](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md#interface) (The contract of operations and observable behavior offered to a caller), Display a subscriber. The client owns subscribers; [`std::weak_ptr`](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md#stdweak_ptr) (A non-owning observer of shared ownership; lock attempts to obtain a temporary shared_ptr) avoids extending their [`lifetime`](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md#lifetime) (The interval during which an object exists and may be used according to its rules).

Canonical roles in this example:

- [`Subject`](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md#subject) — The publisher whose changes are announced to registered Observers. Here: `Stock`.
- [`Observer interface`](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md#observer-interface) — The callback contract implemented by subscribers. Here: `Listener`.
- [`Concrete Observer`](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md#concrete-observer) — An Observer implementation that reacts to notifications. Here: `Display`.

## Python Example

The complete [Python source](https://github.com/sanfor2004/23-Design-Patterns/blob/main/behavioral/observer/python/main.py) is shown first.

```python
class Stock:
    def __init__(self):
        self.listeners = []

    def subscribe(self, listener):
        self.listeners.append(listener)

    def unsubscribe(self, listener):
        self.listeners.remove(listener)

    def set(self, quantity):
        for listener in self.listeners.copy():
            listener(quantity)


def screen(quantity):
    print("Screen:", quantity)


def log(quantity):
    print("Log:", quantity)


def main():
    stock = Stock()
    stock.subscribe(screen)
    stock.subscribe(log)
    stock.set(4)
    stock.unsubscribe(screen)
    stock.set(0)
    stock.unsubscribe(log)
    stock.set(8)
    print("No subscribers")


if __name__ == "__main__":
    main()
```

## Python Output

```text
Screen: 4
Log: 4
Log: 0
No subscribers
```

## Code Walkthrough

Stock is the subject, Listener the callback [`interface`](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md#interface), Display a subscriber. The client owns subscribers; [`std::weak_ptr`](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md#stdweak_ptr) avoids extending their [`lifetime`](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md#lifetime).

Start at the final call in the Python example. Follow the middle role in the diagram and compare how the C++20 version handles the same responsibility.

## C++20 Example

```cpp
#include <algorithm>
#include <iostream>
#include <memory>
#include <vector>

struct Listener {
    virtual ~Listener() = default;
    virtual void update(int stock) = 0;
};
class Stock {
    std::vector<std::weak_ptr<Listener>> listeners_;
public:
    void subscribe(const std::shared_ptr<Listener>& listener) { listeners_.push_back(listener); }
    void set(int quantity) {
        std::erase_if(listeners_, [](const auto& item) { return item.expired(); });
        const auto snapshot = listeners_;
        for (const auto& item : snapshot)
            if (auto listener = item.lock()) listener->update(quantity);
    }
};
struct Display final : Listener {
    void update(int stock) override { std::cout << "Stock: " << stock << '\n'; }
};
int main() {
    Stock stock;
    auto display = std::make_shared<Display>();
    stock.subscribe(display);
    stock.set(4);
    display.reset();
    stock.set(0);
    std::cout << "Expired listener skipped\n";
    auto screen = std::make_shared<Display>();
    auto log = std::make_shared<Display>();
    stock.subscribe(screen);
    stock.subscribe(log);
    stock.set(2);
}
```

## C++20 Output

```text
Stock: 4
Expired listener skipped
Stock: 2
Stock: 2
```

## When to Use

Use it when one change has several independently registered consumers.

### Use cases

UI updates and local event subscriptions fit; delivery guarantees of distributed event systems are separate concerns.

## When NOT to Use

Avoid it for one fixed dependency where a direct call is clearer, or when strict transactional consistency is required.

## Advantages

Subscribers can come and go without changing publisher code.

## Trade-offs

Callback order and exceptions need a policy. This synchronous example propagates exceptions and is not thread-safe. Snapshotting tolerates subscription changes but does not prevent recursive notifications.

## Related Patterns

[Mediator](/blog/design-pattern-mediator/) · [State](/blog/design-pattern-state/)

## Common Confusion

Mediator defines coordination rules among known peers. Observer broadcasts notifications and does not prescribe the subscribers' relationship.

## Terms to Remember

- `Observer` — Notify subscribed objects when something they follow changes.
- `Subject` — The publisher whose changes are announced to registered Observers. Example: `Stock`.
- `Observer interface` — The callback contract implemented by subscribers. Example: `Listener`.
- `Concrete Observer` — An Observer implementation that reacts to notifications. Example: `Display`.

## Interview Vocabulary

- [`one-to-many dependency`](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md#one-to-many-dependency) — One source has multiple dependents that react to its changes.
- [`loose coupling`](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md#loose-coupling) — Parts know only the small contracts needed to cooperate, limiting change propagation.
- [`subscription lifetime`](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md#subscription-lifetime) — The interval in which a listener is registered and eligible for notification.

## Interview Question

Why use std::weak_ptr for stored listeners but lock it into [`std::shared_ptr`](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md#stdshared_ptr) (A smart pointer sharing ownership; the managed object is released when the last owning reference disappears) during the callback?

## Mini Challenge

Add two listeners, destroy one, and verify only the survivor receives later updates. Define an explicit unsubscribe operation.

## Compare the two versions

Python stores callbacks with strong references and removes them explicitly. C++ uses `weak_ptr` and skips expired listeners. Neither version sends notifications asynchronously. A snapshot makes changes to subscriptions affect the next notification. The two examples express the same pattern responsibility; compare their setup and output before changing an input.

## Check yourself

1. How do unsubscribe in Python and an expired weak_ptr in C++ differ?
2. When would the naive solution on this page be easier to maintain? Give a concrete example.
3. Change one input in the Python example. Predict the output and explain which responsibility handles the change.

## Run and explore the example

The Python code comes from [python/main.py](https://github.com/sanfor2004/23-Design-Patterns/blob/main/behavioral/observer/python/main.py), with [expected output](https://github.com/sanfor2004/23-Design-Patterns/blob/main/behavioral/observer/python/expected.txt). The C++20 code comes from [behavioral/observer/cpp/main.cpp](https://github.com/sanfor2004/23-Design-Patterns/blob/main/behavioral/observer/cpp/main.cpp). Follow the repository's [C++20 build instructions](https://github.com/sanfor2004/23-Design-Patterns/blob/main/CPP_EXAMPLES.md) to compile it and compare the result with [expected.txt](https://github.com/sanfor2004/23-Design-Patterns/blob/main/behavioral/observer/cpp/expected.txt). The output demonstrates this example's behavior; it does not cover every input or the challenge above.

The source example and adapted explanation are © 2026 Sanfor2004, provided under the [MIT license](/images/writing/patterns/SOURCE-LICENSE.txt). The sketchbook cover is an illustration preserved from this site's original pattern lessons.

## Continue the series

- [Overview: all 23 patterns, their categories, and how to choose](/blog/design-patterns-overview/)
- Previous: [Memento (Behavioral Pattern)](/blog/design-pattern-memento/)
- Next: [State (Behavioral Pattern)](/blog/design-pattern-state/)
