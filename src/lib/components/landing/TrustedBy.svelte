<script lang="ts">
	import { onMount } from 'svelte';

	let el: HTMLElement;

	const brands = [
		{ name: 'StreamPro', icon: 'bolt' },
		{ name: 'Agency.X', icon: 'grid' },
		{ name: 'TT-Flow', icon: 'wave' },
		{ name: 'Creatorly', icon: 'star' },
		{ name: 'Boost.io', icon: 'rocket' }
	];

	onMount(() => {
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					entry.target.classList.add('revealed');
					observer.unobserve(entry.target);
				}
			},
			{ threshold: 0.2 }
		);
		if (el) observer.observe(el);
		return () => observer.disconnect();
	});
</script>

<section bind:this={el} class="py-14 bg-[#0A0A0C] border-t border-[#1C1C1E] reveal-on-scroll">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<p class="text-center text-xs font-semibold tracking-[0.2em] text-gray-500 mb-8">
			TRUSTED BY TOP AGENCIES &amp; RISING STARS
		</p>
		<div class="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
			{#each brands as brand}
				<div class="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
					<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
						{#if brand.icon === 'bolt'}
							<path stroke-linecap="round" stroke-linejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
						{:else if brand.icon === 'grid'}
							<path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
						{:else if brand.icon === 'wave'}
							<path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12c1.5-3 3-3 4.5 0s3 3 4.5 0 3-3 4.5 0 3 3 4.5 0" />
						{:else if brand.icon === 'star'}
							<path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.562.562 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
						{:else}
							<path stroke-linecap="round" stroke-linejoin="round" d="M15.59 14.37a6 6 0 01-5.84 0M12 18.75v3M10.5 20.25h3m-7.5-6.75A9.04 9.04 0 0112 3.75c3.978 0 7.399 2.564 8.717 6.136A8.96 8.96 0 0112 20.25a9.04 9.04 0 01-6.217-2.614z" />
						{/if}
					</svg>
					<span class="font-bold text-sm tracking-wide uppercase">{brand.name}</span>
				</div>
			{/each}
		</div>
	</div>
</section>
