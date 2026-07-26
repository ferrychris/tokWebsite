<script lang="ts">
	import { onMount } from 'svelte';
	import Button from '$lib/components/ui/button.svelte';

	let el: HTMLElement;

	onMount(() => {
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					entry.target.classList.add('revealed');
					observer.unobserve(entry.target);
				}
			},
			{ threshold: 0.3 }
		);
		if (el) observer.observe(el);
		return () => observer.disconnect();
	});
</script>

<section bind:this={el} class="relative py-24 bg-[#0A0A0C] text-white overflow-hidden reveal-on-scroll">
	<div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#FF2A54]/10 rounded-full filter blur-[120px] pointer-events-none animate-pulse-glow"></div>
	<div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
		<h2 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-8">Ready to blow up?</h2>
		<a href="/register">
			<Button class="bg-[#FF2A54] hover:bg-[#E01E43] text-white border-0 text-base font-semibold px-8 py-3.5 h-auto rounded-xl shadow-[0_0_20px_rgba(255,42,84,0.4)] transition-all hover:scale-105 active:scale-95">
				Get Started Now
			</Button>
		</a>
		<p class="mt-4 text-sm text-gray-500">No credit card required to start.</p>
	</div>
</section>
