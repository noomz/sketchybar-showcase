<script lang="ts">
	interface Props {
		tags: string[];
		selectedTags: string[];
		onToggle: (tag: string) => void;
	}

	let { tags, selectedTags, onToggle }: Props = $props();
</script>

<div class="flex flex-wrap gap-2">
	{#each tags as tag}
		{@const isSelected = selectedTags.includes(tag)}
		<button
			type="button"
			onclick={() => onToggle(tag)}
			class="px-3 py-1.5 text-sm rounded-full border transition-colors {isSelected
				? 'bg-[var(--accent)] text-white border-[var(--accent)]'
				: 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] border-[var(--border-color)] hover:border-[var(--accent)] hover:text-[var(--text-primary)]'}"
		>
			{tag}
		</button>
	{/each}
</div>
