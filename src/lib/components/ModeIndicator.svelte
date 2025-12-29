<script lang="ts">
	interface Props {
		mode: 'dark' | 'light' | 'both';
		size?: 'sm' | 'md';
	}

	let { mode, size = 'sm' }: Props = $props();

	const config = {
		dark: { icon: '🌙', label: 'Dark', bg: 'bg-slate-700', text: 'text-slate-100' },
		light: { icon: '☀️', label: 'Light', bg: 'bg-amber-100', text: 'text-amber-800' },
		both: { icon: '🌗', label: 'Both', bg: 'bg-purple-100', text: 'text-purple-800' }
	};

	const sizeClasses = {
		sm: 'text-xs px-2 py-0.5',
		md: 'text-sm px-3 py-1'
	};

	const current = $derived(config[mode]);
</script>

<span
	class="{current.bg} {current.text} {sizeClasses[size]} rounded-full font-medium inline-flex items-center gap-1"
>
	<span>{current.icon}</span>
	<span>{current.label}</span>
</span>
