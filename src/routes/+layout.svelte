<script lang="ts">
	import '../app.css';
	import { base } from '$app/paths';

	let { children } = $props();
</script>

<div class="min-h-screen flex flex-col">
	<header class="border-b border-[var(--border-color)] bg-[var(--bg-secondary)]">
		<div class="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
			<a href="{base}/" class="flex items-center gap-3 hover:opacity-80 transition-opacity">
				<svg class="w-8 h-8 text-[var(--accent)]" viewBox="0 0 24 24" fill="currentColor">
					<rect x="2" y="3" width="20" height="4" rx="1" />
					<rect x="4" y="9" width="4" height="3" rx="0.5" opacity="0.7" />
					<rect x="10" y="9" width="4" height="3" rx="0.5" opacity="0.7" />
					<rect x="16" y="9" width="4" height="3" rx="0.5" opacity="0.7" />
				</svg>
				<div>
					<h1 class="text-xl font-bold text-[var(--text-primary)]">SketchyBar Showcase</h1>
					<p class="text-sm text-[var(--text-secondary)]">Beautiful macOS menu bar configurations</p>
				</div>
			</a>
		</div>
	</header>

	<main class="flex-1">
		{@render children()}
	</main>

	<footer class="border-t border-[var(--border-color)] bg-[var(--bg-secondary)] py-6">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-[var(--text-secondary)]">
			<p>
				<a
					href="https://github.com/FelixKratz/SketchyBar"
					target="_blank"
					rel="noopener noreferrer"
					class="text-[var(--accent)] hover:underline"
				>
					SketchyBar
				</a>
				is created by FelixKratz. This showcase is community-driven.
			</p>
			<p class="mt-2">
				<a
					href="https://github.com/YOUR_USERNAME/sketchybar-showcase"
					target="_blank"
					rel="noopener noreferrer"
					class="text-[var(--accent)] hover:underline"
				>
					Contribute your config
				</a>
			</p>
		</div>
	</footer>
</div>
