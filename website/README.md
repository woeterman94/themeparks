# Theme Park Wait Times Website

Angular website that shows per-theme-park attraction wait times in a responsive Bootstrap table.

## Features

- Theme park overview pages using data references from this repository
- Configurable external API per park (endpoint, response field mapping, and status mapping)
- Search/filter attractions by name
- Sort by wait time or attraction name (ascending/descending)
- Auto-refresh every 5 minutes
- Responsive Bootstrap UI for desktop and mobile

## Run locally

```bash
npm install
npm start
```

## Build

```bash
npm run build
```

## Build for GitHub Pages

```bash
npm run build:github-pages
```

This uses `--base-href /themeparks/` (repository name) so it can be published to GitHub Pages.

## Extend with new parks/APIs

All park/API definitions are in:

- `src/app/theme-park-config.ts`

Add a new park entry with:

- `parkApiId`
- `name`
- `api.endpoint`
- `api.responsePath` (optional)
- `api.fields` mapping for `id`, `name`, `waitTime`, `status`, `lastUpdated`
- `api.statusMap` for external status code/value translation

No component changes are required to add additional parks when config is updated.
