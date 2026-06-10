<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils/cn';
	type HTMLButtonAttributes = import('svelte/elements').HTMLButtonAttributes;

	let {
		ref = $bindable(null),
		value = $bindable(''),
		placeholder = 'Select...',
		class: className,
		children,
		...rest
	}: {
		ref?: HTMLButtonElement | null;
		value?: string;
		placeholder?: string;
		class?: string;
		children?: Snippet;
	} & HTMLButtonAttributes = $props();

	let open = $state(false);

	function handleSelect(val: string) {
		value = val;
		open = false;
	}
</script>

<div class="relative">
	<button
		bind:this={ref}
		class={cn(
			'flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
			className
		)}
		onclick={() => open = !open}
		{...rest}
	>
		<span class={value ? '' : 'text-muted-foreground'}>{value || placeholder}</span>
		<svg class="h-4 w-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
			<path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
		</svg>
	</button>
	{#if open}
		<div class="absolute z-50 mt-1 w-full rounded-md border bg-popover p-1 text-popover-foreground shadow-md">
			{@render children?.()}
		</div>
	{/if}
</div>
