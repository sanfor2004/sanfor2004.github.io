// Stable series identities shared by legacy redirects and publication checks.
export const patternOverview = "/blog/design-patterns-overview/";

export const designPatterns = [
  {
    "slug": "abstract-factory",
    "name": "Abstract Factory",
    "category": "Creational"
  },
  {
    "slug": "builder",
    "name": "Builder",
    "category": "Creational"
  },
  {
    "slug": "factory-method",
    "name": "Factory Method",
    "category": "Creational"
  },
  {
    "slug": "prototype",
    "name": "Prototype",
    "category": "Creational"
  },
  {
    "slug": "singleton",
    "name": "Singleton",
    "category": "Creational"
  },
  {
    "slug": "adapter",
    "name": "Adapter",
    "category": "Structural"
  },
  {
    "slug": "bridge",
    "name": "Bridge",
    "category": "Structural"
  },
  {
    "slug": "composite",
    "name": "Composite",
    "category": "Structural"
  },
  {
    "slug": "decorator",
    "name": "Decorator",
    "category": "Structural"
  },
  {
    "slug": "facade",
    "name": "Facade",
    "category": "Structural"
  },
  {
    "slug": "flyweight",
    "name": "Flyweight",
    "category": "Structural"
  },
  {
    "slug": "proxy",
    "name": "Proxy",
    "category": "Structural"
  },
  {
    "slug": "chain-of-responsibility",
    "name": "Chain of Responsibility",
    "category": "Behavioral"
  },
  {
    "slug": "command",
    "name": "Command",
    "category": "Behavioral"
  },
  {
    "slug": "interpreter",
    "name": "Interpreter",
    "category": "Behavioral"
  },
  {
    "slug": "iterator",
    "name": "Iterator",
    "category": "Behavioral"
  },
  {
    "slug": "mediator",
    "name": "Mediator",
    "category": "Behavioral"
  },
  {
    "slug": "memento",
    "name": "Memento",
    "category": "Behavioral"
  },
  {
    "slug": "observer",
    "name": "Observer",
    "category": "Behavioral"
  },
  {
    "slug": "state",
    "name": "State",
    "category": "Behavioral"
  },
  {
    "slug": "strategy",
    "name": "Strategy",
    "category": "Behavioral"
  },
  {
    "slug": "template-method",
    "name": "Template Method",
    "category": "Behavioral"
  },
  {
    "slug": "visitor",
    "name": "Visitor",
    "category": "Behavioral"
  }
];

export const patternArticlePath = (slug) => `/blog/design-pattern-${slug}/`;

export const learningRedirects = Object.fromEntries([
  ["/learning/", patternOverview],
  ["/learning/patterns/", patternOverview],
  ...designPatterns.flatMap(({ slug }) => [
    [`/learning/patterns/${slug}/`, patternArticlePath(slug)],
    [`/learning/patterns/${slug}/ar/`, patternArticlePath(slug)],
  ]),
]);
