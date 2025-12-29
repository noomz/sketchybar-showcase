<script lang="ts">
	import type { ShowcaseListItem } from '$lib/types';
	import ShowcaseCard from '$lib/components/ShowcaseCard.svelte';
	import SearchBar from '$lib/components/SearchBar.svelte';
	import TagFilter from '$lib/components/TagFilter.svelte';
	import ModeFilter from '$lib/components/ModeFilter.svelte';

	interface Props {
		data: {
			showcases: ShowcaseListItem[];
			tags: Array<{ id: string; label: string; count: number }>;
		};
	}

	let { data }: Props = $props();

	let searchQuery = $state('');
	let selectedTags = $state<string[]>([]);
	let modeFilter = $state<'all' | 'dark' | 'light'>('all');

	const tagLabels = $derived(data.tags.map((t) => t.label));

	const filteredShowcases = $derived.by(() => {
		let result = data.showcases;

		// Search filter
		if (searchQuery.trim()) {
			const query = searchQuery.toLowerCase();
			result = result.filter(
				(s) =>
					s.title.toLowerCase().includes(query) ||
					s.author.toLowerCase().includes(query) ||
					s.tags.some((t) => t.toLowerCase().includes(query))
			);
		}

		// Tag filter
		if (selectedTags.length > 0) {
			result = result.filter((s) => selectedTags.some((tag) => s.tags.includes(tag)));
		}

		// Mode filter
		if (modeFilter !== 'all') {
			result = result.filter((s) => s.mode === modeFilter || s.mode === 'both');
		}

		return result;
	});

	function toggleTag(tag: string) {
		if (selectedTags.includes(tag)) {
			selectedTags = selectedTags.filter((t) => t !== tag);
		} else {
			selectedTags = [...selectedTags, tag];
		}
	}

	function clearFilters() {
		searchQuery = '';
		selectedTags = [];
		modeFilter = 'all';
	}

	const hasActiveFilters = $derived(
		searchQuery.trim() !== '' || selectedTags.length > 0 || modeFilter !== 'all'
	);
</script>

<svelte:head>
	<title>SketchyBar Showcase</title>
	<meta name="description" content="Discover beautiful SketchyBar configurations for your macOS menu bar" />
</svelte:head>

<div class="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
	<!-- Search and Filters -->
	<div class="mb-8 space-y-4">
		<div class="flex flex-col sm:flex-row gap-4">
			<div class="flex-1">
				<SearchBar value={searchQuery} onchange={(v) => (searchQuery = v)} />
			</div>
			<ModeFilter value={modeFilter} onchange={(v) => (modeFilter = v)} />
		</div>

		<div class="flex flex-wrap items-center gap-4">
			<span class="text-sm text-[var(--text-secondary)]">Tags:</span>
			<TagFilter tags={tagLabels} {selectedTags} onToggle={toggleTag} />
		</div>

		{#if hasActiveFilters}
			<div class="flex items-center justify-between">
				<p class="text-sm text-[var(--text-secondary)]">
					Showing {filteredShowcases.length} of {data.showcases.length} showcases
				</p>
				<button
					type="button"
					onclick={clearFilters}
					class="text-sm text-[var(--accent)] hover:underline"
				>
					Clear filters
				</button>
			</div>
		{/if}
	</div>

	<!-- Showcase Grid -->
	{#if filteredShowcases.length > 0}
		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
			{#each filteredShowcases as showcase (showcase.id)}
				<ShowcaseCard {showcase} />
			{/each}
		</div>
	{:else}
		<div class="text-center py-16">
			<svg
				class="mx-auto h-12 w-12 text-[var(--text-secondary)]"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
				/>
			</svg>
			<h3 class="mt-4 text-lg font-medium text-[var(--text-primary)]">No showcases found</h3>
			<p class="mt-2 text-[var(--text-secondary)]">
				Try adjusting your search or filters to find what you're looking for.
			</p>
			<button
				type="button"
				onclick={clearFilters}
				class="mt-4 px-4 py-2 bg-[var(--accent)] text-white rounded-lg hover:opacity-90 transition-opacity"
			>
				Clear all filters
			</button>
		</div>
	{/if}
</div>
