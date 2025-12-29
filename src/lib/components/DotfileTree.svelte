<script lang="ts">
	import CodeBlock from './CodeBlock.svelte';

	interface Props {
		dotfiles: Record<string, string>;
	}

	let { dotfiles }: Props = $props();
	let selectedFile = $state<string | null>(null);
	let copiedAll = $state(false);

	// Sort files to group by directory
	const sortedFiles = $derived(
		Object.keys(dotfiles).sort((a, b) => {
			const aDepth = a.split('/').length;
			const bDepth = b.split('/').length;
			if (aDepth !== bDepth) return aDepth - bDepth;
			return a.localeCompare(b);
		})
	);

	// Auto-select first file
	$effect(() => {
		if (selectedFile === null && sortedFiles.length > 0) {
			selectedFile = sortedFiles[0];
		}
	});

	function getIcon(filename: string): string {
		if (filename.endsWith('.sh') || filename === 'sketchybarrc') return '📜';
		if (filename.endsWith('.lua')) return '🌙';
		if (filename.includes('/')) return '📁';
		return '📄';
	}

	async function copyAllFiles() {
		const allContent = Object.entries(dotfiles)
			.map(([name, content]) => `# === ${name} ===\n${content}`)
			.join('\n\n');

		try {
			await navigator.clipboard.writeText(allContent);
			copiedAll = true;
			setTimeout(() => {
				copiedAll = false;
			}, 2000);
		} catch (err) {
			console.error('Failed to copy:', err);
		}
	}
</script>

<div class="flex flex-col lg:flex-row gap-4">
	<!-- File Tree -->
	<div class="lg:w-64 shrink-0">
		<div class="bg-[var(--bg-secondary)] rounded-lg border border-[var(--border-color)] overflow-hidden">
			<div class="px-4 py-3 border-b border-[var(--border-color)] flex items-center justify-between">
				<span class="font-medium text-sm text-[var(--text-primary)]">Files</span>
				<button
					type="button"
					onclick={copyAllFiles}
					class="text-xs px-2 py-1 rounded bg-[var(--accent)] text-white hover:opacity-90 transition-opacity"
				>
					{copiedAll ? 'Copied!' : 'Copy All'}
				</button>
			</div>
			<div class="p-2 max-h-80 overflow-y-auto">
				{#each sortedFiles as file}
					<button
						type="button"
						onclick={() => (selectedFile = file)}
						class="w-full text-left px-3 py-2 rounded text-sm font-mono flex items-center gap-2 transition-colors {selectedFile === file
							? 'bg-[var(--accent)] text-white'
							: 'text-[var(--text-secondary)] hover:bg-[var(--bg-primary)] hover:text-[var(--text-primary)]'}"
					>
						<span>{getIcon(file)}</span>
						<span class="truncate">{file}</span>
					</button>
				{/each}
			</div>
		</div>
	</div>

	<!-- Code View -->
	<div class="flex-1 min-w-0">
		{#if selectedFile && dotfiles[selectedFile]}
			<CodeBlock code={dotfiles[selectedFile]} filename={selectedFile} />
		{:else}
			<div class="h-64 flex items-center justify-center text-[var(--text-secondary)] bg-[var(--bg-secondary)] rounded-lg border border-[var(--border-color)]">
				Select a file to view its contents
			</div>
		{/if}
	</div>
</div>
