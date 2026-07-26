<script lang="ts">
	import { onMount } from 'svelte';
	import Button from '$lib/components/ui/button.svelte';
	import Card from '$lib/components/ui/card.svelte';
	import Badge from '$lib/components/ui/badge.svelte';
	import { formatCurrency as formatCurrencyBase } from '$lib/utils/currency';
	let { data } = $props();
	let campaigns = $derived(data.campaigns || []);

	const statusVariant: Record<string, 'default' | 'secondary' | 'destructive' | 'outline' | 'success'> = {
		draft: 'secondary', pending: 'outline', scheduled: 'outline',
		active: 'success', completed: 'secondary', cancelled: 'destructive'
	};

	const formatCurrency = (n: number) => formatCurrencyBase(n, data.profile?.country);

	let now = $state(Date.now());
	onMount(() => {
		const interval = setInterval(() => { now = Date.now(); }, 1000);
		return () => clearInterval(interval);
	});

	function formatRelative(dateStr: string): string {
		const diff = Math.max(0, now - new Date(dateStr).getTime());
		const s = Math.floor(diff / 1000);
		if (s < 60) return 'just now';
		const m = Math.floor(s / 60);
		if (m < 60) return `${m}m ago`;
		const h = Math.floor(m / 60);
		if (h < 24) return `${h}h ago`;
		const d = Math.floor(h / 24);
		return `${d}d ago`;
	}

	function expiryInfo(campaign: { status: string; created_at: string; scheduled_at: string | null; duration: number }): { label: string; expired: boolean } | null {
		if (campaign.status === 'completed' || campaign.status === 'cancelled') return null;
		const start = new Date(campaign.scheduled_at || campaign.created_at).getTime();
		const expiresAt = start + campaign.duration * 60_000;
		const remaining = expiresAt - now;

		if (remaining <= 0) return { label: 'Expired', expired: true };

		const totalSeconds = Math.floor(remaining / 1000);
		const h = Math.floor(totalSeconds / 3600);
		const m = Math.floor((totalSeconds % 3600) / 60);
		const s = totalSeconds % 60;
		const label = h > 0 ? `${h}h ${m}m left` : m > 0 ? `${m}m ${s}s left` : `${s}s left`;
		return { label, expired: false };
	}
</script>

<svelte:head>
	<title>Campaigns — Tikweb</title>
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
				{@const expiry = expiryInfo(campaign)}
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
									<div class="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
										<span class="flex items-center gap-1">
											<svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
												<path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
											</svg> Created {formatRelative(campaign.created_at)}
										</span>
										{#if expiry}
											<span class="flex items-center gap-1 {expiry.expired ? 'text-destructive' : 'text-emerald-500'}">
												<svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
													<path stroke-linecap="round" stroke-linejoin="round" d="M13.5 3.75a1.5 1.5 0 013 0V6h-3V3.75zM12 9.75v4.5l3 1.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
												</svg> {expiry.label}
											</span>
										{/if}
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
