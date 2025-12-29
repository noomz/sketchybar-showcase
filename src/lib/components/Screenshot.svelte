<script lang="ts">
	import { base } from '$app/paths';

	interface Props {
		screenshots: string[];
		title: string;
	}

	let { screenshots, title }: Props = $props();
	let selectedIndex = $state(0);
	let lightboxOpen = $state(false);

	function openLightbox(index: number) {
		selectedIndex = index;
		lightboxOpen = true;
	}

	function closeLightbox() {
		lightboxOpen = false;
	}

	function navigate(direction: number) {
		selectedIndex = (selectedIndex + direction + screenshots.length) % screenshots.length;
	}

	function handleKeydown(e: KeyboardEvent) {
		if (!lightboxOpen) return;
		if (e.key === 'Escape') closeLightbox();
		if (e.key === 'ArrowLeft') navigate(-1);
		if (e.key === 'ArrowRight') navigate(1);
	}
</script>

<svelte:window onkeydown={handleKeydown} />

<div class="space-y-4">
	<!-- Main Image -->
	<button
		type="button"
		onclick={() => openLightbox(selectedIndex)}
		class="w-full rounded-lg overflow-hidden bg-slate-900 border border-[var(--border-color)] hover:border-[var(--accent)] transition-colors cursor-zoom-in"
	>
		<img
			src="{base}{screenshots[selectedIndex]}"
			alt="{title} screenshot {selectedIndex + 1}"
			class="w-full h-auto"
		/>
	</button>

	<!-- Thumbnails -->
	{#if screenshots.length > 1}
		<div class="flex gap-2 overflow-x-auto pb-2">
			{#each screenshots as screenshot, index}
				<button
					type="button"
					onclick={() => (selectedIndex = index)}
					class="shrink-0 w-24 h-16 rounded overflow-hidden border-2 transition-colors {index === selectedIndex
						? 'border-[var(--accent)]'
						: 'border-transparent hover:border-[var(--border-color)]'}"
				>
					<img
						src="{base}{screenshot}"
						alt="{title} thumbnail {index + 1}"
						class="w-full h-full object-cover"
					/>
				</button>
			{/each}
		</div>
	{/if}
</div>

<!-- Lightbox -->
{#if lightboxOpen}
	<div
		class="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
		role="dialog"
		aria-modal="true"
	>
		<button
			type="button"
			onclick={closeLightbox}
			class="absolute top-4 right-4 p-2 text-white hover:text-slate-300 transition-colors"
			aria-label="Close lightbox"
		>
			<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
			</svg>
		</button>

		{#if screenshots.length > 1}
			<button
				type="button"
				onclick={() => navigate(-1)}
				class="absolute left-4 p-2 text-white hover:text-slate-300 transition-colors"
				aria-label="Previous image"
			>
				<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
				</svg>
			</button>
			<button
				type="button"
				onclick={() => navigate(1)}
				class="absolute right-4 p-2 text-white hover:text-slate-300 transition-colors"
				aria-label="Next image"
			>
				<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
				</svg>
			</button>
		{/if}

		<button type="button" onclick={closeLightbox} class="max-w-[90vw] max-h-[90vh]">
			<img
				src="{base}{screenshots[selectedIndex]}"
				alt="{title} screenshot {selectedIndex + 1}"
				class="max-w-full max-h-[90vh] object-contain"
			/>
		</button>

		{#if screenshots.length > 1}
			<div class="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm">
				{selectedIndex + 1} / {screenshots.length}
			</div>
		{/if}
	</div>
{/if}
