<script lang="ts">
	import Card from '$lib/components/ui/card.svelte';
	import Badge from '$lib/components/ui/badge.svelte';
	import { createClient } from '$lib/supabase/client';
	import { formatCurrency } from '$lib/utils/currency';

	let { data } = $props();
	let campaigns = $state(data.campaigns || []);
	const supabase = createClient();
	const fc = (n: number) => formatCurrency(n, data.profile?.country);

	const sv: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
		draft: 'secondary', pending: 'outline', scheduled: 'outline',
		active: 'default', completed: 'secondary', cancelled: 'destructive'
	};

	// Tracks which campaign is mid-update so the row can show progress and
	// can't be double-clicked into a race.
	let pending = $state<Record<string, boolean>>({});

	async function updateStatus(id: string, status: string) {
		if (pending[id]) return;
		pending = { ...pending, [id]: true };
		try {
			const campaign = campaigns.find((c: any) => c.id === id);
			const updateData: any = { status };
			if (status === 'completed' && campaign) {
				updateData.viewers_delivered = campaign.viewers_requested;
			}
			await supabase.from('campaigns').update(updateData).eq('id', id);
			campaigns = campaigns.map((c: any) => c.id === id ? { ...c, ...updateData } : c);
		} finally {
			const { [id]: _, ...rest } = pending;
			pending = rest;
		}
	}
</script>

<div>
	<h1 class="text-3xl font-bold mb-8">Manage Campaigns</h1>
	<Card>
		<div class="p-6">
			<div class="overflow-x-auto">
				<table class="w-full text-sm">
					<thead>
						<tr class="border-b text-left">
							<th class="pb-3 font-medium text-muted-foreground">User ID</th>
							<th class="pb-3 font-medium text-muted-foreground">Live URL</th>
							<th class="pb-3 font-medium text-muted-foreground">Viewers</th>
							<th class="pb-3 font-medium text-muted-foreground">Cost</th>
							<th class="pb-3 font-medium text-muted-foreground">Delivered</th>
							<th class="pb-3 font-medium text-muted-foreground">Status</th>
							<th class="pb-3 font-medium text-muted-foreground">Actions</th>
						</tr>
					</thead>
					<tbody>
						{#each campaigns as c}
							<tr class="border-b last:border-0">
								<td class="py-3 pr-4 text-xs font-mono">{c.user_id.slice(0, 8)}...</td>
								<td class="py-3 pr-4 max-w-[200px] truncate">
									<a href={c.live_url} target="_blank" class="hover:underline text-primary">
										@{c.live_url.match(/@([^/]+)/)?.[1] || c.live_url}
									</a>
								</td>
								<td class="py-3 pr-4">{c.viewers_requested}</td>
								<td class="py-3 pr-4">{fc(c.cost)}</td>
								<td class="py-3 pr-4">{c.viewers_delivered || 0}</td>
								<td class="py-3 pr-4"><Badge variant={sv[c.status]}>{c.status}</Badge></td>
								<td class="py-3">
									<div class="flex gap-2 items-center">
										{#if pending[c.id]}
											<span class="text-xs text-muted-foreground flex items-center gap-1">
												<svg class="h-3 w-3 animate-spin" fill="none" viewBox="0 0 24 24">
													<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
													<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
												</svg> Updating…
											</span>
										{:else}
											{#if c.status === 'draft' || c.status === 'pending'}
												<button onclick={() => updateStatus(c.id, 'active')} class="text-xs text-primary hover:underline">Activate</button>
											{/if}
											{#if c.status === 'active'}
												<button onclick={() => updateStatus(c.id, 'completed')} class="text-xs text-green-600 hover:underline">Complete</button>
												<button onclick={() => updateStatus(c.id, 'cancelled')} class="text-xs text-destructive hover:underline">Cancel</button>
											{/if}
										{/if}
									</div>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	</Card>
</div>
