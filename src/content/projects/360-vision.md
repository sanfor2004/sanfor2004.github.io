---
title: "360 Vision"
description: "A Next.js application for creating, publishing, and viewing interactive 360 panorama tours."
pubDate: 2026-08-27
tags: ["Next.js", "TypeScript", "Three.js", "Cybersecurity", "Product Engineering"]
status: "Active project"
role: "Project owner and developer"
stack: ["Next.js 16", "React 19", "TypeScript", "Prisma", "SQLite", "Auth.js", "Three.js", "Photo Sphere Viewer", "Sharp", "Zod"]
repo: "https://github.com/sanfor2004/360vesion"
---

360 Vision is a web application for authoring and viewing interactive 360 panorama tours. The local project documentation describes two main surfaces: a browser-based studio for placing hotspots and a viewer for public tour playback.

## What It Does

- Lets creators upload 2:1 equirectangular panoramas.
- Supports multi-scene tours with a start scene and per-scene camera framing.
- Stores hotspots by yaw and pitch angles instead of pixels, which helps markers stay accurate across responsive image sizes.
- Provides hotspot types for information panels, links, scene transitions, and media.
- Includes creator-facing surfaces such as dashboard, public profiles, an explore feed, and tour visibility states.
- Uses server-side image processing to create full, mobile, and thumbnail panorama variants.

## Engineering Notes

The project is built with Next.js, React, TypeScript, Prisma, Auth.js, Three.js, Photo Sphere Viewer, Sharp, and Zod. Its data model separates tour metadata, scenes, image assets, and hotspots, which makes the authoring studio and viewer share one domain shape.

From a software engineering perspective, the interesting constraint is that panorama interactions are spatial, not page-like. Hotspots need to be stored as angles so they remain stable when images are resized or re-encoded.

## Security Notes

The app includes authentication, user sessions, upload validation, and draft/public/unlisted visibility. A production deployment would still need careful review of secrets, persistent storage, content validation, image processing limits, and account/session configuration.

## Next Improvements

- Add automated tests around tour validation and visibility rules.
- Document deployment options for persistent uploads and production databases.
- Add more sample tours for onboarding and regression testing.
