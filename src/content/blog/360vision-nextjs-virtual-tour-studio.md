---
title: "360Vision: Building a 360° Virtual Tour Studio in Next.js"
description: "How I built 360Vision with Next.js, Three.js, interactive floor plans, angular hotspots, and local JSON storage for connected real-estate tours."
image: "/images/writing/360vision/cover.png"
imageAlt: "360Vision campaign cover showing the Cedar House panorama viewer, interactive property map, and room navigation."
imageWidth: 1600
imageHeight: 900
pubDate: 2026-09-09
category: "Project Engineering"
tags: ["Next.js", "TypeScript", "Three.js", "360Vision", "Virtual Tours", "Backend", "Product Engineering"]
draft: false
---

A panorama shows you a room. It does not tell you how that room connects to the rest of a property.

That gap is the idea behind **360Vision**, the local virtual tour studio I have been building. It brings 360° panoramas, clickable hotspots, and optional floor plans into one authoring workflow. A viewer can look around a space, move into another room, and use a map to understand where they are.

The current application is a **single-owner local tool built with Next.js, React, TypeScript, Three.js, Photo Sphere Viewer, Sharp, and Zod**. Each tour is stored in a readable JSON file, with uploaded images stored alongside the application. There are no accounts or publication states in this version.

The interesting engineering work sits between those features: choosing coordinates that survive resizing, keeping navigation surfaces synchronized, saving edits visibly, and being precise about what a portable project actually includes.

## In this article

