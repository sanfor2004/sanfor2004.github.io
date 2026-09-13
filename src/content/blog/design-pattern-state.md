---
title: "State (Behavioral Pattern)"
description: "Change an object’s behavior when its internal state changes by delegating to state objects."
image: "/images/writing/patterns/state.webp"
imageAlt: "A traffic signal changes between distinct operating states."
imageWidth: 1600
imageHeight: 900
pubDate: 2026-09-11
updatedDate: 2026-09-14
category: "Design Patterns"
tags: ["Design Patterns", "Behavioral Patterns", "Python", "C++", "Software Engineering"]
draft: false
---

[Start with the design patterns overview](/blog/design-patterns-overview/) · Part 20 of 23 · Behavioral patterns

Change an object’s behavior when its internal state changes by delegating to state objects. This article follows the example in my [23 Design Patterns repository](https://github.com/sanfor2004/23-Design-Patterns/blob/main/behavioral/state/README.md), connecting the problem, participating classes, Python and C++20 implementations, and the trade-offs that decide whether to use it.

## The Problem

A door reacts to the same button differently when open and closed; richer devices add locked or jammed states.

## Naive Solution

```cpp
if (open) open = false;
else open = true; // becomes scattered as states and events grow
```

## Why It Becomes a Problem

A boolean toggle is enough for two states, but copying state conditionals across many events makes transitions inconsistent.

## The Idea

Door delegates press to its current DoorState, and that state selects the next state.

## Reading the illustration

A traffic light responds differently to the same timer tick depending on whether it is currently red, yellow, or green.

In the repository example, the same design idea addresses this software problem: A door reacts to the same button differently when open and closed; richer devices add locked or jammed states.

## Structure

[Diagram](https://github.com/sanfor2004/23-Design-Patterns/blob/main/behavioral/state/diagram.md) · [Python source](https://github.com/sanfor2004/23-Design-Patterns/blob/main/behavioral/state/python/main.py) · [C++20 source](https://github.com/sanfor2004/23-Design-Patterns/blob/main/behavioral/state/cpp/main.cpp)

<figure>
  <img src="/images/writing/patterns/diagrams/state.svg" alt="State sketch map: Door::press() leads through DoorState to Open ↔ Closed." loading="lazy" decoding="async" />
  <figcaption>State: trace the example from caller through the pattern boundary to its collaborator or result. The arrows show flow, not ownership. <a href="/images/writing/patterns/diagrams/state.svg">Open the full-size diagram</a>.</figcaption>
</figure>

```text
Door::press()  -->  DoorState  -->  Open ↔ Closed
```

## Participants

Door is the context. DoorState defines press and name. Open and Closed hold non-owning links to the next state; main keeps both alive longer than Door.

Canonical roles in this example:

- [`Context`](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md#context) — The object that uses a Strategy or delegates behavior to its current State. Here: `Door`.
- [`State interface`](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md#state-interface) — The contract through which a Context delegates state-dependent behavior. Here: `DoorState`.
- [`Concrete State`](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md#concrete-state) — An implementation defining behavior and transitions for one State. Here: `Open, Closed`.

## Python Example

The complete [Python source](https://github.com/sanfor2004/23-Design-Patterns/blob/main/behavioral/state/python/main.py) is shown first.

```python
class Closed:
    name = "closed"

    def press(self, door):
        door.state = Open()


class Open:
    name = "open"

    def press(self, door):
        door.state = Closed()


class Door:
    def __init__(self):
        self.state = Closed()

    def press(self):
        self.state.press(self)


if __name__ == "__main__":
    door = Door()
    print(door.state.name)
    door.press()
    print(door.state.name)
    door.press()
    print(door.state.name)
```

## Python Output

```text
closed
open
closed
```

## Code Walkthrough

Door is the context. DoorState defines press and name. Open and Closed hold non-owning links to the next state; main keeps both alive longer than Door.

Start at the final call in the Python example. Follow the middle role in the diagram and compare how the C++20 version handles the same responsibility.

## C++20 Example

```cpp
#include <iostream>
#include <string_view>

class Door;
struct DoorState {
    virtual ~DoorState() = default;
    virtual void press(Door& door) const = 0;
    virtual std::string_view name() const = 0;
};
class Door {
    const DoorState* state_;
public:
    explicit Door(const DoorState& state) : state_(&state) {}
    void change(const DoorState& state) { state_ = &state; }
    void press() { state_->press(*this); }
    std::string_view name() const { return state_->name(); }
};
struct Open final : DoorState {
    const DoorState* next = nullptr;
    void press(Door& door) const override { if (next) door.change(*next); }
    std::string_view name() const override { return "open"; }
};
struct Closed final : DoorState {
    const DoorState* next = nullptr;
    void press(Door& door) const override { if (next) door.change(*next); }
    std::string_view name() const override { return "closed"; }
};
int main() {
    Open open;
    Closed closed;
    open.next = &closed;
    closed.next = &open;
    Door door{closed};
    std::cout << door.name() << '\n';
    door.press();
    std::cout << door.name() << '\n';
    door.press();
    std::cout << door.name() << '\n';
}
```

## C++20 Output

```text
closed
open
closed
```

## When to Use

Use it when state-dependent behavior and transitions spread across several operations.

### Use cases

Protocol sessions and device workflows are suitable contexts when transition rules are explicit.

## When NOT to Use

Avoid it for a trivial toggle or a small explicit enum transition table that stays readable.

## Advantages

Behavior is grouped by state and transitions can be inspected locally.

## Trade-offs

Classes and [`lifetime`](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md#lifetime) (The interval during which an object exists and may be used according to its rules) relationships add complexity. The demo keeps state objects outside Door, so transitions never destroy the currently executing state; larger designs must preserve that safety.

## Related Patterns

[Strategy](/blog/design-pattern-strategy/) · [Observer](/blog/design-pattern-observer/)

## Common Confusion

Strategy is usually selected by a client to choose an algorithm. State represents [`lifecycle`](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md#lifecycle) (The modeled stages and transitions of a domain entity, distinct from a C++ object's lifetime) and may choose its own transitions.

## Terms to Remember

- `State` — Let an object's current state determine its response and transitions.
- `Context` — The object that uses a Strategy or delegates behavior to its current State. Example: `Door`.
- `State interface` — The contract through which a Context delegates state-dependent behavior. Example: `DoorState`.
- `Concrete State` — An implementation defining behavior and transitions for one State. Example: `Open, Closed`.

## Interview Vocabulary

- [`state transition`](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md#state-transition) — A move from one modeled condition to another after an event.
- [`runtime behavior`](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md#runtime-behavior) — What the program does while executing, including behavior selected from runtime input.
- [`delegation`](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md#delegation) — An object asks a collaborator to perform part of its work.

## Interview Question

Who decides the next state here, and how is that different from choosing a shipping Strategy?

## Mini Challenge

Add Locked so press keeps it locked; provide a separate unlock event and test the transition sequence.

## Compare the two versions

Python creates a new stateless State Object for each transition. C++ reuses Open and Closed Objects through borrowed pointers; they must outlive Door. Both move transition behavior into State Objects. A boolean toggle is simpler for this tiny domain. The two examples express the same pattern responsibility; compare their setup and output before changing an input.

## Check yourself

1. Who chooses the next State when the door button is pressed?
2. When would the naive solution on this page be easier to maintain? Give a concrete example.
3. Change one input in the Python example. Predict the output and explain which responsibility handles the change.

## Run and explore the example

The Python code comes from [python/main.py](https://github.com/sanfor2004/23-Design-Patterns/blob/main/behavioral/state/python/main.py), with [expected output](https://github.com/sanfor2004/23-Design-Patterns/blob/main/behavioral/state/python/expected.txt). The C++20 code comes from [behavioral/state/cpp/main.cpp](https://github.com/sanfor2004/23-Design-Patterns/blob/main/behavioral/state/cpp/main.cpp). Follow the repository's [C++20 build instructions](https://github.com/sanfor2004/23-Design-Patterns/blob/main/CPP_EXAMPLES.md) to compile it and compare the result with [expected.txt](https://github.com/sanfor2004/23-Design-Patterns/blob/main/behavioral/state/cpp/expected.txt). The output demonstrates this example's behavior; it does not cover every input or the challenge above.

The source example and adapted explanation are © 2026 Sanfor2004, provided under the [MIT license](/images/writing/patterns/SOURCE-LICENSE.txt). The sketchbook cover is an illustration preserved from this site's original pattern lessons.

## Continue the series

- [Overview: all 23 patterns, their categories, and how to choose](/blog/design-patterns-overview/)
- Previous: [Observer (Behavioral Pattern)](/blog/design-pattern-observer/)
- Next: [Strategy (Behavioral Pattern)](/blog/design-pattern-strategy/)
