<script lang="ts">
	import Card from '$lib/components/ui/card.svelte';
	import { Users, BarChart3, TrendingUp, DollarSign } from 'lucide-svelte';

	let { data } = $props();
	const stats = $derived(data.stats);
	const fc = (n: number) => `\u20A6${n.toLocaleString()}`;
</script>

<div>
	<h1 class="text-3xl font-bold mb-8">Admin Overview</h1>
	<div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
		<Card><div class="p-6"><div class="flex items-center justify-between"><p class="text-sm text-muted-foreground">Total Users</p><Users class="h-4 w-4 text-muted-foreground" /></div><p class="text-3xl font-bold mt-2">{stats?.totalUsers || 0}</p></div></Card>
		<Card><div class="p-6"><div class="flex items-center justify-between"><p class="text-sm text-muted-foreground">Total Campaigns</p><BarChart3 class="h-4 w-4 text-muted-foreground" /></div><p class="text-3xl font-bold mt-2">{stats?.totalCampaigns || 0}</p></div></Card>
		<Card><div class="p-6"><div class="flex items-center justify-between"><p class="text-sm text-muted-foreground">Active Campaigns</p><BarChart3 class="h-4 w-4 text-muted-foreground" /></div><p class="text-3xl font-bold mt-2">{stats?.activeCampaigns || 0}</p></div></Card>
		<Card><div class="p-6"><div class="flex items-center justify-between"><p class="text-sm text-muted-foreground">Total Balance</p><DollarSign class="h-4 w-4 text-muted-foreground" /></div><p class="text-3xl font-bold mt-2">{fc(stats?.totalBalance || 0)}</p></div></Card>
		<Card><div class="p-6"><div class="flex items-center justify-between"><p class="text-sm text-muted-foreground">Bonus Balance</p><DollarSign class="h-4 w-4 text-muted-foreground" /></div><p class="text-3xl font-bold mt-2">{fc(stats?.totalBonus || 0)}</p></div></Card>
		<Card><div class="p-6"><div class="flex items-center justify-between"><p class="text-sm text-muted-foreground">Total Revenue</p><TrendingUp class="h-4 w-4 text-muted-foreground" /></div><p class="text-3xl font-bold mt-2">{fc(stats?.totalRevenue || 0)}</p></div></Card>
		<Card><div class="p-6"><div class="flex items-center justify-between"><p class="text-sm text-muted-foreground">Pending Deposits</p><DollarSign class="h-4 w-4 text-muted-foreground" /></div><p class="text-3xl font-bold mt-2">{stats?.pendingDeposits || 0}</p></div></Card>
	</div>
</div>
