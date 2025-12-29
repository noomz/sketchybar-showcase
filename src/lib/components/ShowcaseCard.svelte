<script lang="ts">
	import { base } from '$app/paths';
	import type { ShowcaseListItem } from '$lib/types';
	import ModeIndicator from './ModeIndicator.svelte';

	interface Props {
		showcase: ShowcaseListItem;
	}

	let { showcase }: Props = $props();
</script>

<a
	href="{base}/showcase/{showcase.id}"
	class="group block bg-[var(--bg-secondary)] rounded-lg overflow-hidden border border-[var(--border-color)] hover:border-[var(--accent)] transition-all duration-200 hover:shadow-lg"
>
	<div class="aspect-video overflow-hidden bg-slate-900">
		<img
			src="{base}{showcase.thumbnail}"
			alt="{showcase.title} preview"
			class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
			loading="lazy"
		/>
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
