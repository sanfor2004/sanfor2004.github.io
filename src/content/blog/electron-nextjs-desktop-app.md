---
title: "Build a Desktop App with Electron and Next.js"
seoTitle: "Build a Secure Electron Desktop App with Next.js"
description: "Package a Next.js static export inside Electron with TypeScript, a custom application protocol, isolated preload code, narrow IPC, and no embedded web server."
image: "/images/writing/electron-nextjs-desktop-app.webp"
imageAlt: "A hand-drawn desktop window cutaway showing a web interface, guarded bridge, main-process machinery, and packaged static pages."
imageWidth: 1600
imageHeight: 900
pubDate: 2026-09-15
category: "Project Engineering"
tags: ["Electron", "Next.js", "TypeScript", "Desktop Apps", "Security"]
---

Electron can place a web interface inside a desktop application, but the renderer is only one part of the program. The main process owns native capabilities and application lifecycle. Preload code defines a narrow bridge. Renderer code displays the interface and should remain isolated from unrestricted Node.js access.

Next.js adds another boundary. A normal Next.js application may expect a server for dynamic rendering, Route Handlers, Server Actions, image optimization, cookies, and redirects. A desktop package is simpler when the interface can be exported as static files and loaded without starting a hidden local web server.

This guide builds that simpler architecture:

```text
Next.js source → static export → custom app:// protocol → Electron renderer
                                                ↕
                                      typed preload bridge
                                                ↕
                                        Electron main process
```

The result is a small desktop application that displays a Next.js page and asks the main process for the current platform through one named IPC method.

## When static export is the right choice

Choose this architecture when the interface can run from HTML, CSS, JavaScript, build-time data, browser APIs, and explicit Electron APIs. It works well for local tools whose privileged operations—opening a file dialog, reading an approved file, or saving preferences—can be represented as narrow messages to the main process.

