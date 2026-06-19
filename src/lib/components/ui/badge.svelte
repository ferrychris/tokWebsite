<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils/cn';

	let {
		variant = 'default',
		class: className,
		children
	}: {
		variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success';
		class?: string;
		children?: Snippet;
	} = $props();
</script>

<span
	class={cn(
		'inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
		{
			'border-transparent bg-primary text-primary-foreground shadow': variant === 'default',
			'border-transparent bg-secondary text-secondary-foreground': variant === 'secondary',
			'border-transparent bg-destructive text-destructive-foreground shadow': variant === 'destructive',
			'text-foreground': variant === 'outline',
			'border-transparent bg-green-600 text-white shadow': variant === 'success'
		},
		className
	)}
>
	{@render children?.()}
</span>
