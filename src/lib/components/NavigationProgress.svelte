<script lang="ts">
	import { navigating } from '$app/stores';
	import { fade } from 'svelte/transition';

	// Every route in this app has a server `load`, so navigation always costs a
	// round trip. Without this, clicking a nav link looks like nothing happened.
	// Delayed slightly so instant navigations don't flash a bar.
	let visible = $state(false);
	let timer: ReturnType<typeof setTimeout> | null = null;

	$effect(() => {
		if ($navigating) {
			timer = setTimeout(() => (visible = true), 120);
		} else {
			if (timer) clearTimeout(timer);
			timer = null;
			visible = false;
		}
		return () => {
			if (timer) clearTimeout(timer);
		};
	});
</script>

{#if visible}
	<div class="fixed inset-x-0 top-0 z-[100] h-0.5 bg-transparent pointer-events-none" transition:fade={{ duration: 150 }}>
		<div class="nav-progress h-full bg-gradient-to-r from-[#FF2A54] to-purple-500 shadow-[0_0_10px_rgba(255,42,84,0.7)]"></div>
	</div>
{/if}

<style>
	/* Eases toward 90% and waits there — the bar disappears when the load
	   finishes rather than pretending to know how long it will take. */
	.nav-progress {
		animation: nav-progress 8s cubic-bezier(0.1, 0.6, 0.3, 1) forwards;
	}

	@keyframes nav-progress {
		0% { width: 0%; }
		30% { width: 55%; }
		60% { width: 78%; }
		100% { width: 90%; }
	}

	@media (prefers-reduced-motion: reduce) {
		.nav-progress {
			animation: none;
			width: 90%;
		}
	}
</style>
