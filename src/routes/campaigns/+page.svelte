<script lang="ts">
	import Button from '$lib/components/ui/button.svelte';
	import Card from '$lib/components/ui/card.svelte';
	import Badge from '$lib/components/ui/badge.svelte';
	let { data } = $props();
	let campaigns = $derived(data.campaigns || []);

	const statusVariant: Record<string, 'default' | 'secondary' | 'destructive' | 'outline' | 'success'> = {
		draft: 'secondary', pending: 'outline', scheduled: 'outline',
		active: 'success', completed: 'secondary', cancelled: 'destructive'
	};

	const formatCurrency = (n: number) => `₦${n.toLocaleString()}`;
</script>

<svelte:head>
	<title>Campaigns — Soyomu Live</title>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
	<div class="flex items-center justify-between mb-8">
		<div>
			<h1 class="text-3xl font-bold">Campaigns</h1>
			<p class="text-muted-foreground mt-1">Manage your TikTok Live campaigns</p>
		</div>
		<a href="/campaigns/new">
			<Button>
				<svg class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
				</svg> New Campaign
			</Button>
		</a>
	</div>

	{#if campaigns.length === 0}
		<Card>
			<div class="p-12 text-center">
				<svg class="h-12 w-12 text-muted-foreground mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
					<path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
				</svg>
				<h3 class="text-lg font-semibold">No campaigns yet</h3>
				<p class="text-sm text-muted-foreground mt-2">Create your first campaign to start getting viewers</p>
				<a href="/campaigns/new" class="mt-4 inline-block">
					<Button>Create Your First Campaign</Button>
				</a>
			</div>
		</Card>
	{:else}
		<div class="grid gap-4">
			{#each campaigns as campaign}
				<a href="/campaigns/{campaign.id}">
					<Card class="hover:bg-muted/50 transition-colors cursor-pointer">
						<div class="p-6">
							<div class="flex items-center justify-between">
								<div class="flex-1 min-w-0">
									<h3 class="font-semibold truncate">@{campaign.live_url.match(/@([^/]+)/)?.[1] || campaign.live_url}</h3>
									<div class="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
										<span class="flex items-center gap-1">
											<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
												<path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
												<path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
											</svg> {campaign.viewers_requested} viewers
										</span>
										<span class="flex items-center gap-1">
											<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
												<path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
											</svg> {campaign.duration} min
										</span>
										<span>{formatCurrency(campaign.cost)}</span>
									</div>
								</div>
								<Badge variant={statusVariant[campaign.status]}>{campaign.status}</Badge>
							</div>
						</div>
					</Card>
				</a>
			{/each}
		</div>
	{/if}
</div>
