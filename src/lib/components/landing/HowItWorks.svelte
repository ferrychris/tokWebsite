<script lang="ts">
	import { onMount } from 'svelte';

	let section: HTMLElement;
	let cards: HTMLElement[] = [];

	onMount(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						entry.target.classList.add('revealed');
						observer.unobserve(entry.target);
					}
				});
			},
			{ threshold: 0.2 }
		);
		if (section) observer.observe(section);
		cards.forEach((el) => observer.observe(el));
		return () => observer.disconnect();
	});
</script>

<section bind:this={section} id="how-it-works" class="py-20 bg-[#0A0A0C] text-white border-t border-[#1C1C1E]">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<h2 class="text-3xl font-extrabold text-center tracking-tight mb-16 reveal-on-scroll">
			How It Works
		</h2>

		<div class="max-w-2xl mx-auto space-y-4">
			{#each [{ icon: 'bolt', title: 'Connect Account', desc: 'Connect your TikTok account and set your live stream URL.' }, { icon: 'clock', title: 'Create a Campaign', desc: 'Set your campaign parameters, choose duration, and fund your wallet.' }, { icon: 'rocket', title: 'Go Live & Grow', desc: 'Activate your campaign to drive traffic and build your livestream audience.' }] as step, i}
				<div
					bind:this={cards[i]}
					class="flex items-start gap-4 p-5 bg-[#131316]/40 border border-[#232326] rounded-2xl backdrop-blur-md hover:border-[#FF2A54]/20 transition-all duration-300 hover:scale-[1.02] reveal-on-scroll"
					style="transition-delay: {i * 0.15}s"
				>
					<div class="w-12 h-12 rounded-xl bg-[#FF2A54]/10 flex items-center justify-center text-[#FF2A54] shrink-0 shadow-[0_0_15px_rgba(255,42,84,0.15)]">
						{#if step.icon === 'bolt'}
							<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
								<path stroke-linecap="round" stroke-linejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
							</svg>
						{:else if step.icon === 'clock'}
							<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
								<path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
							</svg>
						{:else}
							<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
								<path stroke-linecap="round" stroke-linejoin="round" d="M15.59 14.37a6 6 0 01-5.84 0M12 18.75v3M10.5 20.25h3m-7.5-6.75A9.04 9.04 0 0112 3.75c3.978 0 7.399 2.564 8.717 6.136A8.96 8.96 0 0112 20.25a9.04 9.04 0 01-6.217-2.614z" />
							</svg>
						{/if}
					</div>
					<div class="text-left">
						<h4 class="font-bold text-white text-base">{step.title}</h4>
						<p class="text-sm text-gray-400 mt-1">{step.desc}</p>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>
