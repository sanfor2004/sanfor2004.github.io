"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Alert,
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
  InputUnderline,
  Label,
  Progress,
  Separator,
  Skeleton,
  Stat,
  Textarea,
} from "@/components/ui/primitives";
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
  SwitchField,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Tooltip,
  TooltipProvider,
} from "@/components/ui/interactive";
import { CardSwap, SwapCard } from "@/components/bits/CardSwap";
import { CountUp } from "@/components/bits/CountUp";
import { DecryptedText, Grain, StippleField } from "@/components/bits/art";

/**
 * The kit gallery. Every component the site is built from, on one page.
 * If a component is not here, it is not finished.
 */
export default function UiKitGallery() {
  return (
    <TooltipProvider delayDuration={200}>
      <div className="flex flex-col gap-14">
        <Palette />
        <TypeSpecimen />
        <Buttons />
        <Forms />
        <DataDisplay />
        <Interactive />
        <Motion />
        <ArtLayer />
      </div>
    </TooltipProvider>
  );
}

/* ------------------------------------------------------------------ shell */

function Section({
  title,
  note,
  children,
}: {
  title: string;
  note: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-semibold tracking-[-0.01em] text-body">{title}</h2>
        <p className="max-w-[62ch] text-sm text-subtle">{note}</p>
      </div>
      {children}
    </section>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{children}</div>;
}

function Demo({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <span className="font-mono text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-subtle">
          {label}
        </span>
      </CardHeader>
      <CardContent className="flex flex-col items-start gap-3">{children}</CardContent>
    </Card>
  );
}

/* ---------------------------------------------------------------- palette */

function Palette() {
  const swatches = [
    { name: "bg", token: "--color-bg", note: "page" },
    { name: "bg-2", token: "--color-bg-secondary", note: "panels" },
    { name: "base-300", token: "--color-base-300", note: "edges" },
    { name: "border", token: "--color-border", note: "rules" },
    { name: "muted", token: "--color-muted", note: "secondary text" },
    { name: "text", token: "--color-text", note: "body" },
    { name: "accent", token: "--color-accent", note: "signal" },
  ];
  return (
    <Section
      title="Palette"
      note="The kit carries no palette of its own — every component reads the site's semantic tokens, so it follows both themes automatically. Swatches below are live values from the current theme."
    >
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
        {swatches.map((s) => (
          <div key={s.name} className="flex flex-col gap-2">
            <div
              className="h-16 rounded-md border border-line"
              style={{ background: `var(${s.token})` }}
            />
            <div className="flex flex-col">
              <span className="font-mono text-[0.65rem] uppercase tracking-[0.1em] text-body">
                {s.name}
              </span>
              <span className="font-mono text-[0.6rem] text-subtle">{s.note}</span>
            </div>
          </div>
        ))}
      </div>
      <Alert variant="accent" title="Orange is a signal, not decoration.">
        Roughly 85% neutral, 10% art, 5% accent per view. If a screen has three orange
        things, two of them are wrong. Toggle the site theme and this whole page
        follows &mdash; no component branches on light vs dark.
      </Alert>
    </Section>
  );
}

/* ------------------------------------------------------------------- type */

function TypeSpecimen() {
  return (
    <Section
      title="Typography"
      note="Inter for UI and body, the site mono stack for anything countable and the terminal register, and Instrument Serif for a single italic accent phrase in a headline."
    >
      <Grid>
        <Demo label="Display">
          <h3 className="text-3xl font-semibold leading-[1.05] tracking-[-0.02em] text-body">
            Mapping <span className="font-serif italic font-normal">the future</span> of
            systems
          </h3>
          <p className="text-xs text-subtle">
            One italic serif phrase per headline. A second one cancels the effect.
          </p>
        </Demo>
        <Demo label="Scale">
          <p className="text-2xl font-semibold text-body">Heading 2xl</p>
          <p className="text-lg font-semibold text-body">Heading lg</p>
          <p className="text-base text-body">Body base — the default reading size.</p>
          <p className="text-sm text-subtle">Small, muted secondary copy.</p>
        </Demo>
        <Demo label="Mono & eyebrow">
          <span className="font-mono text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-subtle">
            Section label
          </span>
          <div className="flex gap-4 font-mono tabular-nums text-body">
            <span>14:32</span>
            <span className="text-subtle">2,450</span>
            <span className="text-accent">v2.1</span>
          </div>
          <DecryptedText text="sanfor2004.com" className="text-sm text-body" />
        </Demo>
      </Grid>
    </Section>
  );
}

/* ---------------------------------------------------------------- buttons */

function Buttons() {
  return (
    <Section
      title="Buttons"
      note="shadcn/ui's CVA + asChild pattern, repainted onto the site tokens. `default` is the only accent-carrying variant — at most one per view."
    >
      <Grid>
        <Demo label="Variants">
          <Button>Primary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
          <Button variant="mono">Terminal</Button>
          <Button variant="destructive">Destructive</Button>
        </Demo>
        <Demo label="Sizes">
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
          <Button disabled>Disabled</Button>
        </Demo>
        <Demo label="asChild">
          <Button asChild variant="outline">
            <a href="/projects/">Renders an anchor</a>
          </Button>
          <p className="text-xs text-subtle">
            Keeps the styling while emitting the right element — real links stay links.
          </p>
        </Demo>
      </Grid>
    </Section>
  );
}

/* ------------------------------------------------------------------ forms */

function Forms() {
  const [sub, setSub] = React.useState(true);
  const [mono, setMono] = React.useState(false);
  return (
    <Section
      title="Forms"
      note="Two input treatments: a bordered field for dense forms, and an underlined rule for quiet forms sitting under artwork."
    >
      <Grid>
        <Demo label="Fields">
          <div className="flex w-full flex-col gap-1.5">
            <Label htmlFor="kit-email">Email</Label>
            <Input id="kit-email" type="email" placeholder="you@example.com" />
          </div>
          <div className="flex w-full flex-col gap-1.5">
            <Label htmlFor="kit-note">Note</Label>
            <Textarea id="kit-note" rows={3} placeholder="Anything worth saying…" />
          </div>
        </Demo>
        <Demo label="Underlined">
          <InputUnderline placeholder="Enter email" aria-label="Enter email" />
          <Button variant="outline" size="sm" className="rounded-full">
            Subscribe
          </Button>
          <p className="text-xs text-subtle">
            A rule, not a box — the form recedes under the artwork.
          </p>
        </Demo>
        <Demo label="Switches">
          <div className="w-full">
            <SwitchField
              checked={sub}
              onCheckedChange={setSub}
              label="Email on new posts"
              hint="Roughly one a month."
            />
            <Separator />
            <SwitchField checked={mono} onCheckedChange={setMono} label="Terminal mode" />
          </div>
        </Demo>
      </Grid>
    </Section>
  );
}

/* ------------------------------------------------------------------- data */

function DataDisplay() {
  return (
    <Section
      title="Data display"
      note="Badges, stats, meters and skeletons. Color never carries meaning alone — a value always shows its number."
    >
      <Grid>
        <Demo label="Badges">
          <div className="flex flex-wrap gap-1.5">
            <Badge>Default</Badge>
            <Badge variant="accent">Accent</Badge>
            <Badge variant="solid">Solid</Badge>
            <Badge variant="outline">Outline</Badge>
          </div>
          <Separator label="tags" className="w-full" />
          <div className="flex flex-wrap gap-1.5">
            <Badge variant="outline">c++</Badge>
            <Badge variant="outline">linux</Badge>
            <Badge variant="outline">networking</Badge>
          </div>
        </Demo>
        <Demo label="Stats">
          <div className="grid w-full grid-cols-2 gap-4">
            <Stat label="Articles" value={<CountUp to={119} />} sub="published" />
            <Stat label="Patterns" value={<CountUp to={23} />} sub="GoF series" />
          </div>
          <Separator className="w-full" />
          <Progress label="Series progress" value={23} max={23} className="w-full" />
        </Demo>
        <Demo label="Skeleton & alerts">
          <Skeleton className="h-3 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
          <Separator className="w-full" />
          <Alert title="Heads up." className="w-full">
            The neutral alert, for information that is not a problem.
          </Alert>
        </Demo>
      </Grid>

      <Card>
        <CardHeader>
          <CardTitle>Card</CardTitle>
          <CardDescription>
            Header, content and footer slots — the shape most of the site&apos;s
            listings are built from.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-subtle">
            Cards carry a 1px rule rather than a shadow. Shadows are reserved for things
            that genuinely float — dialogs, tooltips, the swap deck.
          </p>
        </CardContent>
        <CardFooter>
          <Badge variant="outline">astro</Badge>
          <Badge variant="outline">tailwind</Badge>
          <span className="flex-1" />
          <Button variant="ghost" size="sm">
            Read
          </Button>
        </CardFooter>
      </Card>
    </Section>
  );
}

/* ------------------------------------------------------------ interactive */

function Interactive() {
  return (
    <Section
      title="Interactive"
      note="Radix-backed, so focus trapping, roving tabindex and dismiss behavior come from a maintained primitive rather than hand-rolled key handlers."
    >
      <Grid>
        <Demo label="Tabs">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="stack">Stack</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
            </TabsList>
            <TabsContent value="overview">
              <p className="text-sm text-subtle">Arrow keys move between tabs.</p>
            </TabsContent>
            <TabsContent value="stack">
              <p className="text-sm text-subtle">Astro, Tailwind 4, React islands.</p>
            </TabsContent>
            <TabsContent value="notes">
              <p className="text-sm text-subtle">Static output, no server required.</p>
            </TabsContent>
          </Tabs>
        </Demo>

        <Demo label="Dialog">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Open dialog</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader
                title="Subscribe"
                description="One email a month, no tracking pixels."
              />
              <DialogBody>
                Focus is trapped while this is open, Escape closes it, and the trigger
                gets focus back on close.
              </DialogBody>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="ghost" size="sm">
                    Cancel
                  </Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button size="sm">Subscribe</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </Demo>

        <Demo label="Tooltip">
          <Tooltip label="Supplementary only — the trigger keeps its own name.">
            <Button variant="outline" size="sm">
              Hover or focus me
            </Button>
          </Tooltip>
          <p className="text-xs text-subtle">
            Keyboard-reachable, and never the only place information lives.
          </p>
        </Demo>
      </Grid>
    </Section>
  );
}

/* ----------------------------------------------------------------- motion */

function Motion() {
  return (
    <Section
      title="Motion"
      note="React Bits patterns, adapted so they behave on a content site: they pause off-screen and when the tab is hidden, and collapse to a static state under reduced motion."
    >
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <span className="font-mono text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-subtle">
              CardSwap
            </span>
          </CardHeader>
          <CardContent className="flex justify-center overflow-hidden py-8">
            <CardSwap width={300} height={190} interval={3000}>
              <SwapCard eyebrow="01 / systems" title="Low-level notes">
                Memory, syscalls, and what the profiler actually says.
              </SwapCard>
              <SwapCard eyebrow="02 / networking" title="Packets end to end">
                From socket options to what the wire really carries.
              </SwapCard>
              <SwapCard eyebrow="03 / patterns" title="23 GoF patterns">
                Working C++ for every pattern in the series.
              </SwapCard>
            </CardSwap>
          </CardContent>
          <CardFooter>
            <p className="text-xs text-subtle">
              Hover to pause. Stops entirely when scrolled away or the tab is hidden.
            </p>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <span className="font-mono text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-subtle">
              CountUp &amp; DecryptedText
            </span>
          </CardHeader>
          <CardContent className="flex flex-col gap-6 py-8">
            <div className="grid grid-cols-3 gap-4">
              <Stat label="Pages" value={<CountUp to={119} />} />
              <Stat label="Patterns" value={<CountUp to={23} />} />
              <Stat label="Uptime" value={<CountUp to={99.9} decimals={1} suffix="%" />} />
            </div>
            <Separator label="scramble" />
            <DecryptedText
              text="systems / linux / networking"
              className="text-base text-body"
            />
          </CardContent>
          <CardFooter>
            <p className="text-xs text-subtle">
              The real value is in the DOM before hydration, so it is correct even if the
              animation never runs.
            </p>
          </CardFooter>
        </Card>
      </div>
    </Section>
  );
}

/* -------------------------------------------------------------- art layer */

function ArtLayer() {
  return (
    <Section
      title="Art layer"
      note="Two inks, paper showing through, density doing the shading. Decorative and aria-hidden — never the only thing carrying information."
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <figure className="overflow-hidden rounded-lg border border-line">
          <StippleField className="h-56">
            <div className="relative flex h-56 items-end p-5">
              <h3 className="text-2xl font-semibold leading-tight tracking-[-0.02em] text-body">
                Mapping <span className="font-serif italic font-normal">the future</span>
              </h3>
            </div>
          </StippleField>
          <figcaption className="border-t border-line bg-surface-2 px-3 py-2">
            <span className="font-mono text-[0.65rem] text-subtle">StippleField</span>
          </figcaption>
        </figure>

        <figure className="overflow-hidden rounded-lg border border-line">
          <div className="relative h-56 bg-surface-2">
            <Grain opacity={0.45} />
          </div>
          <figcaption className="border-t border-line bg-surface-2 px-3 py-2">
            <span className="font-mono text-[0.65rem] text-subtle">Grain</span>
          </figcaption>
        </figure>
      </div>
    </Section>
  );
}
