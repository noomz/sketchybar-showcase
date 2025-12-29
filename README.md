# SketchyBar Showcase

A community-driven gallery of beautiful [SketchyBar](https://github.com/FelixKratz/SketchyBar) configurations for macOS.

## Features

- Browse beautiful SketchyBar setups
- Filter by tags (minimal, colorful, etc.)
- Filter by color mode (dark/light)
- Search by title, author, or tags
- Copy dotfiles directly from the browser
- View full configuration files with syntax highlighting

## Development

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

## Contributing a Showcase

Want to add your SketchyBar config? Follow these steps:

### 1. Fork and Clone

```bash
git clone https://github.com/YOUR_USERNAME/sketchybar-showcase.git
cd sketchybar-showcase
```

### 2. Add Your Screenshots

Create a folder for your showcase in `static/screenshots/`:

```
static/screenshots/your-config-name/
├── thumb.png    # 400x250 thumbnail
├── main.png     # Main screenshot
└── ...          # Additional screenshots (optional)
```

**Screenshot tips:**
- Use high-quality screenshots (PNG or WebP preferred)
- Thumbnail should be 400x250px
- Main screenshots should clearly show your bar

### 3. Create Your Showcase JSON

Add a new file in `static/data/showcases/your-config-name.json`:

```json
{
  "id": "your-config-name",
  "title": "Your Config Title",
  "author": "your-github-username",
  "authorUrl": "https://github.com/your-github-username",
  "description": "A brief description of your setup...",
  "screenshots": [
    "/screenshots/your-config-name/main.png"
  ],
  "thumbnail": "/screenshots/your-config-name/thumb.png",
  "mode": "dark",
  "tags": ["minimal", "icons"],
  "githubUrl": "https://github.com/your-username/dotfiles",
  "dependencies": ["sketchybar", "sf-symbols"],
  "dotfiles": {
    "sketchybarrc": "#!/bin/bash\n...",
    "colors.sh": "#!/bin/bash\n..."
  },
  "createdAt": "2024-01-15"
}
```

**Fields:**
- `id`: URL-friendly identifier (lowercase, hyphens)
- `mode`: `"dark"`, `"light"`, or `"both"`
- `tags`: Array of relevant tags
- `dotfiles`: Object mapping filename to file contents

### 4. Update the Index

Add your showcase to `static/data/index.json`:

```json
{
  "id": "your-config-name",
  "title": "Your Config Title",
  "author": "your-github-username",
  "thumbnail": "/screenshots/your-config-name/thumb.png",
  "tags": ["minimal", "icons"],
  "mode": "dark"
}
```

### 5. Test Locally

```bash
npm run dev
```

Visit `http://localhost:5173` and verify your showcase appears correctly.

### 6. Submit a Pull Request

Push your changes and open a PR. We'll review and merge it!

## Tech Stack

- [SvelteKit](https://kit.svelte.dev/) - Web framework
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [GitHub Pages](https://pages.github.com/) - Hosting

## License

MIT
