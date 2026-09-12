---
title: "Interpreter (Behavioral Pattern)"
description: "Represent a small grammar as objects that evaluate expressions in a context."
image: "/images/writing/patterns/interpreter.webp"
imageAlt: "Symbol cards are combined into a small expression using grammar rules."
imageWidth: 1600
imageHeight: 900
pubDate: 2026-09-11
updatedDate: 2026-09-12
category: "Design Patterns"
tags: ["Design Patterns", "Behavioral Patterns", "C++", "Software Engineering"]
draft: false
---

[Start with the design patterns overview](/blog/design-patterns-overview/) · Part 15 of 23 · Behavioral patterns

Represent a small grammar as objects that evaluate expressions in a context. This article follows the example in my [23 Design Patterns repository](https://github.com/sanfor2004/23-Design-Patterns/blob/main/behavioral/interpreter/README.md), connecting the problem, participating classes, C++20 implementation, and the trade-offs that decide whether to use it.

## The Problem

Permission rules combine named roles and conjunctions, and rules should be built as data structures.

## Naive Solution

```cpp
bool allowed = roles.contains("editor") && roles.contains("verified");
```

## Why It Becomes a Problem

One hardcoded boolean expression is simple but changing nested rule structures requires changing application code.

## The Idea

Role is a terminal expression. Both is a nonterminal that evaluates two child expressions with short-circuit AND.

## Reading the illustration

A phrasebook contains rules for combining known words. Each grammar rule knows how to interpret its part of the sentence.

In the repository example, the same design idea addresses this software problem: Permission rules combine named roles and conjunctions, and rules should be built as data structures.

## Structure

[Diagram](https://github.com/sanfor2004/23-Design-Patterns/blob/main/behavioral/interpreter/diagram.md) · [Run the example](https://github.com/sanfor2004/23-Design-Patterns/blob/main/behavioral/interpreter/cpp/README.md)

<figure>
  <img src="/images/writing/patterns/diagrams/interpreter.svg" alt="Interpreter diagram showing the participants and their relationships in the C++ example below." loading="lazy" decoding="async" />
  <figcaption>Interpreter: the code structure. Read the participant roles below alongside the arrows. <a href="/images/writing/patterns/diagrams/interpreter.svg">Open the full-size diagram</a>.</figcaption>
</figure>

```text
Context  -->  Both(Expression, Expression)  -->  Role / nested Both
```

## Participants

Expression defines evaluation, Context supplies roles, Role tests membership, Both owns its child expressions.

Canonical roles in this example:

- [`Abstract Expression`](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md#abstract-expression) — The contract for evaluating nodes in an Interpreter grammar. Here: `Expression`.
- [`Terminal Expression`](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md#terminal-expression) — An expression with no child expressions. Here: `Role`.
- [`Nonterminal Expression`](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md#nonterminal-expression) — An expression that combines child expressions according to a grammar rule. Here: `Both`.
- `Context` — The evaluation data used by expressions; here it is the set of role names. `Context`.

## Modern C++20 Example

```cpp
#include <iostream>
#include <memory>
#include <stdexcept>
#include <string>
#include <unordered_set>
#include <utility>

using Context = std::unordered_set<std::string>;
struct Expression {
    virtual ~Expression() = default;
    virtual bool evaluate(const Context& context) const = 0;
};
class Role final : public Expression {
    std::string name_;
public:
    explicit Role(std::string name) : name_(std::move(name)) {}
    bool evaluate(const Context& context) const override { return context.contains(name_); }
};
class Both final : public Expression {
    std::unique_ptr<Expression> left_, right_;
public:
    Both(std::unique_ptr<Expression> left, std::unique_ptr<Expression> right)
        : left_(std::move(left)), right_(std::move(right)) {
        if (!left_ || !right_) throw std::invalid_argument("Missing expression");
    }
    bool evaluate(const Context& context) const override {
        return left_->evaluate(context) && right_->evaluate(context);
    }
};
int main() {
    const Both rule{std::make_unique<Role>("editor"), std::make_unique<Role>("verified")};
    std::cout << std::boolalpha << rule.evaluate(Context{"editor"}) << '\n';
    std::cout << rule.evaluate(Context{"editor", "verified"}) << '\n';
}
```

## Example Output

```text
false
true
```

## When to Use

Use it for a small stable grammar whose expression tree is useful to construct and inspect.

### Use cases

Small filtering or eligibility languages fit; this is not a secure authorization system or a general parser.

## When NOT to Use

Avoid it for a large language needing robust parsing, diagnostics and optimization; established parser tools are more appropriate.

## Advantages

Rules compose recursively and can be evaluated against different contexts.

## Trade-offs

Each grammar form adds code. Deep trees risk stack exhaustion, and a parser is deliberately absent: main constructs the syntax tree directly.

## Related Patterns

[Composite](/blog/design-pattern-composite/) · [Visitor](/blog/design-pattern-visitor/)

## Common Confusion

Composite describes the tree structure; Interpreter adds grammar-specific meaning and evaluation. Visitor can add operations over that tree.

## Terms to Remember

- `Interpreter` — Represent a small language as objects that evaluate its grammar rules.
- `Abstract Expression` — The contract for evaluating nodes in an Interpreter grammar. Example: `Expression`.
- `Terminal Expression` — An expression with no child expressions. Example: `Role`.
- `Nonterminal Expression` — An expression that combines child expressions according to a grammar rule. Example: `Both`.
- `Context` — The evaluation data used by expressions; here it is the set of role names.

## Interview Vocabulary

- [`abstract syntax tree`](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md#abstract-syntax-tree) — A tree representing grammatical structure rather than the original text's surface formatting.
- [`recursive composition`](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md#recursive-composition) — Building a structure from parts that expose the same contract as the whole.
- [`short-circuit evaluation`](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md#short-circuit-evaluation) — Skipping later operands when an earlier result already determines the answer.

## Interview Question

Where would precedence be handled if users typed editor AND verified OR admin?

## Mini Challenge

Add Either for OR and test a nested rule with three distinct contexts.

## Run and explore the example

The complete code above comes from [behavioral/interpreter/cpp/main.cpp](https://github.com/sanfor2004/23-Design-Patterns/blob/main/behavioral/interpreter/cpp/main.cpp). Follow the repository's [C++20 build instructions](https://github.com/sanfor2004/23-Design-Patterns/blob/main/CPP_EXAMPLES.md) to compile it and compare the result with [expected.txt](https://github.com/sanfor2004/23-Design-Patterns/blob/main/behavioral/interpreter/cpp/expected.txt). The output demonstrates this example's behavior; it does not cover every input or the challenge above.

The source example and adapted explanation are © 2026 Sanfor2004, provided under the [MIT license](/images/writing/patterns/SOURCE-LICENSE.txt). The sketchbook cover is an illustration preserved from this site's original pattern lessons.

## Continue the series

- [Overview: all 23 patterns, their categories, and how to choose](/blog/design-patterns-overview/)
- Previous: [Command (Behavioral Pattern)](/blog/design-pattern-command/)
- Next: [Iterator (Behavioral Pattern)](/blog/design-pattern-iterator/)
