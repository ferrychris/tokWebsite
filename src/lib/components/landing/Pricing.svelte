<script lang="ts">
	import Button from '$lib/components/ui/button.svelte';
	const plans = [
		{ viewers: '50', cost: '₦5,000', popular: false },
		{ viewers: '100', cost: '₦10,000', popular: true },
		{ viewers: '250', cost: '₦25,000', popular: false },
		{ viewers: '500', cost: '₦50,000', popular: false }
	];
</script>

<section id="pricing" class="py-24">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="text-center mb-16">
			<h2 class="text-3xl sm:text-4xl font-bold">Simple Pricing</h2>
			<p class="mt-4 text-lg text-muted-foreground">Pay only for what you need. No hidden fees.</p>
		</div>
		<div class="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
			{#each plans as plan}
				<div class="rounded-xl border bg-card text-card-foreground shadow-sm p-6 {plan.popular ? 'ring-2 ring-primary relative' : ''}">
					{#if plan.popular}
						<span class="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
							Most Popular
						</span>
					{/if}
					<div class="text-center">
						<h3 class="text-lg font-semibold">{plan.viewers} Viewers</h3>
						<div class="mt-4 text-3xl font-bold">{plan.cost}</div>
						<p class="mt-1 text-sm text-muted-foreground">per campaign</p>
						<ul class="mt-6 space-y-3 text-left">
							<li class="flex items-start gap-2 text-sm">
								<svg class="h-4 w-4 text-primary mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
									<path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
								</svg>
								<span>Real live viewers</span>
							</li>
							<li class="flex items-start gap-2 text-sm">
								<svg class="h-4 w-4 text-primary mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
									<path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
								</svg>
								<span>Fast campaign kickoff</span>
							</li>
							<li class="flex items-start gap-2 text-sm">
								<svg class="h-4 w-4 text-primary mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
									<path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
								</svg>
								<span>Measure watch time</span>
							</li>
						</ul>
						<a href="/register" class="mt-6 block">
							<Button class="w-full" variant={plan.popular ? 'default' : 'outline'}>Get Started</Button>
						</a>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>
