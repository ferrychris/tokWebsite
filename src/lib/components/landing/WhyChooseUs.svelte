<script lang="ts">
	const features = [
		{
			iconName: 'users',
			title: 'Real Users',
			description: 'All viewers are real people, not bots. They join and engage with your content naturally.'
		},
		{
			iconName: 'activity',
			title: 'Active Engagement',
			description: 'Viewers stay for the full duration of your stream, providing genuine social proof.'
		},
		{
			iconName: 'zap',
			title: 'Fast Delivery',
			description: 'Viewers start joining within minutes of campaign activation. No long wait times.'
		},
		{
			iconName: 'shield-check',
			title: 'Secure Payments',
			description: 'Pay securely with Paystack or Flutterwave. Your funds are protected.'
		}
	];
</script>

<section class="py-24 bg-muted/50">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="text-center mb-16">
			<h2 class="text-3xl sm:text-4xl font-bold">Why Choose Us</h2>
			<p class="mt-4 text-lg text-muted-foreground">The best platform for TikTok live engagement</p>
		</div>
		<div class="grid md:grid-cols-4 gap-8">
			{#each features as feature}
				<div class="text-center">
					<div class="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto">
						{#if feature.iconName === 'users'}
							<svg class="h-7 w-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
								<path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.109A11.386 11.386 0 0 1 10.089 20M3 16.5a4.125 4.125 0 0 1 7.533-2.493m0 0a4.125 4.125 0 0 1 7.533 2.493M3 16.5v.225A11.386 11.386 0 0 0 8.89 20h.02M3 16.5a11.382 11.382 0 0 1 4.89-3.372M8.25 10.5a3.75 3.75 0 1 1 7.5 0 3.75 3.75 0 0 1-7.5 0zM15.75 9a3 3 0 1 1 6 0 3 3 0 0 1-6 0z" />
							</svg>
						{:else if feature.iconName === 'activity'}
							<svg class="h-7 w-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
								<path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
							</svg>
						{:else if feature.iconName === 'zap'}
							<svg class="h-7 w-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
								<path stroke-linecap="round" stroke-linejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
							</svg>
						{:else if feature.iconName === 'shield-check'}
							<svg class="h-7 w-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
								<path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.249-8.25-3.286zm0 0a3.001 3.001 0 00-4.686 0A3.001 3.001 0 0012 5.464z" />
							</svg>
						{/if}
					</div>
					<h3 class="mt-6 text-lg font-semibold">{feature.title}</h3>
					<p class="mt-3 text-sm text-muted-foreground">{feature.description}</p>
				</div>
			{/each}
		</div>
	</div>
</section>