Do not choose it if the application fundamentally needs runtime server rendering, request-time cookies, dynamic Next.js Route Handlers, Server Actions, ISR, middleware, or the default Next.js image-optimization server. The official [static export guide](https://nextjs.org/docs/app/guides/static-exports) lists the supported and unsupported features.

## Scaffold the Next.js application

Create a TypeScript App Router project:

```bash
npx create-next-app@latest desktop-shell \
  --typescript \
  --app \
  --eslint \
  --no-tailwind

cd desktop-shell
```

Add Electron and Electron Forge as development dependencies:

```bash
npm install --save-dev \
  electron \
  @electron-forge/cli \
  @electron-forge/maker-zip
```

This article avoids pinning version numbers in the prose because Electron, Chromium, Node.js, and Next.js release independently. Commit the lockfile in a real project, record the versions you tested, and update deliberately—especially Electron, whose bundled browser and Node.js versions are part of the application's security surface.

## Export Next.js as static files

Replace `next.config.ts` with:

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  distDir: "renderer-export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
```

`next build` now creates a `renderer-export/` directory. Giving the renderer output a specific name avoids a collision with Electron Forge's output. `trailingSlash` makes routes such as `/settings/` become directory indexes, which the application protocol can resolve consistently. Disabling the default image optimizer is necessary because that optimizer expects a Next.js server; static applications can still ship already-sized images or use a compatible custom loader.

Server Components that only need build-time work can still produce static output. Code that depends on `window`, the Electron bridge, or other browser state must run in a Client Component.

## Define a tiny renderer API

Create `types/desktop.d.ts`:

```ts
export interface DesktopApi {
  getPlatform: () => Promise<NodeJS.Platform>;
}

declare global {
  interface Window {
    desktopApi: DesktopApi;
  }
}

export {};
```

This declaration tells renderer TypeScript about the API that preload code will expose. It is also an architectural checklist: the renderer receives one capability, not the whole filesystem, shell, or `ipcRenderer` module.

Replace `app/page.tsx` with:

```tsx
"use client";

import { useState } from "react";

export default function Home() {
  const [platform, setPlatform] = useState<string>("Not checked yet");

  async function checkPlatform() {
    try {
      setPlatform(await window.desktopApi.getPlatform());
    } catch {
      setPlatform("Desktop API unavailable");
    }
  }

  return (
    <main>
      <h1>Desktop shell</h1>
      <p>Platform: {platform}</p>
      <button type="button" onClick={checkPlatform}>
        Ask the main process
      </button>
    </main>
  );
}
```

The bridge is accessed only after a click, so the component does not touch `window` during server-side prerendering at build time.

## Add a restrictive starting CSP

Next.js emits inline bootstrap data for its exported App Router pages. A practical starter policy therefore needs to account for that output instead of copying a CSP that prevents hydration.

Add a `<head>` to `app/layout.tsx` while preserving the generated metadata and body:

```tsx
<head>
  <meta
    httpEquiv="Content-Security-Policy"
    content={[
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data:",
      "connect-src 'self'",
      "object-src 'none'",
      "base-uri 'none'",
    ].join("; ")}
  />
</head>
```

This blocks remote resources and does not permit `unsafe-eval`, but `unsafe-inline` is still a meaningful concession. Inspect the generated output for the exact Next.js version and consider hashes or another reviewed policy before treating this as a final hardened CSP. Never weaken `webSecurity` to make an asset problem disappear.

## Compile the Electron side separately

Create `electron/tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "CommonJS",
    "moduleResolution": "Node",
    "outDir": "../dist-electron",
    "rootDir": ".",
    "strict": true,
    "esModuleInterop": true,
    "types": ["node"]
  },
  "include": ["*.ts"]
}
```

The Electron entry points compile to CommonJS files under `dist-electron/`. Keeping this configuration separate from Next.js avoids forcing the two runtimes into one module setup.

## Expose one method from preload

Create `electron/preload.ts`:

```ts
import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("desktopApi", {
  getPlatform: (): Promise<NodeJS.Platform> =>
    ipcRenderer.invoke("app:get-platform"),
});
```

Do not expose `ipcRenderer.send`, `ipcRenderer.invoke`, or an arbitrary channel string. The [context-isolation guide](https://www.electronjs.org/docs/latest/tutorial/context-isolation) recommends one method for each approved IPC message. That keeps the renderer from inventing calls to privileged handlers that were never intended as public UI operations.

## Serve the export through a custom protocol

Electron's security checklist recommends preferring a custom protocol over `file://`. A standard, secure custom scheme gives exported root-relative assets a predictable origin and lets the main process control which packaged files are reachable.

Create `electron/main.ts`:

```ts
import {
  app,
  BrowserWindow,
  ipcMain,
  net,
  protocol,
  type WebFrameMain,
} from "electron";
import path from "node:path";
import { pathToFileURL } from "node:url";

protocol.registerSchemesAsPrivileged([
  {
    scheme: "app",
    privileges: {
      standard: true,
      secure: true,
      supportFetchAPI: true,
      corsEnabled: true,
    },
  },
]);

function isTrustedFrame(frame: WebFrameMain | null): boolean {
  if (frame === null) return false;

  const source = new URL(frame.url);
  return source.protocol === "app:" && source.host === "bundle";
}

async function registerAppProtocol(): Promise<void> {
  const rendererRoot = path.resolve(app.getAppPath(), "renderer-export");
  const rootPrefix = `${rendererRoot}${path.sep}`;

  protocol.handle("app", (request) => {
    const requestUrl = new URL(request.url);
    let relativePath = decodeURIComponent(requestUrl.pathname)
      .replace(/^\/+/, "");

    if (relativePath === "" || relativePath.endsWith("/")) {
      relativePath += "index.html";
    }

    const requestedPath = path.resolve(rendererRoot, relativePath);

    if (!requestedPath.startsWith(rootPrefix)) {
      return new Response("Not found", { status: 404 });
    }

    return net.fetch(pathToFileURL(requestedPath).toString());
  });
}

function createWindow(): BrowserWindow {
  const window = new BrowserWindow({
    width: 1100,
    height: 760,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  window.once("ready-to-show", () => window.show());

  window.webContents.on("will-navigate", (event, targetUrl) => {
    const target = new URL(targetUrl);
    if (target.protocol !== "app:" || target.host !== "bundle") {
      event.preventDefault();
    }
  });

  window.webContents.setWindowOpenHandler(() => ({ action: "deny" }));
  void window.loadURL("app://bundle/");

  return window;
}

app.whenReady().then(async () => {
  await registerAppProtocol();

  ipcMain.handle("app:get-platform", (event) => {
    if (!isTrustedFrame(event.senderFrame)) {
      throw new Error("Rejected IPC call from an untrusted frame");
    }

    return process.platform;
  });

  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
```

