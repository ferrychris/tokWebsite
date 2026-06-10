<script lang="ts">
	import { signOut } from '$lib/stores/auth';
	import { sidebarCollapsed } from '$lib/stores/sidebar';
	import { page } from '$app/stores';

	let { data }: { data: App.PageData } = $props();
	let collapsed = $state(false);

	$effect(() => {
		sidebarCollapsed.set(collapsed);
	});

	const links = [
		{ href: '/dashboard', label: 'Overview' },
		{ href: '/campaigns', label: 'Campaigns' },
		{ href: '/analytics', label: 'Analytics' },
		{ href: '/wallet', label: 'Wallet' },
		{ href: '/settings', label: 'Settings' }
	];

	const isActive = (href: string) => {
		if (href === '/dashboard') {
			return $page.url.pathname === '/dashboard';
		}
		return $page.url.pathname.startsWith(href);
	};
</script>

<aside class="fixed left-0 top-0 z-40 h-screen bg-[#0D0D11] border-r border-[#1D1D22] text-[#9E9EA7] transition-all duration-200 flex flex-col {collapsed ? 'w-16' : 'w-60'}">
	<!-- Logo/Header -->
	<div class="flex h-16 items-center justify-between px-4 border-b border-[#1D1D22]">
		{#if !collapsed}
			<a href="/" class="flex items-center gap-2.5 font-bold text-white tracking-tight">
				<div class="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#1E1E24] to-[#2D2D35] flex items-center justify-center border border-[#3D3D45] shrink-0">
					<svg class="h-4.5 w-4.5" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M30 20C45 20 55 35 55 50C55 65 45 80 30 80" stroke="#FFFFFF" stroke-width="16" stroke-linecap="round"/>
						<path d="M70 20C55 20 45 35 45 50C45 65 55 80 70 80" stroke="#FFFFFF" stroke-width="16" stroke-linecap="round"/>
					</svg>
				</div>
				<span class="text-white font-extrabold text-base whitespace-nowrap">Soyomu Live</span>
			</a>
		{/if}
		<div class="flex items-center gap-1">
			<button onclick={() => collapsed = !collapsed} aria-label="Toggle sidebar" class="p-1.5 rounded-lg hover:bg-[#1D1D22] text-[#9E9EA7] hover:text-white transition-colors">
				<svg class="h-4.5 w-4.5 transition-transform {collapsed ? 'rotate-180' : ''}" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
				</svg>
			</button>
		</div>
	</div>

	<!-- Navigation -->
	<nav class="flex-1 p-3 space-y-1.5 overflow-y-auto">
		{#each links as link}
			<a
				href={link.href}
				class="flex items-center gap-3.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all {isActive(link.href) ? 'bg-[#1F1F27] text-white shadow-sm' : 'text-[#9E9EA7] hover:bg-[#1D1D22]/60 hover:text-white'}"
			>
				{#if link.label === 'Overview'}
					<!-- Squares 2x2 (Heroicon) -->
					<svg class="h-4.5 w-4.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
					</svg>
				{:else if link.label === 'Campaigns'}
					<!-- Megaphone / Speakerphone (Heroicon) -->
					<svg class="h-4.5 w-4.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M19.113 12.097A9.001 9.001 0 0112 21.75c-1.905 0-3.68-.59-5.143-1.597l2.846-2.847A5.98 5.98 0 0012 17.25c2.44 0 4.506-1.455 5.429-3.535l1.684-1.618z" />
						<path stroke-linecap="round" stroke-linejoin="round" d="M19.113 12.097c.376-.376.67-.827.87-1.325.263-.658.263-1.396 0-2.054a3.744 3.744 0 00-.87-1.325l-1.684 1.618A5.98 5.98 0 0012 6.75c-2.44 0-4.506 1.455-5.429 3.535L3.725 7.438a9.001 9.001 0 0115.388 4.659z" />
					</svg>
				{:else if link.label === 'Analytics'}
					<!-- Chart Bar (Heroicon) -->
					<svg class="h-4.5 w-4.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M3.75 3v16.5M21 19.5H3.75M6.75 12v4.5m3-7.5v7.5m3-10.5v10.5m3-6v6m3-9v9" />
					</svg>
				{:else if link.label === 'Wallet'}
					<!-- Wallet (Heroicon) -->
					<svg class="h-4.5 w-4.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3" />
					</svg>
				{:else if link.label === 'Settings'}
					<!-- Cog 6 Tooth (Heroicon) -->
					<svg class="h-4.5 w-4.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.43l-1.003.828c-.293.241-.438.613-.43 1 .006.079.01.159.01.238 0 .079-.004.159-.01.238-.008.387.137.759.43 1l1.004.829a1.125 1.125 0 01.26 1.43l-1.297 2.247a1.125 1.125 0 01-1.37.491l-1.216-.456c-.356-.133-.751-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.43l1.004-.827c.292-.24.437-.613.43-1a6.9 6.9 0 01-.01-.238c0-.079.004-.159.01-.238.008-.387-.138-.759-.43-1l-1.004-.829a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.28z" />
						<path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
					</svg>
				{/if}
				{#if !collapsed}
					<span>{link.label}</span>
				{/if}
			</a>
		{/each}

		{#if data?.profile?.role === 'admin'}
			<a
				href="/admin"
				class="flex items-center gap-3.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all {isActive('/admin') ? 'bg-[#1F1F27] text-white shadow-sm' : 'text-[#9E9EA7] hover:bg-[#1D1D22]/60 hover:text-white'}"
			>
				<!-- Shield Check (Heroicon) -->
				<svg class="h-4.5 w-4.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.249-8.25-3.286zm0 0a3.001 3.001 0 00-4.686 0A3.001 3.001 0 0012 5.464z" />
				</svg>
				{#if !collapsed}
					<span>Admin</span>
				{/if}
			</a>
		{/if}
	</nav>

	<!-- Footer / Session info -->
	<div class="p-3 border-t border-[#1D1D22]">
		{#if !collapsed}
			<div class="px-3 py-1.5 text-xs text-gray-500 truncate mb-1">
				{data?.profile?.name || data?.user?.email}
			</div>
		{/if}
		<button
			onclick={signOut}
			class="flex items-center gap-3.5 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-[#9E9EA7] hover:bg-destructive/10 hover:text-destructive transition-colors text-left"
		>
			<!-- Arrow Left On Rectangle / Logout (Heroicon) -->
			<svg class="h-4.5 w-4.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
				<path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
			</svg>
			{#if !collapsed}
				<span>Sign Out</span>
			{/if}
		</button>
	</div>
</aside>
