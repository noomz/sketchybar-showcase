<script lang="ts">
	import { base } from '$app/paths';
	import type { ShowcaseDetail } from '$lib/types';
	import ModeIndicator from '$lib/components/ModeIndicator.svelte';
	import Screenshot from '$lib/components/Screenshot.svelte';
	import DotfileTree from '$lib/components/DotfileTree.svelte';

	interface Props {
		data: {
			showcase: ShowcaseDetail;
			prevId: string | null;
			nextId: string | null;
			currentIndex: number;
			totalCount: number;
		};
	}

	let { data }: Props = $props();
	const showcase = $derived(data.showcase);
	const prevId = $derived(data.prevId);
	const nextId = $derived(data.nextId);
	const currentIndex = $derived(data.currentIndex);
	const totalCount = $derived(data.totalCount);
</script>

<svelte:head>
	<title>{showcase.title} - SketchyBar Showcase</title>
	<meta name="description" content={showcase.description} />
</svelte:head>

<div class="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
	<!-- Navigation Header -->
	<div class="flex items-center justify-between mb-6">
		<a
			href="{base}/"
			class="inline-flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
		>
			<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
			</svg>
			Back to showcases
		</a>

		<div class="flex items-center gap-2">
			<span class="text-sm text-[var(--text-secondary)]">{currentIndex} / {totalCount}</span>
			<div class="flex gap-1">
				{#if prevId}
					<a
						href="{base}/showcase/{prevId}"
						class="p-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--accent)] hover:border-[var(--accent)] transition-colors"
						title="Previous showcase"
					>
						<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
						</svg>
					</a>
				{:else}
					<span class="p-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--border-color)] cursor-not-allowed">
						<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
						</svg>
					</span>
				{/if}
				{#if nextId}
					<a
						href="{base}/showcase/{nextId}"
						class="p-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--accent)] hover:border-[var(--accent)] transition-colors"
						title="Next showcase"
					>
						<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
						</svg>
					</a>
				{:else}
					<span class="p-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--border-color)] cursor-not-allowed">
						<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
						</svg>
					</span>
				{/if}
			</div>
		</div>
	</div>

	<div class="grid lg:grid-cols-2 gap-8">
		<!-- Left: Screenshots -->
		<div>
			<Screenshot screenshots={showcase.screenshots} title={showcase.title} />
		</div>

		<!-- Right: Info -->
		<div class="space-y-6">
			<!-- Header -->
			<div>
				<div class="flex items-start justify-between gap-4 mb-2">
					<h1 class="text-3xl font-bold text-[var(--text-primary)]">{showcase.title}</h1>
					<ModeIndicator mode={showcase.mode} size="md" />
				</div>
				<p class="text-lg text-[var(--text-secondary)]">
					by
					<a
						href={showcase.authorUrl}
						target="_blank"
						rel="noopener noreferrer"
						class="text-[var(--accent)] hover:underline"
					>
						{showcase.author}
					</a>
				</p>
			</div>

			<!-- Description -->
			<p class="text-[var(--text-primary)] leading-relaxed">{showcase.description}</p>

			<!-- Tags -->
			<div class="flex flex-wrap gap-2">
				{#each showcase.tags as tag}
					<a
						href="{base}/?tag={encodeURIComponent(tag)}"
						class="px-3 py-1 text-sm rounded-full bg-[var(--bg-secondary)] text-[var(--text-secondary)] border border-[var(--border-color)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
					>
						{tag}
					</a>
				{/each}
			</div>

			<!-- Dependencies -->
			{#if showcase.dependencies.length > 0}
				<div>
					<h3 class="text-sm font-medium text-[var(--text-secondary)] uppercase tracking-wide mb-2">
						Dependencies
					</h3>
					<div class="flex flex-wrap gap-2">
						{#each showcase.dependencies as dep}
							<span class="px-2 py-1 text-sm font-mono bg-slate-800 text-slate-200 rounded">
								{dep}
							</span>
						{/each}
					</div>
				</div>
			{/if}

			<!-- GitHub Link -->
			<a
				href={showcase.githubUrl}
				target="_blank"
				rel="noopener noreferrer"
				class="inline-flex items-center gap-2 px-6 py-3 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors"
			>
				<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
					<path
						fill-rule="evenodd"
						d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
						clip-rule="evenodd"
					/>
				</svg>
				View on GitHub
			</a>
		</div>
	</div>

	<!-- Dotfiles Section (only show if dotfiles exist) -->
	{#if Object.keys(showcase.dotfiles).length > 0}
		<div class="mt-12">
			<h2 class="text-2xl font-bold text-[var(--text-primary)] mb-6">Configuration Files</h2>
			<DotfileTree dotfiles={showcase.dotfiles} />
		</div>
	{:else}
		<div class="mt-12">
			<h2 class="text-2xl font-bold text-[var(--text-primary)] mb-6">Configuration Files</h2>
			<div class="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg p-8 text-center">
				<p class="text-[var(--text-secondary)] mb-4">
					Configuration files are not available for this showcase.
				</p>
				<a
					href={showcase.githubUrl}
					target="_blank"
					rel="noopener noreferrer"
					class="inline-flex items-center gap-2 text-[var(--accent)] hover:underline"
				>
					<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
						<path
							fill-rule="evenodd"
							d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
							clip-rule="evenodd"
						/>
					</svg>
					View dotfiles on GitHub
				</a>
			</div>
		</div>
	{/if}

	<!-- Bottom Navigation -->
	<div class="mt-12 pt-8 border-t border-[var(--border-color)]">
		<div class="flex justify-between items-center">
			{#if prevId}
				<a
					href="{base}/showcase/{prevId}"
					class="flex items-center gap-3 px-4 py-3 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--accent)] hover:border-[var(--accent)] transition-colors"
				>
					<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
					</svg>
					<span>Previous</span>
				</a>
			{:else}
				<div></div>
			{/if}

			{#if nextId}
				<a
					href="{base}/showcase/{nextId}"
					class="flex items-center gap-3 px-4 py-3 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--accent)] hover:border-[var(--accent)] transition-colors"
				>
					<span>Next</span>
					<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
					</svg>
				</a>
			{:else}
				<div></div>
			{/if}
		</div>
	</div>
</div>
