# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A community gallery for SketchyBar configurations built with SvelteKit 5 and deployed as a static site to GitHub Pages. Users can browse screenshots, filter by tags/mode, and view copyable dotfiles with syntax highlighting.

## Commands

```bash
npm run dev          # Start dev server
npm run build        # Build for production (outputs to build/)
npm run preview      # Preview production build locally
npm run check        # Run TypeScript/Svelte type checking
npm run scrape       # Scrape showcases from GitHub Discussion #47 (requires gh CLI)
npm run fetch-dotfiles  # Fetch dotfiles from linked GitHub repos (requires gh CLI)
```

## Architecture

### Data Flow
- **Scraping pipeline**: `scripts/scrape-discussion.js` fetches comments from GitHub Discussion #47 via GraphQL, extracts images/URLs, downloads screenshots, and generates JSON files in `static/data/`
- **Dotfiles pipeline**: `scripts/fetch-dotfiles.js` parses GitHub URLs from showcase JSON, finds sketchybar config paths, and embeds file contents into the showcase JSON
- **Static data**: All showcase data lives in `static/data/` as JSON files, loaded at build time via SvelteKit's static adapter

### Key Files
- `src/lib/types.ts` - TypeScript interfaces for `ShowcaseListItem`, `ShowcaseDetail`, `TagsData`
- `src/routes/+page.svelte` - Home page with gallery grid, search, tag/mode filtering (uses Svelte 5 runes: `$state`, `$derived`)
- `src/routes/showcase/[id]/+page.svelte` - Detail view with screenshots, metadata, dotfile tree
- `src/routes/showcase/[id]/+page.server.ts` - Server-side data loading for individual showcases

### Static Data Structure
- `static/data/index.json` - Showcase listing for home page
- `static/data/tags.json` - Tag counts for filter UI
- `static/data/showcases/{id}.json` - Individual showcase details including embedded dotfiles
- `static/screenshots/{id}/` - Downloaded screenshot images

### GitHub Pages Deployment
- Uses `@sveltejs/adapter-static` with `BASE_PATH` env var for subdirectory deployment
- Base path handled via `$app/paths` import in Svelte components
- Auto-deploys on push to main via `.github/workflows/deploy.yml`

## Tech Stack
- SvelteKit 5 with Svelte 5 runes syntax (`$state`, `$derived`, `$props`)
- Tailwind CSS for styling
- Shiki for code syntax highlighting
- JetBrainsMono Nerd Font for icon rendering
