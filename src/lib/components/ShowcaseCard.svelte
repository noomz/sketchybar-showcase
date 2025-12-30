<script lang="ts">
	import { base } from '$app/paths';
	import type { ShowcaseListItem } from '$lib/types';
	import { isLiked, toggleLike } from '$lib/stores/likes.svelte';
	import ModeIndicator from './ModeIndicator.svelte';

	interface Props {
		showcase: ShowcaseListItem;
	}

	let { showcase }: Props = $props();

	const liked = $derived(isLiked(showcase.id));

	function handleLikeClick(e: MouseEvent) {
		e.preventDefault();
		e.stopPropagation();
		toggleLike(showcase.id);
	}
</script>

<a
	href="{base}/showcase/{showcase.id}"
	class="group block bg-[var(--bg-secondary)] rounded-lg overflow-hidden border border-[var(--border-color)] hover:border-[var(--accent)] transition-all duration-200 hover:shadow-lg"
>
	<div class="aspect-video overflow-hidden bg-slate-900 relative">
		<img
			src="{base}{showcase.thumbnail}"
			alt="{showcase.title} preview"
			class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
			loading="lazy"
		/>
		<button
			type="button"
			onclick={handleLikeClick}
			class="absolute top-2 right-2 p-2 rounded-full bg-black/50 backdrop-blur-sm transition-all duration-200 hover:bg-black/70 hover:scale-110 {liked ? 'text-red-500' : 'text-white/80 hover:text-white'}"
			title={liked ? 'Unlike' : 'Like'}
		>
			<svg class="w-5 h-5" viewBox="0 0 24 24" fill={liked ? 'currentColor' : 'none'} stroke="currentColor" stroke-width="2">
				<path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
			</svg>
		</button>
	</div>
	<div class="p-4">
		<div class="flex items-start justify-between gap-2 mb-2">
			<h3 class="font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">
				{showcase.title}
			</h3>
			<ModeIndicator mode={showcase.mode} />
		</div>
		<p class="text-sm text-[var(--text-secondary)] mb-3">by {showcase.author}</p>
		<div class="flex flex-wrap gap-1.5">
			{#each showcase.tags.slice(0, 4) as tag}
				<span class="text-xs px-2 py-0.5 bg-[var(--bg-primary)] text-[var(--text-secondary)] rounded border border-[var(--border-color)]">
					{tag}
				</span>
			{/each}
			{#if showcase.tags.length > 4}
				<span class="text-xs px-2 py-0.5 text-[var(--text-secondary)]">
					+{showcase.tags.length - 4}
				</span>
			{/if}
		</div>
	</div>
</a>
