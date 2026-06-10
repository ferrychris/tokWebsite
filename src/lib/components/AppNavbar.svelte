<script lang="ts">
	import { sidebarCollapsed } from '$lib/stores/sidebar';
	import NotificationBell from './NotificationBell.svelte';

	let { data }: { data: App.PageData } = $props();
	let collapsed = $state(false);

	$effect(() => {
		sidebarCollapsed.set(collapsed);
	});
</script>

<nav class="sticky top-0 z-30 h-14 bg-[#0D0D11]/90 backdrop-blur-md border-b border-[#1D1D22] flex items-center justify-between px-4">
	<div class="flex items-center gap-3">
		<button onclick={() => collapsed = !collapsed} aria-label="Toggle sidebar" class="p-1.5 rounded-lg hover:bg-[#1D1D22] text-[#9E9EA7] hover:text-white transition-colors">
			<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
				<path stroke-linecap="round" stroke-linejoin="round" d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5" />
			</svg>
		</button>
		<a href="/" class="flex items-center gap-2 font-bold text-white tracking-tight text-sm">
			<div class="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#1E1E24] to-[#2D2D35] flex items-center justify-center border border-[#3D3D45] shrink-0">
				<svg class="h-3.5 w-3.5" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M30 20C45 20 55 35 55 50C55 65 45 80 30 80" stroke="#FFFFFF" stroke-width="16" stroke-linecap="round"/>
					<path d="M70 20C55 20 45 35 45 50C45 65 55 80 70 80" stroke="#FFFFFF" stroke-width="16" stroke-linecap="round"/>
				</svg>
			</div>
			<span class="text-white font-extrabold">Soyomu Live</span>
		</a>
	</div>

	<div class="flex items-center gap-2">
		<NotificationBell />
		<div class="text-xs text-gray-500 hidden sm:block">
			{data?.profile?.name || data?.user?.email}
		</div>
	</div>
</nav>
