<script lang="ts">
	import Button from '$lib/components/ui/button.svelte';
	import Card from '$lib/components/ui/card.svelte';
	import Badge from '$lib/components/ui/badge.svelte';
	import Progress from '$lib/components/ui/progress.svelte';
	import Separator from '$lib/components/ui/separator.svelte';
	import { toast } from 'svelte-sonner';
	import { enhance } from '$app/forms';
	import { Eye, Clock, Globe, ArrowLeft, Play, CalendarClock } from 'lucide-svelte';

	let { data, form } = $props();
	let campaign = $state(data.campaign);
	let wallet = $state(data.wallet);

	let activating = $state(false);

	const formatCurrency = (n: number) => `₦${n.toLocaleString()}`;

	$effect(() => {
		if (form?.success) {
			campaign = { ...campaign, status: 'active' };
			toast.success('Campaign Activated', { description: 'Viewers will start joining shortly' });
		} else if (form?.error) {
			toast.error(form.error);
			activating = false;
		}
	});

	const statusVariant: Record<string, 'default' | 'secondary' | 'destructive' | 'outline' | 'success'> = {
		draft: 'secondary', pending: 'outline', scheduled: 'outline',
		active: 'success', completed: 'secondary', cancelled: 'destructive'
	};

	const canActivate = $derived(campaign.status === 'draft' || campaign.status === 'pending');
</script>

<div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
	<a href="/campaigns" class="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
		<ArrowLeft class="h-4 w-4 mr-1" /> Back to Campaigns
	</a>

	<div class="flex items-center justify-between mb-6">
		<div>
			<h1 class="text-2xl font-bold">Campaign Details</h1>
			<p class="text-sm text-muted-foreground mt-1">Created {new Date(campaign.created_at).toLocaleDateString()}</p>
		</div>
		<Badge variant={statusVariant[campaign.status]} class="text-sm px-3 py-1">{campaign.status}</Badge>
	</div>

	<div class="grid sm:grid-cols-3 gap-3 mb-6">
		<Card>
			<div class="p-3 text-center">
				<Eye class="h-4 w-4 text-primary mx-auto mb-1" />
				<p class="text-lg font-bold">{campaign.viewers_requested}</p>
				<p class="text-xs text-muted-foreground">Viewers</p>
			</div>
		</Card>
		<Card>
			<div class="p-3 text-center">
				<Clock class="h-4 w-4 text-primary mx-auto mb-1" />
				<p class="text-lg font-bold">{campaign.duration}</p>
				<p class="text-xs text-muted-foreground">Duration (min)</p>
			</div>
		</Card>
		<Card>
			<div class="p-3 text-center">
				<Globe class="h-4 w-4 text-primary mx-auto mb-1" />
				<p class="text-lg font-bold">{formatCurrency(campaign.cost)}</p>
				<p class="text-xs text-muted-foreground">Total Cost</p>
			</div>
		</Card>
	</div>

	{#if campaign.status === 'active' && campaign.viewers_delivered !== undefined}
		<Card class="mb-8">
			<div class="p-6">
				<h3 class="font-semibold mb-3">Acquisition Progress</h3>
				<div class="flex justify-between text-sm text-muted-foreground mb-2">
					<span>{campaign.viewers_delivered} of {campaign.viewers_requested} viewers</span>
					<span>{Math.round((campaign.viewers_delivered / campaign.viewers_requested) * 100)}%</span>
				</div>
				<Progress value={Math.round((campaign.viewers_delivered / campaign.viewers_requested) * 100)} />
			</div>
		</Card>
	{/if}

	<Card class="mb-8">
		<div class="p-6">
			<h3 class="font-semibold mb-4">Campaign Info</h3>
			<div class="space-y-3 text-sm">
				<div class="flex justify-between">
					<span class="text-muted-foreground">TikTok Username</span>
					<span class="font-medium">@{campaign.live_url.match(/@([^/]+)/)?.[1] || 'Unknown'}</span>
				</div>
				<Separator />
				<div class="flex justify-between">
					<span class="text-muted-foreground">TikTok Live URL</span>
					<a href={campaign.live_url} target="_blank" class="text-primary hover:underline truncate max-w-[300px]">{campaign.live_url}</a>
				</div>
				<Separator />
				<div class="flex justify-between">
					<span class="text-muted-foreground">Viewers Requested</span>
					<span>{campaign.viewers_requested}</span>
				</div>
				<Separator />
				<div class="flex justify-between">
					<span class="text-muted-foreground">Duration</span>
					<span>{campaign.duration} minutes</span>
				</div>
				{#if campaign.scheduled_at}
					<Separator />
					<div class="flex justify-between">
						<span class="text-muted-foreground flex items-center gap-1.5"><CalendarClock class="h-3.5 w-3.5" /> Scheduled</span>
						<span>{new Date(campaign.scheduled_at).toLocaleString()}</span>
					</div>
				{/if}
				<Separator />
				<div class="flex justify-between">
					<span class="text-muted-foreground">Cost</span>
					<span class="font-semibold">{formatCurrency(campaign.cost)}</span>
				</div>
				<Separator />
				<div class="flex justify-between">
					<span class="text-muted-foreground">Viewers Acquired</span>
					<span>{campaign.viewers_delivered || 0}</span>
				</div>
				<Separator />
				<div class="flex justify-between">
					<span class="text-muted-foreground">Wallet Balance</span>
					<span class="font-semibold">{formatCurrency((wallet?.balance || 0) + (wallet?.bonus_balance || 0))}</span>
				</div>
			</div>
		</div>
	</Card>

	{#if form?.error}
		<p class="text-sm text-destructive mb-4">{form.error}</p>
	{/if}

	<div class="flex gap-3">
		{#if canActivate}
			<form method="POST" action="?/activate" use:enhance={() => { activating = true; return async ({ update }) => { activating = false; update(); }; }}>
				<Button type="submit" disabled={activating}>
					{#if activating}
						<svg class="h-4 w-4 mr-2 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" /><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
					{:else}
						<Play class="h-4 w-4 mr-2" />
					{/if}
					{activating ? 'Activating...' : 'Activate Campaign'}
				</Button>
			</form>
		{/if}
	</div>
</div>
