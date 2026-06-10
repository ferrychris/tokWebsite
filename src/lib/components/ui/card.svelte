<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils/cn';

	let {
		class: className,
		children
	}: {
		class?: string;
		children?: Snippet;
	} = $props();
</script>

<div class={cn('rounded-xl border bg-card text-card-foreground shadow', className)}>
	{@render children?.()}
</div>
