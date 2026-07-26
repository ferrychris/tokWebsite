<script lang="ts">
	import { onMount } from 'svelte';
	import { animate, stagger } from 'animejs';
	import Button from '$lib/components/ui/button.svelte';
	import { PRICE_PER_VIEWER } from '$lib/utils/constants';
	import { defaultCurrency, toDisplayAmount, type CurrencyCode } from '$lib/utils/currency';

	let { country = null }: { country?: string | null } = $props();

	// Defaults to USD; only users we know are in Nigeria start on Naira.
	// Either way the toggle overrides it.
	let currency = $state<CurrencyCode>(defaultCurrency(country));

	const tiers = [50, 100, 250, 500];
	const plans = tiers.map((viewers) => ({
		viewers,
		costNgn: viewers * PRICE_PER_VIEWER,
		popular: viewers === 100
	}));

	// Animated price values — anime.js tweens these on every currency switch.
	let shown = $state(plans.map((p) => toDisplayAmount(p.costNgn, currency)));

	function formatShown(value: number): string {
		return currency === 'NGN'
			? `₦${Math.round(value).toLocaleString()}`
			: `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
	}

	function switchTo(next: CurrencyCode) {
		if (next === currency) return;
		const from = shown.slice();
		const to = plans.map((p) => toDisplayAmount(p.costNgn, next));
		currency = next;

		const tween = { t: 0 };
		animate(tween, {
			t: 1,
			duration: 600,
			ease: 'outExpo',
			onUpdate: () => {
				shown = from.map((v, i) => v + (to[i] - v) * tween.t);
			}
		});
	}

	let section: HTMLElement;
	let cards: HTMLElement[] = [];

	onMount(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (!entry.isIntersecting) return;
					entry.target.classList.add('revealed');
					if (entry.target === section) {
						section.querySelectorAll('.reveal-on-scroll').forEach((el) => el.classList.add('revealed'));
						animate(cards, {
							opacity: [0, 1],
							translateY: [24, 0],
							delay: stagger(110),
							duration: 700,
							ease: 'outQuad'
						});
					}
					observer.unobserve(entry.target);
				});
			},
			{ threshold: 0.15 }
		);
		if (section) observer.observe(section);
		return () => observer.disconnect();
	});
</script>

<section bind:this={section} id="pricing" class="relative py-24 bg-[#0A0A0C] text-white border-t border-[#1C1C1E] overflow-hidden">
	<!-- Ambient glow + grid, echoing the rest of the landing page -->
	<div class="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-[#FF2A54]/10 rounded-full filter blur-[130px] pointer-events-none animate-pulse-glow"></div>
	<div
		class="absolute inset-x-0 top-0 h-80 pointer-events-none opacity-40 [mask-image:radial-gradient(60%_60%_at_50%_0%,black,transparent)]"
		style="background-image: linear-gradient(to right, #ffffff10 1px, transparent 1px), linear-gradient(to bottom, #ffffff10 1px, transparent 1px); background-size: 70px 80px;"
	></div>

	<div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
		<p class="text-center text-xs font-semibold tracking-[0.2em] text-gray-500 mb-4 reveal-on-scroll">PRICING</p>
		<h2 class="text-3xl sm:text-4xl font-extrabold text-center tracking-tight reveal-on-scroll">
			Plans that work best for your stream
		</h2>
		<p class="text-center text-gray-400 mt-4 max-w-xl mx-auto reveal-on-scroll">
			Pay only for the viewers you need. No subscriptions, no hidden fees.
		</p>

		<!-- Currency switch -->
		<div class="flex justify-center mt-8 reveal-on-scroll">
			<div class="relative flex w-fit rounded-full bg-[#131316] border border-[#232326] p-1">
				<div
					class="absolute top-1 h-10 w-[calc(50%-0.25rem)] rounded-full bg-gradient-to-t from-[#E01E43] to-[#FF2A54] shadow-[0_0_16px_rgba(255,42,84,0.45)] transition-transform duration-300 ease-out"
					style="transform: translateX({currency === 'USD' ? '0' : '100%'});"
				></div>
				<button
					type="button"
					onclick={() => switchTo('USD')}
					aria-pressed={currency === 'USD'}
					class="relative z-10 h-10 px-7 rounded-full text-sm font-semibold transition-colors {currency === 'USD' ? 'text-white' : 'text-gray-400 hover:text-gray-200'}"
				>
					Dollars ($)
				</button>
				<button
					type="button"
					onclick={() => switchTo('NGN')}
					aria-pressed={currency === 'NGN'}
					class="relative z-10 h-10 px-7 rounded-full text-sm font-semibold transition-colors {currency === 'NGN' ? 'text-white' : 'text-gray-400 hover:text-gray-200'}"
				>
					Naira (₦)
				</button>
			</div>
		</div>

		<div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-12">
			{#each plans as plan, i}
				<div
					bind:this={cards[i]}
					class="relative rounded-2xl border p-6 opacity-0 backdrop-blur-md transition-colors {plan.popular
						? 'border-[#FF2A54]/40 bg-gradient-to-b from-[#1B1B20] to-[#121216] shadow-[0_0_40px_-12px_rgba(255,42,84,0.45)]'
						: 'border-[#232326] bg-[#131316]/60 hover:border-[#FF2A54]/20'}"
				>
					{#if plan.popular}
						<span class="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#FF2A54] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full whitespace-nowrap">
							Most Popular
						</span>
					{/if}

					<h3 class="text-lg font-bold">{plan.viewers} Viewers</h3>

					<div class="mt-4 flex items-baseline gap-1">
						<span class="text-3xl font-extrabold tracking-tight tabular-nums">{formatShown(shown[i])}</span>
					</div>
					<p class="mt-1 text-xs text-gray-500">per campaign &middot; per 10 min slot</p>

					<ul class="mt-6 space-y-3 text-sm border-t border-[#232326] pt-5">
						{#each ['Real live viewers', 'Fast campaign kickoff', 'Measure watch time'] as feature}
							<li class="flex items-start gap-2">
								<span class="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#FF2A54] shrink-0"></span>
								<span class="text-gray-400">{feature}</span>
							</li>
						{/each}
					</ul>

					<a href="/register" class="mt-6 block">
						<Button
							class={plan.popular
								? 'w-full bg-[#FF2A54] hover:bg-[#E01E43] text-white border-0 rounded-xl py-3 h-auto font-semibold shadow-[0_0_20px_rgba(255,42,84,0.35)] transition-all hover:scale-[1.02] active:scale-95'
								: 'w-full bg-transparent border border-[#2A2A2E] hover:bg-white/5 text-white rounded-xl py-3 h-auto font-semibold transition-all hover:scale-[1.02] active:scale-95'}
						>
							Get Started
						</Button>
					</a>
				</div>
			{/each}
		</div>

		{#if currency === 'USD'}
			<p class="text-center text-xs text-gray-500 mt-8">
				Prices shown in USD for reference. Payments are processed in Naira.
			</p>
		{/if}
	</div>
</section>
