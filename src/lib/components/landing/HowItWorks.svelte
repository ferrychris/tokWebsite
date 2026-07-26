<script lang="ts">
	import { onMount } from 'svelte';

	let section: HTMLElement;
	let cards: HTMLElement[] = [];

	const steps = [
		{
			icon: 'connect',
			title: 'Connect Stream',
			desc: 'Connect your TikTok account and set your livestream URL in seconds.'
		},
		{
			icon: 'wallet',
			title: 'Fund Your Wallet',
			desc: 'Top up securely with Paystack or Flutterwave and set your campaign budget.'
		},
		{
			icon: 'rocket',
			title: 'Go Live & Grow',
			desc: 'Activate your campaign to drive real viewers and grow your livestream audience.'
		}
	];

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
		<p class="text-center text-xs font-semibold tracking-[0.2em] text-gray-500 mb-4 reveal-on-scroll">HOW IT WORKS</p>
		<h2 class="text-3xl sm:text-4xl font-extrabold text-center tracking-tight mb-16 reveal-on-scroll">
			Live in three simple steps
		</h2>

		<div class="grid md:grid-cols-3 gap-6">
			{#each steps as step, i}
				<div
					bind:this={cards[i]}
					class="p-6 bg-[#131316]/40 border border-[#232326] rounded-2xl backdrop-blur-md hover:border-[#FF2A54]/20 transition-all duration-300 hover:scale-[1.02] reveal-on-scroll"
					style="transition-delay: {i * 0.15}s"
				>
					<div class="w-12 h-12 rounded-xl bg-[#FF2A54]/10 flex items-center justify-center text-[#FF2A54] mb-5 shadow-[0_0_15px_rgba(255,42,84,0.15)]">
						{#if step.icon === 'connect'}
							<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
								<path stroke-linecap="round" stroke-linejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
							</svg>
						{:else if step.icon === 'wallet'}
							<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
								<path stroke-linecap="round" stroke-linejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6.75A2.25 2.25 0 0018.75 4.5H5.25A2.25 2.25 0 003 6.75V9" />
							</svg>
						{:else}
							<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
								<path stroke-linecap="round" stroke-linejoin="round" d="M15.59 14.37a6 6 0 01-5.84 0M12 18.75v3M10.5 20.25h3m-7.5-6.75A9.04 9.04 0 0112 3.75c3.978 0 7.399 2.564 8.717 6.136A8.96 8.96 0 0112 20.25a9.04 9.04 0 01-6.217-2.614z" />
							</svg>
						{/if}
					</div>
					<h3 class="font-bold text-white text-lg mb-1.5">{step.title}</h3>
					<p class="text-sm text-gray-400 leading-relaxed">{step.desc}</p>
				</div>
			{/each}
		</div>
	</div>
</section>
