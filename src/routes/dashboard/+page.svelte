<script lang="ts">
	import Button from '$lib/components/ui/button.svelte';
	import Card from '$lib/components/ui/card.svelte';
	import Badge from '$lib/components/ui/badge.svelte';
	import Progress from '$lib/components/ui/progress.svelte';
	import Separator from '$lib/components/ui/separator.svelte';

	let { data } = $props();

	const wallet = $derived(data.wallet);
	const campaigns = $derived(data.campaigns || []);
	const stats = $derived(data.stats);

	const formatCurrency = (n: number) => `₦${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
	const formatNumber = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(1)}k` : n.toString();

	const activeCampaignsList = $derived(campaigns.filter((c: any) => c.status === 'active' || c.status === 'pending' || c.status === 'scheduled'));
</script>

<svelte:head>
	<title>Dashboard — Soyomu Live</title>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 bg-[#0A0A0C] text-white">
	<!-- Top Bar / Header -->
	<div class="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-[#1D1D22] pb-6">
		<div>
			<h1 class="text-3xl font-extrabold tracking-tight">Creator Overview</h1>
			<p class="text-sm text-gray-400 mt-1">Welcome back, {data.profile?.name || data.user?.email}</p>
		</div>
		
		<div class="flex items-center gap-4 w-full sm:w-auto">
			<!-- Search Bar -->
			<div class="relative flex-1 sm:flex-initial">
				<!-- Magnifying Glass (Heroicon) -->
				<svg class="absolute left-3 top-2.5 h-4.5 w-4.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.637 10.637z" />
				</svg>
				<input 
					type="text" 
					placeholder="Search..." 
					class="w-full sm:w-60 bg-[#131316] border border-[#232326] rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-[#FF2A54]/50 transition-colors"
				/>
			</div>

			<!-- User Dropdown Menu -->
			<div class="flex items-center gap-3 px-3 py-1.5 bg-[#131316] border border-[#232326] rounded-lg cursor-pointer hover:border-gray-500 transition-colors">
				<div class="w-7 h-7 rounded-full bg-[#FF2A54]/10 border border-[#FF2A54]/30 flex items-center justify-center text-[#FF2A54] text-xs font-bold font-mono">
					{data.profile?.name?.slice(0, 2).toUpperCase() || 'AS'}
				</div>
				<span class="text-sm font-semibold text-gray-200 hidden sm:inline">{data.profile?.name || 'Acme Streamers'}</span>
				<!-- Chevron Down (Heroicon) -->
				<svg class="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
				</svg>
			</div>
		</div>
	</div>

	<!-- Metrics Grid (4 Cards) -->
	<div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
		<!-- Card 1: Total Spend -->
		<Card class="relative bg-[#131316]/40 border border-[#232326] rounded-2xl p-6 min-h-[160px] flex flex-col justify-between overflow-hidden backdrop-blur-md">
			<div class="flex items-start justify-between z-10">
				<span class="text-sm text-gray-400 font-medium">Total Spend</span>
				<!-- Arrow Trending Up (Heroicon) -->
				<svg class="h-5 w-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.281m5.94 2.28l-2.28 5.941" />
				</svg>
			</div>
			
			<div class="my-auto z-10">
				<div class="flex items-center gap-2">
					<span class="text-2xl md:text-3xl font-extrabold text-white">
						{formatCurrency(stats?.totalSpend || 0)}
					</span>
					<!-- Arrow Trending Up (Heroicon) -->
					<svg class="h-4.5 w-4.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.281m5.94 2.28l-2.28 5.941" />
					</svg>
				</div>
			</div>

			<!-- Green Chart Line -->
			<div class="absolute bottom-0 left-0 right-0 h-14 overflow-hidden rounded-b-2xl pointer-events-none">
				<svg class="w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M0 35 C20 30, 40 38, 60 20 C80 5, 90 15, 100 5 L100 40 L0 40 Z" fill="url(#spend-grad)" />
					<path d="M0 35 C20 30, 40 38, 60 20 C80 5, 90 15, 100 5" stroke="#10B981" stroke-width="2" stroke-linecap="round" />
					<defs>
						<linearGradient id="spend-grad" x1="0" y1="0" x2="0" y2="1">
							<stop offset="0%" stop-color="#10B981" stop-opacity="0.15"/>
							<stop offset="100%" stop-color="#10B981" stop-opacity="0"/>
						</linearGradient>
					</defs>
				</svg>
			</div>
		</Card>

		<!-- Card 2: Active Campaigns -->
		<Card class="relative bg-[#131316]/40 border border-[#232326] rounded-2xl p-6 min-h-[160px] flex flex-col justify-between overflow-hidden backdrop-blur-md">
			<div class="flex items-start justify-between z-10">
				<span class="text-sm text-gray-400 font-medium">Active Campaigns</span>
				<div class="w-5.5 h-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center px-0.5">
					<div class="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse"></div>
				</div>
			</div>
			
			<div class="my-auto z-10">
				<span class="text-2xl md:text-3xl font-extrabold text-white">
					{stats?.activeCampaigns || 0}
				</span>
			</div>

			<!-- Bar Chart representation -->
			<div class="absolute bottom-4 left-6 right-6 h-10 flex items-end justify-between pointer-events-none opacity-40">
				<div class="w-2.5 h-4 bg-gray-700 rounded-sm"></div>
				<div class="w-2.5 h-6 bg-gray-700 rounded-sm"></div>
				<div class="w-2.5 h-5 bg-gray-700 rounded-sm"></div>
				<div class="w-2.5 h-8 bg-gray-700 rounded-sm"></div>
				<div class="w-2.5 h-3 bg-gray-700 rounded-sm"></div>
				<div class="w-2.5 h-7 bg-emerald-400 rounded-sm"></div>
				<div class="w-2.5 h-9 bg-gray-700 rounded-sm"></div>
				<div class="w-2.5 h-5 bg-gray-700 rounded-sm"></div>
			</div>
		</Card>

		<!-- Card 3: Live Viewers -->
		<Card class="relative bg-[#131316]/40 border border-[#232326] rounded-2xl p-6 min-h-[160px] flex flex-col justify-between overflow-hidden backdrop-blur-md">
			<div class="flex items-start justify-between z-10">
				<span class="text-sm text-gray-400 font-medium">Live Viewers</span>
				<span class="text-[10px] font-extrabold text-blue-400 tracking-wider uppercase flex items-center gap-1">
					<span class="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
					Live
				</span>
			</div>
			
			<div class="my-auto z-10">
				<span class="text-2xl md:text-3xl font-extrabold text-white">
					{formatNumber(stats?.totalViewersDelivered || 0)}
				</span>
			</div>

			<!-- Blue Wave Line -->
			<div class="absolute bottom-0 left-0 right-0 h-14 overflow-hidden rounded-b-2xl pointer-events-none">
				<svg class="w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M0 30 C15 35, 30 10, 45 25 C60 40, 75 15, 90 28 C95 32, 100 20, 100 20 L100 40 L0 40 Z" fill="url(#viewer-grad)" />
					<path d="M0 30 C15 35, 30 10, 45 25 C60 40, 75 15, 90 28 C95 32, 100 20, 100 20" stroke="#3B82F6" stroke-width="2" stroke-linecap="round" />
					<defs>
						<linearGradient id="viewer-grad" x1="0" y1="0" x2="0" y2="1">
							<stop offset="0%" stop-color="#3B82F6" stop-opacity="0.15"/>
							<stop offset="100%" stop-color="#3B82F6" stop-opacity="0"/>
						</linearGradient>
					</defs>
				</svg>
			</div>
		</Card>

		<!-- Card 4: Wallet Balance -->
		<Card class="relative bg-[#131316]/40 border border-[#232326] rounded-2xl p-6 min-h-[160px] flex flex-col justify-between overflow-hidden backdrop-blur-md">
			<div class="flex items-start justify-between z-10">
				<span class="text-sm text-gray-400 font-medium">Wallet Balance</span>
				<!-- Credit Card (Heroicon) -->
				<svg class="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-19.5 5.25h19.5m-19.5 0A2.25 2.25 0 006 18h12a2.25 2.25 0 002.25-2.25m-16.5 0V6a2.25 2.25 0 012.25-2.25h12A2.25 2.25 0 0121 6v8.25M2.25 9a2.25 2.25 0 012.25-2.25h12A2.25 2.25 0 0121 9v.75H2.25V9z" />
				</svg>
			</div>
			
			<div class="my-auto z-10">
				<span class="text-2xl md:text-3xl font-extrabold text-white">
					{formatCurrency(wallet?.balance || 0)}
				</span>
			</div>

			<!-- Donut Chart representation on the bottom-right -->
			<div class="absolute bottom-4 right-6 w-11 h-11 pointer-events-none">
				<svg class="w-full h-full" viewBox="0 0 36 36">
					<path class="text-gray-800" stroke="currentColor" stroke-width="4.5" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
					<path class="text-emerald-400" stroke="currentColor" stroke-width="4.5" stroke-dasharray="70, 100" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
					<path class="text-blue-500" stroke="currentColor" stroke-width="4.5" stroke-dasharray="15, 100" stroke-dashoffset="-70" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
				</svg>
			</div>
		</Card>
	</div>

	<!-- Active Campaigns Section -->
	<div class="space-y-4">
		<div class="flex items-center justify-between">
			<h2 class="text-xl font-bold tracking-tight text-white">Active Campaigns</h2>
			<a href="/campaigns/new">
				<Button class="bg-[#FF2A54] hover:bg-[#E01E43] text-white border-0 text-sm font-semibold rounded-lg flex items-center gap-2">
					<!-- Plus (Heroicon) -->
					<svg class="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
						<path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
					</svg>
					New Campaign
				</Button>
			</a>
		</div>

		{#if activeCampaignsList.length === 0}
			<div class="bg-[#131316]/30 border border-[#232326] rounded-2xl p-12 text-center">
				<p class="text-sm text-gray-400">No active, pending, or scheduled campaigns found.</p>
				<p class="text-xs text-gray-500 mt-1">Start a campaign to drive traffic to your live stream!</p>
			</div>
		{:else}
			<div class="space-y-4">
				{#each activeCampaignsList as campaign}
					<!-- Campaign Card Row -->
					<div class="bg-[#131316]/50 border border-[#232326] rounded-2xl p-5 hover:border-[#FF2A54]/20 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6">
						<!-- Stream Thumbnail & Name -->
						<div class="flex items-center gap-5">
							<!-- Custom Live Stream Mockup Thumbnail -->
							<div class="relative w-32 h-18 rounded-xl overflow-hidden bg-gradient-to-tr from-[#FF2A54]/30 to-purple-900/40 border border-[#232326] shrink-0 flex items-center justify-center">
								<!-- Live Indicator Tag -->
								{#if campaign.status === 'active'}
									<span class="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded bg-[#FF2A54] text-[8px] font-black tracking-wider text-white uppercase flex items-center gap-1">
										<span class="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
										LIVE
									</span>
								{/if}
								<!-- Play icon overlay (Heroicon Play) -->
								<div class="w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white border border-white/20">
									<svg class="w-3.5 h-3.5 fill-current ml-0.5" viewBox="0 0 24 24">
										<path d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
									</svg>
								</div>
							</div>

							<!-- Campaign Details -->
							<div class="text-left space-y-1">
								<h3 class="font-bold text-white text-base">
									@{campaign.live_url.match(/@([^/]+)/)?.[1] || 'TikTok Stream'} Live
								</h3>
								<div class="flex items-center gap-2.5">
									{#if campaign.status === 'active'}
										<span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Running</span>
									{:else if campaign.status === 'pending'}
										<span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">Pending Approval</span>
									{:else}
										<span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-gray-500/10 text-gray-400 border border-gray-500/20">Scheduled</span>
									{/if}
								</div>
							</div>
						</div>

						<!-- Progress Bar column -->
						<div class="flex-1 max-w-md w-full">
							<div class="flex justify-between text-xs text-gray-400 font-medium mb-1.5">
								<span>{campaign.status === 'active' ? 'Progress' : 'Scheduled'}</span>
								<span>
									{campaign.viewers_requested > 0 ? Math.round(((campaign.viewers_delivered || 0) / campaign.viewers_requested) * 100) : 0}%
								</span>
							</div>
							<Progress 
								value={campaign.viewers_requested > 0 ? Math.round(((campaign.viewers_delivered || 0) / campaign.viewers_requested) * 100) : 0} 
								class={campaign.status === 'active' ? '[&>div]:bg-blue-500 bg-gray-800' : '[&>div]:bg-gray-500 bg-gray-800'}
							/>
						</div>

						<!-- Budget/Spent Column -->
						<div class="text-right flex flex-col justify-center gap-0.5">
							<div class="text-sm font-semibold text-white">
								{formatCurrency(campaign.viewers_requested > 0 ? ((campaign.viewers_delivered || 0) / campaign.viewers_requested) * campaign.cost : 0)} / {formatCurrency(campaign.cost)} spent
							</div>
							<div class="text-xs text-gray-500">
								Budget
							</div>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</div>
