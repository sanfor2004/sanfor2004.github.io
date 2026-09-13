---
title: "Proxy (Structural Pattern)"
description: "Stand in for another object to control access, loading, location, or instrumentation."
image: "/images/writing/patterns/proxy.webp"
imageAlt: "A bank card mediates access to an account."
imageWidth: 1600
imageHeight: 900
pubDate: 2026-09-11
updatedDate: 2026-09-14
category: "Design Patterns"
tags: ["Design Patterns", "Structural Patterns", "Python", "C++", "Software Engineering"]
draft: false
---

[Start with the design patterns overview](/blog/design-patterns-overview/) · Part 12 of 23 · Structural patterns

Stand in for another object to control access, loading, location, or instrumentation. This article follows the example in my [23 Design Patterns repository](https://github.com/sanfor2004/23-Design-Patterns/blob/main/structural/proxy/README.md), connecting the problem, participating classes, Python and C++20 implementations, and the trade-offs that decide whether to use it.

## The Problem

A gallery may prepare many images but display only a few.

## Naive Solution

```cpp
DiskImage image; // loads even if never displayed
```

## Why It Becomes a Problem

Constructing every heavy image immediately performs unnecessary loading before anyone asks to display it.

## The Idea

LazyImage implements Image and creates DiskImage on the first display call, then reuses it.

## Reading the illustration

A bank card stands between you and the account. It represents access to the money while checking identity, limits, and transaction rules.

In the repository example, the same design idea addresses this software problem: A gallery may prepare many images but display only a few.

## Structure

[Diagram](https://github.com/sanfor2004/23-Design-Patterns/blob/main/structural/proxy/diagram.md) · [Python source](https://github.com/sanfor2004/23-Design-Patterns/blob/main/structural/proxy/python/main.py) · [C++20 source](https://github.com/sanfor2004/23-Design-Patterns/blob/main/structural/proxy/cpp/main.cpp)

<figure>
  <img src="/images/writing/patterns/diagrams/proxy.svg" alt="Proxy sketch map: Client(Image) leads through LazyImage to DiskImage." loading="lazy" decoding="async" />
  <figcaption>Proxy: trace the example from caller through the pattern boundary to its collaborator or result. The arrows show flow, not ownership. <a href="/images/writing/patterns/diagrams/proxy.svg">Open the full-size diagram</a>.</figcaption>
</figure>

```text
Client(Image)  -->  LazyImage  -->  DiskImage
```

## Participants

Image is the shared interface; DiskImage performs the real work; LazyImage owns the lazily created subject.

Canonical roles in this example:

- [`Subject interface`](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md#subject-interface) — The shared contract offered by a Proxy and its Real Subject. Here: `Image`.
- [`Real Subject`](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md#real-subject) — The object that does the work behind a Proxy. Here: `DiskImage`.
- [`lazy initialization`](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md#lazy-initialization) — Deferring creation until the value or resource is first needed. Here: `LazyImage::display`.

## Python Example

The complete [Python source](https://github.com/sanfor2004/23-Design-Patterns/blob/main/structural/proxy/python/main.py) is shown first.

```python
class DiskImage:
    def __init__(self):
        print("Load image")

    def display(self):
        print("Display image")


class LazyImage:
    def __init__(self):
        self.image = None

    def display(self):
        if self.image is None:
            self.image = DiskImage()
        self.image.display()


if __name__ == "__main__":
    image = LazyImage()
    print("Proxy ready")
    image.display()
    image.display()
```

## Python Output

```text
Proxy ready
Load image
Display image
Display image
```

## Code Walkthrough

Image is the shared interface; DiskImage performs the real work; LazyImage owns the lazily created subject.

Start at the final call in the Python example. Follow the middle role in the diagram and compare how the C++20 version handles the same responsibility.

## C++20 Example

```cpp
#include <iostream>
#include <memory>

struct Image {
    virtual ~Image() = default;
    virtual void display() const = 0;
};
struct DiskImage final : Image {
    DiskImage() { std::cout << "Load image\n"; }
    void display() const override { std::cout << "Display image\n"; }
};
class LazyImage final : public Image {
    mutable std::unique_ptr<DiskImage> image_;
public:
    void display() const override {
        if (!image_) image_ = std::make_unique<DiskImage>();
        image_->display();
    }
};
int main() {
    const LazyImage image;
    std::cout << "Proxy ready\n";
    image.display();
    image.display();
}
```

## C++20 Output

```text
Proxy ready
Load image
Display image
Display image
```

## When to Use

Use it for lazy initialization, access checks or remote access when a stable subject interface is useful.

### Use cases

Lazy media access, authorization gates and remote object stubs are possible uses, with different failure semantics.

## When NOT to Use

Avoid it if direct construction is cheap and the access policy adds no value.

## Advantages

Callers use the same display interface while creation is deferred.

## Trade-offs

The first call now bears loading cost. mutable enables logical constness here but does not make concurrent display safe; loading failures also need a policy.

## Related Patterns

[Decorator](/blog/design-pattern-decorator/) · [Adapter](/blog/design-pattern-adapter/)

## Common Confusion

Decorator adds behavior; Proxy controls when or whether a subject is reached. Their class diagrams can look similar.

## Terms to Remember

- `Proxy` — Control access to an object through a stand-in with the same interface.
- `Subject interface` — The shared contract offered by a Proxy and its Real Subject. Example: `Image`.
- `Real Subject` — The object that does the work behind a Proxy. Example: `DiskImage`.
- `lazy initialization` — Deferring creation until the value or resource is first needed. Example: `LazyImage::display`.

## Interview Vocabulary

- [`delegation`](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md#delegation) — An object asks a collaborator to perform part of its work.
- [`runtime behavior`](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md#runtime-behavior) — What the program does while executing, including behavior selected from runtime input.
- [`trade-off`](https://github.com/sanfor2004/23-Design-Patterns/blob/main/GLOSSARY.md#trade-off) — A benefit gained at the cost of another desirable property.

## Interview Question

If loading throws, should the proxy retry on the next call or remember failure? Explain your contract.

## Mini Challenge

Count loads across three display calls and add a failure-once loader to test your retry policy.

## Compare the two versions

Python starts with `None`; C++ starts with an empty `unique_ptr`. Both create the real image on the first call. C++ uses `mutable` to cache inside a const operation. Neither version synchronizes concurrent calls or demonstrates access control; this is a virtual Proxy for lazy loading. The two examples express the same pattern responsibility; compare their setup and output before changing an input.

## Check yourself

1. How many real images exist after two display calls, and when were they created?
2. When would the naive solution on this page be easier to maintain? Give a concrete example.
3. Change one input in the Python example. Predict the output and explain which responsibility handles the change.

## Run and explore the example

The Python code comes from [python/main.py](https://github.com/sanfor2004/23-Design-Patterns/blob/main/structural/proxy/python/main.py), with [expected output](https://github.com/sanfor2004/23-Design-Patterns/blob/main/structural/proxy/python/expected.txt). The C++20 code comes from [structural/proxy/cpp/main.cpp](https://github.com/sanfor2004/23-Design-Patterns/blob/main/structural/proxy/cpp/main.cpp). Follow the repository's [C++20 build instructions](https://github.com/sanfor2004/23-Design-Patterns/blob/main/CPP_EXAMPLES.md) to compile it and compare the result with [expected.txt](https://github.com/sanfor2004/23-Design-Patterns/blob/main/structural/proxy/cpp/expected.txt). The output demonstrates this example's behavior; it does not cover every input or the challenge above.

The source example and adapted explanation are © 2026 Sanfor2004, provided under the [MIT license](/images/writing/patterns/SOURCE-LICENSE.txt). The sketchbook cover is an illustration preserved from this site's original pattern lessons.

## Continue the series

- [Overview: all 23 patterns, their categories, and how to choose](/blog/design-patterns-overview/)
- Previous: [Flyweight (Structural Pattern)](/blog/design-pattern-flyweight/)
- Next: [Chain of Responsibility (Behavioral Pattern)](/blog/design-pattern-chain-of-responsibility/)