The traversal check resolves the requested path and requires it to remain below the static export root. The scheme and host check performs a separate job: it ensures only this application's renderer can call the IPC handler.

This starter denies new windows and navigation away from the packaged origin. A real application that opens an external link should validate it against an allowlist and pass only the approved URL to `shell.openExternal`. Never forward an untrusted string directly.

## Configure Electron Forge

Create `forge.config.js`:

```js
module.exports = {
  packagerConfig: {
    asar: true,
  },
  outDir: "release",
  makers: [
    {
      name: "@electron-forge/maker-zip",
      platforms: ["darwin", "linux", "win32"],
    },
  ],
};
```

Then add the Electron entry point and scripts to `package.json` while preserving the scripts created by Next.js:

```json
{
  "main": "dist-electron/main.js",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "lint": "eslint",
    "desktop:compile": "tsc -p electron/tsconfig.json",
    "desktop:start": "npm run build && npm run desktop:compile && electron-forge start",
    "desktop:package": "npm run build && npm run desktop:compile && electron-forge package"
  }
}
```

Run the desktop application:

```bash
npm run desktop:start
```

Create an unpacked application bundle:

```bash
npm run desktop:package
```

The renderer export and Forge packages now use separate directories. Keep that separation if you change either tool's configuration, and verify the packaged application from `release/` rather than assuming it is correct because development mode launched.

## Security boundaries to preserve

The important properties are architectural, not cosmetic:

- keep `nodeIntegration` off in the renderer;
- keep `contextIsolation` and renderer sandboxing on;
- expose one validated preload method per capability;
- validate the sender of privileged IPC messages;
- restrict navigation and window creation;
- load only packaged or explicitly trusted secure content;
- define and test a CSP;
- keep Electron and dependencies current;
- validate every path, URL, and value again in the main process.

Renderer validation improves the interface but does not establish trust. The main process owns the filesystem and operating-system APIs, so it must enforce the actual policy.

Electron's [security checklist](https://www.electronjs.org/docs/latest/tutorial/security) explains these boundaries in more detail, and its [IPC tutorial](https://www.electronjs.org/docs/latest/tutorial/ipc) demonstrates the supported communication patterns.

## Static export limitations in practice

Moving a Next.js interface into Electron does not move a Next.js server with it. In this architecture:

- a Client Component calls preload for privileged local work;
- build-time Server Components can produce static output;
- dynamic request-time Next.js features are unavailable;
- default image optimization is unavailable;
- local persistence belongs behind a validated Electron API, not in a fake Route Handler;
- remote services still need normal HTTPS authentication, authorization, validation, and failure handling.

If those limits fight the product at every step, reconsider the architecture. An embedded server increases lifecycle, port, update, packaging, and security complexity, but it may be justified when server-only Next.js behavior is essential. Do not start one merely to avoid defining a proper desktop boundary.

## Before distributing the application

A runnable package is not yet a production release. Add platform icons, application identity, code signing, update policy, crash reporting appropriate to the privacy model, dependency review, and tests around IPC validation. Package on or for each supported operating system and test the installed artifact, not only `electron-forge start`.

The central design rule is simple: Next.js owns the static interface; Electron's main process owns native authority; preload exposes the smallest useful bridge between them. Keeping those responsibilities explicit makes the application easier to package, debug, and secure.
