---
title: "Design Patterns Overview (Creational, Structural, and Behavioral Patterns)"
description: "Start here: all 23 GoF design patterns, their three categories, class and object scope, prerequisites, and illustrated C++20 articles."
image: "/images/writing/patterns/abstract-factory.webp"
imageAlt: "A furniture workshop assembles matching chairs, tables, and cabinets as one coordinated family."
imageWidth: 1600
imageHeight: 900
pubDate: 2026-09-12
category: "Design Patterns"
tags: ["Design Patterns", "C++", "Architecture", "Software Engineering"]
draft: false
---

Design patterns give us names for recurring design decisions: who creates an object, how components fit together, and who decides what happens next. Knowing a name is useful only when you can explain the problem it solves and the cost of adding it.

This is the starting point for my 24-post series: this overview and one article for each of the 23 patterns. The articles are based on my [23 Design Patterns repository](https://github.com/sanfor2004/23-Design-Patterns), with its C++20 examples, participating classes, expected output, and practical limitations. I have brought the illustrations from my earlier learning collection into the blog so that each idea has both a familiar visual analogy and a concrete implementation.

## What is a design pattern?

A pattern describes a recurring problem, the responsibilities that can solve it, and the consequences of arranging those responsibilities in a particular way. It is a design vocabulary, not a package you install or a requirement to create a fixed number of classes.

For example, choosing a shipping calculation can be a [Strategy](/blog/design-pattern-strategy/) implemented as a callable. You do not need a deep inheritance hierarchy to express that choice. A [Composite](/blog/design-pattern-composite/), on the other hand, becomes useful when a file and a folder need the same operation even though one folder owns more entries.

The familiar group of 23 comes from *Design Patterns: Elements of Reusable Object-Oriented Software* by Erich Gamma, Richard Helm, Ralph Johnson, and John Vlissides, often called the Gang of Four or GoF. The [publisher's catalog](https://www.informit.com/store/design-patterns-elements-of-reusable-object-oriented-software-9780201633610) identifies the book and its pattern chapters. The explanations and runnable examples in this series come from my own repository.

## What you need before starting

You should be comfortable reading a small program with functions, classes, constructors, and a few collaborating objects. You do not need to memorize the catalog first.

- **Interfaces and contracts:** know what an operation promises to its caller, including errors and lifetime requirements.
- **Encapsulation:** understand why a caller should not directly edit another object's internal state.
- **Composition and delegation:** recognize when an object owns or borrows a collaborator and asks it to do part of the work.
- **Inheritance and polymorphism:** understand an overridable operation and a call made through a base interface.
- **Ownership and lifetime:** in the C++ examples, distinguish a value, a borrowed reference, `std::unique_ptr`, `std::shared_ptr`, and `std::weak_ptr`.
- **Testing:** be able to predict output, try a boundary case, and explain what a small example does not test.

The repository's [glossary](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md) explains the terms used in each article. You can read the prose without a compiler. To run the examples, use a C++20 compiler; the repository's combined build also needs CMake 3.20 or newer.

## Three categories: what part of the design changes?

The category in each article title answers a practical question. It is the pattern's purpose, not the name of a programming-language class.

| Category | Question | Typical pressure |
| --- | --- | --- |
| [Creational patterns](#creational-patterns) | How should objects be created or configured? | Concrete construction details are spreading through callers. |
| [Structural patterns](#structural-patterns) | How should objects and classes fit together? | Interfaces, wrappers, or part-whole structures need a clearer boundary. |
| [Behavioral patterns](#behavioral-patterns) | How should work and communication be divided? | Algorithms, requests, transitions, or notifications are becoming tangled. |

There are five creational, seven structural, and eleven behavioral patterns in this series. A real design can combine patterns from more than one category.

## Class scope and object scope

Purpose and scope are different ways of describing a pattern. **Class scope** emphasizes inheritance relationships and behavior supplied by subclasses. **Object scope** emphasizes collaborating instances, usually connected through composition or delegation.

[Factory Method](/blog/design-pattern-factory-method/) and [Template Method](/blog/design-pattern-template-method/) make their extension points especially clear through inheritance. [Strategy](/blog/design-pattern-strategy/) and [Bridge](/blog/design-pattern-bridge/) illustrate composition: a context or abstraction keeps a collaborator behind a contract. Adapter has both class-based and object-based forms; the [Adapter article](/blog/design-pattern-adapter/) uses an object adapter that borrows a sensor.

This distinction helps you ask where change happens. Must someone introduce a subclass, supply a different object, or do both? It does not mean object-scope patterns avoid classes. Their implementations still have types; the flexibility comes from how their objects are connected.

## Creational patterns

The cover's furniture workshop illustrates a related family: choose the style once, then obtain matching pieces. In the [Abstract Factory example](/blog/design-pattern-abstract-factory/), those pieces become a button and a panel from the same theme. Other creational patterns address different construction pressures.

### Abstract Factory

**[Abstract Factory (Creational Pattern)](/blog/design-pattern-abstract-factory/)** — Create compatible families of objects without coupling the client to concrete classes.

Several related objects must vary together. The article explains the participating classes, the implementation, and when that extra structure is unnecessary.

### Builder

**[Builder (Creational Pattern)](/blog/design-pattern-builder/)** — Construct a complex object step by step while allowing different final representations.

Construction has meaningful ordered steps. The article explains the participating classes, the implementation, and when that extra structure is unnecessary.

### Factory Method

**[Factory Method (Creational Pattern)](/blog/design-pattern-factory-method/)** — Let subclasses or specialized creators decide which concrete product to instantiate.

A framework supplies the workflow but extensions choose products. The article explains the participating classes, the implementation, and when that extra structure is unnecessary.

### Prototype

**[Prototype (Creational Pattern)](/blog/design-pattern-prototype/)** — Create new objects by copying an existing configured prototype.

Initialization is expensive or discovered at runtime. The article explains the participating classes, the implementation, and when that extra structure is unnecessary.

### Singleton

**[Singleton (Creational Pattern)](/blog/design-pattern-singleton/)** — Provide one controlled instance and a global access point—while understanding the coupling it creates.

Exactly one process-wide coordinator is a real invariant. The article explains the participating classes, the implementation, and when that extra structure is unnecessary.

## Structural patterns

<figure>
  <img src="/images/writing/patterns/composite.webp" alt="Shipping boxes contain smaller boxes and individual items in a nested structure." width="1600" height="900" loading="lazy" decoding="async" />
  <figcaption>Composite: a box can contain items or smaller boxes. The file-and-folder example uses the same recursive relationship to calculate a total.</figcaption>
</figure>

Structural patterns organize connections. A wrapper may translate an interface, add behavior, or control access; those similar shapes have different intentions. Start by naming the boundary you need.

### Adapter

**[Adapter (Structural Pattern)](/blog/design-pattern-adapter/)** — Translate one interface into another interface the client already understands.

Integrating legacy or third-party code. Read the implementation and its trade-offs before choosing this structure.

### Bridge

**[Bridge (Structural Pattern)](/blog/design-pattern-bridge/)** — Separate an abstraction from its implementation so both dimensions can vary independently.

Two independent dimensions would otherwise multiply subclasses. Read the implementation and its trade-offs before choosing this structure.

### Composite

**[Composite (Structural Pattern)](/blog/design-pattern-composite/)** — Treat individual objects and nested groups through the same component interface.

Data naturally forms a part-whole tree. Read the implementation and its trade-offs before choosing this structure.

### Decorator

**[Decorator (Structural Pattern)](/blog/design-pattern-decorator/)** — Add responsibilities by wrapping an object with components that share its interface.

Responsibilities must be combined dynamically. Read the implementation and its trade-offs before choosing this structure.

### Facade

**[Facade (Structural Pattern)](/blog/design-pattern-facade/)** — Offer a focused entry point to a complex subsystem without removing lower-level access.

Most callers need a small set of common workflows. Read the implementation and its trade-offs before choosing this structure.

### Flyweight

**[Flyweight (Structural Pattern)](/blog/design-pattern-flyweight/)** — Share repeated intrinsic state while keeping context-specific state outside the shared object.

Object count is huge and repeated state dominates memory. Read the implementation and its trade-offs before choosing this structure.

### Proxy

**[Proxy (Structural Pattern)](/blog/design-pattern-proxy/)** — Stand in for another object to control access, loading, location, or instrumentation.

Lazy loading, remote access, authorization, or caching is transparent to clients. Read the implementation and its trade-offs before choosing this structure.

## Behavioral patterns

<figure>
  <img src="/images/writing/patterns/observer.webp" alt="A notification source sends updates to multiple subscribers." width="1600" height="900" loading="lazy" decoding="async" />
  <figcaption>Observer: one change reaches several interested listeners. The example separates the stock publisher from the displays that subscribe to it.</figcaption>
</figure>

Behavioral patterns make responsibility explicit: who chooses an algorithm, handles an event, traverses data, coordinates peers, or remembers an earlier state. The important distinction is the collaboration, not the number of classes.

### Chain of Responsibility

**[Chain of Responsibility (Behavioral Pattern)](/blog/design-pattern-chain-of-responsibility/)** — Pass a request through an ordered chain until a handler processes it or the chain ends.

The receiver is selected dynamically from an ordered pipeline. Follow the article's example, then try its challenge to explore a boundary the demonstration does not cover.

### Command

**[Command (Behavioral Pattern)](/blog/design-pattern-command/)** — Represent a request as an object so it can be queued, logged, retried, or undone.

Operations need queuing, history, retry, or undo. Follow the article's example, then try its challenge to explore a boundary the demonstration does not cover.

### Interpreter

**[Interpreter (Behavioral Pattern)](/blog/design-pattern-interpreter/)** — Represent a small grammar as objects that evaluate expressions in a context.

The grammar is small, stable, and evaluated often. Follow the article's example, then try its challenge to explore a boundary the demonstration does not cover.

### Iterator

**[Iterator (Behavioral Pattern)](/blog/design-pattern-iterator/)** — Traverse a collection without exposing how that collection stores its elements.

A collection needs multiple traversal strategies. Follow the article's example, then try its challenge to explore a boundary the demonstration does not cover.

### Mediator

**[Mediator (Behavioral Pattern)](/blog/design-pattern-mediator/)** — Centralize complex collaboration so peer objects do not depend directly on one another.

Peer-to-peer dependencies have become tangled. Follow the article's example, then try its challenge to explore a boundary the demonstration does not cover.

### Memento

**[Memento (Behavioral Pattern)](/blog/design-pattern-memento/)** — Capture and restore an object’s state without exposing its internal representation.

State snapshots are needed for undo or rollback. Follow the article's example, then try its challenge to explore a boundary the demonstration does not cover.

### Observer

**[Observer (Behavioral Pattern)](/blog/design-pattern-observer/)** — Notify a changing set of subscribers when a subject emits an event or changes state.

One event has multiple independently changing reactions. Follow the article's example, then try its challenge to explore a boundary the demonstration does not cover.

### State

**[State (Behavioral Pattern)](/blog/design-pattern-state/)** — Change an object’s behavior when its internal state changes by delegating to state objects.

Behavior changes substantially across explicit states. Follow the article's example, then try its challenge to explore a boundary the demonstration does not cover.

### Strategy

**[Strategy (Behavioral Pattern)](/blog/design-pattern-strategy/)** — Package interchangeable algorithms behind one interface and choose among them by composition.

Several algorithms solve the same defined task. Follow the article's example, then try its challenge to explore a boundary the demonstration does not cover.

### Template Method

**[Template Method (Behavioral Pattern)](/blog/design-pattern-template-method/)** — Define an algorithm’s stable skeleton while allowing selected steps to vary in subclasses.

The workflow order is invariant but selected steps vary. Follow the article's example, then try its challenge to explore a boundary the demonstration does not cover.

### Visitor

**[Visitor (Behavioral Pattern)](/blog/design-pattern-visitor/)** — Add operations across a stable set of element types without placing every operation on those elements.

Element types are stable while new operations are frequent. Follow the article's example, then try its challenge to explore a boundary the demonstration does not cover.

## Where would I use these ideas?

The repository examples are small enough to trace. Their application contexts suggest where to investigate a pattern, not proof that the demonstrations are production-ready services.

| Situation | Patterns to compare | Question to settle first |
| --- | --- | --- |
| Configuring a request or choosing a service implementation | [Builder](/blog/design-pattern-builder/), [Factory Method](/blog/design-pattern-factory-method/), [Abstract Factory](/blog/design-pattern-abstract-factory/) | Are you assembling options, choosing one product, or coordinating a family? |
| Connecting an existing library or simplifying a workflow | [Adapter](/blog/design-pattern-adapter/), [Facade](/blog/design-pattern-facade/) | Do you need compatibility or a smaller entry point? |
| Adding optional features or deferring expensive work | [Decorator](/blog/design-pattern-decorator/), [Proxy](/blog/design-pattern-proxy/) | Are you adding responsibility or controlling access? |
| Choosing a shipping rule or managing a device lifecycle | [Strategy](/blog/design-pattern-strategy/), [State](/blog/design-pattern-state/) | Is behavior selected as a policy or determined by the current state? |
| Editing a document with history | [Command](/blog/design-pattern-command/), [Memento](/blog/design-pattern-memento/) | Must you remember an action, a snapshot, or both? |
| Updating screens after a change | [Observer](/blog/design-pattern-observer/), [Mediator](/blog/design-pattern-mediator/) | Are you broadcasting a change or coordinating specific peers? |
| Processing a tree | [Composite](/blog/design-pattern-composite/), [Iterator](/blog/design-pattern-iterator/), [Visitor](/blog/design-pattern-visitor/) | Are you modeling the structure, traversing it, or adding typed operations? |

For instance, wrapping a payment library can make its interface easier to use, but it does not make a checkout transaction atomic. The [Facade article](/blog/design-pattern-facade/) explicitly keeps that limitation visible. Likewise, a [Singleton](/blog/design-pattern-singleton/) may have safe initialization while its later mutations still need synchronization.

## A practical reading order

If you are new to the subject, follow the repository's progression rather than trying to memorize the alphabetical catalog:

1. [Strategy](/blog/design-pattern-strategy/), [Observer](/blog/design-pattern-observer/), [Factory Method](/blog/design-pattern-factory-method/), and [Adapter](/blog/design-pattern-adapter/) introduce small, visible boundaries.
2. [Decorator](/blog/design-pattern-decorator/), [Command](/blog/design-pattern-command/), [Composite](/blog/design-pattern-composite/), and [State](/blog/design-pattern-state/) add composition, history, trees, and transitions.
3. [Facade](/blog/design-pattern-facade/), [Builder](/blog/design-pattern-builder/), [Template Method](/blog/design-pattern-template-method/), [Bridge](/blog/design-pattern-bridge/), [Proxy](/blog/design-pattern-proxy/), [Chain of Responsibility](/blog/design-pattern-chain-of-responsibility/), and [Mediator](/blog/design-pattern-mediator/) broaden the design choices.
4. [Abstract Factory](/blog/design-pattern-abstract-factory/), [Prototype](/blog/design-pattern-prototype/), [Memento](/blog/design-pattern-memento/), [Iterator](/blog/design-pattern-iterator/), [Flyweight](/blog/design-pattern-flyweight/), [Interpreter](/blog/design-pattern-interpreter/), [Visitor](/blog/design-pattern-visitor/), and [Singleton](/blog/design-pattern-singleton/) deserve extra attention to ownership, copying, dispatch, and global state.

For each article, read the problem before the code. Predict the output, trace who owns each object, then change the example using its mini challenge. Compare the simplest alternative with the pattern and explain which change made the extra structure worthwhile.

## Run the C++20 examples

Clone the repository and run these commands there, not in the portfolio source:

```sh
git clone https://github.com/sanfor2004/23-Design-Patterns.git
cd 23-Design-Patterns
cmake -S . -B build -DCMAKE_BUILD_TYPE=Debug
cmake --build build --config Debug
ctest --test-dir build -C Debug --output-on-failure
```

On Windows, use a Visual Studio developer shell with C++ tools installed. The [build guide](https://github.com/sanfor2004/23-Design-Patterns/blob/main/CPP_EXAMPLES.md) explains single-pattern targets and compiler choices. Each example has a `main.cpp` and an `expected.txt`; the checks compare the demonstration's output, not every possible behavior of an application using the pattern.

## When you do not need a pattern

Keep the simple design when one function, a small value type, or a readable conditional expresses the requirement. Repetition in syntax is not always evidence of the same responsibility. An abstraction chosen before the variation is understood can make unrelated changes depend on one another.

Before introducing a pattern, answer four questions: What is changing? Which caller currently knows too much? What contract will remain stable? What new cost will the pattern introduce? Costs include extra types, indirection, copying, retained memory, difficult lifetimes, and less visible control flow.

The aim of this series is to make those decisions explainable. Use the [complete illustrated index above](#creational-patterns) to find a pattern, and return here when two patterns seem similar.

## Source and illustration notes

The [23 Design Patterns repository](https://github.com/sanfor2004/23-Design-Patterns) is the source for the C++20 examples and adapted articles. It also contains [comparisons](https://github.com/sanfor2004/23-Design-Patterns/blob/main/COMPARISONS.md), a [cheat sheet](https://github.com/sanfor2004/23-Design-Patterns/blob/main/CHEATSHEET.md), and a [relationship map](https://github.com/sanfor2004/23-Design-Patterns/blob/main/PATTERN_MAP.md).

All 23 sketchbook covers are preserved from the site's earlier learning collection. They illustrate analogies; the separate diagrams show the example's structure. Source code, adapted documentation, and diagrams retain the repository's [license notice](/images/writing/patterns/SOURCE-LICENSE.txt).
