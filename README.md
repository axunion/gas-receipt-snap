# GAS TypeScript Web App

Simple template for building and deploying a Google Apps Script Web App with TypeScript.

## Features

- TypeScript source in `src/`
- Outputs bundled (transpiled) files to `dist/`
- Biome for format + lint
- Basic GET / POST handlers

## Project Structure

```
├── package.json
├── tsconfig.json
├── src/                # TypeScript sources + appsscript.json
└── dist/               # Generated on build (do not edit manually)
```

## Prerequisites

- Node.js (16+)
- Global clasp: `pnpm i -g @google/clasp`
- Google account (Apps Script enabled)

## Setup

1. Install deps:
```bash
pnpm install
```
2. Login:
```bash
clasp login
```
3. Create or clone a script project:
```bash
clasp create --type webapp --title "Receipt Snap"
# or
clasp clone <SCRIPT_ID>
```

## Build

Always build before pushing. The build script compiles TypeScript and copies `appsscript.json` into `dist/`.
```bash
pnpm build
```

## Deploy

Push the contents of `dist/` to Apps Script using `--rootDir`.
```bash
clasp push --rootDir dist
```
Create / update a web app deployment:
```bash
clasp deploy --description "Initial"
# later updates
clasp deploy --description "Update"
```

Get the last deployment URL:
```bash
clasp open
```

## Development Loop

```bash
# Format check
pnpm format
# Lint check
pnpm lint
# Auto fix format + lint
pnpm check:write
# Rebuild & push
pnpm build && clasp push --rootDir dist
```

## Endpoints (Web App)

Base: `https://script.google.com/macros/s/{SCRIPT_ID}/exec`

GET example:
```bash
curl "https://script.google.com/macros/s/{SCRIPT_ID}/exec?type=ping"
```
POST example:
```bash
curl -X POST -H "Content-Type: application/json" \
  -d '{"type":"ping"}' \
  "https://script.google.com/macros/s/{SCRIPT_ID}/exec"
```

Successful response shape (may vary):
```json
{ "result": "done", "data": "..." }
```
Error response shape:
```json
{ "result": "error", "error": "Message" }
```

## Customize

- Add new logic: create files in `src/` then `pnpm build`
- Config: edit `src/appsscript.json`
- TypeScript options: `tsconfig.json`
- Biome rules: add a `biome.json` if needed
