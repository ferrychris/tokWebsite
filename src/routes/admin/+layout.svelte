<script lang="ts">
	import { Users, BarChart3, Wallet, Shield } from 'lucide-svelte';

	let { children, data } = $props();
</script>

<div class="flex min-h-[calc(100vh-4rem)]">
	<aside class="w-64 border-r bg-muted/30 hidden md:block p-4">
		<div class="flex items-center gap-2 mb-6">
			<Shield class="h-5 w-5 text-primary" />
			<span class="font-semibold">Admin Panel</span>
		</div>
		<nav class="space-y-1">
			<a href="/admin" class="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium hover:bg-accent transition-colors">
				<BarChart3 class="h-4 w-4" /> Overview
			</a>
			<a href="/admin/users" class="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium hover:bg-accent transition-colors">
				<Users class="h-4 w-4" /> Users
			</a>
			<a href="/admin/campaigns" class="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium hover:bg-accent transition-colors">
				<BarChart3 class="h-4 w-4" /> Campaigns
			</a>
			<a href="/admin/wallets" class="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium hover:bg-accent transition-colors">
				<Wallet class="h-4 w-4" /> Wallets
			</a>
		</nav>
	</aside>
	<main class="flex-1 p-8">
		{@render children()}
	</main>
</div>
