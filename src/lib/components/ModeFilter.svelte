<script lang="ts">
	type ModeValue = 'all' | 'dark' | 'light';

	interface Props {
		value: ModeValue;
		onchange: (value: ModeValue) => void;
	}

	let { value, onchange }: Props = $props();

	const options: { value: ModeValue; label: string; icon: string }[] = [
		{ value: 'all', label: 'All', icon: '🎨' },
		{ value: 'dark', label: 'Dark', icon: '🌙' },
		{ value: 'light', label: 'Light', icon: '☀️' }
	];
</script>

<div class="inline-flex rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] p-1">
	{#each options as option}
		<button
			type="button"
			onclick={() => onchange(option.value)}
			class="px-3 py-1.5 text-sm rounded-md transition-colors {value === option.value
				? 'bg-[var(--accent)] text-white'
				: 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}"
		>
			<span class="mr-1">{option.icon}</span>
			{option.label}
		</button>
	{/each}
</div>
