# SketchyBar Showcase

A community gallery for [SketchyBar](https://github.com/FelixKratz/SketchyBar) configurations. Browse setups, preview screenshots, and copy dotfiles.

## Features

- **Screenshot Gallery** - Browse 93+ community setups with full-size previews
- **Copyable Dotfiles** - View and copy configuration files directly from the browser
- **Syntax Highlighting** - Code blocks with shiki highlighting for bash, lua, json, yaml
- **Nerd Font Support** - Proper rendering of Nerd Font icons in configs
- **Search & Filter** - Filter by tags (catppuccin, gruvbox, minimal, etc.) and dark/light mode
- **Static Site** - Fast, deployable to GitHub Pages

## Tech Stack

- [SvelteKit](https://kit.svelte.dev/) with static adapter
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Shiki](https://shiki.matsu.io/) for syntax highlighting
- [JetBrainsMono Nerd Font](https://www.nerdfonts.com/)

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run check` | Run TypeScript/Svelte checks |
| `npm run scrape` | Scrape showcases from GitHub Discussion #47 |
| `npm run fetch-dotfiles` | Fetch dotfiles from linked GitHub repos |

## Project Structure

```
├── src/
│   ├── routes/
│   │   ├── +page.svelte          # Home - showcase grid
│   │   └── showcase/[id]/        # Showcase detail page
│   ├── lib/
│   │   ├── components/           # Svelte components
│   │   │   ├── ShowcaseCard.svelte
│   │   │   ├── CodeBlock.svelte
│   │   │   ├── DotfileTree.svelte
│   │   │   └── ...
│   │   └── types.ts              # TypeScript types
│   └── app.css                   # Global styles
├── static/
│   ├── data/
│   │   ├── index.json            # Showcase listing
│   │   ├── tags.json             # Available tags
│   │   └── showcases/            # Individual showcase JSON files
│   ├── screenshots/              # Showcase screenshots
│   └── fonts/                    # JetBrainsMono Nerd Font
├── scripts/
│   ├── scrape-discussion.js      # GitHub Discussion scraper
│   └── fetch-dotfiles.js         # Dotfiles fetcher
└── .github/workflows/
    └── deploy.yml                # GitHub Pages deployment
```

## Data Format

### Showcase JSON (`static/data/showcases/{id}.json`)

```json
{
  "id": "username-1",
  "title": "Username's Setup",
  "author": "username",
  "authorUrl": "https://github.com/username",
  "description": "A SketchyBar configuration...",
  "screenshots": ["/screenshots/username-1/main.png"],
  "thumbnail": "/screenshots/username-1/main.png",
  "mode": "dark",
  "tags": ["minimal", "catppuccin"],
  "githubUrl": "https://github.com/username/dotfiles",
  "dependencies": ["sketchybar"],
  "dotfiles": {
    "sketchybarrc": "#!/bin/bash\n...",
    "plugins/battery.sh": "#!/bin/bash\n..."
  },
  "createdAt": "2024-01-15"
}
```

## Contributing

### Adding Your Setup

The easiest way to add your setup:

1. Post your setup in [SketchyBar Discussion #47](https://github.com/FelixKratz/SketchyBar/discussions/47)
2. Include screenshots and a link to your dotfiles repo
3. Run `npm run scrape` and `npm run fetch-dotfiles` to update

### Manual Addition

1. Add screenshots to `static/screenshots/{id}/`
2. Create a JSON file in `static/data/showcases/{id}.json`
3. Add entry to `static/data/index.json`
4. Submit a Pull Request

### Updating Showcases

```bash
# Re-scrape all showcases from GitHub Discussion
npm run scrape

# Fetch/update dotfiles from linked repos
npm run fetch-dotfiles
```

## Deployment

The site auto-deploys to GitHub Pages on push to `main` via GitHub Actions.

Manual deployment:

```bash
npm run build
# Deploy the `build/` directory
```

## Available Tags

| Tag | Count |
|-----|-------|
| custom | 39 |
| minimal | 16 |
| icons | 16 |
| yabai | 10 |
| widgets | 10 |
| catppuccin | 7 |
| lua | 6 |
| gruvbox | 5 |
| dracula | 4 |
| nord | 3 |
| tokyo-night | 2 |
| rose-pine | 1 |
| aerospace | 1 |

## Credits

- [FelixKratz](https://github.com/FelixKratz) for creating SketchyBar
- All contributors who shared their setups in the discussion thread

## License

MIT
