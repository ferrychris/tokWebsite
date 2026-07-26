<script lang="ts">
	import { fade } from 'svelte/transition';

	let { show = false, message = 'Loading…' }: { show?: boolean; message?: string } = $props();
</script>

{#if show}
	<div
		class="fixed inset-0 z-[90] flex flex-col items-center justify-center gap-4 bg-[#0A0A0C]/85 backdrop-blur-sm"
		role="status"
		aria-live="polite"
		transition:fade={{ duration: 150 }}
	>
		<svg class="h-9 w-9 animate-spin text-[#FF2A54]" fill="none" viewBox="0 0 24 24">
			<circle class="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
			<path class="opacity-90" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
		</svg>
		<p class="text-sm font-medium text-gray-300">{message}</p>
	</div>
{/if}
