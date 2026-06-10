<script lang="ts">
	import Card from '$lib/components/ui/card.svelte';
	import Badge from '$lib/components/ui/badge.svelte';
	import Separator from '$lib/components/ui/separator.svelte';
	import { createClient } from '$lib/supabase/client';

	let { data } = $props();
	let wallets = $state(data.wallets || []);
	let transactions = $state(data.transactions || []);
	const supabase = createClient();
	const fc = (n: number) => `\u20A6${n.toLocaleString()}`;

	const tv: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
		completed: 'default', pending: 'outline', failed: 'destructive'
	};
</script>

<div>
	<h1 class="text-3xl font-bold mb-8">Manage Wallets</h1>

	<div class="grid lg:grid-cols-2 gap-8">
		<Card>
			<div class="p-6">
				<h2 class="font-semibold mb-4">All Wallets</h2>
				<div class="overflow-x-auto">
					<table class="w-full text-sm">
						<thead>
							<tr class="border-b text-left">
								<th class="pb-3 font-medium text-muted-foreground">User ID</th>
								<th class="pb-3 font-medium text-muted-foreground">Balance</th>
								<th class="pb-3 font-medium text-muted-foreground">Bonus</th>
								<th class="pb-3 font-medium text-muted-foreground">Total</th>
							</tr>
						</thead>
						<tbody>
							{#each wallets as w}
								<tr class="border-b last:border-0">
									<td class="py-3 pr-4 text-xs font-mono">{w.user_id.slice(0, 8)}...</td>
									<td class="py-3 pr-4">{fc(w.balance)}</td>
									<td class="py-3 pr-4">{fc(w.bonus_balance)}</td>
									<td class="py-3 pr-4 font-semibold">{fc((w.balance || 0) + (w.bonus_balance || 0))}</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</div>
		</Card>

		<Card>
			<div class="p-6">
				<h2 class="font-semibold mb-4">Recent Transactions</h2>
				{#if transactions.length === 0}
					<p class="text-sm text-muted-foreground text-center py-8">No transactions</p>
				{:else}
					<div class="space-y-3">
						{#each transactions as tx}
							<div class="flex items-center justify-between p-3 rounded-lg border text-sm">
								<div>
									<p class="font-medium capitalize">{tx.type.replace('_', ' ')}</p>
									<p class="text-xs text-muted-foreground">{new Date(tx.created_at).toLocaleDateString()}</p>
								</div>
								<div class="text-right">
									<p class="font-semibold">{fc(tx.amount)}</p>
									<Badge variant={tv[tx.status] || 'outline'} class="text-xs">{tx.status}</Badge>
								</div>
							</div>
						{/each}
					</div>
				{/if}
			</div>
		</Card>
	</div>
</div>
