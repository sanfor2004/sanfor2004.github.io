---
title: "360 Vision"
description: "A local Next.js studio for authoring interactive 360 property tours with hotspots, floor plans, and JSON storage."
pubDate: 2026-08-27
updatedDate: 2026-09-09
tags: ["Next.js", "TypeScript", "Three.js", "Cybersecurity", "Product Engineering"]
status: "Active project"
role: "Project owner and developer"
stack: ["Next.js 16", "React 19", "TypeScript", "Three.js", "Photo Sphere Viewer", "Sharp", "Zod", "Local JSON"]
repo: "https://github.com/sanfor2004/360vesion"
---

360Vision is a single-owner local application for authoring and viewing interactive real-estate tours. Its dashboard manages local projects, Studio edits scenes and hotspots, and Viewer connects panorama exploration with optional property maps.

Read the full engineering article: [360Vision: Building a 360° Virtual Tour Studio in Next.js](/blog/360vision-nextjs-virtual-tour-studio/).

## What It Does

- Lets creators upload 2:1 equirectangular panoramas.
- Supports multi-scene tours with a start scene and per-scene camera framing.
- Stores hotspots by yaw and pitch angles instead of pixels, which helps markers stay accurate across responsive image sizes.
- Provides hotspot types for information panels, links, scene transitions, and media.
- Supports optional multi-floor plans with responsive scene navigation points.
- Includes a local dashboard, autosave, project copying, JSON download, and automatic tour navigation.
- Uses server-side image processing to create full, mobile, and thumbnail panorama variants.

## Engineering Notes

The project uses Next.js, React, strict TypeScript, Three.js, Photo Sphere Viewer, Sharp, and Zod. Shared types and runtime schemas keep tour metadata, scenes, image assets, hotspots, and floor plans consistent between the editor and viewer. Each tour is stored in a readable JSON file through a temporary-file-and-rename write strategy.

From a software engineering perspective, the interesting constraint is that panorama interactions are spatial, not page-like. Hotspots need to be stored as angles so they remain stable when images are resized or re-encoded.

## Security Notes

The current application has no authentication, accounts, or publication states. Its local write endpoints are intended for a single owner and should not be exposed directly on a public network. Uploads are validated and processed locally. A complete backup includes both tour JSON files and uploaded assets; JSON download alone does not bundle media.

## Next Improvements

- Complete media-aware package import/export.
- Improve destructive-action confirmation and broken-reference validation.
- Add scene reordering and broaden accessibility and responsive checks.
