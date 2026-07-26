<script lang="ts">
	import { onMount } from 'svelte';
	import { animate, stagger } from 'animejs';

	let section: HTMLElement;
	let bars: HTMLElement[] = [];

	const matches = [
		{ label: '94% match', value: 94 },
		{ label: '88% match', value: 88 },
		{ label: '74% match', value: 74 }
	];

	const features = [
		{
			icon: 'shield-check',
			title: 'Anti-Ban Secure',
			description: 'Every campaign runs within TikTok-safe delivery limits, protecting your account from flags or bans.'
		},
		{
			icon: 'globe',
			title: 'Global Reach',
			description: 'Tap into viewer pools across regions and time zones to grow an audience wherever you stream.'
		}
	];

	onMount(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						entry.target.classList.add('revealed');
						if (entry.target === section) {
							section.querySelectorAll('.reveal-on-scroll').forEach((el) => el.classList.add('revealed'));
							animate(bars, {
								width: (el: any) => el.dataset.value + '%',
								delay: stagger(150),
								duration: 1000,
								ease: 'outCubic'
							});
						}
						observer.unobserve(entry.target);
					}
				});
			},
			{ threshold: 0.25 }
		);
		if (section) observer.observe(section);
		return () => observer.disconnect();
	});
</script>

<section bind:this={section} id="features" class="py-24 bg-[#0A0A0C] text-white border-t border-[#1C1C1E]">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<p class="text-center text-xs font-semibold tracking-[0.2em] text-gray-500 mb-4 reveal-on-scroll">FEATURES</p>
		<h2 class="text-3xl sm:text-4xl font-extrabold text-center tracking-tight mb-16 reveal-on-scroll">
			Built for creators who mean business
		</h2>

		<div class="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
			<!-- Precision Targeting -->
			<div class="p-6 rounded-2xl border border-[#232326] bg-[#131316]/60 backdrop-blur-md reveal-on-scroll">
				<div class="w-12 h-12 rounded-xl bg-[#FF2A54]/10 flex items-center justify-center text-[#FF2A54] mb-5 shadow-[0_0_15px_rgba(255,42,84,0.15)]">
					<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
						<path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12c1.5-4.5 5-7.5 9.75-7.5s8.25 3 9.75 7.5c-1.5 4.5-5 7.5-9.75 7.5s-8.25-3-9.75-7.5z" />
					</svg>
				</div>
				<h3 class="text-lg font-bold mb-1">Precision Targeting</h3>
				<p class="text-sm text-gray-400 mb-5">Reach viewers who actually match your niche, region, and interests.</p>
				<div class="space-y-3">
					{#each matches as m, i}
						<div>
							<div class="flex justify-between text-xs text-gray-400 mb-1.5">
								<span>{m.label}</span>
							</div>
							<div class="h-1.5 rounded-full bg-white/5 overflow-hidden">
								<div bind:this={bars[i]} data-value={m.value} class="h-full rounded-full bg-gradient-to-r from-[#FF2A54] to-purple-500" style="width: 0%"></div>
							</div>
						</div>
					{/each}
				</div>
			</div>

			<!-- Instant Start -->
			<div class="p-6 rounded-2xl border border-[#232326] bg-[#131316]/60 backdrop-blur-md reveal-on-scroll">
				<div class="w-12 h-12 rounded-xl bg-[#FF2A54]/10 flex items-center justify-center text-[#FF2A54] mb-5 shadow-[0_0_15px_rgba(255,42,84,0.15)]">
					<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
					</svg>
				</div>
				<h3 class="text-lg font-bold mb-1">Instant Start</h3>
				<p class="text-sm text-gray-400 mb-5">Activate a campaign and see viewers land on your stream within minutes, not hours.</p>
				<div class="flex items-center gap-3 mt-2">
					<div class="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
						<span class="relative flex h-1.5 w-1.5">
							<span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
							<span class="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400"></span>
						</span>
						<span class="text-xs font-medium text-emerald-400">Live in &lt; 2 min</span>
					</div>
				</div>
			</div>

			{#each features as feature}
				<div class="p-6 rounded-2xl border border-[#232326] bg-[#131316]/60 backdrop-blur-md reveal-on-scroll">
					<div class="w-12 h-12 rounded-xl bg-[#FF2A54]/10 flex items-center justify-center text-[#FF2A54] mb-5 shadow-[0_0_15px_rgba(255,42,84,0.15)]">
						{#if feature.icon === 'shield-check'}
							<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
								<path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.249-8.25-3.286zm0 0a3.001 3.001 0 00-4.686 0A3.001 3.001 0 0012 5.464z" />
							</svg>
						{:else}
							<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
								<path stroke-linecap="round" stroke-linejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18z" />
								<path stroke-linecap="round" stroke-linejoin="round" d="M3.6 9h16.8M3.6 15h16.8M11.5 3a17 17 0 000 18M12.5 3a17 17 0 010 18" />
							</svg>
						{/if}
					</div>
					<h3 class="text-lg font-bold mb-1">{feature.title}</h3>
					<p class="text-sm text-gray-400">{feature.description}</p>
				</div>
			{/each}
		</div>
	</div>
</section>
