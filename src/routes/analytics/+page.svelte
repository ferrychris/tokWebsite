<script lang="ts">
	import Card from '$lib/components/ui/card.svelte';
	import Badge from '$lib/components/ui/badge.svelte';
	import Progress from '$lib/components/ui/progress.svelte';
	import Separator from '$lib/components/ui/separator.svelte';
	let { data } = $props();
	const campaigns = $derived(data.campaigns || []);
	const stats = $derived(data.stats);

	const formatCurrency = (n: number) => `₦${n.toLocaleString()}`;

	const statusVariant: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
		draft: 'secondary', pending: 'outline', scheduled: 'outline',
		active: 'default', completed: 'secondary', cancelled: 'destructive'
	};
</script>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
	<h1 class="text-3xl font-bold mb-2">Analytics</h1>
	<p class="text-muted-foreground mb-8">Track your campaign performance</p>

	<div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
		<Card>
			<div class="p-6">
				<div class="flex items-center justify-between"><p class="text-sm text-muted-foreground">Total Campaigns</p>
					<svg class="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M3.75 3v16.5M21 19.5H3.75M6.75 12v4.5m3-7.5v7.5m3-10.5v10.5m3-6v6m3-9v9" />
					</svg>
				</div>
				<p class="text-2xl font-bold mt-2">{stats?.totalCampaigns || 0}</p>
			</div>
		</Card>
		<Card>
			<div class="p-6">
				<div class="flex items-center justify-between"><p class="text-sm text-muted-foreground">Viewers Ordered</p>
					<svg class="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
						<path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
					</svg>
				</div>
				<p class="text-2xl font-bold mt-2">{(stats?.totalViewers || 0).toLocaleString()}</p>
			</div>
		</Card>
		<Card>
			<div class="p-6">
				<div class="flex items-center justify-between"><p class="text-sm text-muted-foreground">Viewers Delivered</p>
					<svg class="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.109A11.386 11.386 0 0 1 10.089 20M3 16.5a4.125 4.125 0 0 1 7.533-2.493m0 0a4.125 4.125 0 0 1 7.533 2.493M3 16.5v.225A11.386 11.386 0 0 0 8.89 20h.02M3 16.5a11.382 11.382 0 0 1 4.89-3.372M8.25 10.5a3.75 3.75 0 1 1 7.5 0 3.75 3.75 0 0 1-7.5 0zM15.75 9a3 3 0 1 1 6 0 3 3 0 0 1-6 0z" />
					</svg>
				</div>
				<p class="text-2xl font-bold mt-2">{(stats?.totalDelivered || 0).toLocaleString()}</p>
			</div>
		</Card>
		<Card>
			<div class="p-6">
				<div class="flex items-center justify-between"><p class="text-sm text-muted-foreground">Total Spend</p>
					<svg class="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
					</svg>
				</div>
				<p class="text-2xl font-bold mt-2">{formatCurrency(stats?.totalSpend || 0)}</p>
			</div>
		</Card>
	</div>

	<div class="grid sm:grid-cols-2 gap-4 mb-8">
		<Card>
			<div class="p-6">
				<div class="flex items-center gap-2 mb-4">
					<svg class="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
						<circle cx="12" cy="12" r="9" />
						<circle cx="12" cy="12" r="5" />
						<circle cx="12" cy="12" r="1" />
					</svg>
					<h3 class="font-semibold">Delivery Rate</h3>
				</div>
				<p class="text-3xl font-bold text-primary">{stats?.deliveryRate || 0}%</p>
				<Progress value={stats?.deliveryRate || 0} class="mt-3" />
			</div>
		</Card>
		<Card>
			<div class="p-6">
				<div class="flex items-center gap-2 mb-4">
					<svg class="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
					</svg>
					<h3 class="font-semibold">Completion Rate</h3>
				</div>
				<p class="text-3xl font-bold text-primary">{stats?.completionRate || 0}%</p>
				<Progress value={stats?.completionRate || 0} class="mt-3" />
			</div>
		</Card>
	</div>

	<Card>
		<div class="p-6">
			<h3 class="font-semibold mb-4">Campaign Performance</h3>
			{#if campaigns.length === 0}
				<p class="text-sm text-muted-foreground text-center py-8">No campaigns to analyze</p>
			{:else}
				<div class="overflow-x-auto">
					<table class="w-full text-sm">
						<thead>
							<tr class="border-b text-left">
								<th class="pb-3 font-medium text-muted-foreground">Campaign</th>
								<th class="pb-3 font-medium text-muted-foreground">Viewers</th>
								<th class="pb-3 font-medium text-muted-foreground">Delivered</th>
								<th class="pb-3 font-medium text-muted-foreground">Duration</th>
								<th class="pb-3 font-medium text-muted-foreground">Rate</th>
								<th class="pb-3 font-medium text-muted-foreground">Status</th>
							</tr>
						</thead>
						<tbody>
							{#each campaigns as c}
								<tr class="border-b last:border-0">
									<td class="py-3 pr-4">
										<a href="/campaigns/{c.id}" class="text-primary hover:underline truncate block max-w-[200px]">@{c.live_url.match(/@([^/]+)/)?.[1] || c.live_url}</a>
									</td>
									<td class="py-3">{c.viewers_requested}</td>
									<td class="py-3">{c.viewers_delivered || 0}</td>
									<td class="py-3">{c.duration} min</td>
									<td class="py-3">
										{c.viewers_requested > 0 ? Math.round(((c.viewers_delivered || 0) / c.viewers_requested) * 100) : 0}%
									</td>
									<td class="py-3"><Badge variant={statusVariant[c.status]}>{c.status}</Badge></td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			{/if}
		</div>
	</Card>
</div>
