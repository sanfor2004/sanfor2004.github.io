---
title: "Mediator (Behavioral Pattern)"
description: "Centralize complex collaboration so peer objects do not depend directly on one another."
image: "/images/writing/patterns/mediator.webp"
imageAlt: "An airport control tower coordinates several aircraft."
imageWidth: 1600
imageHeight: 900
pubDate: 2026-09-11
updatedDate: 2026-09-12
category: "Design Patterns"
tags: ["Design Patterns", "Behavioral Patterns", "C++", "Software Engineering"]
draft: false
---

[Start with the design patterns overview](/blog/design-patterns-overview/) · Part 17 of 23 · Behavioral patterns

Centralize complex collaboration so peer objects do not depend directly on one another. This article follows the example in my [23 Design Patterns repository](https://github.com/sanfor2004/23-Design-Patterns/blob/main/behavioral/mediator/README.md), connecting the problem, participating classes, C++20 implementation, and the trade-offs that decide whether to use it.

## The Problem

Username and password fields jointly determine whether a login button is enabled.

## Naive Solution

```cpp
// Each field directly updates the button and reads its sibling.
submit.enable(!username.empty() && !password.empty());
```

## Why It Becomes a Problem

If each field knows the other field and the button, UI rules spread across components and create mutual dependencies.

## The Idea

Fields report changed to LoginForm; the form checks both values and updates the button.

## Reading the illustration

Aircraft do not negotiate runway order pair by pair. A control tower coordinates the shared space and communicates decisions.

In the repository example, the same design idea addresses this software problem: Username and password fields jointly determine whether a login button is enabled.

## Structure

[Diagram](https://github.com/sanfor2004/23-Design-Patterns/blob/main/behavioral/mediator/diagram.md) · [Run the example](https://github.com/sanfor2004/23-Design-Patterns/blob/main/behavioral/mediator/cpp/README.md)

<figure>
  <img src="/images/writing/patterns/diagrams/mediator.svg" alt="Mediator diagram showing the participants and their relationships in the C++ example below." loading="lazy" decoding="async" />
  <figcaption>Mediator: the code structure. Read the participant roles below alongside the arrows. <a href="/images/writing/patterns/diagrams/mediator.svg">Open the full-size diagram</a>.</figcaption>
</figure>

```text
Field::set()  -->  LoginForm(Mediator)  -->  Button::enable()
```

## Participants

Mediator defines notifications. Field reports changes. Button stores enabled state. LoginForm owns colleagues and coordinates them.

Canonical roles in this example:

- [`Colleague`](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md#colleague) — An object whose interactions are coordinated by a Mediator. Here: `Field, Button`.
- [`Concrete Mediator`](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md#concrete-mediator) — An implementation that contains the coordination rules for its Colleagues. Here: `LoginForm`.
- [`callback`](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md#callback) — A function or operation supplied to be called when another operation needs it. Here: `Mediator::changed`.

## Modern C++20 Example

```cpp
#include <iostream>
#include <string>
#include <string_view>
#include <utility>

struct Mediator {
    virtual ~Mediator() = default;
    virtual void changed() = 0;
};
class Field {
    Mediator& mediator_;
    std::string value_;
public:
    explicit Field(Mediator& mediator) : mediator_(mediator) {}
    void set(std::string value) { value_ = std::move(value); mediator_.changed(); }
    bool empty() const { return value_.empty(); }
};
class Button {
    bool enabled_ = false;
public:
    void enable(bool enabled) { enabled_ = enabled; }
    bool enabled() const { return enabled_; }
};
class LoginForm final : public Mediator {
    Field username_;
    Field password_;
    Button submit_;
public:
    LoginForm() : username_(*this), password_(*this) {}
    LoginForm(const LoginForm&) = delete;
    LoginForm& operator=(const LoginForm&) = delete;
    void changed() override { submit_.enable(!username_.empty() && !password_.empty()); }
    void username(std::string value) { username_.set(std::move(value)); }
    void password(std::string value) { password_.set(std::move(value)); }
    bool ready() const { return submit_.enabled(); }
};
int main() {
    LoginForm form;
    form.username("learner");
    std::cout << "Ready: " << std::boolalpha << form.ready() << '\n';
    form.password("example");
    std::cout << "Ready: " << form.ready() << '\n';
}
```

## Example Output

```text
Ready: false
Ready: true
```

## When to Use

Use it when interaction rules between several peers are becoming tangled.

### Use cases

Dialog coordination and workflow controllers fit; enabling a button is not authentication or password validation.

## When NOT to Use

Avoid it for one simple callback or when components have no meaningful coordination rules.

## Advantages

Fields no longer know siblings or the button, and the coordination rule has one home.

## Trade-offs

The mediator can become too large. LoginForm is noncopyable because its fields hold references back to it; copying would leave incorrect links.

## Related Patterns

[Observer](/blog/design-pattern-observer/) · [Facade](/blog/design-pattern-facade/)

## Common Confusion

Observer broadcasts a change to subscribers. Mediator encodes how particular peers should respond to one another; it can use Observer for notifications.

## Terms to Remember

- `Mediator` — Move coordination between peer objects into a dedicated object.
- `Colleague` — An object whose interactions are coordinated by a Mediator. Example: `Field, Button`.
- `Concrete Mediator` — An implementation that contains the coordination rules for its Colleagues. Example: `LoginForm`.
- `callback` — A function or operation supplied to be called when another operation needs it. Example: `Mediator::changed`.

## Interview Vocabulary

- [`loose coupling`](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md#loose-coupling) — Parts know only the small contracts needed to cooperate, limiting change propagation.
- [`separation of concerns`](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md#separation-of-concerns) — Keeping distinct kinds of responsibility apart so they can change independently.
- [`god object`](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md#god-object) — An object accumulating too many unrelated responsibilities.

## Interview Question

Why would an automatically generated copy constructor be dangerous for LoginForm?

## Mini Challenge

Add a terms checkbox and require all three conditions without teaching Field about the button.

## Run and explore the example

The complete code above comes from [behavioral/mediator/cpp/main.cpp](https://github.com/sanfor2004/23-Design-Patterns/blob/main/behavioral/mediator/cpp/main.cpp). Follow the repository's [C++20 build instructions](https://github.com/sanfor2004/23-Design-Patterns/blob/main/CPP_EXAMPLES.md) to compile it and compare the result with [expected.txt](https://github.com/sanfor2004/23-Design-Patterns/blob/main/behavioral/mediator/cpp/expected.txt). The output demonstrates this example's behavior; it does not cover every input or the challenge above.

The source example and adapted explanation are © 2026 Sanfor2004, provided under the [MIT license](/images/writing/patterns/SOURCE-LICENSE.txt). The sketchbook cover is an illustration preserved from this site's original pattern lessons.

## Continue the series

- [Overview: all 23 patterns, their categories, and how to choose](/blog/design-patterns-overview/)
- Previous: [Iterator (Behavioral Pattern)](/blog/design-pattern-iterator/)
- Next: [Memento (Behavioral Pattern)](/blog/design-pattern-memento/)
