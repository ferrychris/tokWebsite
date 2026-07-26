<script lang="ts">
	import { onMount } from 'svelte';

	let section: HTMLElement;
	let cards: HTMLElement[] = [];

	const testimonials = [
		{
			quote: 'We are exclusively with the go-getters, with our acquisition.',
			name: 'Kenny',
			role: 'Content Creator'
		},
		{
			quote: 'Driver TikTok’s acquisition campaigns, measure watch time, even your audience...',
			name: 'Aster',
			role: 'Livestream Host'
		},
		{
			quote: 'Helps us find creators that impacts follower growth and audience retention trends.',
			name: 'Sarah',
			role: 'Growth Manager'
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

<section bind:this={section} class="py-24 bg-[#0A0A0C] text-white border-t border-[#1C1C1E]">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<p class="text-center text-xs font-semibold tracking-[0.2em] text-gray-500 mb-4 reveal-on-scroll">TESTIMONIALS</p>
		<h2 class="text-3xl sm:text-4xl font-extrabold text-center tracking-tight mb-16 reveal-on-scroll">
			Loved by creators growing fast
		</h2>

		<div class="grid md:grid-cols-3 gap-6">
			{#each testimonials as t, i}
				<div
					bind:this={cards[i]}
					class="p-6 rounded-2xl border border-[#232326] bg-[#131316]/60 backdrop-blur-md reveal-on-scroll"
					style="transition-delay: {i * 0.15}s"
				>
					<svg class="h-6 w-6 text-[#FF2A54]/40 mb-4" fill="currentColor" viewBox="0 0 24 24">
						<path d="M7.17 6A5.17 5.17 0 002 11.17V18h6.83v-6.83H5.66c0-1.94 1.57-3.5 3.51-3.5V6zm10 0a5.17 5.17 0 00-5.17 5.17V18H18.8v-6.83h-3.17c0-1.94 1.57-3.5 3.51-3.5V6z"/>
					</svg>
					<p class="text-sm text-gray-300 leading-relaxed mb-6">{t.quote}</p>
					<div class="flex items-center gap-3">
						<div class="w-9 h-9 rounded-full shrink-0" style="background: linear-gradient(135deg, hsl({20 + i * 70} 80% 55%), hsl({80 + i * 70} 70% 45%));"></div>
						<div>
							<div class="text-sm font-semibold text-white">{t.name}</div>
							<div class="text-xs text-gray-500">{t.role}</div>
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>
