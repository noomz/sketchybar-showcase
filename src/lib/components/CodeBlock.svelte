<script lang="ts">
	interface Props {
		code: string;
		filename: string;
	}

	let { code, filename }: Props = $props();
	let copied = $state(false);

	async function copyCode() {
		try {
			await navigator.clipboard.writeText(code);
			copied = true;
			setTimeout(() => {
				copied = false;
			}, 2000);
		} catch (err) {
			console.error('Failed to copy:', err);
		}
	}

	// Simple language detection based on filename
	function getLanguage(filename: string): string {
		if (filename.endsWith('.sh') || filename === 'sketchybarrc') return 'bash';
		if (filename.endsWith('.lua')) return 'lua';
		if (filename.endsWith('.json')) return 'json';
		if (filename.endsWith('.yaml') || filename.endsWith('.yml')) return 'yaml';
		return 'bash';
	}

	const language = $derived(getLanguage(filename));
</script>

<div class="rounded-lg overflow-hidden border border-[var(--border-color)] bg-slate-900">
	<div class="flex items-center justify-between px-4 py-2 bg-slate-800 border-b border-slate-700">
		<span class="text-sm text-slate-300 font-mono">{filename}</span>
		<button
			type="button"
			onclick={copyCode}
			class="flex items-center gap-1.5 px-3 py-1 text-sm rounded bg-slate-700 text-slate-300 hover:bg-slate-600 transition-colors"
		>
			{#if copied}
				<svg class="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
				</svg>
				<span class="text-green-400">Copied!</span>
			{:else}
				<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
					/>
				</svg>
				<span>Copy</span>
			{/if}
		</button>
	</div>
	<div class="overflow-x-auto">
		<pre class="p-4 text-sm text-slate-100 font-mono leading-relaxed"><code>{code}</code></pre>
	</div>
</div>
