<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils/cn';

	let {
		value = $bindable(''),
		class: className,
		children
	}: {
		value?: string;
		class?: string;
		children?: Snippet;
	} = $props();
</script>

<div class={cn('w-full', className)}>
	{@render children?.()}
</div>
