<script lang="ts">
	import { base } from '$app/paths';
	import type { ShowcaseListItem } from '$lib/types';
	import { getLikedIds, getLikedCount, toggleLike, clearAllLikes } from '$lib/stores/likes.svelte';

	interface Props {
		showcases: ShowcaseListItem[];
	}

	let { showcases }: Props = $props();

	let isOpen = $state(false);

	const likedCount = $derived(getLikedCount());
	const likedIds = $derived(getLikedIds());
	const likedShowcases = $derived(
		likedIds
			.map((id) => showcases.find((s) => s.id === id))
			.filter((s): s is ShowcaseListItem => s !== undefined)
	);

	function handleToggle() {
		isOpen = !isOpen;
	}

	function handleClose() {
		isOpen = false;
	}

	function handleUnlike(e: MouseEvent, id: string) {
		e.preventDefault();
		e.stopPropagation();
		toggleLike(id);
	}

	function handleClearAll() {
		clearAllLikes();
	}

	function handleClickOutside(e: MouseEvent) {
		const target = e.target as HTMLElement;
		if (!target.closest('.likes-menu-container')) {
			isOpen = false;
		}
	}
</script>

<svelte:window onclick={handleClickOutside} />

<div class="likes-menu-container relative">
	<button
		type="button"
		onclick={handleToggle}
		class="relative p-2 rounded-lg transition-colors {likedCount > 0 ? 'text-red-500 hover:bg-red-500/10' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]'}"
		title="Liked showcases"
	>
		<svg class="w-6 h-6" viewBox="0 0 24 24" fill={likedCount > 0 ? 'currentColor' : 'none'} stroke="currentColor" stroke-width="2">
			<path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
		</svg>
		{#if likedCount > 0}
			<span class="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center text-xs font-medium bg-red-500 text-white rounded-full px-1">
				{likedCount > 99 ? '99+' : likedCount}
			</span>
		{/if}
	</button>

	{#if isOpen}
		<div class="absolute right-0 top-full mt-2 w-80 max-h-96 overflow-hidden bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg shadow-xl z-50">
			<div class="p-3 border-b border-[var(--border-color)] flex items-center justify-between">
				<h3 class="font-medium text-[var(--text-primary)]">Liked Showcases</h3>
				{#if likedCount > 0}
					<button
						type="button"
						onclick={handleClearAll}
						class="text-xs text-[var(--text-secondary)] hover:text-red-500 transition-colors"
					>
						Clear all
					</button>
				{/if}
			</div>

			<div class="overflow-y-auto max-h-72">
				{#if likedShowcases.length > 0}
					{#each likedShowcases as showcase (showcase.id)}
						<a
							href="{base}/showcase/{showcase.id}"
							onclick={handleClose}
							class="flex items-center gap-3 p-3 hover:bg-[var(--bg-primary)] transition-colors border-b border-[var(--border-color)] last:border-b-0"
						>
							<img
								src="{base}{showcase.thumbnail}"
								alt={showcase.title}
								class="w-12 h-8 object-cover rounded"
							/>
							<div class="flex-1 min-w-0">
								<p class="text-sm font-medium text-[var(--text-primary)] truncate">{showcase.title}</p>
								<p class="text-xs text-[var(--text-secondary)]">by {showcase.author}</p>
							</div>
							<button
								type="button"
								onclick={(e) => handleUnlike(e, showcase.id)}
								class="p-1.5 text-red-500 hover:bg-red-500/10 rounded transition-colors"
								title="Unlike"
							>
								<svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
									<path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
								</svg>
							</button>
						</a>
					{/each}
				{:else}
					<div class="p-6 text-center">
						<svg class="w-12 h-12 mx-auto text-[var(--text-secondary)] opacity-50 mb-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
							<path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
						</svg>
						<p class="text-sm text-[var(--text-secondary)]">No liked showcases yet</p>
						<p class="text-xs text-[var(--text-secondary)] mt-1">Click the heart icon on any showcase to save it here</p>
					</div>
				{/if}
			</div>
		</div>
	{/if}
</div>
