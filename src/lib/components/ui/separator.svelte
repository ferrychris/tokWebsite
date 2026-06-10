<script lang="ts">
	import { cn } from '$lib/utils/cn';

	let {
		orientation = 'horizontal',
		class: className
	}: {
		orientation?: 'horizontal' | 'vertical';
		class?: string;
	} = $props();
</script>

<div
	class={cn(
		'shrink-0 bg-border',
		orientation === 'horizontal' ? 'h-[1px] w-full' : 'h-full w-[1px]',
		className
	)}
></div>
