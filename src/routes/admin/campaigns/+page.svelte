<script lang="ts">
	import Card from '$lib/components/ui/card.svelte';
	import Badge from '$lib/components/ui/badge.svelte';
	import { createClient } from '$lib/supabase/client';

	let { data } = $props();
	let campaigns = $state(data.campaigns || []);
	const supabase = createClient();
	const fc = (n: number) => `\u20A6${n.toLocaleString()}`;

	const sv: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
		draft: 'secondary', pending: 'outline', scheduled: 'outline',
		active: 'default', completed: 'secondary', cancelled: 'destructive'
	};

	async function updateStatus(id: string, status: string) {
		const campaign = campaigns.find((c: any) => c.id === id);
		const updateData: any = { status };
		if (status === 'completed' && campaign) {
			updateData.viewers_delivered = campaign.viewers_requested;
		}
		await supabase.from('campaigns').update(updateData).eq('id', id);
		campaigns = campaigns.map((c: any) => c.id === id ? { ...c, ...updateData } : c);
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
									<div class="flex gap-1">
										{#if c.status === 'draft' || c.status === 'pending'}
											<button onclick={() => updateStatus(c.id, 'active')} class="text-xs text-primary hover:underline">Activate</button>
										{/if}
										{#if c.status === 'active'}
											<button onclick={() => updateStatus(c.id, 'completed')} class="text-xs text-green-600 hover:underline">Complete</button>
											<button onclick={() => updateStatus(c.id, 'cancelled')} class="text-xs text-destructive hover:underline">Cancel</button>
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
