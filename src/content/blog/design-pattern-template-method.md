---
title: "Template Method (Behavioral Pattern)"
description: "Define an algorithm’s stable skeleton while allowing selected steps to vary in subclasses."
image: "/images/writing/patterns/template-method.webp"
imageAlt: "Different cooks follow the same sequence of recipe steps."
imageWidth: 1600
imageHeight: 900
pubDate: 2026-09-11
updatedDate: 2026-09-14
category: "Design Patterns"
tags: ["Design Patterns", "Behavioral Patterns", "Python", "C++", "Software Engineering"]
draft: false
---

[Start with the design patterns overview](/blog/design-patterns-overview/) · Part 22 of 23 · Behavioral patterns

Define an algorithm’s stable skeleton while allowing selected steps to vary in subclasses. This article follows the example in my [23 Design Patterns repository](https://github.com/sanfor2004/23-Design-Patterns/blob/main/behavioral/template-method/README.md), connecting the problem, participating classes, Python and C++20 implementations, and the trade-offs that decide whether to use it.

## The Problem

Reports share begin, read, format and end steps but vary their data access or formatting.

## Naive Solution

```cpp
void text_report() { /* begin, read, format, end */ }
void html_report() { /* duplicated order, different format */ }
```

## Why It Becomes a Problem

Separate complete report functions duplicate ordering and can drift when a shared step changes.

## The Idea

Report::generate is nonvirtual and calls protected virtual read and format hooks in a fixed order.

## Reading the illustration

A recipe fixes the order—prepare, cook, serve—but different chefs provide the ingredient-specific steps.

In the repository example, the same design idea addresses this software problem: Reports share begin, read, format and end steps but vary their data access or formatting.

## Structure

[Diagram](https://github.com/sanfor2004/23-Design-Patterns/blob/main/behavioral/template-method/diagram.md) · [Python source](https://github.com/sanfor2004/23-Design-Patterns/blob/main/behavioral/template-method/python/main.py) · [C++20 source](https://github.com/sanfor2004/23-Design-Patterns/blob/main/behavioral/template-method/cpp/main.cpp)

<figure>
  <img src="/images/writing/patterns/diagrams/template-method.svg" alt="Template Method sketch map: Report::generate() leads through read() + format() to TextReport overrides." loading="lazy" decoding="async" />
  <figcaption>Template Method: trace the example from caller through the pattern boundary to its collaborator or result. The arrows show flow, not ownership. <a href="/images/writing/patterns/diagrams/template-method.svg">Open the full-size diagram</a>.</figcaption>
</figure>

```text
Report::generate()  -->  read() + format()  -->  TextReport overrides
```

## Participants

Report owns the algorithm skeleton; TextReport implements variation points. The client calls generate through the public workflow.

Canonical roles in this example:

- [`Abstract Class`](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md#abstract-class-template-method-role) — The Template Method role that owns the algorithm skeleton and declares variable steps. Here: `Report`.
- [`Concrete Class`](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md#concrete-class-template-method-role) — The Template Method role that supplies the variable steps. Here: `TextReport`.
- [`hook method`](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md#hook-method) — An extension operation called by a fixed workflow; it may have a default implementation. Here: `read, format`.

## Python Example

The complete [Python source](https://github.com/sanfor2004/23-Design-Patterns/blob/main/behavioral/template-method/python/main.py) is shown first.

```python
class Report:
    def generate(self):
        print("Begin report")
        data = self.read()
        self.format(data)
        print("End report")

    def read(self):
        raise NotImplementedError

    def format(self, data):
        raise NotImplementedError


class TextReport(Report):
    def read(self):
        return "sales=42"

    def format(self, data):
        print(data)


if __name__ == "__main__":
    TextReport().generate()
```

## Python Output

```text
Begin report
sales=42
End report
```

## Code Walkthrough

Report owns the algorithm skeleton; TextReport implements variation points. The client calls generate through the public workflow.

Start at the final call in the Python example. Follow the middle role in the diagram and compare how the C++20 version handles the same responsibility.

## C++20 Example

```cpp
#include <iostream>
#include <string>
#include <string_view>

class Report {
protected:
    virtual std::string read() const = 0;
    virtual void format(std::string_view data) const = 0;
public:
    virtual ~Report() = default;
    void generate() const {
        std::cout << "Begin report\n";
        const auto data = read();
        format(data);
        std::cout << "End report\n";
    }
};
class TextReport final : public Report {
    std::string read() const override { return "sales=42"; }
    void format(std::string_view data) const override { std::cout << data << '\n'; }
};
int main() { TextReport{}.generate(); }
```

## C++20 Output

```text
Begin report
sales=42
End report
```

## When to Use

Use it for a stable sequence with a few well-defined subclass extension points.

### Use cases

Import pipelines and report generation fit when the skeleton is stable.

## When NOT to Use

Avoid it if steps must be rearranged at [`runtime`](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md#runtime) (The period when a compiled program is executing) or [`composition`](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md#composition) (Building behavior by connecting objects that use or contain other objects) would make dependencies clearer.

## Advantages

Shared ordering rules stay in the base and subclasses implement only their differences.

## Trade-offs

Inheritance couples subclasses to the base protocol. End is not guaranteed if read or format throws; use [`RAII`](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md#raii) (Resource Acquisition Is Initialization: tie resource ownership to object lifetime so destruction releases it) for real resource cleanup rather than treating the final step as a destructor.

## Related Patterns

[Strategy](/blog/design-pattern-strategy/) · [Factory Method](/blog/design-pattern-factory-method/)

## Common Confusion

Strategy injects replaceable behavior. Template Method relies on inherited hooks. Factory Method can be one creation hook inside such a skeleton.

## Terms to Remember

- `Template Method` — Fix an algorithm's sequence while subclasses implement selected steps.
- `Abstract Class` — The Template Method role that owns the algorithm skeleton and declares variable steps. Example: `Report`.
- `Concrete Class` — The Template Method role that supplies the variable steps. Example: `TextReport`.
- `hook method` — An extension operation called by a fixed workflow; it may have a default implementation. Example: `read, format`.

## Interview Vocabulary

- [`algorithm skeleton`](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md#algorithm-skeleton) — The fixed sequence of an algorithm whose selected steps can vary.
- [`inheritance`](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md#inheritance) — Defining a derived class from a base class to reuse or specialize its contract and implementation.
- [`Open/Closed Principle`](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md#openclosed-principle) — Aim for open for extension, closed for modification at a useful, chosen boundary.

## Interview Question

Why is generate nonvirtual while read and format are virtual? What invariants does that express?

## Mini Challenge

Add CsvReport and verify the begin/end order; then simulate a formatting exception and discuss cleanup.

## Compare the two versions

Both versions use Inheritance to keep the sequence in `generate` and vary individual steps. C++ marks the steps virtual and keeps the workflow non-virtual. Python can override any method, so keeping the sequence fixed is a design convention. Injected callables are an alternative when Composition fits better. The two examples express the same pattern responsibility; compare their setup and output before changing an input.

## Check yourself

1. Which method owns the step order, and which methods can vary?
2. When would the naive solution on this page be easier to maintain? Give a concrete example.
3. Change one input in the Python example. Predict the output and explain which responsibility handles the change.

## Run and explore the example

The Python code comes from [python/main.py](https://github.com/sanfor2004/23-Design-Patterns/blob/main/behavioral/template-method/python/main.py), with [expected output](https://github.com/sanfor2004/23-Design-Patterns/blob/main/behavioral/template-method/python/expected.txt). The C++20 code comes from [behavioral/template-method/cpp/main.cpp](https://github.com/sanfor2004/23-Design-Patterns/blob/main/behavioral/template-method/cpp/main.cpp). Follow the repository's [C++20 build instructions](https://github.com/sanfor2004/23-Design-Patterns/blob/main/CPP_EXAMPLES.md) to compile it and compare the result with [expected.txt](https://github.com/sanfor2004/23-Design-Patterns/blob/main/behavioral/template-method/cpp/expected.txt). The output demonstrates this example's behavior; it does not cover every input or the challenge above.

The source example and adapted explanation are © 2026 Sanfor2004, provided under the [MIT license](/images/writing/patterns/SOURCE-LICENSE.txt). The sketchbook cover is an illustration preserved from this site's original pattern lessons.

## Continue the series

- [Overview: all 23 patterns, their categories, and how to choose](/blog/design-patterns-overview/)
- Previous: [Strategy (Behavioral Pattern)](/blog/design-pattern-strategy/)
- Next: [Visitor (Behavioral Pattern)](/blog/design-pattern-visitor/)