- [What the studio does](#what-does-360vision-do)
- [The authoring workflow](#from-panorama-upload-to-connected-tour)
- [Coordinates and floor plans](#why-hotspots-use-angles-and-floor-plans-use-percentages)
- [The architecture](#the-nextjs-architecture-behind-the-studio)
- [Autosave and local persistence](#autosave-readable-json-and-the-limits-of-local-storage)
- [Running the project](#how-to-run-360vision-locally)
- [Current limitations](#what-is-finished-and-what-comes-next)
- [Common questions](#questions-about-the-project)

## What does 360Vision do?

360Vision turns a collection of equirectangular images into a connected property tour. An equirectangular panorama is a flat image representing a full view around a capture point; the supported upload workflow expects an approximately 2:1 width-to-height ratio.

The dashboard is a **My work** area where the owner creates, reopens, copies, or deletes projects. Inside Studio, each panorama becomes a scene with its own opening camera direction, field of view, and hotspots.

Hotspots can connect scenes or display information, text, links, and media. Optional property maps add another way to navigate, with support for multiple floors and points attached to scene IDs.

The viewer keeps the panorama central. A compact room strip, previous/next controls, scene hotspots, and the property map offer complementary ways to explore. An automatic tour mode moves through the experience without requiring a room selection at every step.

<figure>
  <img src="/images/writing/360vision/floor-plan.png" alt="Cedar House demo showing the Kitchen and Dining panorama, its selected floor-plan point, and the room strip below." width="1440" height="900" loading="lazy" decoding="async" />
  <figcaption>The existing Cedar House demo: the room strip and property map provide context around the panorama.</figcaption>
</figure>

The screenshots in this article are existing captures of the application's bundled demo. They demonstrate its interface, not a claim of a commercial property deployment.

## From panorama upload to connected tour

The workflow begins with a project and a set of images:

1. Create a tour from the dashboard.
2. Upload a 2:1 panorama for each scene.
3. Set the opening camera view so the visitor begins facing something useful.
4. Add scene links and any informational hotspots.
5. Optionally add floor images and place navigation points.
6. Wait for the saved status, then open the viewer and check the journey.

The opening view matters because a tour is a sequence of arrivals. Connecting the kitchen to a living room is more useful when the next room opens in an intentional direction. Each scene stores initial yaw, pitch, and field of view so that authoring decision survives a reload.

In Studio, a two-row toolbar keeps editing and viewing actions visible. The map and room strip remain separate in the viewer: the strip answers “Which room can I open?”, while the map answers “Where is that room?”

<figure>
  <img src="/images/writing/360vision/studio.png" alt="360Vision Studio workspace showing panorama authoring controls, scene management, and the property map editor." width="1440" height="900" loading="lazy" decoding="async" />
  <figcaption>The authoring workspace combines scene editing and spatial navigation in the same local project.</figcaption>
</figure>

## Why hotspots use angles and floor plans use percentages

One of the most important decisions is also easy to miss: a panorama hotspot is stored using **yaw and pitch in degrees**, not the screen pixel where the owner clicked.

Yaw describes the horizontal direction around the panorama; pitch describes the vertical direction. Those coordinates belong to the scene. A screen position belongs to one viewport and one camera view.

If I stored “420 pixels from the left,” the location would describe the editor at that moment. The visitor might use a smaller screen, rotate the camera, or change the zoom. An angular location gives the renderer the scene direction it needs to project the hotspot for the current view.

Floor plans have a different coordinate system. Their navigation points use horizontal and vertical percentages from 0 to 100. A point halfway across and a quarter down the plan stays in the same relative location as the plan scales.

This simplified example illustrates the two representations; it is not a complete importable tour:

```json
{
  "hotspot": {
    "type": "scene",
    "yaw": 42,
    "pitch": -8,
    "targetSceneId": "living-room"
  },
  "floorPlanPoint": {
    "sceneId": "living-room",
    "x": 50,
    "y": 25
  }
}
```

Both references identify a scene, but they locate it in different visual spaces. Keeping that distinction explicit makes responsive rendering easier to reason about.

The runtime schemas enforce the stored shape, including floor-plan percentages and a hotspot pitch range of −89 to 89 degrees. Shape validation is one layer; checking whether every referenced scene still exists is a separate concern that remains part of the project's improvement work.

## The Next.js architecture behind the studio

Next.js App Router provides the pages and local HTTP endpoints. Three.js supports authoring, while Photo Sphere Viewer handles playback. Browser rendering stays on the client, and Node.js handles image processing and file persistence.

The source is organized around a few explicit boundaries:

- `lib/types.ts` defines the shared tour, scene, hotspot, and floor-plan model.
- `lib/schema.ts` validates incoming data and stored documents with Zod.
- `lib/store.ts` reads and writes tour JSON files.
- `lib/storage.ts` is the upload persistence boundary.
- The upload route uses Sharp to inspect images and generate display variants.

A tour contains its ID, title, description, start scene, scenes, optional floor plan, and timestamps. A scene owns its image, opening view, hotspots, and optional floor assignment. This gives Studio and Viewer one shared representation of the project.

### Preparing images for different jobs

The panorama upload route checks readable dimensions, an approximately 2:1 aspect ratio, and a maximum source width of 8192 pixels. It then produces JPEG output in three forms: a normalized full image, a 2048-pixel-wide variant, and a 400-pixel-wide thumbnail.

These files serve different purposes. The scene image supports exploration; smaller variants and thumbnails give the application options for lighter displays and navigation. Generating variants does not by itself prove a performance result, and I do not have a benchmark to claim here. It establishes a useful separation in the asset model.

## Autosave, readable JSON, and the limits of local storage

The current project deliberately targets one owner on one local machine. Each tour lives under `data/tours/`, and uploaded assets live under `public/uploads/`.

Studio watches the persisted state and schedules a save after a one-second debounce. It shows saving, saved, or error feedback so the owner can tell whether an edit has reached storage. A visible save state matters especially when the next action is closing a tab or opening the viewer.

The store writes a temporary file beside the destination and then renames it into place. That replacement strategy helps avoid exposing a partially rewritten JSON document. Create, save, and delete operations also pass through an in-process write queue.

Those are useful controls for the current scope. They do not establish distributed locking, conflict resolution across multiple application processes, or guaranteed recovery from every storage failure. Changing this into a shared hosted product would require revisiting those assumptions.

### JSON export is not a complete media backup

Readable JSON makes tour metadata inspectable. It does not embed the panorama images.

Download JSON exports the document, while a complete backup needs **both `data/tours/` and `public/uploads/`**. Without the uploaded files, the document can still refer to images that are no longer available. A complete media-aware package import/export workflow remains future work.

That distinction is a product lesson as much as a storage lesson: “portable metadata” and “a restorable project” are different promises.

## How to run 360Vision locally

The repository documents Node.js 22 or newer. Start with the source:

```sh
git clone https://github.com/sanfor2004/360vesion.git
cd 360vesion
npm install
npm run dev
```

Open `http://localhost:3000/dashboard` to create a project. The bundled `/demo` route opens Cedar House with three sample spaces and a floor plan. The local setup does not require an environment file.

For the production build served on your own machine:

```sh
npm run lint
npm run build
npm start
```

The application requires a Node.js server and writable local storage. It is not deployed by copying it into a static GitHub Pages site. Its unauthenticated write endpoints are intended for local use and should not be exposed on a public network as they stand.

## What is finished and what comes next?

The current workflow includes local project management, panorama upload, scene and hotspot authoring, optional multi-floor plans, autosave, JSON download, and connected viewer navigation.

The remaining priorities are concrete: complete media-package import/export, improve confirmation and broken-reference handling for destructive actions, add scene reordering, broaden accessibility and responsive validation, and replace remaining browser alerts with clearer recovery feedback.

The project also has a visual campaign built around real desktop/mobile captures and recorded demo navigation. Its lifestyle and laptop photography are AI-generated campaign illustrations. The cover used here belongs to that existing marketing pack; the interface screenshots show the application itself.

For me, the useful connection is between product design and backend decisions. Choosing local storage changes the backup story. Choosing angular coordinates changes how the editor and viewer agree. Choosing an optional floor plan changes how navigation must work when no map exists.

Those decisions are what turn a panorama viewer into an authoring tool someone can understand.

## Questions about the project

### Does 360Vision require an account or a cloud service?

The current single-owner version uses local project files and uploads. It has no account, sign-in, or cloud publication workflow.

### Can it create panoramas from ordinary photographs?

The described workflow begins with existing 2:1 equirectangular panoramas. Photo stitching or reconstruction from ordinary images is not part of this workflow.

### Does every tour need a floor plan?

No. Plans are optional. When enabled, a tour can contain multiple floors with their own images and scene navigation points.

### Can I host it directly on GitHub Pages?

No. The application uses Next.js server endpoints, Sharp, and writable files. This portfolio hosts the article and screenshots; the studio itself needs its own suitable runtime.

### Does downloading JSON include the images?

No. Back up the tour documents and uploaded assets together. Complete media-package portability is still on the roadmap.

## Explore the source and related work

[Explore 360Vision on GitHub](https://github.com/sanfor2004/360vesion) for setup and implementation. The [portfolio case study](/projects/360-vision/) gives a shorter project overview.

For related engineering notes, read [Designing a Reliable Background Job Pipeline](/blog/designing-a-reliable-background-job-pipeline/) and [How I Used AI, References, and Review Loops to Build Mint Woodland Pet](/blog/ai-reference-review-loops-mint-woodland-pet/). You can also [browse all writing](/blog/), [subscribe through RSS](/rss.xml), or [contact me](/contact/) about a project.
