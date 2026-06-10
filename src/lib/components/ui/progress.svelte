<script lang="ts">
	import { cn } from '$lib/utils/cn';

	let {
		value = 0,
		class: className
	}: {
		value?: number;
		class?: string;
	} = $props();
</script>

<div
	class={cn('relative h-2 w-full overflow-hidden rounded-full bg-primary/20', className)}
	role="progressbar"
	aria-valuenow={value}
	aria-valuemin={0}
	aria-valuemax={100}
>
	<div
		class="h-full w-full flex-1 bg-primary transition-all"
		style="transform: translateX(-{100 - value}%)"
	></div>
</div>
